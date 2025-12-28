import { Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { fetchFlashDeals, trackProductView } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";
import { useNavigate } from "react-router-dom";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { ProductCard } from "@/components/ProductCard";

interface FlashDealsProps {
  productType?: string;
  title?: string;
  icon?: React.ComponentType<any> | string;
  customCountdown?: string;
  showCountdown?: boolean;
  maxProducts?: number;
  showSectionHeader?: boolean;
  showStackedProfiles?: boolean;
  stackedProfiles?: Array<{ id: string; image: string; alt?: string }>;
  onProfileClick?: (profileId: string) => void;
  stackedProfilesText?: string;
  showTitleChevron?: boolean;
  onTitleClick?: () => void;
  showSponsorCount?: boolean;
  maxProfiles?: number;
}

// Skeleton Component for carousel only
const FlashDealsSkeleton: React.FC<{ 
  showSectionHeader: boolean;
  productType?: string;
  maxProducts?: number;
}> = ({ showSectionHeader, productType, maxProducts = 20 }) => {
  const skeletonCount = Math.min(8, maxProducts);

  return (
    <div className="w-full bg-white">
      {/* Section Header Skeleton */}
      {showSectionHeader && (
        <div className="flex items-center justify-between px-2 py-0 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
        </div>
      )}

      {/* Products Skeleton */}
      <div className="pl-2 flex overflow-x-hidden">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div 
            key={index} 
            className="w-[calc(100%/3.5)] flex-shrink-0 mr-[3vw]"
            style={{ maxWidth: '160px' }}
          >
            <div className={`${productType === 'books' ? 'aspect-[1.6:1]' : 'aspect-square'} bg-gray-200 animate-pulse rounded-md mb-1.5`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to render tags for ProductCard
const renderTag = (tag: string) => {
  const cleanTag = tag.replace(/\+/g, ' ');
  return (
    <span 
      key={tag} 
      className="inline-block bg-[#FF4747] text-white text-[8px] px-1 py-0.5 mr-0.5 rounded-sm font-medium"
    >
      {cleanTag}
    </span>
  );
};

export default function FlashDeals({ 
  productType, 
  title = "FLASH DEALS", 
  icon: Icon = Zap,
  customCountdown,
  showCountdown,
  maxProducts = 20,
  showSectionHeader = true,
  showStackedProfiles = false,
  stackedProfiles = [],
  onProfileClick,
  stackedProfilesText = "Handpicked by",
  showTitleChevron = false,
  onTitleClick,
  showSponsorCount = false,
  maxProfiles = 3
}: FlashDealsProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { setHasActiveOverlay } = useScreenOverlay();

  const { data: flashProducts = [], isLoading } = useQuery({
    queryKey: ['flash-deals', productType, maxProducts],
    queryFn: () => fetchFlashDeals(undefined, productType, maxProducts),
    refetchInterval: 5 * 60 * 1000,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!flashProducts || flashProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const latestFlashStart = flashProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000);
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [flashProducts]);

  const processedProducts = flashProducts
    .slice(0, maxProducts)
    .map(product => {
      const discountPercentage = product.discount_price 
        ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
        : 0;

      return {
        ...product,
        discountPercentage,
        stock: product.inventory ?? 0,
        image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
      };
    });

  const handleProductClick = (productId: string) => {
    trackProductView(productId);
    navigate(`/product/${productId}`);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <FlashDealsSkeleton 
        showSectionHeader={showSectionHeader}
        productType={productType}
        maxProducts={maxProducts}
      />
    );
  }

  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  const displayCountdown = customCountdown || 
    `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`;

  const shouldShowCountdown = showCountdown !== undefined 
    ? showCountdown 
    : (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0);

  return (
    <div className="w-full bg-white">
      {/* Section Header */}
      {showSectionHeader && (
        <SectionHeader
          title={title}
          icon={Icon}
          showCountdown={shouldShowCountdown}
          countdown={displayCountdown}
          viewAllLink="/search?category=flash-deals"
          viewAllText="View All"
          showStackedProfiles={showStackedProfiles}
          stackedProfiles={stackedProfiles}
          onProfileClick={onProfileClick}
          stackedProfilesText={stackedProfilesText}
          maxProfiles={maxProfiles}
          showTitleChevron={showTitleChevron}
          onTitleClick={onTitleClick}
          showSponsorCount={showSponsorCount}
        />
      )}

      {/* Carousel with ProductCard */}
      <div className="relative">
        {processedProducts.length > 0 ? (
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollPaddingLeft: "8px",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            <div className="flex pl-2">
              {processedProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[calc(100%/3.5)] flex-shrink-0 snap-start mr-[3vw]"
                  style={{ 
                    maxWidth: '160px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    className="cursor-pointer"
                  >
                    {/* Use ProductCard component */}
                    <ProductCard 
                      product={product}
                      renderTag={renderTag}
                    />
                    
                    {/* Stock indicator for non-book products */}
                    {productType !== 'books' && product.stock > 0 && (
                      <div className="absolute top-0 left-0 bg-[#FF4747] text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                        {product.stock} left
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-2"></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No flash deals available
          </div>
        )}
      </div>
    </div>
  );
}