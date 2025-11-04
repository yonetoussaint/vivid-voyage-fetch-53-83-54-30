import React, { useRef, useState, useEffect } from 'react';
import ProductDetail, { ProductDetailContent } from '@/pages/ProductDetail';
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

    console.log('🔧 Setting up scroll listener for panel');

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
      console.log('🧹 Cleaning up panel scroll listener');
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
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [panelHeaderHeight, setPanelHeaderHeight] = useState(60);
  const { setHasActiveOverlay } = useScreenOverlay();
  const navigate = useNavigate();

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
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = 0;
        }
      }, 100);
      return () => clearTimeout(timer);
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
    console.log('🔗 Details button clicked, productId:', productId);
    if (productId) {
      navigate(`/product/${productId}`);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  if (!isOpen || !productId) return null;

  const handleTabChange = (section: string) => {
    setActiveSection(section);
  };

  const handleShareClick = () => {
    console.log('Share clicked in panel');
  };

  const handleProductDetailsClick = () => {
    console.log('Product details clicked');
    onClose();
  };

  return (
    <>
      {/* Backdrop with full coverage */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
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
            focusMode={focusMode}
            showHeaderInFocus={showHeaderInFocus}
            onProductDetailsClick={handleProductDetailsClick}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
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
          >
            {/* ✅ FIX: Use ProductDetailContent directly with props */}
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