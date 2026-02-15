// components/product/CustomerReviews.tsx
import React, { useMemo, useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Star } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { useProductReviews } from "@/hooks/useProductReviews";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem, { Review } from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';
import AddReviewModal from '@/components/product/AddReviewModal';

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
}

const CustomerReviews = React.memo(({ productId, limit = 5 }: CustomerReviewsProps) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  
  const {
    reviews,
    isLoading,
    error,
    totalCount,
    expandedReviews,
    expandedReplies,
    replyingTo,
    replyText,
    itemBeingReplied,
    setReplyText,
    handleLike,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    submitReview,
    summaryStats,
    user
  } = useProductReviews({ productId, limit });

  // Memoize the displayed reviews
  const displayedReviews = useMemo(() => 
    reviews.slice(0, 2), 
    [reviews]
  );

  // Memoize event handlers
  const memoizedHandleLike = useCallback((replyId: string, reviewId: string) => {
    handleLike(replyId, 'reply');
  }, [handleLike]);

  const memoizedToggleReadMore = useCallback((reviewId: string) => {
    toggleReadMore(reviewId);
  }, [toggleReadMore]);

  const memoizedToggleShowMoreReplies = useCallback((reviewId: string) => {
    toggleShowMoreReplies(reviewId);
  }, [toggleShowMoreReplies]);

  const memoizedHandleCommentClick = useCallback((reviewId: string) => {
    handleCommentClick(reviewId);
  }, [handleCommentClick]);

  const memoizedHandleReplyToReply = useCallback((replyId: string, reviewId: string, userName: string) => {
    handleReplyToReply(replyId, reviewId, userName);
  }, [handleReplyToReply]);

  const handleViewAllReviews = useCallback(() => {
    window.location.href = `/product/${productId}/reviews`;
  }, [productId]);

  const handleAddReviewClick = useCallback(() => {
    if (!user) {
      // Show login modal or redirect to login
      // You can integrate with your auth context here
      alert('Please sign in to leave a review');
      return;
    }
    setIsAddReviewModalOpen(true);
  }, [user]);

  const handleAddReviewSubmit = useCallback(async (reviewData: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    const success = await submitReview({
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment
    });
    
    if (success) {
      setIsAddReviewModalOpen(false);
    }
  }, [submitReview]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <div className="animate-pulse">
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="p-4 border-t">
            {[1, 2].map((i) => (
              <div key={i} className="mb-4 p-3 border rounded">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={fetchReviews}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        <ReviewsSummary stats={summaryStats} />

        {/* Dotted Border Add Review Button */}
        <div className="px-4 py-3">
          <button
            onClick={handleAddReviewClick}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            <span className="text-gray-600 group-hover:text-blue-600 font-medium">
              Write a Review
            </span>
          </button>
        </div>

        <div className="py-2">
          <div className="space-y-2">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ color: '#666' }}>
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              displayedReviews.map((review: Review, index: number) => (
                <div key={review.id} className="px-2">
                  <ReviewItem
                    review={review}
                    expandedReviews={expandedReviews}
                    expandedReplies={expandedReplies}
                    onToggleReadMore={memoizedToggleReadMore}
                    onToggleShowMoreReplies={memoizedToggleShowMoreReplies}
                    onCommentClick={memoizedHandleCommentClick}
                    onShareClick={() => handleShareClick(review.id)}
                    onLikeReview={(reviewId) => handleLike(reviewId, 'review')}
                    onLikeReply={memoizedHandleLike}
                    onReplyToReply={memoizedHandleReplyToReply}
                    isLast={index === displayedReviews.length - 1}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {totalCount > 2 && (
          <div className="px-2 pb-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewAllReviews}
            >
              View All {totalCount} Reviews
            </Button>
          </div>
        )}

        <ReplyBar
          replyingTo={replyingTo}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSubmitReply={handleSubmitReply}
          onCancelReply={handleCancelReply}
        />

        {/* Add Review Modal */}
        <AddReviewModal
          isOpen={isAddReviewModalOpen}
          onClose={() => setIsAddReviewModalOpen(false)}
          onSubmit={handleAddReviewSubmit}
          productName="This Product" // You can pass the actual product name from props
        />
      </div>
    </ErrorBoundary>
  );
});

CustomerReviews.displayName = 'CustomerReviews';

export default CustomerReviews;