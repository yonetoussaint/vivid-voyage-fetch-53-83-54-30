import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs from "@/components/FilterTabs";
import HeroBanner from "@/components/home/HeroBanner";
import Footer from "@/components/Footer";
import { useMallFilters, useMallData } from "@/hooks/mall.hooks";

interface MallPageProps {
  category?: string;
}

const MallPage: React.FC<MallPageProps> = ({ category = 'mall' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Use custom hooks
  const {
    filters,
    setFilters,
    mallTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  } = useMallFilters();

  const {
    mallChannels,
    getSubcategoryFilters,
  } = useMallData();

  // Create safe filters for InfiniteContentGrid
  const safeFilters = useMemo(() => {
    return {
      priceRange: filters.priceRange,
      rating: filters.rating,
      freeShipping: filters.freeShipping,
      onSale: filters.onSale,
      freeReturns: filters.freeReturns,
      newArrivals: filters.newArrivals,
      shippedFrom: filters.shippedFrom,
      sortBy: filters.sortBy,
      // Add other filters as needed
      brand: filters.brand,
      category: filters.category,
      color: filters.color,
      sellerRating: filters.sellerRating,
      fastDispatch: filters.fastDispatch,
      discount: filters.discount,
      verifiedSeller: filters.verifiedSeller,
      mallExclusive: filters.mallExclusive,
    };
  }, [filters]);

  // Remove the handleSubcategorySelect function since channels are not selectable
  // Optional: If you want to keep some functionality but not selection, you can add a different handler
  const handleChannelClick = () => {
    // Optional: Add any other behavior when channels are clicked
    console.log('Channel clicked (non-selectable)');
  };

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  const components = [
    <div key="hero" className="mb-2">
      <HeroBanner showNewsTicker={true} />
    </div>,

    <div key="favourite-channels-wrapper" className="">
      <FavouriteChannels 
        channels={mallChannels}
        // Don't pass activeChannel prop to make them non-selectable
        onChannelSelect={handleChannelClick} // Optional: Still pass a handler if you want click feedback
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <div key="flash-deals-wrapper" className="mb-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
        category="mall"
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs
        tabs={mallTabs}
        activeFilters={activeFilters}
        onTabChange={handleTabChange}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    </div>,

    <div key="infinite-grid-wrapper" className="pt-2">
      <InfiniteContentGrid 
        category={activeCategory} // Just use the main category since subchannels aren't selectable
        filters={safeFilters} 
      />
    </div>,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="overflow-hidden relative">
          <div className="pb-2">
            {components.map((component, index) => (
              <React.Fragment key={`section-${index}`}>
                {component}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MallPage;