import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";

interface HomeLivingPageProps {
  category?: string;
}

const HomeLiving: React.FC<HomeLivingPageProps> = ({ category = 'home-living' }) => {
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
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

  // Define home living subcategories with free images from Unsplash
  const homeLivingChannels: ChannelItem[] = [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20',
      textColor: 'text-white'
    },
    {
      id: 'furniture',
      name: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-700/20',
      textColor: 'text-white'
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
      textColor: 'text-white'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      textColor: 'text-white'
    },
    {
      id: 'bedding',
      name: 'Bedding',
      imageUrl: 'https://images.unsplash.com/photo-1586023842181-8b8a5c2a7b3a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      textColor: 'text-white'
    },
    {
      id: 'lighting',
      name: 'Lighting',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
      textColor: 'text-white'
    },
    {
      id: 'storage',
      name: 'Storage',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-gray-700/20',
      textColor: 'text-white'
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-600/20',
      textColor: 'text-white'
    },
    {
      id: 'garden-outdoor',
      name: 'Garden & Outdoor',
      imageUrl: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
      textColor: 'text-white'
    },
    {
      id: 'rugs',
      name: 'Rugs',
      imageUrl: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
      textColor: 'text-white'
    },
    {
      id: 'curtains-blinds',
      name: 'Curtains & Blinds',
      imageUrl: 'https://images.unsplash.com/photo-1583845112205-95cd8a7d5c5d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-white'
    },
    {
      id: 'wall-art',
      name: 'Wall Art',
      imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-600/20',
      textColor: 'text-white'
    },
    {
      id: 'smart-home',
      name: 'Smart Home',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
      textColor: 'text-white'
    },
    {
      id: 'pet-supplies',
      name: 'Pet Supplies',
      imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
      textColor: 'text-white'
    },
    {
      id: 'organization',
      name: 'Organization',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-98f1d9c6f8d9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
      textColor: 'text-white'
    }
  ];

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);

    // You could add specific filtering for certain subcategories here
    if (channelId === 'furniture') {
      setFilters(prev => ({
        ...prev,
        sortBy: 'popular'
      }));
    }
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
        channels={homeLivingChannels}
        activeChannel={activeSubcategory}
        onChannelSelect={handleSubcategorySelect}
      />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1"></div>,

    <div key="flash-deals-wrapper" className="pt-2">
      <FlashDeals
        showCountdown={true}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1"></div>,

    <div key="filter-tabs-wrapper" className="pt-2">
      <FilterTabs filters={filters} onFilterChange={setFilters} />
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

export default HomeLiving;