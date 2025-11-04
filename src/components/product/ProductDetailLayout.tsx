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

  // Prepare data for GalleryThumbnails
  const isVariantsTab = state.activeTab === 'variants';
  const thumbnailImages = isVariantsTab && product?.variant_names
    ? product.variant_names.map((vn: any) => vn.mainImage || vn.image || '')
    : state.displayImages;

  const thumbnailGalleryItems = isVariantsTab && product?.variant_names
    ? product.variant_names.map((vn: any) => ({
        type: 'image' as const,
        src: vn.mainImage || vn.image || ''
      }))
    : state.displayImages.map(src => ({ type: 'image' as const, src }));

  const variantNames = isVariantsTab && product?.variant_names
    ? product.variant_names.map((vn: any) => vn.name)
    : [];

  const currentThumbnailIndex = isVariantsTab ? selectedColorIndex : state.currentImageIndex;

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

  // Top content (Gallery Section + GalleryThumbnails) - Same pattern as SellerLayout
  const topContent = state.activeTab === 'overview' ? (
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

      {/* GalleryThumbnails - Rendered after gallery section, before tabs */}
      {(state.displayImages.length > 1 || (isVariantsTab && product?.variant_names)) && (
        <div className="mt-2 px-4">
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
    </div>
  ) : undefined;

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