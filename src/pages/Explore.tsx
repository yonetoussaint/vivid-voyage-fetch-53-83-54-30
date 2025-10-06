import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import FlashDeals from '@/components/home/FlashDeals';
import MobileOptimizedReels from '@/components/home/MobileOptimizedReels';
import VendorProductCarousel from '@/components/home/VendorProductCarousel';
import TopVendorsCompact from '@/components/home/TopVendorsCompact';
import { Clock, Package, Video, FileText, Store, MapPin } from 'lucide-react';
export default function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'products';

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
  });

  useEffect(() => {
    if (!searchParams.get('tab')) {
      navigate('/explore?tab=products', { replace: true });
    }
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-2">
            <FlashDeals
              title="TRENDING PRODUCTS"
              icon={Clock}
            />
            {products && products.length > 0 && (
              <VendorProductCarousel
                title="Featured Products"
                products={products.slice(0, 10) || []}
              />
            )}
            <FlashDeals
              title="NEW ARRIVALS"
              icon={Package}
            />
            {products && products.length > 0 && (
              <VendorProductCarousel
                title="Popular Products"
                products={products.slice(10, 20) || []}
              />
            )}
            <FlashDeals
              title="BESTSELLERS"
              icon={Clock}
            />
          </div>
        );

      case 'reels':
        return (
          <div className="space-y-2">
            <MobileOptimizedReels 
              title="TRENDING REELS"
              isLive={false}
            />
            <MobileOptimizedReels 
              title="LIVE NOW"
              isLive={true}
            />
            <MobileOptimizedReels 
              title="RECOMMENDED FOR YOU"
              isLive={false}
            />
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-2">
            {products && products.length > 0 && (
              <>
                <VendorProductCarousel
                  title="Popular Posts"
                  products={products.slice(0, 5) || []}
                  posts={[{
                    id: 1,
                    vendorData: {
                      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      vendorName: "Tech Store Pro",
                      verified: true,
                      followers: "12.5K",
                      publishedAt: new Date().toISOString()
                    },
                    title: "Latest Deals",
                    postDescription: "Check out our amazing deals!",
                    displayProducts: [],
                    likeCount: 245,
                    commentCount: 32,
                    shareCount: 18
                  }]}
                />
                <VendorProductCarousel
                  title="Trending Posts"
                  products={products.slice(5, 10) || []}
                  posts={[{
                    id: 2,
                    vendorData: {
                      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                      vendorName: "Fashion Forward",
                      verified: true,
                      followers: "8.3K",
                      publishedAt: new Date().toISOString()
                    },
                    title: "Summer Collection",
                    postDescription: "Discover our stunning summer collection!",
                    displayProducts: [],
                    likeCount: 189,
                    commentCount: 24,
                    shareCount: 11
                  }]}
                />
              </>
            )}
          </div>
        );

      case 'sellers':
        return (
          <div className="space-y-2">
            <TopVendorsCompact 
              title="TOP SELLERS"
              showProducts={true}
            />
            <TopVendorsCompact 
              title="VERIFIED SELLERS"
              showProducts={true}
            />
            <TopVendorsCompact 
              title="NEW SELLERS"
              showProducts={false}
            />
          </div>
        );

      case 'stations':
        return (
          <div className="space-y-2">
            <TopVendorsCompact 
              title="NEARBY PICKUP STATIONS"
              showProducts={false}
              viewAllLink="/pickup-stations"
              isPickupStation={true}
            />
            <TopVendorsCompact 
              title="TOP RATED STATIONS"
              showProducts={false}
              viewAllLink="/pickup-stations"
              isPickupStation={true}
            />
            <TopVendorsCompact 
              title="FEATURED STATIONS"
              showProducts={false}
              viewAllLink="/pickup-stations"
              isPickupStation={true}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer className="overflow-hidden">
      {renderContent()}
    </PageContainer>
  );
}
