import React, { useState } from 'react';
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

// Move lazy imports outside component to prevent recreation
const MainLoginScreen = React.lazy(() => import('./MainLoginScreen'));
const EmailAuthScreen = React.lazy(() => import('./EmailAuthScreen'));
const VerificationCodeScreen = React.lazy(() => import('./VerificationCodeScreen'));
const PasswordAuthScreen = React.lazy(() => import('./PasswordAuthScreen'));
const ResetPasswordScreen = React.lazy(() => import('./ResetPasswordScreen'));
const OTPResetScreen = React.lazy(() => import('./OTPResetScreen'));
const NewPasswordScreen = React.lazy(() => import('./NewPasswordScreen'));
const AccountCreationNameStep = React.lazy(() => import('./AccountCreationNameStep'));
const AccountCreationPasswordStep = React.lazy(() => import('./AccountCreationPasswordStep'));
const AccountCreationSuccessStep = React.lazy(() => import('./AccountCreationSuccessStep'));
const SuccessScreen = React.lazy(() => import('./SuccessScreen'));

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

  const [accountCreationStep, setAccountCreationStep] = useState<'name' | 'password' | 'success'>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handler functions
  const handleClose = () => {
    setIsAuthOverlayOpen(false);
  };

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
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setError(null);
  };

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setError(null);
  };

  const handleNameStepContinue = (newFirstName: string, newLastName: string) => {
    setError(null);

    if (!newFirstName.trim() || !newLastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    setFirstName(newFirstName.trim());
    setLastName(newLastName.trim());
    setAccountCreationStep('password');
  };

  const handlePasswordStepContinue = () => {
    setAccountCreationStep('success');
  };

  const handleAccountCreated = () => {
    setCurrentScreen('success');
  };

  const handleBackFromAccountCreation = () => {
    if (accountCreationStep === 'name') {
      setCurrentScreen('email');
    } else if (accountCreationStep === 'password') {
      setAccountCreationStep('name');
    } else if (accountCreationStep === 'success') {
      setAccountCreationStep('password');
    }
    setError(null);
  };

  const handleChangeEmail = () => {
    setCurrentScreen('email');
  };

  const handleBackFromVerification = () => setCurrentScreen('email');
  const handleBackFromPassword = () => setCurrentScreen('email');
  const handleVerificationSuccess = () => setCurrentScreen('success');
  const handleSignInSuccess = () => setCurrentScreen('success');
  const handleForgotPasswordClick = () => setCurrentScreen('reset-password');
  const handleContinueToApp = () => setIsAuthOverlayOpen(false);

  const getCompactProps = () => ({
    isCompact: true,
    onExpand: undefined
  });

  const ErrorBanner = () => (
    error ? (
      <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
          >
            ×
          </button>
        </div>
      </div>
    ) : null
  );

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();

    const screenContent = (() => {
      switch (currentScreen) {
        case 'main':
          return (
            <React.Suspense fallback={<MainLoginScreenSkeleton />}>
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
            <React.Suspense fallback={<EmailAuthScreenSkeleton />}>
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
            <React.Suspense fallback={<VerificationCodeScreenSkeleton />}>
              <VerificationCodeScreen
                email={userEmail}
                onBack={handleBackFromVerification}
                onVerificationSuccess={handleVerificationSuccess}
                showHeader={false}
                {...compactProps}
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
                isCompact={compactProps.isCompact}
                onExpand={compactProps.onExpand}
                showHeader={false}
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
                {...compactProps}
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
                {...compactProps}
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
                {...compactProps}
              />
            </React.Suspense>
          );

        case 'account-creation':
          return (
            <>
              <ErrorBanner />
              {(() => {
                switch (accountCreationStep) {
                  case 'name':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationNameStep
                          email={userEmail}
                          onBack={handleBackFromAccountCreation}
                          onChangeEmail={handleChangeEmail}
                          onContinue={handleNameStepContinue}
                          initialFirstName={firstName}
                          initialLastName={lastName}
                          {...compactProps}
                        />
                      </React.Suspense>
                    );

                  case 'password':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationPasswordStep
                          email={userEmail}
                          firstName={firstName}
                          lastName={lastName}
                          onBack={handleBackFromAccountCreation}
                          onContinue={handlePasswordStepContinue}
                          onError={setError}
                          isLoading={false}
                          {...compactProps}
                        />
                      </React.Suspense>
                    );

                  case 'success':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationSuccessStep
                          email={userEmail}
                          firstName={firstName}
                          lastName={lastName}
                          onContinue={handleAccountCreated}
                          {...compactProps}
                        />
                      </React.Suspense>
                    );

                  default:
                    return null;
                }
              })()}
            </>
          );

        case 'success':
          return (
            <React.Suspense fallback={<SuccessScreenSkeleton />}>
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
    })();

    return screenContent;
  };

  return (
    <SlideUpPanel
      isOpen={isAuthOverlayOpen}
      onClose={handleClose}
      showCloseButton={false}
      preventBodyScroll={true}
      className="bg-white"
    >
      {/* REMOVED the drag handle from here - SlideUpPanel now handles it internally */}
      
      {/* Content area */}
      <div className="px-0">
        {renderCurrentScreen()}
      </div>
    </SlideUpPanel>
  );
};

export default AuthOverlay;