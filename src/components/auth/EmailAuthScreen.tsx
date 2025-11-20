import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, HelpCircle, Mail, AlertTriangle, Loader2, UserPlus, Lock, Key } from 'lucide-react';
import { toast } from 'sonner';

// Inline type definitions
type EmailCheckState = 'unchecked' | 'checking' | 'exists' | 'not-exists' | 'error';

interface EmailAuthScreenProps {
  onBack: () => void;
  selectedLanguage: string;
  onContinueWithPassword: (email: string) => void;
  onContinueWithCode: (email: string) => void;
  onCreateAccount: (email: string) => void;
  onSignUpClick: () => void;
  initialEmail?: string;
  isCompact?: boolean;
  onExpand?: () => void;
  showHeader?: boolean;
  onSendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  onCheckEmailExists: (email: string) => Promise<boolean>;
}

// Inline email constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com'
];

const FAVICON_OVERRIDES: Record<string, string> = {
  'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  'outlook.com': 'https://outlook.live.com/favicon.ico',
  'yahoo.com': 'https://s.yimg.com/cv/apiv2/social/images/yahoo_favicon.ico'
};

// List of trusted email providers
const TRUSTED_PROVIDERS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'fastmail.com',
  'tutanota.com',
];

// Custom hook for email validation
const useEmailValidation = (initialEmail = '', onCheckEmailExists: (email: string) => Promise<boolean>) => {
  const [email, setEmail] = useState(initialEmail);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>('unchecked');
  const [lastCheckedEmail, setLastCheckedEmail] = useState('');
  const [isUntrustedProvider, setIsUntrustedProvider] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const isFromTrustedProvider = useCallback((emailAddress: string): boolean => {
    if (!emailAddress.includes('@')) return false;
    const domain = emailAddress.split('@')[1]?.toLowerCase();
    return domain ? TRUSTED_PROVIDERS.includes(domain) : false;
  }, []);

  const hasValidEmailFormat = useCallback((emailAddress: string): boolean => {
    return EMAIL_REGEX.test(emailAddress);
  }, []);

  const validateEmail = useCallback((emailAddress: string): boolean => {
    return hasValidEmailFormat(emailAddress) && isFromTrustedProvider(emailAddress);
  }, [hasValidEmailFormat, isFromTrustedProvider]);

  const debouncedEmailCheck = useCallback((emailToCheck: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (validateEmail(emailToCheck) && emailToCheck !== lastCheckedEmail) {
        setEmailCheckState('checking');

        try {
          const exists = await onCheckEmailExists(emailToCheck);
          setEmailCheckState(exists ? 'exists' : 'not-exists');
          setLastCheckedEmail(emailToCheck);
        } catch (error) {
          setEmailCheckState('error');
          setLastCheckedEmail(emailToCheck);
        }
      }
    }, 800);
  }, [onCheckEmailExists, lastCheckedEmail, validateEmail]);

  useEffect(() => {
    const hasValidFormat = hasValidEmailFormat(email);
    const isFromTrusted = isFromTrustedProvider(email);
    const isFullyValid = hasValidFormat && isFromTrusted;

    setIsEmailValid(isFullyValid);
    const shouldShowUntrustedMessage = hasValidFormat && !isFromTrusted && email.includes('@');
    setIsUntrustedProvider(shouldShowUntrustedMessage);

    if (!isFullyValid) {
      setEmailCheckState('unchecked');
      setLastCheckedEmail('');
    } else {
      debouncedEmailCheck(email);
    }
  }, [email, debouncedEmailCheck, hasValidEmailFormat, isFromTrustedProvider]);

  useEffect(() => {
    if (initialEmail) {
      setIsEmailValid(validateEmail(initialEmail));
    }
  }, [initialEmail, validateEmail]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
    isFromTrustedProvider: isFromTrustedProvider(email),
    trustedProviders: TRUSTED_PROVIDERS,
    isUntrustedProvider,
    hasValidEmailFormat: hasValidEmailFormat(email),
  };
};

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onBack,
  selectedLanguage,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
  onSignUpClick,
  initialEmail = '',
  isCompact = false,
  onExpand,
  showHeader = true,
  onSendOTP,
  onCheckEmailExists,
}) => {
  const {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
    isUntrustedProvider,
  } = useEmailValidation(initialEmail, onCheckEmailExists);

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isCreateAccountLoading, setIsCreateAccountLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isPasswordLoading || emailCheckState !== 'exists') return;
    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onContinueWithPassword(email);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isCodeLoading || emailCheckState === 'checking') return;

    setIsCodeLoading(true);
    try {
      const result = await onSendOTP(email);

      if (result.success) {
        toast.success('Verification code sent to your email');
        onContinueWithCode(email);
      } else {
        toast.error(result.error || 'Failed to send verification code');
        setIsCodeLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      setIsCodeLoading(false);
    }
  };

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isCreateAccountLoading || emailCheckState === 'checking') return;
    setIsCreateAccountLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onCreateAccount(email);
    } finally {
      setIsCreateAccountLoading(false);
    }
  };

  const isLoading = isPasswordLoading || isCodeLoading || isCreateAccountLoading;

  const renderEmailActionButtons = () => {
    const getPasswordButtonState = () => {
      if (!isEmailValid) return { disabled: true, text: 'Continue with Password' };
      if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
      if (emailCheckState === 'exists') return { disabled: false, text: 'Continue with Password' };
      if (emailCheckState === 'not-exists') return { disabled: true, text: 'Account Not Found' };
      if (emailCheckState === 'error') return { disabled: true, text: 'Check Connection' };
      return { disabled: true, text: 'Continue with Password' };
    };

    const getCodeButtonState = () => {
      if (!isEmailValid) return { disabled: true, text: 'Send Verification Code' };
      if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
      if (emailCheckState === 'exists') return { disabled: false, text: 'Send One-Time Password (OTP)' };
      if (emailCheckState === 'not-exists') return { disabled: false, text: 'Create Account' };
      if (emailCheckState === 'error') return { disabled: false, text: 'Send Verification Code' };
      return { disabled: true, text: 'Send Verification Code' };
    };

    const passwordButtonState = getPasswordButtonState();
    const codeButtonState = getCodeButtonState();

    const showCreateAccountButton = emailCheckState === 'not-exists';

    if (isUntrustedProvider) {
      return (
        <div className="space-y-3 mb-8">
          {/* No button shown for untrusted provider */}
        </div>
      );
    }

    if (!isEmailValid || emailCheckState === 'unchecked') {
      return (
        <div className="space-y-3 mb-8">
          <button
            disabled={true}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="animate-pulse">Waiting for email address</span>
              <span className="flex gap-1">
                <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0s' }}>●</span>
                <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0.4s' }}>●</span>
                <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0.8s' }}>●</span>
              </span>
            </span>
          </button>
        </div>
      );
    }

    if (emailCheckState === 'checking') {
      return (
        <div className="space-y-3 mb-8">
          <button
            disabled={true}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
            type="button"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Checking email...</span>
          </button>
        </div>
      );
    }

    if (showCreateAccountButton) {
      return (
        <div className="space-y-3 mb-8">
          <button
            disabled={isCreateAccountLoading}
            onClick={handleCreateAccountClick}
            className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
              !isCreateAccountLoading
                ? 'bg-red-500 text-white hover:bg-red-600 transform active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isCreateAccountLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            <span>{isCreateAccountLoading ? 'Loading...' : 'Create Account'}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3 mb-8">
        {/* Password Button */}
        <button
          disabled={passwordButtonState.disabled || isPasswordLoading}
          onClick={handleContinueWithPassword}
          className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
            !passwordButtonState.disabled && !isPasswordLoading
              ? 'bg-red-500 text-white hover:bg-red-600 transform active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          type="button"
        >
          {isPasswordLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          <span>{isPasswordLoading ? 'Loading...' : passwordButtonState.text}</span>
        </button>

        {/* Code Button */}
        <button
          disabled={codeButtonState.disabled || isCodeLoading}
          onClick={handleContinueWithCode}
          className={`w-full flex items-center justify-center gap-3 py-4 px-4 border-2 rounded-lg font-medium transition-all ${
            !codeButtonState.disabled && !isCodeLoading
              ? 'border-red-500 text-red-500 hover:bg-red-50 transform active:scale-95'
              : 'border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          type="button"
        >
          {isCodeLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Key className="w-5 h-5" />
          )}
          <span>{isCodeLoading ? 'Sending...' : codeButtonState.text}</span>
        </button>
      </div>
    );
  };

  const renderEmailStatusMessage = () => {
    if (isUntrustedProvider) {
      return (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg 
              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <div className="flex-1">
              <p className="text-blue-800 text-sm font-medium mb-1">
                Email provider not supported
              </p>
              <p className="text-blue-700 text-xs">
                Please use an email from Gmail, Outlook, Yahoo, iCloud, or other supported providers.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (emailCheckState === 'error') {
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg 
              className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <div className="flex-1">
              <p className="text-yellow-800 text-sm font-medium mb-1">
                Connection issue
              </p>
              <p className="text-yellow-700 text-xs">
                You can still continue with verification code if the connection doesn't improve.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (emailCheckState === 'exists') {
      return null;
    }

    if (emailCheckState === 'not-exists') {
      return (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex-1">
            <p className="text-purple-700 text-xs">
              This email isn't registered. Click "Create Account" to continue, or check for typos.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const updateFavicon = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain && FAVICON_OVERRIDES[domain]) {
      return {
        url: FAVICON_OVERRIDES[domain],
        show: true,
        domain,
      };
    }
    return {
      url: '',
      show: false,
      domain: '',
    };
  };

  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

  useEffect(() => {
    const input = emailInputRef.current;
    if (!input) return;

    const syncWithDOM = () => {
      const domValue = input.value;
      if (domValue !== email && domValue.length > 0) {
        handleEmailChange(domValue);
        return true;
      }
      return false;
    };

    const handleFocus = () => {
      setTimeout(syncWithDOM, 50);
      setTimeout(syncWithDOM, 200);
      setTimeout(syncWithDOM, 500);
    };

    const handleBlur = () => {
      syncWithDOM();
    };

    const handleInput = () => {
      syncWithDOM();
    };

    const handleChange = () => {
      syncWithDOM();
    };

    const observer = new MutationObserver(() => {
      syncWithDOM();
    });

    observer.observe(input, {
      attributes: true,
      attributeFilter: ['value']
    });

    const pollInterval = setInterval(() => {
      syncWithDOM();
    }, 100);

    const stopPolling = setTimeout(() => {
      clearInterval(pollInterval);
    }, 5000);

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleChange);

    setTimeout(syncWithDOM, 100);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(stopPolling);
      observer.disconnect();
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleChange);
    };
  }, [email]);

  const getRightSideIcon = () => {
    if (isUntrustedProvider) {
      return (
        <div className="w-5 h-5">
          <AlertTriangle className="w-full h-full text-orange-500" />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'checking') {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'exists') {
      return (
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#10b981" d="M21.672,12.954l-1.199-1.965l0.597-2.224c0.124-0.463-0.098-0.949-0.529-1.159L18.47,6.601l-0.7-2.193        c-0.146-0.457-0.596-0.746-1.072-0.689l-2.286,0.274l-1.775-1.467c-0.37-0.306-0.904-0.306-1.274,0L9.588,3.993L7.302,3.719        C6.826,3.662,6.376,3.951,6.231,4.407l-0.7,2.193L3.459,7.606C3.028,7.815,2.806,8.302,2.93,8.765l0.597,2.224l-1.199,1.965        c-0.25,0.409-0.174,0.939,0.181,1.261l1.704,1.548l0.054,2.302c0.011,0.479,0.361,0.883,0.834,0.963l2.271,0.381l1.29,1.907        c-0.269,0.397-0.782,0.548-1.222,0.359L12,20.767l2.116,0.907c0.441,0.189,0.954,0.038,1.222-0.359l1.29-1.907l2.271-0.381        c0.473-0.079,0.823-0.483,0.834-0.963l0.054-2.302l1.704-1.548C21.846,13.892,21.922,13.363,21.672,12.954z M14.948,11.682        l-2.868,3.323c-0.197,0.229-0.476,0.347-0.758,0.347c-0.215,0-0.431-0.069-0.613-0.211l-1.665-1.295        c-0.436-0.339-0.515-0.968-0.175-1.403l0,0c0.339-0.435,0.967-0.514,1.403-0.175l0.916,0.712l2.247-2.603        c0.361-0.418,0.992-0.464,1.41-0.104C15.263,10.632,15.309,11.264,14.948,11.682z"/>
          </svg>
        );
    }

    if (emailCheckState === 'not-exists') {
      return (
        <div className="w-5 h-5">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-2.517-7.665c.112-.223.268-.424.488-.57C11.186 8.12 11.506 8 12 8c.384 0 .766.118 1.034.319a.95.95 0 0 1 .403.806c0 .48-.218.81-.62 1.186a9 9 0 0 1-.409.354l-.294.249c-.246.213-.524.474-.738.795l-.126.19V13.5a.75.75 0 0 0 1.5 0v-1.12c.09-.1.203-.208.347-.333.063-.055.14-.119.222-.187.166-.14.358-.3.52-.452.536-.5 1.098-1.2 1.098-2.283a2.45 2.45 0 0 0-1.003-2.006C13.37 6.695 12.658 6.5 12 6.5c-.756 0-1.373.191-1.861.517a2.94 2.94 0 0 0-.997 1.148.75.75 0 0 0 1.341.67"/>
            <path fillRule="evenodd" d="M9.864 1.2a3.61 3.61 0 0 1 4.272 0l1.375 1.01c.274.2.593.333.929.384l1.686.259a3.61 3.61 0 0 1 3.021 3.02l.259 1.687c.051.336.183.655.384.929l1.01 1.375a3.61 3.61 0 0 1 0 4.272l-1.01 1.375a2.1 2.1 0 0 0-.384.929l-.259 1.686a3.61 3.61 0 0 1-3.02 3.021l-1.687.259a2.1 2.1 0 0 0-.929.384l-1.375 1.01a3.61 3.61 0 0 1-4.272 0l-1.375-1.01a2.1 2.1 0 0 0-.929-.384l-1.686-.259a3.61 3.61 0 0 1-3.021-3.02l-.259-1.687a2.1 2.1 0 0 0-.384-.929L1.2 14.136a3.61 3.61 0 0 1 0-4.272l1.01-1.375a2.1 2.1 0 0 0 .384-.929l.259-1.686a3.61 3.61 0 0 1 3.02-3.021l1.687-.259a2.1 2.1 0 0 0 .929-.384zm3.384 1.209a2.11 2.11 0 0 0-2.496 0l-1.376 1.01a3.6 3.6 0 0 1-1.589.658l-1.686.258a2.11 2.11 0 0 0-1.766 1.766l-.258 1.686a3.6 3.6 0 0 1-.658 1.59l-1.01 1.375a2.11 2.11 0 0 0 0 2.496l1.01 1.376a3.6 3.6 0 0 1 .658 1.589l.258 1.686a2.11 2.11 0 0 0 1.766 1.765l1.686.26a3.6 3.6 0 0 1 1.59.657l1.375 1.01a2.11 2.11 0 0 0 2.496 0l1.376-1.01a3.6 3.6 0 0 1 1.589-.658l1.686-.258a2.11 2.11 0 0 0 1.765-1.766l.26-1.686a3.6 3.6 0 0 1 .657-1.59l1.01-1.375a2.11 2.11 0 0 0 0-2.496l-1.01-1.376a3.6 3.6 0 0 1-.658-1.589l-.258-1.686a2.11 2.11 0 0 0-1.766-1.766l-1.686-.258a3.6 3.6 0 0 1-1.59-.658z"/>
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'error') {
      return (
        <div className="w-5 h-5">
          <svg className="text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      );
    }

    return null;
  };

  const handleFaviconError = () => {
    // Icon failed to load
  };

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Header */}
      {showHeader && !isCompact && (
        <div className="pt-4 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Continue with Email
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            onClick={() => alert('Need help? Contact support@example.com')}
            disabled={isLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
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
              What's your email?
            </h1>
            <p className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-base'}`}>
              We'll check if you already have an account.
            </p>
          </div>

          {/* Email Input Section */}
          <div className={isCompact ? "space-y-3" : "space-y-4"}>
            {/* Inline Email Status Message */}
            {renderEmailStatusMessage()}

            {/* Inline Email Input */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10">
                  {showFavicon && faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt="Email provider favicon"
                      className="w-full h-full object-contain"
                      onError={handleFaviconError}
                    />
                  ) : (
                    <Mail className="w-full h-full text-gray-400" />
                  )}
                </div>

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                  {getRightSideIcon()}
                </div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  ref={emailInputRef}
                  disabled={isLoading}
                  className="relative w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Inline Action Buttons */}
            {renderEmailActionButtons()}
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

export default EmailAuthScreen;