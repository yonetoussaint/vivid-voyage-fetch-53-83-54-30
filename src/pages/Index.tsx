comment out the vendor products carrousel component it's not available yet


import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import SpaceSavingCategories from "@/components/home/SpaceSavingCategories";
import Footer from "@/components/Footer";
import TopBrands from "@/components/home/TopBrands";
// import VendorProductCarousel from "@/components/home/VendorProductCarousel"; // Commented out - not available yet
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals"; // Import the new component
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { useAuth } from "@/contexts/auth/AuthContext";

import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShoppingBag,
  Shirt,
  Baby,
  Home,
  Megaphone,
  Dumbbell,
  Sparkles,
  Car,
  Trophy,
  Play,
  Pin,
  BookOpen,
  Gamepad2,
  Watch,
  Tag,
  Headphones,
  Camera,
  Laptop,
  Coffee,
  Clock,
  History,
  ShieldCheck
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

  // State for lazy loading carousel data
  const [visibleCarousels, setVisibleCarousels] = useState<Set<number>>(new Set([0, 1, 2])); // Load first 3

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

  // Intersection Observer for lazy loading carousels
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const carouselIndex = parseInt(entry.target.getAttribute('data-carousel-index') || '0');
            setVisibleCarousels(prev => new Set([...prev, carouselIndex, carouselIndex + 1])); // Preload next one
          }
        });
      },
      {
        rootMargin: '400px', // Start loading 400px before component enters viewport
        threshold: 0.01
      }
    );

    // Observe all carousel placeholders
    const placeholders = document.querySelectorAll('[data-carousel-placeholder]');
    placeholders.forEach(placeholder => observer.observe(placeholder));

    return () => observer.disconnect();
  }, []);

  // Helper function to render VendorProductCarousel with real data from database
  const renderVendorCarousel = (index: number) => {
    const productSlice = products?.slice((index * 5) % (products?.length || 20), ((index * 5) + 5) % (products?.length || 20)) || [];

    // Only render if this carousel index is visible or close to viewport
    if (!visibleCarousels.has(index)) {
      return (
        <div 
          key={`vendor-placeholder-${index}`}
          data-carousel-placeholder
          data-carousel-index={index}
          className="w-full h-96 bg-gray-50 animate-pulse"
        />
      );
    }

    // Commented out VendorProductCarousel since it's not available yet
    // return (
    //   <VendorProductCarousel
    //     key={`vendor-${index}`}
    //     title="Featured Products"
    //     products={productSlice}
    //   />
    // );

    // Return a placeholder or null instead
    return null;
  };

  // Define all components to render - simplified array with only available components
  const components = [
    <div key="hero" ref={heroBannerRef}>
      <HeroBanner showNewsTicker={true} />
    </div>,

    <SpaceSavingCategories key="categories" />,

    <FlashDeals
      key="flash-1"
      showCountdown={true}
      icon={Tag}
      showTitleChevron={true}
    />,

    // Book Genre Flash Deals - ADDED HERE
    <BookGenreFlashDeals
      key="book-genre-flash-deals"
      title="Popular Book Genres"
      subtitle="Discover books by genre"
      showFilters={true}
      showSummary={true}
      showSectionHeader={true}
      showCountdown={true}
      customCountdown="15:00:00:00" // Optional custom countdown
      icon={BookOpen} // Optional custom icon
      products={products} // Pass the fetched products
      className="mt-4" // Additional styling
      showVerifiedSellers={true}
      verifiedSellersText="Top Book Sellers"
      summaryMode="products"
      showExpiryTimer={true}
      expiryField="expiry"
      showMarketingMetrics={false}
      showStatusBadge={false}
    />,
  ];

  return (
    <div className="overflow-hidden relative min-h-screen">
      <div className="space-y-2">
        {components.map((component, index) => (
          <React.Fragment key={`section-${index}`}>
            {component}
            {/* Render vendor carousel only for the first 3 components (excluding BookGenreFlashDeals) */}
            {index < 2 && renderVendorCarousel(index)}
          </React.Fragment>
        ))}
      </div>

      {/* Add Footer at the bottom */}
      <Footer />
    </div>
  );
}; // <-- CORRECT closing brace position

const ForYou: React.FC = () => {
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
    <>
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
    </>
  );
};

export default ForYou;