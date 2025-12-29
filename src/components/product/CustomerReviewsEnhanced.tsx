import React from 'react';
import { 
  Star, 
  Play,
  Send,
  Heart
} from 'lucide-react';
import ReviewsSummary from '@/components/product/ReviewsSummary.tsx';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import { EngagementSection } from '@/components/shared/EngagementSection';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { Button } from "@/components/ui/button";
import ErrorBoundary from './ErrorBoundary'; // Assuming you have an ErrorBoundary component
import CustomerReviewsSkeleton from './CustomerReviewsSkeleton'; // Assuming you have a Skeleton component
import { useCustomerReviews, truncateText } from "@/hooks/customer-reviews.hooks";
import { formatDate, formatDateForReply } from './DateUtils';

interface CustomerReviewsProps {
  productId: string;
  limit?: number;
}

const CustomerReviews = ({ productId, limit }: CustomerReviewsProps) => {
  const {
    // State
    expandedReviews,
    expandedReplies,
    selectedFilters,
    isLoading,
    error,
    replyingTo,
    replyText,
    
    // Handlers
    setReplyText,
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    handleFilterSelect,
    handleFilterClear,
    handleClearAll,
    handleFilterButtonClick,
    fetchReviews,
    
    // Computed values
    filterCategories,
    finalReviews,
    reviewsSummary,
    itemBeingReplied,
    
    // Statistics
    summaryStats
  } = useCustomerReviews({ productId, limit });

  // Show skeleton loader while loading
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
        <ReviewsSummary/>

        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />

        <div className="py-4">
          {/* Reviews List */}
          <div className="space-y-4">
            {finalReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{color: '#666'}}>No reviews found for this product.</p>
                <p className="text-sm text-muted-foreground mt-1" style={{color: '#666'}}>Be the first to leave a review!</p>
              </div>
            ) : (
              finalReviews.map((review) => (
                <div key={review.id} className="border-b pb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
                  <div className="flex items-start justify-between mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                        {review.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user_name || 'Anonymous'}</span>
                          {review.verified_purchase && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{color: '#666'}}>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-3 h-3 ${star <= (review.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Comment Only - No Title */}
                  <div className="text-foreground text-sm mb-2 px-2">
                    <span>
                      {expandedReviews.has(review.id) ? (review.comment || '') : truncateText(review.comment || '')}
                      {(review.comment || '').length > 120 && (
                        <button
                          onClick={() => toggleReadMore(review.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                        >
                          {expandedReviews.has(review.id) ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </span>
                  </div>

                  {/* Media Section */}
                  {review.media && review.media.length > 0 && (
                    <div className="px-2">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {review.media.map((item, index) => (
                          <div key={index} className="flex-shrink-0 relative">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.alt}
                                className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(item.url, '_blank')}
                              />
                            ) : item.type === 'video' ? (
                              <div 
                                className="w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                                onClick={() => window.open(item.url, '_blank')}
                              >
                                <img
                                  src={item.thumbnail}
                                  alt={item.alt}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                  <Play className="w-6 h-6 text-white fill-white" />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facebook-style Engagement Section */}
                  <EngagementSection
                    likeCount={review.likeCount || 0}
                    commentCount={review.commentCount || 0}
                    shareCount={review.shareCount || 0}
                    onComment={() => handleCommentClick(review.id)}
                    onShare={() => handleShareClick(review.id)}
                  />

                  {/* Replies Section - Flat structure like TikTok */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 ml-6 space-y-3 px-2">
                      {(expandedReplies.has(review.id) ? review.replies : review.replies.slice(0, 2)).map((reply) => (
                        <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: reply.is_seller ? '#3b82f6' : 'rgba(0,0,0,0.1)', color: reply.is_seller ? 'white' : 'black'}}>
                              {reply.user_name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{reply.user_name || 'Anonymous'}</span>
                                {reply.is_seller && (
                                  <div className="flex items-center gap-1">
                                    {reply.verified_seller && <VerificationBadge size="sm" />}
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="font-bold text-sm text-orange-500">Seller</span>
                                  </div>
                                )}
                              </div>

                              {/* Show who this reply is replying to */}
                              {reply.replying_to && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Replying to <span className="font-medium">{reply.replying_to}</span>
                                </div>
                              )}

                              <div className="text-sm text-foreground mt-1">
                                {reply.comment}
                              </div>

                              {/* TikTok-style Like and Reply Buttons with Date */}
                              <div className="flex items-center gap-4 mt-2">
                                <button
                                  onClick={() => handleLikeReply(review.id, reply.id)}
                                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    font: 'inherit',
                                    lineHeight: '1'
                                  }}
                                >
                                  <Heart 
                                    className={`w-4 h-4 flex-shrink-0 ${reply.liked ? 'fill-red-600 text-red-600' : ''}`}
                                  />
                                  <span style={{ lineHeight: '1' }}>{reply.likeCount || 0}</span>
                                </button>

                                <button
                                  onClick={() => handleReplyToReply(review.id, reply.id, reply.user_name || 'User')}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    font: 'inherit',
                                    lineHeight: '1'
                                  }}
                                >
                                  Reply
                                </button>

                                <span 
                                  className="text-sm text-muted-foreground font-medium"
                                  style={{ 
                                    color: '#666',
                                    lineHeight: '1'
                                  }}
                                >
                                  {formatDateForReply(reply.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {review.replies.length > 2 && (
                        <button
                          onClick={() => toggleShowMoreReplies(review.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4 transition-colors"
                        >
                          {expandedReplies.has(review.id) 
                            ? 'Show fewer replies' 
                            : `Show ${review.replies.length - 2} more replies`
                          }
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {limit && finalReviews.length > limit && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.location.href = `/product/${productId}/reviews`}
          >
            View All {finalReviews.length} Reviews
          </Button>
        )}

        {/* Enhanced Conditional Reply Bar */}
        {replyingTo && itemBeingReplied && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg z-40">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Replying to</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                      {replyingTo.userName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium">{replyingTo.userName || 'User'}</span>
                    {replyingTo.isSeller && (
                      <div className="flex items-center gap-1">
                        {replyingTo.verifiedSeller && <VerificationBadge size="sm" />}
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-bold text-sm text-orange-500">Seller</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleCancelReply}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                />
                <button 
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CustomerReviews;