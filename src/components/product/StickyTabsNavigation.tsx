// components/product/StickyTabsNavigation.tsx
import React, { useState, useEffect } from 'react';
import TabsNavigation from "@/components/home/TabsNavigation";
import { ProductImageGalleryRef } from "@/components/ProductImageGallery";

interface StickyTabsNavigationProps {
  headerHeight: number;
  // Add gallery ref to sync state
  galleryRef: React.RefObject<ProductImageGalleryRef>;
  // Add panel context props
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number; // Panel header height for correct positioning and threshold
}

const StickyTabsNavigation: React.FC<StickyTabsNavigationProps> = ({
  headerHeight,
  galleryRef,
  inPanel = false,
  scrollContainerRef,
  stickyTopOffset
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // Local state for UI updates

  // Sync with gallery's active tab
  useEffect(() => {
    const syncActiveTab = () => {
      if (galleryRef.current) {
        const galleryActiveTab = galleryRef.current.getActiveTab();
        if (galleryActiveTab !== activeTab) {
          setActiveTab(galleryActiveTab);
        }
      }
    };

    // Sync initially and then periodically
    syncActiveTab();
    const interval = setInterval(syncActiveTab, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [galleryRef, activeTab]);

  useEffect(() => {
    const handleScrollForStickyTabs = () => {
      // Get the tabs container directly from the gallery ref
      const tabsContainer = galleryRef.current?.getTabsContainer();
      
      if (!tabsContainer) return;

      const tabsRect = tabsContainer.getBoundingClientRect();

      // Determine the threshold based on context
      let shouldShow = false;
      
      if (inPanel && scrollContainerRef?.current && stickyTopOffset !== undefined) {
        // Panel mode: account for panel position in viewport
        const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
        const thresholdOffset = containerTop + stickyTopOffset;
        
        // Precise detection: when tabs top reaches the threshold (within 1px)
        shouldShow = tabsRect.top <= thresholdOffset + 1;
      } else {
        // Window mode: when tabs top reaches header bottom (within 1px)
        shouldShow = tabsRect.top <= headerHeight + 1;
      }

      setShowStickyTabs(shouldShow);

      console.log('📊 Tabs scroll detection:', {
        tabsTop: tabsRect.top,
        headerHeight,
        shouldShow,
        tabsContainer: !!tabsContainer,
        inPanel,
        stickyTopOffset,
        containerTop: inPanel && scrollContainerRef?.current ? scrollContainerRef.current.getBoundingClientRect().top : 'N/A'
      });
    };

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const updateStickyState = () => {
      handleScrollForStickyTabs();
      ticking = false;
    };

    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    };

    // Choose the correct scroll target based on context
    const scrollTarget = inPanel && scrollContainerRef?.current 
      ? scrollContainerRef.current 
      : window;

    scrollTarget.addEventListener('scroll', scrollListener, { passive: true });
    scrollTarget.addEventListener('resize', scrollListener, { passive: true });
    
    // Initial check after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleScrollForStickyTabs();
    }, 100);
    
    return () => {
      scrollTarget.removeEventListener('scroll', scrollListener);
      scrollTarget.removeEventListener('resize', scrollListener);
      clearTimeout(timer);
    };
  }, [galleryRef, headerHeight, inPanel, scrollContainerRef?.current, stickyTopOffset]);

  // Handle tab click with smooth scrolling and sync with gallery
  const handleTabClick = (tabId: string) => {
    // Update the gallery's active tab
    if (galleryRef.current) {
      galleryRef.current.setActiveTab(tabId);
    }

    // Update local state immediately for UI responsiveness
    setActiveTab(tabId);

    // Scroll to the tabs navigation level in the product image gallery
    const tabsContainer = galleryRef.current?.getTabsContainer();
    if (tabsContainer) {
      if (inPanel && scrollContainerRef?.current) {
        // Panel mode: scroll within the container
        const scrollContainer = scrollContainerRef.current;
        const containerRect = scrollContainer.getBoundingClientRect();
        const tabsRect = tabsContainer.getBoundingClientRect();
        const topOffset = stickyTopOffset || 60; // Use panel header height or default buffer
        
        const targetTop = tabsRect.top - containerRect.top + scrollContainer.scrollTop - topOffset;
        
        scrollContainer.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      } else {
        // Window mode: scroll to exact sticky position (where tabs become sticky)
        const offsetTop = tabsContainer.offsetTop - headerHeight;
        
        window.scrollTo({
          top: Math.max(0, offsetTop),
          behavior: 'smooth'
        });
      }
    }
  };

  // Don't render sticky tabs in panel mode since ProductHeader handles tabs
  if (!showStickyTabs || inPanel) return null;

  const stickyStyle = inPanel && stickyTopOffset !== undefined 
    ? { top: `${stickyTopOffset}px` }
    : { top: `${headerHeight}px` };

  return (
  <div 
    className={`${inPanel ? 'sticky' : 'fixed'} left-0 right-0 z-40 bg-white border-b overflow-x-auto`}
    style={stickyStyle}
  >
    <div className="w-full bg-white">
      <TabsNavigation
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'variants', label: 'Variants' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'qna', label: 'Q&A' },
          { id: 'shipping', label: 'Shipping' }
        ]}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        edgeToEdge={true}
        style={{ 
          backgroundColor: 'white',
          margin: 0,
          padding: 0
        }}
      />
    </div>
  </div>
);
};

export default StickyTabsNavigation;