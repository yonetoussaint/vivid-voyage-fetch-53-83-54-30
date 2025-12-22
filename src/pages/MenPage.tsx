import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";

interface MenPageProps {
  category?: string;
}

const MenPage: React.FC<MenPageProps> = ({ category = 'men' }) => {
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

  // Define men's fashion subcategories with free images from Unsplash
  const menFashionChannels: ChannelItem[] = [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
      textColor: 'text-white'
    },
    {
      id: 'clothing',
      name: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-700/20 to-gray-900/20',
      textColor: 'text-white'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-700/20',
      textColor: 'text-white'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1a40ed0ada?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-700/20',
      textColor: 'text-white'
    },
    {
      id: 'formalwear',
      name: 'Formal Wear',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-black/20 to-gray-800/20',
      textColor: 'text-white'
    },
    {
      id: 'activewear',
      name: 'Activewear',
      imageUrl: 'https://images.unsplash.com/photo-1594938374185-76c5c25a41d4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
      textColor: 'text-white'
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-700/20 to-blue-900/20',
      textColor: 'text-white'
    },
    {
      id: 'watches',
      name: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-gray-700/20',
      textColor: 'text-white'
    },
    {
      id: 'bags',
      name: 'Bags',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20',
      textColor: 'text-white'
    },
    {
      id: 'jeans',
      name: 'Jeans',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20',
      textColor: 'text-white'
    },
    {
      id: 'underwear',
      name: 'Underwear',
      imageUrl: 'https://images.unsplash.com/photo-1586363104868-70f5d6d9f8e4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-700/20',
      textColor: 'text-white'
    },
    {
      id: 'swimwear',
      name: 'Swimwear',
      imageUrl: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-700/20',
      textColor: 'text-white'
    },
    {
      id: 'sportswear',
      name: 'Sportswear',
      imageUrl: 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-700/20',
      textColor: 'text-white'
    },
    {
      id: 'workwear',
      name: 'Workwear',
      imageUrl: 'https://images.unsplash.com/photo-1582813341833-b3b7d5a2e8e4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-700/20',
      textColor: 'text-white'
    },
    {
      id: 'grooming',
      name: 'Grooming',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-700/20',
      textColor: 'text-white'
    }
  ];

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);

    // You could add specific filtering for certain subcategories here
    if (channelId === 'formalwear') {
      setFilters(prev => ({
        ...prev,
        sortBy: 'price_high_low'
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
        channels={menFashionChannels}
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

export default MenPage;