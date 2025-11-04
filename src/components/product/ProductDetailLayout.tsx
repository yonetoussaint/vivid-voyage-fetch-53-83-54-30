// In ProductDetailLayout.tsx - Updated version

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share } from 'lucide-react';

import { useProductDetailState } from './useProductDetailState';

// Import sub-components
import ProductGallerySection from './ProductGallerySection';
import ProductVariantManager from './ProductVariantManager';
import ProductStickyComponents from './ProductStickyComponents';
import StickyTabsLayout from '@/components/layout/StickyTabsLayout';
import ProductHeader from '@/components/product/ProductHeader';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';

// Import GalleryTabsContent and its dependencies
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import SearchInfoComponent from '@/components/product/SearchInfoComponent';
import ReviewGallery from '@/components/product/ReviewGallery';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import ProductSectionWrapper from '@/components/product/ProductSectionWrapper';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import { useProduct } from '@/hooks/useProduct';

interface ProductDetailLayoutProps {
  product: any;
  productId: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  onReadMore?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
  children?: React.ReactNode;
}

// GalleryTabsContent component moved here
interface GalleryTabsContentProps {
  activeTab: string;
  totalItems: number;
  galleryItems: any[];
  currentIndex: number;
  isPlaying: boolean;
  videoIndices: number[];
  productId?: string;
  product?: any;
  onThumbnailClick: (index: number) => void;
  onImageSelect: (imageUrl: string, variantName: string) => void;
  onConfigurationChange: (configData: any) => void;
  onBuyNow?: () => void;
  onReadMore?: () => void;
}

const GalleryTabsContent: React.FC<GalleryTabsContentProps> = ({
  activeTab,
  totalItems,
  galleryItems,
  currentIndex,
  isPlaying,
  videoIndices,
  productId,
  product,
  onThumbnailClick,
  onImageSelect,
  onConfigurationChange,
  onBuyNow,
  onReadMore
}) => {
  const navigate = useNavigate();
  const [isDescriptionPanelOpen, setIsDescriptionPanelOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Fetch product data for variants
  const { data: productData } = useProduct(productId || '');

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleReadMore = () => {
    setIsDescriptionPanelOpen(true);
  };

  // Only show tabs when there's more than 1 item OR when there's a 3D model
  if (!(totalItems > 1 || galleryItems.some(item => item.type === 'model3d'))) {
    return null;
  }

  // Determine thumbnails data based on active tab
  const isVariantsTab = activeTab === 'variants';

  const handleThumbnailClick = (index: number) => {
    if (isVariantsTab && productData?.variant_names) {
      setSelectedColorIndex(index);
      const variant = productData.variant_names[index];
      if (variant?.mainImage || variant?.image) {
        onImageSelect(variant.mainImage || variant.image, variant.name);
      }
    } else {
      onThumbnailClick(index);
    }
  };

  return (
    <div className="mt-2 w-full">
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <IPhoneXRListing
            product={product}
            onReadMore={onReadMore}
          />

          {productId && (
            <SearchInfoComponent productId={productId} />
          )}

          <ProductSpecifications productId={productId} />

          <BookGenreFlashDeals
            className="overflow-hidden"
            title="Related Products"
            showSectionHeader={false}
            showFilters={false}
            showSummary={false}
          />

          {/* StickyCheckoutBar - conditions removed */}
          <StickyCheckoutBar
            product={product}
            onBuyNow={onBuyNow}
            onViewCart={handleViewCart}
            selectedColor=""
            selectedStorage=""
            selectedNetwork=""
            selectedCondition=""
            className=""
            onImageSelect={onImageSelect}
            onConfigurationChange={onConfigurationChange}
          />
        </div>
      )}

      {activeTab === 'variants' && (
        <div className="space-y-3">
          <IPhoneXRListing
            product={product}
            onReadMore={onReadMore}
          />

          {productId && (
            <SearchInfoComponent productId={productId} />
          )}

          <ProductSpecifications productId={productId} />

          <BookGenreFlashDeals
            className="overflow-hidden"
            title="Related Products"
            showSectionHeader={false}
            showFilters={false}
            showSummary={false}
          />

          {/* StickyCheckoutBar - added to variants tab */}
          <StickyCheckoutBar
            product={product}
            onBuyNow={onBuyNow}
            onViewCart={handleViewCart}
            selectedColor=""
            selectedStorage=""
            selectedNetwork=""
            selectedCondition=""
            className=""
            onImageSelect={onImageSelect}
            onConfigurationChange={onConfigurationChange}
          />
        </div>
      )}

      {activeTab === 'reviews' && (
          <CustomerReviewsEnhanced productId={productId || ''} limit={10} />
      )}

      {activeTab === 'qna' && (
        <ProductSectionWrapper>
          <ProductQA/>
        </ProductSectionWrapper>
      )}

      {activeTab === 'store-reviews' && (
        <ProductSectionWrapper>
          <div className="text-center py-8 text-muted-foreground">
            Store Reviews content coming soon
          </div>
        </ProductSectionWrapper>
      )}

      {activeTab === 'reviews-gallery' && (
        <ProductSectionWrapper>
          <ReviewGallery 
            title="Reviews Gallery"
            showViewMore={false}
            customClass="reviews-gallery-grid"
          />
        </ProductSectionWrapper>
      )}

      {/* SlideUpPanel for Full Description */}
    </div>
  );
};

