import React from 'react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  MainLoginScreenSkeletonCompact,
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
    setResetOTP,
    authError,
    setAuthError,
    getFaviconUrl,
    handleClose,
    handleBackToMain,
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
    handleNameStepContinue,
    handlePasswordStepContinue,
    handleAccountCreated,
    firstName,
    lastName,
    setFirstName,
    setLastName,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    isLoading,
    validateName,
    validatePassword
  } = useAuth();

  // Add state for auth method and phone number
  const [authMethod, setAuthMethod] = React.useState<'email' | 'phone'>('email');
  const [userPhone, setUserPhone] = React.useState('');

  const getCompactProps = () => ({
    isCompact: true,
    onExpand: undefined
  });

  // Name validation state (moved from AuthContext)
  const [nameErrors, setNameErrors] = React.useState({
    firstName: '',
    lastName: ''
  });

  // Form validation (moved from AuthContext)
  const isNameFormValid = React.useMemo(() => {
    return firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           !nameErrors.firstName && 
           !nameErrors.lastName;
  }, [firstName, lastName, nameErrors]);

  const isPasswordFormValid = React.useMemo(() => {
    return (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword &&
      validatePassword(password) === null
    );
  }, [password, confirmPassword, validatePassword]);

  // Name change handlers (moved from AuthContext)
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    const error = validateName(value, 'First name');
    setNameErrors(prev => ({ ...prev, firstName: error }));
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    const error = validateName(value, 'Last name');
    setNameErrors(prev => ({ ...prev, lastName: error }));
  };

  // Email authentication handler - DEFINED LOCALLY
  const handleContinueWithEmail = () => {
    setAuthMethod('email'); // Set to email
    setCurrentScreen('email');
  };

  // Phone authentication handler
  const handleContinueWithPhone = () => {
    setAuthMethod('phone'); // Set to phone
    setCurrentScreen('email'); // Use the same screen but with phone mode
  };

  // Updated handlers to include method and store both email/phone
  const handleContinueWithPasswordWithMethod = (identifier: string, method: 'email' | 'phone') => {
    if (method === 'email') {
      setUserEmail(identifier);
      setUserPhone(''); // Clear phone when using email
    } else {
      setUserPhone(identifier);
      setUserEmail(''); // Clear email when using phone
    }
    setCurrentScreen('password');
  };

  const handleContinueWithCodeWithMethod = (identifier: string, method: 'email' | 'phone') => {
    if (method === 'email') {
      setUserEmail(identifier);
      setUserPhone('');
    } else {
      setUserPhone(identifier);
      setUserEmail('');
    }
    setCurrentScreen('verification');
  };

  // Email-specific handler for backward compatibility
  const handleCreateAccountWithEmail = (email: string) => {
    setUserEmail(email);
    setUserPhone('');
    setAuthMethod('email');
    handleCreateAccount(email);
  };

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
        showDragHandle: false
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
                onContinueWithEmail={handleContinueWithEmail} // Use local handler
                onContinueWithPhone={handleContinueWithPhone}
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
                onContinueWithPassword={handleContinueWithPasswordWithMethod}
                onContinueWithCode={handleContinueWithCodeWithMethod}
                onCreateAccount={handleCreateAccountWithEmail}
                onSignUpClick={handleSignUpClick}
                authMethod={authMethod}
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
                email={authMethod === 'email' ? userEmail : userPhone}
                authMethod={authMethod}
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
                email={authMethod === 'email' ? userEmail : ''}
                phone={authMethod === 'phone' ? userPhone : ''}
                authMethod={authMethod}
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
                  setUserPhone('');
                  setAuthMethod('email');
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