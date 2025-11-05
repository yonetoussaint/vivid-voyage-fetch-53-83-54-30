// PriceInfo.tsx - Self-contained version
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

// CurrencySwitcher Component
const CurrencySwitcher = ({ 
  currentCurrency, 
  onCurrencyChange, 
  className = "" 
}) => {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
      <button
        onClick={onCurrencyChange}
        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 cursor-pointer transition-colors ${className}`}
        aria-label="Change currency"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
          <span className={`fi fi-${currencyToCountry[currentCurrency]} scale-150`}></span>
        </div>
        <ChevronDown className="w-4 h-4 stroke-2" />
        <span className="font-bold text-gray-600">
          {currencies[currentCurrency]}
        </span>
      </button>
    </>
  );
};

// Simple PriceInfo Component
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
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl font-bold text-gray-900">
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