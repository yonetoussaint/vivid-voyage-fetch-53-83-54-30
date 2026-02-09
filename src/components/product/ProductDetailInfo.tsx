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
  const CURRENCIES = {
    HTG: { code: 'HTG', flag: 'ht', rate: 132.50 },
    USD: { code: 'USD', flag: 'us', rate: 1 }
  };

  const mockB2BData = { unitPrice: 189.99 };
  const mergedProduct = { ...mockB2BData, ...product };
  
  const displayDescription = mergedProduct?.short_description || 
    mergedProduct?.description || 
    'Product description not available.';
  
  const needsTruncation = displayDescription.length > 120;
  const truncatedDescription = needsTruncation 
    ? `${displayDescription.slice(0, 120)}...` 
    : displayDescription;

  const [currentCurrency, setCurrentCurrency] = useState<'HTG' | 'USD'>('HTG');

  const toggleCurrency = () => {
    setCurrentCurrency(currentCurrency === 'HTG' ? 'USD' : 'HTG');
  };

  const formatPrice = (price: number) => {
    const convertedPrice = price * CURRENCIES[currentCurrency].rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const currentPrice = mergedProduct.unitPrice || 25;

  return (
    <div className="w-full px-3 py-2 bg-white font-sans">
      {/* Product Name */}
      {mergedProduct?.name && (
        <h2 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
          {mergedProduct.name}
        </h2>
      )}

      {/* Price & Currency Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-orange-600">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-xs text-gray-500">/unit</span>
        </div>
        
        <button
          onClick={toggleCurrency}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-xs border border-gray-200"
          aria-label={`Change currency to ${currentCurrency === 'HTG' ? 'USD' : 'HTG'}`}
        >
          <span className={`fi fi-${CURRENCIES[currentCurrency].flag}`}></span>
          <span className="font-medium text-gray-700">{currentCurrency}</span>
          <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
        </button>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <p className="text-xs text-gray-600 leading-relaxed">
          {truncatedDescription}
        </p>
        {needsTruncation && onReadMore && (
          <button 
            onClick={onReadMore}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 active:text-blue-900 transition-colors"
          >
            Read more
          </button>
        )}
      </div>

      {/* Flag icon CSS - load once */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" 
      />
    </div>
  );
};

export default ProductDetailInfo;