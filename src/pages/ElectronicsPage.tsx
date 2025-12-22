import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";

interface ElectronicsPageProps {
  category?: string;
}

const ElectronicsPage: React.FC<ElectronicsPageProps> = ({ category = 'electronics' }) => {
  const [activeCategory, setActiveCategory] = useState(category);

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  const components = [
    // Favourite Channels - REMOVED px-4 wrapper
    <div key="favourite-channels-wrapper" className="pt-2">
      <FavouriteChannels />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    // Flash Deals - added like in ForYou page
    <div key="flash-deals-wrapper">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    // InfiniteContentGrid
    <div key="infinite-grid-wrapper" className="pt-2">
      <InfiniteContentGrid category={activeCategory} />
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