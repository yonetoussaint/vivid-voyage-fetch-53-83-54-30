
import React from 'react';
import { AccentPathProps } from './types';

const AccentPath: React.FC<AccentPathProps> = ({ 
  className = '', 
  fillColor = '#ffffff'
}) => {
  return (
    <path 
      className={`animate-accent-path ${className}`}
      fill={fillColor}
      d="M497.5 319.5c-4.067 1.554-8.4 2.22-13 2 4.045-1.677 8.378-2.344 13-2z"
      style={{
        opacity: '0',
        transformOrigin: 'center',
        animation: `momentum-entry 3.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3s forwards, elastic-oscillation 1.5s ease-in-out 6.5s infinite, magnetic-pull 2.5s cubic-bezier(0.23, 1, 0.32, 1) 8s infinite`,
        willChange: 'transform, opacity'
      }}
      role="img"
      aria-hidden="true"
    />
  );
};

export default AccentPath;
