import React, { useState, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store, Star, MessageCircle } from "lucide-react";
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
import ReviewsGallery from "@/components/product/ReviewsGallery";
import ReviewTypingBar from "@/components/product/ReviewTypingBar";
import ReviewItem from "@/components/product/ReviewItem";
import ReplyItem from "@/components/product/ReplyItem";
import ReviewsSummary from "@/components/product/ReviewsSummary";
import ReplyBar from "@/components/product/ReplyBar";
import ReviewSkeleton from "@/components/product/ReviewSkeleton";

// Hooks
import { useProductDetail } from "@/hooks/product-detail.hooks";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useAuth } from "@/context/RedirectAuthContext";
import { useAuthOverlay } from "@/context/AuthOverlayContext";
import { useNavigate } from "react-router-dom";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ProductDetailContent: React.FC<ProductDetailProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  
  // State for reviews filtering
  const [reviewFilters, setReviewFilters] = useState<any[]>([]);

  // Product detail hook
  const {
    isFavorite,
    currentGalleryIndex,
    scrollY,
    productId,
    product,
    isLoading,
    error,
    galleryImages,
    listingProduct,
    galleryRef,
    handleBackClick,
    handleFavoriteClick,
    handleShareClick,
    handleBuyNow,
    handleReadMore,
    handleThumbnailClick,
    handleImageIndexChange,
  } = useProductDetail(props);

  // Reviews hook
  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    totalCount,
    expandedReviews,
    expandedReplies,
    replyingTo,
    replyText,
    itemBeingReplied,
    repliesMap,
    setReplyText,
    handleLike,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick: handleReviewShare,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    summaryStats,
    user: authUser,
    userLikes,
  } = useProductReviews({ 
    productId: productId || props.productId, 
    limit: 5 
  });

  // Safe function to get replies for a review with error handling
  const getRepliesForReview = useCallback((reviewId: string) => {
    try {
      if (!reviewId || !repliesMap) return [];
      return repliesMap[reviewId] || [];
    } catch (error) {
      console.error('Error getting replies for review:', error);
      return [];
    }
  }, [repliesMap]);

  // Helper functions
  const getAvatarColor = useCallback((name?: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'];
    if (!name) return colors[0];
    try {
      const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      return colors[Math.abs(hash) % colors.length];
    } catch (error) {
      return colors[0];
    }
  }, []);

  const getInitials = useCallback((name?: string) => {
    if (!name) return '?';
    try {
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    } catch (error) {
      return '?';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  const renderStars = useCallback((rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= rating ? '#FBBF24' : 'none'}
          stroke={star <= rating ? '#FBBF24' : '#D1D5DB'}
          strokeWidth="1.5"
        />
      ))}
    </div>
  ), []);

  const handleReviewSubmit = async (review: string, rating: number) => {
    try {
      console.log("Submitting review:", { review, rating, productId });
      // Add your API call here
      alert("Review submitted successfully! Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleAddReview = useCallback(() => {
    if (!user) {
      openAuthOverlay();
      return;
    }
    navigate(`/product/${productId}/add-review`);
  }, [user, openAuthOverlay, navigate, productId]);

  const handleViewAllReviews = useCallback(() => {
    navigate(`/product/${productId}/reviews`);
  }, [navigate, productId]);

  const handleFilterChange = useCallback((filters: any[]) => {
    setReviewFilters(filters);
    console.log('Filters changed:', filters);
  }, []);

  if (!productId && !props.productId) {
    return <ProductDetailError message="Product ID is missing" />;
  }

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  const displayedReviews = reviews.slice(0, 5);
  const showSkeleton = reviewsLoading && reviews.length === 0;

  return (
    <>
      <AliExpressHeader
        mode="product-detail"
        scrollY={scrollY}
        productData={{
          sellers: product?.sellers,
          favorite_count: product?.favorite_count,
        }}
        onBackClick={handleBackClick}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        isFavorite={isFavorite}
        inPanel={props.inPanel}
        hideSearchBar={true}
      />

      {/* Add padding at the bottom to account for the fixed review bar */}
      <div style={{ minHeight: "100vh", paddingBottom: "120px" }}>
        <div className="w-full bg-white">
          <ProductImageGallery
            ref={galleryRef}
            images={galleryImages}
            videos={product?.product_videos || []}
            model3dUrl={product?.model_3d_url}
            seller={product?.sellers}
            product={{
              id: product?.id || "",
              name: product?.name || "",
              price: product?.price || 0,
              discount_price: product?.discount_price,
              inventory: product?.inventory || 0,
              sold_count: product?.sold_count || 0,
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

        {/* Only show GalleryThumbnails when there are multiple images/videos */}
        {galleryImages && galleryImages.length > 1 && (
          <div className="">
            <GalleryThumbnails
              images={galleryImages}
              currentIndex={currentGalleryIndex}
              onThumbnailClick={handleThumbnailClick}
            />
          </div>
        )}

        <div className="">
          <ProductDetailInfo
            product={listingProduct}
            onReadMore={handleReadMore}
          />
        </div>

        <Separator />

        <div className="mt-2">
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
            maxProducts={100}
            viewAllLink={`/seller/${product?.sellers?.id}`}
            viewAllText="View More"
          />
        </div>

        <Separator />

        <div className="mt-4">
          <ReviewsGallery viewAllLink="/reviews" />
        </div>

        <Separator />

        {/* Reviews Summary Section with built-in filtering */}
        {summaryStats && (
          <ReviewsSummary
            title="REVIEWS/COMMENTS"
            subtitle="Ratings and reviews are verified and are from people who use the same type of device that you use"
            icon={MessageCircle}
            viewAllLink={`/product/${productId}/reviews`}
            viewAllText="View All Reviews"
            productId={productId}
            summaryStats={summaryStats}
            reviews={reviews}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Write a Review Button */}
        <div className="px-4 mt-4">
          <button
            onClick={handleAddReview}
            className="w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="px-2 mt-4">
          {showSkeleton ? (
            // Loading Skeletons
            Array(3).fill(0).map((_, index) => (
              <ReviewSkeleton key={index} />
            ))
          ) : reviewsError ? (
            // Error State
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to load reviews</p>
              <button
                onClick={() => fetchReviews()}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            // Empty State
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <button
                onClick={handleAddReview}
                className="px-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Be the first to review
              </button>
            </div>
          ) : (
            // Reviews
            <>
              {displayedReviews.map((review, index) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  expandedReviews={expandedReviews}
                  expandedReplies={expandedReplies}
                  onToggleReadMore={toggleReadMore}
                  onToggleShowMoreReplies={toggleShowMoreReplies}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleReviewShare}
                  onLikeReview={handleLike}
                  onReplyToReply={handleReplyToReply}
                  getRepliesForReview={getRepliesForReview}
                  getAvatarColor={getAvatarColor}
                  getInitials={getInitials}
                  formatDate={formatDate}
                  currentUserId={user?.id}
                  isLast={index === displayedReviews.length - 1}
                />
              ))}

              {/* View All Reviews Button */}
              {totalCount > displayedReviews.length && (
                <button
                  onClick={handleViewAllReviews}
                  className="w-full mt-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View All {totalCount} Reviews
                </button>
              )}
            </>
          )}
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

      {/* Reply Bar - Shown when replying to a comment */}
      {replyingTo && (
        <ReplyBar
          replyingTo={replyingTo}
          replyText={replyText}
          itemBeingReplied={itemBeingReplied}
          onSubmit={handleSubmitReply}
          onCancel={handleCancelReply}
          setReplyText={setReplyText}
          getAvatarColor={getAvatarColor}
          getInitials={getInitials}
        />
      )}

      {/* ALWAYS VISIBLE Review Typing Bar */}
      <ReviewTypingBar
        productName={product.name || "This product"}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (!id) {
    return <ProductDetailError message="Product not found" />;
  }

  return <ProductDetailContent productId={id} />;
};

export { ProductDetailContent };
export default ProductDetail;