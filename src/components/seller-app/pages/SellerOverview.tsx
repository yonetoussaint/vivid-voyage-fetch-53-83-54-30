import React from 'react';
import { Store } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const SellerOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: sellerData, isLoading: sellerLoading } = useSellerByUserId(user?.id || '');

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  return (
    <div className="w-full bg-white">
      <div className="px-2 py-2">
        {sellerLoading ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ) : sellerData ? (
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage src={getSellerLogoUrl(sellerData.image_url)} />
              <AvatarFallback>{sellerData.name?.substring(0, 2).toUpperCase() || 'SE'}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">{sellerData.name}</h1>
                {sellerData.verified && (
                  <span className="text-blue-600">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {sellerData.verified ? 'Premium Seller Dashboard' : 'Seller Dashboard'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>👥 {sellerData.followers_count || 0} followers</span>
                {sellerData.total_sales > 0 && (
                  <span>📦 {sellerData.total_sales} sales</span>
                )}
                {sellerData.verified && <span>✓ Verified</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-4">
            <p className="text-lg font-medium">No seller profile found</p>
            <p className="text-sm">You need to create a seller account to access the dashboard.</p>
            <button
              onClick={() => {
                console.log('Start seller onboarding');
                navigate('/seller-onboarding');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Become a Seller
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOverview;
