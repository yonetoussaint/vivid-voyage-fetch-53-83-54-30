import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Lock, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';

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
  const { login } = useAuth();

  // Password validation criteria
  const hasMinLength = password.length >= 6;
  const hasMatch = password === confirmPassword && confirmPassword.length > 0;

  const isPasswordValid = hasMinLength;
  const doPasswordsMatch = hasMatch;
  const canResetPassword = isPasswordValid && doPasswordsMatch && !isLoading;

  // Password reset function
  const completePasswordReset = async (email: string, otp: string, newPassword: string) => {
    console.log('🔐 Completing password reset:', { email, hasOtp: !!otp, passwordLength: newPassword.length });

    try {
      const BACKEND_URL = 'https://resend-u11p.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/complete-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          otp: otp.trim(),
          newPassword 
        }),
      });

      console.log('📡 Password reset response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('📡 Password reset response data:', result);

      if (!result.success) {
        throw new Error(result.error || 'Password reset failed');
      }

      return { 
        success: true, 
        message: result.message 
      };
    } catch (error: any) {
      console.error('❌ Failed to complete password reset:', error);

      let userFriendlyError = error.message;

      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        userFriendlyError = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('OTP') || error.message.includes('code') || error.message.includes('expired')) {
        userFriendlyError = 'Invalid or expired verification code. Please request a new password reset code.';
      } else if (error.message.includes('User not found')) {
        userFriendlyError = 'No account found with this email address. Please check your email and try again.';
      }

      return { 
        success: false, 
        error: userFriendlyError 
      };
    }
  };

  // Auto sign-in after password reset
  const handleAutoSignIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting auto sign-in after password reset...');
      const result = await login(email, password);
      
      if (result.error) {
        console.log('⚠️ Auto sign-in failed, but password was reset:', result.error);
        // Don't throw error here - password reset was successful, just auto sign-in failed
        return { success: false, error: result.error };
      }
      
      console.log('✅ Auto sign-in successful after password reset');
      return { success: true };
    } catch (error) {
      console.error('❌ Auto sign-in error:', error);
      return { success: false, error: 'Auto sign-in failed' };
    }
  };

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
      console.log('🔄 Starting password reset process...');
      const result = await completePasswordReset(email, otp, password);

      if (!result.success) {
        setError(result.error || 'Failed to reset password. Please try again.');
        return;
      }

      toast.success('Password reset successfully! Signing you in...');

      // Attempt automatic sign-in with the new password
      const signInResult = await handleAutoSignIn(email, password);
      
      if (signInResult.success) {
        // Successfully signed in - proceed to success screen
        setTimeout(() => {
          onPasswordResetSuccess();
        }, 1000);
      } else {
        // Password reset successful but auto sign-in failed
        toast.success('Password reset successfully! Please sign in with your new password.');
        setTimeout(() => {
          onPasswordResetSuccess();
        }, 1500);
      }

    } catch (error: any) {
      console.error('💥 Password reset error:', error);
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
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header - hide in compact mode */}
      {!isCompact && (
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

      {/* Main content container */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Create new password
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Your new password must be different from your previous one
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className={isCompact ? 'text-xs' : 'text-sm'}>{error}</p>
              </div>
            </div>
          )}

          {/* Password Inputs */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            {/* New Password Input */}
            <div>
              <label className={`block font-medium text-gray-700 mb-3 ${isCompact ? 'text-sm' : 'text-base'}`}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className={`relative w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed ${isCompact ? 'shadow-sm' : ''}`}
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
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
                <span className={`text-xs flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {hasMinLength ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  At least 6 characters
                </span>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className={`block font-medium text-gray-700 mb-3 ${isCompact ? 'text-sm' : 'text-base'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className={`relative w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed ${isCompact ? 'shadow-sm' : ''}`}
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
                <div className="mt-2">
                  <span className={`text-xs flex items-center gap-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {doPasswordsMatch ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              onClick={handleCompletePasswordReset}
              disabled={!canResetPassword}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                canResetPassword
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500 transform active:scale-95'
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
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </span>
            </button>
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

export default NewPasswordScreen;