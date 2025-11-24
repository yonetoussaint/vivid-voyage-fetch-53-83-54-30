import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FAVICON_OVERRIDES } from '../../constants/auth/email';

interface AccountCreationSuccessStepProps {
  email: string;
  firstName: string;
  lastName: string;
  onContinue: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const AccountCreationSuccessStep: React.FC<AccountCreationSuccessStepProps> = ({
  email,
  firstName,
  lastName,
  onContinue,
  isCompact = false,
  onExpand
}) => {
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

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <div className="w-10 h-10"></div>
          <h2 className="text-lg font-semibold text-gray-900">Account Created</h2>
          <div className="w-10 h-10"></div>
        </div>
      )}

      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Success Icon */}
          <div className={`text-center ${isCompact ? 'mb-6' : 'mb-8'}`}>
            <div className={`mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 ${
              isCompact ? 'w-16 h-16' : 'w-20 h-20'
            }`}>
              <CheckCircle className={`text-green-500 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </div>

            <h1 className={`text-gray-900 font-semibold mb-2 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Welcome, {firstName}!
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              Your account has been created successfully
            </p>
          </div>

          {/* Account Info */}
          <div className={`p-4 bg-gray-50 rounded-lg ${isCompact ? 'mb-3' : 'mb-4'}`}>
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
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
              <div className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
                {firstName} {lastName}
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <button 
            onClick={onContinue}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-red-500 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors ${isCompact ? 'shadow-sm' : ''}`}
          >
            <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
              Get Started
            </span>
          </button>
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

export default AccountCreationSuccessStep;