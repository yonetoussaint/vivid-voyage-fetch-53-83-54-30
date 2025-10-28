// iPhoneXRListing.tsx - Description with Reviews on same line + Stock Info
import React from 'react';
import { Star } from 'lucide-react';

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
  };
  onReadMore?: () => void;
}

export function IPhoneXRListing({ product, onReadMore }: IPhoneXRListingProps) {
  // Use short_description if available, otherwise fall back to description
  const displayDescription = product?.short_description || product?.description || 'Product description not available.';

  // Check if description needs truncation (rough estimate - more than ~150 characters)
  const needsTruncation = displayDescription.length > 150;
  const truncatedDescription = displayDescription.slice(0, 150) + (displayDescription.length > 150 ? '...' : '');

  // Stock data calculations
  const inStock = product?.inventory || 0;
  const sold = product?.sold_count || 0;
  const total = inStock + sold;
  const stockPct = total > 0 ? (inStock / total) * 100 : 0;
  const isPositive = (product?.change || 0) >= 0;

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <div className="w-full px-2 bg-white font-sans">
      {/* Product Title */}
      {product?.name && (
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h2>
      )}
      
      {/* Description with truncation and read more button positioned at the end of third line */}
      <div className="mb-3">
        <div className="relative">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {truncatedDescription}
          </p>
          
          {/* Read More Button fixed overlay at bottom right of third line */}
          {needsTruncation && (
            <div className="absolute bottom-0 right-0 flex items-center">
              <span className="bg-gradient-to-r from-transparent to-white pl-8 pr-1">&nbsp;</span>
              <button 
                onClick={handleReadMore}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors bg-white"
              >
                Read more
              </button>
            </div>
          )}
        </div>

        {/* Full width Stats Section with Reviews and Stock Info */}
        <div className="flex items-center justify-between gap-1 text-xs text-gray-600 rounded w-full mt-2">
          {/* Reviews Section */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i <= Math.floor(product?.rating || 4.8) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-1">({product?.rating?.toFixed(1) || '4.8'})</span>
            <span className="text-gray-400 ml-1">•</span>
            <span>{product?.reviewCount || 0} reviews</span>
          </div>

          {/* Stock Info Section */}
          {inStock > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{(product?.change || 0).toFixed(1)}%
                </span>
                <span className={`text-[10px] ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '▲' : '▼'}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex gap-1 text-[10px] text-gray-600">
                <span>{sold} sold</span>
                <span>•</span>
                <span>{inStock} left</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}