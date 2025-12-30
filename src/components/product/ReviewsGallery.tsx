import { Star, GalleryVertical } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';

interface ReviewsGalleryProps {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }> | string;
  viewAllLink?: string;
  viewAllText?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showClearButton?: boolean;
  clearButtonText?: string;
  onClearClick?: () => void;
  showCountdown?: boolean;
  countdown?: string;
  showCustomButton?: boolean;
  customButtonText?: string;
  customButtonIcon?: React.ComponentType<{ className?: string }> | string;
  onCustomButtonClick?: () => void;
  paddingBottom?: boolean;
}

export default function ReviewsGallery({
  title = "Reviews Gallery",
  subtitle,
  icon = GalleryVertical,
  viewAllLink,
  viewAllText = "View All",
  titleTransform = "uppercase",
  titleSize = "xs",
  showClearButton = false,
  clearButtonText = "× Clear",
  onClearClick,
  showCountdown = false,
  countdown,
  showCustomButton = false,
  customButtonText,
  customButtonIcon,
  onCustomButtonClick,
  paddingBottom = false,
}: ReviewGalleryProps) {
  const reviews = [
    { id: 1, rating: 5.0 },
    { id: 2, rating: 5.0 },
    { id: 3, rating: 5.0 },
    { id: 4, rating: 5.0 },
    { id: 5, rating: 5.0 },
    { id: 6, rating: 5.0 },
  ];

  // Ensure the viewAllLink button shows by explicitly disabling other features
  const shouldShowViewAll = viewAllLink && !showCountdown && !showCustomButton;

  return (
    <div className="w-full bg-white">
      {/* Section Header */}
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        viewAllLink={shouldShowViewAll ? viewAllLink : undefined}
        viewAllText={viewAllText}
        titleTransform={titleTransform}
        titleSize={titleSize}
        showClearButton={showClearButton}
        clearButtonText={clearButtonText}
        onClearClick={onClearClick}
        showCountdown={showCountdown}
        countdown={countdown}
        showCustomButton={showCustomButton}
        customButtonText={customButtonText}
        customButtonIcon={customButtonIcon}
        onCustomButtonClick={onCustomButtonClick}
        paddingBottom={paddingBottom}
        showStackedProfiles={false}
        showVerifiedSellers={false}
      />

      {/* Reviews Gallery */}
      <div 
        className="overflow-x-auto overflow-y-hidden"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="inline-flex gap-2 py-2" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative flex-shrink-0 overflow-hidden cursor-pointer"
              style={{ width: '100px', height: '125px' }}
            >
              {/* Placeholder gradient */}
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400" />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Rating */}
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold" style={{ fontSize: '10px' }}>
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}