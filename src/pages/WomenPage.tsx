import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";

interface WomenPageProps {
  category?: string;
}

const WomenPage: React.FC<WomenPageProps> = ({ category = 'women' }) => {
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

  // Define women's fashion subcategories with free images from Unsplash
  const womenFashionChannels: ChannelItem[] = [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
      textColor: 'text-white'
    },
    {
      id: 'dresses',
      name: 'Dresses',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-700/20',
      textColor: 'text-white'
    },
    {
      id: 'tops',
      name: 'Tops',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-700/20',
      textColor: 'text-white'
    },
    {
      id: 'bottoms',
      name: 'Bottoms',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-700/20',
      textColor: 'text-white'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-700/20',
      textColor: 'text-white'
    },
    {
      id: 'handbags',
      name: 'Handbags',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-700/20',
      textColor: 'text-white'
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20',
      textColor: 'text-white'
    },
    {
      id: 'activewear',
      name: 'Activewear',
      imageUrl: 'https://images.unsplash.com/photo-1591369822093-3554c987c4e8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
      textColor: 'text-white'
    },
    {
      id: 'lingerie',
      name: 'Lingerie',
      imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-300/20 to-pink-500/20',
      textColor: 'text-white'
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-gray-700/20',
      textColor: 'text-white'
    },
    {
      id: 'swimwear',
      name: 'Swimwear',
      imageUrl: 'https://images.unsplash.com/photo-1576827471283-36a1a251d5c0?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-700/20',
      textColor: 'text-white'
    },
    {
      id: 'beauty',
      name: 'Beauty',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-700/20',
      textColor: 'text-white'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1590649887894-3d70487e81c4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-700/20',
      textColor: 'text-white'
    },
    {
      id: 'maternity',
      name: 'Maternity',
      imageUrl: 'https://images.unsplash.com/photo-1518674660708-0e2c0473e68e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-700/20',
      textColor: 'text-white'
    },
    {
      id: 'plus-size',
      name: 'Plus Size',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-rose-500/20 to-rose-700/20',
      textColor: 'text-white'
    }
  ];

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);

    // You could add specific filtering for certain subcategories here
    if (channelId === 'dresses') {
      setFilters(prev => ({
        ...prev,
        sortBy: 'newest'
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

export default WomenPage;