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
                {/* Example 1: Single Product - Full Width */}
                <VendorProductCarousel
                  title="Single Product Example"
                  products={products.slice(0, 1) || []}
                  posts={[{
                    id: 1,
                    vendorData: {
                      profilePic: products[0]?.sellers?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[0]?.sellers?.name || "Tech Store Pro",
                      verified: products[0]?.sellers?.verified || true,
                      followers: products[0]?.sellers?.followers_count ? `${(products[0].sellers.followers_count / 1000).toFixed(1)}K` : "12.5K",
                      publishedAt: products[0]?.created_at || new Date().toISOString()
                    },
                    title: "Featured Product",
                    postDescription: "Check out our premium flagship product! Limited edition with exclusive features and exceptional quality.",
                    displayProducts: products.slice(0, 1).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null
                    })),
                    likeCount: 342,
                    commentCount: 56,
                    shareCount: 28
                  }]}
                />

                {/* Example 2: Two Products - Justified */}
                <VendorProductCarousel
                  title="Two Products Example"
                  products={products.slice(1, 3) || []}
                  posts={[{
                    id: 2,
                    vendorData: {
                      profilePic: products[1]?.sellers?.image_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[1]?.sellers?.name || "Fashion Forward",
                      verified: products[1]?.sellers?.verified || true,
                      followers: products[1]?.sellers?.followers_count ? `${(products[1].sellers.followers_count / 1000).toFixed(1)}K` : "8.3K",
                      publishedAt: products[1]?.created_at || new Date().toISOString()
                    },
                    title: "Perfect Pair",
                    postDescription: "Two must-have items that complement each other perfectly. Style meets functionality!",
                    displayProducts: products.slice(1, 3).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null
                    })),
                    likeCount: 189,
                    commentCount: 24,
                    shareCount: 11
                  }]}
                />

                {/* Example 3: Three Products - Horizontal Line */}
                <VendorProductCarousel
                  title="Three Products Example"
                  products={products.slice(3, 6) || []}
                  posts={[{
                    id: 3,
                    vendorData: {
                      profilePic: products[3]?.sellers?.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[3]?.sellers?.name || "Home Essentials",
                      verified: products[3]?.sellers?.verified || true,
                      followers: products[3]?.sellers?.followers_count ? `${(products[3].sellers.followers_count / 1000).toFixed(1)}K` : "15.2K",
                      publishedAt: products[3]?.created_at || new Date().toISOString()
                    },
                    title: "Triple Threat",
                    postDescription: "Three amazing products in one collection. Perfect for completing your setup!",
                    displayProducts: products.slice(3, 6).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null
                    })),
                    likeCount: 267,
                    commentCount: 38,
                    shareCount: 19
                  }]}
                />

                {/* Example 4: Four Products - 2x2 Grid */}
                <VendorProductCarousel
                  title="Four Products Example"
                  products={products.slice(6, 10) || []}
                  posts={[{
                    id: 4,
                    vendorData: {
                      profilePic: products[6]?.sellers?.image_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[6]?.sellers?.name || "Sports & Fitness",
                      verified: products[6]?.sellers?.verified || false,
                      followers: products[6]?.sellers?.followers_count ? `${(products[6].sellers.followers_count / 1000).toFixed(1)}K` : "9.7K",
                      publishedAt: products[6]?.created_at || new Date().toISOString()
                    },
                    title: "Complete Bundle",
                    postDescription: "Everything you need in one complete package. Four essential items for maximum value!",
                    displayProducts: products.slice(6, 10).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null
                    })),
                    likeCount: 421,
                    commentCount: 67,
                    shareCount: 34
                  }]}
                />

                {/* Example 5: Five or More Products - Grid with Counter */}
                <VendorProductCarousel
                  title="Collection Example"
                  products={products.slice(10, 18) || []}
                  posts={[{
                    id: 5,
                    vendorData: {
                      profilePic: products[10]?.sellers?.image_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                      vendorName: products[10]?.sellers?.name || "Beauty & Care",
                      verified: products[10]?.sellers?.verified || true,
                      followers: products[10]?.sellers?.followers_count ? `${(products[10].sellers.followers_count / 1000).toFixed(1)}K` : "22.4K",
                      publishedAt: products[10]?.created_at || new Date().toISOString()
                    },
                    title: "Mega Collection",
                    postDescription: "Our biggest collection yet! Browse through 8 amazing products carefully curated just for you. Limited stock available!",
                    displayProducts: products.slice(10, 18).map(product => ({
                      id: product.id,
                      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
                      discount: product.discount_price ? `${Math.round(((product.price - product.discount_price) / product.price) * 100)}%` : null
                    })),
                    likeCount: 589,
                    commentCount: 94,
                    shareCount: 52
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