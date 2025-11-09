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
  // Determine color based on variant and status
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
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
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

      {/* Center content */}
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

// Mock inventory data
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

// Mock reviews data
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

// Mock products data
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
  const getProgressLabel = () => {
    switch (progressVariant) {
      case 'stock-level': return 'Stock Level';
      case 'capacity': return 'Capacity Used';
      case 'turnover': return 'Turnover Rate';
      case 'category': return 'Category Fill';
      default: return 'Progress';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(<span key={i} className="text-blue-500 text-base sm:text-xl">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        // Half star using gradient
        stars.push(
          <span key={i} className="relative inline-block text-base sm:text-xl">
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
        // Empty star
        stars.push(<span key={i} className="text-gray-300 text-base sm:text-xl">★</span>);
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
      <div className="px-4 py-4">
        {/* Title and Action Button - Mobile Optimized */}
        {(title || actionButton) && (
          <div className="flex items-center justify-between mb-3">
            {title && (
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              </div>
            )}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="ml-3 h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                aria-label={actionButton.label}
              >
                {actionButton.icon && <actionButton.icon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            )}
          </div>
        )}

        {showStats && (
          <>
            {mode === 'inventory' ? (
              <>
                {/* Inventory mode - subtitle */}
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  {subtitle}
                </p>

                {/* Inventory stats section - Horizontal scroll on mobile */}
                {stats.length > 0 && (
                  <div className="overflow-x-auto -mx-4 px-4 pb-2">
                    <div className="flex gap-3 min-w-max sm:grid sm:grid-cols-4 sm:min-w-0">
                      {stats.map((stat, index) => (
                        <div 
                          key={index} 
                          className="flex-shrink-0 text-center bg-gray-50 rounded-lg px-4 py-3 min-w-[100px] sm:min-w-0 sm:bg-transparent sm:p-0"
                        >
                          <div className={`text-xl sm:text-2xl font-bold ${stat.color || 'text-blue-600'}`}>
                            {stat.value}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 whitespace-nowrap">
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
                {/* Reviews mode - Mobile Optimized */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Ratings and reviews are verified and are from people who use the same type of device that you use
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
                    {/* Rating number and stars - Stacked on mobile */}
                    <div className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-4 sm:gap-0 pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r sm:pr-6 border-gray-200">
                      <div>
                        <div className="text-4xl sm:text-6xl font-light text-gray-900 leading-none">
                          {reviewsSummary.averageRating.toFixed(1)}
                        </div>
                        <div className="flex gap-0.5 mt-1 justify-center">
                          {renderStars(reviewsSummary.averageRating)}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 sm:mt-2">
                        {formatNumber(reviewsSummary.totalReviews)} reviews
                      </div>
                    </div>

                    {/* Rating bars - Full width on mobile */}
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      {reviewsSummary.distribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-gray-500 w-3">{dist.stars}</span>
                          <div className="flex-1 h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${dist.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-10 text-right sm:hidden">
                            {dist.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : mode === 'products' ? (
              <>
                {/* Products mode - Mobile Optimized */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Manage your product catalog and monitor performance across all categories
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
                    {/* Total products - large display - Horizontal layout on mobile */}
                    <div className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-4 sm:gap-0 pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r sm:pr-6 border-gray-200">
                      <div>
                        <div className="text-4xl sm:text-6xl font-light text-gray-900 leading-none">
                          {productsSummary.totalProducts}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 whitespace-nowrap">
                          Total Products
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-green-50 rounded-full">
                        <span className="text-xs sm:text-sm font-semibold text-green-700 whitespace-nowrap">
                          {productsSummary.activeProducts} Active
                        </span>
                      </div>
                    </div>

                    {/* Product metrics grid - 2 columns on all screens */}
                    <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
                      {productsSummary.metrics.map((metric, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]"
                        >
                          <div className="flex-1 min-w-0">
                            <div className={`text-lg sm:text-xl font-bold ${metric.color} leading-none`}>
                              {metric.value}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 leading-tight mt-1">
                              {metric.label}
                            </div>
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
        /* Hide scrollbar for horizontal scroll on mobile */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SellerSummaryHeader;