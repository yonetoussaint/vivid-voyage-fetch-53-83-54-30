import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { fetchAllProducts } from "@/integrations/supabase/products";

import { PageContainer } from "@/components/layout/PageContainer";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import SpaceSavingCategories from "@/components/home/SpaceSavingCategories";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import ProductSemiPanel from "@/components/home/ProductSemiPanel";

import NewArrivals from "@/components/home/NewArrivals";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";

import { 
  Smartphone, 
  ShoppingBag, 
  Shirt, 
  Baby, 
  Home, 
  Dumbbell, 
  Sparkles, 
  Car, 
  BookOpen,
  Gamepad2,
  Watch,
  Headphones,
  Camera,
  Laptop,
  Coffee
} from "lucide-react";

// Component patterns for endless feed
const flashDealsCategories = [
  { title: "ELECTRONICS", icon: Smartphone },
  { title: "WOMEN'S FASHION", icon: ShoppingBag },
  { title: "MEN'S FASHION", icon: Shirt },
  { title: "KIDS & TOYS", icon: Baby },
  { title: "HOME & GARDEN", icon: Home },
  { title: "SPORTS & FITNESS", icon: Dumbbell },
  { title: "BEAUTY & HEALTH", icon: Sparkles },
  { title: "AUTOMOTIVE", icon: Car },
  { title: "BOOKS & MEDIA", icon: BookOpen },
  { title: "GAMING", icon: Gamepad2 },
  { title: "WATCHES", icon: Watch },
  { title: "AUDIO", icon: Headphones },
  { title: "PHOTOGRAPHY", icon: Camera },
  { title: "COMPUTERS", icon: Laptop },
  { title: "COFFEE & TEA", icon: Coffee },
];

const feedComponents = [
  'FlashDeals',
  'MobileOptimizedReels',
  'TopVendorsCompact',
  'NewArrivalsSection',
  'SuperDealsSection',
  'VendorProductCarousel',
  'SimpleFlashDeals',
  'PopularSearches',
  'TopBrands',
  'BenefitsBanner',
];

// Filter categories configuration for books
const filterCategories = [
  {
    id: 'genre',
    label: 'Genre',
    options: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History']
  },
  {
    id: 'format',
    label: 'Format',
    options: ['Paperback', 'Hardcover', 'E-book', 'Audiobook']
  },
  {
    id: 'price',
    label: 'Price',
    options: ['Under $10', '$10-$20', '$20-$30', '$30-$50', 'Over $50']
  },
  {
    id: 'condition',
    label: 'Condition',
    options: ['New', 'Like New', 'Good', 'Acceptable']
  },
  {
    id: 'shipping',
    label: 'Shipping',
    options: ['Free Shipping', 'Fast Delivery', 'Local Pickup']
  }
];

