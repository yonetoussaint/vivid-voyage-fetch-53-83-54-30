import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';
import { toast } from 'sonner';

interface Language {
  code: string;
  name: string;
  country: string;
  countryName: string;
}

interface MainLoginScreenProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  onContinueWithEmail: () => void;
  onContinueWithPhone: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
  showHeader?: boolean;
}

const MainLoginScreen: React.FC<MainLoginScreenProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  onContinueWithEmail,
  onContinueWithPhone,
  isCompact = false,
  onExpand,
  showHeader = true
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // NEW buttons
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);

  const languages: Language[] = [
    { code: 'ht', name: 'Kreyòl Ayisyen', country: 'HT', countryName: 'Haiti' },
    { code: 'fr', name: 'Français', country: 'FR', countryName: 'France' },
    { code: 'en', name: 'English', country: 'US', countryName: 'United States' },
    { code: 'es', name: 'Español', country: 'ES', countryName: 'Spain' },
    { code: 'pt', name: 'Português', country: 'PT', countryName: 'Portugal' },
  ];

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  const isLoading =
    isGoogleLoading ||
    isFacebookLoading ||
    isEmailLoading ||
    isPhoneLoading ||
    isWhatsappLoading ||
    isAppleLoading ||
    isPinLoading;

  // Google OAuth
  const googleSignIn = async () => {
    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectTo: `${window.location.origin}/auth/callback` }),
      });

      const result = await response.json();
      if (!result.success) return { error: result.error || 'Failed to initialize Google sign in' };
      window.location.href = result.authUrl;
      return {};
    } catch (error: any) {
      return { error: error.message || 'Failed to sign in with Google' };
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsGoogleLoading(true);
    const result = await googleSignIn();
    if (result.error) toast.error(result.error);
    setIsGoogleLoading(false);
  };

  // Facebook (coming soon)
  const handleFacebookSignIn = async () => {
    if (isLoading) return;
    setIsFacebookLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.info('Facebook sign in coming soon!');
    setIsFacebookLoading(false);
  };

  // Email
  const handleEmailSignIn = async () => {
    if (isLoading) return;
    setIsEmailLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onContinueWithEmail();
    setIsEmailLoading(false);
  };

  // Phone
  const handlePhoneSignIn = async () => {
    if (isLoading) return;
    setIsPhoneLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onContinueWithPhone();
    setIsPhoneLoading(false);
  };

  // NEW: WhatsApp placeholder
  const handleWhatsappSignIn = async () => {
    if (isLoading) return;
    setIsWhatsappLoading(true);
    await new Promise(res => setTimeout(res, 1200));
    toast.info('WhatsApp sign in coming soon!');
    setIsWhatsappLoading(false);
  };

  // NEW: Apple placeholder
  const handleAppleSignIn = async () => {
    if (isLoading) return;
    setIsAppleLoading(true);
    await new Promise(res => setTimeout(res, 1200));
    toast.info('Apple sign in coming soon!');
    setIsAppleLoading(false);
  };

  // NEW: PIN placeholder
  const handlePinSignIn = async () => {
    if (isLoading) return;
    setIsPinLoading(true);
    await new Promise(res => setTimeout(res, 1200));
    toast.info('PIN login coming soon!');
    setIsPinLoading(false);
  };

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>

      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          <div className="flex items-center">
            <img 
              src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${currentLang?.country.toLowerCase()}.svg`}
              alt="flag"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Title for Compact Mode */}
      {isCompact && (
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl font-bold text-gray-900">
            <TranslatedText>Welcome to Mima</TranslatedText>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
            <TranslatedText>Connect with local sellers, discover unique products, and be part of something special.</TranslatedText>
          </p>
        </div>
      )}

      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>

          {/* Google */}
          <button onClick={handleGoogleSignIn} disabled={isLoading && !isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span>Continue with Google</span>
            {isGoogleLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />}
          </button>

          {/* Facebook */}
          <button onClick={handleFacebookSignIn} disabled={isLoading && !isFacebookLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span>Continue with Facebook</span>
            {isFacebookLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />}
          </button>

          {/* Email */}
          <button onClick={handleEmailSignIn} disabled={isLoading && !isEmailLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span>Continue with Email</span>
            {isEmailLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />}
          </button>

          {/* Phone */}
          <button onClick={handlePhoneSignIn} disabled={isLoading && !isPhoneLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span>Continue with Phone Number</span>
            {isPhoneLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />}
          </button>

          {/* WhatsApp */}
          <button onClick={handleWhatsappSignIn} disabled={isLoading && !isWhatsappLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-500 text-white rounded-lg relative">
            <span>Continue with WhatsApp</span>
            {isWhatsappLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />}
          </button>

          {/* Apple */}
          <button onClick={handleAppleSignIn} disabled={isLoading && !isAppleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black text-white rounded-lg relative">
            <span>Continue with Apple</span>
            {isAppleLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />}
          </button>

          {/* PIN */}
          <button onClick={handlePinSignIn} disabled={isLoading && !isPinLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span>Continue with PIN</span>
            {isPinLoading && <div className="absolute right-4 animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent" />}
          </button>

        </div>

        {/* Secure Authentication Footer */}
        <div className={`flex items-center justify-center gap-2 ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <TranslatedText className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Secure Authentication
          </TranslatedText>
        </div>

        {/* Terms Footer */}
        <p className={`text-gray-500 text-center ${isCompact ? 'text-[10px] leading-tight px-2' : 'text-xs leading-relaxed'}`}>
          <TranslatedText>
            By proceeding, you confirm that you've read and agree to our
          </TranslatedText>{' '}
          <TranslatedText className="text-red-500">Terms of Service</TranslatedText>{' '}
          <TranslatedText>and</TranslatedText>{' '}
          <TranslatedText className="text-red-500">Privacy Policy</TranslatedText>
        </p>
      </div>
    </div>
  );
};

export default MainLoginScreen;