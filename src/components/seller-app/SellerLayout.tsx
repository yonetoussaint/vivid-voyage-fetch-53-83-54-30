import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, DollarSign, Megaphone, Settings, Home, Share, MessageCircle, MessageSquare, Star, ExternalLink 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TabsNavigation from '@/components/home/TabsNavigation';
import SellerInfoSection from './SellerInfoSection';
import ProductHeader from '@/components/product/ProductHeader';

// ============================================
// REUSABLE STICKY WRAPPER COMPONENT
// ============================================
interface StickyWrapperProps {
  children: (isSticky: boolean) => React.ReactNode;
  offsetTop: number;
  className?: string;
}

function StickyWrapper({ children, offsetTop, className = '' }: StickyWrapperProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [elementHeight, setElementHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Measure content height
    const updateHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.offsetHeight;
        if (height > 0) {
          setElementHeight(height);
        }
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      setIsSticky(containerTop <= offsetTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [offsetTop]);

  return (
    <div 
      ref={containerRef}
      style={{ height: isSticky ? `${elementHeight}px` : 'auto' }}
    >
      <div
        ref={contentRef}
        className={className}
        style={isSticky ? {
          position: 'fixed',
          top: `${offsetTop}px`,
          left: 0,
          right: 0,
          zIndex: 40
        } : {
          position: 'relative'
        }}
      >
        {children(isSticky)}
      </div>
    </div>
  );
}

// ============================================
// MAIN SELLER LAYOUT COMPONENT
// ============================================
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
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleBecomeSeller = () => {
    console.log('Start seller onboarding');
    navigate('/seller-onboarding');
  };

  const handleShareClick = () => {
    console.log('Share seller profile');
    if (navigator.share) {
      navigator.share({
        title: sellerData?.business_name || 'Seller Profile',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLinkClick = () => {
    console.log('Link button clicked');
    navigator.clipboard.writeText(window.location.href);
  };

  // Determine current route context
  const isDashboard = location.pathname.includes('/seller-dashboard');
  const isPickupStation = location.pathname.includes('/pickup-station');

  // Extract current tab from pathname
  const getCurrentTab = () => {
    if (isDashboard) {
      const path = location.pathname.split('/seller-dashboard/')[1];
      return !path || path === '' ? 'products' : path;
    } else if (isPickupStation) {
      const path = location.pathname.split('/pickup-station/')[1];
      return !path || path === '' ? 'overview' : path;
    } else {
      const pathParts = location.pathname.split('/seller/')[1]?.split('/');
      return pathParts && pathParts.length > 1 ? pathParts[1] : 'products';
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

  // Navigation items configuration
  const navigationItems = isPickupStation ? [
    { id: 'overview', name: 'Overview', href: '/pickup-station/overview', icon: Home },
    { id: 'packages', name: 'Packages', href: '/pickup-station/packages', icon: Package },
    { id: 'customers', name: 'Customers', href: '/pickup-station/customers', icon: Users },
    { id: 'reviews', name: 'Reviews', href: '/pickup-station/reviews', icon: Star },
    { id: 'qa', name: 'Q&A', href: '/pickup-station/qa', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', href: '/pickup-station/analytics', icon: BarChart3 },
    { id: 'notifications', name: 'Notifications', href: '/pickup-station/notifications', icon: MessageCircle },
    { id: 'settings', name: 'Settings', href: '/pickup-station/settings', icon: Settings },
  ] : isDashboard ? [
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'reels', name: 'Reels', href: '/seller-dashboard/reels', icon: Megaphone },
    { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ] : [
    { id: 'products', name: 'Products', href: `${baseRoute}/products`, icon: Package },
    { id: 'reels', name: 'Reels', href: `${baseRoute}/reels`, icon: Megaphone },
    { id: 'posts', name: 'Posts', href: `${baseRoute}/posts`, icon: MessageCircle },
    { id: 'qas', name: 'Q&As', href: `${baseRoute}/qas`, icon: MessageSquare },
    { id: 'reviews', name: 'Reviews', href: `${baseRoute}/reviews`, icon: Star },
  ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      navigate(item.href);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = navigationItems.map(item => ({
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

  const getSellerLogoUrl = externalGetSellerLogoUrl || ((imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  });

  const actionButtons = [
    {
      Icon: ExternalLink,
      onClick: handleLinkClick,
      active: false,
      count: undefined
    },
    {
      Icon: Share,
      onClick: handleShareClick,
      active: false,
      count: undefined
    }
  ];

  // Measure header height
  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
        }
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Handle redirects for empty paths
  useEffect(() => {
    if (location.pathname === '/seller-dashboard' || 
        location.pathname.endsWith('/seller-dashboard/')) {
      navigate('/seller-dashboard/products', { replace: true });
    } else if (location.pathname === '/pickup-station' || 
               location.pathname.endsWith('/pickup-station/')) {
      navigate('/pickup-station/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-50 bg-white"
      >
        <ProductHeader
          showCloseIcon={false}
          onCloseClick={handleBackClick}
          actionButtons={actionButtons}
          sellerMode={false}
          stickyMode={true}
          inPanel={false}
          showDetailsButton={false}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showTabs={true}
          isTabsSticky={false}
        />
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: `${headerHeight}px` }} />

      {/* Seller Info Section - Only on products tab */}
      {isProductsTab && (
        <div className="w-full bg-black text-white">
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

      {/* Sticky Tabs Navigation */}
      <StickyWrapper offsetTop={headerHeight}>
        {(isSticky) => (
          <nav className="bg-white border-b border-gray-200">
            <TabsNavigation 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showTopBorder={false}
              variant="underline"
            />
          </nav>
        )}
      </StickyWrapper>

      {/* Main Content */}
      <div>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            if (activeTab !== 'products') {
              return React.cloneElement(child, { 
                products, 
                isLoading: productsLoading || sellerLoading
              } as any);
            }
            return React.cloneElement(child, { 
              isLoading: sellerLoading
            } as any);
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default SellerLayout;