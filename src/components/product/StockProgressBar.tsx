import React from 'react';

interface StockProgressBarProps {
  product: {
    id: string;
    inventory: number;     // Real stock count from database
    sold_count: number;    // Real sold count from database  
    change?: number;       // For percentage change
  };
}

export default function StockProgressBar({ product }: StockProgressBarProps) {
  const inStock = product.inventory || 0;
  const sold = product.sold_count || 0;
  const total = inStock + sold;

  // Avoid division by zero
  const stockPct = total > 0 ? (inStock / total) * 100 : 0;

  const getColors = () => {
    if (stockPct < 20) return '#ef4444';
    if (stockPct < 40) return '#eab308';
    return '#22c55e';
  };

  const stockColor = getColors();
  const soldColor = '#f97316';
  const isPositive = (product.change || 0) >= 0;

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
              {isPositive ? '+' : ''}{(product.change || 0).toFixed(1)}%
            </span>
            <span className={`text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '▲' : '▼'}
            </span>
          </div>
          <div className="flex gap-1.5 text-[10px] text-white/80">
            <span>{sold} sold</span>
            <span className="text-white/40">|</span>
            <span>{inStock} left</span>
          </div>
        </div>
      </div>
    </div>
  );
}