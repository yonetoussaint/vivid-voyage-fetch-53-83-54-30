import React, { useState, useRef, useEffect, useContext } from 'react';
import { ArrowLeft, Key, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { AuthContext } from '@/contexts/auth/AuthContext';

interface VerificationCodeScreenProps {
  email: string;
  onBack: () => void;
  onVerificationSuccess: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({
  email,
  onBack,
  onVerificationSuccess,
  isCompact = false,
  onExpand
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // OTP verification function
  const verifyCustomOTP = async (email: string, otp: string) => {
    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }

      return { 
        success: true, 
        user: result.user,
        message: result.message 
      };
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid verification code' 
      };
    }
  };

  // Resend OTP function
  const resendOTPEmail = async (email: string, purpose = 'signin') => {
    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend verification code');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to resend verification code' 
      };
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsComplete(newCode.every(digit => digit !== ''));
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await resendOTPEmail(email, 'signin');

      if (result.success) {
        toast.success('New sign-in code sent!');
        setTimeLeft(60);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        setIsComplete(false);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  // FIXED: Proper OTP verification with auth state update
  const handleVerifyCode = async () => {
    if (!isComplete) return;

    setIsLoading(true);
    setError('');

    const verificationCode = code.join('');

    try {
      // Step 1: Verify OTP with backend
      const result = await verifyCustomOTP(email, verificationCode);

      if (!result.success) {
        setError(result.error || 'Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        setIsComplete(false);
        inputRefs.current[0]?.focus();
        return;
      }

      console.log('✅ OTP verified successfully');

      // Step 2: Update global auth state using AuthContext
      if (authContext && result.user) {
        console.log('🔄 Updating auth state with OTP user:', result.user);
        
        // Use the new handleOTPSignIn method
        if (authContext.handleOTPSignIn) {
          await authContext.handleOTPSignIn(result.user);
        } else {
          // Fallback: manually check auth status
          await authContext.checkAuthStatus();
        }
        
        // Verify auth state was updated
        setTimeout(() => {
          if (authContext.isAuthenticated) {
            console.log('✅ Auth state successfully updated');
            toast.success('Signed in successfully!');
            onVerificationSuccess();
          } else {
            console.log('⚠️ Auth state not updated, but OTP was valid');
            toast.success('Email verified! Please continue.');
            onVerificationSuccess();
          }
        }, 500);
      } else {
        // If no auth context, just proceed
        toast.success('Email verified successfully!');
        onVerificationSuccess();
      }

    } catch (error: any) {
      console.error('💥 Error during verification:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const domain = email.split('@')[1] || '';
  const faviconUrl = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}`;

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
            Welcome Back! Sign In
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

      {/* Progress Bar */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Enter sign-in code
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We sent a 6-digit sign-in code to your email address
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
                className={`text-red-500 hover:text-red-600 font-medium ${isCompact ? 'text-xs' : 'text-sm'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                Sign-In Code
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className={`text-center font-semibold border rounded-lg outline-none transition-colors ${
                      error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${isCompact ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}
                  />
                ))}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  disabled={isResending || isLoading}
                  className={`text-red-500 hover:text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto ${isCompact ? 'text-sm' : 'text-base'}`}
                  type="button"
                >
                  {isResending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isResending ? 'Sending...' : 'Resend sign-in code'}
                </button>
              ) : (
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  Resend code in {timeLeft}s
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              disabled={!isComplete || isLoading}
              onClick={handleVerifyCode}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                isComplete && !isLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500 transform active:scale-95'
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
                {isLoading ? 'Signing In...' : 'Verify & Sign In'}
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

export default VerificationCodeScreen;