import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AccountCreationPasswordStepProps {
  email: string;
  firstName: string;
  lastName: string;
  onBack: () => void;
  onContinue: () => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  isCompact?: boolean;
  onExpand?: () => void;
}

const FAVICON_OVERRIDES: Record<string, string> = {
  'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  'outlook.com': 'https://outlook.live.com/favicon.ico',
  'yahoo.com': 'https://s.yimg.com/rz/l/favicon.ico',
};

const AccountCreationPasswordStep: React.FC<AccountCreationPasswordStepProps> = ({
  email,
  firstName,
  lastName,
  onBack,
  onContinue,
  onError,
  isLoading: parentLoading = false,
  isCompact = false,
  onExpand
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const getFaviconUrl = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      return FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
    }
    return null;
  };

  const faviconUrl = getFaviconUrl(email);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const isFormValid = () => {
    return (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword &&
      validatePassword(password) === null
    );
  };

  const handleCreateAccount = async () => {
    if (!isFormValid() || isLoading) return;

    console.log('AccountCreationPasswordStep: handleCreateAccount called');
    setIsLoading(true);

    try {
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('AccountCreationPasswordStep: Account created successfully, calling onContinue');
      onContinue();
    } catch (error) {
      console.error('Account creation error:', error);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || parentLoading;

  return (
    <div className="flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Create Account</h2>
          <div className="w-10 h-10"></div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Create your password
          </h1>
          <p className="text-gray-600 text-sm">
            Choose a secure password for your account
          </p>
        </div>

        {/* Account Info Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Email provider favicon"
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <Mail className="w-full h-full text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 font-medium truncate text-sm">{email}</div>
              <div className="text-gray-600 text-xs">
                {firstName} {lastName}
              </div>
            </div>
          </div>
        </div>

        {/* Password Form */}
        <div className="space-y-3 mb-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreateAccount}
          disabled={!isFormValid() || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationPasswordStep;