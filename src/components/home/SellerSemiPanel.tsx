import React, { useRef, useState, useEffect } from 'react';
import SellerPage from '@/pages/SellerPage';
import SellerHeader from '@/components/product/SellerHeader';
import SellerPanelStickyTabs from '@/components/seller/SellerPanelStickyTabs';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { Heart, Share } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { fetchSellerById } from "@/integrations/supabase/sellers";

// Custom hook for panel scroll progress (reused from ProductSemiPanel)
const usePanelScrollProgress = (scrollContainerRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    console.log('🔧 Setting up scroll listener for seller panel');

    const onScroll = () => {
      const currentScrollTop = container.scrollTop;
      setScrollY(currentScrollTop);

      // Additional debug for scroll events
      console.log('🔄 Seller Panel Scroll Event:', {
        scrollTop: currentScrollTop,
        timestamp: Date.now()
      });
    };

    // Reset scroll to top when container is available
    container.scrollTop = 0;
    setScrollY(0);

    // Use scroll event listener
    container.addEventListener("scroll", onScroll, { passive: true });

    // Initial call to set progress immediately
    onScroll();

    return () => {
      console.log('🧹 Cleaning up seller panel scroll listener');
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, isOpen]); // Added isOpen dependency

  const maxScroll = 120; // Match the standard header scroll threshold
  const progress = Math.min(scrollY / maxScroll, 1);

  return { scrollY, progress };
};

interface SellerSemiPanelProps {
  sellerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SellerSemiPanel: React.FC<SellerSemiPanelProps> = ({
  sellerId,
  isOpen,
  onClose,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [panelHeaderHeight, setPanelHeaderHeight] = useState(60); // Default header height
  const [activeTab, setActiveTab] = useState("products");
  const [isFollowing, setIsFollowing] = useState(false);
  const { setHasActiveOverlay } = useScreenOverlay();

  // Get scroll progress for the panel
  const { progress: scrollProgress, scrollY } = usePanelScrollProgress(scrollContainerRef, isOpen);

  // Fetch seller data
  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => fetchSellerById(sellerId!),
    enabled: !!sellerId,
  });

  // Measure panel header height
  React.useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setPanelHeaderHeight(height);
    }
  }, [isOpen]);

  // Force immediate scroll progress update when panel opens
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = 0;
          // Force a scroll event to initialize progress
          const scrollEvent = new Event('scroll', { bubbles: true });
          container.dispatchEvent(scrollEvent);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset active tab when seller changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("products");
    }
  }, [sellerId, isOpen]);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  if (!isOpen) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleShareClick = () => {
    console.log('Share seller clicked in panel');
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessageClick = () => {
    console.log('Message seller clicked in panel');
  };

  return (
    <>
      {/* Backdrop with full coverage */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />

      {/* Semi Panel with increased height (85vh) */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">

        {/* Seller Header - with scroll-based behavior */}
        <div 
          ref={headerRef} 
          className="relative w-full z-10 flex-shrink-0"
        >
          <SellerHeader 
            inPanel={true} // Enable panel behavior
            activeTab={activeTab}
            onTabChange={handleTabChange}
            seller={seller}
            isFollowing={isFollowing}
            onFollow={handleFollowClick}
            onMessage={handleMessageClick}
            onShare={handleShareClick}
            forceScrolledState={false}
            customScrollProgress={scrollProgress}
            showCloseIcon={true} // Show X icon in panel
            onCloseClick={onClose} // Handle close click
            onlineStatus={{ isOnline: seller?.status === 'active', lastSeen: seller?.last_seen }}
            actionButtons={[
              {
                Icon: Heart,
                active: isFollowing,
                onClick: handleFollowClick,
                activeColor: "#f43f5e"
              },
              {
                Icon: Share,
                onClick: handleShareClick
              }
            ]}
          />
        </div>

        {/* Sticky Tabs Navigation - rendered outside scrollable content */}
        <SellerPanelStickyTabs
          headerHeight={panelHeaderHeight}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          inPanel={true}
          scrollContainerRef={scrollContainerRef}
          stickyTopOffset={panelHeaderHeight}
        />

        {/* Scrollable Content with header space */}
        {sellerId ? (
          <div className="flex-1 overflow-hidden min-h-0 relative">
            {/* Scrollable container that we track for scroll progress */}
            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto"
            >
              <SellerPage 
                sellerId={sellerId} 
                hideHeader={true}
                inPanel={true}
                scrollContainerRef={scrollContainerRef}
                stickyTopOffset={panelHeaderHeight}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              {sellerLoading ? "Loading seller..." : "No seller selected"}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerSemiPanel;