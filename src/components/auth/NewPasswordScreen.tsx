import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth/AuthContext';

interface NewPasswordScreenProps {
  email: string;
  otp: string;
  onBack: () => void;
  onPasswordResetSuccess: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({
  email,
  otp,
  onBack,
  onPasswordResetSuccess,
  isCompact = false,
  onExpand
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Use the AuthContext function
  const { completePasswordReset } = useAuth();

  // Password validation criteria
  const hasMinLength = password.length >= 6;
  const hasMatch = password === confirmPassword && confirmPassword.length > 0;

  const isPasswordValid = hasMinLength;
  const doPasswordsMatch = hasMatch;
  const canResetPassword = isPasswordValid && doPasswordsMatch && !isLoading;

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        console.log('🔍 Checking server health...');
        const response = await fetch('https://resend-u11p.onrender.com/health');
        if (response.ok) {
          console.log('✅ Server is online');
          setServerStatus('online');
        } else {
          console.warn('⚠️ Server health check failed');
          setServerStatus('offline');
        }
      } catch (error) {
        console.error('❌ Cannot reach server:', error);
        setServerStatus('offline');
      }
    };

    checkServerHealth();
  }, []);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError('');
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError('');
  };

  const handleCompletePasswordReset = async () => {
    if (!canResetPassword) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('🔄 Starting complete password reset process...');
      console.log('📧 Email:', email);
      console.log('🔑 OTP:', otp);
      console.log('🔒 Password length:', password.length);
      console.log('🌐 Server status:', serverStatus);
      
      if (serverStatus === 'offline') {
        throw new Error('Server is currently unavailable. Please try again later.');
      }

      // Use the AuthContext function
      const result = await completePasswordReset(email, otp, password);

      if (!result.success) {
        console.error('❌ Password reset failed:', result.error);
        
        // Provide more specific error messages
        let userFriendlyError = result.error || 'Failed to reset password. Please try again.';
        
        if (result.error?.includes('OTP')) {
          userFriendlyError = 'Invalid or expired verification code. Please request a new code.';
        } else if (result.error?.includes('User not found')) {
          userFriendlyError = 'No account found with this email address.';
        } else if (result.error?.includes('network') || result.error?.includes('fetch')) {
          userFriendlyError = 'Network error. Please check your internet connection.';
        }
        
        setError(userFriendlyError);
        return;
      }

      console.log('✅ Password reset successful');
      
      // Show success message
      toast.success('Password reset successfully! You can now sign in with your new password.');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        onPasswordResetSuccess();
      }, 1500);

    } catch (error: any) {
      console.error('💥 Unexpected error during password reset:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canResetPassword) {
      handleCompletePasswordReset();
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { text: 'Enter a password', color: 'text-gray-400' };
    if (password.length < 6) return { text: 'Too short', color: 'text-red-500' };
    if (password.length < 8) return { text: 'Fair', color: 'text-yellow-500' };
    return { text: 'Good', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="bg-white flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Create New Password
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@mimaht.com')}
            type="button"
            disabled={isLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Progress Bar - always show */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Server Status Indicator */}
      {serverStatus === 'offline' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <p className="text-red-600 text-sm">
              Server is currently unavailable. Some features may not work.
            </p>
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Create new password
          </h1>
          <p className="text-gray-600">
            Your new password must be different from your previous one
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* New Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter new password"
              disabled={isLoading}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              autoComplete="new-password"
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
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-xs ${passwordStrength.color}`}>
              {passwordStrength.text}
            </p>
            <p className={`text-xs ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
              {hasMinLength ? (
                <Check className="w-4 h-4 inline" />
              ) : (
                <X className="w-4 h-4 inline" />
              )}{' '}
              At least 6 characters
            </p>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-8">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm new password"
              disabled={isLoading}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmPassword.length > 0 && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
              {doPasswordsMatch ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}
        </div>

        {/* Reset Password Button */}
        <button
          onClick={handleCompletePasswordReset}
          disabled={!canResetPassword}
          className={`w-full py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 mb-6 ${
            canResetPassword
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Resetting Password...
            </div>
          ) : (
            'Reset Password'
          )}
        </button>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <span className="text-gray-500 text-sm">Your password is secure with us</span>
        </div>

        {/* Debug Info (only show in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Debug Info:</strong><br />
              Email: {email}<br />
              OTP: {otp}<br />
              Password Length: {password.length}<br />
              Server: {serverStatus}<br />
              Can Reset: {canResetPassword ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPasswordScreen;