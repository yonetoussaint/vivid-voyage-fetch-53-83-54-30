import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { FAVICON_OVERRIDES } from '../../constants/email';

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

  const sendPasswordResetOTP = async (email: string) => {
    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/send-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return { success: true };
    } catch (error: any) {
      console.error('Failed to send password reset OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send password reset code. Please try again.' 
      };
    }
  };

  const handleSendResetCode = async () => {
    if (!isEmailValid(email) || isLoading) return;

    setIsLoading(true);
    setResetState('sending');
    setErrorMessage('');

    try {
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
  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

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

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Reset your password
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We'll send a password reset code to your email address
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

          {/* Send Verification Code Button - UPDATED TO MATCH EmailAuthScreen */}
          <button
            onClick={handleSendResetCode}
            disabled={!canSendReset}
            className={`w-full flex items-center justify-center gap-3 py-4 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed ${isCompact ? '' : ''}`}
            type="button"
          >
            {resetState === 'sending' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </>
            ) : resetState === 'sent' ? (
              <span>Reset code sent</span>
            ) : (
              <span>Send password reset code</span>
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

        {/* REMOVED: Secure Authentication Footer */}
        
        {/* REMOVED: Terms Footer */}
        
      </div>
    </div>
  );
};

export default ResetPasswordScreen;