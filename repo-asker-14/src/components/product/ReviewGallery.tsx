import React, { useRef, useState } from 'react';
import { Star, Play, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/components/home/SectionHeader';

interface ReviewGalleryProps {
  title?: string;
  viewAllLink?: string;
  viewAllText?: string;
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
  viewMoreText?: string;
  customClass?: string;
}

interface Review {
  id: string;
  rating: number;
  type: 'video' | 'image';
  image: string;
  thumbnail: string;
  alt: string;
  views?: number;
  duration?: number;
}

const ReviewGallery: React.FC<ReviewGalleryProps> = ({
  title = "Review Gallery",
  viewAllLink = "/reviews",
  viewAllText = "View All",
  showViewMore = true,
  onViewMoreClick = () => console.log('View More clicked!'),
  viewMoreText = "View More",
  customClass = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const reviews: Review[] = [
    {
      id: '1',
      rating: 5.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=356&fit=crop&crop=face",
      alt: "Happy customer review video",
      views: 125000,
      duration: 45
    },
    {
      id: '2',
      rating: 4.0,
      type: 'image',
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=711&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=356&fit=crop",
      alt: "Product in use",
      views: 89000
    },
    {
      id: '3',
      rating: 3.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=711&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=356&fit=crop",
      alt: "Product demonstration video",
      views: 156000,
      duration: 62
    },
    {
      id: '4',
      rating: 4.5,
      type: 'image',
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=200&h=356&fit=crop&crop=face",
      alt: "Satisfied customer",
      views: 72000
    },
    {
      id: '5',
      rating: 5.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=356&fit=crop&crop=face",
      alt: "Customer testimonial video",
      views: 203000,
      duration: 38
    },
    {
      id: '6',
      rating: 4.0,
      type: 'image',
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=356&fit=crop&crop=face",
      alt: "Review photo",
      views: 54000
    }
  ];

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleReviewClick = (reviewId: string, index: number) => {
    const review = reviews[index];
    if (review.type === 'video') {
      navigate(`/reviews?video=${reviewId}`);
    } else {
      openImageViewer(index);
    }
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : reviews.length - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null && prevIndex < reviews.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  return (
    <>
      <div className={`w-full overflow-hidden space-y-2 ${customClass}`}>
        <SectionHeader
          title={title}
          icon={Star}
          viewAllLink={viewAllLink}
          viewAllText={viewAllText}
          showCustomButton={showViewMore}
          customButtonText={viewMoreText}
          customButtonIcon={Play}
          onCustomButtonClick={onViewMoreClick}
          titleTransform="uppercase"
          
        />

        {/* Edge-to-edge container for scrolling with same layout as MobileOptimizedReels */}
        <div 
          ref={scrollContainerRef}
          className="reels-container flex overflow-x-auto pl-2 scrollbar-none w-full"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-black relative mr-[3vw] cursor-pointer"
              style={{ 
                width: '35vw', 
                maxWidth: '160px',
                scrollSnapAlign: 'start'
              }}
              onClick={() => handleReviewClick(review.id, index)}
            >
              {/* Review image/video preview */}
              <div className="relative bg-gray-200" style={{ height: '49vw', maxHeight: '220px' }}>
                <img
                  src={review.thumbnail}
                  alt={review.alt}
                  className="w-full h-full object-cover"
                />

                {/* Duration indicator for videos */}
                {review.type === 'video' && review.duration && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(review.duration)}
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300 text-xs gap-1">
                      {/* Conditional icon based on review type */}
                      {review.type === 'video' ? (
                        <Play className="w-3 h-3" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                      <span>{formatViews(review.views || 0)}</span>
                    </div>

                    {/* Rating moved to bottom right */}
                    <div className="flex items-center text-white text-xs rounded">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add right spacing for proper scrolling to the end */}
          <div className="flex-shrink-0 w-2"></div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeImageViewer}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Main Image */}
          <div className="max-w-xs max-h-[85vh] mx-auto px-16">
            <img
              src={reviews[selectedImageIndex].image}
              alt={reviews[selectedImageIndex].alt}
              className="w-full h-full object-contain rounded"
            />

            {/* Image info */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded px-3 py-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1.5" />
              <span className="text-gray-900 font-medium mr-3">
                {reviews[selectedImageIndex].rating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                {selectedImageIndex + 1} of {reviews.length}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 px-4 justify-center">
                {reviews.map((review, index) => (
                  <button
                    key={review.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 rounded overflow-hidden ${
                      index === selectedImageIndex
                        ? 'ring-2 ring-white opacity-100'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{
                      width: '24px',
                      height: '43px',
                    }}
                  >
                    <img
                      src={review.thumbnail}
                      alt={review.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewGallery;