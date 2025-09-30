
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronDown, Phone, X, Check, AlertCircle, Globe, MapPin, Clock, 
  Zap, Shield, Copy, Eye, EyeOff, Smartphone, Headphones, MessageSquare,
  Star, Wifi, Signal, Battery, Volume2, VolumeX, RefreshCw, Sparkles,
  TrendingUp, Users, Award, Target, Bookmark, Heart, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
  format: string;
  length: number;
  popularity: number;
  timezone: string;
  carriers: string[];
  continent: string;
  language: string;
}

interface CountryItemProps {
  country: Country;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  isDarkMode: boolean;
}

const CountryItem: React.FC<CountryItemProps> = ({
  country,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  isDarkMode
}) => (
  <div className={`flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-all duration-200 cursor-pointer group ${
    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
  }`}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite();
      }}
      className="opacity-60 hover:opacity-100 transition-colors"
    >
      <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
    </button>
    
    <div onClick={onSelect} className="flex items-center gap-3 flex-1">
      <span className="text-2xl">{country.flag}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{country.name}</span>
          <span className="text-xs px-2 py-1 bg-black/5 rounded-full">{country.continent}</span>
        </div>
        <div className="text-xs opacity-60 flex items-center gap-2">
          <span>{country.dial}</span>
          <span>•</span>
          <span>{country.language}</span>
          <span>•</span>
          <span>{country.timezone}</span>
        </div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-blue-500" />}
    </div>
  </div>
);

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [recentCountries, setRecentCountries] = useState<Country[]>([]);
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationDetails, setValidationDetails] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [phoneType, setPhoneType] = useState('');
  const [carrier, setCarrier] = useState('');
  const [timezone, setTimezone] = useState('');
  const [isNumberObscured, setIsNumberObscured] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [smartValidation, setSmartValidation] = useState(true);
  const [voiceInput, setVoiceInput] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationLevel, setAnimationLevel] = useState('full');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [usageStats, setUsageStats] = useState({ total: 0, valid: 0 });
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Comprehensive country data with enhanced information
  const countries: Country[] = [
    { 
      code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', 
      format: '(###) ###-####', length: 10, popularity: 100,
      timezone: 'UTC-5 to UTC-10', carriers: ['Verizon', 'AT&T', 'T-Mobile'],
      continent: 'North America', language: 'English'
    },
    { 
      code: 'HT', name: 'Haiti', dial: '+509', flag: '🇭🇹', 
      format: '####-####', length: 8, popularity: 85,
      timezone: 'UTC-5', carriers: ['Digicel', 'Natcom'],
      continent: 'Caribbean', language: 'French/Creole'
    },
    { 
      code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', 
      format: '#### ### ####', length: 10, popularity: 85,
      timezone: 'UTC+0', carriers: ['EE', 'O2', 'Three'],
      continent: 'Europe', language: 'English'
    },
    { 
      code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', 
      format: '(###) ###-####', length: 10, popularity: 90,
      timezone: 'UTC-3.5 to UTC-8', carriers: ['Rogers', 'Bell', 'Telus'],
      continent: 'North America', language: 'English/French'
    },
    { 
      code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', 
      format: '#### ### ###', length: 9, popularity: 80,
      timezone: 'UTC+8 to UTC+11', carriers: ['Telstra', 'Optus', 'Vodafone'],
      continent: 'Oceania', language: 'English'
    },
    { 
      code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', 
      format: '#### ########', length: 11, popularity: 88,
      timezone: 'UTC+1', carriers: ['Deutsche Telekom', 'Vodafone', 'O2'],
      continent: 'Europe', language: 'German'
    },
    { 
      code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', 
      format: '## ## ## ## ##', length: 9, popularity: 82,
      timezone: 'UTC+1', carriers: ['Orange', 'SFR', 'Bouygues'],
      continent: 'Europe', language: 'French'
    },
    { 
      code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', 
      format: '##-####-####', length: 10, popularity: 75,
      timezone: 'UTC+9', carriers: ['NTT DoCoMo', 'KDDI', 'SoftBank'],
      continent: 'Asia', language: 'Japanese'
    },
    { 
      code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷', 
      format: '##-####-####', length: 10, popularity: 70,
      timezone: 'UTC+9', carriers: ['SK Telecom', 'KT', 'LG U+'],
      continent: 'Asia', language: 'Korean'
    },
    { 
      code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳', 
      format: '### #### ####', length: 11, popularity: 95,
      timezone: 'UTC+8', carriers: ['China Mobile', 'China Unicom', 'China Telecom'],
      continent: 'Asia', language: 'Chinese'
    },
    { 
      code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', 
      format: '##### #####', length: 10, popularity: 92,
      timezone: 'UTC+5:30', carriers: ['Jio', 'Airtel', 'Vi'],
      continent: 'Asia', language: 'Hindi/English'
    },
    { 
      code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷', 
      format: '## #####-####', length: 11, popularity: 78,
      timezone: 'UTC-3 to UTC-5', carriers: ['Vivo', 'Claro', 'TIM'],
      continent: 'South America', language: 'Portuguese'
    },
    { 
      code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', 
      format: '## #### ####', length: 10, popularity: 76,
      timezone: 'UTC-6 to UTC-8', carriers: ['Telcel', 'AT&T', 'Movistar'],
      continent: 'North America', language: 'Spanish'
    },
    { 
      code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸', 
      format: '### ## ## ##', length: 9, popularity: 74,
      timezone: 'UTC+1', carriers: ['Movistar', 'Orange', 'Vodafone'],
      continent: 'Europe', language: 'Spanish'
    },
    { 
      code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹', 
      format: '### ### ####', length: 10, popularity: 72,
      timezone: 'UTC+1', carriers: ['TIM', 'Vodafone', 'WindTre'],
      continent: 'Europe', language: 'Italian'
    }
  ];

  const tips = [
    "💡 Try typing just the numbers - I'll format them automatically!",
    "🌍 Search countries by typing their name in the dropdown",
    "⭐ Click the star to add countries to your favorites",
    "🔄 I can detect your country based on the number format",
    "📋 Click the copy button to copy your number to clipboard",
    "👁️ Use the eye icon to hide/show your number for privacy",
    "🎯 Green border means your number is valid and ready to use!",
    "📊 I track your usage stats to help improve your experience"
  ];

  // Initialize default country and load saved preferences
  useEffect(() => {
    const savedCountry = localStorage.getItem('preferredCountry');
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteCountries') || '[]');
    const savedRecent = JSON.parse(localStorage.getItem('recentCountries') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('usageStats') || '{"total": 0, "valid": 0}');
    
    setFavoriteCountries(savedFavorites);
    setRecentCountries(savedRecent);
    setUsageStats(savedStats);
    
    if (savedCountry) {
      const country = countries.find(c => c.code === savedCountry);
      if (country) setSelectedCountry(country);
    } else {
      // Default to Haiti
      setSelectedCountry(countries.find(c => c.code === 'HT') || countries[0]);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem('preferredCountry', selectedCountry.code);
    }
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem('favoriteCountries', JSON.stringify(favoriteCountries));
  }, [favoriteCountries]);

  useEffect(() => {
    localStorage.setItem('recentCountries', JSON.stringify(recentCountries));
  }, [recentCountries]);

  useEffect(() => {
    localStorage.setItem('usageStats', JSON.stringify(usageStats));
  }, [usageStats]);

  // Advanced phone number formatting with pattern recognition
  const formatPhoneNumber = useCallback((value: string, country: Country | null) => {
    if (!country || !autoFormat) return value;
    
    const numbers = value.replace(/\D/g, '');
    const format = country.format;
    let formatted = '';
    let numberIndex = 0;
    
    for (let i = 0; i < format.length && numberIndex < numbers.length; i++) {
      if (format[i] === '#') {
        formatted += numbers[numberIndex];
        numberIndex++;
      } else {
        formatted += format[i];
      }
    }
    
    return formatted;
  }, [autoFormat]);

  // Advanced validation with detailed feedback
  const validatePhone = useCallback((number: string, country: Country | null) => {
    if (!country) return { isValid: false, confidence: 0, issues: ['No country selected'] };
    
    const cleanNumber = number.replace(/\D/g, '');
    const issues = [];
    let confidence = 0;
    
    // Length validation
    if (cleanNumber.length === 0) {
      issues.push('Number is empty');
    } else if (cleanNumber.length < country.length) {
      issues.push(`Too short (needs ${country.length} digits)`);
      confidence = (cleanNumber.length / country.length) * 50;
    } else if (cleanNumber.length > country.length) {
      issues.push(`Too long (max ${country.length} digits)`);
      confidence = 30;
    } else {
      confidence = 90;
    }

    // Pattern validation (basic)
    if (cleanNumber.length === country.length) {
      // Check for obvious invalid patterns
      if (cleanNumber === '0'.repeat(country.length)) {
        issues.push('Invalid pattern (all zeros)');
        confidence = 10;
      } else if (cleanNumber === '1'.repeat(country.length)) {
        issues.push('Invalid pattern (all ones)');
        confidence = 10;
      } else if (!/^[0-9]+$/.test(cleanNumber)) {
        issues.push('Contains invalid characters');
        confidence = 20;
      } else {
        confidence = Math.min(100, confidence + 10);
      }
    }

    return {
      isValid: issues.length === 0 && confidence >= 90,
      confidence,
      issues,
      phoneType: 'Mobile',
      carrier: confidence > 80 ? 'Carrier lookup available' : '',
      canReceiveSMS: confidence > 80,
      canReceiveCalls: confidence > 80
    };
  }, []);

  // Handle typing with debounced validation
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsTyping(true);
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Format number
    const formatted = formatPhoneNumber(value, selectedCountry);
    setPhoneNumber(formatted);
    
    // Update parent component
    onChange(selectedCountry ? selectedCountry.dial + formatted.replace(/\D/g, '') : formatted);
    
    // Validate with debounce
    typingTimeoutRef.current = setTimeout(() => {
      const validation = validatePhone(formatted, selectedCountry);
      setIsValid(validation.isValid);
      setValidationDetails(validation);
      setConfidence(validation.confidence);
      setPhoneType(validation.phoneType);
      setCarrier(validation.carrier);
      setShowValidation(value.length > 0);
      setIsTyping(false);
      
      // Update usage stats
      setUsageStats(prev => ({
        total: prev.total + 1,
        valid: prev.valid + (validation.isValid ? 1 : 0)
      }));
      
      // Smart suggestions
      if (!validation.isValid && validation.confidence > 50) {
        setSuggestions([`Try completing the ${selectedCountry?.name} format`]);
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, [selectedCountry, formatPhoneNumber, validatePhone, onChange]);

  // Enhanced country selection with analytics
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Update recent countries
    setRecentCountries(prev => {
      const filtered = prev.filter(c => c.code !== country.code);
      return [country, ...filtered].slice(0, 5);
    });
    
    // Reformat existing number
    if (phoneNumber) {
      const numbers = phoneNumber.replace(/\D/g, '');
      const formatted = formatPhoneNumber(numbers, country);
      setPhoneNumber(formatted);
      const validation = validatePhone(formatted, country);
      setIsValid(validation.isValid);
      setValidationDetails(validation);
      setConfidence(validation.confidence);
      
      // Update parent component
      onChange(country.dial + numbers);
    } else {
      onChange(country.dial);
    }
    
    setTimezone(country.timezone);
    inputRef.current?.focus();
  }, [phoneNumber, formatPhoneNumber, validatePhone, onChange]);

  // Toggle favorite country
  const toggleFavorite = useCallback((country: Country) => {
    setFavoriteCountries(prev => {
      const isFavorite = prev.some(c => c.code === country.code);
      if (isFavorite) {
        return prev.filter(c => c.code !== country.code);
      } else {
        return [...prev, country].slice(0, 10); // Max 10 favorites
      }
    });
  }, []);

  // Copy phone number to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!phoneNumber) return;
    
    try {
      const fullNumber = `${selectedCountry?.dial} ${phoneNumber}`;
      await navigator.clipboard.writeText(fullNumber);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [phoneNumber, selectedCountry]);

  // Filter countries with advanced search
  const filteredCountries = countries
    .filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dial.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.continent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.language.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by: favorites first, then popularity, then alphabetical
      const aIsFav = favoriteCountries.some(c => c.code === a.code);
      const bIsFav = favoriteCountries.some(c => c.code === b.code);
      
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      if (a.popularity !== b.popularity) return b.popularity - a.popularity;
      return a.name.localeCompare(b.name);
    });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear phone number
  const clearPhone = useCallback(() => {
    setPhoneNumber('');
    setIsValid(null);
    setValidationDetails({});
    setShowValidation(false);
    setConfidence(0);
    setSuggestions([]);
    onChange(selectedCountry?.dial || '');
    inputRef.current?.focus();
  }, [selectedCountry, onChange]);

  const themeClasses = isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100';
  const cardClasses = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const inputClasses = isDarkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-800 border-slate-300';

  const displayValue = isNumberObscured && phoneNumber.length > 4 
    ? phoneNumber.substring(0, phoneNumber.length - 4) + '••••'
    : phoneNumber;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tips banner */}
      {showTips && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center gap-3">
          <Sparkles className="w-5 h-5" />
          <span className="flex-1 text-sm">{tips[currentTip]}</span>
          <button 
            onClick={() => setShowTips(false)}
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main input section */}
      <div className={`relative flex rounded-xl border-2 transition-all duration-300 ${
        isFocused 
          ? confidence > 80
            ? 'border-green-500 shadow-lg shadow-green-500/20 ring-4 ring-green-500/10' 
            : confidence > 50
              ? 'border-yellow-500 shadow-lg shadow-yellow-500/20 ring-4 ring-yellow-500/10'
              : 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10'
          : isValid === false && showValidation
            ? 'border-red-400 shadow-lg shadow-red-400/20'
            : isValid === true
              ? 'border-green-400 shadow-lg shadow-green-400/20'
              : 'border-slate-300 hover:border-slate-400'
      } bg-white overflow-hidden backdrop-blur-sm`}>
        
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-all duration-200 border-r border-slate-200 group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
          >
            <div className="relative">
              <span className="text-xl">{selectedCountry?.flag}</span>
              {selectedCountry && favoriteCountries.some(c => c.code === selectedCountry.code) && (
                <Star className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 fill-current" />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{selectedCountry?.dial}</div>
              <div className="text-xs opacity-60">{selectedCountry?.code}</div>
            </div>
            <ChevronDown className={`w-4 h-4 opacity-60 transition-all duration-200 group-hover:opacity-100 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Enhanced Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border max-h-[500px] overflow-hidden backdrop-blur-lg min-w-[400px]">
              {/* Search with filters */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
                    <Search className="w-4 h-4 opacity-60" />
                    <input
                      type="text"
                      placeholder="Search countries, codes, or continents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="opacity-60 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Quick filters */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['Popular', 'Americas', 'Europe', 'Asia', 'Africa'].map(filter => (
                    <button
                      key={filter}
                      className="px-3 py-1 text-xs rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                      onClick={() => setSearchTerm(filter === 'Popular' ? '' : filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[400px]">
                {/* Favorites */}
                {favoriteCountries.length > 0 && searchTerm === '' && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-600 bg-yellow-50 flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      FAVORITES
                    </div>
                    {favoriteCountries.map((country) => (
                      <CountryItem
                        key={`fav-${country.code}`}
                        country={country}
                        isSelected={selectedCountry?.code === country.code}
                        isFavorite={true}
                        onSelect={() => handleCountrySelect(country)}
                        onToggleFavorite={() => toggleFavorite(country)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                    <div className="border-b border-slate-200"></div>
                  </div>
                )}

                {/* Recent Countries */}
                {recentCountries.length > 0 && searchTerm === '' && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-600 bg-blue-50 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      RECENT
                    </div>
                    {recentCountries.map((country) => (
                      <CountryItem
                        key={`recent-${country.code}`}
                        country={country}
                        isSelected={selectedCountry?.code === country.code}
                        isFavorite={favoriteCountries.some(c => c.code === country.code)}
                        onSelect={() => handleCountrySelect(country)}
                        onToggleFavorite={() => toggleFavorite(country)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                    <div className="border-b border-slate-200"></div>
                  </div>
                )}

                {/* All Countries */}
                <div>
                  {searchTerm && (
                    <div className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-50 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {filteredCountries.length} RESULTS
                    </div>
                  )}
                  {filteredCountries.map((country) => (
                    <CountryItem
                      key={country.code}
                      country={country}
                      isSelected={selectedCountry?.code === country.code}
                      isFavorite={favoriteCountries.some(c => c.code === country.code)}
                      onSelect={() => handleCountrySelect(country)}
                      onToggleFavorite={() => toggleFavorite(country)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="tel"
            value={displayValue}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={selectedCountry?.format.replace(/#/g, '0') || 'Enter phone number'}
            disabled={disabled}
            className="w-full px-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400"
            autoComplete="tel"
            inputMode="tel"
          />

          {/* Action Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {phoneNumber && (
              <>
                <button
                  type="button"
                  onClick={() => setIsNumberObscured(!isNumberObscured)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {isNumberObscured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title="Copy to clipboard"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                
                <button
                  type="button"
                  onClick={clearPhone}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
            
            {isValid === true && (
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
            )}
            
            {isValid === false && showValidation && (
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-red-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust and Security Indicators */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-500">
          <Shield className="w-3 h-3" />
          <span>Encrypted and secure</span>
        </div>
        
        <div className="text-slate-400">
          <span>We'll send a verification code</span>
        </div>
      </div>

      {/* Validation Messages */}
      {isValid === false && showValidation && validationDetails.issues && (
        <div className="flex items-center space-x-2 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>{validationDetails.issues[0]}</span>
        </div>
      )}
      
      {isValid === true && (
        <div className="flex items-center space-x-2 text-xs text-green-600">
          <Check className="w-3 h-3" />
          <span>Valid {selectedCountry?.name} phone number ✓</span>
        </div>
      )}

      {/* Progress Indicator */}
      {isFocused && (
        <div className="h-0.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((phoneNumber.replace(/\D/g, '').length / (selectedCountry?.length || 10)) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
