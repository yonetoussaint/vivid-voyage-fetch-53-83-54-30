import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs from "@/components/FilterTabs";
import { useAutomobilesFilters, useAutomobilesData } from "@/hooks/automobiles.hooks";

interface AutomobilesPageProps {
  category?: string;
}

const AutomobilesPage: React.FC<AutomobilesPageProps> = ({ category = 'automobiles' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Use custom hooks
  const {
    filters,
    setFilters,
    automobilesTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  } = useAutomobilesFilters();

  const {
    automobilesChannels,
    getSubcategoryFilters,
  } = useAutomobilesData();

  // Create safe filters for InfiniteContentGrid
  const safeFilters = useMemo(() => {
    // Convert AutomobilesFilters to FilterState expected by InfiniteContentGrid
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
      vehicleType: filters.vehicleType,
      fuelType: filters.fuelType,
      transmission: filters.transmission,
      condition: filters.condition,
      year: filters.year,
      color: filters.color,
      certifiedPreOwned: filters.certifiedPreOwned,
      electricVehicle: filters.electricVehicle,
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
        channels={automobilesChannels}
        activeChannel={activeSubcategory}
        onChannelSelect={handleSubcategorySelect}
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
        category="automobiles"
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs
        tabs={automobilesTabs}
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

export default AutomobilesPage;