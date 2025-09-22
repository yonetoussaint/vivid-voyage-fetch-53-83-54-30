import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import SpaceSavingCategories from "@/components/home/SpaceSavingCategories";
import ElectronicsSubcategories from "@/components/home/ElectronicsSubcategories";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivals from "@/components/home/NewArrivals";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";

import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShoppingBag,
  Shirt,
  Baby,
  Home,
  Dumbbell,
  Sparkles,
  Car,
  BookOpen,
  Gamepad2,
  Watch,
  Headphones,
  Camera,
  Laptop,
  Coffee
} from "lucide-react";
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AliExpressHeader from '@/components/home/AliExpressHeader';

// Component patterns for endless feed
const flashDealsCategories = [
  { title: "ELECTRONICS", icon: Smartphone },
  { title: "WOMEN'S FASHION", icon: ShoppingBag },
  { title: "MEN'S FASHION", icon: Shirt },
  { title: "KIDS & TOYS", icon: Baby },
  { title: "HOME & GARDEN", icon: Home },
  { title: "SPORTS & FITNESS", icon: Dumbbell },
  { title: "BEAUTY & HEALTH", icon: Sparkles },
  { title: "AUTOMOTIVE", icon: Car },
  { title: "BOOKS & MEDIA", icon: BookOpen },
  { title: "GAMING", icon: Gamepad2 },
  { title: "WATCHES", icon: Watch },
  { title: "AUDIO", icon: Headphones },
  { title: "PHOTOGRAPHY", icon: Camera },
  { title: "COMPUTERS", icon: Laptop },
  { title: "COFFEE & TEA", icon: Coffee },
];

const feedComponents = [
  'FlashDeals',
  'MobileOptimizedReels',
  'TopVendorsCompact',
  'NewArrivalsSection',
  'SuperDealsSection',
  'VendorProductCarousel',
  'SimpleFlashDeals',
  'PopularSearches',
  'TopBrands',
  'BenefitsBanner',
];

interface ForYouContentProps {
  category: string;
}

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  // Generate initial feed
  const generateFeedItems = useCallback((count: number, startIndex: number = 0) => {
    const items = [];

    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % feedComponents.length;
      const componentType = feedComponents[index];

      if (componentType === 'SimpleFlashDeals') {
        const categoryIndex = (startIndex + i) % flashDealsCategories.length;
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
          category: flashDealsCategories[categoryIndex],
        });
      } else {
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
        });
      }
    }

    return items;
  }, []);

  // Initialize finite feed when category or products change
  useEffect(() => {
    if (products) {
      // Generate a finite set of feed items (20 items total)
      setFeedItems(generateFeedItems(20, 0));
    }
  }, [products, generateFeedItems, category]);

  // Render component based on type
  const renderFeedItem = (item: any) => {
    const { type, category: itemCategory, id } = item;

    switch (type) {
      case 'FlashDeals':
        return <FlashDeals key={id} />;
      case 'MobileOptimizedReels':
        return <MobileOptimizedReels key={id} />;
      case 'TopVendorsCompact':
        return <TopVendorsCompact key={id} />;
      case 'NewArrivalsSection':
        return <NewArrivalsSection key={id} />;
      case 'SuperDealsSection':
        return products && products.length > 0 ? (
          <SuperDealsSection key={id} products={products} />
        ) : null;
      case 'VendorProductCarousel':
        return products && products.length > 0 ? (
          <VendorProductCarousel
            key={id}
            title="Trending Products"
            products={products.slice(0, 10)}
          />
        ) : null;
      case 'SimpleFlashDeals':
        return (
          <SimpleFlashDeals
            key={id}
            title={itemCategory.title}
            icon={itemCategory.icon}
          />
        );
      case 'PopularSearches':
        return <PopularSearches key={id} />;
      case 'TopBrands':
        return <TopBrands key={id} />;
      case 'BenefitsBanner':
        return <BenefitsBanner key={id} />;

      default:
        return null;
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Hero Banner - shown once at the top */}
      <HeroBanner />
      {/* Show different category components based on active category */}
      {category === 'electronics' ? <ElectronicsSubcategories /> : <SpaceSavingCategories />}

      {/* Finite feed content */}
      <div className="space-y-2">
        {feedItems.map(renderFeedItem)}
      </div>
    </PageContainer>
  );
};

// Define categories for marketplace homepage
const categories = [
  { id: 'recommendations', name: 'For You', icon: <Home className="h-3 w-3" />, path: '/for-you' },
  { id: 'electronics', name: 'Electronics', icon: <Smartphone className="h-3 w-3" />, path: '/electronics' },
  { id: 'fashion', name: 'Fashion', icon: <Shirt className="h-3 w-3" />, path: '/fashion' },
  { id: 'kids', name: 'Kids', icon: <Baby className="h-3 w-3" />, path: '/kids' },
  { id: 'home', name: 'Home & Garden', icon: <Home className="h-3 w-3" />, path: '/home-garden' },
  { id: 'sports', name: 'Sports', icon: <Dumbbell className="h-3 w-3" />, path: '/sports' },
  { id: 'beauty', name: 'Beauty', icon: <Sparkles className="h-3 w-3" />, path: '/beauty' },
  { id: 'automotive', name: 'Automotive', icon: <Car className="h-3 w-3" />, path: '/automotive' },
];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState('recommendations');
  const [activeTab, setActiveTab] = useState('recommendations'); // State for active tab

  // Listen for category changes from header
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      console.log('Category changed to:', event.detail.category);
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  // Update active tab based on location
  useEffect(() => {
    if (location.pathname === '/electronics') {
      setActiveTab('electronics');
    } else if (location.pathname === '/fashion') {
      setActiveTab('fashion');
    } else if (location.pathname === '/kids') {
      setActiveTab('kids');
    } else if (location.pathname === '/home-garden') {
      setActiveTab('home');
    } else if (location.pathname === '/sports') {
      setActiveTab('sports');
    } else if (location.pathname === '/beauty') {
      setActiveTab('beauty');
    } else if (location.pathname === '/automotive') {
      setActiveTab('automotive');
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [location.pathname]);


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AliExpressHeader 
          categories={categories} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <ForYouContent category={activeCategory} />
      </motion.div>
    </AnimatePresence>
  );
}