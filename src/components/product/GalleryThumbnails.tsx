import React, { useState, useCallback, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

// Simplified skeleton component
const ThumbnailSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("bg-gray-200 animate-pulse", className)} />
);

interface GalleryThumbnailsProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  isPlaying?: boolean;
  videoIndices?: number[];
  galleryItems?: Array<{
    type: 'image' | 'video';
    src: string;
    videoData?: any;
  }>;
  variantNames?: string[];
}

export const GalleryThumbnails = ({
  images,
  currentIndex,
  onThumbnailClick,
  isPlaying = false,
  videoIndices = [],
  galleryItems = [],
  variantNames = []
}: GalleryThumbnailsProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const handleImageError = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200; // Adjust this value as needed
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Update scroll buttons visibility on mount and when images change
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [images, checkScrollButtons]);

  const thumbnailSize = 80; // Fixed thumbnail size in pixels

  return (
    <div className="relative px-2 w-full">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scrollThumbnails('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-1 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scrollThumbnails('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-1 shadow-sm"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((src, index) => {
          const isVideo = videoIndices.includes(index);
          const galleryItem = galleryItems[index];
          const isImageLoaded = loadedImages.has(index);
          const variantName = variantNames[index];

          return (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-md border flex-shrink-0 transition-all",
                "cursor-pointer",
                currentIndex === index 
                  ? "border-2 border-primary shadow-md" 
                  : "border border-gray-300 hover:border-gray-400"
              )}
              style={{ width: `${thumbnailSize}px`, height: `${thumbnailSize}px` }}
              onClick={() => onThumbnailClick(index)}
            >
              {!isImageLoaded && (
                <ThumbnailSkeleton className="absolute inset-0 w-full h-full" />
              )}

              {isVideo || galleryItem?.type === 'video' ? (
                <>
                  <video 
                    src={src}
                    className={cn("w-full h-full object-cover", 
                      !isImageLoaded && "opacity-0"
                    )}
                    muted
                    preload="metadata"
                    poster={galleryItem?.videoData?.thumbnail_url}
                    onLoadedData={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />

                  {isImageLoaded && (
                    <>
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/40",
                        currentIndex === index && isPlaying && "opacity-0"
                      )}>
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute top-0.5 left-0.5 text-[8px] bg-black/60 text-white px-1 rounded">
                        VIDEO
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img 
                  src={src} 
                  alt={`Thumbnail ${index}`} 
                  className={cn("w-full h-full object-cover", 
                    !isImageLoaded && "opacity-0"
                  )}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}

              {variantName && isImageLoaded && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-1 py-0.5">
                  <p className="text-[9px] text-center text-foreground truncate font-medium">
                    {variantName}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hide scrollbar (CSS alternative) */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};