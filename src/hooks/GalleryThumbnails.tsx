// src/components/product/GalleryThumbnails.tsx
import React, { useRef, useEffect, useCallback } from 'react';

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
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate how many items to show (5.5 items)
  const itemCount = 5.5;
  const itemWidth = 16.5;

  // Function to snap to selected thumbnail
  const snapToThumbnail = useCallback((index: number) => {
    if (!scrollContainerRef.current || !thumbnailRefs.current[index] || isScrollingRef.current) {
      return;
    }

    const container = scrollContainerRef.current;
    const selectedThumbnail = thumbnailRefs.current[index];
    
    if (!selectedThumbnail) return;

    // Get dimensions
    const containerRect = container.getBoundingClientRect();
    const thumbnailRect = selectedThumbnail.getBoundingClientRect();
    const containerScrollLeft = container.scrollLeft;
    
    // Calculate scroll position to center the selected thumbnail
    const thumbnailLeft = thumbnailRect.left - containerRect.left + containerScrollLeft;
    const thumbnailCenter = thumbnailLeft - (containerRect.width - thumbnailRect.width) / 2;
    
    // Calculate max scroll
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.max(0, Math.min(thumbnailCenter, maxScroll));
    
    // Set scrolling flag
    isScrollingRef.current = true;
    
    // Smooth scroll to center the selected thumbnail
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Clear scrolling flag after animation
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 300);

  }, []);

  // Snap to selected thumbnail when currentIndex changes
  useEffect(() => {
    snapToThumbnail(currentIndex);
  }, [currentIndex, snapToThumbnail]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    onThumbnailClick(index);
    snapToThumbnail(index);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1.5 py-1 px-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            ref={el => thumbnailRefs.current[index] = el}
            className="flex-shrink-0"
            style={{ width: `${itemWidth}%` }}
          >
            <div
              className={`relative overflow-hidden border aspect-square cursor-pointer transition-all duration-200 ${
                currentIndex === index 
                  ? "border-2 border-primary scale-105" 
                  : "border border-gray-300 hover:border-gray-400 hover:scale-[1.02]"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={src} 
                alt={`Thumbnail ${index}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
              {currentIndex === index && (
                <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
              )}
            </div>
          </div>
        ))}
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

export default GalleryThumbnails;