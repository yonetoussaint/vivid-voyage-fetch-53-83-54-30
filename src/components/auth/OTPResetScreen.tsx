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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
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

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    if (codeToVerify.length !== 6 || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyCustomOTP(email, codeToVerify);

      if (result.success) {
        // For password reset OTP, just proceed to next screen
        onOTPVerified(email, codeToVerify);
      } else {
        setError(result.error || 'Invalid verification code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      setError(error.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await resendOTPEmail(email, 'password_reset');

      if (result.success) {
        setResendCooldown(60);
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
      setIsLoading(false);
    }
  };

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
            disabled={isLoading}
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
            disabled={isLoading}
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
                disabled={isLoading}
              >
                Change
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <p className={isCompact ? 'text-xs' : 'text-sm'}>{error}</p>
            </div>
          )}

          {/* Code Input */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            <div>
              <label className={`block font-medium text-gray-700 mb-4 ${isCompact ? 'text-sm' : 'text-base'}`}>
                Password Reset Code
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className={`text-center font-semibold border rounded-lg outline-none transition-colors ${
                      error 
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    } ${isLoading ? 'bg-gray-50' : 'bg-white'} ${isCompact ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              {resendCooldown === 0 ? (
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className={`text-red-500 hover:text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto ${isCompact ? 'text-sm' : 'text-base'}`}
                  type="button"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isLoading ? 'Sending...' : 'Resend reset code'}
                </button>
              ) : (
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  Resend code in {resendCooldown}s
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              disabled={otp.some(digit => !digit) || isLoading}
              onClick={() => handleVerifyOTP()}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                !otp.some(digit => !digit) && !isLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${isCompact ? 'shadow-sm' : ''}`}
              type="button"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Key className="w-5 h-5" />
              )}
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                {isLoading ? 'Verifying...' : 'Verify & Reset Password'}
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