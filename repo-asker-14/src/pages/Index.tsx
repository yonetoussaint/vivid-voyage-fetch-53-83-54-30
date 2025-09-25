import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";
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
  Coffee,
  Clock
} from "lucide-react";
import { useLocation } from 'react-router-dom';
import AliExpressHeader from '@/components/home/AliExpressHeader';

interface ForYouContentProps {
  category: string;
}

// ... existing imports ...

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

  // Define different posts for different sections
  const techPost = {
    id: 1,
    vendorData: {
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      vendorName: "Tech Store Pro",
      verified: true,
      followers: "12.5K",
      publishedAt: "2024-01-15T10:30:00Z"
    },
    title: "Latest Tech Deals",
    postDescription: "Check out our amazing deals on the latest gadgets! Perfect for tech enthusiasts and professionals.",
    displayProducts: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
        discount: "20%",
        currentPrice: "$299",
        originalPrice: "$399"
      }
    ],
    likeCount: 245,
    commentCount: 32,
    shareCount: 18
  };

  const fashionPost = {
    id: 2,
    vendorData: {
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      vendorName: "Fashion Forward",
      verified: true,
      followers: "8.3K",
      publishedAt: "2024-01-14T15:45:00Z"
    },
    title: "Summer Collection 2024",
    postDescription: "Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits.",
    displayProducts: [
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        discount: "30%",
        currentPrice: "$79",
        originalPrice: "$115"
      }
    ],
    likeCount: 189,
    commentCount: 24,
    shareCount: 11
  };

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
        <FlashDeals 
          title="SPONSORED DEALS"
          icon={Clock}
        />
        
        {products && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}
        
        <FlashDeals 
          title="RECENTLY VIEWED"
          icon={Clock}
        />
        
        <TopVendorsCompact />
        
        {/* First Vendor Post */}
        <VendorProductCarousel
          title="Tech Deals"
          products={products?.slice(0, 5) || []}
          posts={[techPost]} // Pass custom post
        />

        <FlashDeals 
          title="NEW ARRIVALS"
          icon={Clock}
        />
        
        {products && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}

        <FlashDeals 
          title="BESTSELLERS"
          icon={Clock}
        />

        {/* Second Vendor Post */}
        <VendorProductCarousel
          title="Fashion Trends"
          products={products?.slice(5, 10) || []}
          posts={[fashionPost]} // Pass different post
        />

        <FlashDeals 
          title="TODAY'S DEALS"
          icon={Clock}
        />

        <MobileOptimizedReels />

        <FlashDeals 
          title="TRENDING NOW"
          icon={Clock}
        />

        <HeroBanner asCarousel={true} />

        <FlashDeals 
          title="STAFF PICKS"
          icon={Clock}
        />

        {/* Third Vendor Post (uses default post) */}
        <VendorProductCarousel
          title="Home Essentials"
          products={products?.slice(10, 15) || []}
        />
        
<MobileOptimizedReels 
  title="LIVE NOW"
  viewAllLink="/trending"
  isLive={true}
/>

        <FlashDeals 
          title="STAFF PICKS"
          icon={Clock}
        />
        
      </div>
    </PageContainer>
  );
};

// ... rest of the file remains the same ...

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