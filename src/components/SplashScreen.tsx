import React from 'react';
import { SplashScreenProps } from './splash/types';
import PulseBackground from './splash/PulseBackground';
import LogoContainer from './splash/LogoContainer';
import MainLogoPath from './splash/MainLogoPath';
import AccentPath from './splash/AccentPath';

// Simple splash screen without exit animations and particles
const SplashScreen: React.FC<SplashScreenProps> = ({ 
  isVisible,
  isExiting = false,
  backgroundColor = 'bg-red-500',
  logoWidth = '350px',
  logoHeight = '350px',
  customAcknowledment
}) => {
  // Early return for performance
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 min-h-screen ${backgroundColor} flex flex-col items-center justify-center overflow-hidden z-50`}
      role="dialog"
      aria-label="Application splash screen"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center justify-center flex-grow">
        <PulseBackground />

        <LogoContainer 
          width={logoWidth} 
          height={logoHeight}
        >
          <MainLogoPath />
          <AccentPath />
        </LogoContainer>

      </div>
      {/* Removed the GLOBAL TRANSFÈ text */}
    </div>
  );
};

export default SplashScreen;
