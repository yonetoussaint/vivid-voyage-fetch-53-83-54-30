import React, { useState, useRef, useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  
import {   
  Package,FileText, ShoppingCart, Users, BarChart3, DollarSign, Megaphone, Settings,  
  Home, Share, MessageCircle, MessageSquare, Star, Heart, Save, Edit  
} from 'lucide-react';  
import { useIsMobile } from '@/hooks/use-mobile';  
import { useQuery } from '@tanstack/react-query';  
import { fetchAllProducts } from '@/integrations/supabase/products';  
import { useAuth } from '@/contexts/auth/AuthContext';  
import { supabase } from '@/integrations/supabase/client';  
import StickyTabsLayout from '@/components/layout/StickyTabsLayout';  
import SellerInfoSection from './SellerInfoSection';  
import ProductHeader from '@/components/product/ProductHeader';  

interface SellerLayoutProps {  
  children: React.ReactNode;  
  showActionButtons?: boolean;  
  publicSellerData?: any;  
  publicSellerLoading?: boolean;  
  getSellerLogoUrl?: (imagePath?: string) => string;  
  isPublicPage?: boolean;  
  isOwnProfile?: boolean;  
}  

const SellerLayout: React.FC<SellerLayoutProps> = ({  
  children,  
  showActionButtons = true,  
  publicSellerData,  
  publicSellerLoading,  
  getSellerLogoUrl: externalGetSellerLogoUrl,  
  isPublicPage = false,  
  isOwnProfile = true  
}) => {  
  const location = useLocation();  
  const navigate = useNavigate();  
  const isMobile = useIsMobile();  

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const sellerInfoRef = useRef<HTMLDivElement>(null);
  const previousTabRef = useRef<string>('products');

  // States
  const [isFavorite, setIsFavorite] = useState(false);  

  // Handler functions
  const handleBackClick = () => {
    if (isPublicPage) {
      navigate('/profile');
    } else {
      navigate('/seller-dashboard/products');
    }
  };

  const handleBecomeSeller = () => navigate('/seller-onboarding');  

  const handleShareClick = () => {  
    if (navigator.share) {  
      navigator.share({  
        title: sellerData?.business_name || 'Seller Profile',  
        url: window.location.href,  
      });  
    } else {  
      navigator.clipboard.writeText(window.location.href);  
      console.log('Link copied to clipboard');  
    }  
  };  

  const handleFavoriteClick = () => setIsFavorite(!isFavorite);  

  // Check if current route is edit profile OR product edit
  const isEditProfilePage = location.pathname.includes('/edit-profile');
  const isProductEditPage = location.pathname.includes('/products/edit/');

  // Path calculations
  const isDashboard = location.pathname.includes('/seller-dashboard');  
  const isPickupStation = location.pathname.includes('/pickup-station');  

  const getCurrentTab = () => {  
    if (isDashboard) {  
      const path = location.pathname.split('/seller-dashboard/')[1];  
      return !path || path === '' ? 'products' : path;  
    } else if (isPickupStation) {  
      const path = location.pathname.split('/pickup-station/')[1];  
      return !path || path === '' ? 'overview' : path;  
    } else {  
      const pathParts = location.pathname.split('/seller/')[1]?.split('/');  
      if (pathParts && pathParts.length > 1) return pathParts[1];  
      return 'products';  
    }  
  };  

  const activeTab = getCurrentTab();  
  const isProductsTab = activeTab === 'products';  

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({  
    queryKey: ['products', 'all'],  
    queryFn: fetchAllProducts,  
  });  

  // Route calculations
  const baseRoute = isDashboard  
    ? '/seller-dashboard'  
    : isPickupStation  
    ? '/pickup-station'  
    : `/seller/${location.pathname.split('/seller/')[1]?.split('/')[0] || ''}`;  

  // Navigation items
  const navigationItems = isPickupStation  
    ? [  
        { id: 'overview', name: 'Overview', href: '/pickup-station/overview', icon: Home },  
        { id: 'packages', name: 'Packages', href: '/pickup-station/packages', icon: Package },  
        { id: 'customers', name: 'Customers', href: '/pickup-station/customers', icon: Users },  
        { id: 'reviews', name: 'Reviews', href: '/pickup-station/reviews', icon: Star },  
        { id: 'qa', name: 'Q&A', href: '/pickup-station/qa', icon: MessageSquare },  
        { id: 'analytics', name: 'Analytics', href: '/pickup-station/analytics', icon: BarChart3 },  
        { id: 'notifications', name: 'Notifications', href: '/pickup-station/notifications', icon: MessageCircle },  
        { id: 'settings', name: 'Settings', href: '/pickup-station/settings', icon: Settings },  
      ]  
    : isDashboard  
    ? [  
        { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
        { id: 'reels', name: 'Reels', href: '/seller-dashboard/reels', icon: Megaphone },  
        { id: 'posts', name: 'Posts', href: '/seller-dashboard/posts', icon: FileText },  
        { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },  
        { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },  
        { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },  
        { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },  
        { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },  
        { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },  
        { id: 'edit-profile', name: 'Edit Profile', href: '/seller-dashboard/edit-profile', icon: Edit, hidden: true },  
        { id: 'product-edit', name: 'Edit Product', href: '/seller-dashboard/products/edit/:productId', icon: Edit, hidden: true },  
      ]  
    : [  
        { id: 'products', name: 'Products', href: `${baseRoute}/products`, icon: Package },  
        { id: 'reels', name: 'Reels', href: `${baseRoute}/reels`, icon: Megaphone },  
        { id: 'posts', name: 'Posts', href: `${baseRoute}/posts`, icon: MessageCircle },  
        { id: 'qas', name: 'Q&As', href: `${baseRoute}/qas`, icon: MessageSquare },  
        { id: 'reviews', name: 'Reviews', href: `${baseRoute}/reviews`, icon: Star },  
      ];  

  // Tab change handler
  const handleTabChange = (tabId: string) => {  
    const item = navigationItems.find(nav => nav.id === tabId);  
    if (item) {
      window.scrollTo(0, 0);
      const previousTab = activeTab;
      previousTabRef.current = previousTab;
      navigate(item.href);
    }  
  };  

  // Filter visible tabs
  const visibleTabs = navigationItems.filter(item => !item.hidden);
  const tabs = visibleTabs.map(item => ({  
    id: item.id,  
    label: item.name  
  }));  

  // Fetch seller data
  const { user } = useAuth();  

  const { data: privateSellerData, isLoading: privateSellerLoading } = useQuery({  
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
    enabled: !!user?.id && !isPublicPage,  
  });  

  const sellerData = isPublicPage ? publicSellerData : privateSellerData;  
  const sellerLoading = isPublicPage ? publicSellerLoading : privateSellerLoading;  

  // Logo URL function
  const getSellerLogoUrl =  
    externalGetSellerLogoUrl ||  
    ((imagePath?: string): string => {  
      if (!imagePath)  
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";  
      const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);  
      return data.publicUrl;  
    });  

  // **NEW: Check if seller has a store (has products or is verified)**
  const hasStore = sellerData && (products.length > 0 || sellerData.verified);

  // Custom action buttons for edit pages
  const getEditPageActionButtons = () => {
    if (isEditProfilePage || isProductEditPage) {
      return [  
        {  
          Icon: Save,  
          onClick: () => {
            const saveEvent = new CustomEvent('saveEditProfile');
            window.dispatchEvent(saveEvent);
          },  
          active: false  
        }  
      ];
    }
    return null;
  };

  // Regular action buttons
  const regularActionButtons = [  
    {  
      Icon: Heart,  
      onClick: handleFavoriteClick,  
      active: isFavorite,  
      activeColor: "#f43f5e",  
      count: 147  
    },  
    {  
      Icon: Share,  
      onClick: handleShareClick,  
      active: false  
    }  
  ];  

  // Get page title
  const getPageTitle = () => {
    if (isEditProfilePage) return "Edit Profile";
    if (isProductEditPage) {
      const productId = location.pathname.split('/edit/')[1];
      return productId === 'new' ? "Create Product" : "Edit Product";
    }
    return undefined;
  };

  const header = (
    <div   
      ref={headerRef}   
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"  
    >  
      <ProductHeader  
        onCloseClick={(isEditProfilePage || isProductEditPage) ? () => navigate('/seller-dashboard/products') : handleBackClick}  
        onShareClick={handleShareClick}  
        actionButtons={getEditPageActionButtons() || regularActionButtons}
        forceScrolledState={!isProductsTab || isEditProfilePage || isProductEditPage}
        title={getPageTitle()}
        hideSearch={isEditProfilePage || isProductEditPage}
        showSellerInfo={!(isEditProfilePage || isProductEditPage)}
      />  
    </div>  
  );

  const topContent = isProductsTab && !isEditProfilePage && !isProductEditPage ? (
    <div className="w-full bg-black text-white">  
      <SellerInfoSection  
        sellerData={sellerData}  
        sellerLoading={sellerLoading}  
        getSellerLogoUrl={getSellerLogoUrl}  
        onBecomeSeller={handleBecomeSeller}  
        onBack={handleBackClick}  
        onEditProfile={() => navigate('/seller-dashboard/edit-profile')}
        isOwnProfile={isOwnProfile} 
        sellerStories={[
          { id: 1, type: 'image', url: 'story1.jpg' },
          { id: 2, type: 'video', url: 'story2.mp4' },
          { id: 3, type: 'image', url: 'story3.jpg' },
        ]} 
        showActionButtons={showActionButtons}  
      />  
    </div>  
  ) : undefined;

  // Enhanced children
  const enhancedChildren = React.Children.map(children, child => {  
    if (React.isValidElement(child)) {  
      if (activeTab !== 'products') {  
        return React.cloneElement(child, {  
          products,  
          isLoading: productsLoading || sellerLoading  
        } as any);  
      }  
      return React.cloneElement(child, { isLoading: sellerLoading } as any);  
    }  
    return child;  
  });  

  // Redirect handler
  useEffect(() => {  
    if (  
      location.pathname === '/seller-dashboard' ||  
      location.pathname.endsWith('/seller-dashboard/')  
    ) {  
      navigate('/seller-dashboard/products', { replace: true });  
    } else if (  
      location.pathname === '/pickup-station' ||  
      location.pathname.endsWith('/pickup-station/')  
    ) {  
      navigate('/pickup-station/overview', { replace: true });  
    }  
  }, [location.pathname, navigate]);  

  // **NEW: If no store and on products tab, show enhanced onboarding view with SellerEditProfile structure**
  if (!hasStore && isProductsTab && !isEditProfilePage && !isProductEditPage) {
    return (
      <div className="min-h-screen bg-background">
        {/* Banner Section */}
        <div className="relative">
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

        {/* Profile Image Section - Similar to SellerEditProfile */}
        <div className="relative z-30 -mt-12 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden shadow-lg">
              {sellerData?.image_url ? (
                <img 
                  src={sellerData.image_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              )}
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

          {/* CTA Buttons */}
          <div className="pt-6">
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
          <div className="pt-6 border-t border-gray-200">
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
  }

  return (  
    <StickyTabsLayout
      header={header}
      headerRef={headerRef}
      topContent={topContent}
      topContentRef={sellerInfoRef}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isProductsTab={isProductsTab}
      showTopBorder={false}
      variant="underline"
      stickyBuffer={4}
      alwaysStickyForNonProducts={true}
      hideTabs={isEditProfilePage || isProductEditPage || !hasStore} // **NEW: Hide tabs when no store**
    >
      {enhancedChildren}
    </StickyTabsLayout>
  );  
};  

export default SellerLayout;