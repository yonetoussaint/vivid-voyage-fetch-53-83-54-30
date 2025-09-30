
import React from 'react';
import { TopTitleProps } from './types';
import { SPLASH_ANIMATIONS } from './animations';

const TopTitle: React.FC<TopTitleProps> = ({ className = '' }) => {
  return (
    <>
      <style>{SPLASH_ANIMATIONS.keyframes}</style>
      <div 
        className={`absolute top-12 left-0 right-0 text-center text-white px-4 z-10 ${className}`}
        style={{
          opacity: 1,
          animation: SPLASH_ANIMATIONS.configs.titleEntry,
          willChange: 'auto'
        }}
        role="banner"
        aria-label="Application title"
      >
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-white drop-shadow-2xl uppercase">
          #1 app de transfert à Désarmes
        </h1>
      </div>
    </>
  );
};

export default TopTitle;
