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
  const { user } = useAuth();

  useEffect(() => {
    // User should already be authenticated by the time we reach this screen
    console.log('Success screen loaded for user:', email);
    console.log('Current auth state - user:', user?.email, 'authenticated:', !!user);

    // Start checkmark animation immediately
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmark(true);
    }, 100);

    // Auto-redirect after animation completes
    const redirectTimer = setTimeout(() => {
      console.log('Auto-redirecting to homepage after successful authentication');
      onContinue();
    }, 2000);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(redirectTimer);
    };
  }, [onContinue, email, user]);

  return (
    <div className={isCompact ? "px-4 pb-4" : "min-h-screen bg-white flex flex-col px-4"}>
      {/* Main Content - Centered Animation Only with proper spacing */}
      <div className={isCompact ? "py-8" : "flex-1 flex flex-col justify-center items-center w-full p-0"}>
        {/* Animated Checkmark - Centered with proper ring alignment */}
        <div className="flex flex-col items-center justify-center p-8">
          <div className={`relative flex items-center justify-center ${
            isCompact ? 'w-20 h-20' : 'w-32 h-32'
          }`}>
            {/* Main checkmark container */}
            <div className={`rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-500 ${
              showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            } ${isCompact ? 'w-20 h-20' : 'w-32 h-32'} bg-white z-10`}>
              <Check className={`text-green-500 transition-all duration-300 delay-300 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              } ${isCompact ? 'w-10 h-10' : 'w-16 h-16'}`} />
            </div>

            {/* Pulsing background effect - properly centered using the same container */}
            <div className={`absolute rounded-full bg-green-500 opacity-20 transition-all duration-1000 ${
              showCheckmark ? 'animate-ping' : ''
            } ${isCompact ? 'w-20 h-20' : 'w-32 h-32'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;