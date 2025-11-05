// PriceInfo.tsx - AliExpress themed with space-y-2
import React, { useState, useMemo } from 'react';
import { ChevronDown, Info } from 'lucide-react';

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

// Product pricing data structure
const productPricing = {
  basePrice: 25, // Base price per unit
  moq: 100, // Minimum Order Quantity
  priceTiers: [
    { minQty: 100, maxQty: 499, discount: 0 },
    { minQty: 500, maxQty: 999, discount: 0.05 },
    { minQty: 1000, maxQty: 4999, discount: 0.10 },
    { minQty: 5000, maxQty: null, discount: 0.15 }
  ]
};

// CurrencySwitcher Component
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

// PriceTier Component
const PriceTier = ({ tier, currentCurrency, basePrice }) => {
  const calculatePrice = (basePrice, discount) => {
    return basePrice * (1 - discount) * exchangeRates[currentCurrency];
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const tierPrice = calculatePrice(basePrice, tier.discount);
  const rangeText = tier.maxQty 
    ? `${tier.minQty}-${tier.maxQty} units`
    : `≥${tier.minQty} units`;

  return (
    <div className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded">
      <span className="text-sm text-gray-600">{rangeText}</span>
      <span className="text-sm font-semibold text-orange-500">
        {formatPrice(tierPrice, currentCurrency)}
      </span>
    </div>
  );
};

// Bulk Pricing Toggle Component
const BulkPricingToggle = ({ showPriceTiers, setShowPriceTiers }) => {
  return (
    <button
      onClick={() => setShowPriceTiers(!showPriceTiers)}
      className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 transition-colors"
    >
      <span>Bulk pricing</span>
      <ChevronDown className={`w-3 h-3 transition-transform ${showPriceTiers ? 'rotate-180' : ''}`} />
    </button>
  );
};

// AliExpress Themed PriceInfo Component with space-y-2
const PriceInfo = () => {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [showPriceTiers, setShowPriceTiers] = useState(false);

  const toggleCurrency = () => {
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price, currency = currentCurrency) => {
    const convertedPrice = price * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const currentTier = useMemo(() => {
    return productPricing.priceTiers[0]; // Default to first tier
  }, []);

  const currentPrice = productPricing.basePrice * (1 - currentTier.discount);

  return (
    <div className="space-y-2">
      {/* First Row: Price and Currency Switcher */}
      <div className="flex justify-between items-center">
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-sm text-gray-500">/ unit</span>
        </div>
        
        {/* Currency Switcher */}
        <CurrencySwitcher 
          currentCurrency={currentCurrency}
          onCurrencyChange={toggleCurrency}
        />
      </div>

      {/* Second Row: MOQ and Bulk Pricing Toggle with AliExpress Orange Background */}
      <div className="flex justify-between items-center bg-orange-50 rounded px-3 py-2 border border-orange-200">
        {/* MOQ Section */}
        <div className="flex items-center gap-1 text-orange-700 text-xs">
          <Info className="w-3 h-3" />
          <span>MOQ: {productPricing.moq} units</span>
        </div>
        
        {/* Bulk Pricing Toggle */}
        <BulkPricingToggle 
          showPriceTiers={showPriceTiers}
          setShowPriceTiers={setShowPriceTiers}
        />
      </div>

      {/* Price Tiers (expands below) */}
      {showPriceTiers && (
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
            {productPricing.priceTiers.map((tier, index) => (
              <PriceTier
                key={index}
                tier={tier}
                currentCurrency={currentCurrency}
                basePrice={productPricing.basePrice}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInfo;