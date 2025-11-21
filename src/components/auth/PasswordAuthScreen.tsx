import React, { useState, useRef } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Phone, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PasswordAuthScreenProps {
  email: string;
  phone?: string;
  authMethod?: 'email' | 'phone';
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
  showHeader?: boolean;
}

// Phone flag images using FlagCDN
const PHONE_FLAG_IMAGES: Record<string, string> = {
  'us': 'https://flagcdn.com/us.svg',
  'ca': 'https://flagcdn.com/ca.svg',
  'gb': 'https://flagcdn.com/gb.svg',
  'fr': 'https://flagcdn.com/fr.svg',
  'de': 'https://flagcdn.com/de.svg',
  'es': 'https://flagcdn.com/es.svg',
  'it': 'https://flagcdn.com/it.svg',
  'br': 'https://flagcdn.com/br.svg',
  'mx': 'https://flagcdn.com/mx.svg',
  'ht': 'https://flagcdn.com/ht.svg',
  'do': 'https://flagcdn.com/do.svg',
  'cn': 'https://flagcdn.com/cn.svg',
  'jp': 'https://flagcdn.com/jp.svg',
  'kr': 'https://flagcdn.com/kr.svg',
  'in': 'https://flagcdn.com/in.svg',
  'au': 'https://flagcdn.com/au.svg',
  'nz': 'https://flagcdn.com/nz.svg',
  'ru': 'https://flagcdn.com/ru.svg',
  'sa': 'https://flagcdn.com/sa.svg',
  'ae': 'https://flagcdn.com/ae.svg',
  'za': 'https://flagcdn.com/za.svg',
  'ng': 'https://flagcdn.com/ng.svg',
  'eg': 'https://flagcdn.com/eg.svg',
  'ke': 'https://flagcdn.com/ke.svg',
};

const DEFAULT_FLAG_IMAGE = 'https://flagcdn.com/us.svg';

