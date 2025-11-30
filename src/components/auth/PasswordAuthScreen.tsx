import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PasswordAuthScreenProps {
  email: string;
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
  showHeader?: boolean;
}

const PasswordAuthScreen: React.FC<PasswordAuthScreenProps> = ({
  email,
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
  const [error, setError] = useState('');

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Color palette following AliExpress hierarchy
  const colors = {
    primary: '#FF4747',     // Brand CTA Red - strongest
    link: '#FF7060',        // Link Red - lighter
    error: '#D93025',       // Error Red - darker
    softBg: '#FFE8E6',      // Soft background for errors
    subtle: '#FF8A7D',      // Very subtle for legal text
  };

  useEffect(() => {
    console.log('🔐 PasswordAuthScreen received email:', email);
  }, [email]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting to login with:', { email });

      const loginData = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

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
          errorMessage = 'No account found with this email. Please sign up first.';
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
      console.log('Signing in with email:', email);
      const { error: loginError } = await login(email, password);

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

          {/* Email Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Mail className="w-full h-full text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                    {email}
                  </span>
                </div>
              </div>
              <button
                onClick={onBack}
                disabled={isLoading}
                className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'} disabled:opacity-50`}
                style={{ color: colors.link }}
                type="button"
              >
                Change
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className={`p-4 border rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}
              style={{ 
                borderColor: colors.error,
                backgroundColor: colors.softBg 
              }}
            >
              <p 
                className={isCompact ? 'text-xs' : 'text-sm'}
                style={{ color: colors.error }}
              >
                {error}
              </p>
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
                } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  error ? 'border-red-300' : 'border-gray-300'
                } ${isCompact ? 'shadow-sm' : ''}`}
                style={{
                  focusRingColor: colors.primary
                }}
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

            {/* Sign In Button - PRIMARY CTA (Strongest Red) */}
            <button
              disabled={!isPasswordValid || isLoading}
              onClick={handleSignIn}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg transition-colors ${
                isPasswordValid && !isLoading
                  ? 'text-white hover:shadow-md active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
              } ${isCompact ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: isPasswordValid && !isLoading ? colors.primary : undefined,
                borderColor: isPasswordValid && !isLoading ? colors.primary : undefined,
              }}
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

            {/* Forgot Password - LINK RED (Lighter) */}
            <div className="text-center">
              <button
                className={`font-medium disabled:opacity-50 ${isCompact ? 'text-sm' : 'text-base'}`}
                style={{ color: colors.link }}
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

        {/* Terms Footer - SUBTLE RED (Lightest) */}
        <p className={`text-center ${isCompact ? 'text-[10px] leading-tight px-2' : 'text-xs leading-relaxed'}`}
           style={{ color: colors.subtle }}>
          By proceeding, you confirm that you've read and agree to our{' '}
          <span style={{ color: colors.link }}>Terms of Service</span>{' '}
          and{' '}
          <span style={{ color: colors.link }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordAuthScreen;