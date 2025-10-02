import React from "react";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import FlashDeals from "@/components/home/FlashDeals";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import HeroBanner from "@/components/home/HeroBanner";

interface GenreFlashDealsProps {
  productType?: string;
  excludeTypes?: string[];
  className?: string;
}

export default function BookGenreFlashDeals({ 
  productType = undefined,
  excludeTypes = [],
  className = ''
}: GenreFlashDealsProps) {
  const [displayCount, setDisplayCount] = useState(8);

  // Fetch ALL products without any filtering
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => fetchAllProducts(),
    refetchInterval: 5 * 60 * 1000,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!allProducts || allProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const latestFlashStart = allProducts.reduce((latest, product) => {
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
  }, [allProducts]);

  // Process ALL products without any filtering
  const processedProducts = allProducts.map(product => {
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

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= processedProducts.length) return;

      // Only handle vertical scrolling (window/document scroll)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, processedProducts.length));
      }
    };

    // Only listen to window scroll events, not all scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, processedProducts.length]);

  // Reset display count when products change
  useEffect(() => {
    setDisplayCount(8);
  }, [processedProducts.length]);

  // Memoize rotating components to prevent re-creation on every render
  const rotatingComponents = React.useMemo(() => [
    React.memo((props) => <SuperDealsSection {...props} />),
    React.memo((props) => <FlashDeals {...props} />), 
    React.memo((props) => <VendorProductCarousel {...props} />),
    React.memo((props) => <TopVendorsCompact {...props} />),
    React.memo((props) => <MobileOptimizedReels {...props} />),
    React.memo(() => <HeroBanner />)
  ], []);

  // Create chunks of products with rotating components inserted after every 5 rows (10 products)
  const createProductsWithReels = () => {
    const productsToShow = processedProducts.slice(0, displayCount);
    const elements = [];
    const chunkSize = 10; // 5 rows × 2 columns = 10 products

    for (let i = 0; i < productsToShow.length; i += chunkSize) {
      const chunk = productsToShow.slice(i, i + chunkSize);

      // Add products chunk
      elements.push(
        <div key={`products-${i}`} className="grid grid-cols-2 gap-2">
          {chunk.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <Link 
                to={`/product/${product.id}`}
                onClick={() => trackProductView(product.id)}
                className="block"
              >
                {/* Fixed 1:1 aspect ratio container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    style={{ 
                      objectFit: 'cover',
                      aspectRatio: '1/1'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/300x300?text=No+Image";
                    }}
                  />

                  {/* Discount badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm z-10">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  {/* Timer overlay */}
                  {timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs flex items-center justify-center py-3 gap-1 z-10">
                      <Timer className="w-3 h-3" />
                      <span className="font-mono">
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                          <span key={i}>
                            {unit.toString().padStart(2, "0")}
                            {i < 2 && <span className="mx-0.5">:</span>}
                          </span>
                        ))}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Product info */}
                <div className="p-3 space-y-2">
                  <h4 className="text-sm font-medium line-clamp-2 text-gray-900 leading-tight">
                    {product.name}
                  </h4>

                  <div className="flex items-baseline gap-2">
                    <span className="text-red-600 font-bold text-base">
                      ${Number(product.discount_price || product.price).toFixed(2)}
                    </span>
                    {product.discount_price && (
                      <span className="text-xs text-gray-400 line-through">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {product.stock} in stock
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        Save ${(product.price - (product.discount_price || product.price)).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );

      // Add rotating component after each chunk (except the last one if it's incomplete)
      if (i + chunkSize < productsToShow.length) {
        const componentIndex = Math.floor(i / chunkSize) % rotatingComponents.length;
        const RotatingComponent = rotatingComponents[componentIndex];

        // Debug: Log products being passed
        console.log('Passing products to rotating component:', processedProducts.length, 'products');
        console.log('Products with discount_price:', processedProducts.filter(p => p.discount_price !== null).length);
        console.log('Products with images:', processedProducts.filter(p => p.product_images?.length > 0).length);

        elements.push(
          <div key={`rotating-component-${i}`} className="-mx-2 mb-8">
            <RotatingComponent products={processedProducts} />
          </div>
        );
      }
    }

    return elements;
  };

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="px-2 py-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div className="space-y-6">
            {createProductsWithReels()}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium">No products available</div>
            <div className="text-sm mt-1">Check back later for new deals</div>
          </div>
        )}
      </div>
    </div>
  );
}