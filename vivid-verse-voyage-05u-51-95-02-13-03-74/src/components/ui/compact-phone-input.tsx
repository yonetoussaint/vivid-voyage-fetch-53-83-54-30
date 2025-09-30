
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Check, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface Country {
  code: string;
  name: string;
  dial: string;
  format: string;
  length: number;
}

const CompactPhoneInput: React.FC<CompactPhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clean, minimal country list
  const countries: Country[] = [
    { code: 'US', name: 'United States', dial: '+1', format: '(###) ###-####', length: 10 },
    { code: 'CA', name: 'Canada', dial: '+1', format: '(###) ###-####', length: 10 },
    { code: 'GB', name: 'United Kingdom', dial: '+44', format: '#### ### ####', length: 10 },
    { code: 'FR', name: 'France', dial: '+33', format: '## ## ## ## ##', length: 9 },
    { code: 'DE', name: 'Germany', dial: '+49', format: '#### ########', length: 11 },
    { code: 'BR', name: 'Brazil', dial: '+55', format: '## #####-####', length: 11 },
    { code: 'MX', name: 'Mexico', dial: '+52', format: '## #### ####', length: 10 },
    { code: 'IN', name: 'India', dial: '+91', format: '##### #####', length: 10 },
    { code: 'AU', name: 'Australia', dial: '+61', format: '#### ### ###', length: 9 }
  ];

  // Initialize with US as default
  useEffect(() => {
    const defaultCountry = countries.find(c => c.code === 'US') || countries[0];
    setSelectedCountry(defaultCountry);
  }, []);

  // Simple phone number formatting
  const formatPhoneNumber = useCallback((value: string, country: Country | null) => {
    if (!country) return value;
    
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
  }, []);

  // Simple validation
  const validatePhone = useCallback((number: string, country: Country | null) => {
    if (!country) return false;
    
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length === country.length;
  }, []);

  // Handle phone input
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value, selectedCountry);
    setPhoneNumber(formatted);
    
    // Simple validation
    const valid = validatePhone(formatted, selectedCountry);
    setIsValid(valid);
    
    // Update parent
    onChange(selectedCountry ? selectedCountry.dial + formatted.replace(/\D/g, '') : formatted);
  }, [selectedCountry, formatPhoneNumber, validatePhone, onChange]);

  // Handle country selection
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    // Reformat existing number
    if (phoneNumber) {
      const numbers = phoneNumber.replace(/\D/g, '');
      const formatted = formatPhoneNumber(numbers, country);
      setPhoneNumber(formatted);
      const valid = validatePhone(formatted, country);
      setIsValid(valid);
      onChange(country.dial + numbers);
    } else {
      onChange(country.dial);
    }
    
    inputRef.current?.focus();
  }, [phoneNumber, formatPhoneNumber, validatePhone, onChange]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear phone number
  const clearPhone = useCallback(() => {
    setPhoneNumber('');
    setIsValid(null);
    onChange(selectedCountry?.dial || '');
    inputRef.current?.focus();
  }, [selectedCountry, onChange]);

  // Get border color based on state
  const getBorderColor = () => {
    if (isFocused) {
      if (isValid === true) return 'border-green-500 ring-1 ring-green-500/20';
      if (isValid === false && phoneNumber.length > 0) return 'border-red-500 ring-1 ring-red-500/20';
      return 'border-blue-500 ring-1 ring-blue-500/20';
    }
    return 'border-gray-200';
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Input Container */}
      <div className={cn(
        "relative flex items-center rounded-lg border bg-white transition-all duration-200",
        getBorderColor(),
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-3 hover:bg-gray-50 transition-colors border-r border-gray-200"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
          >
            <Flag className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{selectedCountry?.dial}</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {/* Clean Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white rounded-lg shadow-lg border min-w-[280px] max-h-[300px] overflow-hidden">
              <div className="overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
                      selectedCountry?.code === country.code && "bg-blue-50"
                    )}
                  >
                    <Flag className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{country.name}</div>
                      <div className="text-xs text-gray-500">{country.dial}</div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={selectedCountry?.format.replace(/#/g, '0') || 'Enter phone number'}
            disabled={disabled}
            className="w-full px-3 py-3 text-sm bg-transparent outline-none placeholder:text-gray-400 pr-10"
            autoComplete="tel"
            inputMode="tel"
          />

          {/* Action Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {phoneNumber && (
              <button
                type="button"
                onClick={clearPhone}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {isValid === true && (
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactPhoneInput;
