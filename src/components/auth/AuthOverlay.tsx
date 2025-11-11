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
    <div className="bg-white flex flex-col px-3 pb-4"> {/* Reduced padding from px-4 to px-3 */}
      {/* Progress Bar - always show */}
      <div className="mb-3 px-0"> {/* Reduced margin */}
        <div className="flex items-center gap-1.5"> {/* Reduced gap */}
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-sm mx-auto relative"> {/* Reduced max-width */}
        <div className="text-center mb-6"> {/* Reduced margin */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-1.5"> {/* Smaller text */}
            Enter your password
          </h1>
          <p className="text-gray-600 text-sm"> {/* Smaller text */}
            Sign in with your password
          </p>
        </div>

        <div className="mb-3"> {/* Reduced margin */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-lg"> {/* Reduced padding and gap */}
            <div className="flex items-center gap-2 min-w-0 flex-1"> {/* Reduced gap and added min-width */}
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Email provider favicon"
                  className="w-4 h-4 rounded flex-shrink-0" /* Smaller icon */
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '';
                  }}
                />
              ) : (
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" /> /* Smaller icon */
              )}
              <span className="text-gray-700 text-sm truncate">{userEmail}</span> {/* Smaller text and truncate */
            </div>
            <button
              onClick={handleBackFromPassword}
              disabled={isPasswordLoading || authLoading}
              className="text-red-500 font-medium hover:text-red-600 text-xs flex-shrink-0 disabled:opacity-50" /* Smaller text */
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {passwordError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg"> {/* Reduced padding */
            <p className="text-red-600 text-xs text-center">{passwordError}</p> /* Smaller text */
          </div>
        )}

        <div className="mb-4 relative"> {/* Reduced margin */
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" /> {/* Smaller icon and spacing */

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
              className={`relative w-full pl-8 ${isPasswordValid && !passwordError ? 'pr-16' : 'pr-10'} py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed text-sm ${
                passwordError 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              }`} /* Reduced padding and smaller text */
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPasswordLoading || authLoading}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {/* Smaller icons */
            </button>

            {isPasswordValid && !passwordError && (
              <Check className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" /> {/* Smaller icon and adjusted position */
            )}
          </div>
        </div>

        {/* Forgot Password Button */}
        <div className="text-center mb-4"> {/* Reduced margin */
          <button 
            className="text-red-500 font-medium hover:text-red-600 transition-colors disabled:opacity-50 text-sm" /* Smaller text */
            type="button"
            onClick={handleForgotPasswordClick}
            disabled={isPasswordLoading || authLoading}
          >
            Forgot password?
          </button>
        </div>

        <div className="space-y-2 mb-6"> {/* Reduced margin and spacing */
          <button
            disabled={!isPasswordValid || isPasswordLoading || authLoading}
            onClick={handleSignIn}
            className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium transition-all text-sm ${
              isPasswordValid && !isPasswordLoading && !authLoading
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`} /* Reduced padding and smaller text */
            type="button"
          >
            {isPasswordLoading || authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" /> /* Smaller icon */
            ) : (
              <Lock className="w-4 h-4" /> /* Smaller icon */
            )}
            <span>
              {isPasswordLoading || authLoading ? 'Signing In...' : 'Sign In'}
            </span>
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5"> {/* Reduced gap */
            <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> {/* Smaller icon */
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-xs">Your session is secured with HTTP-only cookies</span> {/* Smaller text */
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