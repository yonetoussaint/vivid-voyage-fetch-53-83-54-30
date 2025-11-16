import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import SellerProducts from '@/components/seller/SellerProducts';
import SellerOrders from '@/components/seller-app/pages/SellerOrders';
import SellerReels from '@/components/seller-app/pages/SellerReels';
import SellerPosts from '@/components/seller-app/pages/SellerPosts'; // Add this import
import SellerCustomers from '@/components/seller-app/pages/SellerCustomers';
import SellerAnalytics from '@/components/seller-app/pages/SellerAnalytics';
import SellerFinances from '@/components/seller-app/pages/SellerFinances';
import SellerSettings from '@/components/seller-app/pages/SellerSettings';
import SellerMarketing from '@/components/seller-app/pages/SellerMarketing';
import SellerSupport from '@/components/seller-app/pages/SellerSupport';
import SellerEditProfile from '@/components/seller-app/pages/SellerEditProfile';
import SellerProductEdit from '@/components/seller-app/pages/SellerProductEdit';

const SellerDashboard = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <SellerLayout showActionButtons={false}>
      <Routes>
        <Route path="/" element={<Navigate to="/seller-dashboard/overview" replace />} />
        <Route path="/overview" element={<SellerOverview />} />
        <Route path="/products" element={<SellerProducts />} />
        <Route path="/products/edit/:productId" element={<SellerProductEdit />} />
<Route path="/onboarding" element={<SellerOnboarding />} />
        <Route path="/orders" element={<SellerOrders />} />
        <Route path="/customers" element={<SellerCustomers />} />
        <Route path="/reels" element={<SellerReels />} />
        <Route path="/posts" element={<SellerPosts />} /> {/* Add this route */}
        <Route path="/analytics" element={<SellerAnalytics />} />
        <Route path="/finances" element={<SellerFinances />} />
        <Route path="/marketing" element={<SellerMarketing />} />
        <Route path="/settings" element={<SellerSettings />} />
        <Route path="/edit-profile" element={<SellerEditProfile />} />
      </Routes>
    </SellerLayout>
  );
};

export default SellerDashboard;