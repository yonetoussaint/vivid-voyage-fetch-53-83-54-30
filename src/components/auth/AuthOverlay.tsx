import React, { useState, useRef } from 'react';
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
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../constants/email';
import { toast } from 'sonner';

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
    login,
    isLoading: authLoading
  } = useAuth();

  // PasswordAuthScreen state and refs
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

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

  // PasswordAuthScreen handlers
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
    setPasswordError('');
  };

  const handleSignIn = async () => {
    if (!password.trim() || isPasswordLoading || authLoading) return;

    console.log('PasswordAuthScreen: handleSignIn called for email:', userEmail);
    setIsPasswordLoading(true);
    setPasswordError('');

    try {
      console.log('Calling login function...');
      const { error: loginError } = await login(userEmail.trim().toLowerCase(), password);

      if (loginError) {
        console.error('Login error received:', loginError);
        setPasswordError(loginError);
        setPassword('');
        setIsPasswordValid(false);
        passwordInputRef.current?.focus();
        toast.error(loginError);
        return;
      }

      console.log('PasswordAuthScreen: Login successful, calling onSignInSuccess');
      toast.success('Successfully signed in!');
      handleSignInSuccess();
    } catch (error) {
      console.error('Sign in error:', error);
      setPasswordError('Network error. Please check your connection and try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const getCompactProps = () => ({
    isCompact: true,
    onExpand: undefined
  });

  const renderPasswordAuthScreen = () => {
    const domain = userEmail.split('@')[1] || '';
    const faviconUrl = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}`;
    const isCompact = true;
    const showHeader = false;

    return (
      <div className={isCompact ? "bg-white flex flex-col px-4 pb-6" : "min-h-screen bg-white flex flex-col px-4"}>
        {/* Progress Bar - always show */}
        <div className="mb-4 px-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Enter your password
            </h1>
            <p className="text-gray-600">
              Sign in with your password
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Email provider favicon"
                    className="w-5 h-5 rounded"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '';
                    }}
                  />
                ) : (
                  <Mail className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-gray-700">{userEmail}</span>
              </div>
              <button
                onClick={handleBackFromPassword}
                disabled={isPasswordLoading || authLoading}
                className="text-red-500 font-medium hover:text-red-600 text-sm disabled:opacity-50"
                type="button"
              >
                Change
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{passwordError}</p>
            </div>
          )}

          <div className="mb-6 relative">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isPasswordValid && !isPasswordLoading) {
                    handleSignIn();
                  }
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                ref={passwordInputRef}
                disabled={isPasswordLoading || authLoading}
                className={`relative w-full pl-10 ${isPasswordValid && !passwordError ? 'pr-20' : 'pr-12'} py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  passwordError 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPasswordLoading || authLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {isPasswordValid && !passwordError && (
                <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
          </div>

          {/* Forgot Password Button */}
          <div className="text-center mb-6">
            <button 
              className="text-red-500 font-medium hover:text-red-600 transition-colors disabled:opacity-50" 
              type="button"
              onClick={handleForgotPasswordClick}
              disabled={isPasswordLoading || authLoading}
            >
              Forgot password?
            </button>
          </div>

          <div className="space-y-3 mb-8">
            <button
              disabled={!isPasswordValid || isPasswordLoading || authLoading}
              onClick={handleSignIn}
              className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
                isPasswordValid && !isPasswordLoading && !authLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              type="button"
            >
              {isPasswordLoading || authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span>
                {isPasswordLoading || authLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
              </svg>
              <span className="text-gray-500 text-sm">Your session is secured with HTTP-only cookies</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();

    // Lazy load components
    const MainLoginScreen = React.lazy(() => import('./MainLoginScreen'));
    const EmailAuthScreen = React.lazy(() => import('./EmailAuthScreen'));
    const VerificationCodeScreen = React.lazy(() => import('./VerificationCodeScreen'));
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
        return renderPasswordAuthScreen();
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
          <React.Suspense fallback={<AccountCreationScreenSkeleton />}>
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