import React from 'react';
import { Play, Heart, Share2, CheckCircle } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";
import { useNavigate } from 'react-router-dom';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Review {
  id: string;
  user_name?: string;
  comment?: string;
  created_at: string;
  verified_purchase?: boolean;
  media?: MediaItem[];
  likeCount?: number;
  commentCount?: number;
}

interface ReviewItemProps {
  review: Review;
  expandedReviews: Set<string>;
  expandedReplies?: Set<string>;
  onToggleReadMore: (reviewId: string) => void;
  onToggleShowMoreReplies?: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
  onShareClick?: (reviewId: string) => void;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
}

const ReviewItem = ({
  review,
  expandedReviews,
  expandedReplies,
  onToggleReadMore,
  onToggleShowMoreReplies,
  onCommentClick,
  onShareClick,
  onLikeReply,
  onReplyToReply,
}: ReviewItemProps) => {
  const navigate = useNavigate();
  const {
    id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    likeCount = 0,
    commentCount = 0,
  } = review;

  const handleCommentClick = (reviewId: string) => {
    navigate(`/reviews/${reviewId}`);
    onCommentClick?.(reviewId);
  };

  return (
    <div 
      className="p-2 mb-4"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        borderRadius: '0'
      }}
    >
      {/* Review Header */}
      <div className="flex items-start mb-3">
        <div 
          className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-full flex-shrink-0" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.08)',
            color: '#333'
          }}
        >
          {user_name?.charAt(0) || 'U'}
        </div>
        
        <div className="flex-1 min-w-0 ml-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-gray-900 truncate">{user_name || 'Anonymous'}</span>
              {verified_purchase && (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              )}
            </div>
            {/* Follow Button */}
            <button
              className="text-sm px-3 py-1 border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0 ml-2"
              style={{
                borderRadius: '4px',
                background: 'none',
                color: '#333',
                fontWeight: '500',
                minWidth: '80px'
              }}
            >
              Follow
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-0.5">
            <span>{formatDate(created_at)}</span>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <div 
        className="text-gray-800 mb-4"
      >
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {comment.length > 120 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'Read less' : 'Read more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.map((item, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-28 h-28 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ borderRadius: '0' }}
                    onClick={() => window.open(item.url, '_blank')}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-28 h-28 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                    style={{ borderRadius: '0' }}
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clean Engagement Section */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        {/* Left side: Like button */}
        <button
          onClick={() => console.log('Like clicked for review:', id)}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1.5"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit'
          }}
        >
          <Heart
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {likeCount > 0 ? likeCount : 'Like'}
        </button>

        {/* Middle: Share button */}
        <button
          onClick={() => onShareClick?.(id)}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit'
          }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {/* Right side: Comments button */}
        <button
          onClick={() => handleCommentClick(id)}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit'
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {commentCount > 0 ? `${commentCount} comments` : 'Comment'}
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;