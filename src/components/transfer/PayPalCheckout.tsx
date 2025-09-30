import React, { useState } from "react";
import {
    PayPalScriptProvider,
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalButtons,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
} from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  transferAmount?: string;
  onFormValidation?: (isValid: boolean) => void;
  onEmailCapture?: (email: string) => void;
  onPaymentSuccess?: (orderDetails: any) => void;
  onPaymentError?: (message: string) => void;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  transferAmount,
  onFormValidation,
  onEmailCapture,
  onPaymentSuccess,
  onPaymentError
}) => {
    const [isPaying, setIsPaying] = useState(false);
    const initialOptions = {
        clientId: "AYOeyCQvilLVKJGjslZfFSi_Nkl7A6OfXNarj5lS55iUcQXMhpp3AypVjAVkS_qvPcO5D415b9SnBFuN",
        "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons,card-fields",
        "data-sdk-integration-source": "developer-studio",
    };

    const [billingAddress, setBillingAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        adminArea1: "",
        adminArea2: "",
        countryCode: "",
        postalCode: "",
    });

    function handleBillingAddressChange(field, value) {
        setBillingAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function createOrder() {
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: transferAmount || "100.00",
                    currency: "USD"
                }),
            });

            const orderData = await response.json();

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            onPaymentError?.(`Could not initiate PayPal Checkout...${error}`);
            return `Could not initiate PayPal Checkout...${error}`;
        }
    }

    async function onApprove(data: any, actions?: any) {
        try {
            const response = await fetch(`/api/orders/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const orderData = await response.json();
            const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            const errorDetail = orderData?.details?.[0];

            if (errorDetail || !transaction || transaction.status === "DECLINED") {
                let errorMessage;
                if (transaction) {
                    errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
                } else if (errorDetail) {
                    errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
                } else {
                    errorMessage = JSON.stringify(orderData);
                }

                throw new Error(errorMessage);
            } else {
                console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
                setIsPaying(false); // Reset paying state on success
                
                // Dispatch payment success event for the parent component
                const paymentSuccessEvent = new CustomEvent('paymentSuccess', {
                    detail: { orderDetails: orderData }
                });
                window.dispatchEvent(paymentSuccessEvent);
                
                onPaymentSuccess?.(orderData);
            }
        } catch (error) {
            console.error("Payment capture error:", error);
            setIsPaying(false); // Reset paying state on error
            
            // Dispatch payment error event
            const paymentErrorEvent = new CustomEvent('paymentError', {
                detail: { message: error.toString() }
            });
            window.dispatchEvent(paymentErrorEvent);
            
            onPaymentError?.(`Sorry, your transaction could not be processed...${error}`);
        }
    }

    function onError(error) {
        console.error("PayPal error:", error);
        onPaymentError?.("An error occurred with PayPal. Please try again.");
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>PayPal Checkout</h2>
            
            <PayPalScriptProvider options={initialOptions}>
                {/* PayPal Buttons */}
                <div style={{ marginBottom: "30px" }}>
                    <h3>Pay with PayPal</h3>
                    <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{
                            shape: "rect",
                            layout: "vertical",
                            color: "gold",
                            label: "paypal",
                        }}
                    />
                </div>

                {/* Credit Card Fields */}
                <div>
                    <h3>Pay with Credit Card</h3>
                    <PayPalCardFieldsProvider
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{
                            input: {
                                "font-size": "16px",
                                "font-family": "courier, monospace",
                                "font-weight": "lighter",
                                color: "#333",
                                padding: "10px",
                            },
                            ".invalid": { 
                                color: "red"
                            },
                        }}
                    >
                        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                            <PayPalNameField
                                style={{
                                    input: { color: "#333", padding: "10px" },
                                    ".invalid": { color: "red" },
                                }}
                            />
                            <PayPalNumberField />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <PayPalExpiryField />
                                <PayPalCVVField />
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                            <h4>Billing Address</h4>
                            <input
                                type="text"
                                placeholder="Address line 1"
                                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                onChange={(e) => handleBillingAddressChange("addressLine1", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Address line 2 (optional)"
                                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                onChange={(e) => handleBillingAddressChange("addressLine2", e.target.value)}
                            />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="City"
                                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                    onChange={(e) => handleBillingAddressChange("adminArea2", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="State/Province"
                                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                    onChange={(e) => handleBillingAddressChange("adminArea1", e.target.value)}
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Country Code (US)"
                                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                    onChange={(e) => handleBillingAddressChange("countryCode", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Postal/Zip Code"
                                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                    onChange={(e) => handleBillingAddressChange("postalCode", e.target.value)}
                                />
                            </div>
                        </div>

                        <SubmitPayment
                            isPaying={isPaying}
                            setIsPaying={setIsPaying}
                            billingAddress={billingAddress}
                        />
                    </PayPalCardFieldsProvider>
                </div>
            </PayPalScriptProvider>
        </div>
    );
};

const SubmitPayment = ({ isPaying, setIsPaying, billingAddress }) => {
    const { cardFieldsForm } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            const childErrorMessage =
                "Unable to find any child components in the <PayPalCardFieldsProvider />";
            throw new Error(childErrorMessage);
        }
        
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid");
        }
        
        setIsPaying(true);

        cardFieldsForm.submit()
            .then(() => {
                // Payment submitted successfully, but we'll wait for onApprove to reset isPaying
                console.log("Payment form submitted successfully");
            })
            .catch((err) => {
                console.error("Payment submission error:", err);
                setIsPaying(false);
                alert("Payment failed. Please try again.");
            });
    };

    return (
        <button
            style={{
                backgroundColor: isPaying ? "#ccc" : "#0070f3",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                cursor: isPaying ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "100%",
            }}
            onClick={handleClick}
            disabled={isPaying}
        >
            {isPaying ? "Processing..." : "Pay Now"}
        </button>
    );
};

export default PayPalCheckout;