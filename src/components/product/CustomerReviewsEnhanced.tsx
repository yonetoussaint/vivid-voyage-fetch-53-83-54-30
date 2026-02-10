// components/product/CustomerReviews.tsx
import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import ErrorBoundary from './ErrorBoundary';
import CustomerReviewsSkeleton from './CustomerReviewsSkeleton';
import { useMockReviews } from "@/hooks/useMockReviews";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem, { Review } from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
}

const CustomerReviews = React.memo(({ productId, limit }: CustomerReviewsProps) => {
  const {
    expandedReviews,
    expandedReplies,
    isLoading,
    error,
    replyingTo,
    replyText,
    itemBeingReplied,
    setReplyText,
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    finalReviews,
    summaryStats
  } = useMockReviews({ productId, limit });

  // Memoize the displayed reviews
  const displayedReviews = useMemo(() => 
    finalReviews.slice(0, 2), 
    [finalReviews]
  );

  // Memoize event handlers
  const memoizedHandleLikeReply = useCallback((replyId: string, reviewId: string) => {
    handleLikeReply(replyId, reviewId);
  }, [handleLikeReply]);

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

  if (isLoading) {
    return <CustomerReviewsSkeleton />;
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
        <ReviewsSummary />

        <div className="py-2">
          <div className="space-y-2">
            {finalReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ color: '#666' }}>
                  No reviews found for this product.
                </p>
                <p className="text-sm text-muted-foreground mt-1" style={{ color: '#666' }}>
                  Be the first to leave a review!
                </p>
              </div>
            ) : (
              displayedReviews.map((review: Review) => (
                <div key={review.id} className="px-2">
                  <ReviewItem
                    review={review}
                    expandedReviews={expandedReviews}
                    expandedReplies={expandedReplies}
                    onToggleReadMore={memoizedToggleReadMore}
                    onToggleShowMoreReplies={memoizedToggleShowMoreReplies}
                    onCommentClick={memoizedHandleCommentClick}
                    onShareClick={handleShareClick}
                    onLikeReply={memoizedHandleLikeReply}
                    onReplyToReply={memoizedHandleReplyToReply}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {finalReviews.length > 2 && (
          <div className="px-2 pb-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewAllReviews}
            >
              View All {finalReviews.length} Reviews
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
      </div>
    </ErrorBoundary>
  );
});

CustomerReviews.displayName = 'CustomerReviews';

export default CustomerReviews;