import React from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import { MessageCircle, HelpCircle } from 'lucide-react';

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
        {/* Subtitle with help icon at the end */}
        {subtitle && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 leading-relaxed inline-flex items-baseline flex-wrap">
              <span className="inline">{subtitle}</span>
              <HelpCircle className="inline align-baseline ml-1 w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </p>
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
    </div>
  );
};

export default ReviewsSummary;