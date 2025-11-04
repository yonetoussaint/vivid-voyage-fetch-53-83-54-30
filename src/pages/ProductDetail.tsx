// ProductDetail.tsx - Merged version
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailError from "@/components/product/ProductDetailError";
import SlideUpPanel from "@/components/shared/SlideUpPanel";

// Import components
import ProductImageGallery from "@/components/ProductImageGallery";
import StickyTabsLayout from '@/components/layout/StickyTabsLayout';
import ProductHeader from '@/components/product/ProductHeader';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';

// Import tab components
import ProductOverview from "@/components/product/tabs/ProductOverview";
import ProductVariants from "@/components/product/tabs/ProductVariants";
import ProductReviews from "@/components/product/tabs/ProductReviews";
import StoreReviews from "@/components/product/tabs/StoreReviews";
import ReviewsGallery from "@/components/product/tabs/ReviewsGallery";
import ProductQnA from "@/components/product/tabs/ProductQnA";

// Import hooks
import { useProductDetailState } from './useProductDetailState';

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ProductDetailContent: React.FC<ProductDetailProps> = ({ 
  productId: propProductId, 
  hideHeader = false, 
  inPanel = false, 
  scrollContainerRef,
  stickyTopOffset 
}) => {
  console.log('🚀 ProductDetailContent component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const { startLoading } = useNavigationLoading();

  // Use prop productId first, then param, then default - ensure it's never undefined
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  const { data: product, isLoading, error } = useProduct(productId);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);

  // State for description panel
  const [isDescriptionPanelOpen, setIsDescriptionPanelOpen] = React.useState(false);

  // Product detail state
  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

  // States for header actions
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...(product && (
      ('variants' in product && Array.isArray((product as any).variants) && (product as any).variants.length > 0) ||
      ('variant_names' in product && Array.isArray((product as any).variant_names) && (product as any).variant_names.length > 0)
    ) ? [{ id: 'variants', label: 'Variants' }] : []),
    { id: 'reviews', label: 'Reviews' },
    { id: 'store-reviews', label: 'Store Reviews' },
    { id: 'reviews-gallery', label: 'Reviews Gallery' },
    { id: 'qna', label: 'Q&A' }
  ].filter(tab => tab !== null);

  // ===== Tab Management =====
  const getCurrentTab = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    // Check if the last part is a valid tab ID
    const validTab = tabs.find(tab => tab.id === lastPart);
    if (validTab) {
      return validTab.id;
    }

    // Default to overview if no valid tab found
    return 'overview';
  };

  // Sync URL with active tab
  useEffect(() => {
    const currentTabFromURL = getCurrentTab();
    if (currentTabFromURL !== state.activeTab) {
      console.log('🔄 Syncing active tab from URL:', currentTabFromURL);
      state.setActiveTab(currentTabFromURL);
    }
  }, [location.pathname]);

  // Ensure valid active tab
  useEffect(() => {
    if (!state.activeTab || !tabs.find(tab => tab.id === state.activeTab)) {
      console.log('🔄 Setting default active tab: overview');
      state.setActiveTab('overview');
    }
  }, [state.activeTab, tabs]);

  // Redirect to default tab if no tab in URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    // Check if we're at product root without a tab
    const isProductRoot = currentPath.match(/\/product\/[^/]+$/) || 
                         currentPath.endsWith('/product/') ||
                         !tabs.find(tab => tab.id === lastPart);

    if (isProductRoot && productId) {
      const basePath = currentPath.split('/').slice(0, -1).join('/');
      const newPath = `${basePath}/${productId}/overview`;
      console.log('🔄 Redirecting to default tab:', newPath);
      navigate(newPath, { replace: true });
    }
  }, [navigate, productId, tabs]);

  // Sync active tab with gallery
  useEffect(() => {
    const syncActiveTab = () => {
      if (galleryRef.current) {
        const galleryActiveTab = galleryRef.current.getActiveTab?.();
        if (galleryActiveTab && galleryActiveTab !== state.activeTab) {
          console.log('🔄 Syncing active tab from gallery:', galleryActiveTab);
          state.setActiveTab(galleryActiveTab);
        }
      }
    };

    // Check initially
    syncActiveTab();

    // Set up interval to monitor tab changes
    const interval = setInterval(syncActiveTab, 500);

    return () => clearInterval(interval);
  }, [galleryRef, state.activeTab, state.setActiveTab]);

  const handleReadMore = () => {
    setIsDescriptionPanelOpen(true);
  };

  const handleCloseDescriptionPanel = () => {
    setIsDescriptionPanelOpen(false);
  };

  // Header action handlers
  const handleBackClick = () => navigate(-1);

  const handleShareClick = async () => {
    try {
      if (navigator.share && product) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Could not share the product",
        variant: "destructive",
      });
    }
  };

  const handleFavoriteClick = () => setIsFavorite(!isFavorite);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      startLoading();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    startLoading();
    navigate('/search');
  };

  // Tab change handler
  const handleTabChange = (tabId: string) => {
    console.log('🔄 Tab changed to:', tabId);

    // Update local state
    state.setActiveTab(tabId);

    // Update the gallery's active tab
    if (galleryRef.current) {
      galleryRef.current.setActiveTab(tabId);
    }

    // Update URL to reflect tab change
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const newPath = `${basePath}/${tabId}`;
    navigate(newPath);

    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  // Action buttons
  const actionButtons = [
    {
      Icon: Heart,
      onClick: handleFavoriteClick,
      active: isFavorite,
      activeColor: "#f43f5e",
      count: product?.favorite_count || 0
    },
    {
      Icon: Share,
      onClick: handleShareClick,
      active: false
    }
  ];

  // Buy now function
  const buyNow = async () => {
    if (!user) {
      openAuthOverlay();
      return;
    }

    const currentPrice = product?.discount_price || product?.price || 0;
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: "1",
      price: currentPrice.toString(),
    });

    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  // Get current active tab for proper rendering
  const currentActiveTab = getCurrentTab();
  const isOverviewTab = currentActiveTab === 'overview';

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex space-x-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-12" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  // Header component
  const header = !hideHeader ? (
    <div 
      ref={headerRef} 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <ProductHeader
        onCloseClick={handleBackClick}
        onShareClick={handleShareClick}
        actionButtons={actionButtons}
        forceScrolledState={!isOverviewTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onSearchFocus={handleSearchFocus}
        inPanel={inPanel}
      />
    </div>
  ) : null;

  // Top content (Gallery Section)
  const topContent = (
    <div 
      ref={topContentRef}
      className="w-full bg-white"
    >
      {/* ProductImageGallery directly integrated */}
      <div 
        className="relative z-0 w-full bg-transparent" 
        onClick={() => { if (state.focusMode) state.setFocusMode(false); }}
      >
        <ProductImageGallery 
          ref={galleryRef}
          images={state.displayImages.length > 0 ? state.displayImages : ["/placeholder.svg"]}
          videos={product?.product_videos || []}
          model3dUrl={product?.model_3d_url}
          focusMode={state.focusMode}
          onFocusModeChange={state.setFocusMode}
          seller={product?.sellers}
          product={product}
          onSellerClick={() => {
            if (product?.sellers?.id) {
              navigate(`/seller/${product?.sellers?.id}`);
            }
          }}
          onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
          onImageIndexChange={(currentIndex, totalItems) => {
            state.setCurrentImageIndex(currentIndex);
            state.setTotalImages(totalItems);
          }}
          onVariantImageChange={handlers.handleVariantImageSelection}
          activeTab={state.activeTab}
          onBuyNow={buyNow}
          onReadMore={onReadMore}
        />
      </div>
    </div>
  );

  // Enhanced children with tab content routing
  const enhancedChildren = (
    <div className="product-tab-content">
      <Routes>
        <Route path="/variants" element={<ProductVariants product={product} />} />
        <Route path="/reviews" element={<ProductReviews product={product} />} />
        <Route path="/store-reviews" element={<StoreReviews product={product} />} />
        <Route path="/reviews-gallery" element={<ReviewsGallery product={product} />} />
        <Route path="/qna" element={<ProductQnA product={product} />} />
        <Route path="/overview" element={<ProductOverview product={product} />} />
        <Route path="/" element={<ProductOverview product={product} />} />
        {/* Catch-all route for any unmatched paths */}
        <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
      </Routes>
    </div>
  );

  console.log('🎯 ProductDetail rendering with activeTab:', state.activeTab);
  console.log('🎯 Current tab from URL:', currentActiveTab);
  console.log('🎯 Tabs configuration:', tabs);
  console.log('🎯 Is overview tab:', isOverviewTab);

  return (
    <>
      <StickyTabsLayout
        header={header}
        headerRef={headerRef}
        topContent={topContent}
        topContentRef={topContentRef}
        tabs={tabs}
        activeTab={state.activeTab}
        onTabChange={handleTabChange}
        isProductsTab={isOverviewTab}
        showTopBorder={false}
        variant="underline"
        stickyBuffer={4}
        alwaysStickyForNonProducts={true}
        inPanel={inPanel}
        scrollContainerRef={scrollContainerRef}
        stickyTopOffset={stickyTopOffset}
      >
        {enhancedChildren}
      </StickyTabsLayout>

      {/* SlideUpPanel at the root level */}
      <SlideUpPanel
        isOpen={isDescriptionPanelOpen}
        onClose={handleCloseDescriptionPanel}
        title="Product Description"
        showCloseButton={true}
      >
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product?.description || product?.short_description || 'No description available.'}
          </p>
        </div>
      </SlideUpPanel>
    </>
  );
};

// Main wrapper component with routing
const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  console.log('🔍 ProductDetail routing debug:', {
    location: location.pathname,
    params: { id },
    fullPath: location.pathname
  });

  // If no ID is found in params, use the default
  const productId = id || DEFAULT_PRODUCT_ID;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/product/${productId}/overview`} replace />} />
      <Route path="/overview" element={<ProductDetailContent />} />
      <Route path="/variants" element={<ProductDetailContent />} />
      <Route path="/reviews" element={<ProductDetailContent />} />
      <Route path="/store-reviews" element={<ProductDetailContent />} />
      <Route path="/reviews-gallery" element={<ProductDetailContent />} />
      <Route path="/qna" element={<ProductDetailContent />} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
    </Routes>
  );
};

export default ProductDetail;