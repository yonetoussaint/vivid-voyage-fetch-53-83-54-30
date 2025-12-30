import React from 'react';
import { Star, Play, Heart } from 'lucide-react';
import { EngagementSection } from '@/components/shared/EngagementSection';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { formatDate, formatDateForReply } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Reply {
  id: string;
  user_name?: string;
  comment: string;
  created_at: string;
  likeCount: number;
  liked: boolean;
  is_seller: boolean;
  verified_seller?: boolean;
  replying_to?: string;
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
  shareCount?: number;
  replies?: Reply[];
}

interface ReviewItemProps {
  review: Review;
  expandedReviews: Set<string>;
  expandedReplies: Set<string>;
  onToggleReadMore: (reviewId: string) => void;
  onToggleShowMoreReplies: (reviewId: string) => void;
  onCommentClick: (reviewId: string) => void;
  onShareClick: (reviewId: string) => void;
  onLikeReply: (reviewId: string, replyId: string) => void;
  onReplyToReply: (reviewId: string, replyId: string, userName: string) => void;
  onMediaClick?: (url: string) => void;
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
    shareCount = 0,
    replies = []
  } = review;

  return (
    <div 
      className="p-2"
      style={{
        backgroundColor: '#f5f5f5',
        border: 'none',
        boxShadow: 'none'
      }}
    >
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 bg-muted flex items-center justify-center text-sm font-semibold" 
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            {user_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user_name || 'Anonymous'}</span>
              {verified_purchase && (
                <span 
                  className="text-xs px-2 py-1"
                  style={{
                    backgroundColor: '#e6f4ea',
                    color: '#1e7e34'
                  }}
                >
                  Verified Purchase
                </span>
              )}
            </div>
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: '#666' }}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
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
        className="text-sm mb-3"
        style={{ color: '#333' }}
      >
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {comment.length > 120 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
            >
              {expandedReviews.has(id) ? 'Read less' : 'Read more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.map((item, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-24 h-24 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onMediaClick(item.url)}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
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
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <EngagementSection
        likeCount={likeCount}
        commentCount={commentCount}
        shareCount={shareCount}
        onComment={() => onCommentClick(id)}
        onShare={() => onShareClick(id)}
      />

      {/* Replies Section */}
      {replies.length > 0 && (
        <div 
          className="mt-4 ml-6 space-y-3"
          style={{ 
            backgroundColor: '#fafafa',
            padding: '12px'
          }}
        >
          {(expandedReplies.has(id) ? replies : replies.slice(0, 2)).map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onLike={() => onLikeReply(id, reply.id)}
              onReply={() => onReplyToReply(id, reply.id, reply.user_name || 'User')}
            />
          ))}

          {replies.length > 2 && (
            <button
              onClick={() => onToggleShowMoreReplies(id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4 transition-colors"
            >
              {expandedReplies.has(id)
                ? 'Show fewer replies'
                : `Show ${replies.length - 2} more replies`
              }
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for individual replies
interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
  onReply: () => void;
}

const ReplyItem = ({ reply, onLike, onReply }: ReplyItemProps) => {
  const {
    user_name,
    comment,
    created_at,
    likeCount = 0,
    liked = false,
    is_seller,
    verified_seller,
    replying_to
  } = reply;

  return (
    <div 
      className="border-l-2 pl-4"
      style={{ borderColor: '#e0e0e0' }}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-6 h-6 flex items-center justify-center text-xs font-semibold"
          style={{
            backgroundColor: is_seller ? '#3b82f6' : 'rgba(0,0,0,0.1)',
            color: is_seller ? 'white' : 'black'
          }}
        >
          {user_name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span 
              className="font-medium text-sm"
              style={{ color: '#333' }}
            >
              {user_name || 'Anonymous'}
            </span>
            {is_seller && (
              <div className="flex items-center gap-1">
                {verified_seller && <VerificationBadge size="sm" />}
                <span 
                  className="text-xs"
                  style={{ color: '#999' }}
                >
                  •
                </span>
                <span 
                  className="font-bold text-sm"
                  style={{ color: '#f97316' }}
                >
                  Seller
                </span>
              </div>
            )}
          </div>

          {replying_to && (
            <div 
              className="text-xs mt-1"
              style={{ color: '#666' }}
            >
              Replying to <span className="font-medium">{replying_to}</span>
            </div>
          )}

          <div 
            className="text-sm mt-1"
            style={{ color: '#333' }}
          >
            {comment}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={onLike}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                font: 'inherit',
                lineHeight: '1',
                color: liked ? '#dc2626' : '#4b5563'
              }}
            >
              <Heart
                className={`w-4 h-4 flex-shrink-0 ${liked ? 'fill-red-600 text-red-600' : ''}`}
              />
              <span style={{ lineHeight: '1' }}>{likeCount}</span>
            </button>

            <button
              onClick={onReply}
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
              className="text-sm font-medium"
              style={{
                color: '#666',
                lineHeight: '1'
              }}
            >
              {formatDateForReply(created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;