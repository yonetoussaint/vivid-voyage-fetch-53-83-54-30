// src/pages/ProductDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store, Send, Star, MessageSquare, X } from 'lucide-react';
import ProductDetailError from "@/components/product/ProductDetailError";
import ProductImageGallery from "@/components/ProductImageGallery";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FlashDeals from "@/components/home/FlashDeals";
import Separator from "@/components/shared/Separator";
import StoreBanner from "@/components/StoreBanner";
import GalleryThumbnails from "@/components/product/GalleryThumbnails";
import ProductDetailInfo from "@/components/product/ProductDetailInfo";
import ProductDetailLoading from "@/components/product/ProductDetailLoading";
import CustomerReviews from "@/components/product/CustomerReviewsEnhanced";
import ReviewsGallery from "@/components/product/ReviewsGallery";
import { useProductDetail } from "@/hooks/product-detail.hooks";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ReviewTypingBar: React.FC<{ 
  productName: string; 
  onSubmit: (review: string, rating: number) => void;
}> = ({ productName, onSubmit }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (reviewText.trim() && rating > 0) {
      onSubmit(reviewText, rating);
      setReviewText("");
      setRating(0);
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (newExpandedState && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="container mx-auto max-w-6xl px-2 md:px-4">
        {/* Minimized State */}
        {!isExpanded ? (
          <div className="py-3">
            <button
              onClick={toggleExpand}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
            >
              <MessageSquare size={20} className="text-blue-600" />
              <span className="text-blue-700 font-medium">Write a review</span>
            </button>
          </div>
        ) : (
          /* Expanded State */
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-800">Write Your Review</h3>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={18}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Reviewing:</div>
              <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg">
                {productName}
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your honest experience with this product. What did you like or dislike?"
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  style={{ minHeight: '100px' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!reviewText.trim() || rating === 0}
                  className={`absolute right-3 bottom-3 p-2.5 rounded-full transition-all ${
                    reviewText.trim() && rating > 0
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title="Submit review"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>Your review helps other shoppers</span>
              <span>{reviewText.length}/500</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailContent: React.FC<ProductDetailProps> = (props) => {
  const {
    // State
    isFavorite,
    currentGalleryIndex,
    scrollY,

    // Data
    productId,
    product,
    isLoading,
    error,
    galleryImages,
    listingProduct,

    // Refs
    galleryRef,

    // Handlers
    handleBackClick,
    handleFavoriteClick,
    handleShareClick,
    handleBuyNow,
    handleReadMore,
    handleThumbnailClick,
    handleImageIndexChange,
  } = useProductDetail(props);

  // Handle review submission
  const handleReviewSubmit = async (review: string, rating: number) => {
    try {
      console.log('Submitting review:', { review, rating, productId });
      // Add your API call here
      alert('Review submitted successfully! Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!productId) {
    return <ProductDetailError message="Product ID is missing" />;
  }

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  return (
    <>
      <AliExpressHeader
        mode="product-detail"
        scrollY={scrollY}
        productData={{
          sellers: product?.sellers,
          favorite_count: product?.favorite_count
        }}
        onBackClick={handleBackClick}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        isFavorite={isFavorite}
        inPanel={props.inPanel}
        hideSearchBar={true}
      />

      {/* Add padding at the bottom to account for the fixed review bar */}
      <div style={{ minHeight: '100vh', paddingBottom: '120px' }}>
        <div className="w-full bg-white">
          <ProductImageGallery 
            ref={galleryRef}
            images={galleryImages}
            videos={product?.product_videos || []}
            model3dUrl={product?.model_3d_url}
            seller={product?.sellers}
            product={{
              id: product?.id || '',
              name: product?.name || '',
              price: product?.price || 0,
              discount_price: product?.discount_price,
              inventory: product?.inventory || 0,
              sold_count: product?.sold_count || 0
            }}
            onSellerClick={() => {
              if (product?.sellers?.id) {
                handleBackClick();
              }
            }}
            onBuyNow={handleBuyNow}
            onImageIndexChange={handleImageIndexChange}
          />
        </div>

        <div className="mt-2">
          <GalleryThumbnails
            images={galleryImages}
            currentIndex={currentGalleryIndex}
            onThumbnailClick={handleThumbnailClick}
          />
        </div>

        <div className="mt-2">
          <ProductDetailInfo 
            product={listingProduct}
            onReadMore={handleReadMore}
          />
        </div>

        <Separator />

        <div className="mt-4">
          <StoreBanner />
        </div>

        <Separator />

        <div className="mt-4">
          <FlashDeals 
            title="More from this store"
            icon={Store}
            showSectionHeader={true}
            showCountdown={false}
            showTitleChevron={false}
            maxProducts={20}
            viewAllLink={`/seller/${product?.sellers?.id}`}
            viewAllText="View More"
          />
        </div>

        <Separator />

        <div className="mt-4">
          <ReviewsGallery viewAllLink="/reviews" />
        </div>

        <Separator />

        <div className="mt-4">
          <CustomerReviews 
            productId={productId}
            limit={5}
          />
        </div>

        <Separator />

        <InfiniteContentGrid
          initialProducts={[]}
          fetchPageSize={20}
          enableFilters={true}
          enableSorting={true}
          gridLayout="fluid"
          showHeader={false}
          containerClassName="mt-0"
          contentClassName="px-4"
        />
      </div>

      {/* ALWAYS VISIBLE Review Typing Bar */}
      <ReviewTypingBar 
        productName={product.name || 'This product'}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (!id) {
    return <ProductDetailError message="Product not found" />;
  }

  return <ProductDetailContent productId={id} />;
};

export { ProductDetailContent };
export default ProductDetail;