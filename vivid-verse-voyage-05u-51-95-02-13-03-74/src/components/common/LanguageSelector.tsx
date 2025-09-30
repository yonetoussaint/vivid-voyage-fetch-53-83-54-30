
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  variant?: 'compact' | 'full';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'full' }) => {
  const handleLanguageChange = () => {
    console.log('Language selector clicked');
  };

  if (variant === 'compact') {
    return (
      <Button variant="ghost" size="sm" onClick={handleLanguageChange}>
        <Globe className="w-4 h-4 mr-1" />
        EN
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleLanguageChange}>
      <Globe className="w-4 h-4 mr-2" />
      English
    </Button>
  );
};

export default LanguageSelector;
