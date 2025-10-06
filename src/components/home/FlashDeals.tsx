import { Timer, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { fetchFlashDeals, trackProductView } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";
import ProductSemiPanel from "./ProductSemiPanel";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";

interface FlashDealsProps {
  productType?: string;
  title?: string;
  icon?: React.ComponentType<any>;
  customCountdown?: string; // Custom countdown value
  showCountdown?: boolean; // Force show/hide
  maxProducts?: number; // Add max products prop
  layoutMode?: 'carousel' | 'grid'; // Add layout mode prop
  showSectionHeader?: boolean; // Option to hide section header
}

export default function FlashDeals({ 
  productType, 
  title = "FLASH DEALS", 
  icon = Zap,
  customCountdown,
  showCountdown,
  maxProducts = 20, // Default to 20 products
  layoutMode = 'carousel', // Default to carousel mode
  showSectionHeader = true // Default to show section header
}: FlashDealsProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const { setHasActiveOverlay } = useScreenOverlay();

  // State for managing the semi panel
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { data: flashProducts = [], isLoading } = useQuery({
    queryKey: ['flash-deals', productType, maxProducts],
    queryFn: () => fetchFlashDeals(undefined, productType, maxProducts), // Pass maxProducts to API
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!flashProducts || flashProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      // Get the most recent flash deal start time
      const latestFlashStart = flashProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000); // 24 hours later
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

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [flashProducts]);

  // Handle panel open/close to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isPanelOpen);
  }, [isPanelOpen, setHasActiveOverlay]);

  // Calculate discount percentage and real inventory for display
  // Limit to maxProducts in case API returns more
  const processedProducts = flashProducts
    .slice(0, maxProducts)
    .map(product => {
      const discountPercentage = product.discount_price 
        ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
        : 0;

      return {
        ...product,
        discountPercentage,
        stock: product.inventory ?? 0,  // Real stock from database
        image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
      };
    });

  // Handle product click to open semi panel
  const handleProductClick = (productId: string) => {
    trackProductView(productId);
    setSelectedProductId(productId);
    setIsPanelOpen(true);
  };

  // Handle closing the semi panel
  const handleCloseSemiPanel = () => {
    setIsPanelOpen(false);
    setSelectedProductId(null);
  };

  // Don't render the component if no products are available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  // Determine countdown display
  const displayCountdown = customCountdown || 
    `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`;

  const shouldShowCountdown = showCountdown !== undefined 
    ? showCountdown 
    : (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0);

  return (
    <>
      <div className="w-full bg-white">
        {showSectionHeader && (
          <SectionHeader
            title={title}
            icon={icon}
            showCountdown={shouldShowCountdown}
            countdown={displayCountdown}
            viewAllLink="/search?category=flash-deals"
            viewAllText="View All"
          />
        )}

        <div className="relative">
          {isLoading ? (
            <div className={`${layoutMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'pl-2 flex overflow-x-hidden'}`}>
              {Array.from({ length: Math.min(8, maxProducts) }).map((_, index) => (
                <div 
                  key={index} 
                  className={`${layoutMode === 'grid' ? 'w-full' : 'w-[calc(100%/3.5)] flex-shrink-0 mr-2'}`}
                >
                  <div className={`${productType === 'books' ? 'aspect-[1.6:1]' : 'aspect-square'} bg-gray-200 animate-pulse rounded-md mb-1.5`}></div>
                  <div className="h-3 w-3/4 bg-gray-200 animate-pulse mb-1"></div>
                  <div className="h-2 w-1/2 bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : processedProducts.length > 0 ? (
            layoutMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-4 px-4">
                {processedProducts.map((product) => (
                  <div key={product.id} className="flex flex-col items-center">
                    <div 
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer w-full"
                    >
                      <div className={`relative ${productType === 'books' ? 'aspect-[1.6:1]' : 'aspect-square'} overflow-hidden bg-gray-50 rounded-md mb-1.5`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {productType !== 'books' && (
                          <div className="absolute top-0 left-0 bg-[#FF4747] text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                            {product.stock} left
                          </div>
                        )}
                        {productType !== 'books' && (
                          <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] flex justify-center py-0.5">
                            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                              <span key={i} className="mx-0.5">
                                <span>{unit.toString().padStart(2, "0")}</span>
                                {i < 2 && <span className="mx-0.5">:</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-[#FF4747] font-semibold text-sm">
                            ${Number(product.discount_price || product.price).toFixed(2)}
                          </div>
                          {product.discount_price && (
                            <div className="text-[10px] text-gray-500 line-through">
                              ${Number(product.price).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-800 mt-1">{product.name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                        <div className={`relative ${productType === 'books' ? 'aspect-[1.6:1]' : 'aspect-square'} overflow-hidden bg-gray-50 rounded-md mb-1.5`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {productType !== 'books' && (
                            <div className="absolute top-0 left-0 bg-[#FF4747] text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                              {product.stock} left
                            </div>
                          )}
                          {productType !== 'books' && (
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] flex justify-center py-0.5">
                              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                                <span key={i} className="mx-0.5">
                                  <span>{unit.toString().padStart(2, "0")}</span>
                                  {i < 2 && <span className="mx-0.5">:</span>}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-1">
                            <div className="text-[#FF4747] font-semibold text-sm">
                              ${Number(product.discount_price || product.price).toFixed(2)}
                            </div>
                            {product.discount_price && (
                              <div className="text-[10px] text-gray-500 line-through">
                                ${Number(product.price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add right spacing for proper scrolling to the end */}
                  <div className="flex-shrink-0 w-2"></div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              No flash deals available
            </div>
          )}
        </div>
      </div>

      {/* Product Semi Panel */}
      <ProductSemiPanel
        productId={selectedProductId}
        isOpen={isPanelOpen}
        onClose={handleCloseSemiPanel}
      />
    </>
  );
}