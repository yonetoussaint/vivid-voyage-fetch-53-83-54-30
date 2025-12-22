import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FilterTabs, { FilterState } from "@/components/FilterTabs";

interface BooksPageProps {
  category?: string;
}

const BooksPage: React.FC<BooksPageProps> = ({ category = 'books' }) => {
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

  // Define book categories with free images from Unsplash
  const bookChannels: ChannelItem[] = [
    {
      id: 'all',
      name: 'All Books',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-700/20',
      textColor: 'text-white'
    },
    {
      id: 'fiction',
      name: 'Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-700/20',
      textColor: 'text-white'
    },
    {
      id: 'non-fiction',
      name: 'Non-Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
      textColor: 'text-white'
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-700/20',
      textColor: 'text-white'
    },
    {
      id: 'science-fiction',
      name: 'Science Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20',
      textColor: 'text-white'
    },
    {
      id: 'mystery-thriller',
      name: 'Mystery & Thriller',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-700/20 to-gray-900/20',
      textColor: 'text-white'
    },
    {
      id: 'romance',
      name: 'Romance',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-700/20',
      textColor: 'text-white'
    },
    {
      id: 'biography',
      name: 'Biography',
      imageUrl: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-700/20',
      textColor: 'text-white'
    },
    {
      id: 'self-help',
      name: 'Self-Help',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-700/20',
      textColor: 'text-white'
    },
    {
      id: 'history',
      name: 'History',
      imageUrl: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-700/20',
      textColor: 'text-white'
    },
    {
      id: 'science',
      name: 'Science',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-700/20',
      textColor: 'text-white'
    },
    {
      id: 'children',
      name: "Children's",
      imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20',
      textColor: 'text-white'
    },
    {
      id: 'young-adult',
      name: 'Young Adult',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-700/20',
      textColor: 'text-white'
    },
    {
      id: 'cookbooks',
      name: 'Cookbooks',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-400/20 to-red-600/20',
      textColor: 'text-white'
    },
    {
      id: 'poetry',
      name: 'Poetry',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-700/20',
      textColor: 'text-white'
    },
    {
      id: 'graphic-novels',
      name: 'Graphic Novels',
      imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-700/20',
      textColor: 'text-white'
    }
  ];

  const handleSubcategorySelect = (channelId: string) => {
    setActiveSubcategory(channelId);

    // You could add specific filtering for certain subcategories here
    if (channelId === 'bestsellers') {
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

export default BooksPage;