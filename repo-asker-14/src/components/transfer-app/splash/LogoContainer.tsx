
import React from 'react';
import { LogoContainerProps } from './types';

const LogoContainer: React.FC<LogoContainerProps> = ({ 
  className = '', 
  width = '300px', 
  height = '300px',
  children
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        willChange: 'auto'
      }}
      role="img"
      aria-label="Application logo"
    >
      <svg 
        style={{ 
          width, 
          height,
          willChange: 'auto'
        }}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1024 1024"
        aria-hidden="true"
      >
        {children}
      </svg>
    </div>
  );
};

export default LogoContainer;
