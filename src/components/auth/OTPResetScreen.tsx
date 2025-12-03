"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Key, HelpCircle, Mail, Loader2, Edit } from "lucide-react"
const FAVICON_OVERRIDES: Record<string, string> = {
  "gmail.com": "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
  "outlook.com": "https://outlook.live.com/favicon.ico",
  "hotmail.com": "https://outlook.live.com/favicon.ico",
  "yahoo.com": "https://s.yimg.com/rz/l/favicon.ico",
  "icloud.com": "https://www.icloud.com/favicon.ico",
  "me.com": "https://www.icloud.com/favicon.ico",
}
import { useAuth } from "@/contexts/auth/AuthContext"

interface OTPResetScreenProps {
  email: string
  onBack: () => void
  onOTPVerified: (email: string, otp: string) => void
  isCompact?: boolean
  onExpand?: () => void
}

const OTPResetScreen: React.FC<OTPResetScreenProps> = ({
  email,
  onBack,
  onOTPVerified,
  isCompact = false,
  onExpand,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [shakeError, setShakeError] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(600) // 10 minutes in seconds
  const [showHelp, setShowHelp] = useState(false)
  const [validationErrors, setValidationErrors] = useState<boolean[]>([false, false, false, false, false, false])
  const { handleOTPSignIn } = useAuth()

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry > 0) {
      const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpExpiry])

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes("@")) return ""
    const parts = emailValue.split("@")
    if (parts.length !== 2) return ""
    const domain = parts[1].trim()
    return domain.includes(".") && domain.length > 3 ? domain : ""
  }

  const updateFavicon = (emailValue: string) => {
    const domain = extractDomain(emailValue)
    if (domain) {
      const url = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`
      return { url, show: true, domain }
    }
    return { url: "", show: false, domain: "" }
  }

  const { url: faviconUrl, show: showFavicon } = updateFavicon(email)

  // Check server health
  const checkServerHealth = async () => {
    try {
      const response = await fetch("https://resend-u11p.onrender.com/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Server health check failed:", error)
      return false
    }
  }

  // OTP functions with better error handling
  const verifyCustomOTP = async (email: string, otp: string) => {
    console.log("🔐 Frontend OTP Verification:", { email, otp })

    // Check server health first
    const isServerHealthy = await checkServerHealth()
    if (!isServerHealthy) {
      throw new Error("Server is currently unavailable. Please try again in a few moments.")
    }

    try {
      const BACKEND_URL = "https://resend-u11p.onrender.com"
      const response = await fetch(`${BACKEND_URL}/api/verify-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      console.log("📡 Backend Response Status:", response.status)

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorResult = await response.json()
          errorMessage = errorResult.error || errorMessage
        } catch (e) {
          const text = await response.text()
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("📡 Backend Response Data:", result)

      return {
        success: true,
        purpose: result.purpose,
        message: result.message,
      }
    } catch (error: any) {
      console.error("❌ OTP Verification Failed:", error)

      if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const resendOTPEmail = async (email: string, purpose = "password_reset") => {
    // Check server health first
    const isServerHealthy = await checkServerHealth()
    if (!isServerHealthy) {
      throw new Error("Server is currently unavailable. Please try again in a few moments.")
    }

    try {
      const BACKEND_URL = "https://resend-u11p.onrender.com"
      const endpoint = purpose === "password_reset" ? "/api/send-reset-otp" : "/api/resend-otp"

      console.log("🔄 Resending OTP:", { email, purpose, endpoint })

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, purpose }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to resend verification code"
        try {
          const errorResult = await response.json()
          errorMessage = errorResult.error || errorMessage
        } catch (e) {
          const text = await response.text()
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("📡 Resend Response:", result)

      return { success: true }
    } catch (error: any) {
      console.error("Failed to resend OTP:", error)

      if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")
    setShakeError(false)
    setValidationErrors([false, false, false, false, false, false])

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // REMOVED: Auto-submit when typing manually - only paste will auto-submit
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      setError("")
      setShakeError(false)
      setValidationErrors([false, false, false, false, false, false])
      inputRefs.current[5]?.focus()

      // Auto-submit only on paste
      handleVerifyOTP(pastedData)
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const pastedData = text.replace(/\D/g, "").slice(0, 6)

      if (pastedData.length === 6) {
        const newOtp = pastedData.split("")
        setOtp(newOtp)
        setError("")
        setShakeError(false)
        setValidationErrors([false, false, false, false, false, false])
        inputRefs.current[5]?.focus()

        // Auto-submit only on paste
        handleVerifyOTP(pastedData)
      } else {
        setError("Invalid code format. Please enter a 6-digit code.")
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)
      setError("Unable to access clipboard. Please paste manually or type the code.")
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join("")
    if (codeToVerify.length !== 6 || isVerifying) return

    setIsVerifying(true)
    setError("")
    setShakeError(false)

    try {
      const result = await verifyCustomOTP(email, codeToVerify)

      if (result.success) {
        // All digits correct - make them all green
        setValidationErrors([false, false, false, false, false, false])

        // Optional: Brief delay to show green state before proceeding
        setTimeout(() => {
          onOTPVerified(email, codeToVerify)
        }, 300)
      } else {
        // All digits wrong - shake and make red
        const errorMsg = result.error || "Invalid verification code"
        setError(errorMsg)
        setShakeError(true)
        setValidationErrors([true, true, true, true, true, true])

        // Reset after shake animation but DON'T clear OTP - let user correct it
        setTimeout(() => {
          setShakeError(false)
          setValidationErrors([false, false, false, false, false, false])
          inputRefs.current[0]?.focus()
        }, 650)
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error)
      let errorMsg = "Verification failed. Please try again."

      if (error.message.includes("Network")) {
        errorMsg = "Network error. Check your connection and try again."
      } else if (error.message.includes("expired")) {
        errorMsg = "Code has expired. Please request a new one."
      } else if (error.message.includes("Invalid")) {
        errorMsg = "Invalid code. Please check and try again."
      }

      setError(errorMsg)
      setShakeError(true)
      setValidationErrors([true, true, true, true, true, true])

      // Reset after shake animation but DON'T clear OTP on network errors
      setTimeout(() => {
        setShakeError(false)
        setValidationErrors([false, false, false, false, false, false])
      }, 650)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return

    setIsResending(true)
    setError("")
    setShakeError(false)

    try {
      const result = await resendOTPEmail(email, "password_reset")

      if (result.success) {
        setResendCooldown(60)
        setOtpExpiry(600) // Reset expiry timer
        setOtp(["", "", "", "", "", ""])
        setValidationErrors([false, false, false, false, false, false])
        inputRefs.current[0]?.focus()
        setError("") // Clear any previous errors
      } else {
        setError(result.error || "Failed to resend code. Please try again.")
      }
    } catch (error: any) {
      console.error("Error resending code:", error)
      setError(error.message || "Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .shake { animation: shake 0.65s; }
        .scale-in { animation: scaleIn 0.3s ease-out; }
      `}</style>
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isVerifying || isResending}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">Enter Reset Code</h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert("Need help? Contact support@mimaht.com")}
            type="button"
            disabled={isVerifying || isResending}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? "text-xl" : "text-2xl"}`}>
              Enter reset code
            </h1>
            <p className={`text-gray-600 ${isCompact ? "text-sm" : "text-base"}`}>
              We sent a 6-digit password reset code to your email address
            </p>
          </div>

          {/* Email Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? "mb-3" : "mb-4"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  {faviconUrl ? (
                    <img
                      src={faviconUrl || "/placeholder.svg"}
                      alt="Email provider"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E"
                      }}
                    />
                  ) : (
                    <Mail className="w-full h-full text-gray-400" />
                  )}
                </div>
                <span className={`text-gray-700 font-medium ${isCompact ? "text-sm" : "text-base"}`}>{email}</span>
              </div>
              <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={isVerifying || isResending}
                aria-label="Change email"
                title="Change email"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 border rounded-lg transition-all duration-300 ${isCompact ? "mb-3" : "mb-4"} ${
              error.includes("Opening") || error.includes("Please check") 
                ? "border-blue-200 bg-blue-50 text-blue-700" 
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={error.includes("Opening") || error.includes("Please check") 
                      ? "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className={`font-medium ${isCompact ? "text-xs" : "text-sm"}`}>{error}</p>
                  {error.includes("expired") && (
                    <p className={`mt-1 text-red-600 ${isCompact ? "text-xs" : "text-sm"}`}>
                      Click "Resend reset code" below to get a new code.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Code Input */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            <div>
              {/* Clean minimal version - Paste & Timer combined */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <button
                  onClick={handlePasteFromClipboard}
                  className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  disabled={isVerifying || isResending}
                >
                  Paste code
                </button>
                <span className="text-gray-300">|</span>
                <span>Expires in {formatTime(otpExpiry)}</span>
              </div>

              <div className={`flex gap-2 justify-between ${shakeError ? "shake" : ""}`}>
                {otp.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isVerifying || isResending}
                      className={`text-center font-semibold border-2 rounded-lg outline-none transition-all duration-200 ${
                        digit ? "scale-in" : ""
                      } ${
                        validationErrors[index]
                          ? "border-red-500 bg-red-50"
                          : digit && otp.every((d) => d !== "") && !validationErrors.some((e) => e)
                            ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                            : "border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      } ${isVerifying || isResending ? "bg-gray-100" : digit && !validationErrors[index] && otp.every((d) => d !== "") ? "" : "bg-white"} ${isCompact ? "w-10 h-10 text-base" : "w-12 h-12 text-lg"}`}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>

              {/* Helper text */}
              <div className={`mt-3 space-y-1 ${isCompact ? "text-xs" : "text-sm"} text-gray-500`}>
                <div className="flex items-center justify-center">
                  <p>Check your spam folder if you don't see the email</p>
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <button
              disabled={otp.some((digit) => !digit) || isVerifying || isResending}
              onClick={() => handleVerifyOTP()}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              type="button"
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
              <span>
                {isVerifying ? "Verifying..." : "Verify & Reset Password"}
              </span>
            </button>

            {/* Resend Code Button */}
            <div className="flex justify-center">
              {resendCooldown === 0 ? (
                <button
                  onClick={handleResendCode}
                  disabled={isResending || isVerifying}
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white text-red-500 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  type="button"
                >
                  {isResending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  <span>
                    {isResending ? "Sending..." : "Resend reset code"}
                  </span>
                </button>
              ) : (
                <div className="w-full flex justify-center py-3">
                  <p className={`text-gray-500 ${isCompact ? "text-sm" : "text-base"}`}>
                    Resend code in {resendCooldown}s
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPResetScreen