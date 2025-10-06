
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, MapPin, Clock, BarChart3, Settings, Home, Users, Bell
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import TabsNavigation from '@/components/home/TabsNavigation';
import { useAuth } from '@/contexts/auth/AuthContext';

interface PickupStationLayoutProps {
  children: React.ReactNode;
}

const PickupStationLayout: React.FC<PickupStationLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const { user } = useAuth();

  const handleBackClick = () => {
    navigate('/profile');
  };

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/pickup-station/')[1];
    if (!path || path === '') {
      return 'overview';
    }
    return path;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/pickup-station/overview', icon: Home },
    { id: 'packages', name: 'Packages', href: '/pickup-station/packages', icon: Package },
    { id: 'customers', name: 'Customers', href: '/pickup-station/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/pickup-station/analytics', icon: BarChart3 },
    { id: 'notifications', name: 'Notifications', href: '/pickup-station/notifications', icon: Bell },
    { id: 'settings', name: 'Settings', href: '/pickup-station/settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      setActiveTab(tabId);
      navigate(item.href);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const tabs = navigationItems.map(item => ({
    id: item.id,
    label: item.name
  }));

  // Measure heights with ResizeObserver
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
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

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    if (tabsRef.current) {
      resizeObserver.observe(tabsRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update active tab when location changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);

    if (location.pathname === '/pickup-station' || 
        location.pathname.endsWith('/pickup-station/')) {
      navigate('/pickup-station/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Handle sticky tabs with scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !headerRef.current) return;

      const currentHeaderHeight = headerRef.current.offsetHeight;
      const scrollY = window.scrollY;

      if (isTabsSticky) {
        const tabsNaturalTopInViewport = headerHeight - scrollY;
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
  }, [isTabsSticky, headerHeight]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="px-1.5 py-1">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <ReusableSearchBar
                placeholder="Search packages..."
                showScanMic={true}
                showSettingsButton={true}
                onSettingsClick={() => navigate('/pickup-station/settings')}
                onSubmit={(query) => {
                  console.log('Searching for:', query);
                  setShowSearchOverlay(false);
                }}
                onSearchFocus={() => setShowSearchOverlay(true)}
                onSearchClose={handleBackClick}
                isOverlayOpen={showSearchOverlay}
                onCloseOverlay={() => setShowSearchOverlay(false)}
                isTransparent={false}
                onBackClick={handleBackClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-screen">
        <main>
          {/* Spacer for header */}
          <div style={{ height: `${headerHeight}px` }} />

          {/* Tabs Navigation */}
          <nav
            ref={tabsRef}
            className={`bg-white border-b transition-all duration-200 ${
              isTabsSticky
                ? 'fixed left-0 right-0 z-40 shadow-sm'
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
              isLoading={false}
            />
          </nav>

          {/* Spacer when tabs are sticky */}
          {isTabsSticky && (
            <div
              style={{ height: `${tabsHeight}px` }}
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

export default PickupStationLayout;
