import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs from "@/components/FilterTabs";
import { useBooksFilters, useBooksData } from "@/hooks/books.hooks";

interface BooksPageProps {
  category?: string;
}

const BooksPage: React.FC<BooksPageProps> = ({ category = 'books' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Use custom hooks
  const {
    filters,
    setFilters,
    booksTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  } = useBooksFilters();

  const {
    bookChannels,
    getSubcategoryFilters,
  } = useBooksData();

  // Create safe filters for InfiniteContentGrid
  const safeFilters = useMemo(() => {
    // Convert BooksFilters to FilterState expected by InfiniteContentGrid
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
      format: filters.format,
      language: filters.language,
      author: filters.author,
      publisher: filters.publisher,
      condition: filters.condition,
      bestseller: filters.bestseller,
      awardWinning: filters.awardWinning,
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
        channels={bookChannels}
        activeChannel={activeSubcategory}
        onChannelSelect={handleSubcategorySelect}
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
        category="books"
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs
        tabs={booksTabs}
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

export default BooksPage;