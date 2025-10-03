
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, 
  DollarSign, Megaphone, Settings, Home
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
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

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleBackClick = () => {
    navigate('/profile');
  };

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/seller-dashboard/')[1];
    if (!path || path === '') {
      if (location.pathname === '/seller-dashboard' || 
          location.pathname.endsWith('/seller-dashboard/')) {
        navigate('/seller-dashboard/overview', { replace: true });
      }
      return 'overview';
    }
    return path;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/seller-dashboard/overview', icon: Home },
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

  // Update active tab when location changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);

    // Ensure root paths redirect to overview
    if (location.pathname === '/seller-dashboard' || 
        location.pathname.endsWith('/seller-dashboard/')) {
      navigate('/seller-dashboard/overview', { replace: true });
    }
  }, [location.pathname]);

  // Scroll handling for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current) return;

      const scrollY = window.scrollY;

      // Get current dimensions
      const currentTabsHeight = tabsRef.current.offsetHeight;

      // Update tabs height if it changed
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Calculate scroll progress for header transitions
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / 100));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky (always sticky on scroll)
      const shouldBeSticky = scrollY > 0;

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
  }, [isTabsSticky, tabsHeight, headerHeight]);

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
          {/* Tabs Navigation - Directly below header */}
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
