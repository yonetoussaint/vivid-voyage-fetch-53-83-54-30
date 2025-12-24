import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs from "@/components/FilterTabs";
import { useWomenFashionFilters, useWomenFashionData } from "@/hooks/women.hooks";

interface WomenPageProps {
  category?: string;
}

const WomenPage: React.FC<WomenPageProps> = ({ category = 'women' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Use custom hooks
  const {
    filters,
    setFilters,
    womenFashionTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  } = useWomenFashionFilters();

  const {
    womenFashionChannels,
    getSubcategoryFilters,
  } = useWomenFashionData();

  // Create safe filters for InfiniteContentGrid
  const safeFilters = useMemo(() => {
    // Convert WomenFashionFilters to FilterState expected by InfiniteContentGrid
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
      size: filters.size,
      color: filters.color,
      material: filters.material,
      occasion: filters.occasion,
      sustainable: filters.sustainable,
      plusSize: filters.plusSize,
    };
  }, [filters]);

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);

    // Apply subcategory-specific filters
    const subcategoryFilters = getSubcategoryFilters(channelId);
    setFilters(prev => ({
      ...prev,
      ...subcategoryFilters
    }));
  };

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  const components = [
    <div key="favourite-channels-wrapper" className="pt-2">
      <FavouriteChannels 
        channels={womenFashionChannels}
        activeChannel={activeSubcategory}
        onChannelSelect={handleSubcategorySelect}
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
        category="women"
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs
        tabs={womenFashionTabs}
        activeFilters={activeFilters}
        onTabChange={handleTabChange}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    </div>,

    <div key="infinite-grid-wrapper" className="pt-2">
      <InfiniteContentGrid 
        category={activeSubcategory === 'all' ? activeCategory : activeSubcategory} 
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

export default WomenPage;