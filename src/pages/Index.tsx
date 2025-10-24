import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
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
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAuthOverlay } from "@/context/AuthOverlayContext";

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
    
    return (
      <VendorProductCarousel
        key={`vendor-${index}`}
        title="Featured Products"
        products={productSlice}
      />
    );
  };

  // Define all components to render with VendorProductCarousel after each
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
    
    <MobileOptimizedReels 
      key="reels-1"
      showCustomButton={true}
      onCustomButtonClick={yourCustomHandler}
    />,
    
    <FlashDeals 
      key="sponsored"
      title="SPONSORED DEALS"
      icon={Megaphone}
      showTitleChevron={true}
      showStackedProfiles={true}
      stackedProfiles={[
        { id: 'sponsor1', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop', alt: 'Brand A' },
        { id: 'sponsor2', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop', alt: 'Brand B' },
        { id: 'sponsor3', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&h=150&fit=crop', alt: 'Brand C' },
        { id: 'sponsor4', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=150&h=150&fit=crop', alt: 'Brand D' },
        { id: 'sponsor5', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=150&h=150&fit=crop', alt: 'Brand E' },
        { id: 'sponsor6', image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=150&h=150&fit=crop', alt: 'Brand F' },
        { id: 'sponsor7', image: 'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=150&h=150&fit=crop', alt: 'Brand G' },
        { id: 'sponsor8', image: 'https://images.unsplash.com/photo-1599305446868-59e861c82501?w=150&h=150&fit=crop', alt: 'Brand H' },
        { id: 'sponsor9', image: 'https://images.unsplash.com/photo-1611926653670-1f0bb1a72e1e?w=150&h=150&fit=crop', alt: 'Brand I' },
        { id: 'sponsor10', image: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=150&h=150&fit=crop', alt: 'Brand J' },
        { id: 'sponsor11', image: 'https://images.unsplash.com/photo-1635514569110-4b9e1f3e0b75?w=150&h=150&fit=crop', alt: 'Brand K' },
        { id: 'sponsor12', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop', alt: 'Brand L' }
      ]}
      onProfileClick={(profileId) => console.log('Sponsor clicked:', profileId)}
      stackedProfilesText="Partners"
      showSponsorCount={true}
    />,
    
    <FlashDeals
      key="editors"
      title="Editor's PICKS"
      showStackedProfiles={true}
      icon={Pin}
      showTitleChevron={true}
      stackedProfiles={[
        { id: '1', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', alt: 'Sarah Johnson' },
        { id: '2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', alt: 'Mike Chen' },
        { id: '3', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', alt: 'Emma Davis' },
        { id: '4', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', alt: 'Alex Turner' },
        { id: '5', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', alt: 'Lisa Wong' }
      ]}
      onProfileClick={(profileId) => console.log('Profile clicked:', profileId)}
      stackedProfilesText="Handpicked by"
      maxProfiles={3}
    />,
    
    products && products.length > 0 ? <SuperDealsSection key="super-1" products={products} /> : null,
    
    <FlashDeals 
      key="recent"
      title="RECENTLY VIEWED"
      icon={History}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=RECENTLY VIEWED')}
    />,
    
    <TopVendorsCompact 
      key="vendors"
      title="Top Vendors Today"
      icon={Trophy}
      showTitleChevron={true}
      showVerifiedSellers={true}
      verifiedIcon={ShieldCheck}
    />,
    
    <TopVendorsCompact 
      key="pickup"
      title="TOP PICK UP STATIONS"
      showProducts={false}
      viewAllLink="/pickup-stations"
      isPickupStation={true}
    />,
    
    <FlashDeals 
      key="new-arrivals"
      title="NEW ARRIVALS"
      icon={Clock}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=NEW ARRIVALS')}
    />,
    
    products && products.length > 0 ? <SuperDealsSection key="super-2" products={products} /> : null,
    
    <FlashDeals 
      key="bestsellers"
      title="BESTSELLERS"
      icon={Clock}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=BESTSELLERS')}
    />,
    
    <FlashDeals 
      key="today"
      title="TODAY'S DEALS"
      icon={Clock}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=TODAY\'S DEALS')}
    />,
    
    <MobileOptimizedReels key="reels-2" />,
    
    <FlashDeals 
      key="trending"
      title="TRENDING NOW"
      icon={Clock}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=TRENDING NOW')}
    />,
    
    <HeroBanner key="carousel" asCarousel={true} />,
    
    <FlashDeals 
      key="staff"
      title="STAFF PICKS"
      icon={Clock}
      showTitleChevron={true}
      onTitleClick={() => navigate('/products?title=STAFF PICKS')}
    />,
    
    <MobileOptimizedReels 
      key="live"
      title="LIVE NOW"
      viewAllLink="/trending"
      isLive={true}
    />
  ];

  return (
    <div className="overflow-hidden relative min-h-screen">
      <div className="space-y-2">
        {components.map((component, index) => (
          <React.Fragment key={`section-${index}`}>
            {component}
            {/* Show VendorProductCarousel after first FlashDeals (index 2) and then after every component */}
            {index >= 2 && renderVendorCarousel(index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default function Index() {
  const [activeCategory, setActiveCategory] = useState('recommendations');
  const { isAuthOverlayOpen, setIsAuthOverlayOpen } = useAuthOverlay();

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
      
      <AuthOverlay 
        isOpen={isAuthOverlayOpen} 
        onClose={() => setIsAuthOverlayOpen(false)} 
      />
    </>
  );
}