import { useState, useRef, useCallback, useEffect } from 'react';
import { CarouselApi } from '@/components/ui/carousel';
import { GalleryItem, TouchPosition } from './types';
import { createGalleryItems } from './utils';
import { toast } from '@/hooks/use-toast';

export const useGalleryState = (
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
  const [api, setApi] = useState<CarouselApi | null>(null);
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

  // Carousel API callback
  const onApiChange = useCallback((api: CarouselApi | null) => {
    if (!api) return;

    setApi(api);
    const index = api.selectedScrollSnap();
    setCurrentIndex(index);
    onImageIndexChange?.(index, totalItems);

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
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

  // FIXED: Enhanced auto-scroll effect with proper carousel integration
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
    if (api) {
      api.scrollTo(index);
      setAutoScrollProgress(0); // Reset progress when manually navigating
    }
  }, [api]);

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

    toast({
      title: `${item.type === 'video' ? 'Video' : 'Image'} downloaded`,
      description: `${item.type === 'video' ? 'Video' : 'Image'} ${index + 1} has been downloaded`,
      duration: 2000,
    });
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
    stopAutoScroll
  };
};