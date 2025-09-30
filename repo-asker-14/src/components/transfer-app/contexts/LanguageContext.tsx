
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translationService } from '@/services/translationService';

interface Language {
  code: string;
  name: string;
  country: string;
  countryName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') {
      return text;
    }

    setIsTranslating(true);
    try {
      const result = await translationService.translateText({
        text,
        targetLanguage: currentLanguage,
        sourceLanguage: 'en'
      });
      return result.translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setCurrentLanguage,
    translateText,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
