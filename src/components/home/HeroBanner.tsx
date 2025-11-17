import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerControls from './hero/BannerControls';
import NewsTicker from './hero/NewsTicker';
import FloatingVideo from '../hero/FloatingVideo';
import { BannerType } from './hero/types';
import ProductFilterBar from './ProductFilterBar';
import { supabase } from '@/integrations/supabase/client';
import { Edit2, Image, Plus, Volume2, VolumeX } from 'lucide-react';

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
  sellerId?: string;
  showEditButton?: boolean;
  onEditBanner?: () => void;
  editButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dataSource?: 'default' | 'seller_banners';
}

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

const defaultPlaceholderBanner: BannerType = {
  id: 'placeholder',
  image: '',
  alt: 'Add your banner',
  title: '',
  subtitle: '',
  type: 'color' as const,
  duration: 5000,
  rowType: 'product' as const,
  product: undefined,
  seller: undefined,
  catalog: undefined
};

// BannerImage component moved inline
interface BannerImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: "image" | "video";
  isActive?: boolean;
}

const BannerImage: React.FC<BannerImageProps> = ({
  src,
  alt,
  className = "",
  type = "image",
  isActive = false,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (videoRef.current && type === 'video') {
      if (isActive && loaded) {
        // Force autoplay with error handling
        const playVideo = async () => {
          try {
            videoRef.current!.currentTime = 0;
            await videoRef.current!.play();
          } catch (err) {
            console.log('Autoplay failed, trying with user interaction:', err);
            // If autoplay fails, we'll rely on the video's built-in controls
          }
        };
        playVideo();
      } else if (!isActive) {
        videoRef.current!.pause();
      }
    }
  }, [isActive, loaded, type]);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);

  const handleVideoLoaded = () => {
    setLoaded(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <div className="text-center p-4">
          <span className="text-gray-500 block">{type === "video" ? "Video" : "Image"} failed to load</span>
          <span className="text-xs text-gray-400 block mt-1">{src}</span>
        </div>
      </div>
    );
  }

  const baseClass = `w-full h-full ${className} ${
    !loaded ? "opacity-0" : "opacity-100 transition-opacity duration-300"
  }`;

  return type === "video" ? (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={src}
        className={`${baseClass} object-contain`}
        onLoadedData={handleVideoLoaded}
        onError={handleError}
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        autoPlay
      />
      {loaded && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors z-10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <img
        src={src}
        alt={alt}
        className={`${baseClass} object-contain`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

// BannerSlides component moved inline
interface BannerSlidesProps {
  slides: BannerType[];
  activeIndex: number;
  previousIndex: number | null;
}

const BannerSlides: React.FC<BannerSlidesProps> = ({ 
  slides, 
  activeIndex, 
  previousIndex,
}) => {
  return (
    <div className="relative w-full h-full">
      {slides.map((banner, index) => {
        const isActive = index === activeIndex;
        const isPrevious = index === previousIndex;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out ${
              isActive ? "translate-y-0 z-10" : 
              isPrevious ? "-translate-y-full z-0 hidden" : "translate-y-full z-0 hidden"
            }`}
          >
            {banner.type === 'color' || banner.image.startsWith('from-') || banner.image.includes('gradient') ? (
              <div className={`w-full h-full bg-gradient-to-r ${banner.image}`} />
            ) : (
              <BannerImage
                src={banner.image}
                alt={banner.alt || "Banner image"}
                type={banner.type} // "image" or "video"
                isActive={isActive}
                className="w-full h-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
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
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowNews(showNewsTicker);
  }, [showNewsTicker]);

  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      if (header) {
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

  useEffect(() => {
    const initStorage = async () => {
      await setupStorageBuckets();
    };
    initStorage();
  }, []);

  const { data: bannersData, isLoading: bannersLoading, error } = useQuery({
    queryKey: dataSource === 'seller_banners' 
      ? ["seller-banners", sellerId]
      : ["hero-banners"],
    queryFn: dataSource === 'seller_banners' && sellerId
      ? () => fetchSellerBanners(sellerId)
      : fetchHeroBanners,
    staleTime: dataSource === 'seller_banners' ? 30000 : 5000,
    refetchInterval: dataSource === 'seller_banners' ? 30000 : 10000,
    enabled: !customBanners,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  const transformedBanners: BannerType[] = useMemo(() => {
    if (customBanners) {
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

    if (dataSource === 'seller_banners' && bannersData) {
      if (bannersData.length === 0) {
        return [{
          ...defaultPlaceholderBanner,
          image: 'bg-gradient-to-br from-blue-50 to-indigo-100'
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

    if (bannersData && dataSource === 'default') {
      if (bannersData.length === 0) {
        return [{
          ...defaultPlaceholderBanner,
          image: 'bg-gray-100'
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
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
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
          // For videos, don't use duration - let the video handle its own timing
          duration: isVideo ? 0 : (banner.duration || 5000),
          rowType,
          seller: rowType === 'seller' ? mockSeller : undefined,
          catalog: rowType === 'catalog' ? mockCatalog : undefined,
          product: rowType === 'product' ? mockProduct : undefined
        };
      }) || [];
    }

    return [{
      ...defaultPlaceholderBanner,
      image: 'bg-gray-100'
    }];
  }, [bannersData, customBanners, dataSource]);

  const slidesToShow = transformedBanners;
  const isPlaceholder = slidesToShow.length === 1 && slidesToShow[0].id === 'placeholder';

  // Don't auto-advance slides if the current slide is a video
  const shouldAutoAdvance = useMemo(() => {
    const currentSlide = slidesToShow[activeIndex];
    return !asCarousel && slidesToShow.length > 1 && !isPlaceholder && currentSlide?.type !== 'video';
  }, [activeIndex, slidesToShow, asCarousel, isPlaceholder]);

  useEffect(() => {
    if (!shouldAutoAdvance) return;

    let timeoutRef: ReturnType<typeof setTimeout> | null = null;
    let progressIntervalRef: ReturnType<typeof setInterval> | null = null;

    const currentSlide = slidesToShow[activeIndex];
    const duration = currentSlide?.duration || 5000;
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
  }, [activeIndex, slidesToShow.length, shouldAutoAdvance, slidesToShow]);

  const handleCloseFloatingVideo = useCallback(() => {
    setShowFloatingVideo(false);
  }, []);

  const handleExpandFloatingVideo = useCallback(() => {
    setShowFloatingVideo(false);
    heroBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentSlide = slidesToShow[activeIndex];

  const handleCarouselScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Allow natural scrolling
  }, []);

  const EditButton = useMemo(() => {
    if (!showEditButton) return null;

    const positionClasses = {
      'top-right': 'top-3 right-3',
      'top-left': 'top-3 left-3',
      'bottom-right': 'bottom-3 right-3',
      'bottom-left': 'bottom-3 left-3'
    };

    return (
      <button
        onClick={onEditBanner}
        className={`absolute ${positionClasses[editButtonPosition]} bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white transition-all duration-200 shadow-lg z-20`}
        title="Edit Banner"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit</span>
      </button>
    );
  }, [showEditButton, onEditBanner, editButtonPosition]);

  const PlaceholderBanner = useMemo(() => {
    if (!isPlaceholder) return null;

    const isSellerBanner = dataSource === 'seller_banners';

    return (
      <div 
        className={`w-full flex items-center justify-center ${
          isSellerBanner 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-dashed border-blue-200' 
            : 'bg-gray-100 border border-dashed border-gray-300'
        }`}
        style={{ 
          aspectRatio: '2 / 1',
          maxHeight: '330px'
        }}
      >
        <div className="text-center p-4">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 ${
            isSellerBanner ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
          }`}>
            <Image className="w-5 h-5" />
          </div>

          <p className={`text-sm font-medium ${
            isSellerBanner ? 'text-blue-900' : 'text-gray-700'
          }`}>
            No banner available
          </p>
          <p className={`text-xs mt-1 ${
            isSellerBanner ? 'text-blue-700' : 'text-gray-600'
          }`}>
            Banner will appear here
          </p>
        </div>
      </div>
    );
  }, [isPlaceholder, dataSource]);

  return (
    <>
      <div
        ref={heroBannerRef}
        data-testid="hero-banner"
        className={`relative overflow-hidden w-full ${asCarousel ? '' : ''}`}
        style={{ marginTop: asCarousel ? 0 : offset }}
      >
        {asCarousel ? (
          <div>Carousel content...</div>
        ) : (
          <>
            <div 
              className="relative w-full bg-gray-100" 
              style={customHeight ? { 
                height: customHeight,
                aspectRatio: customHeight ? 'unset' : '2 / 1'
              } : { 
                aspectRatio: '2 / 1',
                maxHeight: '330px'
              }}
            >
              {isPlaceholder ? (
                <>
                  {PlaceholderBanner}
                  {EditButton}
                </>
              ) : (
                <>
                  <BannerSlides 
                    slides={slidesToShow}
                    activeIndex={activeIndex}
                    previousIndex={previousIndex}
                  />

                  {EditButton}

                  {/* Only show controls for non-video slides */}
                  {currentSlide?.type !== 'video' && (
                    <BannerControls
                      slidesCount={slidesToShow.length}
                      activeIndex={activeIndex}
                      previousIndex={previousIndex}
                      setActiveIndex={setActiveIndex}
                      setPreviousIndex={setPreviousIndex}
                      progress={progress}
                    />
                  )}
                </>
              )}
            </div>

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