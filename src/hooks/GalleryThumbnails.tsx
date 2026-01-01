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

  // Calculate how many items to show (5.5 items)
  const itemCount = 5.5;
  const itemWidth = 16.5; // percentage for 5.5 items (100/5.5 ≈ 18.18, reduced a bit for spacing)

  // Snap to selected thumbnail when currentIndex changes
  useEffect(() => {
    if (!scrollContainerRef.current || !thumbnailRefs.current[currentIndex]) {
      return;
    }

    const container = scrollContainerRef.current;
    const selectedThumbnail = thumbnailRefs.current[currentIndex];
    
    if (!selectedThumbnail) return;

    // Get dimensions
    const containerRect = container.getBoundingClientRect();
    const thumbnailRect = selectedThumbnail.getBoundingClientRect();
    const containerScrollLeft = container.scrollLeft;
    
    // Calculate scroll position to center the selected thumbnail
    const thumbnailLeft = thumbnailRect.left - containerRect.left + containerScrollLeft;
    const thumbnailCenter = thumbnailLeft - (containerRect.width - thumbnailRect.width) / 2;
    
    // Smooth scroll to center the selected thumbnail
    container.scrollTo({
      left: thumbnailCenter,
      behavior: 'smooth'
    });

  }, [currentIndex]);

  // Handle thumbnail click with proper snapping
  const handleThumbnailClick = (index: number) => {
    onThumbnailClick(index);
    
    // The useEffect will handle the snapping, but we can also immediately scroll
    if (scrollContainerRef.current && thumbnailRefs.current[index]) {
      const container = scrollContainerRef.current;
      const thumbnail = thumbnailRefs.current[index];
      if (!thumbnail) return;

      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;
      
      const thumbnailLeft = thumbnailRect.left - containerRect.left + containerScrollLeft;
      const thumbnailCenter = thumbnailLeft - (containerRect.width - thumbnailRect.width) / 2;
      
      container.scrollTo({
        left: thumbnailCenter,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1.5 py-1 px-2 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            ref={el => thumbnailRefs.current[index] = el}
            className="flex-shrink-0 snap-center"
            style={{ width: `${itemWidth}%` }}
            data-index={index}
          >
            <div
              className={`relative overflow-hidden border aspect-square cursor-pointer transition-all ${
                currentIndex === index 
                  ? "border-2 border-primary snap-always" 
                  : "border border-gray-300 hover:border-gray-400"
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
        
        /* Additional CSS for better snapping */
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        
        .snap-center {
          scroll-snap-align: center;
        }
        
        .snap-mandatory {
          scroll-snap-stop: always;
        }
        
        .snap-always {
          scroll-snap-stop: always;
        }
      `}</style>
    </div>
  );
};

export default GalleryThumbnails;