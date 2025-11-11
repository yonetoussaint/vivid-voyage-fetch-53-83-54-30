import React, { useState, useRef, useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  
import {   
  Package, ShoppingCart, Users, BarChart3, DollarSign, Megaphone, Settings,  
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

  // States - PRESERVED ALL ORIGINAL STATES
  const [isFavorite, setIsFavorite] = useState(false);  

  // FIXED: Single handleBackClick function
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

  // Check if current route is edit profile
  const isEditProfilePage = location.pathname.includes('/edit-profile');

  // PRESERVED ALL ORIGINAL PATH CALCULATIONS
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

  // PRESERVED ORIGINAL PRODUCTS FETCH
  const { data: products = [], isLoading: productsLoading } = useQuery({  
    queryKey: ['products', 'all'],  
    queryFn: fetchAllProducts,  
  });  

  // PRESERVED ORIGINAL ROUTE CALCULATIONS
  const baseRoute = isDashboard  
    ? '/seller-dashboard'  
    : isPickupStation  
    ? '/pickup-station'  
    : `/seller/${location.pathname.split('/seller/')[1]?.split('/')[0] || ''}`;  

  // UPDATED NAVIGATION ITEMS - Include edit-profile but mark it as hidden
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
        { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },  
        { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },  
        { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },  
        { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },  
        { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },  
        { id: 'reels', name: 'Reels', href: '/seller-dashboard/reels', icon: Megaphone },  
        { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },  
        // Add edit-profile as a hidden navigation item
        { id: 'edit-profile', name: 'Edit Profile', href: '/seller-dashboard/edit-profile', icon: Edit, hidden: true },  
      ]  
    : [  
        { id: 'products', name: 'Products', href: `${baseRoute}/products`, icon: Package },  
        { id: 'reels', name: 'Reels', href: `${baseRoute}/reels`, icon: Megaphone },  
        { id: 'posts', name: 'Posts', href: `${baseRoute}/posts`, icon: MessageCircle },  
        { id: 'qas', name: 'Q&As', href: `${baseRoute}/qas`, icon: MessageSquare },  
        { id: 'reviews', name: 'Reviews', href: `${baseRoute}/reviews`, icon: Star },  
      ];  

  // PRESERVED ORIGINAL TAB CHANGE LOGIC WITH SCROLL RESET
  const handleTabChange = (tabId: string) => {  
    const item = navigationItems.find(nav => nav.id === tabId);  
    if (item) {
      // Scroll to top when changing tabs to ensure proper layout
      window.scrollTo(0, 0);

      const previousTab = activeTab;
      previousTabRef.current = previousTab;

      navigate(item.href);
    }  
  };  

  // Filter out hidden tabs from display but keep them in navigation
  const visibleTabs = navigationItems.filter(item => !item.hidden);
  const tabs = visibleTabs.map(item => ({  
    id: item.id,  
    label: item.name  
  }));  

  // PRESERVED ORIGINAL SELLER DATA FETCHING
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

  // PRESERVED ORIGINAL LOGO URL FUNCTION
  const getSellerLogoUrl =  
    externalGetSellerLogoUrl ||  
    ((imagePath?: string): string => {  
      if (!imagePath)  
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";  
      const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);  
      return data.publicUrl;  
    });  

  // Custom action buttons for edit profile page
  const editProfileActionButtons = [  
    {  
      Icon: Save,  
      onClick: () => {
        // This will be handled by the edit profile component
        const saveEvent = new CustomEvent('saveEditProfile');
        window.dispatchEvent(saveEvent);
      },  
      active: false  
    }  
  ];  

  // Regular action buttons for other pages
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

  const header = (
    <div   
      ref={headerRef}   
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"  
    >  
      <ProductHeader  
        onCloseClick={isEditProfilePage ? () => navigate('/seller-dashboard/products') : handleBackClick}  
        onShareClick={handleShareClick}  
        actionButtons={isEditProfilePage ? editProfileActionButtons : regularActionButtons}
        forceScrolledState={!isProductsTab || isEditProfilePage}
        title={isEditProfilePage ? "Edit Profile" : undefined}
        hideSearch={isEditProfilePage}
        showSellerInfo={!isEditProfilePage}
      />  
    </div>  
  );

  const topContent = isProductsTab && !isEditProfilePage ? (
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
    // ... more stories
  ]} 
        showActionButtons={showActionButtons}  
      />  
    </div>  
  ) : undefined;

  // Enhanced children with additional props - PRESERVED ORIGINAL LOGIC
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

  // ===== REDIRECT HANDLER =====  
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
      hideTabs={isEditProfilePage} // NEW: Hide tabs on edit profile page
    >
      {enhancedChildren}
    </StickyTabsLayout>
  );  
};  

export default SellerLayout;