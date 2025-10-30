// GalleryTabsContent.tsx (Updated)
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
import { GalleryItem, Product } from './types';
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
  product?: Product;
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
  
  // Use product variants hook
  const { selectedVariant, handleOptionSelect } = useProductVariants(product || {} as Product);

  // Fetch product data for variants
  const { data: productData } = useProduct(productId || '');

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleReadMore = () => {
    setIsDescriptionPanelOpen(true);
  };

  const handleVariantChange = (variantId: string) => {
    // Handle variant change logic here
    const newVariant = product?.variants.find(v => v.id === variantId);
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
    if (isVariantsTab && product) {
      // Show images for the currently selected variant
      return [
        selectedVariant?.mainImage,
        ...(selectedVariant?.additionalImages || [])
      ].filter(Boolean) as string[];
    }
    return galleryItems.map(item => item.src);
  }, [isVariantsTab, product, selectedVariant, galleryItems]);

  const thumbnailGalleryItems = useMemo(() => {
    if (isVariantsTab && product) {
      return [
        { type: 'image' as const, src: selectedVariant?.mainImage || '' },
        ...(selectedVariant?.additionalImages?.map(src => ({ 
          type: 'image' as const, src 
        })) || [])
      ];
    }
    return galleryItems;
  }, [isVariantsTab, product, selectedVariant, galleryItems]);

  const variantNames = isVariantsTab && selectedVariant 
    ? [Object.values(selectedVariant.options).join(' / ')]
    : [];

  const handleThumbnailClick = (index: number) => {
    if (isVariantsTab && selectedVariant) {
      const images = [
        selectedVariant.mainImage,
        ...(selectedVariant.additionalImages || [])
      ];
      if (images[index]) {
        onImageSelect(images[index], Object.values(selectedVariant.options).join(' / '));
      }
    } else {
      onThumbnailClick(index);
    }
  };

  return (
    <div className="mt-2 w-full">
      {(activeTab === 'overview' || activeTab === 'variants') && (
        <div className="space-y-6">
          {activeTab === 'variants' && product && selectedVariant && (
            <ProductVariantDisplay
              product={product}
              currentVariant={selectedVariant}
              onVariantChange={handleVariantChange}
              onImageSelect={onImageSelect}
              currentIndex={currentIndex}
              onThumbnailClick={onThumbnailClick}
              isPlaying={isPlaying}
            />
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
              selectedColor={selectedVariant.options.color || ''}
              selectedStorage={selectedVariant.options.size || ''}
              selectedNetwork={selectedVariant.options.material || ''}
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