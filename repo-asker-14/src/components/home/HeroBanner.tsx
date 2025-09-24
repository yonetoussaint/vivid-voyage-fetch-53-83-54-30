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

interface HeroBannerProps {
  asCarousel?: boolean;
}

export default function HeroBanner({ asCarousel = false }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [showNews, setShowNews] = useState(true);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const [videoDurations, setVideoDurations] = useState<{[key: number]: number}>({});
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      setOffset(header ? header.offsetHeight : 0);
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // Initialize storage buckets if needed
  useEffect(() => {
    const initStorage = async () => {
      await setupStorageBuckets();
      console.log('Storage buckets initialized');
    };
    initStorage();
  }, []);

  // Fetch banners from Supabase
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 10000,
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
  const transformedBanners: BannerType[] = useMemo(() => banners?.map((banner, index) => {
    const decodedUrl = decodeURIComponent(banner.image);
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(decodedUrl) || 
                    /\.(mp4|webm|ogg|mov|avi)$/i.test(banner.image);

    console.log(`Banner ${banner.id}: ${banner.image} -> isVideo: ${isVideo}`);

    const mockSeller = index < 2 ? {
      id: `seller_${index + 1}`,
      name: index === 0 ? "TechStore Pro" : "FashionHub",
      image_url: index === 0 ? "tech-store-logo.png" : "fashion-hub-logo.png",
      verified: true,
      followers_count: index === 0 ? 25400 : 18200
    } : undefined;

    return {
      ...banner,
      type: isVideo ? "video" as const : "image" as const,
      duration: banner.duration || (isVideo ? 10000 : 5000),
      seller: mockSeller
    };
  }) || [], [banners]);

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
    return (
      <div className="w-full">
        <div
          ref={carouselRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory py-6"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
          onScroll={handleCarouselScroll}
        >
          <div className="flex"></div>
          {slidesToShow.map((slide, index) => (
            <div
              key={`carousel-${slide.id}-${index}`}
              className="flex-shrink-0 relative snap-start w-full"
              style={{ 
                scrollSnapAlign: 'start'
              }}
            >
              {slide.type === "video" ? (
                <video
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
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
              ) : (
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                />
              )}

              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl pointer-events-none" />

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

              {/* Seller info for carousel */}
              {slide.seller && (
                <div className="absolute top-4 left-4 pointer-events-auto">
                  <div 
                    className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg cursor-pointer hover:bg-white transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Seller clicked:', slide.seller);
                    }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {slide.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {slide.seller.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {slide.seller.followers_count.toLocaleString()} followers
                      </p>
                    </div>
                    {slide.seller.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }, [slidesToShow, handleCarouselScroll, handleVideoDurationChange]);


  return (
    <>
      <div
        ref={heroBannerRef}
        className={`relative overflow-hidden w-full ${asCarousel ? '' : ''}`}
        style={{ marginTop: asCarousel ? 0 : offset }}
      >
        {asCarousel ? (
          CarouselBanners
        ) : (
          <>
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

            {/* Seller Info Overlay */}
            {currentSlide?.seller && (
              <SellerInfoOverlay
                seller={currentSlide.seller}
                onSellerClick={() => {
                  console.log('Seller clicked:', currentSlide.seller);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* News ticker only shows in non-carousel mode */}
      {!asCarousel && showNews && <NewsTicker />}

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