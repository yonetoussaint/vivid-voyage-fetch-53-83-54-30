
import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../auth-sdk/contexts/AuthContext';
import { Mail } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../auth-sdk/constants/email';

interface PayPalCheckoutFormProps {
  transferAmount: string;
  onFormValidation?: (isValid: boolean) => void;
  onEmailCapture?: (email: string) => void;
  onPaymentSuccess?: (orderDetails: any) => void;
  onPaymentError?: (message: string) => void;
}

const PayPalCheckoutForm: React.FC<PayPalCheckoutFormProps> = ({
  transferAmount,
  onFormValidation,
  onEmailCapture,
  onPaymentSuccess,
  onPaymentError
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const { user } = useAuth();

  // Helper functions for email provider favicon
  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const getFaviconUrl = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      return FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
    }
    return null;
  };

  const userEmail = user?.email || '';
  const faviconUrl = getFaviconUrl(userEmail);

  useEffect(() => {
    // Only initialize once when the component mounts and transferAmount is available
    if (paypalContainerRef.current && transferAmount && !isInitialized) {
      console.log('Initializing PayPal form for amount:', transferAmount);
      setIsInitialized(true);
      
      // Clear any existing content
      const container = paypalContainerRef.current;

      // Add PayPal checkout styles - COMPACT VERSION
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        :root {
          --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --bg-secondary: #1e1b2e;
          --bg-card: #ffffff;
          --bg-glass: rgba(255, 255, 255, 0.95);
          --text-primary: #1a1d29;
          --text-secondary: #6b7394;
          --text-muted: #9ca3c4;
          --accent-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --accent-secondary: #667eea;
          --border: #e2e8f0;
          --border-focus: #667eea;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --success: #10b981;
          --success-bg: #d1fae5;
          --error: #ef4444;
          --error-bg: #fee2e2;
          --border-radius-sm: 8px;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkout-container {
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          position: relative;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.375rem;
        }

        .form-input, .form-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-sm);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: inherit;
          font-weight: 500;
          transition: var(--transition);
          box-shadow: none;
        }

        .form-input:focus, .form-field:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .card-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-row {
          display: flex;
          gap: 0.5rem;
        }

        .card-row .card-field {
          flex: 1;
        }

        .card-field {
          padding: 0.75rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
          min-height: 48px;
          display: flex;
          align-items: center;
          width: 100%;
          box-shadow: none;
        }

        .card-field:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .card-field iframe {
          border: none !important;
          outline: none !important;
          width: 100% !important;
          height: 20px !important;
        }

        .pay-button {
          display: none !important;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-sm);
          margin-bottom: 1rem;
          font-size: 0.85rem;
          font-weight: 500;
          border: none;
        }

        .alert-success {
          background: var(--success-bg);
          color: var(--success);
        }

        .alert-error {
          background: var(--error-bg);
          color: var(--error);
        }

        .alert-close {
          position: absolute;
          top: 0.5rem;
          right: 0.75rem;
          background: none;
          border: none;
          color: inherit;
          font-size: 1.1rem;
          cursor: pointer;
          opacity: 0.7;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 0 auto;
        }

        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .skeleton-card-row {
          display: flex;
          gap: 0.5rem;
        }

        .skeleton-card-row .skeleton-shimmer {
          flex: 1;
        }

        .hide {
          display: none !important;
        }

        .security-info {
          text-align: center;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
          padding: 0.375rem 0.75rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 50px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .security-icon {
          width: 14px;
          height: 14px;
          color: var(--success);
        }

        .email-display {
          padding: 1rem;
          background: #f9fafb;
          border-radius: var(--border-radius-sm);
          margin-bottom: 1rem;
        }

        .email-display-content {
          display: flex;
          align-items: center;
          justify-between;
        }

        .email-display-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .email-display-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .email-display-text {
          color: #374151;
          font-weight: 500;
        }

        .email-change-button {
          color: #ef4444;
          font-weight: 500;
          font-size: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .email-change-button:hover {
          color: #dc2626;
        }
      `;
      document.head.appendChild(styleElement);

      // Create the checkout HTML structure - COMPACT VERSION
      const checkoutHTML = `
        <div class="checkout-container">
          <div id="alerts"></div>
          
          <div id="loading" class="loading-container">
            <div class="skeleton-form">
              <div class="form-group">
                <div class="skeleton-shimmer h-3 w-20 mb-1 rounded"></div>
                <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
              </div>

              <div class="form-group">
                <div class="skeleton-shimmer h-3 w-28 mb-1 rounded"></div>
                <div class="space-y-2">
                  <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
                  <div class="skeleton-card-row">
                    <div class="skeleton-shimmer h-10 rounded-lg"></div>
                    <div class="skeleton-shimmer h-10 rounded-lg"></div>
                  </div>
                </div>
              </div>

              <div class="skeleton-shimmer h-10 w-full rounded-lg mt-3"></div>

              <div class="mt-6 text-center">
                <div class="skeleton-shimmer h-6 w-28 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>

          <div id="content" class="hide">
            <form id="card-form" class="payment-form">
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <div id="email-display" class="email-display" style="display: none;">
                  <div class="email-display-content">
                    <div class="email-display-left">
                      <div class="email-display-icon">
                        <img id="email-favicon" src="" alt="Email provider favicon" class="w-full h-full object-contain" style="display: none;" />
                        <svg id="email-default-icon" class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <span id="email-text" class="email-display-text"></span>
                    </div>
                    <button type="button" id="email-change-btn" class="email-change-button">Change</button>
                  </div>
                </div>
                <input type="email" id="email" class="form-input" placeholder="your@email.com" required />
              </div>

              <div class="form-group">
                <label class="form-label">Card Information</label>
                <div class="card-group">
                  <div class="card-field" id="card-number"></div>
                  <div class="card-row">
                    <div class="card-field" id="expiration-date"></div>
                    <div class="card-field" id="cvv"></div>
                  </div>
                </div>
              </div>
            </form>

            <div class="security-info">
              <div class="security-badge">
                <svg class="security-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                Secured by PayPal
              </div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = checkoutHTML;

      // Add PayPal integration script with proper scoping
      const script = document.createElement('script');
      script.innerHTML = `
        (function() {
          // Scoped variables to prevent redeclaration
          let current_customer_id;
          let order_id;
          let currentPrice = null;
          let paypal_hosted_fields = null;

          const API_BASE_URL = "https://paypal-with-nodejs.onrender.com";
          const paypal_sdk_url = "https://www.paypal.com/sdk/js";
          const client_id = "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj";
          const currency = "USD";
          const intent = "capture";

          const validatePaymentForm = () => {
            const emailInput = document.getElementById("email");
            const cardNumberField = document.getElementById("card-number");
            const expirationField = document.getElementById("expiration-date");
            const cvvField = document.getElementById("cvv");
            
            const isEmailValid = emailInput && emailInput.value && emailInput.value.includes('@');
            const hasCardFields = cardNumberField && expirationField && cvvField;
            
            if (emailInput && emailInput.value && ${onEmailCapture ? 'true' : 'false'}) {
              window.dispatchEvent(new CustomEvent('emailCaptured', {
                detail: { email: emailInput.value }
              }));
            }
            
            const validationEvent = new CustomEvent('paymentFormValidation', {
              detail: { isValid: isEmailValid && hasCardFields }
            });
            window.dispatchEvent(validationEvent);
          };

          const addFormValidationListeners = () => {
            const emailInput = document.getElementById("email");
            if (emailInput) {
              emailInput.addEventListener('input', validatePaymentForm);
              emailInput.addEventListener('blur', validatePaymentForm);
            }
            
            setTimeout(validatePaymentForm, 100);
          };

          let reset_purchase_button = () => {
              const btn = document.querySelector("#card-form").querySelector("button[type='submit']");
              if (btn) {
                btn.removeAttribute("disabled");
                const buttonText = currentPrice ? \`Pay \${currentPrice.display}\` : "Pay Now";
                btn.textContent = buttonText;
              }
          }

          const is_user_logged_in = () => {
            return new Promise((resolve) => {
              current_customer_id = "";
              resolve();
            });
          }

          const get_client_token = () => {
            return new Promise(async (resolve, reject) => {
              try {
                const response = await fetch(\`\${API_BASE_URL}/get_client_token\`, {
                  method: "POST", 
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ "customer_id": current_customer_id }),
                });

                const client_token = await response.text();
                resolve(client_token);
              } catch (error) {
                reject(error);
              }
            });
          }

          let handle_click = (event) => {
              if (event.target.classList.contains("alert-close")) {
                  event.target.closest(".alert").remove();
              }
          }

          document.addEventListener("click", handle_click);

          let display_error_alert = (message = "An error occurred. Please try again.") => {
              const alertsContainer = document.getElementById("alerts");
              if (alertsContainer) {
                alertsContainer.innerHTML = \`<div class="alert alert-error"><button class="alert-close">×</button>\${message}</div>\`;
              }
              
              const errorEvent = new CustomEvent('paymentError', {
                detail: { message: message }
              });
              window.dispatchEvent(errorEvent);
          }

          let display_success_message = (order_details) => {
              const alertsContainer = document.getElementById("alerts");
              if (alertsContainer) {
                alertsContainer.innerHTML = \`<div class='alert alert-success'>Payment successful! Your transfer has been initiated.</div>\`;
              }

              const cardForm = document.getElementById("card-form");
              if (cardForm) {
                cardForm.classList.add("hide");
              }

              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('paymentSuccess', { 
                  detail: { orderDetails: order_details } 
                }));
              }, 2000);
          }

          is_user_logged_in()
          .then(() => {
              return fetchCurrentPrice();
          })
          .then((priceData) => {
              return get_client_token();
          })
          .then((client_token) => {
              return script_to_head({
                  "src": paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent + "&components=hosted-fields", 
                  "data-client-token": client_token
              });
          })
          .then(() => {
              const loadingElement = document.getElementById("loading");
              const contentElement = document.getElementById("content");
              
              if (loadingElement) loadingElement.classList.add("hide");
              if (contentElement) contentElement.classList.remove("hide");

              if (window.paypal && window.paypal.HostedFields.isEligible()) {
                  paypal_hosted_fields = window.paypal.HostedFields.render({
                    createOrder: () => {
                      return fetch(\`\${API_BASE_URL}/create_order\`, {
                          method: "post", 
                          headers: { "Content-Type": "application/json; charset=utf-8" },
                          body: JSON.stringify({ 
                              "intent": intent,
                              "amount": currentPrice ? currentPrice.value : null
                          })
                      })
                      .then((response) => response.json())
                      .then((order) => { 
                          order_id = order.id; 
                          return order.id; 
                      });
                    },
                    styles: {
                      'input': {
                          'font-size': '14px',
                          'color': '#1a1a21',
                          'font-family': 'Inter, sans-serif',
                          'font-weight': '400'
                      },
                      ':focus': { 'color': '#1a1a21' },
                      '.valid': { 'color': '#1a1a21' },
                      '.invalid': { 'color': '#dc2626' }
                    },
                    fields: {
                      number: { selector: "#card-number", placeholder: "1234 1234 1234 1234" },
                      cvv: { selector: "#cvv", placeholder: "CVC" },
                      expirationDate: { selector: "#expiration-date", placeholder: "MM / YY" }
                    }
                  }).then((card_fields) => {
                    setTimeout(addFormValidationListeners, 500);
                    
                    card_fields.on('validityChange', validatePaymentForm);
                    card_fields.on('inputSubmitRequest', validatePaymentForm);
                    
                    const cardForm = document.querySelector("#card-form");
                    if (cardForm) {
                      cardForm.addEventListener("submit", (event) => {
                        event.preventDefault();

                        const submitBtn = cardForm.querySelector("button[type='submit']");
                        if (submitBtn) {
                          submitBtn.setAttribute("disabled", "");
                          submitBtn.textContent = "Processing...";
                        }

                        card_fields.submit({
                            cardholderName: "Transfer Customer",
                            billingAddress: {
                              streetAddress: "123 Springfield Rd",
                              extendedAddress: "",
                              region: "AZ",
                              locality: "CHANDLER",
                              postalCode: "85224",
                              countryCodeAlpha2: "US",
                            },
                          })
                          .then(() => {
                            const emailInput = document.getElementById("email");
                            return fetch(\`\${API_BASE_URL}/complete_order\`, {
                                method: "post", 
                                headers: { "Content-Type": "application/json; charset=utf-8" },
                                body: JSON.stringify({
                                    "intent": intent,
                                    "order_id": order_id,
                                    "email": emailInput ? emailInput.value : ""
                                })
                            })
                            .then((response) => response.json())
                            .then((order_details) => {
                                console.log('PayPal order completed:', order_details);
                                display_success_message(order_details);
                             })
                             .catch((error) => {
                                console.error('PayPal order completion error:', error);
                                display_error_alert("Payment processing failed. Please try again.");
                                reset_purchase_button();
                             });
                          })
                          .catch((err) => {
                            console.error('PayPal card submission error:', err);
                            reset_purchase_button();
                            display_error_alert("Card validation failed. Please check your information.");
                          });
                      });
                    }
                  });
                } else {
                  display_error_alert("Card payments are not supported in this browser.");
                }
          })
          .catch((error) => {
              console.error('PayPal initialization error:', error);
              reset_purchase_button();
              display_error_alert("Failed to initialize payment system. Please refresh the page.");
          });

          function fetchCurrentPrice() {
            const priceData = {
              value: "${transferAmount}",
              display: "$" + parseFloat("${transferAmount}").toFixed(2),
              currency: "USD"
            };
            currentPrice = priceData;
            const submitBtn = document.querySelector('.pay-button');
            if (submitBtn) {
              submitBtn.textContent = \`Pay \${priceData.display}\`;
            }
            return Promise.resolve(priceData);
          }

          function script_to_head(attributes_object) {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              for (const name of Object.keys(attributes_object)) {
                script.setAttribute(name, attributes_object[name]);
              }
              document.head.appendChild(script);
              script.addEventListener('load', resolve);
              script.addEventListener('error', reject);
            });
          }
        })();
      `;

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    }
  }, [transferAmount]); // Only depend on transferAmount for initialization

  // Separate useEffect for handling callback prop changes without recreating the form
  useEffect(() => {
    // Set up event listeners for the callbacks without recreating the form
    const handleFormValidation = (event: any) => {
      if (onFormValidation) {
        onFormValidation(event.detail.isValid);
      }
    };

    const handleEmailCapture = (event: any) => {
      if (onEmailCapture) {
        onEmailCapture(event.detail.email);
      }
    };

    const handlePaymentSuccess = (event: any) => {
      if (onPaymentSuccess) {
        onPaymentSuccess(event.detail.orderDetails);
      }
    };

    const handlePaymentError = (event: any) => {
      if (onPaymentError) {
        onPaymentError(event.detail.message);
      }
    };

    window.addEventListener('paymentFormValidation', handleFormValidation);
    window.addEventListener('emailCaptured', handleEmailCapture);
    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    window.addEventListener('paymentError', handlePaymentError);

    return () => {
      window.removeEventListener('paymentFormValidation', handleFormValidation);
      window.removeEventListener('emailCaptured', handleEmailCapture);
      window.removeEventListener('paymentSuccess', handlePaymentSuccess);
      window.removeEventListener('paymentError', handlePaymentError);
    };
  }, [onFormValidation, onEmailCapture, onPaymentSuccess, onPaymentError]);

  // Handle auto-populating the email field and managing email display
  useEffect(() => {
    if (!isInitialized) return;

    const setupEmailDisplay = () => {
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const emailDisplay = document.getElementById("email-display");
      const emailText = document.getElementById("email-text");
      const emailFavicon = document.getElementById("email-favicon") as HTMLImageElement;
      const emailDefaultIcon = document.getElementById("email-default-icon");
      const emailChangeBtn = document.getElementById("email-change-btn");

      if (!emailInput || !emailDisplay || !emailText || !emailChangeBtn) return;

      // Auto-populate email if user is authenticated
      if (userEmail) {
        emailInput.value = userEmail;
        emailText.textContent = userEmail;
        
        // Set up favicon
        if (faviconUrl && emailFavicon && emailDefaultIcon) {
          emailFavicon.src = faviconUrl;
          emailFavicon.style.display = 'block';
          emailDefaultIcon.style.display = 'none';
          
          emailFavicon.onerror = () => {
            emailFavicon.style.display = 'none';
            emailDefaultIcon.style.display = 'block';
          };
        }

        // Show email display, hide input initially
        emailDisplay.style.display = 'block';
        emailInput.style.display = 'none';
        setShowEmailInput(false);

        // Handle change button click
        const handleChangeEmail = () => {
          emailDisplay.style.display = 'none';
          emailInput.style.display = 'block';
          emailInput.focus();
          setShowEmailInput(true);
        };

        emailChangeBtn.addEventListener('click', handleChangeEmail);

        // Handle input blur to go back to display mode if email is valid
        const handleEmailBlur = () => {
          if (emailInput.value && emailInput.value.includes('@')) {
            emailText.textContent = emailInput.value;
            
            // Update favicon for new email
            const newFaviconUrl = getFaviconUrl(emailInput.value);
            if (newFaviconUrl && emailFavicon && emailDefaultIcon) {
              emailFavicon.src = newFaviconUrl;
              emailFavicon.style.display = 'block';
              emailDefaultIcon.style.display = 'none';
              
              emailFavicon.onerror = () => {
                emailFavicon.style.display = 'none';
                emailDefaultIcon.style.display = 'block';
              };
            } else if (emailDefaultIcon) {
              if (emailFavicon) emailFavicon.style.display = 'none';
              emailDefaultIcon.style.display = 'block';
            }

            emailDisplay.style.display = 'block';
            emailInput.style.display = 'none';
            setShowEmailInput(false);
          }
        };

        emailInput.addEventListener('blur', handleEmailBlur);

        // Handle Enter key to confirm email
        const handleEmailKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            emailInput.blur();
          }
        };

        emailInput.addEventListener('keydown', handleEmailKeyDown);

        // Trigger email capture callback
        if (onEmailCapture) {
          onEmailCapture(userEmail);
        }

        return () => {
          emailChangeBtn.removeEventListener('click', handleChangeEmail);
          emailInput.removeEventListener('blur', handleEmailBlur);
          emailInput.removeEventListener('keydown', handleEmailKeyDown);
        };
      } else {
        // No authenticated user, show regular input
        emailDisplay.style.display = 'none';
        emailInput.style.display = 'block';
        setShowEmailInput(true);
      }
    };

    // Wait a bit for the DOM to be ready
    const timer = setTimeout(setupEmailDisplay, 600);
    
    return () => clearTimeout(timer);
  }, [isInitialized, userEmail, faviconUrl, onEmailCapture, getFaviconUrl]);

  return <div ref={paypalContainerRef}></div>;
};

export default PayPalCheckoutForm;
