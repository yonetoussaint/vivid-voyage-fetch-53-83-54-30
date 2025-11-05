// PriceInfo.tsx - Enhanced version with MOQ, ranges, and Alibaba-like features
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
      <span className="text-sm font-semibold text-green-600">
        {formatPrice(tierPrice, currentCurrency)}
      </span>
    </div>
  );
};

// MOQ Badge Component
const MOQBadge = ({ moq }) => {
  return (
    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
      <Info className="w-3 h-3" />
      <span>MOQ: {moq} units</span>
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
    <div className="space-y-1">
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
      {/* Main Price Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-sm text-gray-500">/ unit</span>
        </div>
        <CurrencySwitcher 
          currentCurrency={currentCurrency}
          onCurrencyChange={toggleCurrency}
        />
      </div>

      {/* MOQ Badge */}
      <div className="mb-4">
        <MOQBadge moq={productPricing.moq} />
      </div>

      {/* Price Tiers */}
      <div className="mb-4">
        <button
          onClick={() => setShowPriceTiers(!showPriceTiers)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
        >
          <span>Bulk pricing available</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showPriceTiers ? 'rotate-180' : ''}`} />
        </button>

        {showPriceTiers && (
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
        )}
      </div>

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