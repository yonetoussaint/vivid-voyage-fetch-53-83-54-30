import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Same store as in send-otp (in production, use Redis)
const otpStore = new Map();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      return new Response(
        JSON.stringify({ error: 'Valid 6-digit OTP code is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP from our store
    const storedData = otpStore.get(normalizedEmail);
    
    if (!storedData) {
      return new Response(
        JSON.stringify({ error: 'OTP not found or expired. Please request a new code.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(normalizedEmail);
      return new Response(
        JSON.stringify({ error: 'OTP has expired. Please request a new code.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if too many attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(normalizedEmail);
      return new Response(
        JSON.stringify({ error: 'Too many failed attempts. Please request a new code.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(normalizedEmail, storedData);
      
      const remainingAttempts = 3 - storedData.attempts;
      return new Response(
        JSON.stringify({ 
          error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // OTP is valid - create user session with Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Sign in or create user with password (using OTP as temporary password)
    const { data, error } = await supabaseClient.auth.signUp({
      email: normalizedEmail,
      password: otp + 'Temp123!', // Temporary password
      options: {
        data: {
          email_verified: true,
          signup_method: 'otp'
        }
      }
    });

    if (error) {
      // If user already exists, try sign in
      if (error.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: normalizedEmail,
          password: otp + 'Temp123!',
        });

        if (signInError) {
          throw new Error('Authentication failed. Please try again.');
        }

        // Clean up OTP
        otpStore.delete(normalizedEmail);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Successfully signed in',
            user: signInData.user,
            session: signInData.session,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw error;
    }

    // Clean up OTP
    otpStore.delete(normalizedEmail);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Account created and verified successfully',
        user: data.user,
        session: data.session,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Verify OTP function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});