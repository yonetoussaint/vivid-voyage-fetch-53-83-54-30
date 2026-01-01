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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

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

  // Calculate thumbnail width - fixed value for consistent snapping
  const getThumbnailWidth = useCallback(() => {
    // Fixed width for consistent snapping behavior
    // This should match the CSS width in the container
    return '90px';
  }, []);

  // Snap selected thumbnail to LEFT SIDE
  const snapToThumbnail = useCallback((index: number, immediate = false) => {
    if (!scrollContainerRef.current || !thumbnailRefs.current[index]) {
      return;
    }

    const container = scrollContainerRef.current;
    const selectedThumbnail = thumbnailRefs.current[index];
    
    if (!selectedThumbnail) return;

    // Clear any pending timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = selectedThumbnail.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;
      
      // Calculate the position of the thumbnail relative to container
      const thumbnailLeftRelative = thumbnailRect.left - containerRect.left + containerScrollLeft;
      
      // For left-side snapping, we want the thumbnail's left edge aligned with container's left edge
      // But we'll add a small offset (16px) for visual padding
      const padding = 16;
      let targetScroll = thumbnailLeftRelative - padding;
      
      // Calculate max scroll
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      // Clamp the target scroll within bounds
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      // Adjust for edge cases
      if (index === 0) {
        // First thumbnail: align to start
        targetScroll = 0;
      } else if (index === images.length - 1 && targetScroll < maxScroll - 50) {
        // Last thumbnail: ensure it's fully visible on the right if possible
        targetScroll = Math.min(targetScroll, maxScroll);
      }
      
      // Only scroll if we're not already close to the target
      const currentScroll = container.scrollLeft;
      const scrollDiff = Math.abs(currentScroll - targetScroll);
      
      if (scrollDiff > 5) { // Only scroll if difference is more than 5px
        container.scrollTo({
          left: targetScroll,
          behavior: immediate ? 'auto' : 'smooth'
        });
      }

      // Reset any active states
      scrollTimeoutRef.current = setTimeout(() => {
        // Optional: Add any cleanup logic here
      }, 300);
    });
  }, [images.length]);

  // Snap when currentIndex changes
  useEffect(() => {
    if (isInitialized && images.length > 0) {
      // Use immediate snap on first load, smooth for subsequent changes
      const isInitialLoad = currentIndex === 0;
      snapToThumbnail(currentIndex, isInitialLoad);
    }
  }, [currentIndex, isInitialized, images.length, snapToThumbnail]);

  // Initialize refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images.length]);

  // Handle thumbnail click
  const handleThumbnailClick = useCallback((index: number) => {
    // Update the active index first
    onThumbnailClick(index);
    
    // Then snap to position
    setTimeout(() => {
      snapToThumbnail(index, false);
    }, 10);
  }, [onThumbnailClick, snapToThumbnail]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-3 px-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollPadding: '0 16px',
        }}
      >
        <div className="flex gap-3 flex-nowrap items-center">
          {images.map((src, index) => (
            <div
              key={index}
              ref={el => {
                thumbnailRefs.current[index] = el;
              }}
              className="flex-shrink-0 transition-all duration-150"
              style={{ 
                width: getThumbnailWidth(),
                scrollSnapAlign: 'start',
              }}
              data-index={index}
            >
              <button
                className={`relative overflow-hidden border aspect-square w-full rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                  currentIndex === index 
                    ? "border-2 border-primary shadow-sm scale-[1.02]" 
                    : "border-gray-200 hover:border-gray-300"
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
                
                {/* Selected indicator */}
                {currentIndex === index && (
                  <div className="absolute inset-0 border-2 border-primary pointer-events-none rounded-md" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simple scroll indicators */}
      {containerWidth > 0 && images.length > 5 && (
        <>
          <div 
            className={`absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-200 ${
              scrollContainerRef.current?.scrollLeft > 10 ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div 
            className={`absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-200 ${
              scrollContainerRef.current && 
              scrollContainerRef.current.scrollWidth - scrollContainerRef.current.scrollLeft - scrollContainerRef.current.clientWidth > 10 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
          />
        </>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Enable CSS snapping for better mobile experience */
        .scrollbar-hide {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default GalleryThumbnails;