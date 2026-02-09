import React, { useState } from 'react';

// Flag components
const HaitianFlag = () => (
  <svg className="w-5 h-4 inline-block mr-2" viewBox="0 0 5 3">
    <rect width="5" height="1.5" fill="#00209F"/>
    <rect y="1.5" width="5" height="1.5" fill="#D21034"/>
  </svg>
);

const EuroFlag = () => (
  <svg className="w-5 h-4 inline-block mr-2" viewBox="0 0 810 540">
    <rect width="810" height="540" fill="#003399"/>
    <g fill="#FFCC00">
      <circle cx="405" cy="270" r="50"/>
      <circle cx="405" cy="270" r="35" fill="#003399"/>
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return (
          <circle 
            key={i}
            cx={405 + 110 * Math.cos(angle)} 
            cy={270 + 110 * Math.sin(angle)} 
            r="15"
          />
        );
      })}
    </g>
  </svg>
);

const DominicanFlag = () => (
  <svg className="w-5 h-4 inline-block mr-2" viewBox="0 0 6 4">
    <rect width="6" height="4" fill="#fff"/>
    <rect width="6" height="1.8" fill="#002D62"/>
    <rect y="2.2" width="6" height="1.8" fill="#CE1126"/>
    <rect x="2.4" width="1.2" height="4" fill="#fff"/>
    <rect width="6" height="1.2" y="1.4" fill="#fff"/>
  </svg>
);

