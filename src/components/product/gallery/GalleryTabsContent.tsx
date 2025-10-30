// GalleryTabsContent.tsx (Fixed - Critical fixes)
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
import { GalleryItem } from './types';
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import SearchInfoComponent from '@/components/product/SearchInfoComponent';
import ReviewGallery from '@/components/product/ReviewGallery';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import ProductSectionWrapper from '@/components/product/ProductSectionWrapper';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { Zap } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { ProductVariantDisplay } from '@/components/product/ProductVariantDisplay';
import { useProductVariants } from '@/hooks/useProductVariants';

interface GalleryTabsContentProps {
  activeTab: string;
  totalItems: number;
  galleryItems: GalleryItem[];
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
  
  // Use product variants hook with safe product - only if product has correct structure
  const safeProduct = product?.variants && Array.isArray(product.variants) ? product : null;
  const { selectedVariant, handleOptionSelect, hasVariants } = useProductVariants(safeProduct);

  // Fetch product data for variants
  const { data: productData, isLoading: productLoading } = useProduct(productId || '');

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleReadMore = () => {
    setIsDescriptionPanelOpen(true);
  };

  const handleVariantChange = (variantId: string) => {
    // Handle variant change logic here
    if (!safeProduct?.variants) return;
    
    const newVariant = safeProduct.variants.find((v: any) => v.id === variantId);
    if (newVariant) {
      onConfigurationChange({
        variant: newVariant,
        options: newVariant.options
      });
    }
  };

  // Only show tabs when there's more than 1 item OR when there's a 3D model
  if (!(totalItems > 1 || galleryItems.some(item => item.type === 'model3d'))) {
    return null;
  }

  // Determine thumbnails data based on active tab
  const isVariantsTab = activeTab === 'variants';
  
  const thumbnailImages = useMemo(() => {
    if (isVariantsTab && hasVariants && selectedVariant) {
      // Show images for the currently selected variant
      return [
        selectedVariant?.mainImage,
        ...(selectedVariant?.additionalImages || [])
      ].filter(Boolean) as string[];
    }
    return galleryItems.map(item => item.src).filter(Boolean);
  }, [isVariantsTab, hasVariants, selectedVariant, galleryItems]);

  const thumbnailGalleryItems = useMemo(() => {
    if (isVariantsTab && hasVariants && selectedVariant) {
      const images = [
        selectedVariant?.mainImage,
        ...(selectedVariant?.additionalImages || [])
      ].filter(Boolean);
      
      return images.map(src => ({ 
        type: 'image' as const, 
        src 
      }));
    }
    return galleryItems;
  }, [isVariantsTab, hasVariants, selectedVariant, galleryItems]);

  const variantNames = isVariantsTab && selectedVariant 
    ? [Object.values(selectedVariant.options).join(' / ')]
    : [];

  const handleThumbnailClick = (index: number) => {
    if (isVariantsTab && selectedVariant) {
      const images = [
        selectedVariant.mainImage,
        ...(selectedVariant.additionalImages || [])
      ].filter(Boolean);
      
      if (images[index]) {
        onImageSelect(images[index], Object.values(selectedVariant.options).join(' / '));
      }
    } else {
      onThumbnailClick(index);
    }
  };

  // Show loading state
  if (productLoading) {
    return (
      <div className="mt-2 w-full">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 w-full">
      {(activeTab === 'overview' || activeTab === 'variants') && (
        <div className="space-y-6">
          {activeTab === 'variants' && hasVariants && safeProduct && (
            <ProductVariantDisplay
              product={safeProduct}
              currentVariant={selectedVariant}
              onVariantChange={handleVariantChange}
              onImageSelect={onImageSelect}
              currentIndex={currentIndex}
              onThumbnailClick={onThumbnailClick}
              isPlaying={isPlaying}
            />
          )}
          
          {activeTab === 'variants' && !hasVariants && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No variants available for this product.</p>
            </div>
          )}

          <GalleryThumbnails
            images={thumbnailImages}
            currentIndex={currentIndex}
            onThumbnailClick={handleThumbnailClick}
            isPlaying={!isVariantsTab && isPlaying}
            videoIndices={isVariantsTab ? [] : videoIndices}
            galleryItems={thumbnailGalleryItems}
            variantNames={variantNames}
          />

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
            showSectionHeader={true}
            showFilters={false}
            showSummary={false}
          />

          {product && selectedVariant && onBuyNow && (
            <StickyCheckoutBar
              product={product}
              onBuyNow={onBuyNow}
              onViewCart={handleViewCart}
              selectedColor={selectedVariant.options?.color || ''}
              selectedStorage={selectedVariant.options?.size || ''}
              selectedNetwork={selectedVariant.options?.material || ''}
              selectedCondition="new"
              className=""
              onImageSelect={onImageSelect}
              onConfigurationChange={onConfigurationChange}
            />
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <ProductSectionWrapper>
          <CustomerReviewsEnhanced productId={productId || ''} limit={10} />
        </ProductSectionWrapper>
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

export default GalleryTabsContent;