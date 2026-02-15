import React, { useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import { 
  MessageCircle, 
  HelpCircle
} from 'lucide-react';
import FilterTabs, { FilterTab, ActiveFilter } from '@/components/FilterTabs';

// Custom SVG Icons with colors (defined in the parent component)
const ArrowUpDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 5L17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 14L12 19L17 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill="#F59E0B" 
      stroke="#F59E0B" 
      strokeWidth="1.5"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" fill="#8B5CF6" />
    <path d="M3 8H21" stroke="white" strokeWidth="2" />
    <path d="M8 2V6" stroke="#8B5CF6" strokeWidth="2" />
    <path d="M16 2V6" stroke="#8B5CF6" strokeWidth="2" />
    <circle cx="12" cy="15" r="2" fill="white" />
  </svg>
);

const VerifiedBadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
      fill="#3B82F6" // Blue fill
    />
    <path 
      d="M10 14.17L16.59 7.58C17.05 7.12 17.77 7.12 18.23 7.58C18.69 8.04 18.69 8.76 18.23 9.22L11.13 16.32C10.85 16.6 10.48 16.78 10.07 16.78C9.66 16.78 9.29 16.6 9.01 16.32L5.91 13.22C5.45 12.76 5.45 12.04 5.91 11.58C6.37 11.12 7.09 11.12 7.55 11.58L10 14.17Z" 
      fill="white" // White checkmark
    />
  </svg>
);

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface ReviewsSummaryData {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}

const mockReviewsSummary: ReviewsSummaryData = {
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

interface ReviewsSummaryProps {
  title?: string;
  subtitle?: string;
  reviewsSummary?: ReviewsSummaryData;
  className?: string;
  actionButton?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
  viewAllLink?: string;
  viewAllText?: string;
  showCountdown?: boolean;
  countdown?: string;
  showCustomButton?: boolean;
  customButtonText?: string;
  customButtonIcon?: React.ComponentType<{ className?: string }>;
  onCustomButtonClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  title = "REVIEWS/COMMENTS",
  subtitle = "Ratings and reviews are verified and are from people who use the same type of device that you use",
  reviewsSummary = mockReviewsSummary,
  className = '',
  actionButton,
  viewAllLink = '/reviews/all',
  viewAllText = "View All",
  showCountdown = false,
  countdown,
  showCustomButton = false,
  customButtonText = "Tout regarder",
  customButtonIcon,
  onCustomButtonClick,
  icon = MessageCircle,
}) => {
  // Filter tabs state with custom SVG icons
  const [filterTabs, setFilterTabs] = useState<FilterTab[]>([
  {
    id: 'sortBy',
    label: 'Sort by',
    type: 'dropdown',
    value: 'mostRelevant',
    icon: <ArrowUpDownIcon />, // Custom SVG
    options: [
      { label: 'Most Relevant', value: 'mostRelevant' },
      { label: 'Most Recent', value: 'mostRecent' },
      { label: 'Highest Rated', value: 'highestRated' },
      { label: 'Lowest Rated', value: 'lowestRated' },
    ]
  },
  {
    id: 'rating',
    label: 'Rating',
    type: 'dropdown',
    value: null,
    icon: <StarIcon />, // Custom SVG with amber fill
    options: [
      { label: '5 Stars', value: 5 },
      { label: '4 Stars', value: 4 },
      { label: '3 Stars', value: 3 },
      { label: '2 Stars', value: 2 },
      { label: '1 Star', value: 1 },
    ]
  },
  {
    id: 'timePeriod',
    label: 'Time Period',
    type: 'dropdown',
    value: null,
    icon: <CalendarIcon />, // Custom SVG with purple fill
    options: [
      { label: 'All Time', value: 'all' },
      { label: 'Last Week', value: 'week' },
      { label: 'Last Month', value: 'month' },
      { label: 'Last 3 Months', value: 'quarter' },
      { label: 'Last Year', value: 'year' },
    ]
  },
  {
    id: 'verifiedPurchase',
    label: 'Verified Purchase',
    type: 'checkbox',
    value: false,
    icon: <VerifiedBadgeIcon /> // Custom SVG with blue fill and white checkmark
  }
]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const handleTabChange = (tabId: string, value: any) => {
    setFilterTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, value } : tab
    ));

    // Update active filters
    if (value === null || value === false || value === '') {
      setActiveFilters(prev => prev.filter(filter => filter.id !== tabId));
    } else {
      const tab = filterTabs.find(t => t.id === tabId);
      if (tab) {
        let displayValue = '';

        if (tab.type === 'checkbox') {
          displayValue = 'Yes';
        } else if (tab.id === 'priceRange' && value && typeof value === 'object') {
          displayValue = `$${value.min} - $${value.max}`;
        } else if (tab.options) {
          const option = tab.options.find(opt => {
            if (tab.id === 'priceRange' && value && opt.value) {
              return opt.value.min === value.min && opt.value.max === value.max;
            }
            return opt.value === value;
          });
          displayValue = option ? option.label : String(value);
        } else {
          displayValue = String(value);
        }

        setActiveFilters(prev => {
          const newFilters = prev.filter(filter => filter.id !== tabId);
          newFilters.push({
            id: tabId,
            label: tab.label,
            value,
            displayValue
          });
          return newFilters;
        });
      }
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    handleTabChange(filterId, filterTabs.find(t => t.id === filterId)?.type === 'checkbox' ? false : null);
  };

  const handleClearAll = () => {
    setFilterTabs(prev => prev.map(tab => ({
      ...tab,
      value: tab.type === 'checkbox' ? false : null
    })));
    setActiveFilters([]);
  };

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
    <div className={`bg-white ${className}`}>
      {/* Section Header with uppercase title, icon, and view all button */}
      <SectionHeader
        title={title}
        icon={icon}
        viewAllLink={viewAllLink}
        viewAllText={viewAllText}
        titleTransform="uppercase"
        paddingBottom={false}
        showCountdown={showCountdown}
        countdown={countdown}
        showCustomButton={showCustomButton}
        customButtonText={customButtonText}
        customButtonIcon={customButtonIcon}
        onCustomButtonClick={onCustomButtonClick}
      />

      {/* Reviews summary content */}
      <div className="px-2 py-2">
        {/* Subtitle with help icon at the end of the line */}
        {subtitle && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 leading-relaxed">
              <span className="inline">
                {subtitle}
                <HelpCircle className="inline align-text-bottom ml-1 w-3.5 h-3.5 text-gray-400" />
              </span>
            </div>
          </div>
        )}

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
      </div>

      {/* Filter Tabs Section at the Bottom */}
      <div className="">
        <FilterTabs
          tabs={filterTabs}
          activeFilters={activeFilters}
          onTabChange={handleTabChange}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
};

export default ReviewsSummary;