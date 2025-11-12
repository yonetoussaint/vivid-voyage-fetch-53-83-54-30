import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { useAuth } from '../../contexts/auth/AuthContext';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onResetSuccess: (email: string) => void;
  initialEmail?: string;
  isCompact?: boolean;
  onExpand?: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onResetSuccess,
  initialEmail = '',
  isCompact = false,
  onExpand
}) => {
  const [email] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [resetState, setResetState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Import the correct function from AuthContext
  const { sendPasswordResetOTP } = useAuth();

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const handleSendResetCode = async () => {
    if (!isEmailValid(email) || isLoading) return;

    setIsLoading(true);
    setResetState('sending');
    setErrorMessage(''); // Clear previous error messages

    try {
      // ✅ Now this will call the correct function
      const result = await sendPasswordResetOTP(email);

      if (result.success) {
        console.log('Password reset OTP sent successfully');
        toast.success('Password reset code sent to your email');
        setResetState('sent');
        setTimeout(() => {
          onResetSuccess(email);
        }, 2000);
      } else {
        console.error('Failed to send password reset OTP:', result.error);
        setErrorMessage(result.error || 'Failed to send password reset code. Please try again.');
        setResetState('error');
      }
    } catch (error: any) {
      console.error('Error sending password reset OTP:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setResetState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const canSendReset = isEmailValid(email) && !isLoading && resetState !== 'sent';

  const handleFaviconError = () => {
    // Favicon failed to load
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
            Reset Password
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@example.com')}
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
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Reset your password
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We'll send a verification code to your email address
            </p>
          </div>

          {/* Status Messages */}
          {resetState === 'error' && errorMessage && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <p className={isCompact ? 'text-xs' : 'text-sm'}>{errorMessage}</p>
            </div>
          )}

          {resetState === 'sent' && (
            <div className={`p-4 border border-green-200 bg-green-50 text-green-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5" />
                <p className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>Password reset code sent!</p>
              </div>
              <p className={isCompact ? 'text-xs' : 'text-sm'}>
                Check your email for a 6-digit password reset code. If it doesn't appear within a few minutes, check your spam folder.
              </p>
            </div>
          )}

          {/* Email Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  {showFavicon && faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt="Email provider favicon"
                      className="w-full h-full object-contain"
                      onError={handleFaviconError}
                    />
                  ) : (
                    <Mail className="w-full h-full text-gray-400" />
                  )}
                </div>
                <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {email}
                </span>
              </div>
            </div>
          </div>

          {/* Send Verification Code Button */}
          <button
            onClick={handleSendResetCode}
            disabled={!canSendReset}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
              canSendReset
                ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } ${isCompact ? 'shadow-sm' : ''}`}
          >
            {resetState === 'sending' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>Sending code...</span>
              </>
            ) : resetState === 'sent' ? (
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>Reset code sent</span>
            ) : (
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>Send password reset code</span>
            )}
          </button>

          {/* Back to Sign In */}
          <div className="text-center">
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={onBack}
                className="text-red-500 hover:text-red-600 font-medium focus:outline-none disabled:opacity-50"
                disabled={isLoading}
              >
                Back to sign in
              </button>
            </p>
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

export default ResetPasswordScreen;