const PasswordAuthScreen: React.FC<PasswordAuthScreenProps> = ({
  email,
  phone,
  authMethod = 'email',
  onBack,
  onSignInSuccess,
  onForgotPasswordClick,
  isCompact = false,
  onExpand,
  showHeader = true
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Extract country code and formatted phone number
  const getPhoneDisplayInfo = (phoneNumber: string) => {
    // Extract country code (assume +1 for US/Canada by default)
    let countryCode = '+1';
    let displayNumber = phoneNumber;
    
    // Try to extract country code from the phone number
    if (phoneNumber.startsWith('+')) {
      const spaceIndex = phoneNumber.indexOf(' ');
      if (spaceIndex > 0) {
        countryCode = phoneNumber.substring(0, spaceIndex);
        displayNumber = phoneNumber.substring(spaceIndex + 1);
      }
    }
    
    // Map country code to country code for flag images
    const countryMap: Record<string, string> = {
      '+1': 'us', // US/Canada
      '+44': 'gb', // UK
      '+33': 'fr', // France
      '+49': 'de', // Germany
      '+34': 'es', // Spain
      '+39': 'it', // Italy
      '+55': 'br', // Brazil
      '+52': 'mx', // Mexico
      '+509': 'ht', // Haiti
      '+1-809': 'do', // Dominican Republic
      '+1-829': 'do', // Dominican Republic
      '+1-849': 'do', // Dominican Republic
      '+86': 'cn', // China
      '+81': 'jp', // Japan
      '+82': 'kr', // South Korea
      '+91': 'in', // India
      '+61': 'au', // Australia
      '+64': 'nz', // New Zealand
      '+7': 'ru', // Russia
      '+966': 'sa', // Saudi Arabia
      '+971': 'ae', // UAE
      '+27': 'za', // South Africa
      '+234': 'ng', // Nigeria
      '+20': 'eg', // Egypt
      '+254': 'ke', // Kenya
    };
    
    const country = countryMap[countryCode] || 'us';
    const flagImage = PHONE_FLAG_IMAGES[country] || DEFAULT_FLAG_IMAGE;
    
    return { countryCode, displayNumber, country, flagImage };
  };

  // Login function using Supabase
  const login = async (identifier: string, method: 'email' | 'phone', password: string) => {
    try {
      console.log('Attempting to login with:', { identifier, method });

      let loginData;
      
      if (method === 'email') {
        // Email login
        loginData = await supabase.auth.signInWithPassword({
          email: identifier.trim().toLowerCase(),
          password,
        });
      } else {
        // Phone login - you'll need to implement this based on your auth setup
        // For now, we'll use email as fallback or you can implement phone auth
        console.log('Phone login would be implemented here');
        // This is where you'd integrate with your phone authentication system
        loginData = await supabase.auth.signInWithPassword({
          email: identifier, // Fallback - replace with actual phone auth
          password,
        });
      }

      const { data, error } = loginData;

      if (error) {
        console.error('Login error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });

        let errorMessage = error.message;

        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
          errorMessage = 'Invalid password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed') || error.message.includes('not confirmed')) {
          errorMessage = 'Please verify your account before logging in. Check your inbox for a confirmation message.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('User not found')) {
          errorMessage = `No account found with this ${method}. Please sign up first.`;
        }

        return { error: errorMessage };
      }

      if (data.user) {
        console.log('User logged in successfully:', data.user.id);
        return {};
      } else {
        console.warn('Login succeeded but no user data returned');
        return { error: 'Login failed. Please try again.' };
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An error occurred during login. Please try again.' };
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
    setError('');
  };

  const handleSignIn = async () => {
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const identifier = authMethod === 'email' ? email : (phone || '');
      const { error: loginError } = await login(identifier, authMethod, password);

      if (loginError) {
        setError(loginError);
        setPassword('');
        setIsPasswordValid(false);
        passwordInputRef.current?.focus();
        toast.error(loginError);
        return;
      }

      toast.success('Successfully signed in!');
      onSignInSuccess();
    } catch (error) {
      setError('Network error. Please try again.');
      toast.error('Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const domain = email.split('@')[1] || '';
  const faviconUrl = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}`;

  // Get phone display info if using phone auth
  const phoneInfo = authMethod === 'phone' && phone ? getPhoneDisplayInfo(phone) : null;

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Welcome Back
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@example.com')}
            type="button"
            disabled={isLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Enter your password
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Sign in with your password
            </p>
          </div>

          {/* Identifier Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {authMethod === 'email' ? (
                    faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Email provider favicon"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '';
                        }}
                      />
                    ) : (
                      <Mail className="w-full h-full text-gray-400" />
                    )
                  ) : (
                    phoneInfo ? (
                      <img
                        src={phoneInfo.flagImage}
                        alt={`${phoneInfo.country} flag`}
                        className="w-6 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_FLAG_IMAGE;
                        }}
                      />
                    ) : (
                      <Phone className="w-full h-full text-gray-400" />
                    )
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                    {authMethod === 'email' 
                      ? email
                      : phoneInfo 
                        ? `${phoneInfo.countryCode} ${phoneInfo.displayNumber}`
                        : phone
                    }
                  </span>
                  {authMethod === 'phone' && phoneInfo && (
                    <span className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                      Phone Number
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onBack}
                disabled={isLoading}
                className={`text-red-500 hover:text-red-600 font-medium ${isCompact ? 'text-xs' : 'text-sm'} disabled:opacity-50`}
                type="button"
              >
                Change
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <p className={isCompact ? 'text-xs' : 'text-sm'}>{error}</p>
            </div>
          )}

          {/* Password Field */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isPasswordValid && !isLoading) handleSignIn();
                }}
                placeholder="Password"
                autoComplete="current-password"
                ref={passwordInputRef}
                disabled={isLoading}
                className={`relative w-full pl-10 ${
                  isPasswordValid && !error ? 'pr-16' : 'pr-10'
                } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  error ? 'border-red-300' : 'border-gray-300'
                } ${isCompact ? 'shadow-sm' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {isPasswordValid && !error && (
                <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Sign In Button */}
            <button
              disabled={!isPasswordValid || isLoading}
              onClick={handleSignIn}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                isPasswordValid && !isLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${isCompact ? 'shadow-sm' : ''}`}
              type="button"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                className={`text-red-500 hover:text-red-600 font-medium disabled:opacity-50 ${isCompact ? 'text-sm' : 'text-base'}`}
                type="button"
                onClick={onForgotPasswordClick}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        {/* Secure Authentication Footer */}
        <div className={`flex items-center justify-center gap-2 ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <span className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Secure Authentication
          </span>
        </div>

        {/* Terms Footer */}
        <p className={`text-gray-500 text-center ${isCompact ? 'text-[10px] leading-tight px-2' : 'text-xs leading-relaxed'}`}>
          By proceeding, you confirm that you've read and agree to our{' '}
          <span className="text-red-500">Terms of Service</span>{' '}
          and{' '}
          <span className="text-red-500">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordAuthScreen;