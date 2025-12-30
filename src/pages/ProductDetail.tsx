// src/pages/ProductDetail.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store, Send, Star, MessageSquare } from 'lucide-react';
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
  onClose?: () => void;
  isOpen?: boolean;
}> = ({ productName, onSubmit, onClose, isOpen = true }) => {
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
    setIsExpanded(!isExpanded);
    if (!isExpanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ease-in-out">
      <div className="container mx-auto max-w-6xl px-2 md:px-4">
        {/* Minimized State */}
        {!isExpanded ? (
          <div className="py-2">
            <button
              onClick={toggleExpand}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MessageSquare size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Write a review</span>
            </button>
          </div>
        ) : (
          /* Expanded State */
          <div className="py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Your Review</span>
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
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="text-sm">×</span>
              </button>
            </div>

            <div className="mb-2 px-1">
              <span className="text-xs text-gray-500">Reviewing: </span>
              <span className="text-sm font-medium text-gray-800">{productName}</span>
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your experience with this product..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  style={{ minHeight: '80px' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!reviewText.trim() || rating === 0}
                  className={`absolute right-2 bottom-2 p-2 rounded-full transition-all ${
                    reviewText.trim() && rating > 0
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="flex flex-col space-y-2 pb-2">
                <button
                  onClick={toggleExpand}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Minimize
                </button>
              </div>
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

  const [showReviewBar, setShowReviewBar] = useState(false);
  const [isReviewBarOpen, setIsReviewBarOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollYRef = useRef(0);

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

  // Show/hide review bar based on scroll position with debouncing
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Always show if user scrolled past half the page
      if (currentScrollY > windowHeight / 2) {
        setShowReviewBar(true);
      }
      // Hide if at the very top or bottom
      else if (currentScrollY < 100 || currentScrollY + windowHeight >= documentHeight - 100) {
        setShowReviewBar(false);
      }

      lastScrollYRef.current = currentScrollY;
    }, 150); // Increased debounce time for stability
  }, []);

  // Handle manual close of review bar
  const handleCloseReviewBar = () => {
    setIsReviewBarOpen(false);
    setShowReviewBar(false);
  };

  // Auto-open review bar when it appears for the first time
  useEffect(() => {
    if (showReviewBar && !isReviewBarOpen) {
      setIsReviewBarOpen(true);
    }
  }, [showReviewBar, isReviewBarOpen]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check after a delay to ensure page is loaded
    const initialTimeout = setTimeout(() => {
      handleScroll();
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [handleScroll]);

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

      <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
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

      {/* Sticky Review Typing Bar */}
      <ReviewTypingBar 
        productName={product.name || 'This product'}
        onSubmit={handleReviewSubmit}
        onClose={handleCloseReviewBar}
        isOpen={showReviewBar && isReviewBarOpen}
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