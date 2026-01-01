// src/components/product/GalleryThumbnails.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GalleryThumbnailsProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
}

const GalleryThumbnails: React.FC<GalleryThumbnailsProps> = ({
  images,
  currentIndex,
  onThumbnailClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Observe container width for responsive behavior
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateWidth = () => {
      if (container) {
        const width = container.clientWidth;
        setContainerWidth(width);
        if (!isInitialized && width > 0) {
          setIsInitialized(true);
        }
      }
    };

    // Initial width
    updateWidth();

    // Create ResizeObserver to track width changes
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isInitialized]);

  // Calculate thumbnail width based on container width
  const getThumbnailWidth = useCallback(() => {
    if (!containerWidth || containerWidth < 300) return '80px'; // Default fallback for small screens
    
    // Show approximately 5.5 thumbnails in view
    const thumbnailCount = 5.5;
    const gap = 6; // 1.5rem gap = 6px
    
    // Calculate available width after accounting for gaps
    const totalGapWidth = gap * (Math.ceil(thumbnailCount) - 1);
    const availableWidth = containerWidth - totalGapWidth;
    
    // Calculate width for each thumbnail
    const thumbnailWidth = availableWidth / thumbnailCount;
    
    return `${Math.max(70, thumbnailWidth)}px`; // Minimum 70px
  }, [containerWidth]);

  // Snap to selected thumbnail
  const snapToThumbnail = useCallback((index: number) => {
    if (!scrollContainerRef.current || !thumbnailRefs.current[index] || isScrolling) {
      return;
    }

    const container = scrollContainerRef.current;
    const selectedThumbnail = thumbnailRefs.current[index];
    
    if (!selectedThumbnail) return;

    setIsScrolling(true);

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = selectedThumbnail.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;
      
      // Calculate scroll position to center the selected thumbnail
      const thumbnailLeft = thumbnailRect.left - containerRect.left + containerScrollLeft;
      const thumbnailCenter = thumbnailLeft - (containerRect.width - thumbnailRect.width) / 2;
      
      // Calculate max scroll
      const maxScroll = container.scrollWidth - container.clientWidth;
      let targetScroll = Math.max(0, Math.min(thumbnailCenter, maxScroll));
      
      // Adjust for first and last thumbnails
      if (index === 0) {
        targetScroll = 0;
      } else if (index === images.length - 1) {
        targetScroll = maxScroll;
      }
      
      // Only scroll if necessary (more than 10px difference)
      if (Math.abs(container.scrollLeft - targetScroll) > 10) {
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }

      // Reset scrolling flag after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    });
  }, [images.length, isScrolling]);

  // Snap when currentIndex changes
  useEffect(() => {
    if (isInitialized && images.length > 0) {
      snapToThumbnail(currentIndex);
    }
  }, [currentIndex, isInitialized, images.length, snapToThumbnail]);

  // Initialize refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images.length]);

  // Handle thumbnail click with immediate scroll
  const handleThumbnailClick = useCallback((index: number) => {
    onThumbnailClick(index);
    snapToThumbnail(index);
  }, [onThumbnailClick, snapToThumbnail]);

  // Handle manual scroll end to update snapping if needed
  const handleScroll = useCallback(() => {
    if (isScrolling) return;
    
    // Optional: You can add logic here to snap to nearest thumbnail on scroll end
  }, [isScrolling]);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollPadding: '0 16px',
        }}
        onScroll={handleScroll}
      >
        <div className="flex gap-3 flex-nowrap">
          {images.map((src, index) => (
            <div
              key={index}
              ref={el => {
                thumbnailRefs.current[index] = el;
              }}
              className="flex-shrink-0 transition-all duration-200"
              style={{ 
                width: getThumbnailWidth(),
              }}
              data-index={index}
            >
              <button
                className={`relative overflow-hidden border aspect-square w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  currentIndex === index 
                    ? "border-2 border-primary shadow-md" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={currentIndex === index ? "true" : "false"}
              >
                <img 
                  src={src} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/300x300?text=No+Image";
                  }}
                />
                
                {/* Selected indicator overlay */}
                {currentIndex === index && (
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none rounded-lg" />
                )}
                
                {/* Index indicator for selected thumbnail */}
                {currentIndex === index && (
                  <div className="absolute top-1 right-1 bg-primary text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicators - only show when there's more content to scroll */}
      {isInitialized && containerWidth > 0 && (
        <>
          {/* Left scroll indicator */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent pointer-events-none transition-opacity duration-300 ${
              scrollContainerRef.current?.scrollLeft > 20 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-2 h-2 border-t-2 border-r-2 border-gray-500 transform -rotate-135" />
          </div>
          
          {/* Right scroll indicator */}
          <div 
            className={`absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent pointer-events-none transition-opacity duration-300 ${
              scrollContainerRef.current && 
              scrollContainerRef.current.scrollWidth - scrollContainerRef.current.scrollLeft - scrollContainerRef.current.clientWidth > 20 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
          >
            <div className="w-2 h-2 border-t-2 border-r-2 border-gray-500 transform rotate-45" />
          </div>
        </>
      )}

      {/* Progress indicator */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-1 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 focus:outline-none ${
                currentIndex === index 
                  ? "bg-primary w-4" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Smooth scrolling */
        .scrollbar-hide {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Ensure buttons are properly styled */
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default GalleryThumbnails;