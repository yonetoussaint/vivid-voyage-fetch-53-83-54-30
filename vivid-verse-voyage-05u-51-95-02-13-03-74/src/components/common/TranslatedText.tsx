
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { translatedText, isLoading } = useTranslation(children);

  if (isLoading) {
    return (
      <Component className={`${className} opacity-50`}>
        {children}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;