export default function BooksHomepage() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const { t } = useTranslation(['product', 'categories']);
  const {
    setShowFilterBar,
    setFilterCategories,
    setSelectedFilters: setContextSelectedFilters,
    setOnFilterSelect,
    setOnFilterClear,
    setOnClearAll,
    setOnFilterButtonClick,
    setIsFilterDisabled
  } = useHeaderFilter();

  const heroBannerRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  // Generate initial feed
  const generateFeedItems = useCallback((count: number, startIndex: number = 0) => {
    const items = [];

    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % feedComponents.length;
      const componentType = feedComponents[index];

      if (componentType === 'SimpleFlashDeals') {
        const categoryIndex = (startIndex + i) % flashDealsCategories.length;
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
          category: flashDealsCategories[categoryIndex],
        });
      } else {
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
        });
      }
    }

    return items;
  }, []);

  // Initialize feed immediately - don't wait for products
  useEffect(() => {
    setFeedItems(generateFeedItems(10, 0));
    setTimeout(() => {
      setIsContentReady(true);
    }, 800);
  }, [generateFeedItems]);

  // Setup filter context on mount
  useEffect(() => {
    setFilterCategories(filterCategories);
    setOnFilterSelect(() => handleFilterSelect);
    setOnFilterClear(() => handleFilterClear);
    setOnClearAll(() => handleClearAllFilters);
    setOnFilterButtonClick(() => handleFilterButtonClick);
    setIsFilterDisabled(() => isFilterDisabled);
  }, [setFilterCategories, setOnFilterSelect, setOnFilterClear, setOnClearAll, setOnFilterButtonClick, setIsFilterDisabled]);

  // Update context when selectedFilters change
  useEffect(() => {
    setContextSelectedFilters(selectedFilters);
  }, [selectedFilters, setContextSelectedFilters]);

  // Scroll-based detection for precise filter bar replacement
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          lastScrollY.current = currentScrollY;

          // Get header element and its height
          const header = document.getElementById("ali-header");
          if (!header) return;

          const headerHeight = header.getBoundingClientRect().height;

          // Find the filter bar in the hero banner
          const filterBar = heroBannerRef.current?.querySelector('.product-filter-bar');
          if (!filterBar) return;

          // Get the filter bar's position relative to the viewport
          const filterBarRect = filterBar.getBoundingClientRect();

          // Calculate if filter bar is being covered by header
          // Show header filter bar when hero filter bar's bottom edge reaches header bottom
          const shouldShowInHeader = filterBarRect.bottom <= headerHeight;

          // Update context state only if there's a change
          setShowFilterBar(shouldShowInHeader);

          ticking = false;
        });

        ticking = true;
      }
    };

    // Add scroll listener only after content is ready
    if (isContentReady) {
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Initial check
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isContentReady]);

  // Filter handlers
  const handleFilterSelect = useCallback((filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
    console.log('Filter selected:', filterId, option);
  }, []);

  const handleFilterClear = useCallback((filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
    console.log('Filter cleared:', filterId);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedFilters({});
    console.log('All filters cleared');
  }, []);

  const handleFilterButtonClick = useCallback((filterId: string) => {
    console.log('Filter button clicked:', filterId);
    // Handle filter button click (e.g., open dropdown)
  }, []);

  const isFilterDisabled = useCallback((filterId: string) => {
    // Example logic: disable price filter if no category is selected
    if (filterId === 'price' && !selectedFilters.genre) {
      return false; // Change to true to actually disable
    }
    return false;
  }, [selectedFilters]);

  // Handle product click to open semi panel
  const handleProductClick = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsPanelOpen(true);
  }, []);

  // Handle panel close
  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedProductId(null);
  }, []);

  // Render component based on type
  const renderFeedItem = (item: any) => {
    const { type, category, id } = item;

    switch (type) {
      case 'FlashDeals':
        return <FlashDeals 
          key={id} 
          productType="books" 
          showCountdown={true} 
          icon={BookOpen} 
        />;
      case 'MobileOptimizedReels':
        return <MobileOptimizedReels key={id} />;
      case 'TopVendorsCompact':
        return <TopVendorsCompact key={id} />;
      case 'NewArrivalsSection':
        return <NewArrivalsSection key={id} />;
      case 'SuperDealsSection':
        return products && products.length > 0 ? (
          <SuperDealsSection key={id} products={products} onProductClick={handleProductClick} />
        ) : (
          <div key={id} className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      case 'VendorProductCarousel':
        return products && products.length > 0 ? (
          <VendorProductCarousel 
            key={id}
            title={t('trending', { ns: 'product' })} 
            products={products.slice(0, 10)} 
            onProductClick={handleProductClick}
          />
        ) : (
          <div key={id} className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      case 'SimpleFlashDeals':
        return (
          <SimpleFlashDeals 
            key={id}
            title={category.title} 
            icon={category.icon}
          />
        );
      case 'PopularSearches':
        return <PopularSearches key={id} />;
      case 'TopBrands':
        return <TopBrands key={id} />;
      case 'BenefitsBanner':
        return <BenefitsBanner key={id} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Hero Banner with the ProductFilterBar integrated */}
      <div ref={heroBannerRef}>
        <HeroBanner 
          showNewsTicker={false}
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAllFilters}
          onFilterButtonClick={handleFilterButtonClick}
          isFilterDisabled={isFilterDisabled}
        />
      </div>

      {/* Endless feed content */}
      <div className="space-y-2">
        {feedItems.map(renderFeedItem)}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Product Semi Panel */}
      <ProductSemiPanel
        productId={selectedProductId}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </PageContainer>
  );
}