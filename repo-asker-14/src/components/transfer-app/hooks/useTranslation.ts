
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = (originalText: string) => {
  const { translateText, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(originalText);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(originalText);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation hook error:', error);
        setTranslatedText(originalText);
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [originalText, currentLanguage, translateText]);

  return { translatedText, isLoading };
};
