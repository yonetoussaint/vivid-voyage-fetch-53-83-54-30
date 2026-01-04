import React from 'react';
import { Star, Play, Heart } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Review {
  id: string;
  user_name?: string;
  rating?: number;
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
  onToggleReadMore: (reviewId: string) => void;
  onCommentClick: (reviewId: string) => void;
  onLikeClick?: (reviewId: string) => void;
  onMediaClick?: (url: string) => void;
}

const ReviewItem = ({
  review,
  expandedReviews,
  onToggleReadMore,
  onCommentClick,
  onLikeClick,
  onMediaClick = (url) => window.open(url, '_blank')
}: ReviewItemProps) => {
  const {
    id,
    user_name,
    rating = 0,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    likeCount = 0,
    commentCount = 0,
  } = review;

  return (
    <div 
      className="p-4 mb-4"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        borderRadius: '0'
      }}
    >
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-full" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.08)',
              color: '#333'
            }}
          >
            {user_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{user_name || 'Anonymous'}</span>
              {verified_purchase && (
                <span 
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: '#e6f4ea',
                    color: '#1e7e34'
                  }}
                >
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span>•</span>
              <span>{formatDate(created_at)}</span>
            </div>
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
                    onClick={() => onMediaClick(item.url)}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-28 h-28 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                    style={{ borderRadius: '0' }}
                    onClick={() => onMediaClick(item.url)}
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
          onClick={() => onLikeClick?.(id)}
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
        
        {/* Right side: Comments button */}
        <button
          onClick={() => onCommentClick(id)}
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