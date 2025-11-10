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
  hideTabs?: boolean; // NEW PROP: Conditionally hide tabs
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
  stickyTopOffset,
  hideTabs = false // NEW: Default to false
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

  // Debug logging
  console.log('🎯 StickyTabsLayout rendering:', {
    tabsCount: tabs.length,
    activeTab,
    headerHeight,
    isTabsSticky,
    inPanel,
    hasHeader: !!header,
    hasTopContent: !!topContent,
    hideTabs // NEW: Log hideTabs state
  });

  // ===== MEASURE HEIGHTS =====
  useLayoutEffect(() => {
    // If tabs are hidden, we don't need to measure tabs height
    if (hideTabs) {
      setTabsHeight(0);
      return;
    }

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
    if (tabsRef.current && !hideTabs) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, [isProductsTab, headerRef, topContentRef, hideTabs]); // Added hideTabs dependency

  // ===== RESET STICKY STATE WHEN SWITCHING TO PRODUCTS TAB =====
  useEffect(() => {
    if (isProductsTab) {
      setIsTabsSticky(false);
    }
  }, [isProductsTab]);

  // ===== STICKY TABS BEHAVIOR =====
  useEffect(() => {
    // If tabs are hidden, don't set up sticky behavior
    if (hideTabs) {
      setIsTabsSticky(false);
      return;
    }

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

          const buffer = 4;

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
          const shouldBeSticky = rect.top <= headerHeight + buffer && scrollingDown;
          const shouldUnstick = rect.top > headerHeight + buffer && !scrollingDown;

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
  }, [headerHeight, isProductsTab, alwaysStickyForNonProducts, isTabsSticky, inPanel, hideTabs]); // Added hideTabs dependency

  // ===== HANDLE TAB SWITCH =====
  useEffect(() => {
    // When switching to non-products tabs, make tabs sticky immediately
    if (!isProductsTab && alwaysStickyForNonProducts && !hideTabs) {
      setIsTabsSticky(true);
    }
  }, [isProductsTab, alwaysStickyForNonProducts, hideTabs]);

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

  // For panel mode, simplified layout
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
          >
            {topContent}
          </div>
        )}

        {/* NORMAL TABS - Conditionally render tabs */}
        {!hideTabs && (
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
        )}

        {/* CONTENT */}
        <div>
          {children}
        </div>
      </div>
    );
  }

  // Regular mode with sticky behavior
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      {header}

      {/* TOP CONTENT - Pulled up by header height */}
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

      {/* STICKY TABS - Conditionally render tabs */}
      {!hideTabs && (
        <div
          ref={tabsContainerRef}
          style={{ height: isTabsSticky ? `${tabsHeight}px` : 'auto' }}
          className="bg-white"
        >
          <div className="relative">
            {/* Normal Tabs - Always visible in document flow */}
            <div
              ref={tabsRef}
              style={{ 
                position: 'relative', 
                zIndex: 40,
                backgroundColor: 'white'
              }}
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

            {/* Sticky Tabs */}
            <div
              className={`fixed left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300 ease-out border-b ${
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
                className="bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ 
        paddingTop: !isProductsTab && alwaysStickyForNonProducts && !hideTabs ? `${headerHeight}px` : '0px' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default StickyTabsLayout;