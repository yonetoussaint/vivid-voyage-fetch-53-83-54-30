// AuthOverlay.tsx
import React, { useState, useCallback } from 'react';
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

// Types
export type ScreenType = 'main' | 'email' | 'phone' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

// Move lazy imports outside component to prevent recreation
const MainLoginScreen = React.lazy(() => import('./MainLoginScreen'));
const EmailAuthScreen = React.lazy(() => import('./EmailAuthScreen'));
const PhoneAuthScreen = React.lazy(() => import('./PhoneAuthScreen'));
const VerificationCodeScreen = React.lazy(() => import('./VerificationCodeScreen'));
const PasswordAuthScreen = React.lazy(() => import('./PasswordAuthScreen'));
const ResetPasswordScreen = React.lazy(() => import('./ResetPasswordScreen'));
const OTPResetScreen = React.lazy(() => import('./OTPResetScreen'));
const NewPasswordScreen = React.lazy(() => import('./NewPasswordScreen'));
const AccountCreationNameStep = React.lazy(() => import('./AccountCreationNameStep'));
const AccountCreationPasswordStep = React.lazy(() => import('./AccountCreationPasswordStep'));
const AccountCreationSuccessStep = React.lazy(() => import('./AccountCreationSuccessStep'));
const SuccessScreen = React.lazy(() => import('./SuccessScreen'));

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose }) => {
  const {
    signup,
    login,
    getFaviconUrl,
    validateName,
    validatePassword,
    sendCustomOTPEmail,
    sendPasswordResetOTP,
    verifyCustomOTP,
    resendOTPEmail,
    completePasswordReset,
    googleSignIn
  } = useAuth();

  // Auth overlay state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [resetOTP, setResetOTP] = useState('');

  // Account creation state
  const [accountCreationStep, setAccountCreationStep] = useState<'name' | 'password' | 'success'>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [nameErrors, setNameErrors] = useState({
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Utility functions
  const isPasswordFormValid = useCallback(() => {
    return (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword &&
      validatePassword(password) === null
    );
  }, [password, confirmPassword, validatePassword]);

  const isNameFormValid = useCallback(() => {
    return firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           !nameErrors.firstName && 
           !nameErrors.lastName;
  }, [firstName, lastName, nameErrors]);

  // Reset overlay state when opening
  React.useEffect(() => {
    if (isOpen) {
      setCurrentScreen('main');
      setUserEmail('');
      setUserPhone('');
      setResetOTP('');
      setAuthError(null);
    }
  }, [isOpen]);

  // Auth overlay handlers
  const handleContinueWithEmail = () => setCurrentScreen('email');
  const handleContinueWithPhone = () => setCurrentScreen('phone');
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
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setNameErrors({ firstName: '', lastName: '' });
  };

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setNameErrors({ firstName: '', lastName: '' });
  };

  const handleNameStepContinue = (newFirstName: string, newLastName: string) => {
    setAuthError(null);

    if (!newFirstName.trim() || !newLastName.trim()) {
      setAuthError('First name and last name are required');
      return;
    }

    setFirstName(newFirstName.trim());
    setLastName(newLastName.trim());
    setAccountCreationStep('password');
  };

  const handlePasswordStepContinue = async () => {
    if (!isPasswordFormValid()) return;

    console.log('AuthOverlay: Starting account creation process');
    setIsLoading(true);
    setAuthError(null);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      console.log('Calling signup with:', { email: userEmail, fullName });

      const result = await signup(userEmail, password, fullName);

      if (result.error) {
        console.error('Signup error:', result.error);
        setAuthError(result.error);
        return;
      }

      console.log('AuthOverlay: Account created successfully, moving to success step');
      setAccountCreationStep('success');
    } catch (error: any) {
      console.error('Account creation error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    setAuthError(null);
  };

  const handleChangeEmail = () => {
    setCurrentScreen('email');
  };

  const handleChangePhone = () => {
    setCurrentScreen('phone');
  };

  const handleBackFromVerification = () => setCurrentScreen('email');
  const handleBackFromPassword = () => setCurrentScreen('email');
  
  const handleVerificationSuccess = () => setCurrentScreen('success');

  const handleSignInSuccess = () => {
    setCurrentScreen('success');
    // Close overlay after a brief delay to show success message
    setTimeout(() => {
      onClose();
      resetAuthOverlay();
    }, 2000);
  };

  const handleForgotPasswordClick = () => setCurrentScreen('reset-password');

  const handleContinueToApp = () => {
    onClose();
    resetAuthOverlay();
  };

  const handleClose = () => {
    onClose();
    resetAuthOverlay();
  };

  // Name step handlers
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

  const resetAuthOverlay = () => {
    setCurrentScreen('main');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setNameErrors({ firstName: '', lastName: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUserEmail('');
    setUserPhone('');
    setResetOTP('');
  };

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
      isOpen: isOpen,
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
                onContinueWithPhone={handleContinueWithPhone}
                showHeader={false}
                onGoogleSignIn={googleSignIn}
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
                onSendOTP={sendCustomOTPEmail}
                {...compactProps}
              />
            </React.Suspense>
          );

        case 'phone':
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
                phone={userPhone}
                onBack={handleBackFromVerification}
                onVerificationSuccess={handleVerificationSuccess}
                showHeader={false}
                onVerifyOTP={verifyCustomOTP}
                onResendOTP={resendOTPEmail}
                {...compactProps}
              />
            </React.Suspense>
          );

        case 'password':
          return (
            <React.Suspense fallback={<PasswordAuthScreenSkeleton />}>
              <PasswordAuthScreen
                email={userEmail}
                phone={userPhone}
                onBack={handleBackFromPassword}
                onSignInSuccess={handleSignInSuccess}
                onForgotPasswordClick={handleForgotPasswordClick}
                isCompact={compactProps.isCompact}
                onExpand={compactProps.onExpand}
                showHeader={false}
                onLogin={login}
                {...compactProps}
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
                onSendResetOTP={sendPasswordResetOTP}
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
                onVerifyOTP={verifyCustomOTP}
                onResendOTP={resendOTPEmail}
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
                onCompletePasswordReset={completePasswordReset}
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
                          phone={userPhone}
                          onBack={handleBackFromAccountCreation}
                          onChangeEmail={handleChangeEmail}
                          onChangePhone={handleChangePhone}
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
                          phone={userPhone}
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
                          phone={userPhone}
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
                phone={userPhone}
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