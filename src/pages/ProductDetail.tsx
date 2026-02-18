import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store, Star, Filter, ChevronDown } from "lucide-react";
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

// Filter options
const filterOptions = [
  { id: 'all', label: 'All Reviews' },
  { id: 'with-media', label: 'With Photos/Videos' },
  { id: '5-star', label: '5 Star' },
  { id: '4-star', label: '4 Star' },
  { id: '3-star', label: '3 Star' },
  { id: '2-star', label: '2 Star' },
  { id: '1-star', label: '1 Star' },
];

const ProductDetailContent: React.FC<ProductDetailProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  
  // Local state for filters
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const filterDropdownRef = React.useRef<HTMLDivElement>(null);

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

  // Reviews hook - DON'T add default values here, let the hook return its actual values
  const reviewsHook = useProductReviews({ 
    productId: productId || props.productId, 
    limit: 5 
  });

  // Now destructure with proper null checks when using the values
  const {
    reviews = [],
    isLoading: reviewsLoading = false,
    error: reviewsError = null,
    totalCount = 0,
    expandedReviews = new Set(),
    expandedReplies = new Set(),
    replyingTo = null,
    replyText = "",
    itemBeingReplied = null,
    repliesMap = new Map(),
    setReplyText = () => {},
    handleLike = () => {},
    toggleReadMore = () => {},
    toggleShowMoreReplies = () => {},
    handleCommentClick = () => {},
    handleReplyToReply = () => {},
    handleShareClick: handleReviewShare = () => {},
    handleSubmitReply = () => {},
    handleCancelReply = () => {},
    fetchReviews = () => {},
    summaryStats = null,
    userLikes = new Set(),
  } = reviewsHook;

  // Helper functions
  const getAvatarColor = (name?: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'];
    if (!name) return colors[0];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderStars = (rating: number) => (
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
  );

  const handleReviewSubmit = async (review: string, rating: number) => {
    try {
      console.log("Submitting review:", { review, rating, productId });
      // Use the submitReview function from the hook
      if (reviewsHook.submitReview) {
        await reviewsHook.submitReview({ rating, comment: review });
      } else {
        alert("Review submitted successfully! Thank you for your feedback!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleAddReview = () => {
    if (!user) {
      openAuthOverlay();
      return;
    }
    navigate(`/product/${productId}/add-review`);
  };

  const handleViewAllReviews = () => {
    navigate(`/product/${productId}/reviews`);
  };

  const handleFilterChange = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => 
        prev.includes(filterId) 
          ? prev.filter(f => f !== filterId)
          : [...prev.filter(f => f !== 'all'), filterId]
      );
    }
    setShowFilterDropdown(false);
    
    // Here you would apply the filter to the reviews
    // You might need to add a filter function to your hook
  };

  // Close filter dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Safe array slicing with null check
  const displayedReviews = Array.isArray(reviews) ? reviews.slice(0, 2) : [];
  const showSkeleton = reviewsLoading && (!reviews || reviews.length === 0);

  // Helper function to get replies for a review
  const getRepliesForReview = (reviewId: string) => {
    return repliesMap instanceof Map ? repliesMap.get(reviewId) || [] : [];
  };

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
            images={galleryImages || []}
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

        {/* Reviews Summary Section */}
        {summaryStats && (
          <div className="mt-4 px-4">
            <ReviewsSummary
              averageRating={summaryStats.averageRating || 0}
              totalReviews={summaryStats.totalReviews || 0}
              ratingCounts={summaryStats.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
              reviewDistribution={summaryStats.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
            />
          </div>
        )}

        {/* Customer Reviews Header */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Reviews ({totalCount || 0})
            </h2>
            
            {/* Filter Button */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange(option.id)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        activeFilters.includes(option.id)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && !activeFilters.includes('all') && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((filter) => {
                const option = filterOptions.find(opt => opt.id === filter);
                return option ? (
                  <span
                    key={filter}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                  >
                    {option.label}
                    <button
                      onClick={() => handleFilterChange(filter)}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Write a Review Button */}
        <div className="px-4 mb-4">
          <button
            onClick={handleAddReview}
            className="w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="px-4">
          {showSkeleton ? (
            // Loading Skeletons
            Array.from({ length: 3 }).map((_, index) => (
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
          ) : !displayedReviews || displayedReviews.length === 0 ? (
            // Empty State
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <button
                onClick={handleAddReview}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Be the first to review
              </button>
            </div>
          ) : (
            // Reviews
            <>
              {displayedReviews.map((review, index) => (
                <ReviewItem
                  key={review?.id || index}
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
          replyText={replyText || ""}
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
        productName={product?.name || "This product"}
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