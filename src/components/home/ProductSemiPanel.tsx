import React, { useRef, useState, useEffect } from 'react';
import { ProductDetailContent } from '@/pages/ProductDetail';
import ProductHeader from '@/components/product/ProductHeader';
import { Heart, Share } from 'lucide-react';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { useNavigate } from 'react-router-dom';

// Custom hook for panel scroll progress
const usePanelScrollProgress = (scrollContainerRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const onScroll = () => {
      const currentScrollTop = container.scrollTop;
      setScrollY(currentScrollTop);
    };

    // Reset scroll to top when container is available
    container.scrollTop = 0;
    setScrollY(0);

    // Use scroll event listener
    container.addEventListener("scroll", onScroll, { passive: true });

    // Initial call to set progress immediately
    onScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, isOpen]);

  const maxScroll = 120;
  const progress = Math.min(scrollY / maxScroll, 1);

  return { scrollY, progress };
};

interface ProductSemiPanelProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSemiPanel: React.FC<ProductSemiPanelProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [panelHeaderHeight, setPanelHeaderHeight] = useState(60);
  const { setHasActiveOverlay } = useScreenOverlay();
  const navigate = useNavigate();

  // Get scroll progress for the panel
  const { progress: scrollProgress } = usePanelScrollProgress(scrollContainerRef, isOpen);

  // Measure panel header height
  React.useEffect(() => {
    if (headerRef.current && isOpen) {
      const height = headerRef.current.getBoundingClientRect().height;
      setPanelHeaderHeight(height);
    }
  }, [isOpen]);

  // Reset scroll when panel opens
  React.useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  // Handle details button click - navigate to product page
  const handleDetailsClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
      onClose();
    }
  };

  const handleShareClick = () => {
    console.log('Share clicked in panel');
  };

  const handleTabChange = (section: string) => {
    setActiveSection(section);
  };

  if (!isOpen || !productId) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      {/* Semi Panel */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">
        {/* Product Header */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50"
        >
          <ProductHeader 
            inPanel={true}
            activeSection={activeSection}
            onTabChange={handleTabChange}
            onShareClick={handleShareClick}
            forceScrolledState={false}
            customScrollProgress={scrollProgress}
            showCloseIcon={true}
            onCloseClick={onClose}
            showDetailsButton={true}
            onDetailsClick={handleDetailsClick}
            actionButtons={[
              {
                Icon: Heart,
                active: false,
                onClick: () => console.log('Favorite clicked in panel'),
                count: 147
              },
              {
                Icon: Share,
                onClick: handleShareClick,
                count: 23
              }
            ]}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          <div 
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-y-auto"
            style={{ top: `${panelHeaderHeight}px`, bottom: 0 }}
          >
            {/* ✅ Use ProductDetailContent directly - no routing conflicts */}
            <ProductDetailContent 
              productId={productId} 
              hideHeader={true}
              inPanel={true}
              scrollContainerRef={scrollContainerRef}
              stickyTopOffset={panelHeaderHeight}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSemiPanel;