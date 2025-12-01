"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, HelpCircle, Mail, Loader2, UserPlus, Lock, Key, AlertCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

// Inline type definitions
type EmailCheckState = "unchecked" | "checking" | "exists" | "not-exists" | "error"

interface EmailAuthScreenProps {
  onBack: () => void
  selectedLanguage: string
  onContinueWithPassword: (email: string) => void
  onContinueWithCode: (email: string) => void
  onCreateAccount: (email: string) => void
  onSignUpClick: () => void
  initialEmail?: string
  isCompact?: boolean
  onExpand?: () => void
  showHeader?: boolean
}

// Inline email constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Trusted email domains
const TRUSTED_DOMAINS = [
  'gmail.com',
  'googlemail.com', 
  'outlook.com',
  'hotmail.com',
  'live.com',
  'yahoo.com',
  'ymail.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'proton.me',
  'zoho.com'
]

// Domain suggestions data
const DOMAIN_SUGGESTIONS = [
  { domain: 'gmail.com', label: 'Gmail' },
  { domain: 'googlemail.com', label: 'Google Mail' },
  { domain: 'outlook.com', label: 'Outlook' },
  { domain: 'hotmail.com', label: 'Hotmail' },
  { domain: 'live.com', label: 'Live' },
  { domain: 'yahoo.com', label: 'Yahoo' },
  { domain: 'ymail.com', label: 'YMail' },
  { domain: 'aol.com', label: 'AOL' },
  { domain: 'icloud.com', label: 'iCloud' },
  { domain: 'protonmail.com', label: 'ProtonMail' },
  { domain: 'proton.me', label: 'Proton' },
  { domain: 'zoho.com', label: 'Zoho' }
]

// Function to extract domain from email
const extractDomain = (email: string): string => {
  if (!email.includes('@')) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '';
  const domain = parts[1].trim().toLowerCase();
  return domain.includes('.') && domain.length > 3 ? domain : '';
};

// Function to check if domain is trusted
const isTrustedDomain = (email: string): boolean => {
  const domain = extractDomain(email);
  return TRUSTED_DOMAINS.includes(domain);
};

// Function to get favicon URL
const getFaviconUrl = (email: string): string | null => {
  const domain = extractDomain(email);
  if (!domain) return null;

  // Common email provider favicons
  const faviconOverrides: Record<string, string> = {
    'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    'googlemail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    'outlook.com': 'https://outlook.live.com/favicon.ico',
    'hotmail.com': 'https://outlook.live.com/favicon.ico',
    'live.com': 'https://outlook.live.com/favicon.ico',
    'yahoo.com': 'https://s.yimg.com/rz/l/favicon.ico',
    'ymail.com': 'https://s.yimg.com/rz/l/favicon.ico',
    'aol.com': 'https://www.aol.com/favicon.ico',
    'icloud.com': 'https://www.icloud.com/favicon.ico',
    'protonmail.com': 'https://protonmail.com/favicon.ico',
    'proton.me': 'https://proton.me/favicon.ico',
    'zoho.com': 'https://www.zoho.com/favicon.ico'
  };

  return faviconOverrides[domain] || null;
};

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onBack,
  selectedLanguage,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
  onSignUpClick,
  initialEmail = "",
  isCompact = false,
  onExpand,
  showHeader = true,
}) => {
  const [email, setEmail] = useState(initialEmail)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isTrustedEmail, setIsTrustedEmail] = useState(false)
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>("unchecked")
  const [lastCheckedEmail, setLastCheckedEmail] = useState("")
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [isCreateAccountLoading, setIsCreateAccountLoading] = useState(false)
  const [isActionInProgress, setIsActionInProgress] = useState(false)
  const [fieldError, setFieldError] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [statusType, setStatusType] = useState<"info" | "error" | "success">("info")
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [showDifferentEmailOption, setShowDifferentEmailOption] = useState(false)
  const [hasShownUntrustedDomain, setHasShownUntrustedDomain] = useState(false)
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false)
  const [filteredDomainSuggestions, setFilteredDomainSuggestions] = useState(DOMAIN_SUGGESTions)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const [lastUserAction, setLastUserAction] = useState<'typing' | 'autofill' | 'paste' | 'click' | 'none'>('none')

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const emailInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const isInitialMount = useRef(true)
  const pasteDetectedRef = useRef(false)

  // Email validation
  const hasValidEmailFormat = useCallback((emailAddress: string): boolean => {
    return EMAIL_REGEX.test(emailAddress)
  }, [])

  const validateEmail = useCallback((emailAddress: string): boolean => {
    return hasValidEmailFormat(emailAddress) && isTrustedDomain(emailAddress)
  }, [hasValidEmailFormat])

  // Update favicon when email changes
  useEffect(() => {
    if (email && hasValidEmailFormat(email)) {
      const favicon = getFaviconUrl(email);
      setFaviconUrl(favicon);
    } else {
      setFaviconUrl(null);
    }
  }, [email, hasValidEmailFormat])

  // Filter domain suggestions based on user input
  useEffect(() => {
    if (email.includes('@')) {
      const atIndex = email.indexOf('@');
      const domainPart = email.slice(atIndex + 1).toLowerCase();
      
      if (domainPart.length > 0) {
        // Filter domains that start with what the user has typed
        const filtered = DOMAIN_SUGGESTIONS.filter(suggestion => 
          suggestion.domain.toLowerCase().startsWith(domainPart)
        );
        setFilteredDomainSuggestions(filtered);
      } else {
        // If user just typed '@', show all suggestions
        setFilteredDomainSuggestions(DOMAIN_SUGGESTIONS);
      }
    } else {
      // If no '@' yet, show all suggestions
      setFilteredDomainSuggestions(DOMAIN_SUGGESTIONS);
    }
  }, [email]);

  // CRITICAL FIX: Prevent suggestions for paste/autofill
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // If this is a paste or autofill action, immediately hide suggestions
    if ((lastUserAction === 'paste' || lastUserAction === 'autofill') && showDomainSuggestions) {
      setShowDomainSuggestions(false);
    }
  }, [email, lastUserAction, showDomainSuggestions]);

  // Show domain suggestions ONLY when user is manually typing before '@'
  useEffect(() => {
    // Don't show suggestions if this is a paste/autofill action
    if (lastUserAction === 'paste' || lastUserAction === 'autofill') {
      setShowDomainSuggestions(false);
      return;
    }

    // Only show suggestions when:
    // - User is actively typing
    // - Email doesn't contain '@' (user is still typing local part)
    // - No status messages
    // - Not in checking state
    // - There are suggestions to show
    const shouldShowSuggestions = isUserTyping && 
                                email.length > 0 && 
                                !email.includes('@') &&
                                !statusMessage && 
                                emailCheckState !== "checking" &&
                                emailCheckState !== "exists" &&
                                emailCheckState !== "not-exists" &&
                                filteredDomainSuggestions.length > 0

    setShowDomainSuggestions(shouldShowSuggestions)
  }, [email, statusMessage, emailCheckState, filteredDomainSuggestions, isUserTyping, lastUserAction])

  // API call to check if email exists
  const checkEmailExists = useCallback(async (emailToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch("https://supabase-y8ak.onrender.com/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToCheck }),
      })
      const data = await response.json()

      if (data.success) {
        return data.exists
      } else {
        throw new Error(data.message || "Failed to check email")
      }
    } catch (error) {
      console.error("Error checking email:", error)
      throw error
    }
  }, [])

  // OTP function for email
  const sendCustomOTPEmail = async (email: string) => {
    try {
      const BACKEND_URL = "https://resend-u11p.onrender.com"
      const response = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return { success: true }
    } catch (error: any) {
      console.error("Failed to send OTP:", error)
      return {
        success: false,
        error: error.message || "Failed to send verification code. Please try again.",
      }
    }
  }

  // Update validation and status messages
  useEffect(() => {
    if (email.length === 0) {
      setFieldError("")
      setStatusMessage("")
      setHasShownUntrustedDomain(false)
      setShowDifferentEmailOption(false)
      return
    }

    const hasValidFormat = hasValidEmailFormat(email)
    const trusted = isTrustedDomain(email)

    setIsEmailValid(hasValidFormat && trusted)
    setIsTrustedEmail(trusted)

    // REMOVED: Don't show "Please enter a valid email address" message
    if (!hasValidFormat) {
      setFieldError("") // No longer show this message
      setStatusMessage("")
      setHasShownUntrustedDomain(false)
    } else if (!trusted) {
      setFieldError("")
      // Only set the status message if we haven't shown it yet for this untrusted domain
      if (!hasShownUntrustedDomain) {
        setStatusMessage("We currently support Gmail, Outlook, Yahoo, iCloud, ProtonMail, and Zoho emails.")
        setStatusType("error")
        setHasShownUntrustedDomain(true)
      }
    } else {
      setFieldError("")
      setStatusMessage("")
      setHasShownUntrustedDomain(false)
    }

    // Show "different email" option when we have a definitive result
    setShowDifferentEmailOption(emailCheckState === "not-exists" || emailCheckState === "error")
  }, [email, hasValidEmailFormat, emailCheckState, hasShownUntrustedDomain])

  // Debounced email check with faster response
  const debouncedEmailCheck = useCallback(
    (emailToCheck: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Only check if email is valid and trusted
      if (!hasValidEmailFormat(emailToCheck) || !isTrustedDomain(emailToCheck)) {
        setEmailCheckState("unchecked")
        return
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (emailToCheck !== lastCheckedEmail) {
          setEmailCheckState("checking")
          try {
            const exists = await checkEmailExists(emailToCheck)
            setEmailCheckState(exists ? "exists" : "not-exists")
            setLastCheckedEmail(emailToCheck)

            // Set status message for new accounts
            if (!exists) {
              setStatusMessage("No account found with this email. You can create a new account to continue.")
              setStatusType("info")
            } else {
              setStatusMessage("")
            }
          } catch (error) {
            setEmailCheckState("error")
            setLastCheckedEmail(emailToCheck)
            setStatusMessage("We're having trouble verifying your email. You can try another method.")
            setStatusType("error")
          }
        }
      }, 300)
    },
    [checkEmailExists, lastCheckedEmail, hasValidEmailFormat],
  )

  // Main validation effect for email
  useEffect(() => {
    if (!hasValidEmailFormat(email) || !isTrustedDomain(email)) {
      setEmailCheckState("unchecked")
      setLastCheckedEmail("")
      setShowDifferentEmailOption(false)
    } else {
      debouncedEmailCheck(email)
    }
  }, [email, debouncedEmailCheck, hasValidEmailFormat])

  // Initialize validation state
  useEffect(() => {
    if (initialEmail) {
      setIsEmailValid(validateEmail(initialEmail))
      setIsTrustedEmail(isTrustedDomain(initialEmail))
      // Mark as autofill for initial email
      setLastUserAction('autofill')
    }
  }, [initialEmail, validateEmail])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleEmailChange = (value: string) => {
    setEmail(value)

    // If paste was detected, maintain paste state, otherwise it's typing
    if (!pasteDetectedRef.current) {
      setLastUserAction('typing')
      setIsUserTyping(true)
    }

    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to mark user as no longer typing after a delay
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false)
      pasteDetectedRef.current = false // Reset paste detection
    }, 300) // Reduced to 300ms for faster response

    // Only reset the untrusted domain flag if the user is starting fresh
    if (value.length === 0) {
      setHasShownUntrustedDomain(false)
      setStatusMessage("")
    }
    // Reset different email option when user starts typing again
    if (value !== email) {
      setShowDifferentEmailOption(false)
    }
  }

  // Handle paste events specifically
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    pasteDetectedRef.current = true
    setLastUserAction('paste')
    setIsUserTyping(false)
    
    // Immediately hide suggestions when paste occurs
    setShowDomainSuggestions(false)
  }

  const handleDomainSuggestionClick = (domain: string) => {
    let fullEmail = email;
    
    if (email.includes('@')) {
      // Replace everything after '@' with the selected domain
      const atIndex = email.indexOf('@');
      const localPart = email.substring(0, atIndex);
      fullEmail = `${localPart}@${domain}`;
    } else {
      // If no '@', just append the domain
      fullEmail = `${email}@${domain}`;
    }
    
    setEmail(fullEmail);
    setShowDomainSuggestions(false);
    setLastUserAction('click');
    setIsUserTyping(false);
    
    // Focus back to input and move cursor to end
    if (emailInputRef.current) {
      emailInputRef.current.focus();
      setTimeout(() => {
        if (emailInputRef.current) {
          emailInputRef.current.setSelectionRange(fullEmail.length, fullEmail.length);
        }
      }, 0);
    }
  }

  const handleUseDifferentEmail = () => {
    setEmail("")
    setEmailCheckState("unchecked")
    setLastCheckedEmail("")
    setStatusMessage("")
    setHasShownUntrustedDomain(false)
    setShowDifferentEmailOption(false)
    setLastUserAction('typing')
    setIsUserTyping(true)
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }

  // Handle autofill detection
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // If the input event happens without a corresponding change event, it's likely autofill
    const input = e.currentTarget;
    if (input.value !== email && !pasteDetectedRef.current) {
      setLastUserAction('autofill');
      setIsUserTyping(false);
    }
  }

  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isPasswordLoading || isActionInProgress || emailCheckState !== "exists") return

    console.log('📧 EmailAuthScreen: Continue with password clicked, email:', email);

    setIsActionInProgress(true)
    setIsPasswordLoading(true)
    try {
      onContinueWithPassword(email)
      console.log('✅ EmailAuthScreen: onContinueWithPassword called with:', email);
    } catch (error) {
      console.error('❌ Error in handleContinueWithPassword:', error)
      toast.error("Failed to continue with password")
    } finally {
      setIsPasswordLoading(false)
      setIsActionInProgress(false)
    }
  }

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isCodeLoading || isActionInProgress) return

    setIsActionInProgress(true)
    setIsCodeLoading(true)
    try {
      const result = await sendCustomOTPEmail(email)

      if (result.success) {
        toast.success("Verification code sent to your email")
        onContinueWithCode(email)
      } else {
        toast.error(result.error || "Failed to send verification code")
        setIsCodeLoading(false)
        setIsActionInProgress(false)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code")
      setIsCodeLoading(false)
      setIsActionInProgress(false)
    }
  }

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isCreateAccountLoading || isActionInProgress) return

    setIsActionInProgress(true)
    setIsCreateAccountLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      onCreateAccount(email)
    } finally {
      setIsCreateAccountLoading(false)
      setIsActionInProgress(false)
    }
  }

  const isLoading = isPasswordLoading || isCodeLoading || isCreateAccountLoading

  // Render functions
  const getRightSideIcon = () => {
    if (isLoading) {
      return (
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      )
    }

    // Show unsupported domain icon first
    if (hasValidEmailFormat(email) && !isTrustedEmail) {
      return (
        <XCircle className="w-5 h-5 text-orange-500" />
      )
    }

    if (emailCheckState === "checking") {
      return (
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      )
    }

    if (emailCheckState === "exists") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="#10b981"
            d="M21.672,12.954l-1.199-1.965l0.597-2.224c0.124-0.463-0.098-0.949-0.529-1.159L18.47,6.601l-0.7-2.193        c-0.146-0.457-0.596-0.746-1.072-0.689l-2.286,0.274l-1.775-1.467c-0.37-0.306-0.904-0.306-1.274,0L9.588,3.993L7.302,3.719        C6.826,3.662,6.376,3.951,6.231,4.407l-0.7,2.193L3.459,7.606C3.028,7.815,2.806,8.302,2.93,8.765l0.597,2.224l-1.199,1.965        c-0.25,0.409-0.174,0.939,0.181,1.261l1.704,1.548l0.054,2.302c0.011,0.479,0.361,0.883,0.834,0.963l2.271,0.381l1.29,1.907        c-0.269,0.397-0.782,0.548-1.222,0.359L12,20.767l2.116,0.907c0.441,0.189,0.954,0.038,1.222-0.359l1.29-1.907l2.271-0.381        c0.473-0.079,0.823-0.483,0.834-0.963l0.054-2.302l1.704-1.548C21.846,13.892,21.922,13.363,21.672,12.954z M14.948,11.682        l-2.868,3.323c-0.197,0.229-0.476,0.347-0.758,0.347c-0.215,0-0.431-0.069-0.613-0.211l-1.665-1.295        c-0.436-0.339-0.515-0.968-0.175-1.403l0,0c0.339-0.435,0.967-0.514,1.403-0.175l0.916,0.712l2.247-2.603        c0.361-0.418,0.992-0.464,1.41-0.104C15.263,10.632,15.309,11.264,14.948,11.682z"
          />
        </svg>
      )
    }

    if (emailCheckState === "not-exists") {
      return (
        <UserPlus className="w-5 h-5 text-blue-500" />
      )
    }

    if (emailCheckState === "error") {
      return (
        <AlertCircle className="w-5 h-5 text-orange-500" />
      )
    }

    return null
  }

  const renderFieldError = () => {
    if (!fieldError) return null

    return (
      <div className="flex items-start gap-2 mt-2">
        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
        <p className="text-red-600 text-sm">{fieldError}</p>
      </div>
    )
  }

  const renderStatusMessage = () => {
    if (!statusMessage) return null

    const bgColor = statusType === "error" ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"
    const textColor = statusType === "error" ? "text-orange-700" : "text-blue-700"

    return (
      <div className={`p-3 border rounded-lg ${bgColor}`}>
        <p className={`text-sm ${textColor}`}>{statusMessage}</p>
      </div>
    )
  }

  const renderDomainSuggestions = () => {
    if (!showDomainSuggestions) return null

    return (
      <div 
        className="w-full overflow-x-auto scrollbar-hide"
        style={{ 
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Mark that we're starting a scroll operation
          const element = e.currentTarget;
          element.setAttribute('data-scrolling', 'true');
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Mark that we're starting a scroll operation
          const element = e.currentTarget;
          element.setAttribute('data-scrolling', 'true');
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          // Allow the native scroll to happen
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1.5 min-w-max px-1 py-1">
          {filteredDomainSuggestions.map((suggestion) => (
            <button
              key={suggestion.domain}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDomainSuggestionClick(suggestion.domain);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex-shrink-0 px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 whitespace-nowrap select-none"
              type="button"
            >
              @{suggestion.domain}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderActionButtons = () => {
    // Disable buttons if email is invalid, not trusted, or checking
    const shouldDisableButtons = !isEmailValid || emailCheckState === "checking" || isActionInProgress

    // If email is valid format but not trusted, show disabled state with message
    if (hasValidEmailFormat(email) && !isTrustedEmail) {
      return (
        <div className="space-y-3">
          <button
            disabled={true}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            type="button"
          >
            <XCircle className="w-5 h-5" />
            <span>Email Domain Not Supported</span>
          </button>
        </div>
      )
    }

    // Account exists: Show "Continue with Password" as primary, "Use OTP" as secondary
    if (emailCheckState === "exists") {
      return (
        <div className="space-y-3">
          <button
            disabled={shouldDisableButtons}
            onClick={handleContinueWithPassword}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            {isPasswordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            <span>{isPasswordLoading ? "Loading..." : "Continue with Password"}</span>
          </button>

          <button
            onClick={handleContinueWithCode}
            disabled={isCodeLoading || isActionInProgress}
            className="w-full text-center text-red-500 hover:text-red-600 font-medium py-2 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            {isCodeLoading ? "Sending code..." : "Use one-time password instead"}
          </button>
        </div>
      )
    }

    // Account doesn't exist: Show "Create Account"
    if (emailCheckState === "not-exists") {
      return (
        <div className="space-y-3">
          <button
            disabled={shouldDisableButtons}
            onClick={handleCreateAccountClick}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            {isCreateAccountLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            <span>{isCreateAccountLoading ? "Loading..." : "Create Account"}</span>
          </button>
        </div>
      )
    }

    // Error state: Show "Send OTP" as fallback
    if (emailCheckState === "error") {
      return (
        <div className="space-y-3">
          <button
            disabled={shouldDisableButtons}
            onClick={handleContinueWithCode}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            {isCodeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
            <span>{isCodeLoading ? "Sending..." : "Send One-Time Password"}</span>
          </button>
        </div>
      )
    }

    // Default state (unchecked or checking): Show disabled primary button
    return (
      <div className="space-y-3">
        <button
          disabled={true}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          type="button"
        >
          <Lock className="w-5 h-5" />
          <span>Continue</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .no-drag {
          cursor: default !important;
          pointer-events: auto !important;
        }
        .no-drag * {
          pointer-events: auto !important;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="px-4 pb-4">
        {/* Main Content */}
        <div className="space-y-3">
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className="text-gray-900 font-semibold mb-2 text-xl">
              What's your email?
            </h1>
            <p className="text-gray-600 text-sm">
              We'll check if you already have an account.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            {/* Input Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2"></label>
              <div className="relative">
                {/* Email icon or favicon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10">
                  {faviconUrl ? (
                    <img 
                      src={faviconUrl} 
                      alt="Email provider favicon" 
                      className="w-5 h-5 rounded-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Mail className="w-full h-full text-gray-400" />
                  )}
                </div>

                {/* Status icon on the right */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">{getRightSideIcon()}</div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onPaste={handlePaste}
                  onInput={handleInput}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  ref={emailInputRef}
                  disabled={isLoading}
                  className={`relative w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-transparent disabled:opacity-50 ${
                    fieldError ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Field-level error message - directly below the input */}
              {renderFieldError()}
            </div>

            {/* Domain suggestions OR status message - they are mutually exclusive */}
            {renderDomainSuggestions()}
            {renderStatusMessage()}

            {/* Single primary action button based on state */}
            {renderActionButtons()}

            {/* Escape hatch for different email */}
            {showDifferentEmailOption && (
              <div className="text-center">
                <button
                  onClick={handleUseDifferentEmail}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  type="button"
                >
                  Use a different email address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailAuthScreen