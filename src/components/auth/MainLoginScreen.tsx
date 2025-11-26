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
  const [isAppleLoading, setIsAppleLoading] = useState(false);  
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);  
  const [isPinLoading, setIsPinLoading] = useState(false);  
  const [isExpanded, setIsExpanded] = useState(false);  

  const languages: Language[] = [  
    { code: 'ht', name: 'Kreyòl Ayisyen', country: 'HT', countryName: 'Haiti' },  
    { code: 'fr', name: 'Français', country: 'FR', countryName: 'France' },  
    { code: 'en', name: 'English', country: 'US', countryName: 'United States' },  
    { code: 'es', name: 'Español', country: 'ES', countryName: 'Spain' },  
    { code: 'pt', name: 'Português', country: 'PT', countryName: 'Portugal' },  
  ];  

  const currentLang = languages.find(lang => lang.code === selectedLanguage);  
  const isLoading = isGoogleLoading || isFacebookLoading || isEmailLoading || isPhoneLoading || isAppleLoading || isWhatsAppLoading || isPinLoading;  

  // Google OAuth function  
  const googleSignIn = async () => {  
    try {  
      const BACKEND_URL = 'https://resend-u11p.onrender.com';  
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          redirectTo: `${window.location.origin}/auth/callback`  
        }),  
      });  

      const result = await response.json();  

      if (!result.success) {  
        return { error: result.error || 'Failed to initialize Google sign in' };  
      }  

      window.location.href = result.authUrl;  
      return {};  

    } catch (error: any) {  
      return { error: error.message || 'Failed to sign in with Google' };  
    }  
  };  

  const handleGoogleSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsGoogleLoading(true);  
      const result = await googleSignIn();  

      if (result.error) {  
        toast.error(result.error || 'Failed to sign in with Google');  
        setIsGoogleLoading(false);  
      }  
    } catch (error) {  
      toast.error('An unexpected error occurred');  
      setIsGoogleLoading(false);  
    }  
  };  

  /* Comment out for later implementation
  const handleFacebookSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsFacebookLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 2000));  
      toast.info('Facebook sign in coming soon!');  
      setIsFacebookLoading(false);  
    } catch (error) {  
      toast.error('Facebook sign in is currently unavailable');  
      setIsFacebookLoading(false);  
    }  
  };  
  */

  const handleEmailSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsEmailLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 500));  
      onContinueWithEmail();  
    } catch (error) {  
      setIsEmailLoading(false);  
    }  
  };  

  /* Comment out for later implementation
  const handlePhoneSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsPhoneLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 500));  
      onContinueWithPhone();  
    } catch (error) {  
      setIsPhoneLoading(false);  
    }  
  };  

  const handleAppleSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsAppleLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 2000));  
      toast.info('Apple sign in coming soon!');  
      setIsAppleLoading(false);  
    } catch (error) {  
      toast.error('Apple sign in is currently unavailable');  
      setIsAppleLoading(false);  
    }  
  };  

  const handleWhatsAppSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsWhatsAppLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 2000));  
      toast.info('WhatsApp sign in coming soon!');  
      setIsWhatsAppLoading(false);  
    } catch (error) {  
      toast.error('WhatsApp sign in is currently unavailable');  
      setIsWhatsAppLoading(false);  
    }  
  };  

  const handlePinSignIn = async () => {  
    if (isLoading) return;  

    try {  
      setIsPinLoading(true);  
      await new Promise(resolve => setTimeout(resolve, 2000));  
      toast.info('PIN sign in coming soon!');  
      setIsPinLoading(false);  
    } catch (error) {  
      toast.error('PIN sign in is currently unavailable');  
      setIsPinLoading(false);  
    }  
  };  
  */

  const toggleExpand = () => {  
    setIsExpanded(!isExpanded);  
  };  

  return (  
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>  
      {/* Header section - optional */}  
      {showHeader && !isCompact && (  
        <div className="pt-4 pb-4 flex items-center justify-between">  
          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />  
          <div className="flex items-center">  
            <img   
              src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${currentLang?.country.toLowerCase()}.svg`}  
              alt={`${currentLang?.name} flag`}  
              className="w-8 h-8 rounded-full object-cover"  
            />  
          </div>  
        </div>  
      )}  

      {/* Title and Subtitle for Compact Mode */}  
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
          {/* Google Sign In Button - Always Visible */}  
          <button   
            onClick={handleGoogleSignIn}  
            disabled={isLoading && !isGoogleLoading}  
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
              isCompact ? 'shadow-sm' : ''  
            }`}  
          >  
            <div className="flex items-center gap-3">  
              <svg className="w-5 h-5" viewBox="0 0 24 24">  
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>  
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>  
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>  
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>  
              </svg>  
              <span className="text-gray-700 font-medium">  
                Continue with Google  
              </span>  
            </div>  

            {/* Spinner on the right side */}  
            {isGoogleLoading && (  
              <div className="absolute right-4">  
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
              </div>  
            )}  
          </button>  

          {/* Email Sign In Button - Always Visible */}  
          <button   
            onClick={handleEmailSignIn}  
            disabled={isLoading && !isEmailLoading}  
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
              isCompact ? 'shadow-sm' : ''  
            }`}  
          >  
            <div className="flex items-center gap-3">  
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">  
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>  
              </svg>  
              <TranslatedText className="text-gray-700 font-medium">  
                Continue with Email  
              </TranslatedText>  
            </div>  

            {/* Spinner on the right side */}  
            {isEmailLoading && (  
              <div className="absolute right-4">  
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
              </div>  
            )}  
          </button>  

          {/* Facebook Sign In Button - Commented out for later implementation */}
          {/*
          <button   
            onClick={handleFacebookSignIn}  
            disabled={isLoading && !isFacebookLoading}  
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
              isCompact ? 'shadow-sm' : ''  
            }`}  
          >  
            <div className="flex items-center gap-3">  
              <svg className="w-5 h-5" viewBox="0 0 24 24">  
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>  
              </svg>  
              <TranslatedText className="text-gray-700 font-medium">  
                Continue with Facebook  
              </TranslatedText>  
            </div>  

            {isFacebookLoading && (  
              <div className="absolute right-4">  
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
              </div>  
            )}  
          </button>  
          */}

          {/* Expandable Section - Commented out for later implementation */}
          {/*
          {isExpanded && (  
            <div className="space-y-3 animate-in fade-in duration-300">  
              <button   
                onClick={handlePhoneSignIn}  
                disabled={isLoading && !isPhoneLoading}  
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
                  isCompact ? 'shadow-sm' : ''  
                }`}  
              >  
                <div className="flex items-center gap-3">  
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">  
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>  
                  </svg>  
                  <TranslatedText className="text-gray-700 font-medium">  
                    Continue with Phone  
                  </TranslatedText>  
                </div>  

                {isPhoneLoading && (  
                  <div className="absolute right-4">  
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
                  </div>  
                )}  
              </button>  

              <button   
                onClick={handleAppleSignIn}  
                disabled={isLoading && !isAppleLoading}  
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
                  isCompact ? 'shadow-sm' : ''  
                }`}  
              >  
                <div className="flex items-center gap-3">  
                  <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">  
                    <path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z"/>  
                    <path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z"/>  
                  </svg>  
                  <TranslatedText className="text-gray-700 font-medium">  
                    Continue with Apple  
                  </TranslatedText>  
                </div>  

                {isAppleLoading && (  
                  <div className="absolute right-4">  
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
                  </div>  
                )}  
              </button>  

              <button   
                onClick={handleWhatsAppSignIn}  
                disabled={isLoading && !isWhatsAppLoading}  
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
                  isCompact ? 'shadow-sm' : ''  
                }`}  
              >  
                <div className="flex items-center gap-3">  
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">  
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.179-3.495-8.428"/>  
                  </svg>  
                  <TranslatedText className="text-gray-700 font-medium">  
                    Continue with WhatsApp  
                  </TranslatedText>  
                </div>  

                {isWhatsAppLoading && (  
                  <div className="absolute right-4">  
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
                  </div>  
                )}  
              </button>  

              <button   
                onClick={handlePinSignIn}  
                disabled={isLoading && !isPinLoading}  
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${  
                  isCompact ? 'shadow-sm' : ''  
                }`}  
              >  
                <div className="flex items-center gap-3">  
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">  
                    <path d="M12 1C8.676 1 6 3.676 6 7v3H4v12h16V10h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4zm-2 10c0-1.103.897-2 2-2s2 .897 2 2-.897 2-2 2-2-.897-2-2z"/>  
                  </svg>  
                  <TranslatedText className="text-gray-700 font-medium">  
                    Continue with PIN  
                  </TranslatedText>  
                </div>  
  
                {isPinLoading && (  
                  <div className="absolute right-4">  
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>  
                  </div>  
                )}  
              </button>  
            </div>  
          )}  

          <button  
            onClick={toggleExpand}  
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${  
              isCompact ? 'shadow-sm' : ''  
            }`}  
          >  
            <svg   
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${  
                isExpanded ? 'rotate-180' : ''  
              }`}  
              fill="none"   
              stroke="currentColor"   
              viewBox="0 0 24 24"  
            >  
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />  
            </svg>  
            <span className="text-gray-600 font-medium text-sm">  
              {isExpanded ? 'Show Less' : 'More Options'}  
            </span>  
          </button>  
          */}
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