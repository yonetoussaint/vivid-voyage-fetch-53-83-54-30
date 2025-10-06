
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import PickupStationOverview from '@/components/pickup-station-app/pages/PickupStationOverview';
import PickupStationPackages from '@/components/pickup-station-app/pages/PickupStationPackages';
import PickupStationCustomers from '@/components/pickup-station-app/pages/PickupStationCustomers';
import PickupStationAnalytics from '@/components/pickup-station-app/pages/PickupStationAnalytics';
import PickupStationNotifications from '@/components/pickup-station-app/pages/PickupStationNotifications';
import PickupStationSettings from '@/components/pickup-station-app/pages/PickupStationSettings';
import PickupStationReviews from '@/components/pickup-station-app/pages/PickupStationReviews';
import PickupStationQA from '@/components/pickup-station-app/pages/PickupStationQA';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PickupStationDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Fetch pickup station data (simulating seller data structure)
  const { data: stationData, isLoading: stationLoading } = useQuery({
    queryKey: ['pickup-station', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // This would fetch from a pickup_stations table in your database
      // For now, returning mock data that matches seller data structure
      return {
        id: 'station-1',
        user_id: user.id,
        name: 'Port-au-Prince Central Station',
        description: 'Your trusted package pickup location in the heart of Port-au-Prince',
        logo: null, // You can add a station logo path here
        city: 'Port-au-Prince',
        address: '123 Boulevard Jean-Jacques Dessalines',
        phone: '+509 2234 5678',
        email: user.email,
        operating_hours: 'Mon-Sat: 8AM-8PM, Sun: 10AM-6PM',
        total_packages: 45,
        active_customers: 128,
        pickup_rate: 92,
        avg_wait_time: '2 min',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
    enabled: !!user?.id,
  });

  // Function to get station logo URL (similar to seller logo)
  const getStationLogoUrl = (imagePath?: string): string => {
    if (!imagePath) {
      // Default station icon
      return "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=150&h=150&fit=crop";
    }
    const { data } = supabase.storage.from('station-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  return (
    <SellerLayout 
      showActionButtons={false}
      publicSellerData={stationData}
      publicSellerLoading={stationLoading}
      getSellerLogoUrl={getStationLogoUrl}
      isPublicPage={false}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/pickup-station/overview" replace />} />
        <Route path="/overview" element={<PickupStationOverview />} />
        <Route path="/packages" element={<PickupStationPackages />} />
        <Route path="/customers" element={<PickupStationCustomers />} />
        <Route path="/reviews" element={<PickupStationReviews />} />
        <Route path="/qa" element={<PickupStationQA />} />
        <Route path="/analytics" element={<PickupStationAnalytics />} />
        <Route path="/notifications" element={<PickupStationNotifications />} />
        <Route path="/settings" element={<PickupStationSettings />} />
      </Routes>
    </SellerLayout>
  );
};

export default PickupStationDashboard;
