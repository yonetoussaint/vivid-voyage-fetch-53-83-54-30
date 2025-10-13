// GalleryTabsContent.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import ProductVariants from '@/components/product/ProductVariants';
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
import FullDescription from '@/components/product/FullDescription';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import SlideUpPanel from '@/components/shared/SlideUpPanel'; // Import SlideUpPanel
import { Zap } from 'lucide-react'; // Import Zap icon

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

  return (
    <div className="mt-2 w-full">
      {(activeTab === 'overview' || !activeTab) && (
        <div className="space-y-3">
          <GalleryThumbnails
            images={galleryItems.map(item => item.src)}
            currentIndex={currentIndex}
            onThumbnailClick={onThumbnailClick}
            isPlaying={isPlaying}
            videoIndices={videoIndices}
            galleryItems={galleryItems}
          />

          <IPhoneXRListing
            product={product}
            onReadMore={onReadMore} // Pass the handler
          />

          {/* Search Info Component moved to description's original position */}
          {productId && (
            <SearchInfoComponent productId={productId} />
          )}

          <ReviewGallery />

          {/* Description Component moved before BookGenreFlashDeals */}


          <ProductSpecifications productId={productId} />

          <BookGenreFlashDeals
            className="border border-gray-200 rounded-lg overflow-hidden"
            title="Related Products"
            showSectionHeader={true}
            showSummary={false}
          />

          {/* Sticky Checkout Bar for Overview Tab */}
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

      {/* Rest of the tabs remain the same */}
      {activeTab === 'variants' && (

          <ProductVariants
            productId={productId}
            onImageSelect={onImageSelect}
            onConfigurationChange={onConfigurationChange}
          />

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

      {activeTab === 'shipping' && (
        <ProductSectionWrapper>
          <div className="w-full space-y-6 py-4">
            <div className="w-full">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Delivery Options</h3>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center w-full p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-gray-600">Local Delivery</span>
                  <span className="font-semibold text-green-700">1-2 business days</span>
                </div>
                <div className="flex justify-between items-center w-full p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-600">International Shipping</span>
                  <span className="font-semibold text-blue-700">5-10 business days</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Shipping Partners</h3>
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">DHL</span>
                  </div>
                  <span className="text-gray-600">DHL Express</span>
                </div>
                <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">FX</span>
                  </div>
                  <span className="text-gray-600">FedEx</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
              <ul className="w-full space-y-2 text-gray-600">
                <li className="flex items-start w-full">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>30-day return window from delivery date</span>
                </li>
                <li className="flex items-start w-full">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Items must be in original condition with all accessories</span>
                </li>
              </ul>
            </div>
          </div>
        </ProductSectionWrapper>
      )}

      {activeTab === 'recommendations' && (
        <ProductSectionWrapper>
          <BookGenreFlashDeals
            className="border border-gray-200 rounded-lg overflow-hidden"
            icon={Zap}
          />
        </ProductSectionWrapper>
      )}

      {/* SlideUpPanel for Full Description */}

    </div>
  );
};

export default GalleryTabsContent;