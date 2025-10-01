
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import SellerProducts from '@/components/seller-app/pages/SellerProducts';
import SellerOrders from '@/components/seller-app/pages/SellerOrders';
import SellerCustomers from '@/components/seller-app/pages/SellerCustomers';
import SellerAnalytics from '@/components/seller-app/pages/SellerAnalytics';
import SellerInventory from '@/components/seller-app/pages/SellerInventory';
import SellerFinances from '@/components/seller-app/pages/SellerFinances';
import SellerSettings from '@/components/seller-app/pages/SellerSettings';
import SellerMarketing from '@/components/seller-app/pages/SellerMarketing';
import SellerSupport from '@/components/seller-app/pages/SellerSupport';
import IndexBottomNav from '@/components/layout/IndexBottomNav';

const SellerDashboard = () => {
  const location = useLocation();

  // Scroll to top when route changes (similar to SellerPage behavior)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <SellerLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/seller-dashboard/overview" replace />} />
          <Route path="/overview" element={<SellerOverview />} />
          <Route path="/products" element={<SellerProducts />} />
          <Route path="/orders" element={<SellerOrders />} />
          <Route path="/customers" element={<SellerCustomers />} />
          <Route path="/analytics" element={<SellerAnalytics />} />
          <Route path="/inventory" element={<SellerInventory />} />
          <Route path="/finances" element={<SellerFinances />} />
          <Route path="/marketing" element={<SellerMarketing />} />
          <Route path="/support" element={<SellerSupport />} />
          <Route path="/settings" element={<SellerSettings />} />
        </Routes>
      </SellerLayout>
      <IndexBottomNav />
    </>
  );
};

export default SellerDashboard;
