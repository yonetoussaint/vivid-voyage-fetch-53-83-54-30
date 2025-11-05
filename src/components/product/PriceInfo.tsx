import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Currency Context
const currencies = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY'
};

const currencyToCountry = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp'
};

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50
};

const CurrencyContext = createContext(null);

const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  const toggleCurrency = () => {
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price) => {
    const convertedPrice = price * exchangeRates[currentCurrency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

// CurrencySwitcher Component
export const CurrencySwitcher = ({ 
  showPrice = true, 
  price = 0,
  className = "",
  buttonClassName = "",
  showToggle = true,
  variant = 'overlay'
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

// PriceInfo Component
const PriceInfo = ({ 
  product, 
  focusMode,
  isPlaying,
  configurationData,
  variant = 'inline',
  showBulkPricing = true
}) => {
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const getCurrentVariantPrice = () => {
    if (configurationData) {
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

    return product.unitPrice || product.price || 0;
  };

  const currentPrice = getCurrentVariantPrice();

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

  return (
    <div className="mb-4">
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

      {product.unitPrice && product.unitPrice !== currentPrice && (
        <div className="text-sm text-gray-500 mt-1">
          Unit price: {formatPrice(product.unitPrice)}
        </div>
      )}
    </div>
  );
};

export default PriceInfo;

export { CurrencyProvider, useCurrency, CurrencySwitcher, currencies, currencyToCountry };