import React from 'react';
import { Package, Star, Box, Info, LucideIcon } from 'lucide-react';

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

const mockProductStats: InventoryItem[] = [
  { value: '847', label: 'Total Products', color: 'text-blue-600' },
  { value: '47', label: 'Out of Stock', color: 'text-red-600' },
  { value: '89', label: 'Low Stock', color: 'text-yellow-600' },
  { value: '28', label: 'Categories', color: 'text-purple-600' },
  { value: '812', label: 'Active', color: 'text-green-600' },
  { value: '12', label: 'Preorder', color: 'text-indigo-600' }
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
  subtitleIcon?: React.ComponentType<{ className?: string }>; // New prop for custom icon
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
  subtitle,
  subtitleIcon, // Custom icon prop
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
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [scrollableWidth, setScrollableWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const inventoryScrollRef = React.useRef<HTMLDivElement>(null);
  const productsScrollRef = React.useRef<HTMLDivElement>(null);

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

  const getSubtitleIcon = () => {
    // Use custom icon if provided
    if (subtitleIcon) {
      const CustomIcon = subtitleIcon;
      return <CustomIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
    
    // Fall back to mode-based icons
    switch (mode) {
      case 'inventory':
        return <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />;
      case 'reviews':
        return <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />;
      case 'products':
        return <Box className="w-4 h-4 text-gray-500 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  const getDefaultSubtitle = () => {
    switch (mode) {
      case 'inventory':
        return "Manage your stock levels and product availability";
      case 'reviews':
        return "Ratings and reviews are verified and are from people who use the same type of device that you use";
      case 'products':
        return "Manage your products and inventory levels";
      default:
        return "Overview of your store performance";
    }
  };

  const getStatsForMode = () => {
    switch (mode) {
      case 'inventory':
        return stats;
      case 'products':
        return mockProductStats;
      default:
        return stats;
    }
  };

  const getScrollRefForMode = () => {
    switch (mode) {
      case 'inventory':
        return inventoryScrollRef;
      case 'products':
        return productsScrollRef;
      default:
        return { current: null };
    }
  };

  const currentSubtitle = subtitle || getDefaultSubtitle();
  const currentStats = getStatsForMode();
  const currentScrollRef = getScrollRefForMode();

  // Calculate scroll indicators
  React.useEffect(() => {
    const updateScrollInfo = () => {
      if (currentScrollRef.current) {
        const container = currentScrollRef.current;
        setScrollPosition(container.scrollLeft);
        setScrollableWidth(container.scrollWidth - container.clientWidth);
        setContainerWidth(container.clientWidth);
      }
    };

    const container = currentScrollRef.current;
    if (container) {
      updateScrollInfo();
      container.addEventListener('scroll', updateScrollInfo);
      window.addEventListener('resize', updateScrollInfo);

      return () => {
        container.removeEventListener('scroll', updateScrollInfo);
        window.removeEventListener('resize', updateScrollInfo);
      };
    }
  }, [currentStats.length, mode]);

  // Calculate dynamic dots
  const cardWidth = 90 + 8; // min-w-[90px] + gap-2
  const visibleCards = Math.floor(containerWidth / cardWidth);
  const totalCards = currentStats.length;
  const hiddenCards = Math.max(0, totalCards - visibleCards);

  // Calculate active dot based on scroll position
  const scrollProgress = scrollableWidth > 0 ? scrollPosition / scrollableWidth : 0;
  const activeDotIndex = hiddenCards > 0 ? Math.floor(scrollProgress * hiddenCards) : 0;

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="px-2 py-3">
        {showStats && (
          <>
            {/* Subtitle with icon at the top */}
            {currentSubtitle && (
              <div className="flex items-start gap-2 mb-3">
                {getSubtitleIcon()}
                <p className="text-xs text-gray-500 flex-1 leading-relaxed">
                  {currentSubtitle}
                </p>
              </div>
            )}

            {mode === 'inventory' || mode === 'products' ? (
              <>
                {/* Inventory/Products stats - horizontal scroll */}
                {currentStats.length > 0 && (
                  <div className="relative">
                    <div 
                      ref={currentScrollRef}
                      className="overflow-x-auto -mx-4 px-4 scrollbar-hide scroll-smooth"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <div className="flex gap-2 min-w-max">
                        {currentStats.map((stat, index) => (
                          <div 
                            key={index} 
                            className="flex-shrink-0 bg-gray-50 rounded-lg px-3 py-2 min-w-[90px] transition-all duration-200 hover:bg-gray-100"
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

                    {/* Dynamic scroll indicator dots */}
                    {hiddenCards > 0 && (
                      <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: hiddenCards + 1 }).map((_, index) => (
                          <div 
                            key={index}
                            className={`transition-all duration-300 ease-out rounded-full ${
                              index === activeDotIndex 
                                ? 'bg-blue-500 w-1.5 h-1.5' 
                                : 'bg-gray-300 w-1.5 h-1.5'
                            }`}
                            style={{
                              opacity: index === activeDotIndex ? 1 : 0.5,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : mode === 'reviews' ? (
              <>
                {/* Reviews mode - original layout */}
                <div>
                  <div className="flex items-stretch gap-6">
                    {/* Rating number and stars */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl font-light text-gray-900 leading-none">
                        {reviewsSummary.averageRating.toFixed(1)}
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {renderStars(reviewsSummary.averageRating)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatNumber(reviewsSummary.totalReviews)} reviews
                      </div>
                    </div>

                    {/* Rating bars */}
                    <div className="flex-1 flex flex-col justify-center gap-1.5">
                      {reviewsSummary.distribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3">{dist.stars}</span>
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500 ease-out"
                              style={{ width: `${dist.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">
                            {dist.percentage}%
                          </span>
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SellerSummaryHeader;