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

// Import components directly to avoid lazy loading issues
import MainLoginScreen from './MainLoginScreen';
import EmailAuthScreen from './EmailAuthScreen';
import VerificationCodeScreen from './VerificationCodeScreen';
import PasswordAuthScreen from './PasswordAuthScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import OTPResetScreen from './OTPResetScreen';
import NewPasswordScreen from './NewPasswordScreen';
import AccountCreationScreen from './AccountCreationScreen';
import SuccessScreen from './SuccessScreen';

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

  // Consistent props for all screens
  const screenProps = {
    isCompact: false,
    onExpand: undefined,
    showHeader: false
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'main':
        return (
          <MainLoginScreen
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinueWithEmail={handleContinueWithEmail}
            {...screenProps}
          />
        );
      case 'email':
        return (
          <EmailAuthScreen
            onBack={handleBackToMain}
            selectedLanguage={selectedLanguage}
            onContinueWithPassword={handleContinueWithPassword}
            onContinueWithCode={handleContinueWithCode}
            onCreateAccount={handleCreateAccount}
            onSignUpClick={handleSignUpClick}
            initialEmail={userEmail}
            {...screenProps}
          />
        );
      case 'verification':
        return (
          <VerificationCodeScreen
            email={userEmail}
            onBack={handleBackFromVerification}
            onVerificationSuccess={handleVerificationSuccess}
            {...screenProps}
          />
        );
      case 'password':
        return (
          <PasswordAuthScreen
            email={userEmail}
            onBack={handleBackFromPassword}
            onSignInSuccess={handleSignInSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
            {...screenProps}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordScreen
            onBack={() => setCurrentScreen('password')}
            onResetSuccess={(email) => {
              setUserEmail(email);
              setCurrentScreen('otp-reset');
            }}
            initialEmail={userEmail}
            {...screenProps}
          />
        );
      case 'otp-reset':
        return (
          <OTPResetScreen
            email={userEmail}
            onBack={() => setCurrentScreen('reset-password')}
            onOTPVerified={(email, otp) => {
              setResetOTP(otp);
              setCurrentScreen('new-password');
            }}
            {...screenProps}
          />
        );
      case 'new-password':
        return (
          <NewPasswordScreen
            email={userEmail}
            otp={resetOTP}
            onBack={() => setCurrentScreen('otp-reset')}
            onPasswordResetSuccess={() => setCurrentScreen('success')}
            {...screenProps}
          />
        );
      case 'account-creation':
        return (
          <AccountCreationScreen
            email={userEmail}
            onBack={handleBackFromAccountCreation}
            onAccountCreated={handleAccountCreated}
            {...screenProps}
          />
        );
      case 'success':
        return (
          <SuccessScreen
            email={userEmail}
            onContinue={handleContinueToApp}
            {...screenProps}
          />
        );
      default:
        return null;
    }
  };

  // Custom header content with drag handle and back button when needed
  const panelHeaderContent = (
    <div className="flex flex-col items-center w-full">
      {/* Drag handle */}
      <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm mb-2" />
      
      {/* Header with back button and title */}
      <div className="flex items-center justify-between w-full px-4">
        {/* Back button - show on all screens except main */}
        {currentScreen !== 'main' && (
          <button
            onClick={() => {
              // Handle back navigation based on current screen
              switch (currentScreen) {
                case 'email':
                  handleBackToMain();
                  break;
                case 'verification':
                  handleBackFromVerification();
                  break;
                case 'password':
                  handleBackFromPassword();
                  break;
                case 'reset-password':
                  setCurrentScreen('password');
                  break;
                case 'otp-reset':
                  setCurrentScreen('reset-password');
                  break;
                case 'new-password':
                  setCurrentScreen('otp-reset');
                  break;
                case 'account-creation':
                  handleBackFromAccountCreation();
                  break;
                case 'success':
                  // Success screen typically doesn't have back navigation
                  break;
                default:
                  handleBackToMain();
              }
            }}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Center title */}
        <div className={`text-center ${currentScreen !== 'main' ? 'flex-1' : 'w-full'}`}>
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
        
        {/* Spacer for alignment when back button is present */}
        {currentScreen !== 'main' && <div className="w-10" />}
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