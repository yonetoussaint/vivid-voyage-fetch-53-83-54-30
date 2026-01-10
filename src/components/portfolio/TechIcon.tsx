import React from 'react';
import { getTechIconUrl, getTechDisplayName } from './techIcons';

interface TechIconProps {
  tech: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const TechIcon: React.FC<TechIconProps> = ({ 
  tech, 
  size = 'md', 
  showName = false,
  className = ''
}) => {
  const iconUrl = getTechIconUrl(tech);
  const displayName = getTechDisplayName(tech);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img 
          src={iconUrl} 
          alt={displayName}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = `https://skillicons.dev/icons?i=placeholder`;
          }}
        />
      </div>
      {showName && (
        <span className="mt-1 text-xs text-gray-600 text-center font-medium">
          {displayName}
        </span>
      )}
    </div>
  );
};