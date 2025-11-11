import React, { useState, useRef } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { useAuth } from '../../contexts/auth/AuthContext';
import { toast } from 'sonner';

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
  const { login, isLoading: authLoading } = useAuth();
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
      const { error: loginError } = await login(email.trim().toLowerCase(), password);

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

  return (
    <div className={isCompact ? "bg-white flex flex-col px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading || authLoading}
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-base font-semibold text-gray-900">
            Welcome Back
          </h2>

          <button
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
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
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Enter your password
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in with your password
          </p>
        </div>

        {/* Email element - same height as password field */}
        <div className="mb-3 h-[42px]">
          <div className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-lg h-full">
            <div className="flex items-center gap-2">
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
              <span className="text-gray-700 text-sm">{email}</span>
            </div>
            <button
              onClick={onBack}
              disabled={isLoading || authLoading}
              className="text-red-500 hover:text-red-600 text-xs font-medium disabled:opacity-50"
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs text-center">{error}</p>
          </div>
        )}

        <div className="mb-3 relative">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
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
              className={`relative w-full pl-9 ${
                isPasswordValid && !error ? 'pr-16' : 'pr-10'
              } py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || authLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {isPasswordValid && !error && (
              <Check className="absolute right-9 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Sign in button first */}
        <div className="space-y-2.5 mb-3">
          <button
            disabled={!isPasswordValid || isLoading || authLoading}
            onClick={handleSignIn}
            className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-lg font-medium transition-all ${
              isPasswordValid && !isLoading && !authLoading
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isLoading || authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>{isLoading || authLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </div>

        {/* Forgot password button after sign in button */}
        <div className="text-center mb-4">
          <button
            className="text-red-500 text-sm hover:text-red-600 font-medium disabled:opacity-50"
            type="button"
            onClick={onForgotPasswordClick}
            disabled={isLoading || authLoading}
          >
            Forgot password?
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-xs">
              Your session is secured with HTTP-only cookies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordAuthScreen;