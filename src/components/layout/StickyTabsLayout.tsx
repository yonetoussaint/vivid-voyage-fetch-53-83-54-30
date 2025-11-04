import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import TabsNavigation, { TabsNavigationRef } from '@/components/home/TabsNavigation';

interface StickyTabsLayoutProps {
  header: React.ReactNode;
  headerRef: React.RefObject<HTMLDivElement>;
  topContent?: React.ReactNode;
  topContentRef?: React.RefObject<HTMLDivElement>;
  tabs: Array<{ id: string; label: string; icon?: any }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  isProductsTab?: boolean;
  showTopBorder?: boolean;
  variant?: "underline" | "pills";
  // Additional props for scroll behavior customization
  stickyBuffer?: number;
  alwaysStickyForNonProducts?: boolean;
}

const StickyTabsLayout: React.FC<StickyTabsLayoutProps> = ({
  header,
  headerRef,
  topContent,
  topContentRef,
  tabs,
  activeTab,
  onTabChange,
  children,
  isProductsTab = true,
  showTopBorder = false,
  variant = "underline",
  stickyBuffer = 4,
  alwaysStickyForNonProducts = true
}) => {
  // Refs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const normalTabsNavigationRef = useRef<TabsNavigationRef>(null);
  const stickyTabsNavigationRef = useRef<TabsNavigationRef>(null);

  // States
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [topContentHeight, setTopContentHeight] = useState(0);

  // ===== MEASURE HEIGHTS =====
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        const newHeaderHeight = headerRef.current.offsetHeight || 0;
        setHeaderHeight(newHeaderHeight);
      }
      
      if (isProductsTab && topContentRef?.current) {
        const newTopContentHeight = topContentRef.current.offsetHeight || 0;
        setTopContentHeight(newTopContentHeight);
      }
      
      if (tabsRef.current) {
        const newTabsHeight = tabsRef.current.offsetHeight || 0;
        setTabsHeight(newTabsHeight);
      }
    };

    updateHeights();
    const resizeObserver = new ResizeObserver(updateHeights);
    
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (isProductsTab && topContentRef?.current) resizeObserver.observe(topContentRef.current);
    if (tabsRef.current) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, [isProductsTab, headerRef, topContentRef]);

  // ===== STICKY TABS BEHAVIOR =====
  useEffect(() => {
    const tabsEl = tabsContainerRef.current;
    if (!tabsEl) return;

    let lastSticky = isTabsSticky;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = tabsEl.getBoundingClientRect();
          const currentY = window.scrollY;
          const scrollingDown = currentY > lastScrollY;
          lastScrollY = currentY;

          // If we're not on products tab and alwaysStickyForNonProducts is true, 
          // always make tabs sticky regardless of scroll
          if (!isProductsTab && alwaysStickyForNonProducts) {
            if (!lastSticky) {
              setIsTabsSticky(true);
              lastSticky = true;
            }
            ticking = false;
            return;
          }

          // Original behavior for products tab
          const shouldBeSticky = rect.top <= headerHeight + stickyBuffer && scrollingDown;
          const shouldUnstick = rect.top > headerHeight + stickyBuffer && !scrollingDown;

          if (shouldBeSticky && !lastSticky) {
            setIsTabsSticky(true);
            lastSticky = true;
          } else if (shouldUnstick && lastSticky) {
            setIsTabsSticky(false);
            lastSticky = false;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight, isProductsTab, stickyBuffer, alwaysStickyForNonProducts]);

  // ===== HANDLE TAB SWITCH =====
  useEffect(() => {
    // When switching to non-products tabs, make tabs sticky immediately
    if (!isProductsTab && alwaysStickyForNonProducts) {
      setIsTabsSticky(true);
    }
  }, [isProductsTab, alwaysStickyForNonProducts]);

  // Reset scroll when switching to first tab
  const handleInternalTabChange = (tabId: string) => {
    // If switching to first tab, reset normal tabs scroll
    if (tabId === tabs[0]?.id) {
      setTimeout(() => {
        if (normalTabsNavigationRef.current) {
          normalTabsNavigationRef.current.resetScroll();
        }
      }, 100);
    }
    
    onTabChange(tabId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      {header}

      {/* TOP CONTENT (Seller Info, etc.) */}
      {topContent && (
        <div 
          ref={topContentRef}
          className="w-full relative"
          style={{ 
            marginTop: `-${headerHeight}px`,
            paddingTop: `${headerHeight}px`,
          }}
        >
          {topContent}
        </div>
      )}

      {/* STICKY TABS */}
      <div
        ref={tabsContainerRef}
        style={{ height: isTabsSticky ? `${tabsHeight}px` : 'auto' }}
      >
        <div className="relative">
          {/* Normal Tabs - Always visible in document flow, no animation */}
          <div
            ref={tabsRef}
            style={{ position: 'relative', zIndex: 30 }}
          >
            <TabsNavigation
              ref={normalTabsNavigationRef}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleInternalTabChange}
              showTopBorder={showTopBorder}
              variant={variant}
            />
          </div>

          {/* Sticky Tabs - Slides down when sticking, fades out when unsticking */}
          <div
            className={`fixed left-0 right-0 z-40 bg-white shadow-sm transition-all duration-300 ease-out ${
              isTabsSticky
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }`}
            style={{
              top: `${headerHeight}px`,
              willChange: 'transform, opacity',
            }}
          >
            <TabsNavigation
              ref={stickyTabsNavigationRef}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleInternalTabChange}
              showTopBorder={true}
              variant={variant}
              className="bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ 
        paddingTop: !isProductsTab && alwaysStickyForNonProducts ? `${headerHeight}px` : '0px' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default StickyTabsLayout;