
// components/seller-app/SellerPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import { fetchSellerById } from '@/integrations/supabase/sellers';
import { supabase } from '@/integrations/supabase/client';

const SellerPage = () => {
  const location = useLocation();
  const { sellerId } = useParams();

  // Fetch public seller data based on URL parameter
  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['public-seller', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      return await fetchSellerById(sellerId);
    },
    enabled: !!sellerId,
  });

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <SellerLayout 
      showActionButtons={true}
      publicSellerData={sellerData}
      publicSellerLoading={sellerLoading}
      getSellerLogoUrl={getSellerLogoUrl}
      isPublicPage={true}
    >
      <SellerOverview />
    </SellerLayout>
  );
};

export default SellerPage;
