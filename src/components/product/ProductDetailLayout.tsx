// ProductDetailLayout.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';

import { useProductDetailState } from './useProductDetailState';

// Import sub-components
import ProductHeaderSection from './ProductHeaderSection';
import ProductGallerySection from './ProductGallerySection';
import StickyTabsNavigation from './StickyTabsNavigation';
import ProductRelatedSection from './ProductRelatedSection';
import ProductScrollManager from './ProductScrollManager';
import ProductVariantManager from './ProductVariantManager';
import ProductStickyComponents from './ProductStickyComponents';
import ProductNameDisplay from './ProductNameDisplay';
import PriceInfo from './PriceInfo';
import StickyTabsLayout from '@/components/layout/StickyTabsLayout';

interface ProductDetailLayoutProps {
  product: any;
  productId: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  onReadMore?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ProductDetailLayout: React.FC<ProductDetailLayoutProps> = ({
  product,
  productId,
  hideHeader = false,
  inPanel = false,
  scrollContainerRef,
  stickyTopOffset,
  onReadMore
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

  // Create a ref for description section
  const descriptionRef = React.useRef<HTMLDivElement>(null);

  // Get first variant values if variants exist and use them as defaults
  const hasVariants = product.variants && product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants[0] : null;

  // Build complete variant display name
  const getVariantDisplayName = () => {
    if (!firstVariant) return product.name;

    const parts = [product.name];

    // Add variant name (color)
    if (firstVariant.name) {
      parts.push(firstVariant.name);
    }

    // Add storage if available
    if (firstVariant.storageOptions && firstVariant.storageOptions.length > 0) {
      const firstStorage = firstVariant.storageOptions[0];
      if (firstStorage.capacity) {
        parts.push(firstStorage.capacity);
      }

      // Add network if available in storage
      if (firstStorage.networkOptions && firstStorage.networkOptions.length > 0) {
        const firstNetwork = firstStorage.networkOptions[0];
        if (firstNetwork.name) {
          parts.push(firstNetwork.name);
        }

        // Add condition if available in network
        if (firstNetwork.conditionOptions && firstNetwork.conditionOptions.length > 0) {
          const firstCondition = firstNetwork.conditionOptions[0];
          if (firstCondition.name) {
            parts.push(firstCondition.name);
          }
        }
      }
    }

    return parts.join(' ');
  };

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

  const displayName = getVariantDisplayName();
  const displayPrice = firstVariant?.price !== undefined ? firstVariant.price : product.price;

  // Create a modified product object with first variant values as defaults
  const productWithDefaults = hasVariants ? {
    ...product,
    name: displayName,
    price: displayPrice
  } : product;

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

  // Header component
  const header = !hideHeader ? (
    <ProductHeaderSection
      ref={refs.headerRef}
      activeSection={state.activeSection}
      onTabChange={handlers.scrollToSection}
      focusMode={state.focusMode}
      showHeaderInFocus={state.showHeaderInFocus}
      onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
      currentImageIndex={state.currentImageIndex}
      totalImages={state.totalImages}
      onShareClick={() => state.setSharePanelOpen(true)}
    />
  ) : null;

  // Top content (Gallery Section)
  const topContent = (
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
        console.log('🔍 Seller click - seller data:', product?.sellers);
        console.log('🔍 Seller ID:', product?.sellers?.id);
        if (product?.sellers?.id) {
          navigate(`/seller/${product?.sellers?.id}`);
        } else {
          console.error('❌ No seller ID found');
        }
      }}
      onReadMore={onReadMore}
    />
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

  // Main content that goes below the tabs
  const mainContent = (
    <>
      {/* Scroll Management */}
      <ProductScrollManager
        focusMode={state.focusMode}
        setFocusMode={state.setFocusMode}
        setShowHeaderInFocus={state.setShowHeaderInFocus}
        setShowStickyRecommendations={state.setShowStickyRecommendations}
        setActiveSection={state.setActiveSection}
        setActiveTab={state.setActiveTab}
        headerRef={refs.headerRef}
        setHeaderHeight={state.setHeaderHeight}
        overviewRef={refs.overviewRef}
        descriptionRef={descriptionRef}
        verticalRecommendationsRef={refs.verticalRecommendationsRef}
      />

      {/* Variant Management */}
      <ProductVariantManager
        product={product}
        displayImages={state.displayImages}
        setDisplayImages={state.setDisplayImages}
        setCurrentImageIndex={state.setCurrentImageIndex}
      />

      {/* Sticky Components */}
      <ProductStickyComponents
        product={product}
        onBuyNow={buyNow}
        sharePanelOpen={state.sharePanelOpen}
        setSharePanelOpen={state.setSharePanelOpen}
        activeTab={state.activeTab}
      />
    </>
  );

  // For panel mode, use the existing StickyTabsNavigation
  if (inPanel) {
    return (
      <div className="flex flex-col min-h-0 bg-white overscroll-none pb-20" ref={refs.contentRef}>
        {header}
        {topContent}
        
        {/* Use existing StickyTabsNavigation for panel mode */}
        <StickyTabsNavigation
          headerHeight={state.headerHeight}
          galleryRef={refs.galleryRef}
          inPanel={inPanel}
          scrollContainerRef={scrollContainerRef}
          stickyTopOffset={stickyTopOffset}
        />

        {/* Main content */}
        {mainContent}
      </div>
    );
  }

  // Use reusable StickyTabsLayout for regular mode
  return (
    <StickyTabsLayout
      header={header}
      headerRef={refs.headerRef}
      topContent={topContent}
      topContentRef={refs.overviewRef}
      tabs={tabs}
      activeTab={state.activeTab}
      onTabChange={state.setActiveTab}
      isProductsTab={true}
      showTopBorder={false}
      variant="underline"
      stickyBuffer={4}
      alwaysStickyForNonProducts={true}
      inPanel={inPanel}
      scrollContainerRef={scrollContainerRef}
      stickyTopOffset={stickyTopOffset}
    >
      {mainContent}
    </StickyTabsLayout>
  );
};

export default ProductDetailLayout;