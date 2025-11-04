// ProductDetail.tsx - Only show gallery on overview tab
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

  // Use prop productId first, then param, then default
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  const { data: product, isLoading, error } = useProduct(productId);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);

  // States
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDescriptionPanelOpen, setIsDescriptionPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'store-reviews', label: 'Store Reviews' },
    { id: 'reviews-gallery', label: 'Reviews Gallery' },
    { id: 'qna', label: 'Q&A' }
  ];

  // ===== Tab Management (Like SellerLayout) =====
  const getCurrentTab = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const validTab = tabs.find(tab => tab.id === lastPart);
    return validTab ? validTab.id : 'overview';
  };

  // Sync URL with active tab
  useEffect(() => {
    const currentTabFromURL = getCurrentTab();
    if (currentTabFromURL !== activeTab) {
      console.log('🔄 Syncing active tab from URL:', currentTabFromURL);
      setActiveTab(currentTabFromURL);
    }
  }, [location.pathname]);

  // Redirect to default tab if no tab in URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    const isProductRoot = currentPath.match(/\/product\/[^/]+$/) || 
                         !tabs.find(tab => tab.id === lastPart);

    if (isProductRoot && productId) {
      const newPath = `/product/${productId}/overview`;
      console.log('🔄 Redirecting to default tab:', newPath);
      navigate(newPath, { replace: true });
    }
  }, [navigate, productId, tabs]);

  // Tab change handler (Like SellerLayout)
  const handleTabChange = (tabId: string) => {
    console.log('🔄 Tab changed to:', tabId);
    setActiveTab(tabId);

    // Update URL to reflect tab change
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const newPath = `${basePath}/${tabId}`;
    navigate(newPath);

    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  // Event handlers
  const handleReadMore = () => setIsDescriptionPanelOpen(true);
  const handleCloseDescriptionPanel = () => setIsDescriptionPanelOpen(false);
  const handleBackClick = () => navigate(-1);
  const handleFavoriteClick = () => setIsFavorite(!isFavorite);

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

  const isOverviewTab = activeTab === 'overview';

  // Loading state
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

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return <ProductDetailError />;
  }

  // ===== COMPONENT STRUCTURE (Like SellerLayout) =====

  // Header component - Same pattern as SellerLayout
  const header = !hideHeader ? (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
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

  // Top content - ONLY ProductImageGallery on overview tab (Like SellerLayout's SellerInfoSection only on products tab)
  const topContent = isOverviewTab ? (
    <div ref={topContentRef} className="w-full bg-white">
      <ProductImageGallery 
        ref={galleryRef}
        images={product?.images?.length > 0 ? product.images : ["/placeholder.svg"]}
        videos={product?.product_videos || []}
        model3dUrl={product?.model_3d_url}
        seller={product?.sellers}
        product={product}
        onSellerClick={() => {
          if (product?.sellers?.id) {
            navigate(`/seller/${product?.sellers?.id}`);
          }
        }}
        onBuyNow={buyNow}
        onReadMore={handleReadMore}
      />
    </div>
  ) : undefined;

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
        <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
      </Routes>
    </div>
  );

  console.log('🎯 ProductDetail rendering with activeTab:', activeTab);
  console.log('🎯 Is overview tab (showing gallery):', isOverviewTab);

  return (
    <>
      <StickyTabsLayout
        header={header}
        headerRef={headerRef}
        topContent={topContent}
        topContentRef={topContentRef}
        tabs={tabs}
        activeTab={activeTab}
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

      {/* SlideUpPanel for description */}
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
      <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
    </Routes>
  );
};

export default ProductDetail;