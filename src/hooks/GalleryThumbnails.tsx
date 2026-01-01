// src/components/product/GalleryThumbnails.tsx
import React, { useRef, useEffect } from 'react';

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

  // Function to snap thumbnail to left edge
  const snapToLeftEdge = (index: number) => {
    const container = scrollContainerRef.current;
    const thumbnail = thumbnailRefs.current[index];
    
    if (!container || !thumbnail) return;

    // Get the container's padding-left (from px-4 = 16px)
    const containerStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 16;
    
    // Get thumbnail position relative to container
    const thumbnailRect = thumbnail.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate current scroll position needed to bring thumbnail to left edge
    const thumbnailLeftRelative = thumbnailRect.left - containerRect.left;
    const currentScroll = container.scrollLeft;
    
    // Target scroll = current scroll + thumbnail's position from left edge
    // We want thumbnail to be at the left edge (accounting for padding)
    const targetScroll = currentScroll + thumbnailLeftRelative - paddingLeft;
    
    // Ensure we don't scroll past boundaries
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    
    // Scroll to position
    container.scrollTo({
      left: clampedScroll,
      behavior: 'smooth'
    });
  };

  // Alternative simpler method using offsetLeft
  const snapToLeftEdgeSimple = (index: number) => {
    const container = scrollContainerRef.current;
    const thumbnail = thumbnailRefs.current[index];
    
    if (!container || !thumbnail) return;

    // Get thumbnail's offsetLeft relative to container
    const thumbnailOffset = thumbnail.offsetLeft;
    
    // Account for container padding (16px from px-4)
    const targetScroll = thumbnailOffset - 16;
    
    // Ensure we don't scroll past boundaries
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    
    // Scroll to position
    container.scrollTo({
      left: clampedScroll,
      behavior: 'smooth'
    });
  };

  // Snap when currentIndex changes
  useEffect(() => {
    if (images.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        snapToLeftEdgeSimple(currentIndex);
      }, 10);
    }
  }, [currentIndex, images.length]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    // Call parent handler first
    onThumbnailClick(index);
    
    // Then snap to left edge
    setTimeout(() => {
      snapToLeftEdgeSimple(index);
    }, 10);
  };

  // Initialize refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images.length]);

  return (
    <div className="relative w-full bg-white">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-3 px-4 gap-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            ref={el => {
              thumbnailRefs.current[index] = el;
            }}
            className="flex-shrink-0"
            style={{ 
              width: '80px', // Fixed width for consistent snapping
              scrollSnapAlign: 'start'
            }}
          >
            <button
              className={`relative overflow-hidden border aspect-square w-full rounded transition-all duration-150 active:scale-95 ${
                currentIndex === index 
                  ? "border-2 border-primary shadow-sm" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={src} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
              
              {/* Selected indicator */}
              {currentIndex === index && (
                <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Scroll indicators */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity ${
          scrollContainerRef.current?.scrollLeft > 10 ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div 
        className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity ${
          scrollContainerRef.current && 
          scrollContainerRef.current.scrollWidth - scrollContainerRef.current.scrollLeft - scrollContainerRef.current.clientWidth > 10 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Optional: Enable CSS scroll snapping for better UX */
        .scrollbar-hide {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default GalleryThumbnails;