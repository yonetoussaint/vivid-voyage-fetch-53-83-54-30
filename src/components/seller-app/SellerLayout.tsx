import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const sellerInfoRef = useRef<HTMLDivElement>(null);
  const scrollObserverRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [sellerInfoHeight, setSellerInfoHeight] = useState<number>(0);
  const [isTransparentHeader, setIsTransparentHeader] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Rest of your existing code remains the same until the observer section...

  // PRECISE Intersection Observer with Performance Optimization
  const setupIntersectionObserver = useCallback(() => {
    if (!tabsRef.current || headerHeight === 0) return;

    // Clean up previous observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
    }

    // Remove existing sentinel
    if (sentinelRef.current?.parentNode) {
      sentinelRef.current.parentNode.removeChild(sentinelRef.current);
      sentinelRef.current = null;
    }

    // Create and position sentinel element
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0px';
    sentinel.style.left = '0px';
    sentinel.style.width = '100%';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.zIndex = '-1';
    sentinel.style.visibility = 'hidden';
    
    // Insert sentinel exactly at the top of the tabs container
    const tabsContainer = tabsRef.current;
    if (tabsContainer.parentElement) {
      tabsContainer.parentElement.insertBefore(sentinel, tabsContainer);
      sentinelRef.current = sentinel;
    }

    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const isIntersecting = entry.isIntersecting;
        
        // Use your existing logic: when NOT intersecting, tabs are touching header
        if (!isIntersecting) {
          setIsTabsSticky(true);
        } else {
          setIsTabsSticky(false);
        }
      },
      {
        root: null,
        rootMargin: `-${headerHeight}px 0px 0px 0px`, // Negative margin = header height
        threshold: 0
      }
    );

    observer.observe(sentinelRef.current);
    intersectionObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (sentinelRef.current?.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
      }
    };
  }, [headerHeight]);

  // Initialize Intersection Observer when ready
  useEffect(() => {
    if (headerHeight > 0 && tabsRef.current) {
      const cleanup = setupIntersectionObserver();
      setIsInitialized(true);
      return cleanup;
    }
  }, [headerHeight, setupIntersectionObserver]);

  // Enhanced height measurement with proper sequencing
  useLayoutEffect(() => {
    const updateHeights = () => {
      let newHeaderHeight = 0;
      let newSellerInfoHeight = 0;
      let newTabsHeight = 0;

      // Measure header first (most critical)
      if (headerRef.current) {
        newHeaderHeight = headerRef.current.getBoundingClientRect().height;
        if (newHeaderHeight > 0 && newHeaderHeight !== headerHeight) {
          setHeaderHeight(newHeaderHeight);
        }
      }

      // Measure seller info if on products tab
      if (sellerInfoRef.current && isProductsTab) {
        newSellerInfoHeight = sellerInfoRef.current.offsetHeight;
        if (newSellerInfoHeight > 0 && newSellerInfoHeight !== sellerInfoHeight) {
          setSellerInfoHeight(newSellerInfoHeight);
        }
      }

      // Measure tabs last
      if (tabsRef.current) {
        newTabsHeight = tabsRef.current.offsetHeight;
        if (newTabsHeight > 0 && newTabsHeight !== tabsHeight) {
          setTabsHeight(newTabsHeight);
        }
      }
    };

    updateHeights();
    const resizeObserver = new ResizeObserver(updateHeights);

    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (sellerInfoRef.current && isProductsTab) resizeObserver.observe(sellerInfoRef.current);
    if (tabsRef.current) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, [isProductsTab, headerHeight, sellerInfoHeight, tabsHeight]);

  // Scroll progress observer (separate from sticky logic)
  useEffect(() => {
    if (!scrollObserverRef.current || !isInitialized) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const progress = 1 - entry.intersectionRatio;
        setScrollProgress(progress);
        setIsTransparentHeader(progress < 0.3);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i * 0.01),
        rootMargin: '-50px 0px 0px 0px'
      }
    );

    observer.observe(scrollObserverRef.current);

    return () => observer.disconnect();
  }, [isInitialized]);

  // Handle edge cases and initialization
  useEffect(() => {
    // Force re-initialization after a short delay to catch any DOM updates
    const timer = setTimeout(() => {
      if (headerHeight > 0 && !isInitialized) {
        setupIntersectionObserver();
        setIsInitialized(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [headerHeight, isInitialized, setupIntersectionObserver]);

  // Handle scroll to top on tab change
  const handleTabChange = useCallback((tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      navigate(item.href);
    }
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Reset sticky state when changing tabs
    setIsTabsSticky(false);
  }, [navigationItems, navigate]);

  // Your existing JSX return remains the same, but enhanced with better styling:
  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Observer Element */}
      <div 
        ref={scrollObserverRef}
        className="absolute top-0 left-0 w-full h-1 pointer-events-none"
        style={{ top: `${headerHeight}px` }}
      />

      {/* Header */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-40"
      >
        <ProductHeader
          showCloseIcon={false}
          onCloseClick={handleBackClick}
          actionButtons={actionButtons}
          sellerMode={false}
          stickyMode={true}
          forceScrolledState={scrollProgress > 0.3}
          customScrollProgress={scrollProgress}
          inPanel={false}
          showDetailsButton={false}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-screen">
        <main>
          {/* Seller Info Section */}
          {true && (
            <div ref={sellerInfoRef} className="w-full bg-black text-white relative z-30">
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

          {/* Spacer for header height */}
          <div style={{ height: `${headerHeight}px` }} />

          {/* Tabs Navigation with enhanced styling */}
          <div className="relative">
            <nav
              ref={tabsRef}
              className={`bg-white transition-all duration-300 ease-out ${
                isTabsSticky
                  ? 'fixed left-0 right-0 z-40 shadow-lg border-b border-gray-200'
                  : 'relative'
              }`}
              style={{
                top: isTabsSticky ? `${headerHeight}px` : 'auto',
                // Smooth transition for the sticky effect
                transform: isTabsSticky ? 'translateY(0)' : 'translateY(0)',
              }}
            >
              <TabsNavigation 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                showTopBorder={!isTabsSticky} // Only show top border when not sticky
                variant="underline"
              />
            </nav>
          </div>

          {/* Spacer when tabs are sticky */}
          {isTabsSticky && (
            <div 
              style={{ height: `${tabsHeight}px` }} 
              aria-hidden="true"
              className="transition-all duration-300"
            />
          )}

          {/* Main Content */}
          <div className="">
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