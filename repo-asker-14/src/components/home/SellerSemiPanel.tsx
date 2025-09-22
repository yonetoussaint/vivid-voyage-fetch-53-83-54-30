import React, { useRef, useState, useEffect } from 'react';
import SellerPage from '@/pages/SellerPage';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";

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
  const { setHasActiveOverlay } = useScreenOverlay();

  // Get scroll progress for the panel
  const { progress: scrollProgress, scrollY } = usePanelScrollProgress(scrollContainerRef, isOpen);

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
          console.log('🎯 Seller Panel opened - container setup:', {
            hasContainer: true,
            scrollTop: container.scrollTop,
            clientHeight: container.clientHeight,
            scrollHeight: container.scrollHeight,
            overflow: getComputedStyle(container).overflow
          });

          // Force a scroll event to initialize progress
          const scrollEvent = new Event('scroll', { bubbles: true });
          container.dispatchEvent(scrollEvent);
        } else {
          console.log('❌ Seller Panel opened but no scroll container found');
        }
      }, 100); // Increased delay for better reliability

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debug logging for panel scroll progress
  React.useEffect(() => {
    console.log('📋 Seller Panel Scroll Debug:', {
      scrollY,
      scrollProgress,
      hasContainer: !!scrollContainerRef.current,
      panelHeaderHeight,
      maxScroll: 120,
      progressCalculation: `${scrollY}/120 = ${scrollProgress}`,
      isOpen,
      containerScrollTop: scrollContainerRef.current?.scrollTop || 0,
      shouldShowScrolledState: scrollProgress > 0.5
    });
  }, [scrollY, scrollProgress, panelHeaderHeight, isOpen]);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  if (!isOpen) return null;

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
              No seller selected
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerSemiPanel;