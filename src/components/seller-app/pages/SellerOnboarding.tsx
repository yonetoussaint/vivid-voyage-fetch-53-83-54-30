import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroBanner from '@/components/home/HeroBanner';

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch current seller data
  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching seller data:', error);
        return null;
      }
      return data;
    },
  });

  const handleBecomeSeller = () => {
    // Navigate to seller registration/setup
    navigate('/seller-onboarding/setup');
  };

  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Become a Seller</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative pt-16">
        <HeroBanner 
          asCarousel={false} 
          showNewsTicker={false} 
          customHeight="180px" 
          sellerId={sellerData?.id}
          showEditButton={false}
          editButtonPosition="top-right"
          dataSource="seller_banners"
        />
      </div>

      {/* Profile Image Section */}
      <div className="relative z-30 -mt-12 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-4 border-white overflow-hidden shadow-lg flex items-center justify-center">
            <Package className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {/* Enhanced Onboarding Content */}
      <div className="p-4 space-y-6 mt-4">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your Selling Journey
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful sellers. Set up your store, list your products, and start earning today.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Why Sell With Us?</h3>
          <div className="grid gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Earn More</h3>
                  <p className="text-gray-600 text-sm">
                    Competitive commission rates and fast payouts. Keep more of what you earn.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Reach Customers</h3>
                  <p className="text-gray-600 text-sm">
                    Access millions of active buyers ready to purchase your products.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Grow Your Business</h3>
                  <p className="text-gray-600 text-sm">
                    Powerful analytics and marketing tools to scale your success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Steps */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Get Started</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">Complete Your Profile</h4>
                <p className="text-gray-600 text-sm">
                  Add your business details, logo, and description to build trust with customers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">List Your Products</h4>
                <p className="text-gray-600 text-sm">
                  Upload high-quality photos and detailed descriptions to attract buyers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">Start Selling</h4>
                <p className="text-gray-600 text-sm">
                  Receive orders, manage inventory, and watch your business grow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Need */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">What You'll Need</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Valid business registration or tax ID</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Bank account for payments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Product photos and descriptions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Contact information</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="pt-6 pb-8">
          <button
            onClick={handleBecomeSeller}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg mb-3"
          >
            Start Selling Now
          </button>
          <button
            onClick={() => navigate('/seller-guide')}
            className="w-full px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200"
          >
            Learn More
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-gray-200 pb-8">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-xs text-gray-600">Active Sellers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xl font-bold text-gray-900 mb-1">1M+</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xl font-bold text-gray-900 mb-1">4.8★</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;