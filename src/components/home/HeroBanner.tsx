import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerSlides from './hero/BannerSlides';
import BannerControls from './hero/BannerControls';
import NewsTicker from './hero/NewsTicker';
import FloatingVideo from '../hero/FloatingVideo';
import SellerInfoOverlay from '../product/SellerInfoOverlay';
import { BannerType } from './hero/types';
import ProductFilterBar from './ProductFilterBar';

interface HeroBannerProps {
  asCarousel?: boolean;
  showNewsTicker?: boolean;
  // New prop to control bottom row in carousel mode
  showCarouselBottomRow?: boolean;
  // Custom banners prop - allows passing custom banner data including colors
  customBanners?: Array<{
    id: string;
    color?: string; // Gradient or solid color
    alt: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video' | 'color';
    duration?: number;
  }>;
  // Filter props
  filterCategories?: Array<{
    id: string;
    label: string;
    options: string[];
  }>;
  selectedFilters?: Record<string, string>;
  onFilterSelect?: (filterId: string, option: string) => void;
  onFilterClear?: (filterId: string) => void;
  onClearAll?: () => void;
  onFilterButtonClick?: (filterId: string) => void;
  isFilterDisabled?: (filterId: string) => boolean;
}

export default function HeroBanner({ 
  asCarousel = false, 
  showNewsTicker = true,
  // New prop - default to true for backward compatibility
  showCarouselBottomRow = true,
  // Custom banners
  customBanners,
  // Filter props with defaults
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled = () => false
}: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [showNews, setShowNews] = useState(showNewsTicker);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const [videoDurations, setVideoDurations] = useState<{[key: number]: number}>({});
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update showNews state when showNewsTicker prop changes
  useEffect(() => {
    setShowNews(showNewsTicker);
  }, [showNewsTicker]);

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      if (header) {
        // Get the actual rendered height including borders and padding
        const computedStyle = window.getComputedStyle(header);
        const height = header.getBoundingClientRect().height;
        setOffset(Math.ceil(height));
      } else {
        setOffset(0);
      }
    }

    // Initial calculation
    updateOffset();

    // Recalculate on resize and after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateOffset, 100);
    window.addEventListener('resize', updateOffset);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  // Initialize storage buckets if needed
  useEffect(() => {
    const initStorage = async () => {
      await setupStorageBuckets();
      console.log('Storage buckets initialized');
    };
    initStorage();
  }, []);

  // Fetch banners from Supabase only if customBanners is not provided
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 10000,
    enabled: !customBanners, // Only fetch if no custom banners provided
  });

  // Show error if banner fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  // Preload images
  useEffect(() => {
    if (banners) {
      console.log("Banners loaded from query:", banners);
      banners.forEach(banner => {
        if (banner.image) {
          const img = new Image();
          img.src = banner.image;
        }
      });
    }
  }, [banners]);

  // Transform banners to match BannerType interface
  const transformedBanners: BannerType[] = useMemo(() => {
    // If customBanners provided, use those instead
    if (customBanners) {
      return customBanners.map((banner, index) => {
        const rowTypes: ('product' | 'seller' | 'catalog')[] = ['product', 'seller', 'catalog'];
        const rowType = rowTypes[index % 3] || 'product';

        return {
          ...banner,
          image: banner.image || banner.color || '', // Use image field or fallback to color
          type: (banner.type || 'color') as 'image' | 'video',
          duration: banner.duration || 5000,
          rowType,
          product: undefined,
          seller: undefined,
          catalog: undefined,
        };
      });
    }

    // Otherwise use fetched banners
    return banners?.map((banner, index) => {
      const decodedUrl = decodeURIComponent(banner.image);
      const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(decodedUrl) || 
                      /\.(mp4|webm|ogg|mov|avi)$/i.test(banner.image);

      // Determine row type based on index or banner data
      const rowTypes: ('product' | 'seller' | 'catalog')[] = ['product', 'seller', 'catalog'];
      const rowType = rowTypes[index % 3] || 'product';

      const mockSeller = {
        id: `seller_${index + 1}`,
        name: index === 0 ? "TechStore Pro" : "FashionHub",
        image_url: index === 0 ? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop&crop=center" : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
        verified: true,
        followers_count: index === 0 ? 25400 : 18200
      };

      const mockCatalog = {
        id: `catalog_${index + 1}`,
        name: index === 0 ? "Summer Collection" : "Winter Essentials",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
        ],
        product_count: index === 0 ? 24 : 18
      };

      const mockProduct = {
        id: `product_${index + 1}`,
        name: index === 0 ? "Wireless Headphones" : "Smart Watch",
        price: index === 0 ? 199.99 : 299.99,
        image: index === 0 ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center" : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center"
      };

      return {
        ...banner,
        type: isVideo ? "video" as const : "image" as const,
        duration: banner.duration || (isVideo ? 10000 : 5000),
        rowType,
        seller: rowType === 'seller' ? mockSeller : undefined,
        catalog: rowType === 'catalog' ? mockCatalog : undefined,
        product: rowType === 'product' ? mockProduct : undefined
      };
    }) || [];
  }, [banners, customBanners]);

  const slidesToShow = transformedBanners;

  // Handle video duration updates
  const handleVideoDurationChange = useCallback((index: number, duration: number) => {
    setVideoDurations(prev => ({ ...prev, [index]: duration }));
  }, []);

  // Get duration for current slide
  const getCurrentSlideDuration = useCallback(() => {
    const slide = slidesToShow[activeIndex];
    if (!slide) return 5000;

    if (slide.type === "video" && videoDurations[activeIndex]) {
      return videoDurations[activeIndex];
    }

    return slide.duration || 5000;
  }, [activeIndex, slidesToShow, videoDurations]);

  // Banner rotation (disabled for carousel mode)
  useEffect(() => {
    if (asCarousel || slidesToShow.length <= 1) return;

    let timeoutRef: ReturnType<typeof setTimeout> | null = null;
    let progressIntervalRef: ReturnType<typeof setInterval> | null = null;

    const duration = getCurrentSlideDuration();
    const progressStep = (50 / duration) * 100;

    const startSlideTimer = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
      setProgress(0);

      progressIntervalRef = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + progressStep));
      }, 50);

      timeoutRef = setTimeout(() => {
        setProgress(0);
        setPreviousIndex(activeIndex);
        setActiveIndex((current) => (current + 1) % slidesToShow.length);
      }, duration);
    };

    startSlideTimer();

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
    };
  }, [activeIndex, slidesToShow.length, videoDurations, asCarousel, getCurrentSlideDuration]);

  // Scroll detection for floating video (disabled for carousel mode)
  useEffect(() => {
    if (asCarousel) return;

    const handleScroll = () => {
      if (!heroBannerRef.current) return;

      const currentSlide = slidesToShow[activeIndex];
      if (!currentSlide || currentSlide.type !== "video") {
        setShowFloatingVideo(false);
        return;
      }

      const rect = heroBannerRef.current.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (!isVisible && !showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && !videoElement.paused) {
          const exactTime = videoElement.currentTime;
          videoElement.pause();
          videoElement.muted = true;
          setVideoCurrentTime(exactTime);
          setShowFloatingVideo(true);
        }
      } else if (isVisible && showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && videoElement.paused) {
          videoElement.play().catch(console.error);
        }
        setShowFloatingVideo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, slidesToShow, showFloatingVideo, asCarousel]);

  const handleCloseFloatingVideo = useCallback(() => {
    setShowFloatingVideo(false);
  }, []);

  const handleExpandFloatingVideo = useCallback(() => {
    setShowFloatingVideo(false);
    heroBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentSlide = slidesToShow[activeIndex];

  // Simple carousel scroll handler (no position restoration to prevent snapping)
  const handleCarouselScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Allow natural scrolling without any position restoration
  }, []);

  // Carousel component as JSX - memoized to prevent re-renders
  const CarouselBanners = useMemo(() => {
    const renderProductRow = (slide: BannerType) => (
      <div className="flex items-center justify-between gap-3">
        {/* Product image and info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={slide.product?.image || "/placeholder-product.jpg"}
            alt={slide.product?.name || "Product"}
            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1 truncate">
              {slide.product?.name || "Product Name"}
            </h4>
            <p className="text-green-600 font-semibold text-base">
              ${slide.product?.price?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
        {/* Add to cart button */}
        <button
          className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 flex-shrink-0 whitespace-nowrap"
          onClick={() => console.log('Add to cart:', slide.product)}
        >
          Add to Cart
        </button>
      </div>
    );

    const renderSellerRow = (slide: BannerType) => (
      <div className="flex items-center justify-between gap-3">
        {/* Seller image and info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <img
              src={slide.seller?.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
              alt={slide.seller?.name || "Seller"}
              className="w-12 h-12 object-cover rounded-full flex-shrink-0"
              loading="lazy"
            />
            {slide.seller?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {slide.seller?.name || "Sarah Johnson"}
              </h4>
              {slide.seller?.verified && (
                <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-600 text-xs">
              {slide.seller?.followers_count?.toLocaleString() || "12.5K"} followers
            </p>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="bg-black text-white px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 whitespace-nowrap"
            onClick={() => console.log('View profile:', slide.seller)}
          >
            View Profile
          </button>
        </div>
      </div>
    );

    const renderCatalogRow = (slide: BannerType) => (
      <div className="flex items-center justify-between gap-3">
        {/* Catalog images and info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-12 h-12 flex-shrink-0">
            {/* Stacked images effect */}
            <img
              src={slide.catalog?.images?.[0] || "/placeholder-catalog.jpg"}
              alt={slide.catalog?.name || "Catalog"}
              className="w-10 h-10 object-cover rounded-lg absolute top-0 left-0 border-2 border-white shadow-sm"
              loading="lazy"
            />
            {slide.catalog?.images?.[1] && (
              <img
                src={slide.catalog.images[1]}
                alt={slide.catalog.name}
                className="w-8 h-8 object-cover rounded-lg absolute bottom-0 right-0 border-2 border-white shadow-sm"
                loading="lazy"
              />
            )}
            {/* Overlay count for more images */}
            {(slide.catalog?.images?.length || 0) > 2 && (
              <div className="absolute -bottom-1 -right-1 bg-black bg-opacity-70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                +{(slide.catalog?.images?.length || 0) - 2}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1 truncate">
              {slide.catalog?.name || "Catalog Name"}
            </h4>
            <p className="text-gray-600 text-xs">
              {slide.catalog?.product_count || "0"} products
            </p>
          </div>
        </div>
        {/* View catalog button */}
        <button
          className="bg-black text-white px-4 py-2 rounded-lg font-medium text-xs transition-colors duration-200 flex-shrink-0 whitespace-nowrap"
          onClick={() => console.log('View catalog:', slide.catalog)}
        >
          View Catalog
        </button>
      </div>
    );

    const renderRowContent = (slide: BannerType) => {
      switch (slide.rowType) {
        case 'seller':
          return renderSellerRow(slide);
        case 'catalog':
          return renderCatalogRow(slide);
        case 'product':
        default:
          return renderProductRow(slide);
      }
    };

    return (
      <div className="w-full">
        <div
          ref={carouselRef}
          className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory py-2"
          style={{
            scrollPaddingLeft: "8px",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
          onScroll={handleCarouselScroll}
        >
          <div className="flex gap-4 pl-2">
            {slidesToShow.map((slide, index) => (
              <div
                key={`carousel-${slide.id}-${index}`}
                className="flex-shrink-0 relative snap-start"
                style={{ 
                  scrollSnapAlign: 'start',
                  width: 'calc(100vw - 60px)'
                }}
              >
                {/* Fixed 2:1 aspect ratio container */}
                <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
                  {slide.type === "video" ? (
                    <video
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover rounded-2xl"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement;
                        const durationMs = video.duration * 1000;
                        handleVideoDurationChange(index, durationMs);
                      }}
                    />
                  ) : slide.image.startsWith('linear-gradient') || slide.image.startsWith('from-') || slide.image.includes('gradient') ? (
                    <div
                      className={`w-full h-full rounded-2xl ${slide.image}`}
                      aria-label={slide.alt}
                    />
                  ) : (
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover rounded-2xl"
                      loading="lazy"
                    />
                  )}

                  {/* Content overlay */}
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                      {slide.title && (
                        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                          {slide.title}
                        </h3>
                      )}
                      {slide.subtitle && (
                        <p className="text-white/80 text-sm line-clamp-2">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Dynamic row below the carousel item - conditionally rendered */}
                {showCarouselBottomRow && (
                  <div className="mt-2">
                    {renderRowContent(slide)}
                  </div>
                )}
              </div>
            ))}

            {/* Add right spacing for proper scrolling to the end */}
            <div className="flex-shrink-0 w-2"></div>
          </div>
        </div>
      </div>
    );
  }, [slidesToShow, handleCarouselScroll, handleVideoDurationChange, showCarouselBottomRow]);

  // In HeroBanner.tsx - restructure the return statement
  return (
    <>
      <div
        ref={heroBannerRef}
        data-testid="hero-banner"
        className={`relative overflow-hidden w-full ${asCarousel ? '' : ''}`}
        style={{ marginTop: asCarousel ? 0 : offset }}
      >
        {asCarousel ? (
          CarouselBanners
        ) : (
          <>
            {/* Main banner content with fixed 2:1 aspect ratio */}
            <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
              <BannerSlides 
                slides={slidesToShow}
                activeIndex={activeIndex}
                previousIndex={previousIndex}
                onVideoDurationChange={handleVideoDurationChange}
              />
              <BannerControls
                slidesCount={slidesToShow.length}
                activeIndex={activeIndex}
                previousIndex={previousIndex}
                setActiveIndex={setActiveIndex}
                setPreviousIndex={setPreviousIndex}
                progress={progress}
              />
            </div>

            {/* NewsTicker/FilterBar positioned below the banner content */}
            <div className="relative z-10">
              {showNews ? (
                <NewsTicker />
              ) : (
                <ProductFilterBar 
                  filterCategories={filterCategories}
                  selectedFilters={selectedFilters}
                  onFilterSelect={onFilterSelect}
                  onFilterClear={onFilterClear}
                  onClearAll={onClearAll}
                  onFilterButtonClick={onFilterButtonClick}
                  isFilterDisabled={isFilterDisabled}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Video only in non-carousel mode */}
      {!asCarousel && showFloatingVideo && currentSlide && currentSlide.type === "video" && (
        <FloatingVideo
          src={currentSlide.image}
          alt={currentSlide.alt}
          isVisible={showFloatingVideo}
          onClose={handleCloseFloatingVideo}
          onExpand={handleExpandFloatingVideo}
          currentTime={videoCurrentTime}
          headerOffset={offset}
        />
      )}
    </>
  );
}

// Add this export at the end of HeroBanner.tsx
export { default as ProductFilterBar } from './ProductFilterBar';