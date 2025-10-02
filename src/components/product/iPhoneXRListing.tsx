import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Star, User } from 'lucide-react';
import { Product } from '@/integrations/supabase/products';

interface IPhoneXRListingProps {
  product?: Product;
}

export function IPhoneXRListing({ product }: IPhoneXRListingProps) {
  const [liveViews, setLiveViews] = useState(product?.views || 847);

  useEffect(() => {
    // Initialize with real view count from product
    if (product?.views) {
      setLiveViews(product.views);
    }

    const interval = setInterval(() => {
      setLiveViews(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const baseViews = product?.views || 820;
        const newViews = Math.max(baseViews - 50, Math.min(baseViews + 200, prev + change));
        return newViews;
      });
    }, 3000 + Math.random() * 2000); // 3-5 seconds

    return () => clearInterval(interval);
  }, [product?.views]);

  // Use short_description if available, otherwise fall back to description
  const displayDescription = product?.short_description || product?.description || 'Product description not available.';

  return (
    <div className="w-full px-2 bg-white">
      {/* Header with live views */}
      <div className="flex items-center mb-2">
        <div className="flex-1 overflow-hidden">
          <h1 className="text-lg font-medium text-gray-900 whitespace-nowrap overflow-x-auto scrollbar-hide">
            {product?.name || 'Product Name'}
          </h1>
        </div>
        <div className="w-px h-5 bg-gray-300 mr-3"></div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>        <span>{liveViews.toLocaleString()} viewing</span>
        </div>
      </div>

      {/* Description - Now using short_description */}
        <p className="text-base text-gray-600 leading-relaxed mb-3">
        {displayDescription}
      </p>

      {/* Rest of your component remains the same */}
      {/* Rating section */}
      <div className="flex items-center justify-between mb-4 py-2 border-y border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i <= Math.floor(product?.rating || 4.8) 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">({product?.rating?.toFixed(1) || '4.8'})</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>{product?.reviewCount || 0} reviews</span>
          <span className="text-gray-300">|</span>
          <span>{product?.sold_count || 0} sold</span>
        </div>
      </div>

      {/* Stock and activity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-800 font-medium">
              {(product?.inventory || 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {(product?.inventory || 0) > 0 && (product?.inventory || 0) <= 50 && (
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-medium">Low</span>
            )}
            {(product?.inventory || 0) > 50 && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">Available</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xl font-semibold text-gray-900">{product?.inventory || 0}</span>
            <span className="text-gray-400 text-sm ml-1">left</span>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              (product?.inventory || 0) <= 10 ? 'bg-red-400' :
              (product?.inventory || 0) <= 50 ? 'bg-orange-400' : 'bg-green-400'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(5, ((product?.inventory || 0) / 100) * 100))}%` 
            }}
          ></div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last sold</span>
            <span className="text-orange-600">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}