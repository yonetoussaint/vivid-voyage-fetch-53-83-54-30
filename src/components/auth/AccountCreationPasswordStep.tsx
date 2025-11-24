// AccountCreationPasswordStep.tsx (fixed)
import React from 'react';
import { Lock, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AccountCreationPasswordStepProps {
  email: string;
  firstName: string;
  lastName: string;
  onBack: () => void;
  onContinue: () => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onShowPasswordChange: (show: boolean) => void;
  onShowConfirmPasswordChange: (show: boolean) => void;
  isFormValid: boolean;
  faviconUrl: string | null;
  isCompact?: boolean;
}

const AccountCreationPasswordStep: React.FC<AccountCreationPasswordStepProps> = ({
  email,
  firstName,
  lastName,
  onBack,
  onContinue,
  isLoading = false,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onShowPasswordChange,
  onShowConfirmPasswordChange,
  isFormValid,
  faviconUrl,
  isCompact = false,
}) => {
  const loading = isLoading;

  return (
    <div className={isCompact ? "px-4 pb-4" : "bg-white flex flex-col"}>
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Create Account</h2>
          <div className="w-10 h-10"></div>
        </div>
      )}

      

      {/* Main Content - Remove fixed height constraints */}
      <div className={isCompact ? "space-y-4" : "space-y-6 flex-1 overflow-auto"}>
        {/* Header Text */}
        <div className="text-center">
          <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
            Create your password
          </h1>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
            Choose a secure password for your account
          </p>
        </div>

        {/* Account Info Summary */}
        <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? '' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Email provider favicon"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Mail className="w-full h-full text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-gray-700 font-medium truncate ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {email}
                </div>
                <div className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {firstName} {lastName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Form */}
        <div className={isCompact ? "space-y-3" : "space-y-4"}>
          <div>
            <label htmlFor="password" className={`block font-medium text-gray-700 mb-1.5 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => onShowPasswordChange(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className={`text-gray-500 mt-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block font-medium text-gray-700 mb-1.5 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => onShowConfirmPasswordChange(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Create Account Button */}
          <button 
            onClick={onContinue}
            disabled={!isFormValid || loading}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
              !isFormValid || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
            } ${isCompact ? 'shadow-sm' : ''}`}
          >
            <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </span>
          </button>
        </div>

        {/* Secure Authentication Footer */}
        <div className={`flex items-center justify-center gap-2 ${isCompact ? 'pt-2' : 'pt-4'}`}>
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

export default AccountCreationPasswordStep;