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
  const { login, signup, isLoading: authLoading } = useAuth();

  const {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
    isUntrustedProvider,
  } = useEmailValidation(initialEmail);

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isLoading || emailCheckState !== 'exists') return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onContinueWithPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    setIsLoading(true);
    try {
      const { supabase } = await import('../../integrations/supabase/client');
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) toast.error(error.message || 'Failed to send verification code');
      else {
        toast.success('Verification code sent to your email');
        onContinueWithCode(email);
      }
    } catch {
      toast.error('Unexpected error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onCreateAccount(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        isCompact
          ? 'bg-white flex flex-col px-4 pb-8'
          : 'min-h-screen bg-white flex flex-col px-4 pb-8'
      }
    >
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-2 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            disabled={isLoading || authLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-base font-semibold text-gray-900">
            Continue with Email
          </h2>

          <button
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            onClick={() => alert('Need help? Contact support@example.com')}
            disabled={isLoading || authLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full max-w-md mx-auto relative mb-8">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            What's your email?
          </h1>
          <p className="text-gray-600 text-sm">
            We'll check if you already have an account.
          </p>
        </div>

        <div className="flex flex-col gap-4">
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

          {/* Increased spacing between field and buttons */}
          <div className="mt-1">
            <EmailActionButtons
              isEmailValid={isEmailValid}
              emailCheckState={emailCheckState}
              isLoading={isLoading || authLoading}
              isUntrustedProvider={isUntrustedProvider}
              onContinueWithPassword={handleContinueWithPassword}
              onContinueWithCode={handleContinueWithCode}
              onCreateAccount={handleCreateAccountClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthScreen;