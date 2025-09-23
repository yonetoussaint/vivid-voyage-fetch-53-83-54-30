import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import ElectronicsSubcategories from "@/components/home/ElectronicsSubcategories";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";

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
import AliExpressHeader from '@/components/home/AliExpressHeader';

interface ForYouContentProps {
  category: string;
}

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Hero Banner - shown once at the top */}
      <HeroBanner />

      {/* Show ElectronicsSubcategories only for electronics category */}
      {category === 'electronics' && <ElectronicsSubcategories />}

      {/* Traditional component layout - each shows only once */}
      <div className="space-y-2">
        <FlashDeals />
        <MobileOptimizedReels />
        <TopVendorsCompact />
        <NewArrivalsSection />

        {products && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}

        {products && products.length > 0 && (
          <VendorProductCarousel
            title="Trending Products"
            products={products.slice(0, 10)}
          />
        )}

        <SimpleFlashDeals
          title="ELECTRONICS"
          icon={Smartphone}
        />

        <PopularSearches />
        <TopBrands />
        <BenefitsBanner />
      </div>

      {/* Book Genre Flash Deals - Final component */}
      <div className="mt-6 mb-4">
        <BookGenreFlashDeals category={category} />
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
  const [activeTab, setActiveTab] = useState('recommendations');
  const location = useLocation();

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