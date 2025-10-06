import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProfileLayout from '@/components/profile-app/ProfileLayout';
import ProfileDashboard from '@/components/profile-app/pages/ProfileDashboard';
import ProfileOrders from '@/components/profile-app/pages/ProfileOrders';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import ProfileAddresses from '@/components/profile-app/pages/ProfileAddresses';
import ProfilePayments from '@/components/profile-app/pages/ProfilePayments';
import ProfileAnalytics from '@/components/profile-app/pages/ProfileAnalytics';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProfileSettings from '@/components/profile-app/pages/ProfileSettings';

const ProfilePage = () => {
  const location = useLocation();

  // Scroll to top when route changes (similar to SellerDashboard behavior)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <ProfileLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ProfileDashboard />} />
        <Route path="orders" element={<ProfileOrders />} />
        <Route 
          path="wishlist" 
          element={
            <BookGenreFlashDeals 
              title="My Wishlist"
              subtitle="Items you've saved for later"
              className="bg-gray-50"
            />
          } 
        />
        <Route path="addresses" element={<ProfileAddresses />} />
        <Route path="payments" element={<ProfilePayments />} />
        <Route path="analytics" element={<ProfileAnalytics />} />
        <Route path="reviews" element={<CustomerReviewsEnhanced />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Routes>
    </ProfileLayout>
  );
};

export default ProfilePage;