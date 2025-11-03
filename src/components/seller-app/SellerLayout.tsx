import React, { useState, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, DollarSign, Megaphone, Settings,
  Home, Share, MessageCircle, MessageSquare, Star, Heart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TabsNavigation from '@/components/home/TabsNavigation';
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
  const tabsRef = useRef<HTMLDivElement>(null);

  // States
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sellerInfoHeight, setSellerInfoHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [isTabsBounced, setIsTabsBounced] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBackClick = () => navigate('/profile');
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

  const baseRoute = isDashboard
    ? '/seller-dashboard'
    : isPickupStation
    ? '/pickup-station'
    : `/seller/${location.pathname.split('/seller/')[1]?.split('/')[0] || ''}`;

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
      ]
    : [
        { id: 'products', name: 'Products', href: `${baseRoute}/products`, icon: Package },
        { id: 'reels', name: 'Reels', href: `${baseRoute}/reels`, icon: Megaphone },
        { id: 'posts', name: 'Posts', href: `${baseRoute}/posts`, icon: MessageCircle },
        { id: 'qas', name: 'Q&As', href: `${baseRoute}/qas`, icon: MessageSquare },
        { id: 'reviews', name: 'Reviews', href: `${baseRoute}/reviews`, icon: Star },
      ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) navigate(item.href);
  };

  const tabs = navigationItems.map(item => ({
    id: item.id,
    label: item.name
  }));

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

  const getSellerLogoUrl =
    externalGetSellerLogoUrl ||
    ((imagePath?: string): string => {
      if (!imagePath)
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
      const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
      return data.publicUrl;
    });

  const actionButtons = [
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

  // ===== MEASURE HEIGHTS =====
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight || 0);
      if (isProductsTab && sellerInfoRef.current)
        setSellerInfoHeight(sellerInfoRef.current.offsetHeight || 0);
      if (tabsRef.current) setTabsHeight(tabsRef.current.offsetHeight || 0);
    };
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [isProductsTab]);

  // ===== REDIRECT HANDLER =====
  useLayoutEffect(() => {
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
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <ProductHeader
          onCloseClick={handleBackClick}
          onShareClick={handleShareClick}
          actionButtons={actionButtons}
          forceScrolledState={!isProductsTab}
        />
      </div>

      {/* SELLER INFO */}
      {isProductsTab && (
        <div 
          ref={sellerInfoRef} 
          className="w-full bg-black text-white relative"
          style={{ 
            marginTop: `-${headerHeight}px`,
            paddingTop: `${headerHeight}px`,
          }}
        >
          <SellerInfoSection
            sellerData={sellerData}
            sellerLoading={sellerLoading}
            getSellerLogoUrl={getSellerLogoUrl}
            onBecomeSeller={handleBecomeSeller}
            onBack={handleBackClick}
            isOwnProfile={isOwnProfile}
            showActionButtons={showActionButtons}
          />
        </div>
      )}

      {/* STICKY TABS */}
      <div style={{ minHeight: tabsHeight }}>
        <div
          ref={tabsRef}
          className={`sticky z-40 top-[${headerHeight}px] bg-white shadow-sm transition-all duration-500 ${
            isTabsBounced ? 'animate-slideDownBounce' : ''
          }`}
          onAnimationEnd={() => setIsTabsBounced(false)}
        >
          <TabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showTopBorder={true}
            variant="underline"
            className="bg-white shadow-sm"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ paddingTop: !isProductsTab ? `${headerHeight}px` : '0px' }}>
        {React.Children.map(children, child => {
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
        })}
      </div>
    </div>
  );
};

export default SellerLayout;