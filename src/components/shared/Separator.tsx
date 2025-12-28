// src/components/shared/Separator.tsx
import React from 'react';

interface SeparatorProps {
  className?: string;
  height?: string;
  color?: string;
  margin?: string;
}

const Separator: React.FC<SeparatorProps> = ({ 
  className = '', 
  height = 'h-1', 
  color = 'bg-gray-100', 
  margin = 'my-2' 
}) => {
  return (
    <div className={`w-full ${height} ${color} ${margin} ${className}`}></div>
  );
};

export default Separator;