import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";
import { 
  Smartphone, Laptop, Headphones, Tv, Watch, 
  Camera, GamepadIcon, Speaker, Zap, Video, 
  DollarSign, Crown 
} from "lucide-react";

interface ElectronicsPageProps {
  category?: string;
}

const ElectronicsPage: React.FC<ElectronicsPageProps> = ({ category = 'electronics' }) => {
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

  // Define electronics subcategories as channels
  const electronicsChannels: ChannelItem[] = [
    {
      id: 'all',
      name: 'All',
      icon: 'ALL',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
      textColor: 'text-white',
      iconType: 'text'
    },
    {
      id: 'mobiles',
      name: 'Mobiles',
      icon: <Smartphone className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: <Laptop className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-gray-700 to-gray-800',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'headphones',
      name: 'Headphones',
      icon: <Headphones className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'tvs',
      name: 'TVs',
      icon: <Tv className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-red-400 to-red-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'smartwatches',
      name: 'Watches',
      icon: <Watch className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'cameras',
      name: 'Cameras',
      icon: <Camera className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: <GamepadIcon className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'speakers',
      name: 'Speakers',
      icon: <Speaker className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
      textColor: 'text-white',
      iconType: 'component'
    }
  ];

  // Define Lazada feature channels (if you want to mix them)
  const featureChannels: ChannelItem[] = [
    {
      id: 'lazflash',
      name: 'LazFlash',
      icon: <Zap className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'lazlive',
      name: 'LazLive',
      icon: <Video className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'lazaffiliates',
      name: 'Affiliates',
      icon: <DollarSign className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'bestsellers',
      name: 'Best Sellers',
      icon: <Crown className="w-5 h-5" />,
      bgColor: 'bg-gradient-to-br from-amber-600 to-amber-700',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      id: 'lazcash',
      name: 'LazCash',
      icon: 'RM',
      bgColor: 'bg-gradient-to-br from-orange-300 to-orange-400',
      textColor: 'text-white',
      iconType: 'text'
    },
    {
      id: 'choice',
      name: 'Choice',
      icon: 'CHOICE',
      bgColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
      iconType: 'text'
    }
  ];

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);
    
    // If it's a feature channel, you might want to handle it differently
    const isFeatureChannel = featureChannels.some(ch => ch.id === channelId);
    
    if (isFeatureChannel) {
      // Handle feature channel navigation
      switch(channelId) {
        case 'lazflash':
          // Navigate to flash deals
          break;
        case 'lazlive':
          // Navigate to live streams
          break;
        case 'bestsellers':
          // Apply best sellers filter
          setFilters(prev => ({
            ...prev,
            sortBy: 'popular'
          }));
          break;
        default:
          break;
      }
    }
  };

  // Determine which channels to show
  const channelsToShow = electronicsChannels; // You can also mix: [...electronicsChannels, ...featureChannels]

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
        channels={channelsToShow}
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

export default ElectronicsPage;