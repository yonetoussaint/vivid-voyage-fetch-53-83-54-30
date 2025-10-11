import React from 'react';

export default function StockProgressBar({ product }) {
  const total = product.inStock + product.sold;
  const stockPct = (product.inStock / total) * 100;

  const getColors = () => {
    if (stockPct < 20) return '#ef4444';
    if (stockPct < 40) return '#eab308';
    return '#22c55e';
  };

  const stockColor = getColors();
  const soldColor = '#f97316';
  const isPositive = product.change >= 0;

  return (
    <div 
      className="relative p-2 rounded-lg shadow-sm"
      style={{
        border: '3px solid transparent',
        background: `
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)) padding-box,
          conic-gradient(
            from 0deg,
            ${stockColor} 0%, 
            ${stockColor} ${stockPct}%, 
            ${soldColor} ${stockPct}%, 
            ${soldColor} 100%
          ) border-box
        `,
        borderRadius: '0.5rem',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{product.change.toFixed(1)}%
            </span>
            <span className={`text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '▲' : '▼'}
            </span>
          </div>
          <div className="flex gap-1.5 text-[10px] text-white/80">
            <span>{product.sold} sold</span>
            <span className="text-white/40">|</span>
            <span>{product.inStock} left</span>
          </div>
        </div>
      </div>
    </div>
  );
}