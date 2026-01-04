import React, { useState } from 'react';
import { Star, Play, Heart, MessageCircle } from 'lucide-react';
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
  onLikeClick?: (reviewId: string, liked: boolean) => void;
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
    likeCount: initialLikeCount = 0,
    commentCount = 0,
  } = review;

  // Local state for like functionality (TikTok style)
  const [liked, setLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(initialLikeCount);

  const handleLikeClick = () => {
    const newLiked = !liked;
    const increment = newLiked ? 1 : -1;
    
    setLiked(newLiked);
    setCurrentLikeCount(prev => Math.max(0, prev + increment));
    
    // Call parent callback if provided
    if (onLikeClick) {
      onLikeClick(id, newLiked);
    }
  };

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
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" 
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

      {/* TikTok-style Engagement Section */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        {/* Left side: Stacked Like and Comments */}
        <div className="flex items-center gap-6">
          {/* Like Button - TikTok style */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleLikeClick}
              className="flex flex-col items-center transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                font: 'inherit'
              }}
            >
              <div className="relative">
                <Heart
                  className={`w-7 h-7 transition-all duration-300 ${liked ? 'scale-110' : 'scale-100'}`}
                  fill={liked ? "#ff0050" : "none"}
                  stroke={liked ? "#ff0050" : "currentColor"}
                  strokeWidth="2"
                />
                {liked && (
                  <div className="absolute inset-0 animate-ping">
                    <Heart
                      className="w-7 h-7 opacity-30"
                      fill="#ff0050"
                      stroke="#ff0050"
                      strokeWidth="2"
                    />
                  </div>
                )}
              </div>
              <span 
                className={`text-xs mt-1 transition-colors ${liked ? 'text-[#ff0050] font-semibold' : 'text-gray-600'}`}
              >
                {currentLikeCount}
              </span>
            </button>
          </div>

          {/* Comments Button - Stacked */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onCommentClick(id)}
              className="flex flex-col items-center transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                font: 'inherit'
              }}
            >
              <MessageCircle
                className="w-7 h-7 text-gray-700"
                strokeWidth="1.5"
              />
              <span className="text-xs mt-1 text-gray-600">
                {commentCount}
              </span>
            </button>
          </div>
        </div>
        
        {/* Right side: Share button (optional) */}
        <button
          onClick={() => {/* Add share functionality */}}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: '13px'
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;