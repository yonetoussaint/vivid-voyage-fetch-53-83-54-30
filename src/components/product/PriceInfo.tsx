// PriceInfo.tsx - Simplified version
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

// Simplified CurrencySwitcher Component
const CurrencySwitcher = ({ 
  currentCurrency, 
  onCurrencyChange 
}) => {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
      <button
        onClick={onCurrencyChange}
        className="p-1 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors text-xs"
        aria-label="Change currency"
      >
        <span className={`fi fi-${currencyToCountry[currentCurrency]}`}></span>
        <ChevronDown className="w-3 h-3" />
      </button>
    </>
  );
};

// Simplified PriceInfo Component
const PriceInfo = ({ price = 0 }) => {
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  const toggleCurrency = () => {
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price) => {
    const convertedPrice = price * exchangeRates[currentCurrency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedPrice);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-gray-900">
        {formatPrice(price)}
      </span>
      <CurrencySwitcher 
        currentCurrency={currentCurrency}
        onCurrencyChange={toggleCurrency}
      />
    </div>
  );
};

export default PriceInfo;