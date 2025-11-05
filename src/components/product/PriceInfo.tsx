// PriceInfo.tsx - Reorganized with two-column layout
import React, { useState, useMemo } from 'react';
import { ChevronDown, Info, Truck, Shield, Check } from 'lucide-react';

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
  ],
  shipping: {
    freeThreshold: 1000,
    cost: 50
  },
  features: [
    "Trade Assurance",
    "7-day delivery",
    "Customization available",
    "Quality guaranteed"
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-white cursor-pointer transition-all hover:shadow-sm text-sm font-medium"
        aria-label="Change currency"
      >
        <span className={`fi fi-${currencyToCountry[currentCurrency]} rounded-sm`}></span>
        <span>{currentCurrency}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
    </>
  );
};

// MOQ Badge Component
const MOQBadge = ({ moq }) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
      <Info className="w-4 h-4" />
      <span className="font-medium">MOQ: {moq.toLocaleString()} units</span>
    </div>
  );
};

// Bulk Pricing Toggle Component
const BulkPricingToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-white cursor-pointer transition-all hover:shadow-sm text-sm font-medium text-gray-700"
    >
      <span>Bulk pricing</span>
      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
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
    ? `${tier.minQty.toLocaleString()}-${tier.maxQty.toLocaleString()} units`
    : `≥${tier.minQty.toLocaleString()} units`;

  const discountPercent = tier.discount * 100;

  return (
    <div className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <span className="text-sm font-medium text-gray-700 block">{rangeText}</span>
        {discountPercent > 0 && (
          <span className="text-xs text-green-600 font-medium">
            Save {discountPercent}%
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-green-600">
        {formatPrice(tierPrice, currentCurrency)}
      </span>
    </div>
  );
};

// Shipping Info Component
const ShippingInfo = ({ freeThreshold, cost, currentCurrency }) => {
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price * exchangeRates[currency]);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Truck className="w-4 h-4" />
      <span>
        Shipping: {freeThreshold ? 
          `Free on orders over ${formatPrice(freeThreshold, currentCurrency)}` : 
          `${formatPrice(cost, currentCurrency)}`
        }
      </span>
    </div>
  );
};

// Feature List Component
const FeatureList = ({ features }) => {
  return (
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-green-500" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
};

// Enhanced PriceInfo Component
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
    <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-md">
      {/* Main Price Row - Two Columns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Left Column - Price and MOQ */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            <span className="text-sm text-gray-500">/ unit</span>
          </div>
          
          {/* MOQ Badge */}
          <MOQBadge moq={productPricing.moq} />
        </div>

        {/* Right Column - Currency Switcher and Bulk Pricing Toggle */}
        <div className="space-y-3">
          {/* Currency Switcher */}
          <div className="flex justify-end">
            <CurrencySwitcher 
              currentCurrency={currentCurrency}
              onCurrencyChange={toggleCurrency}
            />
          </div>
          
          {/* Bulk Pricing Toggle */}
          <div className="flex justify-end">
            <BulkPricingToggle 
              isOpen={showPriceTiers}
              onToggle={() => setShowPriceTiers(!showPriceTiers)}
            />
          </div>
        </div>
      </div>

      {/* Price Tiers Dropdown */}
      {showPriceTiers && (
        <div className="mb-4">
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

      {/* Shipping Information */}
      <div className="mb-4">
        <ShippingInfo
          freeThreshold={productPricing.shipping.freeThreshold}
          cost={productPricing.shipping.cost}
          currentCurrency={currentCurrency}
        />
      </div>

      {/* Features */}
      <div className="mb-4">
        <FeatureList features={productPricing.features} />
      </div>

      {/* Trade Assurance Badge */}
      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <Shield className="w-5 h-5 text-orange-500" />
        <div>
          <div className="text-sm font-semibold text-orange-700">Trade Assurance</div>
          <div className="text-xs text-orange-600">Protects your Alibaba.com order</div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm mb-1">
          <span>Unit price:</span>
          <span>{formatPrice(currentPrice)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>MOQ ({productPricing.moq} units):</span>
          <span className="font-semibold">
            {formatPrice(currentPrice * productPricing.moq)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping:</span>
          <span className="text-green-600">
            {productPricing.shipping.freeThreshold ? 'Free' : formatPrice(productPricing.shipping.cost)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;