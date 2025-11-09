import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, 
  Heart, Settings, User, MapPin, CreditCard,
  Bell, Store, LogIn, Shield, Star, Lock, ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth/AuthContext';
import TabsNavigation from '@/components/home/TabsNavigation';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();

  // If user is not authenticated, show the dedicated login page
  if (!isAuthenticated) {
    return <ProfileLoginPage onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />;
  }

  // Original authenticated user layout continues below...
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const userInfoRef = useRef<HTMLDivElement>(null);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleBackClick = () => {
    navigate('/');
  };

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/profile/')[1];
    return path || 'orders'; // Default to 'orders' instead of 'dashboard'
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Keep activeTab in sync with route changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);

  // Redirect to orders tab if on root profile path
  useEffect(() => {
    if (location.pathname === '/profile' || location.pathname.endsWith('/profile/')) {
      navigate('/profile/orders', { replace: true });
      setActiveTab('orders');
    }
  }, [location.pathname, navigate]);

  // Check if we're on the orders tab (which is now the first/default tab)
  const isOrdersTab = location.pathname === '/profile/orders' || 
                     location.pathname === '/profile' ||
                     location.pathname.endsWith('/profile/');

  const navigationItems = [
    { id: 'orders', name: 'Orders', href: '/profile/orders', icon: ShoppingCart },
    { id: 'wishlist', name: 'Wishlist', href: '/profile/wishlist', icon: Heart },
    { id: 'addresses', name: 'Addresses', href: '/profile/addresses', icon: MapPin },
    { id: 'payments', name: 'Payments', href: '/profile/payments', icon: CreditCard },
    { id: 'analytics', name: 'Analytics', href: '/profile/analytics', icon: BarChart3 },
    { id: 'reviews', name: 'Reviews', href: '/profile/reviews', icon: Users },
    { id: 'settings', name: 'Settings', href: '/profile/settings', icon: Settings },
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

  // User data - in real app this would come from context
  const mockUser = {
    id: user?.id || 'user-123',
    full_name: user?.full_name || user?.email?.split('@')[0] || 'John Doe',
    email: user?.email || 'john@example.com',
    avatar_url: user?.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`,
    member_since: '2023',
    verified: true
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

      // For non-orders tabs, we don't have user info, so use a smaller threshold
      const userInfoHeight = isOrdersTab ? (userInfoRef.current?.offsetHeight || 0) : 0;

      // Update tabs height if it changed
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Calculate scroll progress for header transitions
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / Math.max(userInfoHeight, 100)));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky
      // For non-orders tabs, always make tabs sticky since there's no user info
      const shouldBeSticky = !isOrdersTab || scrollY >= userInfoHeight;

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
  }, [isTabsSticky, tabsHeight, headerHeight, isOrdersTab]);

  // Determine header mode based on scroll progress
  const isScrolledState = scrollProgress > 0.3;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-1.5 py-1">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <ReusableSearchBar
                placeholder="Search orders, products..."
                onSubmit={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="w-full"
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
          {/* User Info Section - Only show on orders tab (which is now the first tab) */}
          {isOrdersTab && (
            <div ref={userInfoRef} className="w-full bg-white border-b">
              <div className="px-4 py-4">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <Avatar className="w-16 h-16 flex-shrink-0">
                    <AvatarImage src={mockUser.avatar_url} />
                    <AvatarFallback>
                      {mockUser.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-gray-900">{mockUser.full_name}</h1>
                      {mockUser.verified && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{mockUser.email}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👤 Member since {mockUser.member_since}</span>
                      <span>📊 Profile Dashboard</span>
                      {mockUser.verified && <span>✅ Verified Account</span>}
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
          <div className="px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Separate Login Page for Non-Authenticated Users (unchanged)
// ... (keep the existing ProfileLoginPage component as is)

export default ProfileLayout;