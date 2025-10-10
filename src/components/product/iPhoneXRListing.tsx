// iPhoneXRListing.tsx - Description with Reviews on same line
import React from 'react';
import { Star } from 'lucide-react';

interface IPhoneXRListingProps {
  product?: {
    short_description?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
  };
  onReadMore?: () => void;
}

export function IPhoneXRListing({ product, onReadMore }: IPhoneXRListingProps) {
  // Use short_description if available, otherwise fall back to description
  const displayDescription = product?.short_description || product?.description || 'Product description not available.';

  // Check if description needs truncation (rough estimate - more than ~150 characters)
  const needsTruncation = displayDescription.length > 150;
  const truncatedDescription = displayDescription.slice(0, 150) + (displayDescription.length > 150 ? '...' : '');

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <div className="w-full px-2 bg-white font-sans">
      {/* Description with truncation and reviews on same line */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {truncatedDescription}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Read More Button */}
          {needsTruncation && (
            <button 
              onClick={handleReadMore}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Read more
            </button>
          )}

          {/* Reviews Section */}
          <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
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
        </div>
      </div>
    </div>
  );
}