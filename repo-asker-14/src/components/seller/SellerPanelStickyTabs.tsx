
// components/seller/SellerPanelStickyTabs.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  stickyTopOffset = 0
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Improved scroll handler with better performance and timing
  const handleScroll = useCallback(() => {
    if (inPanel && scrollContainerRef?.current) {
      // Panel mode: use container scroll
      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      
      // Show sticky tabs after scrolling past the header area
      const threshold = stickyTopOffset + 20; // Small buffer for smooth transition
      const shouldShow = scrollTop > threshold;
      
      // Calculate smooth opacity transition
      const transitionZone = 30; // 30px transition zone
      const transitionStart = threshold - transitionZone;
      const transitionEnd = threshold;
      
      let newOpacity = 0;
      if (scrollTop >= transitionEnd) {
        newOpacity = 1;
      } else if (scrollTop > transitionStart) {
        newOpacity = (scrollTop - transitionStart) / transitionZone;
      }
      
      // Update states only if they changed to prevent unnecessary re-renders
      if (shouldShow !== showStickyTabs) {
        setShowStickyTabs(shouldShow);
      }
      if (Math.abs(newOpacity - opacity) > 0.01) {
        setOpacity(newOpacity);
      }
    } else {
      // Window mode: look for original tabs in the seller page
      const originalTabsContainer = document.querySelector('[data-testid="seller-tabs-navigation"]') || 
                                   document.querySelector('.seller-tabs-navigation');

      if (originalTabsContainer) {
        const tabsRect = originalTabsContainer.getBoundingClientRect();
        const shouldShow = tabsRect.top <= headerHeight;
        
        // Calculate opacity for smooth transition
        const transitionZone = 40;
        const transitionStart = headerHeight - transitionZone;
        const transitionEnd = headerHeight;
        
        let newOpacity = 0;
        if (tabsRect.top <= transitionEnd) {
          newOpacity = 1;
        } else if (tabsRect.top < transitionStart) {
          newOpacity = (transitionStart - tabsRect.top) / transitionZone;
        }
        
        if (shouldShow !== showStickyTabs) {
          setShowStickyTabs(shouldShow);
        }
        if (Math.abs(newOpacity - opacity) > 0.01) {
          setOpacity(newOpacity);
        }
      }
    }
  }, [headerHeight, inPanel, scrollContainerRef, stickyTopOffset, showStickyTabs, opacity]);

  // Set up scroll listeners with proper cleanup
  useEffect(() => {
    const scrollTarget = inPanel && scrollContainerRef?.current 
      ? scrollContainerRef.current 
      : window;

    // Add scroll listener with passive option for better performance
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run initial check after a small delay to ensure DOM is ready
    const initialCheckTimer = setTimeout(handleScroll, 100);
    
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      clearTimeout(initialCheckTimer);
    };
  }, [handleScroll, inPanel, scrollContainerRef?.current]);

  // Reset state when activeTab changes
  useEffect(() => {
    if (activeTab === 'products') {
      setShowStickyTabs(false);
      setOpacity(0);
    } else {
      // For non-products tabs, show sticky tabs immediately
      setShowStickyTabs(true);
      setOpacity(1);
    }
  }, [activeTab]);

  // Handle tab click with improved scrolling
  const handleTabClick = (tabId: string) => {
    // Update active tab
    onTabChange(tabId);

    if (inPanel && scrollContainerRef?.current) {
      // Panel mode: scroll to top smoothly
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Window mode: scroll to tabs position
      const originalTabsContainer = document.querySelector('[data-testid="seller-tabs-navigation"]') || 
                                   document.querySelector('.seller-tabs-navigation');
      
      if (originalTabsContainer) {
        const offsetTop = (originalTabsContainer as HTMLElement).offsetTop - headerHeight;
        window.scrollTo({
          top: Math.max(0, offsetTop),
          behavior: 'smooth'
        });
      }
    }
  };

  // Don't render if not showing sticky tabs or opacity is too low
  if (!showStickyTabs || opacity < 0.01) return null;

  // Calculate proper positioning
  const stickyStyle = inPanel 
    ? { 
        top: `${stickyTopOffset}px`,
        zIndex: 30 // Lower z-index for panel mode to stay below panel header
      }
    : { 
        top: `${headerHeight}px`,
        zIndex: 40 // Higher z-index for window mode
      };

  return (
    <div 
      className={`${inPanel ? 'sticky' : 'fixed'} left-0 right-0 bg-white border-b overflow-hidden transition-all duration-300 ease-out`}
      style={{
        ...stickyStyle,
        opacity: opacity,
        transform: `translateY(${(1 - opacity) * -10}px)`,
        boxShadow: opacity > 0.5 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <div className="w-full">
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
