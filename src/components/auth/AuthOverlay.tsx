// AuthOverlay.tsx
import React from 'react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  MainLoginScreenSkeletonCompact,
  EmailAuthScreenSkeleton,
  PhoneAuthScreenSkeleton,
  VerificationCodeScreenSkeleton,
  PasswordAuthScreenSkeleton,
  ResetPasswordScreenSkeleton,
  AccountCreationScreenSkeleton,
  SuccessScreenSkeleton
} from './AuthSkeletonLoaders';

// Move lazy imports outside component to prevent recreation
const MainLoginScreen = React.lazy(() => import('./MainLoginScreen'));
const EmailAuthScreen = React.lazy(() => import('./EmailAuthScreen'));
const PhoneAuthScreen = React.lazy(() => import('./PhoneAuthScreen')); // Add this import
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
    userPhone, // Add this from your AuthContext
    setUserPhone, // Add this from your AuthContext
    resetOTP,
    setResetOTP,
    authError,
    setAuthError,
    getFaviconUrl,
    handleClose,
    handleContinueWithEmail,
    handleContinueWithPhone, // Add this from your AuthContext
    handleBackToMain,
    handleContinueWithPassword,
    handleContinueWithCode,
    handleCreateAccount,
    handleSignUpClick,
    handleBackFromVerification,
    handleBackFromPassword,
    handleVerificationSuccess,
    handleSignInSuccess,
    handleForgotPasswordClick,
    handleContinueToApp,
    accountCreationStep,
    handleBackFromAccountCreation,
    handleChangeEmail,
    handleChangePhone, // Add this from your AuthContext
    handleNameStepContinue,
    handlePasswordStepContinue,
    handleAccountCreated,
    firstName,
    lastName,
    handleFirstNameChange,
    handleLastNameChange,
    nameErrors,
    isNameFormValid,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    isPasswordFormValid,
    isLoading
  } = useAuth();

  const getCompactProps = () => ({
    isCompact: true,
    onExpand: undefined
  });

  const ErrorBanner = () => (
    authError ? (
      <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">
              {authError}
            </div>
          </div>
          <button
            onClick={() => setAuthError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
          >
            ×
          </button>
        </div>
      </div>
    ) : null
  );

  // Get SlideUpPanel props based on current screen
  const getSlideUpPanelProps = () => {
    const baseProps = {
      isOpen: isAuthOverlayOpen,
      onClose: handleClose,
      preventBodyScroll: true,
      className: "bg-white",
      dynamicHeight: true
    };

    // Apply specific props only for main login screen
    if (currentScreen === 'main') {
      return {
        ...baseProps,
        showCloseButton: true,
        showHelpButton: true,
        showDragHandle: false // Hide drag bar only for main screen
      };
    }

    // Default props for other screens
    return {
      ...baseProps,
      showCloseButton: false,
      showDragHandle: true
    };
  };

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();
    const faviconUrl = getFaviconUrl(userEmail);

    const screenContent = (() => {
      switch (currentScreen) {
        case 'main':
          return (
            <React.Suspense fallback={<MainLoginScreenSkeletonCompact />}>
              <MainLoginScreen
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onContinueWithEmail={handleContinueWithEmail}
                onContinueWithPhone={handleContinueWithPhone} // Add this prop
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

        case 'phone': // Add this case
          return (
            <React.Suspense fallback={<PhoneAuthScreenSkeleton />}>
              <PhoneAuthScreen
                onBack={handleBackToMain}
                selectedLanguage={selectedLanguage}
                onContinueWithPassword={handleContinueWithPassword}
                onContinueWithCode={handleContinueWithCode}
                onCreateAccount={handleCreateAccount}
                onSignUpClick={handleSignUpClick}
                initialPhone={userPhone}
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
                phone={userPhone} // Add phone prop
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
                phone={userPhone} // Add phone prop
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
                          phone={userPhone} // Add phone prop
                          onBack={handleBackFromAccountCreation}
                          onChangeEmail={handleChangeEmail}
                          onChangePhone={handleChangePhone} // Add this prop
                          onContinue={handleNameStepContinue}
                          firstName={firstName}
                          lastName={lastName}
                          onFirstNameChange={handleFirstNameChange}
                          onLastNameChange={handleLastNameChange}
                          nameErrors={nameErrors}
                          isFormValid={isNameFormValid}
                          faviconUrl={faviconUrl}
                          {...compactProps}
                        />
                      </React.Suspense>
                    );

                  case 'password':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationPasswordStep
                          email={userEmail}
                          phone={userPhone} // Add phone prop
                          firstName={firstName}
                          lastName={lastName}
                          onBack={handleBackFromAccountCreation}
                          onContinue={handlePasswordStepContinue}
                          onError={setAuthError}
                          isLoading={isLoading}
                          password={password}
                          confirmPassword={confirmPassword}
                          showPassword={showPassword}
                          showConfirmPassword={showConfirmPassword}
                          onPasswordChange={setPassword}
                          onConfirmPasswordChange={setConfirmPassword}
                          onShowPasswordChange={setShowPassword}
                          onShowConfirmPasswordChange={setShowConfirmPassword}
                          isFormValid={isPasswordFormValid}
                          faviconUrl={faviconUrl}
                          {...compactProps}
                        />
                      </React.Suspense>
                    );

                  case 'success':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationSuccessStep
                          email={userEmail}
                          phone={userPhone} // Add phone prop
                          firstName={firstName}
                          lastName={lastName}
                          onContinue={handleAccountCreated}
                          faviconUrl={faviconUrl}
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
                phone={userPhone} // Add phone prop
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

  const slideUpPanelProps = getSlideUpPanelProps();

  return (
    <SlideUpPanel {...slideUpPanelProps}>
      {/* Content area */}
      <div className="px-0">
        {renderCurrentScreen()}
      </div>
    </SlideUpPanel>
  );
};

export default AuthOverlay;