// ProductDetailLayout.tsx (Updated - Removed old variants system)
import React, { useState } from "react";
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

  // Use new variants system
  const hasVariants = product?.variants && product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants[0] : null;

  // Get display name and price from first variant or product
  const displayName = firstVariant 
    ? `${product.name} - ${Object.values(firstVariant.options).join(' / ')}`
    : product.name;

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

  return (
    <div className="flex flex-col min-h-0 bg-white overscroll-none pb-20" ref={refs.contentRef}>
      {/* Header Section - Conditionally rendered */}
      {!hideHeader && (
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
      )}

      {/* Image Gallery Section */}
      <ProductGallerySection
        ref={refs.overviewRef}
        galleryRef={refs.galleryRef}
        displayImages={state.displayImages}
        product={productWithDefaults}
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

      {/* Sticky Tabs Navigation */}
      <StickyTabsNavigation
        headerHeight={state.headerHeight}
        galleryRef={refs.galleryRef}
        inPanel={inPanel}
        scrollContainerRef={scrollContainerRef}
        stickyTopOffset={stickyTopOffset}
      />

      {/* Main Content Sections */}

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

      {/* Variant Management - Updated to use new system */}
      <ProductVariantManager
        product={product}
        displayImages={state.displayImages}
        setDisplayImages={state.setDisplayImages}
        setCurrentImageIndex={state.setCurrentImageIndex}
      />

      {/* Sticky Components */}
      <ProductStickyComponents
        product={productWithDefaults}
        onBuyNow={buyNow}
        sharePanelOpen={state.sharePanelOpen}
        setSharePanelOpen={state.setSharePanelOpen}
        hideCheckoutBar={false}
      />
    </div>
  );
};

export default ProductDetailLayout;