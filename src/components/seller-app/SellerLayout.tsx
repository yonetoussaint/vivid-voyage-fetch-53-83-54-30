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
import SellerOnboarding from '@/components/seller-app/pages/SellerOnboarding';
import ProductHeader from '@/components/product/ProductHeader';
import HeroBanner from '@/components/home/HeroBanner';  
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

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
  const [onboardingStep, setOnboardingStep] = useState(1); // Track onboarding progress

  // Language context
  const { 
    currentLanguage, 
    setLanguage, 
    supportedLanguages,
    currentLocation 
  } = useLanguageSwitcher();

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

  // Language change handler
  const handleLanguageChange = (language: any) => {
    console.log('Language changed in SellerLayout:', language);
    setLanguage(language.code);
  };

  // Location screen handler
  const handleOpenLocationScreen = () => {
    console.log('Open location screen from SellerLayout');
    // You can implement your location screen logic here
    // For now, we'll just log it
  };

  // Check if current route is edit profile, product edit, or onboarding
  const isEditProfilePage = location.pathname.includes('/edit-profile');
  const isProductEditPage = location.pathname.includes('/products/edit/');
  const isOnboardingPage = location.pathname.includes('/onboarding');

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
        { id: 'onboarding', name: 'Onboarding', href: '/seller-dashboard/onboarding', icon: Package, hidden: true },  
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

  // Custom action buttons for edit pages and onboarding
  const getEditPageActionButtons = () => {
    if (isEditProfilePage || isProductEditPage || isOnboardingPage) {
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
    if (isOnboardingPage) return "Become a Seller";
    return undefined;
  };

  // Get onboarding step from children (passed up from SellerOnboarding)
  const getOnboardingStep = () => {
    return onboardingStep;
  };

  // Function to update onboarding step (will be passed to children)
  const updateOnboardingStep = (step: number) => {
    setOnboardingStep(step);
  };

  // In the SellerLayout component, update the header section:

const header = (
  <div   
    ref={headerRef}   
    className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"  
  >  
    <ProductHeader  
      onCloseClick={(isEditProfilePage || isProductEditPage || isOnboardingPage) ? () => navigate('/seller-dashboard/products') : handleBackClick}  
      onShareClick={handleShareClick}  
      actionButtons={getEditPageActionButtons() || regularActionButtons}
      forceScrolledState={!isProductsTab || isEditProfilePage || isProductEditPage || isOnboardingPage}
      title={getPageTitle()}
      hideSearch={isEditProfilePage || isProductEditPage || isOnboardingPage}
      showSellerInfo={!(isEditProfilePage || isProductEditPage || isOnboardingPage)}
      // Progress Bar Props - Only show on onboarding page
      showProgressBar={isOnboardingPage}
      currentStep={getOnboardingStep()}
      totalSteps={4}
      progressBarColor="bg-blue-600"
      // Language Context Props - Pass actual values from context
      currentLanguage={currentLanguage}
      currentLocation={currentLocation}
      supportedLanguages={supportedLanguages}
      onLanguageChange={handleLanguageChange}
      onOpenLocationScreen={handleOpenLocationScreen}
      // NEW: Show language selector instead of settings button on onboarding page
      showLanguageSelector={isOnboardingPage}
      showSettingsButton={!isOnboardingPage} // Hide settings button on onboarding
    />  
  </div>  
);

  const topContent = isProductsTab && !isEditProfilePage && !isProductEditPage && !isOnboardingPage ? (
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

  // Enhanced children with onboarding step tracking
  const enhancedChildren = React.Children.map(children, child => {  
    if (React.isValidElement(child)) {  
      // Pass onboarding step tracking to SellerOnboarding
      if (isOnboardingPage) {
        return React.cloneElement(child, {  
          onStepChange: updateOnboardingStep,
          currentStep: onboardingStep
        } as any);  
      }

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

  // **NEW: If no store and on products tab, redirect to separate onboarding page**
  useEffect(() => {
    if (!hasStore && isProductsTab && !isEditProfilePage && !isProductEditPage && !isOnboardingPage && !sellerLoading) {
      navigate('/seller-dashboard/onboarding', { replace: true });
    }
  }, [hasStore, isProductsTab, isEditProfilePage, isProductEditPage, isOnboardingPage, sellerLoading, navigate]);

  // Reset onboarding step when leaving onboarding page
  useEffect(() => {
    if (!isOnboardingPage) {
      setOnboardingStep(1);
    }
  }, [isOnboardingPage]);

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
      hideTabs={isEditProfilePage || isProductEditPage || isOnboardingPage || !hasStore} // **NEW: Hide tabs when no store or on edit/onboarding pages**
    >
      {enhancedChildren}
    </StickyTabsLayout>
  );  
};  

export default SellerLayout;