export default function ProductSection() {
  const product = {
    title: "Premium Wireless Headphones",
    priceUSD: 299.99,
    description: "Experience crystal-clear audio with our latest wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding for all-day wear. These headphones deliver studio-quality sound with deep bass, crisp highs, and balanced mids. Perfect for music lovers, podcast enthusiasts, and professionals who need reliable audio equipment.",
    bundles: [
      { qty: 1, discount: 0, label: "Single Unit" },
      { qty: 5, discount: 0.10, label: "Small Bundle (5+ units)" },
      { qty: 10, discount: 0.15, label: "Medium Bundle (10+ units)" },
      { qty: 25, discount: 0.20, label: "Large Bundle (25+ units)" },
      { qty: 50, discount: 0.25, label: "Wholesale (50+ units)" }
    ]
  };

  const currencies = {
    HTG: { symbol: 'G', rate: 131.50, name: 'Haitian Gourde', flag: HaitianFlag },
    EUR: { symbol: '€', rate: 0.92, name: 'Euro', flag: EuroFlag },
    DOP: { symbol: 'RD$', rate: 60.25, name: 'Dominican Peso', flag: DominicanFlag }
  };

  const [selectedCurrency, setSelectedCurrency] = useState('HTG');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceChange, setPriceChange] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [priceHistory, setPriceHistory] = useState([]);

  // Simulated price history data (in real app, this would come from API)
  const timeRanges = {
    '24h': { label: '24 Hours', change: -2.5 },
    '7d': { label: '7 Days', change: 5.2 },
    '30d': { label: '30 Days', change: -8.3 },
    '90d': { label: '90 Days', change: 12.1 }
  };

  const convertPrice = (code, bundleIndex = selectedBundle) => {
    const bundle = product.bundles[bundleIndex];
    const discountedPrice = product.priceUSD * (1 - bundle.discount);
    const converted = discountedPrice * currencies[code].rate;
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return currencies[code].symbol + ' ' + formatted;
  };

  const getPriceValue = (code, bundleIndex = selectedBundle) => {
    const bundle = product.bundles[bundleIndex];
    const discountedPrice = product.priceUSD * (1 - bundle.discount);
    return discountedPrice * currencies[code].rate;
  };

  const getHistoricalPrice = () => {
    const currentPrice = getPriceValue(selectedCurrency);
    const changePercent = timeRanges[selectedTimeRange].change;
    const historicalPrice = currentPrice / (1 + changePercent / 100);
    return historicalPrice;
  };

  const getPriceChangeAmount = () => {
    const currentPrice = getPriceValue(selectedCurrency);
    const historicalPrice = getHistoricalPrice();
    return currentPrice - historicalPrice;
  };

  const handleCurrencyChange = (code) => {
    const currentPrice = getPriceValue(selectedCurrency);
    const newPrice = getPriceValue(code);
    
    if (prevPrice !== null) {
      if (newPrice > currentPrice) {
        setPriceChange('up');
      } else if (newPrice < currentPrice) {
        setPriceChange('down');
      }
      
      setTimeout(() => setPriceChange(null), 1000);
    }
    
    setPrevPrice(currentPrice);
    setSelectedCurrency(code);
    setIsOpen(false);
  };

  const handleBundleChange = (bundleIndex) => {
    const currentPrice = getPriceValue(selectedCurrency, selectedBundle);
    const newPrice = getPriceValue(selectedCurrency, bundleIndex);
    
    if (newPrice > currentPrice) {
      setPriceChange('up');
    } else if (newPrice < currentPrice) {
      setPriceChange('down');
    }
    
    setTimeout(() => setPriceChange(null), 1000);
    
    setPrevPrice(currentPrice);
    setSelectedBundle(bundleIndex);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const shouldShowReadMore = product.description.length > 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-3">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4">
        {/* Product Title */}
        <h1 className="text-lg font-bold text-slate-900 mb-2 tracking-tight leading-tight">
          {product.title}
        </h1>
        
        {/* Product Description */}
        <div className="text-xs text-slate-600 mb-4 leading-relaxed">
          <p>
            {isExpanded || !shouldShowReadMore 
              ? product.description 
              : truncateText(product.description, 100)}
          </p>
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 font-medium mt-1 hover:text-blue-700 transition-colors text-xs"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-4"></div>
        
        {/* Combined Quantity and Currency Selector Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Quantity Dropdown - Left Column */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Quantity
            </label>
            <select
              value={selectedBundle}
              onChange={(e) => handleBundleChange(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-medium border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {product.bundles.map((bundle, index) => (
                <option key={index} value={index}>
                  {bundle.qty}+ units
                  {bundle.discount > 0 && ` - Save ${(bundle.discount * 100).toFixed(0)}%`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Currency Dropdown - Right Column */}
          <div className="flex flex-col relative">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Currency
            </label>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2 text-xs font-medium border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-slate-300 transition-colors flex items-center justify-between active:scale-98"
            >
              <span className="flex items-center gap-1 truncate">
                {currencies[selectedCurrency].flag()}
                <span className="font-semibold text-xs truncate">
                  {selectedCurrency}
                </span>
              </span>
              <svg 
                className={`w-3 h-3 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsOpen(false)}
                ></div>
                <div className="absolute w-full top-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden">
                  {Object.keys(currencies).map(code => (
                    <button
                      key={code}
                      onClick={() => handleCurrencyChange(code)}
                      className={`w-full px-3 py-2 text-sm font-medium text-left hover:bg-slate-50 active:bg-slate-100 flex items-center gap-2 transition-colors ${
                        selectedCurrency === code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      {currencies[code].flag()}
                      <span className="font-semibold text-xs">{currencies[code].name}</span>
                      <span className="text-slate-500 text-xs ml-auto">({code})</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Price Display */}
        <div className="bg-slate-900 rounded-lg p-3 relative">
          {/* Time Range Selector */}
          <div className="flex gap-1 mb-3">
            {Object.keys(timeRanges).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`flex-1 py-1 text-[10px] font-semibold rounded transition-all ${
                  selectedTimeRange === range
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {timeRanges[range].label}
              </button>
            ))}
          </div>

          {/* Historical Price Change Banner */}
          <div className={`mb-2 px-2 py-1.5 rounded-md flex items-center justify-between ${
            timeRanges[selectedTimeRange].change > 0 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}>
            <div className="flex items-center gap-1">
              {timeRanges[selectedTimeRange].change > 0 ? (
                <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-[10px] font-semibold ${
                timeRanges[selectedTimeRange].change > 0 ? 'text-red-400' : 'text-green-400'
              }`}>
                {timeRanges[selectedTimeRange].change > 0 ? '+' : ''}{timeRanges[selectedTimeRange].change.toFixed(1)}%
              </span>
            </div>
            <span className={`text-[10px] font-medium ${
              timeRanges[selectedTimeRange].change > 0 ? 'text-red-300' : 'text-green-300'
            }`}>
              {currencies[selectedCurrency].symbol} {Math.abs(getPriceChangeAmount()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-end justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Current Price per unit
              </div>
              <div className={`text-2xl font-bold text-white break-all leading-tight transition-all ${
                priceChange ? 'scale-105' : ''
              }`}>
                {convertPrice(selectedCurrency)}
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              {priceChange === 'up' && (
                <div className="bg-green-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {priceChange === 'down' && (
                <div className="bg-red-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          {product.bundles[selectedBundle].discount > 0 && (
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-700">
              <span className="text-slate-400">You save {(product.bundles[selectedBundle].discount * 100).toFixed(0)}% per unit</span>
              <span className="text-green-400 font-semibold">
                -{convertPrice(selectedCurrency, 0).split(' ')[0]} {(getPriceValue(selectedCurrency, 0) - getPriceValue(selectedCurrency)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}