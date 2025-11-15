import React, { useState } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { EmailAuthScreenProps } from '../../types/auth/email';
import { useEmailValidation } from '../../hooks/auth/useEmailValidation';
import { useAuth } from '../../contexts/auth/AuthContext';
import { toast } from 'sonner';
import EmailInput from './EmailInput';
import EmailStatusMessage from './EmailStatusMessage';
import EmailActionButtons from './EmailActionButtons';

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onBack,
  selectedLanguage,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
  onSignUpClick,
  initialEmail = '',
  isCompact = false,
  onExpand,
  showHeader = true,
}) => {
  const { sendCustomOTPEmail, isLoading: authLoading } = useAuth();

  const {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
    isUntrustedProvider,
  } = useEmailValidation(initialEmail);

  // Separate loading states for each button
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isCreateAccountLoading, setIsCreateAccountLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isPasswordLoading || emailCheckState !== 'exists') return;
    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onContinueWithPassword(email);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isCodeLoading || emailCheckState === 'checking') return;

    setIsCodeLoading(true);
    try {
      // ✅ Use custom OTP function instead of Supabase's built-in
      const result = await sendCustomOTPEmail(email);

      if (result.success) {
        toast.success('Verification code sent to your email');
        onContinueWithCode(email);
        // ✅ DON'T reset loading state here - let the navigation happen
        // The next screen will handle its own loading state
      } else {
        toast.error(result.error || 'Failed to send verification code');
        setIsCodeLoading(false); // ✅ Reset only on error
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      setIsCodeLoading(false); // ✅ Reset only on error
    }
    // ✅ Remove the finally block - let loading state persist during navigation
  };

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isCreateAccountLoading || emailCheckState === 'checking') return;
    setIsCreateAccountLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onCreateAccount(email);
    } finally {
      setIsCreateAccountLoading(false);
    }
  };

  // Calculate overall loading for other components
  const isLoading = isPasswordLoading || isCodeLoading || isCreateAccountLoading || authLoading;

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Continue with Email
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            onClick={() => alert('Need help? Contact support@example.com')}
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
        </div>
      </div>

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              What's your email?
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We'll check if you already have an account.
            </p>
          </div>

          {/* Email Input Section */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            <EmailStatusMessage
              emailCheckState={emailCheckState}
              isUntrustedProvider={isUntrustedProvider}
            />

            <EmailInput
              email={email}
              onEmailChange={handleEmailChange}
              emailCheckState={emailCheckState}
              isLoading={isLoading}
              isUntrustedProvider={isUntrustedProvider}
            />

            {/* Action Buttons */}
            <div>
              <EmailActionButtons
                isEmailValid={isEmailValid}
                emailCheckState={emailCheckState}
                isPasswordLoading={isPasswordLoading}
                isCodeLoading={isCodeLoading}
                isCreateAccountLoading={isCreateAccountLoading}
                isUntrustedProvider={isUntrustedProvider}
                onContinueWithPassword={handleContinueWithPassword}
                onContinueWithCode={handleContinueWithCode}
                onCreateAccount={handleCreateAccountClick}
              />
            </div>
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

export default EmailAuthScreen;