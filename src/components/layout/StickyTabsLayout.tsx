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
  stickyBuffer?: number;
  alwaysStickyForNonProducts?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
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
  alwaysStickyForNonProducts = true,
  inPanel = false,
  scrollContainerRef,
  stickyTopOffset
}) => {
  // Refs - Same as SellerLayout
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const normalTabsNavigationRef = useRef<TabsNavigationRef>(null);
  const stickyTabsNavigationRef = useRef<TabsNavigationRef>(null);
  const previousTabRef = useRef<string>(tabs[0]?.id || '');

  // States - Same as SellerLayout
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [topContentHeight, setTopContentHeight] = useState(0);

  // ===== MEASURE HEIGHTS ===== (Same as SellerLayout)
  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight || 0);
      if (isProductsTab && topContentRef?.current)
        setTopContentHeight(topContentRef.current.offsetHeight || 0);
      if (tabsRef.current) setTabsHeight(tabsRef.current.offsetHeight || 0);
    };

    updateHeights();
    const resizeObserver = new ResizeObserver(updateHeights);
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (isProductsTab && topContentRef?.current) resizeObserver.observe(topContentRef.current);
    if (tabsRef.current) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, [isProductsTab, headerRef, topContentRef]);

  // ===== RESET STICKY STATE WHEN SWITCHING TO FIRST TAB ===== (Same as SellerLayout)
  useEffect(() => {
    // When switching to first tab, immediately unstick the tabs
    if (activeTab === tabs[0]?.id) {
      setIsTabsSticky(false);
    }
  }, [activeTab, tabs]);

  // ===== STICKY TABS BEHAVIOR ===== (Same as SellerLayout)
  useEffect(() => {
    // If we're not on products tab and alwaysStickyForNonProducts is true, 
    // make tabs sticky immediately
    if (!isProductsTab && alwaysStickyForNonProducts) {
      setIsTabsSticky(true);
      return;
    }

    // For panel mode, don't use sticky behavior
    if (inPanel) {
      return;
    }

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

          // If we're not on products tab, always make tabs sticky regardless of scroll
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
  }, [headerHeight, isProductsTab, stickyBuffer, alwaysStickyForNonProducts, isTabsSticky, inPanel]);

  // ===== HANDLE TAB SWITCH ===== (Same as SellerLayout)
  useEffect(() => {
    // When switching to non-first tabs, make tabs sticky immediately
    if (!isProductsTab && alwaysStickyForNonProducts) {
      setIsTabsSticky(true);
    }
    // Update previous tab ref
    previousTabRef.current = activeTab;
  }, [isProductsTab, activeTab, alwaysStickyForNonProducts]);

  // Reset scroll when switching to first tab (Same as SellerLayout)
  const handleInternalTabChange = (tabId: string) => {
    const previousTab = activeTab;
    
    // If switching to first tab from a non-first tab, reset normal tabs scroll
    if (tabId === tabs[0]?.id && previousTab !== tabs[0]?.id) {
      setTimeout(() => {
        if (normalTabsNavigationRef.current) {
          normalTabsNavigationRef.current.resetScroll();
        }
      }, 100);
    }
    
    onTabChange(tabId);
  };

  // For panel mode, just render normal tabs without sticky behavior
  if (inPanel) {
    return (
      <div className="min-h-screen bg-white">
        {/* HEADER */}
        {header}

        {/* TOP CONTENT */}
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

        {/* NORMAL TABS - Always visible in panel mode */}
        <div ref={tabsContainerRef}>
          <div className="relative">
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
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {children}
        </div>
      </div>
    );
  }

  // Regular mode with sticky behavior (Same as SellerLayout)
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      {header}

      {/* TOP CONTENT */}
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