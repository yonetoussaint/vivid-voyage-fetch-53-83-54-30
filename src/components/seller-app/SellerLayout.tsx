// In SellerLayout.tsx - Add the necessary state and imports

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

interface SellerLayoutProps {
  children: React.ReactNode;
  showActionButtons?: boolean;
  publicSellerData?: any;
  publicSellerLoading?: boolean;
  getSellerLogoUrl?: (imagePath?: string) => string;
  isPublicPage?: boolean;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ 
  children, 
  showActionButtons = true,
  publicSellerData,
  publicSellerLoading,
  getSellerLogoUrl: externalGetSellerLogoUrl,
  isPublicPage = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sellerInfoRef = useRef<HTMLDivElement>(null);

  // State for ProductHeaderSection - similar to ProductDetailLayout
  const [activeSection, setActiveSection] = useState('overview');
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [sellerInfoHeight, setSellerInfoHeight] = useState<number>(0);
  const [isTransparentHeader, setIsTransparentHeader] = useState(true);

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleBecomeSeller = () => {
    console.log('Start seller onboarding');
    navigate('/seller-onboarding');
  };

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: sellerData?.business_name || 'Seller Profile',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Show toast notification
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLinkClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Show toast notification
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  // Determine if we're in dashboard, pickup station, or public seller page
  const isDashboard = location.pathname.includes('/seller-dashboard');
  const isPickupStation = location.pathname.includes('/pickup-station');

  // Extract current tab from pathname
  const getCurrentTab = () => {
    if (isDashboard) {
      const path = location.pathname.split('/seller-dashboard/')[1];
      if (!path || path === '') {
        return 'products';
      }
      return path;
    } else if (isPickupStation) {
      const path = location.pathname.split('/pickup-station/')[1];
      if (!path || path === '') {
        return 'overview';
      }
      return path;
    } else {
      // For public seller pages, extract tab from path
      const pathParts = location.pathname.split('/seller/')[1]?.split('/');
      if (pathParts && pathParts.length > 1) {
        return pathParts[1];
      }
      return 'products';
    }
  };

  // Derive activeTab from current route - SINGLE SOURCE OF TRUTH
  const activeTab = getCurrentTab();

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });

  // Check if we're on the products tab (which now shows seller info)
  const isProductsTab = activeTab === 'products';

  const baseRoute = isDashboard ? '/seller-dashboard' : isPickupStation ? '/pickup-station' : `/seller/${location.pathname.split('/seller/')[1]?.split('/')[0] || ''}`;

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

  const { user } = useAuth();

  // Use public data if on public page, otherwise fetch authenticated seller data
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

  // Use public or private seller data based on page type
  const sellerData = isPublicPage ? publicSellerData : privateSellerData;
  const sellerLoading = isPublicPage ? publicSellerLoading : privateSellerLoading;

  const getSellerLogoUrl = externalGetSellerLogoUrl || ((imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  });

  // Handler for tab change in header
  const handleHeaderTabChange = (section: string) => {
    setActiveSection(section);
    // You can add scroll logic here if needed
  };

  // Handler for product details click
  const handleProductDetailsClick = () => {
    // Not used in seller layout, but required by ProductHeaderSection
    console.log('Product details clicked');
  };

  // Measure heights with ResizeObserver
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
        }
      }
      if (sellerInfoRef.current && isProductsTab) {
        const height = sellerInfoRef.current.offsetHeight;
        if (height > 0) {
          setSellerInfoHeight(height);
        }
      }
      if (tabsRef.current) {
        const height = tabsRef.current.offsetHeight;
        if (height > 0) {
          setTabsHeight(height);
        }
      }
    };

    updateHeights();
    const resizeObserver = new ResizeObserver(updateHeights);

    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (sellerInfoRef.current && isProductsTab) resizeObserver.observe(sellerInfoRef.current);
    if (tabsRef.current) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, [isProductsTab]);

  // Handle sticky tabs with scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !headerRef.current) return;

      const currentHeaderHeight = headerRef.current.offsetHeight;
      const scrollY = window.scrollY;

      if (isTabsSticky) {
        let tabsNaturalTopInViewport;
        if (isProductsTab) {
          tabsNaturalTopInViewport = sellerInfoHeight - scrollY;
        } else {
          tabsNaturalTopInViewport = headerHeight - scrollY;
        }

        if (tabsNaturalTopInViewport > currentHeaderHeight) {
          setIsTabsSticky(false);
        }
      } else {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const tabsTopRelativeToViewport = tabsRect.top;
        if (tabsTopRelativeToViewport <= currentHeaderHeight) {
          setIsTabsSticky(true);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isTabsSticky, isProductsTab, sellerInfoHeight, headerHeight]);

  // Handle header transparency for products tab
  useEffect(() => {
    if (!isProductsTab) {
      setIsTransparentHeader(false);
      return;
    }

    if (!headerHeight || !sellerInfoHeight) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const transparencyThreshold = sellerInfoHeight * 0.3;
      setIsTransparentHeader(scrollY < transparencyThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isProductsTab, headerHeight, sellerInfoHeight]);

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
      {/* Header - Using ProductHeaderSection exactly like in ProductDetailLayout */}
      <div ref={headerRef} className="relative z-50">
        <ProductHeaderSection
          ref={headerRef}
          activeSection={activeSection}
          onTabChange={handleHeaderTabChange}
          focusMode={focusMode}
          showHeaderInFocus={showHeaderInFocus}
          onProductDetailsClick={handleProductDetailsClick}
          currentImageIndex={currentImageIndex}
          totalImages={totalImages}
          onShareClick={handleShareClick}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-screen">
        <main>
          {/* Seller Info Section - Only on products tab */}
          {isProductsTab && (
            <div 
              ref={sellerInfoRef} 
              className="w-full bg-black text-white relative z-30"
            >
              <SellerInfoSection
                sellerData={sellerData}
                sellerLoading={sellerLoading}
                getSellerLogoUrl={getSellerLogoUrl}
                onBecomeSeller={handleBecomeSeller}
                onBack={handleBackClick}
                showActionButtons={showActionButtons}
              />
            </div>
          )}

          {/* Spacer for non-products tabs */}
          {!isProductsTab && (
            <div style={{ height: `${headerHeight}px` }} />
          )}

          {/* Tabs Navigation */}
          <nav
            ref={tabsRef}
            className={`bg-white transition-all duration-200 ${
              isTabsSticky
                ? 'fixed left-0 right-0 z-40'
                : 'relative'
            }`}
            style={{
              top: isTabsSticky ? `${headerHeight}px` : 'auto',
            }}
          >
            <TabsNavigation 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showTopBorder={true}
              variant="underline"
            />
          </nav>

          {/* Spacer when tabs are sticky */}
          {isTabsSticky && (
            <div style={{ height: `${tabsHeight}px` }} aria-hidden="true" />
          )}

          {/* Main Content */}
          <div className="px-2">
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
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;