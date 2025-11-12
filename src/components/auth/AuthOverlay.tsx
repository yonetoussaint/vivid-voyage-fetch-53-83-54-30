import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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

// Height measurement wrapper component with optimizations
const HeightMeasurer: React.FC<{
  onHeightChange: (height: number) => void;
  children: React.ReactNode;
  screenKey: string; // Unique key for each screen to prevent unnecessary updates
}> = ({ onHeightChange, children, screenKey }) => {
  const ref = useRef<HTMLDivElement>(null);
  const currentHeightRef = useRef<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const height = ref.current.scrollHeight;
        // Only update if height actually changed significantly (more than 1px)
        if (Math.abs(height - currentHeightRef.current) > 1) {
          currentHeightRef.current = height;
          onHeightChange(height);
        }
      }
    };

    // Initial measurement with debounce
    const timeoutId = setTimeout(updateHeight, 10);

    // Use ResizeObserver for dynamic content changes with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 50); // Debounce resize events
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [onHeightChange, screenKey]); // Use screenKey instead of children

  return (
    <div ref={ref} className="w-full">
      {children}
    </div>
  );
};

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
  const [contentHeight, setContentHeight] = useState<number>(400);

  // Memoize handlers to prevent unnecessary re-renders
  const handlers = useMemo(() => ({
    handleContinueWithEmail: () => setCurrentScreen('email'),
    handleBackToMain: () => setCurrentScreen('main'),
    handleContinueWithPassword: (email: string) => {
      setUserEmail(email);
      setCurrentScreen('password');
    },
    handleContinueWithCode: (email: string) => {
      setUserEmail(email);
      setCurrentScreen('verification');
    },
    handleCreateAccount: (email: string) => {
      setUserEmail(email);
      setCurrentScreen('account-creation');
      setAccountCreationStep('name');
      setFirstName('');
      setLastName('');
      setError(null);
    },
    handleSignUpClick: () => {
      setCurrentScreen('account-creation');
      setAccountCreationStep('name');
      setFirstName('');
      setLastName('');
      setError(null);
    },
    handleNameStepContinue: (newFirstName: string, newLastName: string) => {
      setError(null);
      if (!newFirstName.trim() || !newLastName.trim()) {
        setError('First name and last name are required');
        return;
      }
      setFirstName(newFirstName.trim());
      setLastName(newLastName.trim());
      setAccountCreationStep('password');
    },
    handlePasswordStepContinue: () => {
      setAccountCreationStep('success');
    },
    handleAccountCreated: () => {
      setCurrentScreen('success');
    },
    handleBackFromAccountCreation: () => {
      if (accountCreationStep === 'name') {
        setCurrentScreen('email');
      } else if (accountCreationStep === 'password') {
        setAccountCreationStep('name');
      } else if (accountCreationStep === 'success') {
        setAccountCreationStep('password');
      }
      setError(null);
    },
    handleChangeEmail: () => {
      setCurrentScreen('email');
    },
    handleBackFromVerification: () => setCurrentScreen('email'),
    handleBackFromPassword: () => setCurrentScreen('email'),
    handleVerificationSuccess: () => setCurrentScreen('success'),
    handleSignInSuccess: () => setCurrentScreen('success'),
    handleForgotPasswordClick: () => setCurrentScreen('reset-password'),
    handleContinueToApp: () => setIsAuthOverlayOpen(false),
  }), [accountCreationStep, setCurrentScreen, setUserEmail, setIsAuthOverlayOpen]);

  const getCompactProps = useCallback(() => ({
    isCompact: true,
    onExpand: undefined
  }), []);

  const ErrorBanner = useMemo(() => (
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
  ), [error]);

  // Stable height change handler
  const handleHeightChange = useCallback((height: number) => {
    setContentHeight(height);
  }, []);

  // Calculate max height for the drawer
  const drawerHeight = useMemo(() => {
    const viewportHeight = window.innerHeight;
    const maxHeight = Math.min(contentHeight + 80, viewportHeight * 0.9);
    return `${maxHeight}px`;
  }, [contentHeight]);

  // Generate a unique key for each screen to help HeightMeasurer
  const screenKey = useMemo(() => 
    `${currentScreen}-${accountCreationStep}-${userEmail}`, 
    [currentScreen, accountCreationStep, userEmail]
  );

  const renderCurrentScreen = useCallback(() => {
    const compactProps = getCompactProps();

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

    const screenContent = (() => {
      switch (currentScreen) {
        case 'main':
          return (
            <React.Suspense fallback={<MainLoginScreenSkeleton />}>
              <MainLoginScreen
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onContinueWithEmail={handlers.handleContinueWithEmail}
                showHeader={false}
                {...compactProps}
              />
            </React.Suspense>
          );

        case 'email':
          return (
            <React.Suspense fallback={<EmailAuthScreenSkeleton />}>
              <EmailAuthScreen
                onBack={handlers.handleBackToMain}
                selectedLanguage={selectedLanguage}
                onContinueWithPassword={handlers.handleContinueWithPassword}
                onContinueWithCode={handlers.handleContinueWithCode}
                onCreateAccount={handlers.handleCreateAccount}
                onSignUpClick={handlers.handleSignUpClick}
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
                onBack={handlers.handleBackFromVerification}
                onVerificationSuccess={handlers.handleVerificationSuccess}
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
                onBack={handlers.handleBackFromPassword}
                onSignInSuccess={handlers.handleSignInSuccess}
                onForgotPasswordClick={handlers.handleForgotPasswordClick}
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
              {ErrorBanner}
              {(() => {
                switch (accountCreationStep) {
                  case 'name':
                    return (
                      <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
                        <AccountCreationNameStep
                          email={userEmail}
                          onBack={handlers.handleBackFromAccountCreation}
                          onChangeEmail={handlers.handleChangeEmail}
                          onContinue={handlers.handleNameStepContinue}
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
                          onBack={handlers.handleBackFromAccountCreation}
                          onContinue={handlers.handlePasswordStepContinue}
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
                          onContinue={handlers.handleAccountCreated}
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
                onContinue={handlers.handleContinueToApp}
                {...compactProps}
              />
            </React.Suspense>
          );

        default:
          return null;
      }
    })();

    return (
      <HeightMeasurer onHeightChange={handleHeightChange} screenKey={screenKey}>
        {screenContent}
      </HeightMeasurer>
    );
  }, [
    currentScreen,
    accountCreationStep,
    userEmail,
    firstName,
    lastName,
    selectedLanguage,
    resetOTP,
    ErrorBanner,
    handlers,
    getCompactProps,
    handleHeightChange,
    screenKey,
    setCurrentScreen,
    setUserEmail,
    setResetOTP
  ]);

  return (
    <Drawer open={isAuthOverlayOpen} onOpenChange={(open) => {
      if (!open) setIsAuthOverlayOpen(false);
    }}>
      <DrawerContent 
        className="transition-all duration-200 ease-in-out"
        style={{ 
          height: drawerHeight,
          maxHeight: '90vh'
        }}
      >
        {/* Drag handle */}
        <div className="flex flex-col items-center pt-2 pb-3 flex-shrink-0">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm" />
        </div>

        {/* Content area */}
        <div className="flex-1">
          {renderCurrentScreen()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthOverlay;