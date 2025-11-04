// ProductDetailLayout.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share } from 'lucide-react';

import { useProductDetailState } from './useProductDetailState';

// Import sub-components
import ProductGallerySection from './ProductGallerySection';
import ProductScrollManager from './ProductScrollManager';
import ProductVariantManager from './ProductVariantManager';
import ProductStickyComponents from './ProductStickyComponents';
import StickyTabsLayout from '@/components/layout/StickyTabsLayout';
import ProductHeader from '@/components/product/ProductHeader';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';

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
  const { startLoading } = useNavigationLoading();

  // Refs - Same as SellerLayout structure
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

  // States for header actions - Same as SellerLayout pattern
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get first variant values if variants exist and use them as defaults
  const hasVariants = product.variants && product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants[0] : null;

  // Build complete variant display name
  const getVariantDisplayName = () => {
    if (!firstVariant) return product.name;

    const parts = [product.name];
    if (firstVariant.name) parts.push(firstVariant.name);

    if (firstVariant.storageOptions && firstVariant.storageOptions.length > 0) {
      const firstStorage = firstVariant.storageOptions[0];
      if (firstStorage.capacity) parts.push(firstStorage.capacity);

      if (firstStorage.networkOptions && firstStorage.networkOptions.length > 0) {
        const firstNetwork = firstStorage.networkOptions[0];
        if (firstNetwork.name) parts.push(firstNetwork.name);

        if (firstNetwork.conditionOptions && firstNetwork.conditionOptions.length > 0) {
          const firstCondition = firstNetwork.conditionOptions[0];
          if (firstCondition.name) parts.push(firstCondition.name);
        }
      }
    }

    return parts.join(' ');
  };

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

    syncActiveTab();
    const interval = setInterval(syncActiveTab, 500);
    return () => clearInterval(interval);
  }, [refs.galleryRef, state.activeTab, state.setActiveTab]);

  const displayName = getVariantDisplayName();
  const displayPrice = firstVariant?.price !== undefined ? firstVariant.price : product.price;

  // Header action handlers - Same as SellerLayout pattern
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
        // Fallback for browsers that don't support Web Share API
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

  // Action buttons - Same as SellerLayout pattern
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

  // Header component - Moved from ProductHeaderSection, same as SellerLayout structure
  const header = !hideHeader ? (
    <div 
      ref={headerRef} 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <ProductHeader
        onCloseClick={handleBackClick}
        onShareClick={handleShareClick}
        actionButtons={actionButtons}
        forceScrolledState={!state.isProductsTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onSearchFocus={handleSearchFocus}
        inPanel={inPanel}
      />
    </div>
  ) : null;

  // Top content (Gallery Section) - Same as SellerLayout structure
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

  // Tabs configuration - Same pattern as SellerLayout
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
        headerRef={headerRef} // Use the local headerRef
        setHeaderHeight={state.setHeaderHeight}
        overviewRef={refs.overviewRef}
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

  // Use reusable StickyTabsLayout for both modes - Same as SellerLayout structure
  return (
    <StickyTabsLayout
      header={header}
      headerRef={headerRef}
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