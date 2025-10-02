
// components/seller/SellerPanelStickyTabs.tsx
import React, { useState, useEffect } from 'react';
import TabsNavigation from "@/components/home/TabsNavigation";

interface SellerPanelStickyTabsProps {
  headerHeight: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  // Panel context props
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number; // Panel header height for correct positioning
}

const SellerPanelStickyTabs: React.FC<SellerPanelStickyTabsProps> = ({
  headerHeight,
  activeTab,
  onTabChange,
  inPanel = false,
  scrollContainerRef,
  stickyTopOffset
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  useEffect(() => {
    const handleScrollForStickyTabs = () => {
      // Look for the original tabs container in the seller page
      const originalTabsContainer = document.querySelector('[data-testid="seller-tabs-navigation"]') || 
                                   document.querySelector('.seller-tabs-navigation') ||
                                   document.querySelector('nav[class*="border-b"]');

      if (originalTabsContainer) {
        const tabsRect = originalTabsContainer.getBoundingClientRect();

        // Show sticky tabs when the original tabs start to scroll out of view
        let shouldShow = false;
        
        if (inPanel && scrollContainerRef?.current && stickyTopOffset !== undefined) {
          // Panel mode: account for panel position in viewport
          const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
          const thresholdOffset = containerTop + stickyTopOffset;
          shouldShow = tabsRect.top <= thresholdOffset;
        } else {
          // Window mode: use headerHeight as before
          shouldShow = tabsRect.top <= headerHeight;
        }

        setShowStickyTabs(shouldShow);

        console.log('📊 Seller Tabs scroll detection:', {
          tabsTop: tabsRect.top,
          headerHeight,
          shouldShow,
          tabsContainer: !!originalTabsContainer,
          inPanel,
          stickyTopOffset,
          containerTop: inPanel && scrollContainerRef?.current ? scrollContainerRef.current.getBoundingClientRect().top : 'N/A'
        });
      }
    };

    // Choose the correct scroll target based on context
    const scrollTarget = inPanel && scrollContainerRef?.current 
      ? scrollContainerRef.current 
      : window;

    scrollTarget.addEventListener('scroll', handleScrollForStickyTabs, { passive: true });
    
    // Run initial check to set sticky state on first render
    handleScrollForStickyTabs();
    
    return () => scrollTarget.removeEventListener('scroll', handleScrollForStickyTabs);
  }, [headerHeight, inPanel, scrollContainerRef?.current, stickyTopOffset]);

  // Handle tab click with smooth scrolling
  const handleTabClick = (tabId: string) => {
    // Update active tab
    onTabChange(tabId);

    // Scroll to the tabs navigation level in the seller page
    const originalTabsContainer = document.querySelector('[data-testid="seller-tabs-navigation"]') || 
                                 document.querySelector('.seller-tabs-navigation') ||
                                 document.querySelector('nav[class*="border-b"]');
    
    if (originalTabsContainer) {
      if (inPanel && scrollContainerRef?.current) {
        // Panel mode: scroll within the container
        const scrollContainer = scrollContainerRef.current;
        const containerRect = scrollContainer.getBoundingClientRect();
        const tabsRect = originalTabsContainer.getBoundingClientRect();
        const topOffset = stickyTopOffset || 60; // Use panel header height or default buffer
        
        const targetTop = tabsRect.top - containerRect.top + scrollContainer.scrollTop - topOffset;
        
        scrollContainer.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      } else {
        // Window mode: scroll to exact sticky position
        const offsetTop = (originalTabsContainer as HTMLElement).offsetTop - headerHeight;
        
        window.scrollTo({
          top: Math.max(0, offsetTop),
          behavior: 'smooth'
        });
      }
    }
  };

  // Don't render if not showing sticky tabs
  if (!showStickyTabs) return null;

  const stickyStyle = inPanel && stickyTopOffset !== undefined 
    ? { top: `${stickyTopOffset}px` }
    : { top: `${headerHeight}px` };

  return (
    <div 
      className={`${inPanel ? 'sticky' : 'fixed'} left-0 right-0 z-40 bg-white border-b overflow-x-auto shadow-sm`}
      style={stickyStyle}
    >
      <div className="w-full bg-white">
        <TabsNavigation
          tabs={[
            { id: 'products', label: 'Products' },
            { id: 'posts', label: 'Posts' },
            { id: 'categories', label: 'Categories' },
            { id: 'reels', label: 'Reels' },
            { id: 'about', label: 'About' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'qas', label: 'Q&A' },
            { id: 'contact', label: 'Contact' },
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

export default SellerPanelStickyTabs;
