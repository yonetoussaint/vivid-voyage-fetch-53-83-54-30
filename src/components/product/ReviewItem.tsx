import React from 'react';
import { Play, Heart, MessageCircle, CheckCircle, MoreHorizontal, Star } from 'lucide-react';
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
  rating?: number; // Optional rating from 1-5
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
  onMenuAction?: (reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => void;
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
  onMenuAction,
}: ReviewItemProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  const {
    id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    likeCount = 0,
    commentCount = 0,
    rating,
  } = review;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name?: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            fill={star <= rating ? '#FBBF24' : 'none'}
            stroke={star <= rating ? '#FBBF24' : '#D1D5DB'}
            strokeWidth="1.5"
          />
        ))}
      </div>
    );
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuAction = (action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(id, action);
    setShowMenu(false);
  };

  const handleCommentClick = (reviewId: string) => {
    navigate(`/reviews/${reviewId}`);
    onCommentClick?.(reviewId);
  };

  return (
    <div className="bg-white border-b border-gray-100 p-2 hover:bg-gray-50 transition-colors">
      {/* Review Header */}
      <div className="flex gap-2 mb-2">
        <div 
          className={`w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full flex-shrink-0 ${getAvatarColor(user_name)}`}
        >
          {getInitials(user_name)}
        </div>
        
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-[15px] truncate block">
                {user_name || 'Anonymous'}
              </span>
              {verified_purchase && (
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </div>
            {rating && (
              <div className="mt-1">
                {renderStars(rating)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-0.5">
              {formatDate(created_at)}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Follow
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => handleMenuAction('share')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Share review
                  </button>
                  <button
                    onClick={() => handleMenuAction('edit')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit review
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleMenuAction('report')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Report review
                  </button>
                  <button
                    onClick={() => handleMenuAction('delete')}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <div className="text-gray-800 leading-relaxed mb-2 text-[15px]">
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {comment.length > 120 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.map((item, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
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
                      <div className="bg-white rounded-full p-2">
                        <Play className="w-5 h-5 text-gray-900 fill-gray-900" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="flex items-center gap-8 pt-2">
        <button
          onClick={() => console.log('Like clicked for review:', id)}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 font-medium"
        >
          <Heart
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        <button
          onClick={() => handleCommentClick(id)}
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;