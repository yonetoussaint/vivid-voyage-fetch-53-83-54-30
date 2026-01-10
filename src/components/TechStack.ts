import React from 'react';
import { TechIcon } from './TechIcon';

interface TechStackProps {
  techs: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
  className?: string;
}

export const TechStack: React.FC<TechStackProps> = ({ 
  techs, 
  maxDisplay = 6,
  size = 'md',
  showNames = false,
  className = ''
}) => {
  const displayTechs = techs.slice(0, maxDisplay);
  const hasMore = techs.length > maxDisplay;

  return (
    <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2 ${className}`}>
      {displayTechs.map((tech, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group relative"
          title={tech}
        >
          <TechIcon 
            tech={tech} 
            size={size}
            showName={showNames}  // Changed from showName to showNames to match prop name
            className="w-full"
          />
        </div>
      ))}

      {hasMore && (
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-gray-500 font-bold text-lg">+</span>
          </div>
          <span className="text-gray-500 text-xs">
            {techs.length - maxDisplay} more
          </span>
        </div>
      )}
    </div>
  );
};