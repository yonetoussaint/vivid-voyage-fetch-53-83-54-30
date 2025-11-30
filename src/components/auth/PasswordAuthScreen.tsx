import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PasswordAuthScreenProps {
  email: string;
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
  onExpand?: () => void;
}

const PasswordAuthScreen: React.FC<PasswordAuthScreenProps> = ({
  email,
  onBack,
  onSignInSuccess,
  onForgotPasswordClick,
  onExpand,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordInputRef = useRef<HTMLInputElement>(null);

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
    <div className="px-4 pb-4">
      <div className="space-y-3 mb-4">
        {/* Header Text */}
        <div className="text-center mb-6">
          <h1 className="text-xl text-gray-900 font-semibold mb-2">
            Enter your password
          </h1>
          <p className="text-sm text-gray-600">
            Sign in with your password
          </p>
        </div>

        {/* Email Display */}
        <div className="p-4 bg-gray-50 rounded-lg mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <Mail className="w-full h-full text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 font-medium">
                  {email}
                </span>
              </div>
            </div>
            <button
              onClick={onBack}
              disabled={isLoading}
              className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg mb-3">
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-3">
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
              } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
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
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors shadow-sm ${
              isPasswordValid && !isLoading
                ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </span>
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
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
      <div className="flex items-center justify-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-500">
          Secure Authentication
        </span>
      </div>

      {/* Terms Footer */}
      <p className="text-[10px] text-gray-500 text-center leading-tight px-2">
        By proceeding, you confirm that you've read and agree to our{' '}
        <span className="text-red-500">Terms of Service</span>{' '}
        and{' '}
        <span className="text-red-500">Privacy Policy</span>
      </p>
    </div>
  );
};

export default PasswordAuthScreen;