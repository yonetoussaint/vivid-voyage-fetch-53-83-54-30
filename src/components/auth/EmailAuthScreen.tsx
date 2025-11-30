"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, HelpCircle, Mail, Loader2, UserPlus, Lock, Key } from "lucide-react"
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

// Function to extract domain from email
const extractDomain = (email: string): string => {
  if (!email.includes('@')) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '';
  const domain = parts[1].trim();
  return domain.includes('.') && domain.length > 3 ? domain : '';
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
    'zoho.com': 'https://www.zoho.com/favicon.ico',
    'yandex.com': 'https://yastatic.net/s3/home-static/_/f6/f6fa8e8f8ee6d2e5cceb8afacbcbc6d6.png',
  };

  // Return override if available, otherwise use favicon API
  return faviconOverrides[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
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
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>("unchecked")
  const [lastCheckedEmail, setLastCheckedEmail] = useState("")
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [isCreateAccountLoading, setIsCreateAccountLoading] = useState(false)
  const [isActionInProgress, setIsActionInProgress] = useState(false)
  const [fieldError, setFieldError] = useState<string>("")
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const emailInputRef = useRef<HTMLInputElement>(null)

  // Email validation
  const hasValidEmailFormat = useCallback((emailAddress: string): boolean => {
    return EMAIL_REGEX.test(emailAddress)
  }, [])

  const validateEmail = useCallback((emailAddress: string): boolean => {
    return hasValidEmailFormat(emailAddress)
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

  // Update field error based on current state
  useEffect(() => {
    if (email.length === 0) {
      setFieldError("")
    } else if (!isEmailValid) {
      setFieldError("Please enter a valid email address")
    } else if (emailCheckState === "error") {
      setFieldError("Unable to verify your account. Please try again or use verification code.")
    } else {
      setFieldError("")
    }
  }, [isEmailValid, emailCheckState, email])

  // Debounced email check
  const debouncedEmailCheck = useCallback(
    (emailToCheck: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (validateEmail(emailToCheck) && emailToCheck !== lastCheckedEmail) {
          setEmailCheckState("checking")
          try {
            const exists = await checkEmailExists(emailToCheck)
            setEmailCheckState(exists ? "exists" : "not-exists")
            setLastCheckedEmail(emailToCheck)
          } catch (error) {
            setEmailCheckState("error")
            setLastCheckedEmail(emailToCheck)
          }
        }
      }, 800)
    },
    [checkEmailExists, lastCheckedEmail, validateEmail],
  )

  // Main validation effect for email
  useEffect(() => {
    const hasValidFormat = hasValidEmailFormat(email)
    setIsEmailValid(hasValidFormat)

    if (!hasValidFormat) {
      setEmailCheckState("unchecked")
      setLastCheckedEmail("")
    } else {
      debouncedEmailCheck(email)
    }
  }, [email, debouncedEmailCheck, hasValidEmailFormat])

  // Initialize validation state
  useEffect(() => {
    if (initialEmail) {
      setIsEmailValid(validateEmail(initialEmail))
    }
  }, [initialEmail, validateEmail])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleEmailChange = (value: string) => {
    setEmail(value)
  }

  // FIXED: Corrected handleContinueWithPassword function
  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isPasswordLoading || isActionInProgress || emailCheckState !== "exists") return

    console.log('📧 EmailAuthScreen: Continue with password clicked, email:', email);

    setIsActionInProgress(true)
    setIsPasswordLoading(true)
    try {
      // Directly call the handler without delay to ensure immediate state update
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
        <div className="w-5 h-5">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-2.517-7.665c.112-.223.268-.424.488-.57C11.186 8.12 11.506 8 12 8c.384 0 .766.118 1.034.319a.95.95 0 0 1 .403.806c0 .48-.218.81-.62 1.186a9 9 0 0 1-.409.354l-.294.249c-.246.213-.524.474-.738.795l-.126.19V13.5a.75.75 0 0 0 1.5 0v-1.12c.09-.1.203-.208.347-.333.063-.055.14-.119.222-.187.166-.14.358-.3.52-.452.536-.5 1.098-1.2 1.098-2.283a2.45 2.45 0 0 0-1.003-2.006C13.37 6.695 12.658 6.5 12 6.5c-.756 0-1.373.191-1.861.517a2.94 2.94 0 0 0-.997 1.148.75.75 0 0 0 1.341.67" />
            <path
              fillRule="evenodd"
              d="M9.864 1.2a3.61 3.61 0 0 1 4.272 0l1.375 1.01c.274.2.593.333.929.384l1.686.259a3.61 3.61 0 0 1 3.021 3.02l.259 1.687c.051.336.183.655.384.929l1.01 1.375a3.61 3.61 0 0 1 0 4.272l-1.01 1.375a2.1 2.1 0 0 0-.384.929l-1.686.259a3.61 3.61 0 0 1-3.02 3.021l-1.687.259a2.1 2.1 0 0 0-.929.384z"
            />
          </svg>
        </div>
      )
    }

    if (emailCheckState === "error") {
      return (
        <div className="w-5 h-5">
          <svg className="text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
      )
    }

    return null
  }

  const renderFieldError = () => {
    if (!fieldError) return null

    return (
      <div className="flex items-start gap-2 mt-2">
        <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-red-600 text-sm">{fieldError}</p>
      </div>
    )
  }

  const renderStatusMessage = () => {
    if (emailCheckState === "not-exists") {
      return (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex-1">
            <p className="text-purple-700 text-xs">
              This email isn't registered. Click "Create Account" to continue.
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  const renderActionButtons = () => {
    // Always disabled while checking or if input is invalid
    const shouldDisableButtons = !isEmailValid || emailCheckState === "checking" || isActionInProgress

    // Account exists: Show "Continue with Password" as primary, "Use OTP" as secondary
    if (emailCheckState === "exists") {
      return (
        <div className="space-y-3 mb-8">
          {/* Primary Button - Continue with Password */}
          <button
            disabled={shouldDisableButtons}
            onClick={handleContinueWithPassword}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            {isPasswordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            <span>{isPasswordLoading ? "Loading..." : "Continue with Password"}</span>
          </button>

          {/* Secondary Link - Use OTP instead */}
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
        <div className="space-y-3 mb-8">
          {/* Primary Button - Create Account */}
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
        <div className="space-y-3 mb-8">
          {/* Primary Button - Send OTP */}
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
      <div className="space-y-3 mb-8">
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
    <div className="px-4 pb-4">
      {/* Main Content */}
      <div className="space-y-3 mb-4">
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
          {/* Inline Status Message */}
          {renderStatusMessage()}

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
                      // Fallback to mail icon if favicon fails to load
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

          {/* Single primary action button based on state */}
          {renderActionButtons()}
        </div>
      </div>

      {/* Secure Authentication Footer */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z" />
        </svg>
        <span className="text-gray-500 text-xs">Secure Authentication</span>
      </div>

      {/* Terms Footer */}
      <p className="text-gray-500 text-center text-[10px] leading-tight px-2">
        By proceeding, you confirm that you've read and agree to our{" "}
        <span className="text-red-500">Terms of Service</span> and{" "}
        <span className="text-red-500">Privacy Policy</span>
      </p>
    </div>
  )
}

export default EmailAuthScreen