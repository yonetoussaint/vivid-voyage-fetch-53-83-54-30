import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/home/HeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "./components/FavouriteChannels";
import InfiniteContentGrid from "./components/InfiniteContentGrid";
import Footer from "@/components/Footer";

const ForYou: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('recommendations');

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
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
          <div className="overflow-hidden relative">
            <div className="pb-2">
              <div className="mb-2">
                <HeroBanner showNewsTicker={true} />
              </div>
              
              <div className="">
                <FavouriteChannels />
              </div>
              
              <div className="w-full bg-gray-100 h-1 mb-2"></div>
              
              <div className="mb-2">
                <FlashDeals
                  showCountdown={true}
                  showTitleChevron={true}
                />
              </div>
              
              <div className="w-full bg-gray-100 h-1 mb-2"></div>
              
              <InfiniteContentGrid category={activeCategory} />
            </div>

            {/* Hidden Footer */}
            <div 
              className="sr-only" 
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: 0
              }}
              aria-hidden="true"
            >
              <Footer />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ForYou;