import React, { useState } from 'react';
import { Star, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import SearchInfoHeader from '@/components/shared/SearchInfoHeader';

const ReviewGallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const reviews = [
    {
      id: 1,
      rating: 5.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=356&fit=crop&crop=face",
      alt: "Happy customer review video"
    },
    {
      id: 2,
      rating: 4.0,
      type: 'image',
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=711&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=356&fit=crop",
      alt: "Product in use"
    },
    {
      id: 3,
      rating: 3.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=711&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=356&fit=crop",
      alt: "Product demonstration video"
    },
    {
      id: 4,
      rating: 4.5,
      type: 'image',
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=200&h=356&fit=crop&crop=face",
      alt: "Satisfied customer"
    },
    {
      id: 5,
      rating: 5.0,
      type: 'video',
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=356&fit=crop&crop=face",
      alt: "Customer testimonial video"
    },
    {
      id: 6,
      rating: 4.0,
      type: 'image',
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=356&fit=crop&crop=face",
      alt: "Review photo"
    },
    {
      id: 7,
      rating: 3.5,
      type: 'video',
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=356&fit=crop&crop=face",
      alt: "Customer experience video"
    },
    {
      id: 8,
      rating: 5.0,
      type: 'image',
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=356&fit=crop&crop=face",
      alt: "Product review"
    },
    {
      id: 9,
      rating: 4.5,
      type: 'video',
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=711&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=356&fit=crop&crop=face",
      alt: "User feedback video"
    }
  ];

  const openImageViewer = (index) => {
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

  const handleKeyDown = (e) => {
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
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  return (
    <>
      <div className="w-full bg-white">
        {/* Header */}
        <SearchInfoHeader 
          title="Review Gallery"
          className="mb-4"
        />

        {/* Ultra Clean Flat Gallery - 3 per view */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-2">
              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="flex-none relative cursor-pointer"
                  style={{
                    width: '100px',
                    height: '178px', // 9:16 aspect ratio (100 * 16 / 9 ≈ 178)
                  }}
                  onClick={() => openImageViewer(index)}
                >
                  <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={review.thumbnail}
                      alt={review.alt}
                      className="w-full h-full object-cover"
                    />

                    {/* Play icon for videos in thumbnail strip */}
                    {review.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-1">
                          <Play className="w-2 h-2 text-gray-900 fill-current ml-px" />
                        </div>
                      </div>
                    )}

                    {/* Play icon for videos - centered */}
                    {review.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-2">
                          <Play className="w-4 h-4 text-gray-900 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Rating overlay - minimal flat design */}
                    <div className="absolute top-2 right-2 flex items-center bg-white rounded px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-current mr-1" />
                      <span className="text-gray-900 text-xs font-medium">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal scroll indicator */}
        <div className="flex justify-center mt-3">
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === 0 ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
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

          {/* Main Image - Clean minimal display */}
          <div className="max-w-xs max-h-[85vh] mx-auto px-16">
            <img
              src={reviews[selectedImageIndex].image}
              alt={reviews[selectedImageIndex].alt}
              className="w-full h-full object-contain rounded"
            />

            {/* Minimal image info */}
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

          {/* Clean thumbnail strip */}
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
                      height: '43px', // 9:16 aspect ratio for thumbnails
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