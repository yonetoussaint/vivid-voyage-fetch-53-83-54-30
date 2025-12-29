// src/components/product/ProductDetailInfo.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({ 
  product, 
  onReadMore 
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
  };

  const mergedProduct = { ...mockB2BData, ...product };

  const displayDescription =
    mergedProduct?.short_description || mergedProduct?.description || 'Product description not available.';
  const needsTruncation = displayDescription.length > 150;
  const truncatedDescription = displayDescription.slice(0, 150) + (displayDescription.length > 150 ? '...' : '');

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
          <span className="text-gray-700">{currentCurrency}</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>
      </>
    );
  };

  return (
    <div className="w-full px-2 bg-white font-sans space-y-2">
      {mergedProduct?.name && (
        <h2 className="text-sm text-gray-700 leading-tight">
          {mergedProduct?.name}
        </h2>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500 leading-none">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-sm text-gray-500">/ unit</span>
        </div>
        <CurrencySwitcher />
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncatedDescription}
        </p>
        {needsTruncation && onReadMore && (
          <button 
            onClick={onReadMore}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;