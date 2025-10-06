import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
          <div className="-mt-2">
            <FlashDeals
              layoutMode="grid"
              showSectionHeader={false}
            />
          </div>
        );

      case 'reels':
        return (
          <div className="-mt-2">
            <MobileOptimizedReels 
              title="REELS"
              isLive={false}
              layoutMode="grid"
              showSectionHeader={false}
            />
          </div>
        );

      case 'posts':
        return (
          <div className="w-full space-y-2">
            {products && products.length > 0 && (
              <>
                <VendorProductCarousel
                  title="Popular Posts"
                  products={products.slice(0, 5) || []}
                  posts={[{
                    id: 1,
                    vendorData: {
                      profilePic: products[0]?.sellers?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[0]?.sellers?.name || "Tech Store Pro",
                      verified: products[0]?.sellers?.verified || true,
                      followers: products[0]?.sellers?.followers_count ? `${(products[0].sellers.followers_count / 1000).toFixed(1)}K` : "12.5K",
                      publishedAt: products[0]?.created_at || new Date().toISOString()
                    },
                    title: "Latest Deals",
                    postDescription: "Check out our amazing deals on the latest products! Perfect for tech enthusiasts and professionals.",
                    displayProducts: products.slice(0, 2).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null,
                      currentPrice: `$${Number(product.discount_price || product.price).toFixed(2)}`,
                      originalPrice: product.discount_price ? `$${Number(product.price).toFixed(2)}` : null
                    })),
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
                      profilePic: products[5]?.sellers?.image_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[5]?.sellers?.name || "Fashion Forward",
                      verified: products[5]?.sellers?.verified || true,
                      followers: products[5]?.sellers?.followers_count ? `${(products[5].sellers.followers_count / 1000).toFixed(1)}K` : "8.3K",
                      publishedAt: products[5]?.created_at || new Date().toISOString()
                    },
                    title: "Summer Collection",
                    postDescription: "Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits for every occasion.",
                    displayProducts: products.slice(5, 7).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null,
                      currentPrice: `$${Number(product.discount_price || product.price).toFixed(2)}`,
                      originalPrice: product.discount_price ? `$${Number(product.price).toFixed(2)}` : null
                    })),
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
          <div className="w-full space-y-2">
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
          <div className="w-full space-y-2">
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
    <div 
      className="w-full bg-white"
    >
      {renderContent()}
    </div>
  );
}