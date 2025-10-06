import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import SpaceSavingCategories from "@/components/home/SpaceSavingCategories";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";

import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShoppingBag,
  Shirt,
  Baby,
  Home,
  Dumbbell,
  Sparkles,
  Car,
  Play,
  BookOpen,
  Gamepad2,
  Watch,
  Headphones,
  Camera,
  Laptop,
  Coffee,
  Clock
} from "lucide-react";
import { useLocation } from 'react-router-dom';

interface ForYouContentProps {
  category: string;
}

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for filter functionality
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Header filter context for news ticker functionality
  const {
    setHeaderMode,
    headerMode
  } = useHeaderFilter();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  // Scroll detection refs
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const newsTickerRef = useRef<HTMLDivElement>(null);

  // Define filter categories
  const filterCategories = [
    {
      id: 'category',
      label: 'Category',
      options: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Kids']
    },
    {
      id: 'price',
      label: 'Price Range',
      options: ['Under $25', '$25-$50', '$50-$100', '$100-$200', 'Over $200']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['4+ Stars', '3+ Stars', '2+ Stars', 'Any Rating']
    },
    {
      id: 'shipping',
      label: 'Shipping',
      options: ['Free Shipping', 'Fast Delivery', 'Local Seller']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']
    }
  ];

  // Filter handler functions
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterId]: option }));
    console.log('Filter selected:', filterId, option);
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      console.log('Filter cleared:', filterId);
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    console.log('All filters cleared');
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  const isFilterDisabled = (filterId: string) => {
    return false;
  };

  // Custom handler function
  const yourCustomHandler = () => {
    navigate('/reels');
  };

  // Improved scroll detection for header mode switching
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - scrollY.current;

          // Get header element
          const header = document.getElementById("ali-header");
          if (!header) return;

          const headerHeight = header.getBoundingClientRect().height;

          // Find the news ticker element in the hero banner
          const newsTicker = document.querySelector('.news-ticker');

          if (newsTicker) {
            const newsTickerRect = newsTicker.getBoundingClientRect();

            // Calculate when news ticker reaches the bottom of the header
            const newsTickerTopRelativeToHeader = newsTickerRect.top - headerHeight;

            // More precise timing: switch to news when news ticker is about to be covered by header
            const shouldShowNews = newsTickerTopRelativeToHeader <= 0;

            // Determine scroll direction with threshold to prevent jitter
            const scrollThreshold = 2; // pixels
            const isScrollingDown = scrollDelta > scrollThreshold;
            const isScrollingUp = scrollDelta < -scrollThreshold;

            // Smart switching logic
            if (shouldShowNews && isScrollingDown) {
              // Scrolling down and news ticker is passing header - show news
              setHeaderMode('news');
            } else if (isScrollingUp) {
              // Any significant scroll up - immediately show categories
              setHeaderMode('categories');
            } else if (currentScrollY <= headerHeight) {
              // Near top of page - always show categories
              setHeaderMode('categories');
            }

            console.log('Scroll detection:', {
              currentScrollY,
              scrollDelta,
              shouldShowNews,
              headerMode,
              newsTickerTop: newsTickerRect.top,
              headerHeight
            });
          }

          scrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setHeaderMode, headerMode]);

  // Reset to categories when component unmounts
  useEffect(() => {
    return () => {
      setHeaderMode('categories');
    };
  }, [setHeaderMode]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Define different posts for different sections
  const techPost = {
    id: 1,
    vendorData: {
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      vendorName: "Tech Store Pro",
      verified: true,
      followers: "12.5K",
      publishedAt: "2024-01-15T10:30:00Z"
    },
    title: "Latest Tech Deals",
    postDescription: "Check out our amazing deals on the latest gadgets! Perfect for tech enthusiasts and professionals.",
    displayProducts: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
        discount: "20%",
        currentPrice: "$299",
        originalPrice: "$399"
      }
    ],
    likeCount: 245,
    commentCount: 32,
    shareCount: 18
  };

  const fashionPost = {
    id: 2,
    vendorData: {
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      vendorName: "Fashion Forward",
      verified: true,
      followers: "8.3K",
      publishedAt: "2024-01-14T15:45:00Z"
    },
    title: "Summer Collection 2024",
    postDescription: "Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits.",
    displayProducts: [
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        discount: "30%",
        currentPrice: "$79",
        originalPrice: "$115"
      }
    ],
    likeCount: 189,
    commentCount: 24,
    shareCount: 11
  };

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Traditional component layout - each shows only once */}
      <div className="space-y-2">

        {/* Hero Banner with news ticker */}
        <div ref={heroBannerRef}>
          <HeroBanner 
            showNewsTicker={true}
          />
        </div>

        <SpaceSavingCategories/>

        <FlashDeals
          showCountdown={true}
        />
        <MobileOptimizedReels 
          showCustomButton={true}
          customButtonText="Watch All"
          customButtonIcon={Play}
          onCustomButtonClick={yourCustomHandler}
        />
        <FlashDeals 
          title="SPONSORED DEALS"
          icon={Clock}
        />

        {products && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}

        <FlashDeals 
          title="RECENTLY VIEWED"
          icon={Clock}
        />

        <TopVendorsCompact />

        <TopVendorsCompact 
          title="TOP PICK UP STATIONS"
          showProducts={false}
          viewAllLink="/pickup-stations"
          isPickupStation={true}
        />

        {/* First Vendor Post */}
        <VendorProductCarousel
          title="Tech Deals"
          products={products?.slice(0, 5) || []}
          posts={[techPost]}
        />

        <FlashDeals 
          title="NEW ARRIVALS"
          icon={Clock}
        />

        {products && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}

        <FlashDeals 
          title="BESTSELLERS"
          icon={Clock}
        />

        {/* Second Vendor Post */}
        <VendorProductCarousel
          title="Fashion Trends"
          products={products?.slice(5, 10) || []}
          posts={[fashionPost]}
        />

        <FlashDeals 
          title="TODAY'S DEALS"
          icon={Clock}
        />

        <MobileOptimizedReels />

        <FlashDeals 
          title="TRENDING NOW"
          icon={Clock}
        />

        <HeroBanner asCarousel={true} />

        <FlashDeals 
          title="STAFF PICKS"
          icon={Clock}
        />

        {/* Third Vendor Post (uses default post) */}
        <VendorProductCarousel
          title="Home Essentials"
          products={products?.slice(10, 15) || []}
        />

        <MobileOptimizedReels 
          title="LIVE NOW"
          viewAllLink="/trending"
          isLive={true}
        />

        <FlashDeals 
          title="STAFF PICKS"
          icon={Clock}
        />
      </div>
    </PageContainer>
  );
};

export default function Index() {
  const [activeCategory, setActiveCategory] = useState('recommendations');

  // Listen for category changes from header
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      console.log('Category changed to:', event.detail.category);
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ForYouContent category={activeCategory} />
      </motion.div>
    </AnimatePresence>
  );
}