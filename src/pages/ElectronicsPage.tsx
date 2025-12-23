import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs from "@/components/FilterTabs";
import { useElectronicsFilters, useElectronicsData } from "@/hooks/electronics.hooks";

interface ElectronicsPageProps {
  category?: string;
}

const ElectronicsPage: React.FC<ElectronicsPageProps> = ({ category = 'electronics' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Use custom hooks
  const {
    filters,
    setFilters,
    electronicsTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  } = useElectronicsFilters();

  const {
    electronicsChannels,
    getSubcategoryFilters,
  } = useElectronicsData();

  // Create safe filters to prevent priceRange errors
  const safeFilters = useMemo(() => {
    // Clone filters to avoid mutation
    const clonedFilters = { ...filters };
    
    // Ensure priceRange is valid if it exists
    if (clonedFilters.priceRange) {
      // Check if priceRange has min and max properties
      if (!clonedFilters.priceRange.min || !clonedFilters.priceRange.max) {
        // If invalid, set to null
        clonedFilters.priceRange = null;
      }
    }
    
    return clonedFilters;
  }, [filters]);

  // Create safe active filters to prevent errors
  const safeActiveFilters = useMemo(() => {
    return activeFilters.map(filter => {
      // Fix for priceRange filter display
      if (filter.id === 'priceRange' && filter.value) {
        const priceValue = filter.value as { min: number; max: number };
        return {
          ...filter,
          displayValue: `$${priceValue.min} - $${priceValue.max}`
        };
      }
      return filter;
    });
  }, [activeFilters]);

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
        channels={electronicsChannels}
        activeChannel={activeSubcategory}
        onChannelSelect={handleSubcategorySelect}
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
        category="electronics"
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs
        tabs={electronicsTabs}
        activeFilters={safeActiveFilters}
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

export default ElectronicsPage;