import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerSlides from './hero/BannerSlides';
import BannerControls from './hero/BannerControls';
import NewsTicker from './hero/NewsTicker';
import FloatingVideo from '../hero/FloatingVideo';
import { BannerType } from './hero/types';
import ProductFilterBar from './ProductFilterBar';
import { supabase } from '@/integrations/supabase/client';
import { Edit2, Image, Plus } from 'lucide-react';

interface HeroBannerProps {
  asCarousel?: boolean;
  showNewsTicker?: boolean;
  showCarouselBottomRow?: boolean;
  customHeight?: string;
  customBanners?: Array<{
    id: string;
    image?: string;
    color?: string;
    alt: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video' | 'color';
    duration?: number;
  }>;
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
  // NEW PROPS: For seller banners and edit functionality
  sellerId?: string;
  showEditButton?: boolean;
  onEditBanner?: () => void;
  editButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  // Data source configuration
  dataSource?: 'default' | 'seller_banners';
}

// Function to fetch seller banners
const fetchSellerBanners = async (sellerId: string) => {
  if (!sellerId) return [];
  
  try {
    const { data, error } = await supabase
      .from('seller_banners')
      .select('*')
      .eq('seller_id', sellerId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching seller banners:', error);
    throw error;
  }
};

// Default placeholder banner
const defaultPlaceholderBanner: BannerType = {
  id: 'placeholder',
  image: '',
  alt: 'Add your first banner',
  title: 'Add Your Banner',
  subtitle: 'Click the edit button to customize your banner',
  type: 'color' as const,
  duration: 5000,
  rowType: 'product' as const,
  product: undefined,
  seller: undefined,
  catalog: undefined
};

export default function HeroBanner({ 
  asCarousel = false, 
  showNewsTicker = true,
  showCarouselBottomRow = true,
  customHeight,
  customBanners,
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled = () => false,
  // NEW PROPS with defaults
  sellerId,
  showEditButton = false,
  onEditBanner = () => {},
  editButtonPosition = 'top-right',
  dataSource = 'default'
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
        const computedStyle = window.getComputedStyle(header);
        const height = header.getBoundingClientRect().height;
        setOffset(Math.ceil(height));
      } else {
        setOffset(0);
      }
    }

    updateOffset();
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

  // Fetch banners based on data source
  const { data: bannersData, isLoading: bannersLoading, error } = useQuery({
    queryKey: dataSource === 'seller_banners' 
      ? ["seller-banners", sellerId]
      : ["hero-banners"],
    queryFn: dataSource === 'seller_banners' && sellerId
      ? () => fetchSellerBanners(sellerId)
      : fetchHeroBanners,
    staleTime: dataSource === 'seller_banners' ? 30000 : 5000,
    refetchInterval: dataSource === 'seller_banners' ? 30000 : 10000,
    enabled: !customBanners, // Disable if custom banners provided
  });

  // Show error if banner fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  // Transform banners to match BannerType interface based on data source
  const transformedBanners: BannerType[] = useMemo(() => {
    // If custom banners provided, use those
    if (customBanners) {
      console.log('Using custom banners');
      return customBanners.map((banner, index) => {
        const rowTypes: ('product' | 'seller' | 'catalog')[] = ['product', 'seller', 'catalog'];
        const rowType = rowTypes[index % 3] || 'product';

        return {
          ...banner,
          image: banner.image || banner.color || '',
          type: (banner.type || 'color') as 'image' | 'video' | 'color',
          duration: banner.duration || 5000,
          rowType,
          product: undefined,
          seller: undefined,
          catalog: undefined,
        };
      });
    }

    // If using seller banners data source
    if (dataSource === 'seller_banners' && bannersData) {
      console.log('Using seller banners:', bannersData);
      
      // If no seller banners, return placeholder
      if (bannersData.length === 0) {
        console.log('No seller banners found, using placeholder');
        return [{
          ...defaultPlaceholderBanner,
          // For seller banners, use a gradient placeholder
          image: 'bg-gradient-to-r from-blue-400 to-purple-500'
        }];
      }
      
      return bannersData.map((banner: any, index: number) => {
        const isImage = banner.type === 'image';
        
        return {
          id: banner.id,
          image: banner.value,
          alt: banner.name,
          title: banner.name,
          type: isImage ? "image" as const : "color" as const,
          duration: 5000,
          rowType: 'product' as const,
          product: undefined,
          seller: undefined,
          catalog: undefined
        };
      });
    }

    // Default banners (original behavior)
    if (bannersData && dataSource === 'default') {
      console.log('Using default banners');
      
      // If no default banners, return placeholder
      if (bannersData.length === 0) {
        console.log('No default banners found, using placeholder');
        return [{
          ...defaultPlaceholderBanner,
          image: 'bg-gradient-to-r from-gray-400 to-gray-600'
        }];
      }
      
      return bannersData.map((banner: any, index: number) => {
        const decodedUrl = decodeURIComponent(banner.image);
        const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(decodedUrl) || 
                        /\.(mp4|webm|ogg|mov|avi)$/i.test(banner.image);

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
    }

    // Fallback to placeholder
    console.log('No banners available, using fallback placeholder');
    return [{
      ...defaultPlaceholderBanner,
      image: 'bg-gradient-to-r from-gray-300 to-gray-400'
    }];
  }, [bannersData, customBanners, dataSource]);

  const slidesToShow = transformedBanners;
  const isPlaceholder = slidesToShow.length === 1 && slidesToShow[0].id === 'placeholder';

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

  // Banner rotation (disabled for carousel mode and placeholder)
  useEffect(() => {
    if (asCarousel || slidesToShow.length <= 1 || isPlaceholder) return;

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
  }, [activeIndex, slidesToShow.length, videoDurations, asCarousel, getCurrentSlideDuration, isPlaceholder]);

  // Edit Button Component
  const EditButton = useMemo(() => {
    if (!showEditButton) return null;

    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4'
    };

    return (
      <button
        onClick={onEditBanner}
        className={`absolute ${positionClasses[editButtonPosition]} bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white transition-all duration-200 shadow-lg z-20`}
        title="Edit Banner"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit</span>
      </button>
    );
  }, [showEditButton, onEditBanner, editButtonPosition]);

  // Placeholder Banner Component
  const PlaceholderBanner = useMemo(() => {
    if (!isPlaceholder) return null;

    const currentSlide = slidesToShow[activeIndex];
    
    return (
      <div 
        className={`w-full h-full flex items-center justify-center ${currentSlide.image} relative`}
        style={customHeight ? { height: customHeight } : { aspectRatio: '2 / 1' }}
      >
        <div className="text-center text-white p-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            {showEditButton ? (
              <Plus className="w-8 h-8" />
            ) : (
              <Image className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 drop-shadow-md">
            {currentSlide.title}
          </h3>
          <p className="text-white/90 drop-shadow-sm max-w-md mx-auto">
            {currentSlide.subtitle}
          </p>
          
          {showEditButton && (
            <button
              onClick={onEditBanner}
              className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Add Your First Banner
            </button>
          )}
        </div>
      </div>
    );
  }, [isPlaceholder, slidesToShow, activeIndex, customHeight, showEditButton, onEditBanner]);

  return (
    <>
      <div
        ref={heroBannerRef}
        data-testid="hero-banner"
        className={`relative overflow-hidden w-full ${asCarousel ? '' : ''}`}
        style={{ marginTop: asCarousel ? 0 : offset }}
      >
        {asCarousel ? (
          // Carousel rendering logic would go here
          <div>Carousel content...</div>
        ) : (
          <>
            {/* Main banner content */}
            <div 
              className="relative w-full" 
              style={customHeight ? { height: customHeight } : { aspectRatio: '2 / 1' }}
            >
              {isPlaceholder ? (
                <>
                  {PlaceholderBanner}
                  {/* Edit Button for placeholder */}
                  {EditButton}
                </>
              ) : (
                <>
                  <BannerSlides 
                    slides={slidesToShow}
                    activeIndex={activeIndex}
                    previousIndex={previousIndex}
                    onVideoDurationChange={handleVideoDurationChange}
                  />
                  
                  {/* Edit Button for regular banners */}
                  {EditButton}
                  
                  <BannerControls
                    slidesCount={slidesToShow.length}
                    activeIndex={activeIndex}
                    previousIndex={previousIndex}
                    setActiveIndex={setActiveIndex}
                    setPreviousIndex={setPreviousIndex}
                    progress={progress}
                  />
                </>
              )}
            </div>

            {/* NewsTicker/FilterBar */}
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

      {/* Floating Video - Disabled for placeholder */}
      {!asCarousel && !isPlaceholder && showFloatingVideo && currentSlide && currentSlide.type === "video" && (
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

export { default as ProductFilterBar } from './ProductFilterBar';