const ProductDetailLayout: React.FC<ProductDetailLayoutProps> = ({
  product,
  productId,
  hideHeader = false,
  inPanel = false,
  scrollContainerRef,
  stickyTopOffset,
  onReadMore,
  children
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const { startLoading } = useNavigationLoading();

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);

  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

  // States for header actions
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State for GalleryThumbnails
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Gallery state for GalleryTabsContent
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoIndices, setVideoIndices] = useState<number[]>([]);

  // Sync active tab with gallery
  useEffect(() => {
    const syncActiveTab = () => {
      if (refs.galleryRef.current) {
        const galleryActiveTab = refs.galleryRef.current.getActiveTab?.();
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
  }, [refs.galleryRef, state.activeTab, state.setActiveTab]);

  // Initialize gallery items
  useEffect(() => {
    if (state.displayImages.length > 0) {
      const items = state.displayImages.map(src => ({ type: 'image' as const, src }));
      setGalleryItems(items);
    }
  }, [state.displayImages]);

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

  // GalleryThumbnails handlers
  const handleThumbnailClick = (index: number) => {
    if (state.activeTab === 'variants' && product?.variant_names) {
      setSelectedColorIndex(index);
      const variant = product.variant_names[index];
      if (variant?.mainImage || variant?.image) {
        handlers.handleVariantImageSelection(variant.mainImage || variant.image, variant.name);
      }
    } else {
      // For overview tab or other tabs
      if (refs.galleryRef.current) {
        state.setCurrentImageIndex(index);
      }
    }
  };

  const handleVariantImageSelect = (imageUrl: string, variantName: string) => {
    handlers.handleVariantImageSelection(imageUrl, variantName);
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

  // Handle tab change - sync with gallery
  const handleTabChange = (tabId: string) => {
    console.log('🔄 Tab changed to:', tabId);
    // Update the gallery's active tab
    if (refs.galleryRef.current) {
      refs.galleryRef.current.setActiveTab(tabId);
    }

    // Update local state
    state.setActiveTab(tabId);

    // Scroll to top when changing tabs (same behavior as SellerLayout)
    window.scrollTo(0, 0);
  };

  // Prepare data for GalleryThumbnails - FIXED LOGIC
  const isVariantsTab = state.activeTab === 'variants';

  // Debug logging
  console.log('🔍 GalleryThumbnails Debug:');
  console.log('activeTab:', state.activeTab);
  console.log('displayImages:', state.displayImages);
  console.log('displayImages length:', state.displayImages.length);
  console.log('isVariantsTab:', isVariantsTab);
  console.log('product.variant_names:', product?.variant_names);

  const hasVariants = isVariantsTab && product?.variant_names && 
    Array.isArray(product.variant_names) && 
    product.variant_names.length > 0;

  console.log('hasVariants:', hasVariants);

  const thumbnailImages = hasVariants
    ? product.variant_names.map((vn: any) => vn.mainImage || vn.image || '').filter(Boolean)
    : state.displayImages;

  const thumbnailGalleryItems = hasVariants
    ? product.variant_names.map((vn: any) => ({
        type: 'image' as const,
        src: vn.mainImage || vn.image || ''
      })).filter((item: any) => item.src)
    : state.displayImages.map(src => ({ type: 'image' as const, src }));

  const variantNames = hasVariants
    ? product.variant_names.map((vn: any) => vn.name)
    : [];

  const currentThumbnailIndex = isVariantsTab ? selectedColorIndex : state.currentImageIndex;

  const shouldRenderThumbnails = thumbnailImages.length > 0 && 
    (thumbnailImages.length > 1 || hasVariants);

  console.log('shouldRenderThumbnails:', shouldRenderThumbnails);
  console.log('thumbnailImages length:', thumbnailImages.length);

  // Header component - Same pattern as SellerLayout
  const header = !hideHeader ? (
    <div 
      ref={headerRef} 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <ProductHeader
        onCloseClick={handleBackClick}
        onShareClick={handleShareClick}
        actionButtons={actionButtons}
        forceScrolledState={state.activeTab !== 'overview'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onSearchFocus={handleSearchFocus}
        inPanel={inPanel}
      />
    </div>
  ) : null;

  // Top content (Gallery Section + GalleryThumbnails + GalleryTabsContent) - UPDATED
  const topContent = (
    <div 
      ref={topContentRef}
      className="w-full bg-white"
    >
      <ProductGallerySection
        ref={refs.overviewRef}
        galleryRef={refs.galleryRef}
        displayImages={state.displayImages}
        product={product}
        focusMode={state.focusMode}
        onFocusModeChange={state.setFocusMode}
        onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
        onImageIndexChange={(currentIndex, totalItems) => {
          state.setCurrentImageIndex(currentIndex);
          state.setTotalImages(totalItems);
        }}
        onVariantImageChange={handlers.handleVariantImageSelection}
        onSellerClick={() => {
          if (product?.sellers?.id) {
            navigate(`/seller/${product?.sellers?.id}`);
          }
        }}
        onReadMore={onReadMore}
      />

      {/* GalleryThumbnails - FIXED: Render conditionally based on available images */}
      {shouldRenderThumbnails && (
        <div className="mt-2 px-4 border border-transparent">
          <GalleryThumbnails
            images={thumbnailImages}
            currentIndex={currentThumbnailIndex}
            onThumbnailClick={handleThumbnailClick}
            isPlaying={false}
            videoIndices={[]}
            galleryItems={thumbnailGalleryItems}
            variantNames={variantNames}
          />
        </div>
      )}

      {/* GalleryTabsContent - MOVED HERE from ProductImageGallery */}
      <GalleryTabsContent
        activeTab={state.activeTab}
        totalItems={state.displayImages.length}
        galleryItems={galleryItems}
        currentIndex={state.currentImageIndex}
        isPlaying={isPlaying}
        videoIndices={videoIndices}
        productId={productId}
        product={product}
        onThumbnailClick={handleThumbnailClick}
        onImageSelect={handleVariantImageSelect}
        onConfigurationChange={handlers.handleConfigurationChange}
        onBuyNow={buyNow}
        onReadMore={onReadMore}
      />
    </div>
  );

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
  ];

  // Enhanced children with additional props - Same pattern as SellerLayout
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        product,
        isLoading: false // Add your loading state here if needed
      } as any);
    }
    return child;
  }) || (
    <div className="bg-white">
      <ProductVariantManager
        product={product}
        displayImages={state.displayImages}
        setDisplayImages={state.setDisplayImages}
        setCurrentImageIndex={state.setCurrentImageIndex}
      />

      <ProductStickyComponents
        product={product}
        onBuyNow={buyNow}
        sharePanelOpen={state.sharePanelOpen}
        setSharePanelOpen={state.setSharePanelOpen}
        activeTab={state.activeTab}
      />
    </div>
  );

  console.log('🎯 ProductDetailLayout rendering with activeTab:', state.activeTab);
  console.log('🎯 Tabs configuration:', tabs);

  // Use StickyTabsLayout with the same implementation pattern as SellerLayout
  return (
    <StickyTabsLayout
      header={header}
      headerRef={headerRef}
      topContent={topContent}
      topContentRef={topContentRef}
      tabs={tabs}
      activeTab={state.activeTab}
      onTabChange={handleTabChange}
      isProductsTab={state.activeTab === 'overview'}
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
  );
};

export default ProductDetailLayout;