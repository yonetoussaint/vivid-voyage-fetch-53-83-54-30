// ProductImageGallery.tsx
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import InfoBand from "@/components/product/InfoBand";

// Import new modular components
import { ProductImageGalleryRef, ProductImageGalleryProps, GalleryItem as GalleryItemType } from './product/gallery/types';

// Custom hook
import { useGalleryState } from './product/gallery/useGalleryState';

const ProductImageGallery = forwardRef<ProductImageGalleryRef, ProductImageGalleryProps>(
  ({ 
    images, 
    videos = [],
    focusMode: externalFocusMode,
    onFocusModeChange,
    onImageIndexChange,
    onVariantImageChange,
  }, ref) => {

  // Use the custom hook for state management
  const galleryState = useGalleryState(
    images, 
    videos,
    undefined, // No 3D model
    onImageIndexChange, 
    onVariantImageChange,
    onFocusModeChange
  );

  // Get galleryItems from the state
  const galleryItems = galleryState.galleryItems;

  // Destructure state and handlers
  const {
    currentIndex,
    isRotated,
    isFlipped,
    zoomLevel,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    totalItems,
    setCurrentTime,
    setDuration,
    containerRef,
    imageRef,
    videoRef,
    onApiChange,
    handleThumbnailClick,
    handleImageClick,
    setFocusMode
  } = galleryState;

  // Video event listeners
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);
    const onLoadedMetadata = () => setDuration(video.duration || 0);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [currentIndex]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollTo: (index: number) => handleThumbnailClick(index)
  }));

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  if (totalItems === 0) {
    return (
      <div className="flex flex-col bg-transparent">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No images or videos available</span>
        </div>
      </div>
    );
  }

  // Inline GalleryItem component
  const renderGalleryItem = (item: GalleryItemType, index: number) => {
    if (item.type === 'video') {
      return (
        <div className="relative w-full h-full">
          <video
            ref={index === currentIndex ? videoRef : undefined}
            src={item.src}
            className="w-full h-full object-contain"
            controls
            muted={isMuted}
            playsInline
            onError={(e) => {
              console.error('Video loading error:', e);
            }}
          />
          <button
            onClick={toggleVideo}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      );
    }

    // Regular image
    return (
      <img
        ref={index === currentIndex ? imageRef : undefined}
        src={item.src}
        alt={`Product image ${index + 1}`}
        className="w-full h-full object-contain transition-transform"
        style={{
          transform: `
            rotate(${isRotated}deg)
            ${isFlipped ? 'scaleX(-1)' : ''}
            scale(${zoomLevel})
          `,
          transition: "transform 0.2s ease-out",
        }}
        draggable={false}
        onClick={handleImageClick}
        onError={(e) => {
          console.error('Image loading error:', e);
        }}
      />
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col bg-transparent w-full max-w-full overflow-x-hidden">
      <div className="relative w-full aspect-square overflow-hidden max-w-full">
        <Carousel
          className="w-full h-full"
          opts={{
            loop: totalItems > 1,
          }}
          setApi={onApiChange}
        >
          <CarouselContent className="h-full">
            {galleryItems.map((item, index) => (
              <CarouselItem key={`${item.type}-${index}`} className="h-full">
                <div className="flex h-full w-full items-center justify-center overflow-hidden relative">
                  {renderGalleryItem(item, index)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Image Counter - Thinner version */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-white text-xs font-medium">
              {currentIndex + 1}/{totalItems}
            </span>
          </div>
        </div>
      </div>

      {/* InfoBand */}
      <InfoBand />
    </div>
  );
});

ProductImageGallery.displayName = "ProductImageGallery";

export default ProductImageGallery;
export type { ProductImageGalleryRef };