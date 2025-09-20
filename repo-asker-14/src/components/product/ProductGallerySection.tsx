import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "@/components/ProductImageGallery";
import GalleryTabsContent from "@/components/product/gallery/GalleryTabsContent";

interface ProductGallerySectionProps {
  galleryRef: React.RefObject<any>;
  displayImages: string[];
  product: any;
  focusMode: boolean;
  onFocusModeChange: (focus: boolean) => void;
  onProductDetailsClick: () => void;
  onImageIndexChange: (currentIndex: number, totalItems: number) => void;
  onVariantImageChange: (imageUrl: string, variantName: string) => void;
  onSellerClick: () => void;
  onBuyNow?: () => void;
  onViewCart?: () => void;
}

const ProductGallerySection = forwardRef<HTMLDivElement, ProductGallerySectionProps>(({
  galleryRef,
  displayImages,
  product,
  focusMode,
  onFocusModeChange,
  onProductDetailsClick,
  onImageIndexChange,
  onVariantImageChange,
  onSellerClick,
  onBuyNow,
  onViewCart
}, ref) => {

  const galleryState = {
    activeTab: 0,
    totalItems: displayImages.length || 1,
    galleryItems: displayImages.length > 0 ? displayImages : ["/placeholder.svg"],
    currentIndex: 0,
    isPlaying: false,
    videoIndices: [],
    handleThumbnailClick: (index: number) => {},
  };

  return (
    <div className="relative z-0 w-full bg-transparent" ref={ref} onClick={() => { if (focusMode) onFocusModeChange(false); }}>
      <GalleryTabsContent
        activeTab={galleryState.activeTab}
        totalItems={galleryState.totalItems}
        galleryItems={galleryState.galleryItems}
        currentIndex={galleryState.currentIndex}
        isPlaying={galleryState.isPlaying}
        videoIndices={galleryState.videoIndices}
        productId={product?.id}
        product={product}
        onThumbnailClick={galleryState.handleThumbnailClick}
        onImageSelect={onVariantImageChange}
        onConfigurationChange={() => {}}
        onBuyNow={onBuyNow}
        onViewCart={onViewCart}
      />
    </div>
  );
});

ProductGallerySection.displayName = "ProductGallerySection";

export default ProductGallerySection;