// ProductImageGallery.tsx
import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef, useCallback } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { X } from "lucide-react";
import InfoBand from "@/components/product/InfoBand";
import SellerInfoOverlay from "@/components/product/SellerInfoOverlay";
import ConfigurationSummary from "@/components/product/ConfigurationSummary";

// Import modular components
import GalleryItem from './product/gallery/GalleryItem';
import FullscreenGallery from './product/gallery/FullscreenGallery';
import { AutoScrollIndicator } from './product/gallery/AutoScrollIndicator';

// Types that were in types.ts
interface ProductImageGalleryRef {
  setActiveTab: (tab: string) => void;
  getActiveTab: () => string;
  startAutoScroll: () => void;
  stopAutoScroll: () => void;
  goToIndex: (index: number) => void;
}

interface ProductImageGalleryProps {
  images: string[];
  onReadMore?: () => void;
  videos?: {
    id: string;
    video_url: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }[];
  model3dUrl?: string;
  focusMode?: boolean;
  onFocusModeChange?: (focusMode: boolean) => void;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
  product?: {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
    inventory?: number;
    sold_count?: number;
  };
  bundlePrice?: number;
  onVariantChange?: (variantIndex: number, variant: any) => void;
  onProductDetailsClick?: () => void;
  onImageIndexChange?: (currentIndex: number, totalItems: number) => void;
  onVariantImageChange?: (imageUrl: string, variantName: string) => void;
  configurationData?: {
    selectedColor?: string;
    selectedStorage?: string;
    selectedNetwork?: string;
    selectedCondition?: string;
    colorVariants: any[];
    storageVariants: any[];
    networkVariants: any[];
    conditionVariants: any[];
    getSelectedColorVariant: () => any;
    getSelectedStorageVariant: () => any;
    getSelectedNetworkVariant: () => any;
    getSelectedConditionVariant: () => any;
    getStorageDisplayValue: (storage: string) => string;
    getVariantFormattedPrice: (id: number) => string;
    formatPrice: (price: number) => string;
  } | null;
  activeTab?: string;
  onBuyNow?: () => void;
}

