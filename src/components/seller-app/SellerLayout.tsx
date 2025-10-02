import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, 
  DollarSign, Megaphone, Settings,
  Bell, Store
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { supabase } from '@/integrations/supabase/client';

import TabsNavigation from '@/components/home/TabsNavigation';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sellerInfoRef = useRef<HTMLDivElement>(null);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleBackClick = () => {
    navigate('/profile');
  };

  // Extract current tab from pathname - Completely remove overview
  const getCurrentTab = () => {
    const path = location.pathname.split('/seller-dashboard/')[1];
    // If no specific tab is specified, it's the root, or it's overview, default to products
    if (!path || path === '' || path === 'overview') {
      // Redirect to products if on overview or root
      if (location.pathname === '/seller-dashboard' || 
          location.pathname === '/seller-dashboard/overview' ||
          location.pathname.endsWith('/seller-dashboard/')) {
        navigate('/seller-dashboard/products', { replace: true });
      }
      return 'products';
    }
    return path;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });

  // Check if we're on the products tab
  const isProductsTab = activeTab === 'products';

  const navigationItems = [
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      setActiveTab(tabId);
      navigate(item.href);
    }

    // Scroll to top smoothly when changing tabs
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Convert navigation items to tabs format
  const tabs = navigationItems.map(item => ({
    id: item.id,
    label: item.name
  }));

  // Get authenticated user
  const { user } = useAuth();
  
  // Fetch seller data for the current user
  const { data: sellerData, isLoading: sellerLoading } = useSellerByUserId(user?.id || '');
  
  // Get seller logo URL
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };
  
  // Use real seller data or fallback
  const seller = sellerData || {
    id: user?.id || 'seller-123',
    name: user?.full_name || "My Store",
    image_url: undefined,
    followers_count: 0
  };

  // Header height calculation for positioning elements
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
        }
      }
    };

    // Force multiple measurement attempts to ensure we catch it
    const measureMultipleTimes = () => {
      updateHeight();
      requestAnimationFrame(updateHeight);
      setTimeout(updateHeight, 0);
      setTimeout(updateHeight, 10);
      setTimeout(updateHeight, 50);
      setTimeout(updateHeight, 100);
    };

    measureMultipleTimes();

    // Use ResizeObserver for ongoing updates
    if (headerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          if (height > 0 && height !== headerHeight) {
            setHeaderHeight(height);
          }
        }
      });
      resizeObserverRef.current.observe(headerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Update active tab when location changes and handle overview redirect
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);

    // Ensure overview paths redirect to products
    if (location.pathname === '/seller-dashboard' || 
        location.pathname === '/seller-dashboard/overview' ||
        location.pathname.endsWith('/seller-dashboard/')) {
      navigate('/seller-dashboard/products', { replace: true });
    }
  }, [location.pathname]);

  // Scroll handling for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current) return;

      const scrollY = window.scrollY;

      // Get current dimensions
      const currentTabsHeight = tabsRef.current.offsetHeight;

      // For non-products tabs, we don't have seller info, so use a smaller threshold
      const sellerInfoHeight = isProductsTab ? (sellerInfoRef.current?.offsetHeight || 0) : 0;

      // Update tabs height if it changed
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Calculate scroll progress for header transitions
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / Math.max(sellerInfoHeight, 100)));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky
      // For non-products tabs, always make tabs sticky since there's no seller info
      const shouldBeSticky = !isProductsTab || scrollY >= sellerInfoHeight;

      // Only update state if it changed
      if (shouldBeSticky !== isTabsSticky) {
        setIsTabsSticky(shouldBeSticky);
      }
    };

    // Use RAF for smooth performance
    let rafId: number;
    const smoothScrollHandler = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    // Initial setup
    const setupTimeout = setTimeout(() => {
      handleScroll();
      window.addEventListener('scroll', smoothScrollHandler, { passive: true });
    }, 100);

    return () => {
      clearTimeout(setupTimeout);
      window.removeEventListener('scroll', smoothScrollHandler);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isTabsSticky, tabsHeight, headerHeight, isProductsTab]);

  // Determine header mode based on scroll progress
  const isScrolledState = scrollProgress > 0.3;

  return (
    <div className="min-h-screen bg-white">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-gray-200">
        <div className="px-1.5 py-1">
          <div className="flex items-center justify-center">
            {/* Full width search bar only */}
            <div className="w-full max-w-2xl">
              <ReusableSearchBar
                placeholder="Search in store..."
                showScanMic={true}
                showSettingsButton={!isScrolledState}
                onSettingsClick={() => console.log('Seller settings clicked')}
                onSubmit={(query) => {
                  // Implement seller-specific search
                  console.log('Searching for:', query);
                  // navigate(`/seller-dashboard/search?q=${encodeURIComponent(query)}`);
                }}
                onSearchClose={handleBackClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Dynamic padding based on actual header height */}
      <div 
        className="relative"
        style={{
          paddingTop: headerHeight !== null ? `${headerHeight}px` : '0px',
          minHeight: '100vh'
        }}
      >
        <main>
          {/* Seller Info Section - Only show on products tab */}
          {isProductsTab && (
            <div ref={sellerInfoRef} className="w-full bg-white border-b">
              <div className="px-4 py-4">
                {sellerLoading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={getSellerLogoUrl(seller.image_url)} />
                      <AvatarFallback>{seller.name?.substring(0, 2).toUpperCase() || 'SE'}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">{seller.name}</h1>
                        {sellerData?.verified && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {sellerData?.verified ? 'Premium Seller Dashboard' : 'Seller Dashboard'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>👥 {seller.followers_count} followers</span>
                        {sellerData?.total_sales > 0 && (
                          <span>📦 {sellerData.total_sales} sales</span>
                        )}
                        {sellerData?.verified && <span>✓ Verified</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs Navigation with improved sticky behavior */}
          <nav
            ref={tabsRef}
            className={`bg-white border-b transition-all duration-200 ease-out ${
              isTabsSticky
                ? 'fixed left-0 right-0 z-40 shadow-sm'
                : 'relative'
            }`}
            style={{
              top: isTabsSticky ? `${headerHeight || 0}px` : 'auto',
            }}
          >
            <TabsNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </nav>

          {/* Spacer div when tabs are sticky to prevent content jumping */}
          {isTabsSticky && (
            <div
              style={{ 
                height: `${tabsHeight}px`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Main Content */}
          <div className="w-full">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { 
                  products, 
                  isLoading: productsLoading 
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