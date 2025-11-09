import React from 'react';

interface InventoryItem {
  value: string | number;
  label: string;
  color?: string;
  status?: 'low' | 'medium' | 'high' | 'out-of-stock';
}

interface CircularInventoryProgressProps {
  percentage: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  variant?: 'stock-level' | 'category' | 'turnover' | 'capacity';
  label?: string;
  status?: 'low' | 'medium' | 'high' | 'out-of-stock';
}

const CircularInventoryProgress: React.FC<CircularInventoryProgressProps> = ({
  percentage,
  color,
  size = 70,
  strokeWidth = 8,
  variant = 'stock-level',
  label = 'Stock Level',
  status = 'medium'
}) => {
  const getProgressColor = () => {
    if (color) return color;

    switch (variant) {
      case 'stock-level':
        switch (status) {
          case 'low': return '#ef4444';
          case 'medium': return '#eab308';
          case 'high': return '#22c55e';
          case 'out-of-stock': return '#6b7280';
          default: return '#3b82f6';
        }
      case 'capacity':
        return percentage > 90 ? '#ef4444' : percentage > 70 ? '#eab308' : '#22c55e';
      case 'turnover':
        return '#8b5cf6';
      case 'category':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const progressColor = getProgressColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusIcon = () => {
    if (variant !== 'stock-level') return null;

    switch (status) {
      case 'low': return '⚠️';
      case 'out-of-stock': return '❌';
      case 'high': return '✅';
      default: return null;
    }
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {getStatusIcon() && (
          <span className="text-xs mb-1">{getStatusIcon()}</span>
        )}
        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const mockInventoryStats: InventoryItem[] = [
  { value: '1,248', label: 'Total Items', color: 'text-blue-600' },
  { value: '47', label: 'Low Stock', color: 'text-red-600', status: 'low' },
  { value: '92%', label: 'Availability', color: 'text-green-600' },
  { value: '28', label: 'Categories', color: 'text-purple-600' }
];

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}

const mockReviewsSummary: ReviewsSummary = {
  averageRating: 4.6,
  totalReviews: 1459914,
  distribution: [
    { stars: 5, count: 1100000, percentage: 75 },
    { stars: 4, count: 200000, percentage: 14 },
    { stars: 3, count: 80000, percentage: 5 },
    { stars: 2, count: 40000, percentage: 3 },
    { stars: 1, count: 39914, percentage: 3 }
  ]
};

interface ProductMetric {
  value: string | number;
  label: string;
  color: string;
  icon?: string;
}

interface ProductsSummary {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  averagePrice: string;
  metrics: ProductMetric[];
}

const mockProductsSummary: ProductsSummary = {
  totalProducts: 847,
  activeProducts: 812,
  categories: 28,
  averagePrice: '$45.99',
  metrics: [
    { value: '47', label: 'Out of Stock', color: 'text-red-600' },
    { value: '28', label: 'Categories', color: 'text-purple-600' },
    { value: '89', label: 'Low Stock', color: 'text-yellow-600' },
    { value: '12', label: 'Preorder', color: 'text-blue-600' }
  ]
};

interface SellerSummaryHeaderProps {
  title?: string;
  subtitle?: string;
  stats?: InventoryItem[];
  progressPercentage?: number;
  progressVariant?: 'stock-level' | 'category' | 'turnover' | 'capacity';
  progressStatus?: 'low' | 'medium' | 'high' | 'out-of-stock';
  mode?: 'inventory' | 'reviews' | 'products';
  reviewsSummary?: ReviewsSummary;
  productsSummary?: ProductsSummary;
  className?: string;
  actionButton?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
  showStats?: boolean;
}

const SellerSummaryHeader: React.FC<SellerSummaryHeaderProps> = ({
  title = "Inventory Overview",
  subtitle = "Manage your stock levels and product availability",
  stats = mockInventoryStats,
  progressPercentage = 65,
  progressVariant = 'stock-level',
  progressStatus = 'medium',
  mode = 'inventory',
  reviewsSummary = mockReviewsSummary,
  productsSummary = mockProductsSummary,
  className = '',
  actionButton,
  showStats = true
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-blue-500 text-xl">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="relative inline-block text-xl">
            <span className="text-gray-300">★</span>
            <span 
              className="absolute top-0 left-0 text-blue-500 overflow-hidden"
              style={{ width: '50%' }}
            >
              ★
            </span>
          </span>
        );
      } else {
        stars.push(<span key={i} className="text-gray-300 text-xl">★</span>);
      }
    }
    return stars;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="px-4 py-3">
        {/* Title and Action Button - Compact */}
        {(title || actionButton) && (
          <div className="flex items-center justify-between mb-2">
            {title && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{title}</h1>
              </div>
            )}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="ml-3 h-10 w-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                aria-label={actionButton.label}
              >
                {actionButton.icon && <actionButton.icon className="w-5 h-5" />}
              </button>
            )}
          </div>
        )}

        {showStats && (
          <>
            {mode === 'inventory' ? (
              <>
                {/* Inventory mode - compact subtitle */}
                {subtitle && (
                  <p className="text-xs text-gray-500 mb-2">
                    {subtitle}
                  </p>
                )}

                {/* Inventory stats - horizontal scroll */}
                {stats.length > 0 && (
                  <div className="overflow-x-auto -mx-4 px-4">
                    <div className="flex gap-2 min-w-max">
                      {stats.map((stat, index) => (
                        <div 
                          key={index} 
                          className="flex-shrink-0 bg-gray-50 rounded-lg px-3 py-2 min-w-[90px]"
                        >
                          <div className={`text-lg font-bold ${stat.color || 'text-blue-600'} leading-none`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : mode === 'reviews' ? (
              <>
                {/* Reviews mode - original layout */}
                <div>
                  <p className="text-xs text-gray-500 mb-3">
                    Ratings and reviews are verified and are from people who use the same type of device that you use
                  </p>

                  <div className="flex items-stretch gap-6">
                    {/* Rating number and stars */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl font-light text-gray-900 leading-none">
                        {reviewsSummary.averageRating.toFixed(1)}
                      </div>
                      <div className="flex gap-0.5">
                        {renderStars(reviewsSummary.averageRating)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(reviewsSummary.totalReviews)} reviews
                      </div>
                    </div>

                    {/* Rating bars */}
                    <div className="flex-1 flex flex-col justify-center gap-1">
                      {reviewsSummary.distribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3">{dist.stars}</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${dist.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : mode === 'products' ? (
              <>
                {/* Products mode - compact */}
                <div>
                  {subtitle && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {subtitle}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Total products - compact */}
                    <div className="flex-shrink-0 flex items-center gap-3 pr-4 border-r border-gray-200">
                      <div className="text-center">
                        <div className="text-3xl font-light text-gray-900 leading-none">
                          {productsSummary.totalProducts}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Total
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-50 rounded-full">
                        <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                          {productsSummary.activeProducts} Active
                        </span>
                      </div>
                    </div>

                    {/* Product metrics - compact 2x2 grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {productsSummary.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg px-2 py-1.5">
                          <div className={`text-sm font-bold ${metric.color} leading-none`}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-gray-500 leading-tight mt-0.5">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>

      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SellerSummaryHeader;