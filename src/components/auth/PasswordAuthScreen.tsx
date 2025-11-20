import React, { useState, useRef } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Phone, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { useAuth } from '../../contexts/auth/AuthContext';
import { toast } from 'sonner';

interface PasswordAuthScreenProps {
  email?: string;
  phone?: string;
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
  showHeader?: boolean;
}

// Helper function to parse phone number and get country info
const parsePhoneNumber = (phone: string) => {
  // Default to US if no country code detected
  let countryCode = '+1';
  let nationalNumber = phone;
  
  // Extract country code if present (simple detection)
  if (phone.startsWith('+')) {
    const plusIndex = phone.indexOf('+');
    const spaceIndex = phone.indexOf(' ');
    if (spaceIndex > -1) {
      countryCode = phone.substring(plusIndex, spaceIndex);
      nationalNumber = phone.substring(spaceIndex + 1);
    } else {
      // Handle cases like +1234567890 - assume US/Canada
      if (phone.startsWith('+1') && phone.length >= 11) {
        countryCode = '+1';
        nationalNumber = phone.substring(2);
      }
    }
  }
  
  // Get country flag emoji based on country code
  const getFlagEmoji = (countryCode: string) => {
    const flagMap: { [key: string]: string } = {
      '+1': '🇺🇸', // USA/Canada
      '+44': '🇬🇧', // UK
      '+91': '🇮🇳', // India
      '+86': '🇨🇳', // China
      '+81': '🇯🇵', // Japan
      '+49': '🇩🇪', // Germany
      '+33': '🇫🇷', // France
      '+39': '🇮🇹', // Italy
      '+34': '🇪🇸', // Spain
      '+55': '🇧🇷', // Brazil
      '+52': '🇲🇽', // Mexico
      '+61': '🇦🇺', // Australia
      '+64': '🇳🇿', // New Zealand
      '+27': '🇿🇦', // South Africa
      '+82': '🇰🇷', // South Korea
      '+7': '🇷🇺',  // Russia
    };
    
    return flagMap[countryCode] || '📱';
  };
  
  // Format national number for display
  const formatNationalNumber = (number: string) => {
    // Simple formatting for US numbers
    if (countryCode === '+1' && number.length === 10) {
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
    return number;
  };
  
  return {
    countryCode,
    nationalNumber: formatNationalNumber(nationalNumber),
    flagEmoji: getFlagEmoji(countryCode),
    fullDisplay: `${countryCode} ${formatNationalNumber(nationalNumber)}`
  };
};

const PasswordAuthScreen: React.FC<PasswordAuthScreenProps> = ({
  email,
  phone,
  onBack,
  onSignInSuccess,
  onForgotPasswordClick,
  isCompact = false,
  onExpand,
  showHeader = true
}) => {
  const { login, loginWithPhone, isLoading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
    setError('');
  };

  const handleSignIn = async () => {
    if (!password.trim() || isLoading || authLoading) return;

    setIsLoading(true);
    setError('');

    try {
      let loginError: string | null = null;

      if (email) {
        // Email-based login
        const result = await login(email.trim().toLowerCase(), password);
        loginError = result.error;
      } else if (phone) {
        // Phone-based login
        const result = await loginWithPhone(phone.trim(), password);
        loginError = result.error;
      } else {
        loginError = 'No email or phone provided';
      }

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

  // Get display info based on login type
  const getDisplayInfo = () => {
    if (email) {
      const domain = email.split('@')[1] || '';
      const faviconUrl = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}`;
      return {
        type: 'email' as const,
        icon: <Mail className="w-full h-full text-gray-400" />,
        faviconUrl,
        displayText: email,
        label: 'Email'
      };
    } else if (phone) {
      const phoneInfo = parsePhoneNumber(phone);
      return {
        type: 'phone' as const,
        icon: <Phone className="w-full h-full text-gray-400" />,
        faviconUrl: null,
        displayText: phoneInfo.fullDisplay,
        label: 'Phone',
        phoneInfo
      };
    }
    return {
      type: 'email' as const,
      icon: <Mail className="w-full h-full text-gray-400" />,
      faviconUrl: null,
      displayText: '',
      label: 'Email'
    };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading || authLoading}
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
            disabled={isLoading || authLoading}
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

          {/* Email/Phone Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {displayInfo.type === 'email' && displayInfo.faviconUrl ? (
                    <img
                      src={displayInfo.faviconUrl}
                      alt="Email provider favicon"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : displayInfo.type === 'phone' ? (
                    <span className="text-lg leading-none">{displayInfo.phoneInfo?.flagEmoji}</span>
                  ) : (
                    displayInfo.icon
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                    {displayInfo.displayText}
                  </span>
                  {displayInfo.type === 'phone' && displayInfo.phoneInfo && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {displayInfo.phoneInfo.countryCode}
                      </span>
                      <span className="text-xs text-gray-500">
                        {displayInfo.phoneInfo.nationalNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onBack}
                disabled={isLoading || authLoading}
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
                disabled={isLoading || authLoading}
                className={`relative w-full pl-10 ${
                  isPasswordValid && !error ? 'pr-16' : 'pr-10'
                } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  error ? 'border-red-300' : 'border-gray-300'
                } ${isCompact ? 'shadow-sm' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || authLoading}
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
              disabled={!isPasswordValid || isLoading || authLoading}
              onClick={handleSignIn}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                isPasswordValid && !isLoading && !authLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${isCompact ? 'shadow-sm' : ''}`}
              type="button"
            >
              {isLoading || authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                {isLoading || authLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </button>

            {/* Forgot Password - Show for both email and phone */}
            <div className="text-center">
              <button
                className={`text-red-500 hover:text-red-600 font-medium disabled:opacity-50 ${isCompact ? 'text-sm' : 'text-base'}`}
                type="button"
                onClick={onForgotPasswordClick}
                disabled={isLoading || authLoading}
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