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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{product.change.toFixed(1)}%
          </span>
          <span className={`text-[10px] ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '▲' : '▼'}
          </span>
        </div>
        <div className="flex gap-1.5 text-[10px] text-gray-700">
          <span>{product.sold} sold</span>
          <span className="text-gray-400">|</span>
          <span>{product.inStock} left</span>
        </div>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`absolute left-0 h-full ${colors.bar} transition-all duration-500`} style={{ width: '100%' }} />
        <div className="absolute left-0 h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 rounded-r-full" 
             style={{ width: `${100 - stockPct}%` }} />
      </div>
    </div>
  );
}