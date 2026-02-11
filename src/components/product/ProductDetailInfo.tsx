// src/components/product/ProductDetailInfo.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductDetailInfoProps {
  product?: {
    name?: string;
    short_description?: string;
    description?: string;
    unitPrice?: number;
    demoVideoUrl?: string;
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
    USD: 'USD',
    HTD: 'HTD'
  };

  const exchangeRates = {
    HTG: 1,
    USD: 1/132.50, // 1 USD = 132.50 HTG
    HTD: 5 // 1 HTD = 5 HTG
  };

  const mergedProduct = { 
    unitPrice: 189.99, // Price in USD
    ...product 
  };

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
    // Convert USD price to HTG first, then to target currency
    const priceInHTG = price * 132.50;
    const convertedPrice = priceInHTG * exchangeRates[currency];
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'HTD' ? 'HTG' : currency, // HTD uses HTG format
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const getFlagSvg = (currency: string) => {
    switch(currency) {
      case 'HTG':
        return (
          <svg className="w-3.5 h-3.5 rounded-full" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="#00209F"/>
            <rect width="24" height="12" y="12" fill="#D21034"/>
            <rect width="12" height="24" x="6" fill="#FFFFFF"/>
          </svg>
        );
      case 'USD':
        return (
          <svg className="w-3.5 h-3.5 rounded-full" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="#B22234"/>
            <rect width="24" height="2.4" y="0" fill="#FFFFFF"/>
            <rect width="24" height="2.4" y="4.8" fill="#FFFFFF"/>
            <rect width="24" height="2.4" y="9.6" fill="#FFFFFF"/>
            <rect width="24" height="2.4" y="14.4" fill="#FFFFFF"/>
            <rect width="24" height="2.4" y="19.2" fill="#FFFFFF"/>
            <rect width="9.6" height="12" fill="#3C3B6E"/>
            <circle cx="4.8" cy="6" r="1.2" fill="#FFFFFF"/>
            <circle cx="4.8" cy="9" r="1.2" fill="#FFFFFF"/>
            <circle cx="7.2" cy="4.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="7.2" cy="7.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="2.4" cy="4.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="2.4" cy="7.8" r="1.2" fill="#FFFFFF"/>
          </svg>
        );
      case 'HTD':
        return (
          <svg className="w-3.5 h-3.5 rounded-full" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="#FFD700"/>
            <rect width="24" height="12" y="12" fill="#00209F"/>
            <rect width="12" height="24" x="6" fill="#D21034"/>
            <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
            <text x="12" y="16" fontSize="8" textAnchor="middle" fill="#000000" fontWeight="bold">D</text>
          </svg>
        );
      default:
        return null;
    }
  };

  const currentPrice = mergedProduct.unitPrice || 25;

  return (
    <div className="w-full bg-white font-sans">
      {/* Main Product Info */}
      <div className="px-2 py-2 space-y-2 border-b border-gray-100">
        {/* Product Name */}
        <h1 className="text-base font-bold text-gray-900 leading-tight">
          {mergedProduct?.name || 'Product Name'}
        </h1>

        {/* Price and Currency Switcher */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-red-600">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm text-gray-500">/ unit</span>
            </div>
          </div>

          {/* Currency Switcher - no wrapper, gray bg, reduced height */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md active:bg-gray-200"
            aria-label={`Change currency, current: ${currentCurrency}`}
          >
            {getFlagSvg(currentCurrency)}
            <span className="text-xs font-medium text-gray-700">{currentCurrency}</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="px-2 py-3 space-y-3">
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