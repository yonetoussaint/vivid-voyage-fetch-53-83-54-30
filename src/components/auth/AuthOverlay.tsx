import React from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAuth } from '@/contexts/auth/AuthContext';

const AuthOverlay: React.FC = () => {
  const {
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    currentScreen,
    setCurrentScreen,
    selectedLanguage,
    setSelectedLanguage,
    userEmail,
    setUserEmail,
    resetOTP,
    setResetOTP
  } = useAuth();

  // Auth flow handlers
  const handleContinueWithEmail = () => setCurrentScreen('email');
  const handleBackToMain = () => setCurrentScreen('main');
  const handleContinueWithPassword = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('password');
  };
  const handleContinueWithCode = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('verification');
  };
  const handleCreateAccount = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('account-creation');
  };
  const handleSignUpClick = () => setCurrentScreen('account-creation');
  const handleBackFromVerification = () => setCurrentScreen('email');
  const handleBackFromPassword = () => setCurrentScreen('email');
  const handleVerificationSuccess = () => setCurrentScreen('success');
  const handleSignInSuccess = () => setCurrentScreen('success');
  const handleForgotPasswordClick = () => setCurrentScreen('reset-password');
  const handleContinueToApp = () => setIsAuthOverlayOpen(false);
  const handleBackFromAccountCreation = () => setCurrentScreen('email');
  const handleAccountCreated = () => setCurrentScreen('success');

  const getCompactProps = () => ({
    isCompact: true,
    onExpand: undefined
  });

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();

    // Lazy load components
    const MainLoginScreen = React.lazy(() => import('./MainLoginScreen'));
    const EmailAuthScreen = React.lazy(() => import('./EmailAuthScreen'));
    const VerificationCodeScreen = React.lazy(() => import('./VerificationCodeScreen'));
    const PasswordAuthScreen = React.lazy(() => import('./PasswordAuthScreen'));
    const ResetPasswordScreen = React.lazy(() => import('./ResetPasswordScreen'));
    const OTPResetScreen = React.lazy(() => import('./OTPResetScreen'));
    const NewPasswordScreen = React.lazy(() => import('./NewPasswordScreen'));
    const AccountCreationScreen = React.lazy(() => import('./AccountCreationScreen'));
    const SuccessScreen = React.lazy(() => import('./SuccessScreen'));

    switch (currentScreen) {
      case 'main':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <MainLoginScreen
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onContinueWithEmail={handleContinueWithEmail}
              showHeader={false}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'email':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <EmailAuthScreen
              onBack={handleBackToMain}
              selectedLanguage={selectedLanguage}
              onContinueWithPassword={handleContinueWithPassword}
              onContinueWithCode={handleContinueWithCode}
              onCreateAccount={handleCreateAccount}
              onSignUpClick={handleSignUpClick}
              initialEmail={userEmail}
              showHeader={false}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'verification':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <VerificationCodeScreen
              email={userEmail}
              onBack={handleBackFromVerification}
              onVerificationSuccess={handleVerificationSuccess}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'password':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <PasswordAuthScreen
              email={userEmail}
              onBack={handleBackFromPassword}
              onSignInSuccess={handleSignInSuccess}
              onForgotPasswordClick={handleForgotPasswordClick}
              showHeader={false}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'reset-password':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <ResetPasswordScreen
              onBack={() => setCurrentScreen('password')}
              onResetSuccess={(email) => {
                setUserEmail(email);
                setCurrentScreen('otp-reset');
              }}
              initialEmail={userEmail}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'otp-reset':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <OTPResetScreen
              email={userEmail}
              onBack={() => setCurrentScreen('reset-password')}
              onOTPVerified={(email, otp) => {
                setResetOTP(otp);
                setCurrentScreen('new-password');
              }}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'new-password':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <NewPasswordScreen
              email={userEmail}
              otp={resetOTP}
              onBack={() => setCurrentScreen('otp-reset')}
              onPasswordResetSuccess={() => setCurrentScreen('success')}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'account-creation':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <AccountCreationScreen
              email={userEmail}
              onBack={handleBackFromAccountCreation}
              onAccountCreated={handleAccountCreated}
              {...compactProps}
            />
          </React.Suspense>
        );
      case 'success':
        return (
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            <SuccessScreen
              email={userEmail}
              onContinue={handleContinueToApp}
              {...compactProps}
            />
          </React.Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer open={isAuthOverlayOpen} onOpenChange={(open) => {
      if (!open) setIsAuthOverlayOpen(false);
    }}>
      <DrawerContent className="max-h-[95vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="flex flex-col items-center pt-2 pb-3 flex-shrink-0">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm" />
        </div>

        <div className="px-0 pb-4">
          {renderCurrentScreen()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthOverlay;