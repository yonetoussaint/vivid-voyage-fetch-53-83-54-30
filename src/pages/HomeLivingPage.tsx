import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";

interface HomeLivingProps {
  category?: string;
}

const HomeLiving: React.FC<HomeLivingProps> = ({ category = 'home-living' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [filters, setFilters] = useState<FilterState>({
    price: {},
    rating: null,
    freeShipping: false,
    onSale: false,
    freeReturns: false,
    newArrivals: false,
    shippedFrom: [],
    sortBy: 'popular'
  });

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  const components = [
    // Favourite Channels - pt-2 for consistent top padding
    <div key="favourite-channels-wrapper" className="pt-2">
      <FavouriteChannels />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    // Flash Deals - pt-2 for consistent top padding
    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    // Filter Tabs - pt-2 for consistent top padding
    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs filters={filters} onFilterChange={setFilters} />
    </div>,

    // InfiniteContentGrid - pt-2 for consistent top padding
    <div key="infinite-grid-wrapper" className="pt-2">
      <InfiniteContentGrid category={activeCategory} filters={filters} />
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

export default HomeLiving;