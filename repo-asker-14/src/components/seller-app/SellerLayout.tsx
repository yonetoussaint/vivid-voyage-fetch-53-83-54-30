import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Warehouse, DollarSign, Megaphone, HelpCircle, Settings,
  Bell, Store
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
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

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/seller-dashboard/')[1];
    return path || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Check if we're on the overview tab
  const isOverviewTab = location.pathname === '/seller-dashboard/overview' || 
                        location.pathname === '/seller-dashboard' ||
                        location.pathname.endsWith('/seller-dashboard/');

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/seller-dashboard/overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', href: '/seller-dashboard/inventory', icon: Warehouse },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'support', name: 'Support', href: '/seller-dashboard/support', icon: HelpCircle },
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

  // Mock seller data - in real app this would come from context or props
  const mockSeller = {
    id: 'seller-123',
    business_name: "John's Store",
    full_name: 'John Doe',
    logo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    followers_count: 1250
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

  // Scroll handling for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current) return;

      const scrollY = window.scrollY;

      // Get current dimensions
      const currentTabsHeight = tabsRef.current.offsetHeight;

      // For non-overview tabs, we don't have seller info, so use a smaller threshold
      const sellerInfoHeight = isOverviewTab ? (sellerInfoRef.current?.offsetHeight || 0) : 0;

      // Update tabs height if it changed
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Calculate scroll progress for header transitions
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / Math.max(sellerInfoHeight, 100)));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky
      // For non-overview tabs, always make tabs sticky since there's no seller info
      const shouldBeSticky = !isOverviewTab || scrollY >= sellerInfoHeight;

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
  }, [isTabsSticky, tabsHeight, headerHeight, isOverviewTab]);

  // Determine header mode based on scroll progress
  const isScrolledState = scrollProgress > 0.3;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        {!isScrolledState ? (
          // Initial state - show seller info with search icon
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left side - Back button and seller info */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBackClick}
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockSeller.logo_url} />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-sm font-semibold">{mockSeller.business_name}</h1>
                    <p className="text-xs text-gray-500">Premium Seller</p>
                  </div>
                </div>
              </div>

              {/* Right side - Search icon */}
              <button className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Scrolled state - show X button, search bar, and notifications
          <div className="px-4 py-2">
            <div className="flex items-center gap-3">
              {/* Left side - X button */}
              <button 
                onClick={handleBackClick}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Middle - Search bar */}
              <div className="flex-1 relative">
                <div className="relative flex items-center h-8 rounded-full bg-gray-100">
                  <div className="absolute left-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search in store..."
                    className="bg-transparent w-full h-full pl-10 pr-3 py-1 text-sm rounded-full outline-none text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Right side - Notifications */}
              <button className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        )}
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
          {/* Seller Info Section - Only show on overview tab */}
          {isOverviewTab && (
            <div ref={sellerInfoRef} className="w-full bg-white border-b">
              <div className="px-4 py-4">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <Avatar className="w-16 h-16 flex-shrink-0">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-gray-900">John's Store</h1>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Premium Seller Dashboard</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⭐ Premium Account</span>
                      <span>📊 Dashboard Analytics</span>
                      <span>🛡️ Verified Business</span>
                    </div>
                  </div>
                </div>
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;