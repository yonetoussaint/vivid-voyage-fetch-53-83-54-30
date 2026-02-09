// src/components/product/ProductDetailInfo.tsx
import React, { useState } from 'react';
import { ChevronDown, Star, CreditCard, Package } from 'lucide-react';

interface ProductDetailInfoProps {
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
    demoVideoUrl?: string;
    minOrderQty?: number;
    paymentTerms?: string;
    tradeAssurance?: boolean;
  };
  onReadMore?: () => void;
  isLoading?: boolean;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({ 
  product, 
  onReadMore,
  isLoading = false
}) => {
  const currencies = {
    HTG: 'HTG',
    USD: 'USD'
  };

  const currencyToCountry = {
    HTG: 'ht',
    USD: 'us'
  };

  const exchangeRates = {
    HTG: 132.50,
    USD: 1
  };

  const mockB2BData = {
    unitPrice: 189.99,
    rating: 4.5,
    reviewCount: 128,
    minOrderQty: 50,
    paymentTerms: '30 days credit'
  };

  const mergedProduct = { ...mockB2BData, ...product };

  const displayDescription =
    mergedProduct?.short_description || mergedProduct?.description || 'Product description not available.';
  const needsTruncation = displayDescription.length > 120;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [currentCurrency, setCurrentCurrency] = useState('HTG');

  const toggleCurrency = () => {
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price: number, currency = currentCurrency) => {
    const convertedPrice = price * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const currentPrice = mergedProduct.unitPrice || 25;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full px-2 py-3 bg-white animate-pulse">
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-sans">
      {/* Main Product Info */}
      <div className="px-2 py-2 space-y-2 border-b border-gray-100">
        {/* Product Name */}
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {mergedProduct?.name || 'Product Name'}
        </h1>

        {/* Price and Currency Switcher */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm text-gray-500">/ unit</span>
            </div>
            <span className="text-xs text-gray-400 mt-1">EXW (Ex Works)</span>
          </div>

          {/* Compact Currency Switcher */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-2 py-1.5 border border-gray-300 rounded-lg active:bg-gray-50"
            aria-label={`Change currency, current: ${currentCurrency}`}
          >
            <span className={`fi fi-${currencyToCountry[currentCurrency]} text-sm`}></span>
            <span className="text-sm font-medium text-gray-700">{currentCurrency}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        {/* Rating and Reviews - Compact */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(mergedProduct.rating || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {mergedProduct.rating?.toFixed(1) || '4.5'}
          </span>
          <span className="text-sm text-gray-500">
            ({mergedProduct.reviewCount || 0} reviews)
          </span>
        </div>
      </div>

      {/* Product Description */}
      <div className="px-2 py-3 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Product Description</h3>

        <div className="relative">
          <p className={`text-sm text-gray-700 leading-relaxed ${
            !isDescriptionExpanded && needsTruncation ? 'line-clamp-3' : ''
          }`}>
            {displayDescription}
          </p>

          {needsTruncation && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 mt-2 active:text-red-800"
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
              <ChevronDown className={`w-3 h-3 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Demo Video Link (if available) */}
        {mergedProduct.demoVideoUrl && (
          <button
            onClick={onReadMore}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium active:text-blue-800"
            aria-label="Watch product demo video"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Watch product video
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;