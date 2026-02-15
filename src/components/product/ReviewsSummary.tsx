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
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 128 128" 
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-full"
  >
    <path d="M53 9c2.309 1.383 2.309 1.383 4.625 3.063 3.385 2.491 3.385 2.491 7.5 3.124 2.574-1.063 4.098-2.063 6.25-3.75 2.613-1.983 4.454-2.87 7.75-3.062C83 9 83 9 85.75 10.813 88.855 15.21 90.398 19.89 92 25l2.633.113c11.734.67 11.734.67 16.367 3.887 2.165 4.331 1.395 9.793-.062 14.25L110 46c-.319 2.576-.319 2.576 1 5 1.915 1.646 3.89 3.073 5.992 4.473 3.135 2.385 4.795 4.461 5.57 8.34-.912 5.173-4.204 8.376-8.296 11.519-1.391.937-2.825 1.81-4.266 2.668l.438 1.617C111.87 85.366 112.883 91.082 112 97c-2.191 3.098-3.41 3.804-7 5-2.226.225-4.456.408-6.687.563l-3.575.253L92 103l-.953 2.738-1.297 3.575-1.266 3.55C86.967 116.07 86.076 117.331 83 119c-6.747 1.03-9.514-.801-14.898-4.715-2.154-1.552-2.154-1.552-5.352-1.41-3.109 1.272-5.219 2.936-7.75 5.125-3.638 1.213-6.177 1.395-10 1-5.617-3.788-7.06-9.813-9-16l-2.633-.113c-11.734-.67-11.734-.67-16.367-3.887-2.165-4.331-1.395-9.793.063-14.25L18 82c.319-2.576.319-2.576-1-5-1.915-1.646-3.89-3.073-5.992-4.473-3.135-2.385-4.795-4.461-5.57-8.34.912-5.173 4.204-8.376 8.296-11.519C15.125 51.731 16.56 50.858 18 50l-.437-1.617C16.13 42.634 15.117 36.918 16 31c2.191-3.098 3.41-3.804 7-5 2.226-.225 4.456-.408 6.688-.562l3.574-.254L36 25l.953-2.738 1.297-3.575 1.266-3.55C42.313 9.225 46.63 7.539 53 9" fill="#49ADF4"/>
    <path d="M80.969 55.168 83 56l1 5a5562 5562 0 0 1-8.625 6.75l-2.45 1.922A673 673 0 0 1 66 75l-1.784 1.38c-3.675 2.688-3.675 2.688-6.192 2.372-3.443-1.28-5.782-3.957-8.336-6.502l-1.706-1.594C46.387 69.078 46.387 69.078 44 66c.145-2.89.145-2.89 1-5 2.23-.746 2.23-.746 5-1 2.238 1.652 2.238 1.652 4.313 3.938l2.113 2.277L58 68c5.678-1.802 9.9-5.595 14.473-9.275 4.892-3.76 4.892-3.76 8.496-3.557" fill="#F9FCFE"/>
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
    icon: <ArrowUpDownIcon />,
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
    icon: <StarIcon />,
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
    icon: <CalendarIcon />,
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
    icon: <VerifiedBadgeIcon />
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