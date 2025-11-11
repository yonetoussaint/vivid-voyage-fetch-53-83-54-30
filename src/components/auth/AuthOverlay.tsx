import React from 'react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  MainLoginScreenSkeleton,
  EmailAuthScreenSkeleton,
  VerificationCodeScreenSkeleton,
  PasswordAuthScreenSkeleton,
  ResetPasswordScreenSkeleton,
  AccountCreationScreenSkeleton,
  SuccessScreenSkeleton
} from './AuthSkeletonLoaders';

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

  const handleClose = () => {
    setIsAuthOverlayOpen(false);
  };

  // Remove compact props for EmailAuthScreen to show full UI
  const getScreenProps = (screen: string) => {
    // For EmailAuthScreen, don't use compact mode to show all UI elements
    if (screen === 'email') {
      return {
        isCompact: false, // Set to false to show full UI including email providers
        onExpand: undefined,
        showHeader: true // Show header for back navigation
      };
    }
    
    // For other screens, use compact mode
    return {
      isCompact: true,
      onExpand: undefined,
      showHeader: false
    };
  };

  const renderCurrentScreen = () => {
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
          <React.Suspense fallback={<MainLoginScreenSkeleton />}>
            <MainLoginScreen
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onContinueWithEmail={handleContinueWithEmail}
              {...getScreenProps('main')}
            />
          </React.Suspense>
        );
      case 'email':
        return (
          <React.Suspense fallback={<EmailAuthScreenSkeleton />}>
            <EmailAuthScreen
              onBack={handleBackToMain}
              selectedLanguage={selectedLanguage}
              onContinueWithPassword={handleContinueWithPassword}
              onContinueWithCode={handleContinueWithCode}
              onCreateAccount={handleCreateAccount}
              onSignUpClick={handleSignUpClick}
              initialEmail={userEmail}
              {...getScreenProps('email')}
            />
          </React.Suspense>
        );
      case 'verification':
        return (
          <React.Suspense fallback={<VerificationCodeScreenSkeleton />}>
            <VerificationCodeScreen
              email={userEmail}
              onBack={handleBackFromVerification}
              onVerificationSuccess={handleVerificationSuccess}
              {...getScreenProps('verification')}
            />
          </React.Suspense>
        );
      case 'password':
        return (
          <React.Suspense fallback={<PasswordAuthScreenSkeleton />}>
            <PasswordAuthScreen
              email={userEmail}
              onBack={handleBackFromPassword}
              onSignInSuccess={handleSignInSuccess}
              onForgotPasswordClick={handleForgotPasswordClick}
              {...getScreenProps('password')}
            />
          </React.Suspense>
        );
      case 'reset-password':
        return (
          <React.Suspense fallback={<ResetPasswordScreenSkeleton />}>
            <ResetPasswordScreen
              onBack={() => setCurrentScreen('password')}
              onResetSuccess={(email) => {
                setUserEmail(email);
                setCurrentScreen('otp-reset');
              }}
              initialEmail={userEmail}
              {...getScreenProps('reset-password')}
            />
          </React.Suspense>
        );
      case 'otp-reset':
        return (
          <React.Suspense fallback={<VerificationCodeScreenSkeleton />}>
            <OTPResetScreen
              email={userEmail}
              onBack={() => setCurrentScreen('reset-password')}
              onOTPVerified={(email, otp) => {
                setResetOTP(otp);
                setCurrentScreen('new-password');
              }}
              {...getScreenProps('otp-reset')}
            />
          </React.Suspense>
        );
      case 'new-password':
        return (
          <React.Suspense fallback={<PasswordAuthScreenSkeleton />}>
            <NewPasswordScreen
              email={userEmail}
              otp={resetOTP}
              onBack={() => setCurrentScreen('otp-reset')}
              onPasswordResetSuccess={() => setCurrentScreen('success')}
              {...getScreenProps('new-password')}
            />
          </React.Suspense>
        );
      case 'account-creation':
        return (
          <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
            <AccountCreationScreen
              email={userEmail}
              onBack={handleBackFromAccountCreation}
              onAccountCreated={handleAccountCreated}
              {...getScreenProps('account-creation')}
            />
          </React.Suspense>
        );
      case 'success':
        return (
          <React.Suspense fallback={<SuccessScreenSkeleton />}>
            <SuccessScreen
              email={userEmail}
              onContinue={handleContinueToApp}
              {...getScreenProps('success')}
            />
          </React.Suspense>
        );
      default:
        return null;
    }
  };

  // Custom header content with drag handle
  const panelHeaderContent = (
    <div className="flex flex-col items-center w-full">
      {/* Drag handle */}
      <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm mb-2" />
      {/* Screen title based on current screen */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentScreen === 'main' && 'Sign In'}
          {currentScreen === 'email' && 'Continue with Email'}
          {currentScreen === 'verification' && 'Verification Code'}
          {currentScreen === 'password' && 'Enter Password'}
          {currentScreen === 'reset-password' && 'Reset Password'}
          {currentScreen === 'otp-reset' && 'Verify Code'}
          {currentScreen === 'new-password' && 'New Password'}
          {currentScreen === 'account-creation' && 'Create Account'}
          {currentScreen === 'success' && 'Success'}
        </h3>
      </div>
    </div>
  );

  return (
    <SlideUpPanel
      isOpen={isAuthOverlayOpen}
      onClose={handleClose}
      headerContent={panelHeaderContent}
      showCloseButton={false}
      preventBodyScroll={true}
      className="bg-white"
    >
      <div className="px-4 pb-6">
        {renderCurrentScreen()}
      </div>
    </SlideUpPanel>
  );
};

export default AuthOverlay;