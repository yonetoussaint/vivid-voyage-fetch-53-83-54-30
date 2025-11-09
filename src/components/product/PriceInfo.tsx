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

interface PriceInfoProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showCurrencyBadge?: boolean;
  className?: string;
}

export default function PriceInfo({ 
  price, 
  originalPrice, 
  size = 'md',
  showCurrencyBadge = false,
  className = ''
}: PriceInfoProps) {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [showPriceTiers, setShowPriceTiers] = useState(false);

  const toggleCurrency = () => {
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

  const currentTier = useMemo(() => {
    return productPricing.priceTiers[0]; // Default to first tier
  }, []);

  const currentPrice = price * (1 - currentTier.discount);

  // Size-based styling
  const sizeStyles = {
    sm: {
      price: 'text-base',
      original: 'text-xs',
      currency: 'text-xs',
      moq: 'text-xs',
      tier: 'text-xs'
    },
    md: {
      price: 'text-lg',
      original: 'text-sm',
      currency: 'text-sm',
      moq: 'text-sm',
      tier: 'text-sm'
    },
    lg: {
      price: 'text-xl',
      original: 'text-base',
      currency: 'text-base',
      moq: 'text-base',
      tier: 'text-base'
    }
  };

  const formattedPrice = formatPrice(currentPrice);
  const isLongPrice = formattedPrice.length > 8; // Determine if price is too long

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

  // PriceTier Component
  const PriceTier = ({ tier }: { tier: any }) => {
    const calculatePrice = (basePrice: number, discount: number) => {
      return basePrice * (1 - discount) * exchangeRates[currentCurrency as keyof typeof exchangeRates];
    };

    const tierPrice = calculatePrice(price, tier.discount);
    const rangeText = tier.maxQty 
      ? `${tier.minQty}-${tier.maxQty} units`
      : `≥${tier.minQty} units`;

    return (
      <div className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded">
        <span className={`text-gray-600 ${sizeStyles[size].tier}`}>{rangeText}</span>
        <span className={`font-semibold text-orange-500 ${sizeStyles[size].tier}`}>
          {formatPrice(tierPrice, currentCurrency)}
        </span>
      </div>
    );
  };

  // Bulk Pricing Toggle Component
  const BulkPricingToggle = () => {
    return (
      <button
        onClick={() => setShowPriceTiers(!showPriceTiers)}
        className={`flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors ${sizeStyles[size].moq}`}
      >
        <span>Bulk pricing</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${showPriceTiers ? 'rotate-180' : ''}`} />
      </button>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Responsive layout - if price is long and showCurrencyBadge is true, show badge in thumbnail */}
      {!isLongPrice || !showCurrencyBadge ? (
        <>
          {/* First Row: Price and Currency Switcher */}
          <div className="flex justify-between items-center">
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className={`font-bold text-orange-500 ${sizeStyles[size].price}`}>
                {formatPrice(currentPrice)}
              </span>
              <span className={`text-gray-500 ${sizeStyles[size].original}`}>/ unit</span>
            </div>
            
            {/* Currency Switcher - only show if not showing as badge */}
            {showCurrencyBadge && !isLongPrice && (
              <CurrencySwitcher />
            )}
          </div>

          {/* Second Row: MOQ and Bulk Pricing Toggle with AliExpress Orange Background */}
          <div className="flex justify-between items-center bg-orange-50 rounded px-3 py-2 border border-orange-200 mt-2">
            {/* MOQ Section */}
            <div className="flex items-center gap-1 text-orange-700">
              <Info className="w-3 h-3" />
              <span className={sizeStyles[size].moq}>MOQ: {productPricing.moq} units</span>
            </div>
            
            {/* Bulk Pricing Toggle */}
            <BulkPricingToggle />
          </div>
        </>
      ) : (
        // Compact layout for long prices
        <div className="space-y-2">
          {/* Price only */}
          <div className="flex items-center gap-2">
            <span className={`font-bold text-orange-500 ${sizeStyles[size].price}`}>
              {formatPrice(currentPrice)}
            </span>
            <span className={`text-gray-500 ${sizeStyles[size].original}`}>/ unit</span>
          </div>

          {/* MOQ and Bulk Pricing */}
          <div className="flex justify-between items-center bg-orange-50 rounded px-3 py-2 border border-orange-200">
            <div className="flex items-center gap-1 text-orange-700">
              <Info className="w-3 h-3" />
              <span className={sizeStyles[size].moq}>MOQ: {productPricing.moq} units</span>
            </div>
            <BulkPricingToggle />
          </div>
        </div>
      )}

      {/* Currency Badge for thumbnail when price is long */}
      {isLongPrice && showCurrencyBadge && (
        <div className="absolute top-2 right-2 z-20">
          <CurrencySwitcher />
        </div>
      )}

      {/* Price Tiers (expands below) */}
      {showPriceTiers && (
        <div className="mt-2">
          <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
            {productPricing.priceTiers.map((tier, index) => (
              <PriceTier
                key={index}
                tier={tier}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show original price if provided and different from current price */}
      {originalPrice && originalPrice > price && (
        <div className="mt-1">
          <span className={`text-gray-400 line-through ${sizeStyles[size].original}`}>
            {formatPrice(originalPrice)}
          </span>
        </div>
      )}
    </div>
  );
}