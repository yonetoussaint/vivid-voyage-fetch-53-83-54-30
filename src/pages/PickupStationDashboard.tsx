
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SellerLayout from '@/components/seller-app/SellerLayout';
import PickupStationOverview from '@/components/pickup-station-app/pages/PickupStationOverview';
import PickupStationPackages from '@/components/pickup-station-app/pages/PickupStationPackages';
import PickupStationCustomers from '@/components/pickup-station-app/pages/PickupStationCustomers';
import PickupStationAnalytics from '@/components/pickup-station-app/pages/PickupStationAnalytics';
import PickupStationNotifications from '@/components/pickup-station-app/pages/PickupStationNotifications';
import PickupStationSettings from '@/components/pickup-station-app/pages/PickupStationSettings';
import CustomerReviews from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
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

  const mockStationReviews = [
    {
      id: 1,
      user_name: "Claudette Joseph",
      rating: 5,
      title: "Excellent service!",
      comment: "Very fast and professional. The staff is always friendly and helpful. I never wait more than 5 minutes to pick up my packages.",
      created_at: "2024-08-15T10:30:00Z",
      verified_purchase: true,
      helpful_count: 15,
      reply_count: 1,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Station Manager",
          comment: "Thank you for your wonderful feedback! We're committed to providing fast, friendly service.",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Jacques Desir",
      rating: 5,
      title: "Very convenient location",
      comment: "Right in the heart of the city. Easy to access and plenty of parking nearby.",
      created_at: "2024-08-10T14:20:00Z",
      verified_purchase: true,
      helpful_count: 12,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

  const mockStationQAs = [
    {
      id: 1,
      user_name: "Jean Baptiste",
      question: "What are your operating hours?",
      answer: "We're open Monday to Saturday from 8 AM to 8 PM, and Sunday from 10 AM to 6 PM.",
      answer_author: "Station Manager",
      is_official: true,
      created_at: "2024-08-15T10:30:00Z",
      answered_at: "2024-08-15T14:30:00Z",
      helpful_count: 24,
      reply_count: 2,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Marie Claire",
          comment: "Perfect hours for my schedule!",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: false
        },
        {
          id: 102,
          user_name: "Station Manager",
          comment: "We're here to serve you at convenient times!",
          created_at: "2024-08-17T14:30:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Pierre Louis",
      question: "How long can I leave my package at the station?",
      answer: "Packages can be stored for up to 7 days free of charge. After that, a small storage fee applies.",
      answer_author: "Customer Service",
      is_official: true,
      created_at: "2024-08-10T14:20:00Z",
      answered_at: "2024-08-10T16:45:00Z",
      helpful_count: 18,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

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
        <Route path="/reviews" element={
          <div className="w-full bg-white pb-20">
            <CustomerReviews 
              productId="pickup-station-1"
              reviews={mockStationReviews}
            />
          </div>
        } />
        <Route path="/qa" element={
          <div className="w-full bg-white pb-20">
            <ProductQA 
              productId="pickup-station-1"
              questions={mockStationQAs}
            />
          </div>
        } />
        <Route path="/analytics" element={<PickupStationAnalytics />} />
        <Route path="/notifications" element={<PickupStationNotifications />} />
        <Route path="/settings" element={<PickupStationSettings />} />
      </Routes>
    </SellerLayout>
  );
};

export default PickupStationDashboard;
