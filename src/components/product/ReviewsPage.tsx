import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewItem, { Review } from './ReviewItem';
import { mockReviews, mockComments, Comment } from './mockReviewsData';
import { ArrowLeft, MessageCircle, Send, Heart, Star, MoreVertical, ThumbsUp, Flag } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // Find the selected review
  const selectedReview = reviewId 
    ? mockReviews.find(review => review.id === reviewId)
    : null;

  // Get comments for this review
  const reviewComments = reviewId
    ? comments.filter(comment => comment.reviewId === reviewId)
    : [];

  // If no reviewId in URL but we're coming from a specific review, extract from state
  useEffect(() => {
    if (!reviewId && location.state?.selectedReviewId) {
      navigate(`/reviews/${location.state.selectedReviewId}`, { replace: true });
    }
  }, [reviewId, location.state, navigate]);

  // If no review is selected, show not found or redirect
  if (!selectedReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Review Not Found</h1>
          <p className="text-gray-600 mb-4">The review you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleToggleReadMore = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleLikeClick = (reviewId: string) => {
    console.log('Liked review:', reviewId);
  };

  const handleMediaClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !reviewId) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      reviewId,
      user_name: 'You',
      comment: newComment,
      created_at: new Date().toISOString()
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">Review Comments</h1>
              <p className="text-xs text-gray-500">
                {reviewComments.length} comment{reviewComments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        {/* Selected Review - Edge to edge */}
        <div className="bg-white">
          {/* Review Header */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-full bg-gray-200">
                {selectedReview.user_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{selectedReview.user_name || 'Anonymous'}</span>
                      {selectedReview.verified_purchase && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= (selectedReview.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{new Date(selectedReview.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mt-3">
              <p className="text-gray-900">{selectedReview.comment}</p>

              {/* Media */}
              {selectedReview.media && selectedReview.media.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedReview.media.map((item, index) => (
                      <div key={index} className="flex-shrink-0">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="w-40 h-40 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleMediaClick(item.url)}
                          />
                        ) : (
                          <div
                            className="w-40 h-40 rounded-lg relative cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleMediaClick(item.url)}
                          >
                            <img
                              src={item.thumbnail}
                              alt={item.alt}
                              className="w-full h-full rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleLikeClick(selectedReview.id)}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {selectedReview.likeCount || 0}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {reviewComments.length}
                    </button>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Count */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Comments ({reviewComments.length})
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Most relevant
              </button>
            </div>
          </div>
        </div>

        {/* Comments List - Edge to edge */}
        <div className="bg-white divide-y divide-gray-100">
          {reviewComments.length > 0 ? (
            reviewComments.map((comment) => (
              <div key={comment.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex gap-3">
                  <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full bg-gray-200">
                    {comment.user_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900 truncate block">{comment.user_name}</span>
                        <p className="text-gray-800 mt-1">{comment.comment}</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full ml-2">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{new Date(comment.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                      <button className="hover:text-blue-600">Like</button>
                      <button className="hover:text-blue-600">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No comments yet.</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to comment on this review!</p>
            </div>
          )}
        </div>

        {/* Add Comment Form - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200">
          <div className="p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`p-2 rounded-full ${
                  newComment.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;