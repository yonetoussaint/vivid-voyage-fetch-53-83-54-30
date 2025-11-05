// iPhoneXRListing.tsx - Fixed consistent spacing
import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, Video, CreditCard, ChevronDown, Info } from 'lucide-react';

// ... (keep all the currency and pricing data the same)

export function IPhoneXRListing({ product, onReadMore }: IPhoneXRListingProps) {
  // ... (keep all the existing logic the same)

  return (
    <div className="w-full px-2 bg-white font-sans space-y-2">

      {/* Product Title - Always render but conditionally show content */}
      <div className={!mergedProduct?.name ? 'hidden' : ''}>
        <h2 className="text-lg font-semibold text-gray-900">
          {mergedProduct?.name}
        </h2>
      </div>

      {/* Price Row - Always present */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-sm text-gray-500">/ unit</span>
        </div>
        <CurrencySwitcher />
      </div>

      {/* MOQ Row - Always present */}
      <div className="flex justify-between items-center bg-orange-50 rounded px-3 py-2 border border-orange-200">
        <div className="flex items-center gap-1 text-orange-700 text-xs">
          <Info className="w-3 h-3" />
          <span>MOQ: {productPricing.moq} units</span>
        </div>
        <BulkPricingToggle />
      </div>

      {/* Price Tiers - Conditionally shown */}
      {showPriceTiers && (
        <div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
            {productPricing.priceTiers.map((tier, index) => (
              <PriceTier key={index} tier={tier} />
            ))}
          </div>
        </div>
      )}

      {/* Description Section - Always present */}
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

      {/* B2B Trade Details - Always present but conditionally shows content */}
      <div className="border-t border-gray-100 pt-2 space-y-2 text-sm">
        {/* ... (keep all the B2B details the same) */}
      </div>
    </div>
  );
}