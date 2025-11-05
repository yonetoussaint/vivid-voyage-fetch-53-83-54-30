import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies, currencyToCountry } from '@/contexts/CurrencyContext';

interface CurrencySwitcherProps {
  showPrice?: boolean;
  price?: number;
  className?: string;
  buttonClassName?: string;
  showToggle?: boolean;
  variant?: 'overlay' | 'inline'; // New prop to control styling variant
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  showPrice = true, 
  price = 0,
  className = "",
  buttonClassName = "",
  showToggle = true,
  variant = 'overlay' // Default to overlay for backward compatibility
}) => {
  const { currentCurrency, toggleCurrency, formatPrice } = useCurrency();

  const baseStyles = variant === 'overlay' 
    ? 'bg-black/60 backdrop-blur-sm text-white'
    : 'bg-gray-100 text-gray-900 border border-gray-200';

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />

      <div className={className}>
        <button
          onClick={showToggle ? toggleCurrency : undefined}
          className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${baseStyles} ${
            showToggle ? 'hover:bg-gray-200 cursor-pointer' : 'cursor-default'
          } transition-colors ${buttonClassName}`}
          aria-label={showToggle ? "Change currency" : "Current price"}
          disabled={!showToggle}
        >
          {showToggle && (
            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
              <span className={`fi fi-${currencyToCountry[currentCurrency]} scale-150`}></span>
            </div>
          )}
          {showToggle && <ChevronDown className="w-4 h-4 stroke-2" />}
          {showPrice && (
            <span className={`font-bold ${variant === 'overlay' ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(price)}
            </span>
          )}
          <span className={`font-bold ${variant === 'overlay' ? 'text-white' : 'text-gray-600'}`}>
            {currencies[currentCurrency]}
          </span>
        </button>
      </div>
    </>
  );
};

interface PriceInfoProps {
  product?: {
    id: string;
    name: string;
    price?: number;
    variants?: any[];
    unitPrice?: number; // Add B2B pricing support
    bulkPrices?: { minQty: number; price: number }[];
  };
  focusMode?: boolean;
  isPlaying?: boolean;
  configurationData?: {
    selectedColor?: string;
    selectedStorage?: string;
    selectedNetwork?: string;
    selectedCondition?: string;
    getSelectedColorVariant: () => any;
    getSelectedStorageVariant: () => any;
    getSelectedNetworkVariant: () => any;
    getSelectedConditionVariant: () => any;
  } | null;
  variant?: 'overlay' | 'inline'; // New prop to control styling
  showBulkPricing?: boolean; // Show bulk pricing details
}

const PriceInfo: React.FC<PriceInfoProps> = ({ 
  product, 
  focusMode,
  isPlaying,
  configurationData,
  variant = 'inline', // Default to inline for IPhoneXRListing
  showBulkPricing = true
}) => {
  const { formatPrice } = useCurrency();

  if (!product) return null;

  // Always get the price from the selected variant
  const getCurrentVariantPrice = () => {
    if (configurationData) {
      // Try to get price from the deepest level variant (condition > network > storage > color)
      const selectedConditionVariant = configurationData.getSelectedConditionVariant();
      if (selectedConditionVariant && selectedConditionVariant.price !== undefined) {
        return selectedConditionVariant.price;
      }

      const selectedNetworkVariant = configurationData.getSelectedNetworkVariant();
      if (selectedNetworkVariant && selectedNetworkVariant.price !== undefined) {
        return selectedNetworkVariant.price;
      }

      const selectedStorageVariant = configurationData.getSelectedStorageVariant();
      if (selectedStorageVariant && selectedStorageVariant.price !== undefined) {
        return selectedStorageVariant.price;
      }

      const selectedColorVariant = configurationData.getSelectedColorVariant();
      if (selectedColorVariant && selectedColorVariant.price !== undefined) {
        return selectedColorVariant.price;
      }
    }

    // Use B2B unit price if available, otherwise product price
    return product.unitPrice || product.price || 0;
  };

  const currentPrice = getCurrentVariantPrice();

  // For overlay variant (original behavior)
  if (variant === 'overlay') {
    return (
      <div className={`absolute bottom-12 left-3 z-30 transition-opacity duration-300 ${(focusMode || isPlaying) ? 'opacity-0' : ''}`}>
        <CurrencySwitcher 
          showPrice={true}
          price={currentPrice}
          showToggle={false}
          variant="overlay"
        />
      </div>
    );
  }

  // For inline variant (new behavior for IPhoneXRListing)
  return (
    <div className="mb-4">
      {/* Main Price Display */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatPrice(currentPrice)}
        </span>
        <CurrencySwitcher 
          showPrice={false}
          showToggle={true}
          variant="inline"
          buttonClassName="text-sm"
        />
      </div>

      {/* Bulk Pricing */}
      {showBulkPricing && product.bulkPrices && product.bulkPrices.length > 0 && (
        <div className="text-sm text-gray-600 space-y-1">
          <div className="font-medium text-gray-700">Bulk pricing:</div>
          {product.bulkPrices.map((tier, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{tier.minQty}+ units</span>
              <span className="font-semibold">{formatPrice(tier.price)} each</span>
            </div>
          ))}
        </div>
      )}

      {/* Unit Price for B2B */}
      {product.unitPrice && product.unitPrice !== currentPrice && (
        <div className="text-sm text-gray-500 mt-1">
          Unit price: {formatPrice(product.unitPrice)}
        </div>
      )}
    </div>
  );
};

export default PriceInfo;