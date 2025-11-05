// iPhoneXRListing.tsx - Fixed spacing
import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, Video, CreditCard, ChevronDown, Info } from 'lucide-react';

// Currency data (moved from PriceInfo)
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

interface IPhoneXRListingProps {
  product?: {
    name?: string;
    short_description?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    inventory?: number;
    sold_count?: number;
    change?: number;
    unitPrice?: number;
  };
  onReadMore?: () => void;
}

// Mock data for demonstration
const mockB2BData = {
  unitPrice: 189.99,
};

export function IPhoneXRListing({ product, onReadMore }: IPhoneXRListingProps) {
  // Merge product with mock B2B data
  const mergedProduct = { ...mockB2BData, ...product };

  const displayDescription =
    mergedProduct?.short_description || mergedProduct?.description || 'Product description not available.';
  const needsTruncation = displayDescription.length > 150;
  const truncatedDescription = displayDescription.slice(0, 150) + (displayDescription.length > 150 ? '...' : '');

  const inStock = mergedProduct?.inventory || 0;
  const sold = mergedProduct?.sold_count || 0;

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  // PriceInfo logic moved inline
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

  const currentPrice = (mergedProduct.unitPrice || productPricing.basePrice) * (1 - currentTier.discount);

  // CurrencySwitcher Component (moved inline)
  const CurrencySwitcher = () => {
    return (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
        <button
          onClick={toggleCurrency}
          className="p-1 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors text-xs"
          aria-label="Change currency"
        >
          <span className={`fi fi-${currencyToCountry[currentCurrency]}`}></span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </>
    );
  };

  // PriceTier Component (moved inline)
  const PriceTier = ({ tier }) => {
    const calculatePrice = (basePrice, discount) => {
      return basePrice * (1 - discount) * exchangeRates[currentCurrency];
    };

    const tierPrice = calculatePrice(mergedProduct.unitPrice || productPricing.basePrice, tier.discount);
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

  // Bulk Pricing Toggle Component (moved inline)
  const BulkPricingToggle = () => {
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

  return (
    <div className="w-full px-2 bg-white font-sans space-y-2">

      {/* Product Title */}
      {mergedProduct?.name && (
        <h2 className="text-lg font-semibold text-gray-900">
          {mergedProduct.name}
        </h2>
      )}

      {/* Inline PriceInfo Component - NO FRAGMENT WRAPPER */}
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
        <CurrencySwitcher />
      </div>

      {/* Second Row: MOQ and Bulk Pricing Toggle with AliExpress Orange Background */}
      <div className="flex justify-between items-center bg-orange-50 rounded px-3 py-2 border border-orange-200">
        {/* MOQ Section */}
        <div className="flex items-center gap-1 text-orange-700 text-xs">
          <Info className="w-3 h-3" />
          <span>MOQ: {productPricing.moq} units</span>
        </div>
        
        {/* Bulk Pricing Toggle */}
        <BulkPricingToggle />
      </div>

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

      {/* Description with "Read More" */}
      <div className="space-y-2">
        <div className="relative">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {truncatedDescription}
          </p>
          {needsTruncation && (
            <div className="absolute bottom-0 right-0 flex items-center">
              <span className="bg-gradient-to-r from-transparent to-white pl-8 pr-1">&nbsp;</span>
              <button
                onClick={handleReadMore}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors bg-white"
              >
                Read more
              </button>
            </div>
          )}
        </div>

        {/* Reviews + Stock Info */}
        <div className="flex items-center justify-between gap-1 text-xs text-gray-600 rounded w-full">
          {/* Reviews */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i <= Math.floor(mergedProduct?.rating || 4.8)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1">({mergedProduct?.rating?.toFixed(1) || '4.8'})</span>
            <span className="text-gray-400">•</span>
            <span>{mergedProduct?.reviewCount || 0} reviews</span>
          </div>

          {/* Stock Info */}
          {inStock > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-[10px] text-gray-600">
                <span>{sold} sold</span>
                <span>•</span>
                <span>{inStock} left</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified B2B Trade Details */}
      <div className="border-t border-gray-100 pt-2 space-y-2 text-sm">
        {/* Demo Video */}
        {mergedProduct?.demoVideoUrl && (
          <div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute top-2 left-2 bg-orange-500 bg-opacity-80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
                Demo
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-900 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minimum Order Quantity */}
        {mergedProduct?.minOrderQty && (
          <div>
            <h4 className="text-gray-800 font-medium">Minimum Order:</h4>
            <p className="text-gray-700">{mergedProduct.minOrderQty} units</p>
          </div>
        )}

        {/* Payment Terms */}
        {mergedProduct?.paymentTerms && (
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-orange-500 mt-0.5" />
            <div>
              <h4 className="text-gray-800 font-medium">Payment Terms:</h4>
              <p className="text-gray-700">{mergedProduct.paymentTerms}</p>
            </div>
          </div>
        )}

        {/* Trade Assurance / Buyer Protection */}
        {mergedProduct?.tradeAssurance && (
          <div className="flex items-center gap-2 text-orange-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Trade Assurance / Buyer Protection available</span>
          </div>
        )}
      </div>
    </div>
  );
}