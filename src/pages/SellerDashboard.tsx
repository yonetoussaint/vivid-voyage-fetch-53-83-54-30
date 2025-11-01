import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import SellerProducts from '@/components/seller/SellerProducts';
import SellerOrders from '@/components/seller-app/pages/SellerOrders';
import SellerReels from '@/components/seller-app/pages/SellerReels';
import SellerCustomers from '@/components/seller-app/pages/SellerCustomers';
import SellerAnalytics from '@/components/seller-app/pages/SellerAnalytics';
import SellerFinances from '@/components/seller-app/pages/SellerFinances';
import SellerSettings from '@/components/seller-app/pages/SellerSettings';
import SellerMarketing from '@/components/seller-app/pages/SellerMarketing';
import SellerSupport from '@/components/seller-app/pages/SellerSupport';

const SellerDashboard = () => {
  const location = useLocation();

  // Scroll to top when route changes (similar to SellerPage behavior)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <SellerLayout showActionButtons={false}>
      <Routes>
        <Route path="/" element={<Navigate to="/seller-dashboard/overview" replace />} />
        <Route path="/overview" element={<SellerOverview />} />
        <Route path="/products" element={<SellerProducts />} />
        <Route path="/orders" element={<SellerOrders />} />
        <Route path="/customers" element={<SellerCustomers />} />
        <Route path="/reels" element={<SellerReels />} />
        <Route path="/analytics" element={<SellerAnalytics />} />
        <Route path="/finances" element={<SellerFinances />} />
        <Route path="/marketing" element={<SellerMarketing />} />
        <Route path="/settings" element={<SellerSettings />} />
      </Routes>
    </SellerLayout>
  );
};

export default SellerDashboard;