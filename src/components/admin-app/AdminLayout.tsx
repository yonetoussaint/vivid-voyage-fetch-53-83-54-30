import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, BarChart3, 
  Shield, AlertTriangle, MessageSquare, DollarSign, FolderTree,
  Lock, Mail, FileText, HelpCircle, Settings, Bell, UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import TabsNavigation from '@/components/home/TabsNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const adminInfoRef = useRef<HTMLDivElement>(null);

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
    const path = location.pathname.split('/admin-dashboard/')[1];
    return path || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Sync activeTab with location changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Check if we're on the overview tab
  const isOverviewTab = location.pathname === '/admin-dashboard/overview' || 
                        location.pathname === '/admin-dashboard' ||
                        location.pathname.endsWith('/admin-dashboard/');

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/admin-dashboard/overview', icon: LayoutDashboard },
    { id: 'users', name: 'Users', href: '/admin-dashboard/users', icon: Users },
    { id: 'sellers', name: 'Sellers', href: '/admin-dashboard/sellers', icon: UserCheck },
    { id: 'products', name: 'Products', href: '/admin-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/admin-dashboard/orders', icon: ShoppingCart },
    { id: 'reports', name: 'Reports', href: '/admin-dashboard/reports', icon: AlertTriangle },
    { id: 'banners', name: 'Banners', href: '/admin-dashboard/banners', icon: MessageSquare },
    { id: 'content', name: 'Content', href: '/admin-dashboard/content', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', href: '/admin-dashboard/analytics', icon: BarChart3 },
    { id: 'payments', name: 'Payments', href: '/admin-dashboard/payments', icon: DollarSign },
    { id: 'categories', name: 'Categories', href: '/admin-dashboard/categories', icon: FolderTree },
    { id: 'security', name: 'Security', href: '/admin-dashboard/security', icon: Lock },
    { id: 'communications', name: 'Communications', href: '/admin-dashboard/communications', icon: Mail },
    { id: 'logs', name: 'System Logs', href: '/admin-dashboard/logs', icon: FileText },
    { id: 'support', name: 'Support', href: '/admin-dashboard/support', icon: HelpCircle },
    { id: 'settings', name: 'Settings', href: '/admin-dashboard/settings', icon: Settings },
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

  // Mock admin data - in real app this would come from context or props
  const mockAdmin = {
    id: 'admin-001',
    name: 'Administrator',
    role: 'Super Admin',
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    permissions: ['all']
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

      // For non-overview tabs, we don't have admin info, so use a smaller threshold
      const adminInfoHeight = isOverviewTab ? (adminInfoRef.current?.offsetHeight || 0) : 0;

      // Update tabs height if it changed
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Calculate scroll progress for header transitions
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / Math.max(adminInfoHeight, 100)));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky
      // For non-overview tabs, always make tabs sticky since there's no admin info
      const shouldBeSticky = !isOverviewTab || scrollY >= adminInfoHeight;

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
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30 bg-red-600/95 backdrop-blur-sm border-b border-red-700">
        {!isScrolledState ? (
          // Initial state - show admin info with search icon
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left side - Back button and admin info */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBackClick}
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-red-700 hover:bg-red-800 transition-colors text-white"
                  aria-label="Go back to profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockAdmin.avatar_url} />
                    <AvatarFallback className="bg-red-700 text-white">AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-sm font-semibold text-white">Admin Panel</h1>
                    <p className="text-xs text-red-200">System Administrator</p>
                  </div>
                </div>
              </div>

              {/* Right side - Search icon */}
              <button className="h-8 w-8 rounded-full flex items-center justify-center bg-red-700 hover:bg-red-800 transition-colors text-white" aria-label="Search admin panel">
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
                className="h-8 w-8 rounded-full flex items-center justify-center bg-red-700 hover:bg-red-800 transition-colors text-white"
                aria-label="Close admin panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Middle - Search bar */}
              <div className="flex-1 relative">
                <div className="relative flex items-center h-8 rounded-full bg-red-700">
                  <div className="absolute left-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="bg-transparent w-full h-full pl-10 pr-3 py-1 text-sm rounded-full outline-none text-white placeholder-red-200"
                  />
                </div>
              </div>

              {/* Right side - Notifications */}
              <button className="h-8 w-8 rounded-full flex items-center justify-center bg-red-700 hover:bg-red-800 transition-colors relative text-white" aria-label="View notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-red-900 text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  7
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
          {/* Admin Info Section - Only show on overview tab */}
          {isOverviewTab && (
            <div ref={adminInfoRef} className="w-full bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800">
              <div className="px-4 py-4">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <Avatar className="w-16 h-16 flex-shrink-0 ring-4 ring-red-400">
                    <AvatarImage src={mockAdmin.avatar_url} />
                    <AvatarFallback className="bg-red-800 text-white text-lg font-bold">AD</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-red-600" />
                      </div>
                      <h1 className="text-xl font-bold text-white">Administration Panel</h1>
                    </div>
                    <p className="text-sm text-red-200 mb-2">Platform Management & Moderation</p>
                    <div className="flex items-center gap-4 text-xs text-red-200">
                      <span>🛡️ Super Admin Access</span>
                      <span>📊 System Monitoring</span>
                      <span>⚡ Real-time Controls</span>
                      <span>🔒 Security Management</span>
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

export default AdminLayout;