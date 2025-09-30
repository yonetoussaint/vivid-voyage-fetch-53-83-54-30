
import React from 'react';
import { PulseBackgroundProps } from './types';

const PulseBackground: React.FC<PulseBackgroundProps> = ({ className = '' }) => {
  return (
    <div 
      className={`absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-30 ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translate3d(-50%, -50%, 0)'
      }}
    >
      <div 
        className="w-full h-full rounded-full bg-gradient-radial from-white/10 via-white/5 to-transparent"
        style={{ willChange: 'auto' }}
      />
    </div>
  );
};

export default PulseBackground;
