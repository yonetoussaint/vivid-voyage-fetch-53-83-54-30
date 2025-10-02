// components/header/SettingsPanel.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin, Edit, Languages, Check, Pin, Search } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface Location {
  name: string;
  flag?: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  currentLocation: Location;
  supportedLanguages?: Language[];
  onLanguageChange: (language: Language) => void;
  onOpenLocationScreen: () => void;
  // Add these new props for the missing functionality
  languageQuery?: string;
  onLanguageQueryChange?: (query: string) => void;
  pinnedLanguages?: Set<string>;
  onToggleLanguagePin?: (languageCode: string, event: React.MouseEvent) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  currentLanguage,
  currentLocation,
  supportedLanguages = [],
  onLanguageChange,
  onOpenLocationScreen,
  // New props with defaults
  languageQuery = '',
  onLanguageQueryChange = () => {},
  pinnedLanguages = new Set(['en', 'es']),
  onToggleLanguagePin = () => {},
}: SettingsPanelProps) {
  const { t, i18n } = useTranslation();

  // Fallback languages
  const languages = useMemo(() => {
    if (supportedLanguages && Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
      return supportedLanguages;
    }

    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];
  }, [supportedLanguages]);

  // Filter and sort languages
  const filteredLanguages = useMemo(() => {
    const filtered = languages.filter((lang) =>
      lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aPinned = pinnedLanguages.has(a.code);
      const bPinned = pinnedLanguages.has(b.code);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [languageQuery, pinnedLanguages, languages]);

  const handleLanguageSelect = async (language: Language) => {
    try {
      // Call the language change handler from parent
      onLanguageChange(language);

      // Clear search when language is selected
      onLanguageQueryChange('');

      // Optional: Close the panel after selection
      // onClose();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleLanguageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLanguageQueryChange(e.target.value);
  };

  const handleToggleLanguagePin = (languageCode: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleLanguagePin(languageCode, event);
  };

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings', 'Settings')}
      preventBodyScroll={true}
      className="p-4 space-y-6"
    >
      {/* Language Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{t('language', 'Language')}</span>
        </div>

        {/* Language Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search languages..."
            value={languageQuery}
            onChange={handleLanguageSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Current Language Display */}
        <div className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Languages className="h-5 w-5 text-orange-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">
                {currentLanguage.nativeName || currentLanguage.name || 'English'}
              </div>
              <div className="text-xs text-gray-500">
                {currentLanguage.name || 'English'} • {currentLanguage.code.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {pinnedLanguages.has(currentLanguage.code) && (
              <Pin className="h-4 w-4 text-orange-600 fill-current" />
            )}
            <Check className="h-4 w-4 text-orange-600" />
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredLanguages.slice(0, 4).map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`p-2 text-sm rounded-lg border transition-all flex items-center justify-between ${
                currentLanguage.code === language.code
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{language.nativeName}</span>
              <button
                onClick={(e) => handleToggleLanguagePin(language.code, e)}
                className={`p-1 rounded ${
                  pinnedLanguages.has(language.code) 
                    ? 'text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Pin className={`h-3 w-3 ${pinnedLanguages.has(language.code) ? 'fill-current' : ''}`} />
              </button>
            </button>
          ))}
        </div>

        {/* Show more languages if there are more than 4 */}
        {filteredLanguages.length > 4 && (
          <div className="text-center">
            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              Show {filteredLanguages.length - 4} more languages
            </button>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{t('location', 'Location')}</span>
        </div>

        <button
          onClick={onOpenLocationScreen}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {currentLocation.flag ? (
              <img
                src={`https://flagcdn.com/${currentLocation.flag.toLowerCase()}.svg`}
                alt={currentLocation.name}
                className="h-5 w-5 rounded object-cover"
              />
            ) : (
              <MapPin className="h-5 w-5 text-orange-600" />
            )}
            <div className="text-left">
              <div className="font-medium text-gray-900">
                {currentLocation.name.split(',')[0]}
              </div>
              <div className="text-xs text-gray-500">
                {currentLocation.name}
              </div>
            </div>
          </div>
          <Edit className="h-4 w-4 text-gray-400 hover:text-orange-600" />
        </button>
      </div>
    </SlideUpPanel>
  );
}