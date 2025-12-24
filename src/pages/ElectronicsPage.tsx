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

  // Create electronics channels with images
  const electronicsChannelsWithImages = useMemo(() => [
    {
      id: "all",
      name: "All",
      imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "smartphones",
      name: "Phones",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      id: "laptops",
      name: "Laptops",
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600"
    },
    {
      id: "headphones",
      name: "Audio",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      id: "smartwatches",
      name: "Watches",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      id: "cameras",
      name: "Cameras",
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      id: "gaming",
      name: "Gaming",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      id: "accessories",
      name: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      id: "tablets",
      name: "Tablets",
      imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      id: "home-appliances",
      name: "Home Tech",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    }
  ], []);

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
        channels={electronicsChannelsWithImages}
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
        activeFilters={activeFilters}
        onTabChange={handleTabChange}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    </div>,

    <div key="infinite-grid-wrapper" className="pt-2">
      <InfiniteContentGrid 
        category={activeSubcategory === 'all' ? activeCategory : activeSubcategory} 
        filters={filters} 
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