import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Currency data
const currencies = {
  USD: 'USD',
  EUR: 'EUR', 
  GBP: 'GBP',
  JPY: 'JPY'
};

const currencyToCountry = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb', 
  JPY: 'jp'
};

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50
};

interface PriceInfoProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showOnlyBadge?: boolean;
  className?: string;
}

export default function PriceInfo({ 
  price, 
  originalPrice, 
  size = 'md',
  showOnlyBadge = false,
  className = ''
}: PriceInfoProps) {
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  const toggleCurrency = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent Link
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price: number, currency: string = currentCurrency) => {
    const convertedPrice = price * exchangeRates[currency as keyof typeof exchangeRates];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      price: 'text-base leading-none',
      original: 'text-xs leading-none',
      currency: 'text-xs'
    },
    md: {
      price: 'text-lg leading-none',
      original: 'text-sm leading-none', 
      currency: 'text-sm'
    },
    lg: {
      price: 'text-xl leading-none',
      original: 'text-base leading-none',
      currency: 'text-base'
    }
  };

  // CurrencySwitcher Component
  const CurrencySwitcher = () => {
    return (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
        <button
          onClick={toggleCurrency}
          className={`p-1 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors ${sizeStyles[size].currency}`}
          aria-label="Change currency"
        >
          <span className={`fi fi-${currencyToCountry[currentCurrency as keyof typeof currencyToCountry]}`}></span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </>
    );
  };

  // If only showing badge (for thumbnail), return just the switcher
  if (showOnlyBadge) {
    return <CurrencySwitcher />;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Main price display with currency switcher */}
      <div className="flex justify-between items-center">
        {/* Price */}
        <div className="flex items-center gap-2 leading-none">
          <span className={`font-bold text-orange-500 ${sizeStyles[size].price}`}>
            {formatPrice(price)}
          </span>
          <span className={`text-gray-500 ${sizeStyles[size].original}`}>/ unit</span>
        </div>
        
        {/* Currency Switcher */}
        <CurrencySwitcher />
      </div>
    </div>
  );
}