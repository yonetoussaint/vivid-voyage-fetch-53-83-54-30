// AccountCreationNameStep.tsx (simplified)
import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Input } from '../../components/ui/input';

interface AccountCreationNameStepProps {
  email: string;
  onBack: () => void;
  onChangeEmail: () => void;
  onContinue: (firstName: string, lastName: string) => void;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  nameErrors: { firstName: string; lastName: string };
  isFormValid: boolean;
  faviconUrl: string | null;
  isCompact?: boolean;
}

const AccountCreationNameStep: React.FC<AccountCreationNameStepProps> = ({
  email,
  onBack,
  onChangeEmail,
  onContinue,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  nameErrors,
  isFormValid,
  faviconUrl,
  isCompact = false,
}) => {
  const currentError = nameErrors.firstName || nameErrors.lastName;

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
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

      {/* Progress Bar */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              What's your name?
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We'll use this to personalize your experience
            </p>
          </div>

          {/* Email Display */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
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
                <span className={`text-gray-700 font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {email}
                </span>
              </div>
              <button
                onClick={onChangeEmail}
                className={`text-red-500 hover:text-red-600 font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}
              >
                Change
              </button>
            </div>
          </div>

          {/* Status Message Box */}
          {currentError && (
            <div className={`p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
              <p className={isCompact ? 'text-xs' : 'text-sm'}>{currentError}</p>
            </div>
          )}

          {/* Name Form */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                  placeholder="First name"
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                    nameErrors.firstName ? 'border-red-500' : ''
                  } ${isCompact ? 'shadow-sm' : ''}`}
                />
              </div>

              <div className="flex-1">
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                  placeholder="Last name"
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                    nameErrors.lastName ? 'border-red-500' : ''
                  } ${isCompact ? 'shadow-sm' : ''}`}
                />
              </div>
            </div>

            {/* Continue Button */}
            <button 
              onClick={() => onContinue(firstName, lastName)}
              disabled={!isFormValid}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg transition-colors ${
                isFormValid 
                  ? 'bg-red-500 text-white hover:bg-red-600 border-red-500' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${isCompact ? 'shadow-sm' : ''}`}
            >
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                Continue
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

export default AccountCreationNameStep;