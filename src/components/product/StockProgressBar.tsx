import React from 'react';

export default function StockProgressBar({ product }) {
  const total = product.inStock + product.sold;
  const stockPct = (product.inStock / total) * 100;
  
  const getColors = () => {
    if (stockPct < 20) return { bar: 'bg-gradient-to-r from-red-400 to-red-600' };
    if (stockPct < 40) return { bar: 'bg-gradient-to-r from-yellow-400 to-yellow-600' };
    return { bar: 'bg-gradient-to-r from-green-400 to-green-600' };
  };

  const colors = getColors();
  const isPositive = product.change >= 0;

  return (
    <>
      <div className="backdrop-blur-md bg-black/10 rounded-lg p-3 mb-3 border border-gray-200/50 shadow-sm">
        <div className="flex justify-between items-baseline">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{product.change.toFixed(1)}%
            </span>
            <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '▲' : '▼'}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <span>{product.sold} sold</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${colors.bar}`}></div>
              <span>{product.inStock} stock</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`absolute left-0 h-full ${colors.bar} transition-all duration-500`} style={{ width: '100%' }} />
        <div className="absolute left-0 h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 rounded-r-full" 
             style={{ width: `${100 - stockPct}%` }} />
      </div>
    </>
  );
}