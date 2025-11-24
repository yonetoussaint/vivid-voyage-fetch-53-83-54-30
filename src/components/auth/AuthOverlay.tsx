import React from 'react';
import { ChevronLeft } from 'lucide-react';
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
  const [serverError, setServerError] = React.useState<string>('');

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

  // Back button handler for different screens
  const handleBackButton = () => {
    switch (currentScreen) {
      case 'email':
        return handleBackToMain();
      case 'verification':
        return handleBackFromVerification();
      case 'password':
        return handleBackFromPassword();
      case 'reset-password':
        return setCurrentScreen('password');
      case 'otp-reset':
        return setCurrentScreen('reset-password');
      case 'new-password':
        return setCurrentScreen('otp-reset');
      case 'account-creation':
        return handleBackFromAccountCreation();
      case 'success':
        return handleClose(); // Or you might want different behavior for success
      default:
        return handleClose();
    }
  };

  // Clear server error when changing screens
  React.useEffect(() => {
    setServerError('');
  }, [currentScreen]);

  const ErrorBanner = () => (
    (authError || serverError) ? (
      <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">
              {serverError || authError}
            </div>
          </div>
          <button
            onClick={() => {
              setAuthError(null);
              setServerError('');
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
          >
            ×
          </button>
        </div>
      </div>
    ) : null
  );

  // Server unavailable fallback screen
  const ServerUnavailableScreen = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Temporarily Unavailable</h2>
        <p className="text-gray-600 mb-6">
          We're experiencing technical difficulties. Please try again in a few moments.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setServerError('');
              handleBackButton();
            }}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              setServerError('');
              window.location.reload();
            }}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  // Get SlideUpPanel props based on current screen
  const getSlideUpPanelProps = () => {
    const baseProps = {
      isOpen: isAuthOverlayOpen,
      onClose: handleClose,
      preventBodyScroll: true,
      className: "bg-white",
      dynamicHeight: true,
      headerContent: undefined // No header content - no titles
    };

    // Hide all navigation for account creation success step
    if (currentScreen === 'account-creation' && accountCreationStep === 'success') {
      return {
        ...baseProps,
        showCloseButton: false,
        showBackButton: false,
        showHelpButton: false,
        showDragHandle: false
      };
    }

    // Main login screen - show close button and help button
    if (currentScreen === 'main') {
      return {
        ...baseProps,
        showCloseButton: true,
        showHelpButton: true,
        showDragHandle: false
      };
    }

    // All other screens - show back button instead of close button
    return {
      ...baseProps,
      showCloseButton: false,
      showBackButton: true,
      onBack: handleBackButton,
      showDragHandle: false,
      showHelpButton: true // Hide help button on non-main screens
    };
  };

  const renderCurrentScreen = () => {
    // Show server unavailable screen if there's a server error
    if (serverError && serverError.includes('unavailable')) {
      return <ServerUnavailableScreen />;
    }

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
    <>
      <ErrorBanner />
      <SlideUpPanel {...slideUpPanelProps}>
        {/* Content area */}
        <div className="px-0">
          {renderCurrentScreen()}
        </div>
      </SlideUpPanel>
    </>
  );
};

export default AuthOverlay;