// components/seller-app/SellerPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useParams, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import ProductQA from '@/components/product/ProductQA';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import SellerReelsTab from '@/components/seller/tabs/SellerReelsTab';
import SellerPostsTab from '@/components/seller/tabs/SellerPostsTab';
import ProductSectionWrapper from '@/components/product/ProductSectionWrapper';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import { fetchSellerById } from '@/integrations/supabase/sellers';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { supabase } from '@/integrations/supabase/client';

const SellerPage = () => {
  const location = useLocation();
  const { sellerId } = useParams();

  // Add filter state for all tabs
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  };

  // Filter handler functions
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  // Fetch public seller data based on URL parameter
  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['public-seller', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      return await fetchSellerById(sellerId);
    },
    enabled: !!sellerId,
  });

  // Mock videos data for reels tab
  const mockVideos = [
    {
      id: '1',
      video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      title: 'Product Demo Video',
      views: 1200,
      likes: 89,
      duration: 60
    }
  ];

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId);
  };

  const handleUploadClick = () => {
    console.log('Upload reel clicked');
  };

  return (
    <SellerLayout 
      showActionButtons={true}
      publicSellerData={sellerData}
      publicSellerLoading={sellerLoading}
      getSellerLogoUrl={getSellerLogoUrl}
      isPublicPage={true}
      isOwnProfile={false} // Explicitly set to false for public seller pages
    >
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route 
          path="/products" 
          element={
            <BookGenreFlashDeals 
              sellerId={sellerId}
            />
          } 
        />
        <Route 
          path="/reels" 
          element={
            <div className="w-full">
              <SellerReelsTab
                videos={mockVideos}
                isLoading={false}
                onVideoClick={handleVideoClick}
                onUploadClick={handleUploadClick}
              />
            </div>
          } 
        />
        <Route 
          path="/posts" 
          element={
            <div className="w-full">
              <SellerPostsTab />
            </div>
          } 
        />
        <Route 
          path="/qas" 
          element={
            <div className="w-full bg-white">
              <ProductQA productId={sellerId} limit={null} />
            </div>
          } 
        />
        <Route 
          path="/reviews" 
          element={
            <div className="w-full bg-white">
              <CustomerReviewsEnhanced productId={sellerId} limit={null} />
            </div>
          } 
        />
      </Routes>
    </SellerLayout>
  );
};

export default SellerPage;