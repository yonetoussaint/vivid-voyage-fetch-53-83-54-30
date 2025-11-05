// iPhoneXRListing.tsx - Simplified with Price and Currency Switcher
import React from 'react';
import { Star, ShieldCheck, Video, CreditCard } from 'lucide-react';
import PriceInfo from "@/components/product/PriceInfo";

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
  const isPositive = (mergedProduct?.change || 0) >= 0;

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <div className="w-full px-2 bg-white font-sans">

      {/* Product Title */}
      {mergedProduct?.name && (
        <h2 className="text-lg font-semibold text-gray-900">
          {mergedProduct.name}
        </h2>
      )}

      {/* Simplified PriceInfo Component - Just price and currency switcher */}
      <PriceInfo price={mergedProduct.unitPrice} />

      {/* Description with "Read More" */}
      <div className="mb-3">
        <div className="relative">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {truncatedDescription}
          </p>
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

        {/* Reviews + Stock Info */}
        <div className="flex items-center justify-between gap-1 text-xs text-gray-600 rounded w-full mt-2">
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
      <div className="border-t border-gray-100 pt-3 space-y-3 text-sm">
        {/* Demo Video */}
        {mergedProduct?.demoVideoUrl && (
          <div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute top-2 left-2 bg-pink-400 bg-opacity-80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
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
            <CreditCard className="w-4 h-4 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-gray-800 font-medium">Payment Terms:</h4>
              <p className="text-gray-700">{mergedProduct.paymentTerms}</p>
            </div>
          </div>
        )}

        {/* Trade Assurance / Buyer Protection */}
        {mergedProduct?.tradeAssurance && (
          <div className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Trade Assurance / Buyer Protection available</span>
          </div>
        )}
      </div>
    </div>
  );
}