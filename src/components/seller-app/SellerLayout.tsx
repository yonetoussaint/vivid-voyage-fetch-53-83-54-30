import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, BarChart3, ArrowLeft, DollarSign, Megaphone, Settings, Home, Share, MessageCircle, MessageSquare, Star, Warehouse 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TabsNavigation from '@/components/home/TabsNavigation';
import SellerInfoSection from './SellerInfoSection';

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

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [sellerInfoHeight, setSellerInfoHeight] = useState<number>(0);
  const [isTransparentHeader, setIsTransparentHeader] = useState(true);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleBecomeSeller = () => {
    console.log('Start seller onboarding');
    navigate('/seller-onboarding');
  };

  const handleShareClick = () => {
    console.log('Share seller profile');
  };

  // Determine if we're in dashboard or public seller page
  const isDashboard = location.pathname.includes('/seller-dashboard');

  // Extract current tab from pathname
  const getCurrentTab = () => {
    if (isDashboard) {
      const path = location.pathname.split('/seller-dashboard/')[1];
      if (!path || path === '') {
        if (location.pathname === '/seller-dashboard' || 
            location.pathname.endsWith('/seller-dashboard/')) {
          navigate('/seller-dashboard/overview', { replace: true });
        }
        return 'overview';
      }
      return path;
    } else {
      // For public seller pages, extract tab from path
      const pathParts = location.pathname.split('/seller/')[1]?.split('/');
      if (pathParts && pathParts.length > 1) {
        return pathParts[1]; // Return the tab part (e.g., 'products', 'reels', etc.)
      }
      return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });

  // Check if we're on the overview tab
  const isOverviewTab = activeTab === 'overview';

  const baseRoute = isDashboard ? '/seller-dashboard' : `/seller/${location.pathname.split('/seller/')[1]?.split('/')[0] || ''}`;

  const navigationItems = isDashboard ? [
    { id: 'overview', name: 'Overview', href: '/seller-dashboard/overview', icon: Home },
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'inventory', name: 'Inventory', href: '/seller-dashboard/inventory', icon: Warehouse },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'reels', name: 'Reels', href: '/seller-dashboard/reels', icon: Megaphone },
    { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ] : [
    { id: 'overview', name: 'Overview', href: baseRoute, icon: Home },
    { id: 'products', name: 'Products', href: `${baseRoute}/products`, icon: Package },
    { id: 'reels', name: 'Reels', href: `${baseRoute}/reels`, icon: Megaphone },
    { id: 'posts', name: 'Posts', href: `${baseRoute}/posts`, icon: MessageCircle },
    { id: 'qas', name: 'Q&As', href: `${baseRoute}/qas`, icon: MessageSquare },
    { id: 'reviews', name: 'Reviews', href: `${baseRoute}/reviews`, icon: Star },
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

  // Measure heights with ResizeObserver
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
        }
      }
      if (sellerInfoRef.current && isOverviewTab) {
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

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    if (sellerInfoRef.current && isOverviewTab) {
      resizeObserver.observe(sellerInfoRef.current);
    }
    if (tabsRef.current) {
      resizeObserver.observe(tabsRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOverviewTab]);

  // Update active tab when location changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);

    if (location.pathname === '/seller-dashboard' || 
        location.pathname.endsWith('/seller-dashboard/')) {
      navigate('/seller-dashboard/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Handle sticky tabs with scroll listener - PIXEL-PERFECT METHOD
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !headerRef.current) return;

      const currentHeaderHeight = headerRef.current.offsetHeight;
      const scrollY = window.scrollY;

      if (isTabsSticky) {
        // When tabs are sticky, check if we should unstick them
        // We need to calculate where the tabs would be if they weren't sticky
        let tabsNaturalTopInViewport;

        if (isOverviewTab) {
          // Tabs naturally sit after seller info
          // Their natural position from document top = sellerInfoHeight
          // Their position in viewport = naturalPosition - scrollY
          tabsNaturalTopInViewport = sellerInfoHeight - scrollY;
        } else {
          // Tabs naturally sit after the spacer (headerHeight)
          // Their natural position from document top = headerHeight
          // Their position in viewport = headerHeight - scrollY
          tabsNaturalTopInViewport = headerHeight - scrollY;
        }

        // Unstick when the natural position would be below the header's bottom
        // This means we've scrolled back up enough that tabs should return to flow
        if (tabsNaturalTopInViewport > currentHeaderHeight) {
          setIsTabsSticky(false);
        }
      } else {
        // When tabs are not sticky, check if they should become sticky
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const tabsTopRelativeToViewport = tabsRect.top;

        // Tabs should become sticky when their top edge reaches the header's bottom edge
        if (tabsTopRelativeToViewport <= currentHeaderHeight) {
          setIsTabsSticky(true);
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also listen to resize in case header height changes
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isTabsSticky, isOverviewTab, sellerInfoHeight, headerHeight]);

  // Handle header transparency for overview tab
  useEffect(() => {
    if (!isOverviewTab) {
      setIsTransparentHeader(false);
      return;
    }

    if (!headerHeight || !sellerInfoHeight) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const transparencyThreshold = sellerInfoHeight * 0.3;

      // Header is transparent when we haven't scrolled past 30% of seller info
      setIsTransparentHeader(scrollY < transparencyThreshold);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOverviewTab, headerHeight, sellerInfoHeight]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        ref={headerRef} 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparentHeader 
            ? 'bg-transparent' 
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
        }`}
      >
        <div className="px-1.5 py-1">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <ReusableSearchBar
                placeholder="Search in store..."
                showScanMic={!isTransparentHeader}
                showSettingsButton={!isTransparentHeader}
                onSettingsClick={() => console.log('Seller settings clicked')}
                onSubmit={(query) => {
                  console.log('Searching for:', query);
                  setShowSearchOverlay(false);
                }}
                onSearchFocus={() => setShowSearchOverlay(true)}
                onSearchClose={handleBackClick}
                isOverlayOpen={showSearchOverlay}
                onCloseOverlay={() => setShowSearchOverlay(false)}
                isTransparent={isTransparentHeader}
                onBackClick={handleBackClick}
                onShareClick={handleShareClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-screen">
        <main>
          {/* Seller Info Section - Only on overview tab */}
          {isOverviewTab && (
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

          {/* Spacer for non-overview tabs */}
          {!isOverviewTab && (
            <div style={{ height: `${headerHeight}px` }} />
          )}

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
              isLoading={sellerLoading}
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
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                if (activeTab !== 'overview') {
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