interface GalleryItemType {
  type: 'image' | 'video' | 'model3d';
  src: string;
  videoData?: any;
  index: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

// Helper function to create gallery items
const createGalleryItems = (images: string[], videos: any[] = [], model3dUrl?: string): GalleryItemType[] => {
  const items: GalleryItemType[] = [];

  // Add images
  images.forEach((src, index) => {
    items.push({
      type: 'image',
      src,
      index: items.length
    });
  });

  // Add videos
  videos.forEach((video) => {
    items.push({
      type: 'video',
      src: video.video_url,
      videoData: video,
      index: items.length
    });
  });

  // Add 3D model if available
  if (model3dUrl) {
    items.push({
      type: 'model3d',
      src: model3dUrl,
      index: items.length
    });
  }

  return items;
};

// Custom hook logic moved inline
const useGalleryState = (
  images: string[],
  videos: any[],
  model3dUrl?: string,
  onImageIndexChange?: (currentIndex: number, totalItems: number) => void,
  onVariantImageChange?: (imageUrl: string, variantName: string) => void,
  onFocusModeChange?: (focusMode: boolean) => void
) => {
  // Gallery state
  const [displayImages, setDisplayImages] = useState<string[]>(images);

  // Create gallery items whenever displayImages, videos, or model3dUrl change
  const galleryItems = createGalleryItems(displayImages, videos, model3dUrl);
  const totalItems = galleryItems.length;
  const videoIndices = galleryItems.map((item, index) => item.type === 'video' ? index : -1).filter(i => i !== -1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [isRotated, setIsRotated] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoScrollProgress, setAutoScrollProgress] = useState(0);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [internalConfigData, setInternalConfigData] = useState<any>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartPosition = useRef<TouchPosition | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Get current item
  const currentItem = galleryItems[currentIndex];
  const isCurrentVideo = currentItem?.type === 'video';
  const isCurrentModel3D = currentItem?.type === 'model3d';

  // Update display images when props change
  useEffect(() => {
    setDisplayImages(images);
  }, [images]);

  // Handle external index changes (from thumbnail clicks)
  const goToIndex = useCallback((index: number) => {
    console.log('🎯 goToIndex called with:', index);
    if (api && index >= 0 && index < totalItems) {
      api.scrollTo(index);
      setAutoScrollProgress(0); // Reset progress when manually navigating
    }
  }, [api, totalItems]);

  // Carousel API callback
  const onApiChange = useCallback((api: any) => {
    if (!api) return;

    setApi(api);
    const index = api.selectedScrollSnap();
    setCurrentIndex(index);
    onImageIndexChange?.(index, totalItems);

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      console.log('🔄 Carousel selected index:', newIndex);
      setCurrentIndex(newIndex);
      onImageIndexChange?.(newIndex, totalItems);
      setIsRotated(0);
      setIsFlipped(false);
      setZoomLevel(1);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBufferedTime(0);
      setAutoScrollProgress(0); // Reset progress on manual navigation
    });
  }, [onImageIndexChange, totalItems]);

  // Enhanced auto-scroll effect with proper carousel integration
  useEffect(() => {
    if (autoScrollEnabled && api && totalItems > 1) {
      const intervalDuration = 3000; // 3 seconds per slide
      let startTime = Date.now();
      let currentSlideStartTime = Date.now();

      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - currentSlideStartTime;
        const progress = (elapsed / intervalDuration) * 100;

        setAutoScrollProgress(progress);

        // Move to next slide when progress reaches 100%
        if (progress >= 100) {
          api.scrollNext();
          currentSlideStartTime = now;
          setAutoScrollProgress(0);
        }
      }, 50); // Update progress every 50ms for smooth animation

      setAutoScrollInterval(interval);

      return () => {
        clearInterval(interval);
        setAutoScrollInterval(null);
        setAutoScrollProgress(0);
      };
    } else {
      // Reset progress when auto-scroll is disabled
      setAutoScrollProgress(0);
    }
  }, [autoScrollEnabled, api, totalItems]);

  // Reset progress when current index changes (manual navigation)
  useEffect(() => {
    if (!autoScrollEnabled) {
      setAutoScrollProgress(0);
    }
  }, [currentIndex, autoScrollEnabled]);

  // Handle variant image selection
  const handleVariantImageChange = useCallback((imageUrl: string, variantName: string) => {
    console.log('📷 Variant image selected:', imageUrl, variantName);

    const newImages = [imageUrl, ...images.filter(img => img !== imageUrl)];
    setDisplayImages(newImages);

    setTimeout(() => {
      if (api) {
        api.scrollTo(0);
      }
      setCurrentIndex(0);
    }, 100);

    if (onVariantImageChange) {
      onVariantImageChange(imageUrl, variantName);
    }
  }, [images, api, onVariantImageChange]);

  // Navigation handlers
  const handleThumbnailClick = useCallback((index: number) => {
    goToIndex(index);
  }, [goToIndex]);

  const handlePrevious = useCallback(() => {
    if (api) {
      api.scrollPrev();
      setAutoScrollProgress(0); // Reset progress when manually navigating
    }
  }, [api]);

  const handleNext = useCallback(() => {
    if (api) {
      api.scrollNext();
      setAutoScrollProgress(0); // Reset progress when manually navigating
    }
  }, [api]);

  // Transform handlers
  const handleRotate = useCallback(() => {
    setIsRotated(prev => (prev + 90) % 360);
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Utility handlers
  const downloadItem = useCallback((index: number) => {
    const item = galleryItems[index];
    const link = document.createElement('a');
    link.href = item.src;
    link.download = `product-${item.type}-${index + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Note: You might need to import toast or handle differently
    console.log(`${item.type === 'video' ? 'Video' : 'Image'} ${index + 1} has been downloaded`);
  }, [galleryItems]);

  // Focus mode handlers
  const toggleFocusMode = useCallback(() => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    if (!newFocusMode) {
      setShowConfiguration(false);
    }
    onFocusModeChange?.(newFocusMode);
  }, [focusMode, onFocusModeChange]);

  const handleConfigurationClick = useCallback(() => {
    if (focusMode) {
      setShowConfiguration(prev => !prev);
    } else {
      setFocusMode(true);
      setShowConfiguration(true);
      onFocusModeChange?.(true);
    }
  }, [focusMode, onFocusModeChange]);

  const handleImageClick = useCallback(() => {
    if (focusMode) {
      setShowConfiguration(!showConfiguration);
    } else if (!isCurrentVideo && !isCurrentModel3D) {
      setFocusMode(true);
      setShowConfiguration(true);
      onFocusModeChange?.(true);
    }
  }, [focusMode, showConfiguration, onFocusModeChange, isCurrentVideo, isCurrentModel3D]);

  // Fullscreen handlers
  const toggleFullscreen = useCallback(() => {
    setIsFullscreenMode(prev => !prev);

    if (!isFullscreenMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullscreenMode]);

  // Auto scroll
  const toggleAutoScroll = useCallback(() => {
    setAutoScrollEnabled(prev => !prev);
  }, []);

  // Auto-scroll control methods
  const startAutoScroll = useCallback(() => {
    setAutoScrollEnabled(true);
  }, []);

  const stopAutoScroll = useCallback(() => {
    setAutoScrollEnabled(false);
  }, []);

  return {
    // State
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
    activeTab,
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
    galleryItems,

    // Setters
    setDisplayImages,
    setCurrentIndex,
    setActiveTab,
    setInternalConfigData,
    setShowConfiguration,
    setFocusMode,
    setIsPlaying,
    setIsMuted,
    setVolume,
    setCurrentTime,
    setDuration,
    setBufferedTime,

    // Refs
    containerRef,
    imageRef,
    videoRef,
    fullscreenRef,
    tabsContainerRef,

    // Handlers
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
    stopAutoScroll,
    goToIndex
  };
};

// Main Component
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
    stopAutoScroll,
    goToIndex
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
  useImperativeHandle(ref, () => ({
    setActiveTab: (tab: string) => setActiveTab(tab),
    getActiveTab: () => internalActiveTab,
    startAutoScroll: () => startAutoScroll(),
    stopAutoScroll: () => stopAutoScroll(),
    goToIndex: (index: number) => {
      if (api && index >= 0 && index < totalItems) {
        api.scrollTo(index);
        setCurrentIndex(index);
      }
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