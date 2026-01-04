import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewItem, { Review } from './ReviewItem';
import { mockReviews, mockComments, Comment } from './mockReviewsData';
import { ArrowLeft, MessageCircle, Send, Heart, Star } from 'lucide-react';

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
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6 pt-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Details</h1>
              <p className="text-gray-600 mt-1">
                Review by {selectedReview.user_name || 'Anonymous'}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Review */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 mb-6">
            {/* Review Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center text-lg font-semibold rounded-full bg-gray-200">
                    {selectedReview.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{selectedReview.user_name || 'Anonymous'}</span>
                      {selectedReview.verified_purchase && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= (selectedReview.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{new Date(selectedReview.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-4">
              <p className="text-gray-800 mb-4">{selectedReview.comment}</p>
              
              {/* Media */}
              {selectedReview.media && selectedReview.media.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedReview.media.map((item, index) => (
                      <div key={index} className="flex-shrink-0">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleMediaClick(item.url)}
                          />
                        ) : (
                          <div
                            className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleMediaClick(item.url)}
                          >
                            <img
                              src={item.thumbnail}
                              alt={item.alt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
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
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button
                  onClick={() => handleLikeClick(selectedReview.id)}
                  className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                >
                  <Heart className="w-4 h-4" fill="none" stroke="currentColor" />
                  {selectedReview.likeCount || 0} likes
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  {reviewComments.length} comments
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-gray-200">
            {/* Comments Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({reviewComments.length})
                </h3>
              </div>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-gray-100">
              {reviewComments.length > 0 ? (
                reviewComments.map((comment) => (
                  <div key={comment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-full bg-gray-200">
                        {comment.user_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{comment.user_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 flex items-center gap-1.5 text-sm ${
                    newComment.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Back to All Reviews Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/reviews')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              ← View all reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;