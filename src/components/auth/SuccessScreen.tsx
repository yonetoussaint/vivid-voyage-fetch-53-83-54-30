import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../contexts/auth/AuthContext';

interface SuccessScreenProps {
  email: string;
  onContinue: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ 
  email, 
  onContinue,
  isCompact = false,
  onExpand
}) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // User should already be authenticated by the time we reach this screen
    // The authentication was handled in the previous step (password or verification)
    console.log('Success screen loaded for user:', email);
    console.log('Current auth state - user:', user?.email, 'authenticated:', !!user);

    // Start checkmark animation immediately
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmark(true);
    }, 100);

    // Show content after checkmark animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    // Auto-redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      console.log('Auto-redirecting to homepage after successful authentication');
      onContinue();
    }, 3000);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(contentTimer);
      clearTimeout(redirectTimer);
    };
  }, [onContinue, email, user]);

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Main Content */}
      <div className={isCompact ? "" : "flex-1 flex flex-col justify-center w-full p-0"}>
        <div className={isCompact ? "space-y-3 mb-4" : "space-y-3 mb-6"}>
          {/* Animated Checkmark */}
          <div className={`text-center ${isCompact ? 'mb-6' : 'mb-8'}`}>
            <div className={`relative mx-auto ${
              isCompact ? 'w-16 h-16' : 'w-20 h-20'
            }`}>
              <div className={`rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              } ${isCompact ? 'w-16 h-16' : 'w-20 h-20'}`}>
                <Check className={`text-green-500 transition-all duration-300 delay-300 ${
                  showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                } ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />
              </div>

              {/* Pulsing background effect */}
              <div className={`absolute inset-0 rounded-full bg-green-500 opacity-20 transition-all duration-1000 ${
                showCheckmark ? 'animate-ping' : ''
              } ${isCompact ? 'w-16 h-16' : 'w-20 h-20'}`}></div>
            </div>
          </div>

          {/* Success Content */}
          <div className={`text-center transition-all duration-500 delay-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className={`text-gray-900 font-semibold mb-3 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Welcome back!
            </h1>
            <p className={`text-gray-600 mb-2 ${isCompact ? 'text-sm' : 'text-base'}`}>
              You have successfully signed in to your account
            </p>
            <p className={`text-gray-500 ${isCompact ? 'text-xs mb-4' : 'text-sm mb-6'}`}>
              {email}
            </p>
            <p className={`text-gray-400 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              Redirecting to homepage...
            </p>

            {/* Manual Continue Button */}
            <button
              onClick={onContinue}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-red-500 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors mt-4 ${
                isCompact ? 'shadow-sm' : ''
              }`}
            >
              <span className={`font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
                Continue to App
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

export default SuccessScreen;