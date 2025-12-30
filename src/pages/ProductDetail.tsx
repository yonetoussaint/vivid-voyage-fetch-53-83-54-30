// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store, Send, Star } from 'lucide-react';
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

const ReviewTypingBar: React.FC<{ productName: string; onSubmit: (review: string, rating: number) => void }> = ({ productName, onSubmit }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-2 md:p-3">
      <div className="container mx-auto max-w-6xl">
        {isExpanded && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Rate this product:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-600">Reviewing: </span>
              <span className="text-sm font-medium text-gray-800 truncate">{productName}</span>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsExpanded(true)}
              placeholder="Write your review about this product..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSubmit}
              disabled={!reviewText.trim() || rating === 0}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                reviewText.trim() && rating > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Write Review
            </button>
          )}
        </div>
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

  const [showReviewBar, setShowReviewBar] = useState(false);

  // Handle review submission (you'll need to connect this to your API)
  const handleReviewSubmit = async (review: string, rating: number) => {
    try {
      // Here you would typically call your API to submit the review
      console.log('Submitting review:', { review, rating, productId });
      
      // Example API call (uncomment and modify when you have the endpoint):
      // await api.submitReview(productId!, { text: review, rating });
      
      // Show success message
      alert('Review submitted successfully!');
      
      // You might want to refresh the reviews section here
      // refreshReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Show review bar when scrolled past a certain point
  useEffect(() => {
    const handleScroll = () => {
      const reviewsSection = document.getElementById('customer-reviews-section');
      if (reviewsSection) {
        const rect = reviewsSection.getBoundingClientRect();
        // Show review bar when reviews section is in view
        setShowReviewBar(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      <div style={{ minHeight: '100vh', paddingBottom: '70px' }}> {/* Add padding for sticky bar */}
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

        {/* Customer Reviews Section with ID for scroll detection */}
        <div id="customer-reviews-section" className="mt-4">
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

      {/* Sticky Review Typing Bar */}
      {showReviewBar && product && (
        <ReviewTypingBar 
          productName={product.name || 'This product'}
          onSubmit={handleReviewSubmit}
        />
      )}
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