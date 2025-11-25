import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Key, HelpCircle, Mail, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { useAuth } from '@/contexts/auth/AuthContext';

interface OTPResetScreenProps {
  email: string;
  onBack: () => void;
  onOTPVerified: (email: string, otp: string) => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const OTPResetScreen: React.FC<OTPResetScreenProps> = ({
  email,
  onBack,
  onOTPVerified,
  isCompact = false,
  onExpand
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [shakeError, setShakeError] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(600); // 10 minutes in seconds
  const [showHelp, setShowHelp] = useState(false);
  const { handleOTPSignIn } = useAuth();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry > 0) {
      const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpExpiry]);

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const updateFavicon = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      const url = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
      return { url, show: true, domain };
    }
    return { url: '', show: false, domain: '' };
  };

  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

  // Check server health
  const checkServerHealth = async () => {
    try {
      const response = await fetch('https://resend-u11p.onrender.com/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  };

  // OTP functions with better error handling
  const verifyCustomOTP = async (email: string, otp: string) => {
    console.log('🔐 Frontend OTP Verification:', { email, otp });

    // Check server health first
    const isServerHealthy = await checkServerHealth();
    if (!isServerHealthy) {
      throw new Error('Server is currently unavailable. Please try again in a few moments.');
    }

    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      console.log('📡 Backend Response Status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('📡 Backend Response Data:', result);

      return { 
        success: true, 
        purpose: result.purpose,
        message: result.message 
      };
    } catch (error: any) {
      console.error('❌ OTP Verification Failed:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  const resendOTPEmail = async (email: string, purpose = 'password_reset') => {
    // Check server health first
    const isServerHealthy = await checkServerHealth();
    if (!isServerHealthy) {
      throw new Error('Server is currently unavailable. Please try again in a few moments.');
    }

    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const endpoint = purpose === 'password_reset' ? '/api/send-reset-otp' : '/api/resend-otp';

      console.log('🔄 Resending OTP:', { email, purpose, endpoint });

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to resend verification code';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('📡 Resend Response:', result);

      return { success: true };
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    setShakeError(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      setShakeError(false);
      inputRefs.current[5]?.focus();
      
      // Auto-submit after paste
      handleVerifyOTP(pastedData);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    if (codeToVerify.length !== 6 || isVerifying) return;

    setIsVerifying(true);
    setError('');
    setShakeError(false);

    try {
      const result = await verifyCustomOTP(email, codeToVerify);

      if (result.success) {
        // For password reset OTP, just proceed to next screen
        onOTPVerified(email, codeToVerify);
      } else {
        const errorMsg = result.error || 'Invalid verification code';
        setError(errorMsg);
        setShakeError(true);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        // Reset shake animation
        setTimeout(() => setShakeError(false), 650);
      }
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      let errorMsg = 'Verification failed. Please try again.';
      
      if (error.message.includes('Network')) {
        errorMsg = 'Network error. Check your connection and try again.';
      } else if (error.message.includes('expired')) {
        errorMsg = 'Code has expired. Please request a new one.';
      } else if (error.message.includes('Invalid')) {
        errorMsg = 'Invalid code. Please check and try again.';
      }
      
      setError(errorMsg);
      setShakeError(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Reset shake animation
      setTimeout(() => setShakeError(false), 650);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');
    setShakeError(false);

    try {
      const result = await resendOTPEmail(email, 'password_reset');

      if (result.success) {
        setResendCooldown(60);
        setOtpExpiry(600); // Reset expiry timer
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      setError(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmailProvider = (emailValue: string) => {
    const domain = extractDomain(emailValue).toLowerCase();
    
    const providers: Record<string, { name: string; url: string; color: string }> = {
      'gmail.com': { 
        name: 'Gmail', 
        url: 'https://mail.google.com',
        color: 'bg-red-500 hover:bg-red-600'
      },
      'outlook.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com/mail',
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      'hotmail.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com/mail',
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      'yahoo.com': { 
        name: 'Yahoo Mail', 
        url: 'https://mail.yahoo.com',
        color: 'bg-purple-600 hover:bg-purple-700'
      },
      'icloud.com': { 
        name: 'iCloud Mail', 
        url: 'https://www.icloud.com/mail',
        color: 'bg-gray-700 hover:bg-gray-800'
      },
      'me.com': { 
        name: 'iCloud Mail', 
        url: 'https://www.icloud.com/mail',
        color: 'bg-gray-700 hover:bg-gray-800'
      },
    };
    
    return providers[domain] || null;
  };

  const emailProvider = getEmailProvider(email);

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
            disabled={isVerifying || isResending}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Enter Reset Code
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@mimaht.com')}
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
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Enter reset code
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We sent a 6-digit password reset code to your email address
            </p>
          </div>

          {/* Email Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  {faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt="Email provider favicon"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                      }}
                    />
                  ) : (
                    <Mail className="w-full h-full text-gray-400" />
                  )}
                </div>
                <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {email}
                </span>
              </div>
              <button
                onClick={onBack}
                className={`text-red-500 hover:text-red-600 font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}
                type="button"
                disabled={isVerifying || isResending}
              >
                Change
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg transition-all duration-300 ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>{error}</p>
                  {error.includes('expired') && (
                    <p className={`mt-1 text-red-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
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
              <div className={`flex gap-2 justify-between ${shakeError ? 'shake' : ''}`}>
                {otp.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isVerifying || isResending}
                      className={`text-center font-semibold border rounded-lg outline-none transition-all duration-200 ${
                        digit ? 'scale-in' : ''
                      } ${
                        error 
                          ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      } ${isVerifying || isResending ? 'bg-gray-50' : 'bg-white'} ${isCompact ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}
                      autoComplete="off"
                    />
                    {digit && !error && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-4 h-4 text-green-500 absolute top-1 right-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Helper text */}
              <div className={`mt-3 space-y-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                <div className="flex items-center justify-between text-gray-500">
                  <p>Check your spam folder if you don't see the email</p>
                  {otpExpiry > 0 && (
                    <span className={`font-medium ${otpExpiry < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                      Expires in {formatTime(otpExpiry)}
                    </span>
                  )}
                </div>
                {otpExpiry === 0 && (
                  <p className="text-red-500 font-medium">Code expired. Please request a new one.</p>
                )}
                
                {/* Email Provider Quick Link */}
                {emailProvider && (
                  <a
                    href={emailProvider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${emailProvider.color} ${isCompact ? 'text-xs' : 'text-sm'} font-medium`}
                  >
                    <Mail className="w-4 h-4" />
                    Open {emailProvider.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              {resendCooldown === 0 ? (
                <button
                  onClick={handleResendCode}
                  disabled={isResending || isVerifying}
                  className={`text-red-500 hover:text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto ${isCompact ? 'text-sm' : 'text-base'}`}
                  type="button"
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Resend reset code
                </button>
              ) : (
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  Resend code in {resendCooldown}s
                </p>
              )}
            </div>

            {/* Having Trouble Section */}
            <div className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${isCompact ? 'mt-3' : 'mt-4'}`}>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className={`font-medium text-gray-700 ${isCompact ? 'text-sm' : 'text-base'}`}>
                    Having trouble?
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showHelp ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expandable Content */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showHelp ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`p-4 pt-0 space-y-4 border-t border-gray-100 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {/* Common Issues */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Common Issues
                    </h4>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span><strong>Check spam/junk folder:</strong> Email providers sometimes filter verification emails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span><strong>Wrong email address?</strong> Click "Change" above to use a different email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span><strong>Code expired?</strong> Click "Resend reset code" to get a fresh code</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span><strong>Delayed delivery:</strong> Emails can take up to 5 minutes to arrive</span>
                      </li>
                    </ul>
                  </div>

                  {/* FAQ */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Frequently Asked Questions
                    </h4>
                    <div className="space-y-3 text-gray-600 ml-6">
                      <div>
                        <p className="font-medium text-gray-700">How long is the code valid?</p>
                        <p>The reset code expires after 10 minutes for security reasons.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Can I request a new code?</p>
                        <p>Yes! Click "Resend reset code" to get a fresh code sent to your email.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Is this secure?</p>
                        <p>Yes, all communications are encrypted and codes are single-use only.</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-600 mb-2">Still need help?</p>
                    <a
                      href="mailto:support@mimaht.com"
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <button
              disabled={otp.some(digit => !digit) || isVerifying || isResending}
              onClick={() => handleVerifyOTP()}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                !otp.some(digit => !digit) && !isVerifying && !isResending
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${isCompact ? 'shadow-sm' : ''}`}
              type="button"
            >
              {isVerifying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Key className="w-5 h-5" />
              )}
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                {isVerifying ? 'Verifying...' : 'Verify & Reset Password'}
              </span>
            </button>
          </div>
        </div>

        {/* Secure Authentication Footer */}
        <div className={`flex items-center justify-center gap-2 ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <span className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Secure Authentication
          </span>
        </div>

        {/* Terms Footer */}
        <p className={`text-gray-500 text-center ${isCompact ? 'text-[10px] leading-tight px-2' : 'text-xs leading-relaxed'}`}>
          By proceeding, you confirm that you've read and agree to our{' '}
          <span className="text-red-500">Terms of Service</span>{' '}
          and{' '}
          <span className="text-red-500">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default OTPResetScreen;