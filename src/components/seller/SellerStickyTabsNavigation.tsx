// components/seller/SellerStickyTabsNavigation.tsx
import React, { useState, useEffect } from 'react';
import TabsNavigation from "@/components/home/TabsNavigation";

interface SellerStickyTabsNavigationProps {
  headerHeight: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SellerStickyTabsNavigation: React.FC<SellerStickyTabsNavigationProps> = ({
  headerHeight,
  activeTab,
  onTabChange
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScrollForStickyTabs = () => {
      // Calculate threshold based on actual content
      const sellerHeader = document.getElementById('seller-header');
      const sellerHeroBanner = document.querySelector('[data-testid="seller-hero-banner"]') || 
                              document.querySelector('.seller-hero-banner') ||
                              document.querySelector('[class*="hero"]');
      const sellerInfo = document.querySelector('[data-testid="seller-info"]') || 
                        document.querySelector('.seller-info') ||
                        document.querySelector('[class*="seller-profile"]');
      
      let threshold = headerHeight + 200; // Default fallback
      
      // Calculate actual threshold based on DOM elements
      if (sellerHeader) {
        threshold = sellerHeader.offsetHeight;
        
        if (sellerHeroBanner) {
          threshold += sellerHeroBanner.getBoundingClientRect().height;
        }
        
        if (sellerInfo) {
          threshold += sellerInfo.getBoundingClientRect().height;
        }
      }
      
      const scrollTop = window.scrollY;
      const shouldShow = scrollTop > (threshold - headerHeight - 20); // 20px buffer for smooth transition
      
      // Calculate opacity for smooth transition
      const transitionZone = 40; // 40px transition zone
      const transitionStart = threshold - headerHeight - transitionZone;
      const fadeProgress = Math.max(0, Math.min(1, (scrollTop - transitionStart) / transitionZone));
      
      setShowStickyTabs(shouldShow);
      setOpacity(fadeProgress);
    };

    // Use RAF for smoother performance
    let rafId: number;
    const throttledScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScrollForStickyTabs);
    };

    // Initial check
    setTimeout(handleScrollForStickyTabs, 100); // Delay to ensure DOM is ready
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [headerHeight]);

  // Handle tab click - simplified to avoid scroll conflicts
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Don't scroll automatically to prevent sticky tabs from hiding
  };

  if (!showStickyTabs && opacity === 0) return null;

  return (
    <div 
      className="fixed left-0 right-0 z-40 bg-white border-b overflow-x-auto shadow-sm transition-all duration-300 ease-out"
      style={{ 
        top: `${headerHeight}px`,
        opacity: opacity,
        transform: `translateY(${(1 - opacity) * -15}px)`, // More noticeable slide effect
        backdropFilter: `blur(${opacity * 10}px)`,
        backgroundColor: `rgba(255, 255, 255, ${0.95 * opacity})`,
        boxShadow: opacity > 0.5 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'
      }}
    >
      <div 
        className="w-full transition-all duration-300 ease-out"
        style={{
          transform: `scale(${0.95 + (opacity * 0.05)})`,
          opacity: opacity
        }}
      >
        <TabsNavigation
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products' },
            { id: 'contact', label: 'Contact' },
            { id: 'about', label: 'About' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabClick}
          edgeToEdge={true}
          style={{ 
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0
          }}
        />
      </div>
    </div>
  );
};

export default SellerStickyTabsNavigation;