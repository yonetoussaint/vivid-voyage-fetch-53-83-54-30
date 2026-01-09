import React from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  id: string;
  delay?: number;
  visibleSections: Set<string>;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  id, 
  delay = 0,
  visibleSections 
}) => {
  const isVisible = visibleSections.has(id);
  
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};