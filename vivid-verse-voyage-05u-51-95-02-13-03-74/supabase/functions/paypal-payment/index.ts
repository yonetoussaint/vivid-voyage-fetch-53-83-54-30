
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

// Set up CORS headers for the API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Handle OPTIONS requests for CORS preflight
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
}

interface PaymentRequest {
  amount: string
  currency: string
  paymentMethod: string
  orderDetails?: {
    recipientName?: string
    recipientPhone?: string
    transferPurpose?: string
  }
  createOrder?: boolean
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

    // Get client credentials from environment variables
    const clientId = Deno.env.get("PAYPAL_CLIENT_ID")
    const clientSecret = Deno.env.get("PAYPAL_SECRET_KEY")

    if (!clientId || !clientSecret) {
      throw new Error("PayPal configuration missing")
    }

    // Get the request data
    const { amount, currency, paymentMethod, orderDetails, createOrder }: PaymentRequest = await req.json()

    // Validate the input
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!currency || (currency !== "USD" && currency !== "HTG")) {
      return new Response(
        JSON.stringify({ error: "Invalid currency" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // If this is a PayPal payment that was processed client-side, we just need to verify and save
    if (req.headers.get("x-paypal-transaction-id")) {
      const paypalTransactionId = req.headers.get("x-paypal-transaction-id")
      const paypalOrderId = req.headers.get("x-paypal-order-id")
      
      // Get the authentication token
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${auth}`
        },
        body: "grant_type=client_credentials"
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenResponse.ok) {
        console.error("Error getting PayPal access token:", tokenData)
        throw new Error("Failed to authenticate with PayPal")
      }
      
      // Verify the transaction with PayPal
      const verifyResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`
        }
      })
      
      const verifyData = await verifyResponse.json()
      
      if (!verifyResponse.ok) {
        console.error("Error verifying PayPal transaction:", verifyData)
        throw new Error("Failed to verify PayPal transaction")
      }
      
      // Save the transaction in the database
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          amount: parseFloat(amount),
          currency,
          status: "completed",
          order_id: paypalOrderId,
          payment_provider: "paypal",
          payment_token: null,
          transaction_id: paypalTransactionId,
          user_id: req.headers.get("authorization") ? req.headers.get("authorization")!.split(" ")[1] : null
        })
        .select()
        .single()
      
      if (transactionError) {
        console.error("Error saving transaction:", transactionError)
        throw new Error("Failed to save transaction")
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment verified and saved",
          transaction: transactionData
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } 
    
    // Create PayPal order if requested (for credit card payments)
    if (createOrder === true && paymentMethod === "credit-card") {
      // Get authentication token from PayPal
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${auth}`
        },
        body: "grant_type=client_credentials"
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenResponse.ok) {
        console.error("Error getting PayPal access token:", tokenData)
        throw new Error("Failed to authenticate with PayPal")
      }

      // Create a PayPal order
      const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount
              },
              description: "Money Transfer Service"
            }
          ],
          application_context: {
            return_url: `${req.headers.get("origin")}/transfer/success`,
            cancel_url: `${req.headers.get("origin")}/transfer`,
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING"
          }
        })
      })

      const orderData = await orderResponse.json()
      
      if (!orderResponse.ok) {
        console.error("Error creating PayPal order:", orderData)
        throw new Error("Failed to create PayPal order")
      }

      // Save initial pending transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          amount: parseFloat(amount),
          currency,
          status: "pending",
          order_id: orderData.id,
          payment_provider: "paypal",
          payment_token: null,
          user_id: req.headers.get("authorization") ? req.headers.get("authorization")!.split(" ")[1] : null
        })
        .select()
        .single()
      
      if (transactionError) {
        console.error("Error creating transaction:", transactionError)
        // Continue despite error to allow payment flow
      }

      // Find the approval URL to redirect the user to PayPal
      const approvalLink = orderData.links.find((link: any) => link.rel === "approve")
      
      if (!approvalLink) {
        throw new Error("PayPal approval URL not found")
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "PayPal order created",
          orderId: orderData.id,
          approvalUrl: approvalLink.href,
          transaction: transactionData || null
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // For other payment methods, we'll just create a pending transaction
    // In a real app, you'd integrate with additional payment gateways here
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        amount: parseFloat(amount),
        currency,
        status: "pending",
        order_id: `ORDER-${Date.now()}`,
        payment_provider: paymentMethod,
        user_id: req.headers.get("authorization") ? req.headers.get("authorization")!.split(" ")[1] : null
      })
      .select()
      .single()
    
    if (transactionError) {
      console.error("Error creating transaction:", transactionError)
      throw new Error("Failed to create transaction")
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Transaction created",
        transaction: transactionData,
        nextSteps: {
          action: "redirect",
          paymentMethod,
          redirectUrl: `/transfer/confirm/${transactionData.id}`
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Payment processing error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
