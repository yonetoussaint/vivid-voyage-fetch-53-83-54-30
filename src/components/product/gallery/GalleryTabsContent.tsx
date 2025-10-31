// GalleryTabsContent.tsx
import React, { useState } from 'react';
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
  const thumbnailImages = isVariantsTab && productData?.variant_names
    ? productData.variant_names.map((vn: any) => vn.mainImage || vn.image || '')
    : galleryItems.map(item => item.src);

  const thumbnailGalleryItems = isVariantsTab && productData?.variant_names
    ? productData.variant_names.map((vn: any) => ({
        type: 'image' as const,
        src: vn.mainImage || vn.image || ''
      }))
    : galleryItems;

  const variantNames = isVariantsTab && productData?.variant_names
    ? productData.variant_names.map((vn: any) => vn.name)
    : [];

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
          <GalleryThumbnails
            images={thumbnailImages}
            currentIndex={currentIndex}
            onThumbnailClick={onThumbnailClick}
            isPlaying={isPlaying}
            videoIndices={videoIndices}
            galleryItems={galleryItems}
            variantNames={[]}
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
            showSectionHeader={false}
            showFilters={false}
            showSummary={false}
          />

          {product && onBuyNow && (
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
          )}
        </div>
      )}

      {activeTab === 'variants' && (
        <div className="space-y-3">
          <GalleryThumbnails
            images={thumbnailImages}
            currentIndex={selectedColorIndex}
            onThumbnailClick={handleThumbnailClick}
            isPlaying={false}
            videoIndices={[]}
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
            showSectionHeader={false}
            showFilters={false}
            showSummary={false}
          />
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