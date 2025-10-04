// components/seller-app/SellerPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';

const SellerPage = () => {
  const location = useLocation();
  const { sellerId } = useParams();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <SellerLayout showActionButtons={true}>
      <SellerOverview />
    </SellerLayout>
  );
};

export default SellerPage;