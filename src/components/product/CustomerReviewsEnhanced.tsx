import React from 'react';
import { Button } from "@/components/ui/button";
import ErrorBoundary from './ErrorBoundary';
import CustomerReviewsSkeleton from './CustomerReviewsSkeleton';
import { useCustomerReviews } from "@/hooks/customer-reviews.hooks";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem, { Review } from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';

interface CustomerReviewsProps {
  productId: string;
  limit?: number;
}

const CustomerReviews = ({ productId, limit }: CustomerReviewsProps) => {
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
  } = useCustomerReviews({ productId, limit });

  // Get only the first 2 reviews to display
  const displayedReviews = finalReviews.slice(0, 2);

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

        <div className="py-4">
          {/* Container with 1px gap between cards */}
          <div className="space-y-2"> {/* Changed from space-y-4 to space-y-px */}
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
                    onToggleReadMore={toggleReadMore}
                    onToggleShowMoreReplies={toggleShowMoreReplies}
                    onCommentClick={handleCommentClick}
                    onShareClick={handleShareClick}
                    onLikeReply={handleLikeReply}
                    onReplyToReply={handleReplyToReply}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Show "View All" button if there are more than 2 reviews */}
        {finalReviews.length > 2 && (
          <div className="px-4 pb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = `/product/${productId}/reviews`}
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
};

export default CustomerReviews;