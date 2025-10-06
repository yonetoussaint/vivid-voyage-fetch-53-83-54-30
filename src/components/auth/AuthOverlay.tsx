
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { } from 'lucide-react';
import MainLoginScreen from './MainLoginScreen';
import EmailAuthScreen from './EmailAuthScreen';
import VerificationCodeScreen from './VerificationCodeScreen';
import PasswordAuthScreen from './PasswordAuthScreen';
import SuccessScreen from './SuccessScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import OTPResetScreen from './OTPResetScreen';
import NewPasswordScreen from './NewPasswordScreen';
import AccountCreationScreen from './AccountCreationScreen';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/auth/AuthContext';

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  // Reset to main screen when overlay opens
  useEffect(() => {
    if (isOpen) {
      setCurrentScreen('main');
      setUserEmail('');
      setResetOTP('');
    }
  }, [isOpen]);

  // Auth flow handlers - same as SignInScreen
  const handleContinueWithEmail = () => {
    setCurrentScreen('email');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

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

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
  };

  const handleBackFromVerification = () => {
    setCurrentScreen('email');
  };

  const handleBackFromPassword = () => {
    setCurrentScreen('email');
  };

  const handleVerificationSuccess = () => {
    setCurrentScreen('success');
  };

  const handleSignInSuccess = () => {
    setCurrentScreen('success');
  };

  const handleForgotPasswordClick = () => {
    setCurrentScreen('reset-password');
  };

  const handleContinueToApp = () => {
    onClose();
    // Just close the overlay, stay on current page without any navigation
  };

  const handleBackFromAccountCreation = () => {
    setCurrentScreen('email');
  };

  const handleAccountCreated = () => {
    setCurrentScreen('success');
  };

  // Get compact props for each screen
  const getCompactProps = () => {
    return {
      isCompact: true,
      onExpand: undefined
    };
  };

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();

    switch (currentScreen) {
      case 'main':
        return (
          <MainLoginScreen
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinueWithEmail={handleContinueWithEmail}
            showHeader={!compactProps.isCompact}
            {...compactProps}
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
            showHeader={!compactProps.isCompact}
            {...compactProps}
          />
        );
      case 'verification':
        return (
          <VerificationCodeScreen
            email={userEmail}
            onBack={handleBackFromVerification}
            onVerificationSuccess={handleVerificationSuccess}
            showHeader={!compactProps.isCompact}
            {...compactProps}
          />
        );
      case 'password':
        return (
          <PasswordAuthScreen
            email={userEmail}
            onBack={handleBackFromPassword}
            onSignInSuccess={handleSignInSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
            showHeader={!compactProps.isCompact}
            {...compactProps}
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
            {...compactProps}
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
            {...compactProps}
          />
        );
      case 'new-password':
        return (
          <NewPasswordScreen
            email={userEmail}
            otp={resetOTP}
            onBack={() => setCurrentScreen('otp-reset')}
            onPasswordResetSuccess={() => setCurrentScreen('success')}
            {...compactProps}
          />
        );
      case 'account-creation':
        return (
          <AccountCreationScreen
            email={userEmail}
            onBack={handleBackFromAccountCreation}
            onAccountCreated={handleAccountCreated}
            {...compactProps}
          />
        );
      case 'success':
        return (
          <SuccessScreen
            email={userEmail}
            onContinue={handleContinueToApp}
            {...compactProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <Drawer open={isOpen} onOpenChange={(open) => {
          if (!open) onClose();
        }}>
          <DrawerContent className="max-h-[90vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex flex-col items-center pt-2 pb-3 flex-shrink-0">
              <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm" />
            </div>
            
            <div className="px-0 pb-4 flex-shrink-0">
              {renderCurrentScreen()}
            </div>
          </DrawerContent>
        </Drawer>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AuthOverlay;
