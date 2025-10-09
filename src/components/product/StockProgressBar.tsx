import React from 'react';

export default function StockProgressBar({ product }) {
  const getStockStatus = (inStock, sold) => {
    const total = inStock + sold;
    const stockPercentage = (inStock / total) * 100;

    if (stockPercentage < 20) return 'critical';
    if (stockPercentage < 40) return 'low';
    return 'good';
  };

  const getStatusColor = (status) => {
    const colors = {
      critical: { bg: 'bg-red-100', bar: 'bg-red-500', text: 'text-red-700' },
      low: { bg: 'bg-yellow-100', bar: 'bg-yellow-500', text: 'text-yellow-700' },
      good: { bg: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-700' }
    };
    return colors[status];
  };

  const Sparkline = ({ trend, change }) => {
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 40;
      const y = 12 - (value / 100) * 12;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="40" height="12" className="inline-block ml-2">
        <polyline
          points={points}
          fill="none"
          stroke={change >= 0 ? '#16a34a' : '#dc2626'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const total = product.inStock + product.sold;
  const stockPercentage = (product.inStock / total) * 100;
  const status = getStockStatus(product.inStock, product.sold);
  const colors = getStatusColor(status);

  return (
    <>
      <div className="px-2 border-t border-gray-200">
        <div className="flex justify-between items-baseline">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${product.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.change >= 0 ? '+' : ''}{product.change.toFixed(1)}%
            </span>
            <span className={`text-xs ${product.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.change >= 0 ? '▲' : '▼'}
            </span>
            {product.trend && <Sparkline trend={product.trend} change={product.change} />}
            <span className="text-xs text-gray-500 ml-1">{product.period || '7d'}</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
              <span>{product.sold} sold</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${colors.bar}`}></div>
              <span>{product.inStock} stock</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{total} total</span>
          </div>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-200 overflow-hidden relative border-y border-gray-200">
        <div 
          className={`absolute left-0 h-full ${colors.bar} transition-all duration-500`}
          style={{ width: `100%` }}
        />
        <div 
          className="absolute left-0 h-full bg-orange-500 transition-all duration-500 rounded-r-full"
          style={{ width: `${100 - stockPercentage}%` }}
        />
      </div>
    </>
  );
}