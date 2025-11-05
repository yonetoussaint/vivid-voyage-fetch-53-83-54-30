// ProductImageGallery.tsx
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { X } from "lucide-react";
import InfoBand from "@/components/product/InfoBand";
import SellerInfoOverlay from "@/components/product/SellerInfoOverlay";
import ConfigurationSummary from "@/components/product/ConfigurationSummary";

// Import new modular components
import { ProductImageGalleryRef, ProductImageGalleryProps } from './product/gallery/types';
import { useGalleryState } from './product/gallery/useGalleryState';
import GalleryItem from './product/gallery/GalleryItem';
import FullscreenGallery from './product/gallery/FullscreenGallery';
import { AutoScrollIndicator } from './product/gallery/AutoScrollIndicator';

const ProductImageGallery = forwardRef<ProductImageGalleryRef, ProductImageGalleryProps>(
  ({ 
    images, 
    videos = [],
    model3dUrl,
    focusMode: externalFocusMode,
    onFocusModeChange,
    seller,
    onSellerClick,
    product,
    bundlePrice,
    onVariantChange,
    onProductDetailsClick,
    onImageIndexChange,
    onVariantImageChange,
    configurationData,
    activeTab = 'overview',
    onBuyNow,
    onReadMore
  }, ref) => {

  // Debug: Log product object to see available properties
  useEffect(() => {
    console.log('📦 Product object:', product);
    if (product) {
      console.log('📊 Stock properties check:', {
        inventory: product.inventory,
        sold_count: product.sold_count,
        // Legacy properties for debugging
        stock: (product as any).stock,
        inStock: (product as any).inStock,
        quantity: (product as any).quantity,
        sold: (product as any).sold,
        soldCount: (product as any).soldCount,
        unitsSold: (product as any).unitsSold
      });
    }
  }, [product]);

  // Use the custom hook for state management
  const galleryState = useGalleryState(
    images, 
    videos,
    model3dUrl,
    onImageIndexChange, 
    onVariantImageChange,
    onFocusModeChange
  );

  // Get galleryItems from the state
  const galleryItems = galleryState.galleryItems;

  // Debug logging for 3D model
  console.log('📷 ProductImageGallery: model3dUrl received:', model3dUrl);
  console.log('📷 ProductImageGallery: galleryItems created:', galleryItems);

  // Destructure state and handlers
  const {
    displayImages,
    currentIndex,
    api,
    isRotated,
    isFlipped,
    autoScrollEnabled,
    autoScrollProgress,
    isFullscreenMode,
    focusMode,
    showConfiguration,
    zoomLevel,
    activeTab: internalActiveTab,
    internalConfigData,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    bufferedTime,
    currentItem,
    isCurrentVideo,
    isCurrentModel3D,
    totalItems,
    videoIndices,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setBufferedTime,
    setActiveTab,
    setInternalConfigData,
    setShowConfiguration,
    setFocusMode,
    containerRef,
    imageRef,
    videoRef,
    onApiChange,
    handleVariantImageChange,
    handleThumbnailClick,
    handlePrevious,
    handleNext,
    handleRotate,
    handleFlip,
    downloadItem,
    toggleFocusMode,
    handleConfigurationClick,
    handleImageClick,
    toggleFullscreen,
    toggleAutoScroll,
    startAutoScroll,
    stopAutoScroll
  } = galleryState;

  // Preload items
  useEffect(() => {
    const preloadItems = async () => {
      await Promise.all(
        galleryItems.map((item) => {
          return new Promise<string>((resolve) => {
            if (item.type === 'image') {
              const img = new Image();
              img.src = item.src;
              img.onload = () => resolve(item.src);
              img.onerror = () => resolve(item.src);
            } else {
              resolve(item.src);
            }
          });
        })
      );
    };

    preloadItems();
  }, [galleryItems]);

  // Video event listeners
  useEffect(() => {
    if (!isCurrentVideo || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);
    const onLoadedMetadata = () => setDuration(video.duration || 0);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onError = (e: Event) => {
      console.error('Video error:', e);
    };

    try {
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('progress', onProgress);
      video.addEventListener('error', onError);

      return () => {
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('progress', onProgress);
        video.removeEventListener('error', onError);
      };
    } catch (error) {
      console.error('Error setting up video event listeners:', error);
    }
  }, [isCurrentVideo, currentIndex]);

  // Sync external focus mode with internal state
  useEffect(() => {
    if (externalFocusMode !== undefined && externalFocusMode !== focusMode) {
      setFocusMode(externalFocusMode);
    }
  }, [externalFocusMode, focusMode]);

  // Auto-enable focus mode when viewing 3D model
  useEffect(() => {
    if (isCurrentModel3D && !focusMode) {
      setFocusMode(true);
      onFocusModeChange?.(true);
    }
  }, [isCurrentModel3D, focusMode, onFocusModeChange]);

  // Escape key handler for fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenMode) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreenMode, toggleFullscreen]);

  // Expose methods via ref
  // In the useImperativeHandle section of ProductImageGallery.tsx, update to:
useImperativeHandle(ref, () => ({
  setActiveTab: (tab: string) => setActiveTab(tab),
  getActiveTab: () => internalActiveTab,
  startAutoScroll: () => startAutoScroll(),
  stopAutoScroll: () => stopAutoScroll(),
  goToIndex: (index: number) => {
    console.log('🎯 ProductImageGallery.goToIndex called with:', index);
    galleryState.goToIndex(index); // Use the method from useGalleryState
  }
}));

  // Video control handlers
  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min((videoRef.current.currentTime || 0) + 10, duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max((videoRef.current.currentTime || 0) - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreenVideo = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

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
                  <GalleryItem
                    item={item}
                    index={index}
                    currentIndex={currentIndex}
                    isRotated={isRotated}
                    isFlipped={isFlipped}
                    zoomLevel={zoomLevel}
                    imageFilter="none"
                    onImageClick={handleImageClick}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    volume={volume}
                    currentTime={currentTime}
                    duration={duration}
                    bufferedTime={bufferedTime}
                    videoRef={videoRef}
                    imageRef={imageRef}
                    onToggleVideo={toggleVideo}
                    onMuteToggle={handleMuteToggle}
                    onVolumeChange={handleVolumeChange}
                    onSeek={handleSeek}
                    onSkipForward={handleSkipForward}
                    onSkipBackward={handleSkipBackward}
                    onFullscreenToggle={handleFullscreenVideo}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Auto Scroll Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 w-4/5 max-w-64">
            <AutoScrollIndicator
              totalItems={totalItems}
              currentIndex={currentIndex}
              autoScrollEnabled={autoScrollEnabled}
              autoScrollProgress={autoScrollProgress}
              onDotClick={handleThumbnailClick}
            />
          </div>

          <SellerInfoOverlay 
            seller={seller}
            onSellerClick={onSellerClick}
            focusMode={focusMode}
            isPlaying={isCurrentVideo && isPlaying}
          />

          {focusMode && showConfiguration && (configurationData || internalConfigData) && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowConfiguration(false);
                    if (focusMode) {
                      setFocusMode(false);
                      onFocusModeChange?.(false);
                    }
                  }}
                  className="absolute -top-2 -right-2 z-40 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                >
                  <X size={16} className="text-gray-600" />
                </button>
                <ConfigurationSummary 
                  {...(configurationData || internalConfigData)} 
                  onClose={() => {
                    setShowConfiguration(false);
                    if (focusMode) {
                      setFocusMode(false);
                      onFocusModeChange?.(false);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </Carousel>
      </div>

      {/* InfoBand */}
      <InfoBand />

      {/* REMOVED: GalleryTabsContent - Now moved to ProductDetailLayout */}

      <FullscreenGallery
        isVisible={isFullscreenMode}
        currentItem={currentItem}
        currentIndex={currentIndex}
        totalItems={totalItems}
        isRotated={isRotated}
        isFlipped={isFlipped}
        zoomLevel={zoomLevel}
        imageFilter="none"
        focusMode={focusMode}
        autoScrollEnabled={autoScrollEnabled}
        autoScrollProgress={autoScrollProgress}
        seller={seller}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        onToggleFullscreen={toggleFullscreen}
        onRotate={handleRotate}
        onFlip={handleFlip}
        onToggleAutoScroll={toggleAutoScroll}
        onToggleFocusMode={toggleFocusMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onDownload={downloadItem}
        onSellerClick={onSellerClick}
        onToggleVideo={toggleVideo}
        onMuteToggle={handleMuteToggle}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        onSkipForward={handleSkipForward}
        onSkipBackward={handleSkipBackward}
        onFullscreenVideo={handleFullscreenVideo}
      />
    </div>
  );
});

ProductImageGallery.displayName = "ProductImageGallery";

export default ProductImageGallery;
export type { ProductImageGalleryRef };