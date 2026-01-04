import React from 'react';
import { Star, Play, Heart } from 'lucide-react';
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
      className="p-2.5"
      style={{
        backgroundColor: '#f5f5f5',
        border: 'none',
        boxShadow: 'none'
      }}
    >
      {/* Review Header */}
      <div className="flex items-start justify-between mb-2">
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

      {/* Inline Engagement Section */}
      <EngagementSectionInline
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

// Inline Engagement Section Component
interface EngagementSectionInlineProps {
  likeCount: number;
  commentCount: number;
  shareCount: number;
  onComment: () => void;
  onShare: () => void;
}

const EngagementSectionInline: React.FC<EngagementSectionInlineProps> = ({
  likeCount,
  commentCount,
  shareCount,
  onComment,
  onShare,
}) => {
  return (
    <div 
      className="flex items-center gap-4 mt-3 pt-3"
      style={{ 
        borderTop: '1px solid #e0e0e0',
        paddingTop: '12px'
      }}
    >
      <button
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          font: 'inherit',
          lineHeight: '1',
          color: '#4b5563'
        }}
      >
        <svg 
          className="w-4 h-4 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        <span style={{ lineHeight: '1' }}>{likeCount}</span>
      </button>

      <button
        onClick={onComment}
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          font: 'inherit',
          lineHeight: '1',
          color: '#4b5563'
        }}
      >
        <svg 
          className="w-4 h-4 flex-shrink-0" 
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
        <span style={{ lineHeight: '1' }}>{commentCount}</span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          font: 'inherit',
          lineHeight: '1',
          color: '#4b5563'
        }}
      >
        <svg 
          className="w-4 h-4 flex-shrink-0" 
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
        <span style={{ lineHeight: '1' }}>{shareCount}</span>
      </button>
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