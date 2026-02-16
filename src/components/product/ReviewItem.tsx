interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt?: string;
  thumbnail?: string;
}

interface Reply {
  id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
  like_count: number;
  isLiked: boolean;
}

interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  comment?: string;
  created_at: string;
  verified_purchase: boolean;
  media?: MediaItem[];
  like_count: number;
  comment_count: number;
  rating?: number;
  isLiked: boolean;
}

interface ReviewItemProps {
  // Review data
  review: Review;
  
  // UI state
  isExpanded: boolean;
  isRepliesExpanded?: boolean;
  isLast?: boolean;
  isFollowing?: boolean;
  isOwner?: boolean;
  currentUserId?: string;
  
  // Handlers
  onToggleReadMore: () => void;
  onToggleShowMoreReplies?: () => void;
  onCommentClick?: () => void;
  onShareClick?: () => void;
  onLikeReview?: () => void;
  onFollowUser?: () => void;
  onUnfollowUser?: () => void;
  onLikeReply?: (replyId: string) => void;
  onReplyToReply?: (replyId: string, userName: string) => void;
  onMenuAction?: (action: 'report' | 'edit' | 'delete' | 'share') => void;
  onMediaClick?: (index: number) => void;
  onReviewView?: () => void;
  onMarkHelpful?: () => void;
  onEditReply?: (replyId: string, comment: string) => void;
  onDeleteReply?: (replyId: string) => void;
  onReportReply?: (replyId: string, reason: string) => void;
  loadMoreReplies?: () => void;
  hasMoreReplies?: boolean;
  
  // Replies
  replies?: Reply[];
  
  // Utility functions (passed from parent)
  getInitials: (name?: string) => string;
  getAvatarColor: (name?: string) => string;
  formatDate: (date: string) => string;
  truncateText: (text: string) => string;
  renderStars: (rating: number) => React.ReactNode;
  
  // Icons (passed as components)
  icons: {
    Play: React.ComponentType<any>;
    Heart: React.ComponentType<any>;
    MessageCircle: React.ComponentType<any>;
    MoreHorizontal: React.ComponentType<any>;
    Star: React.ComponentType<any>;
    ChevronDown: React.ComponentType<any>;
    ChevronUp: React.ComponentType<any>;
    ThumbsUp: React.ComponentType<any>;
  };
  
  // Components (passed from parent)
  components: {
    VerificationBadge: React.ComponentType<any>;
    ReplyItem: React.ComponentType<any>;
  };
  
  // Navigation
  navigate: (path: string) => void;
}

const ReviewItem = ({
  review,
  isExpanded,
  isRepliesExpanded = false,
  onToggleReadMore,
  onToggleShowMoreReplies,
  onCommentClick,
  onShareClick,
  onLikeReview,
  onFollowUser,
  onUnfollowUser,
  isFollowing = false,
  onLikeReply,
  onReplyToReply,
  onMenuAction,
  currentUserId,
  isOwner = false,
  onMediaClick,
  onReviewView,
  onMarkHelpful,
  onEditReply,
  onDeleteReply,
  onReportReply,
  loadMoreReplies,
  hasMoreReplies = false,
  isLast = false,
  replies = [],
  getInitials,
  getAvatarColor,
  formatDate,
  truncateText,
  renderStars,
  icons,
  components,
  navigate,
}: ReviewItemProps) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const mediaContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    id,
    user_id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    like_count = 0,
    comment_count = 0,
    rating,
    isLiked = false,
  } = review;

  React.useEffect(() => {
    onReviewView?.();
  }, [onReviewView]);

  const avatarColor = React.useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = React.useMemo(() => getInitials(user_name), [user_name, getInitials]);

  const formattedDate = React.useMemo(() => formatDate(created_at), [created_at, formatDate]);
  const truncatedComment = React.useMemo(() => truncateText(comment), [comment, truncateText]);
  const shouldShowReadMore = React.useMemo(() => comment.length > 120, [comment.length]);

  const handleMediaItemClick = React.useCallback((item: MediaItem, index: number) => {
    if (onMediaClick) {
      onMediaClick(index);
    } else {
      window.open(item.url, '_blank');
    }
  }, [onMediaClick]);

  const renderedMedia = React.useMemo(() => 
    media.map((item, index) => (
      <div key={`${id}-media-${index}`} className="flex-shrink-0 relative">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.alt || `Review media ${index + 1}`}
            className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => handleMediaItemClick(item, index)}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsMediaLoaded(true)}
            style={{ opacity: isMediaLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        ) : item.type === 'video' ? (
          <div
            className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
            onClick={() => handleMediaItemClick(item, index)}
          >
            <img
              src={item.thumbnail || item.url}
              alt={item.alt || `Video thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onLoad={() => setIsMediaLoaded(true)}
              style={{ opacity: isMediaLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              <div className="bg-white rounded-full p-2">
                <icons.Play className="w-5 h-5 text-gray-900 fill-gray-900" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )),
    [media, id, isMediaLoaded, handleMediaItemClick, icons.Play]
  );

  const renderedReplies = React.useMemo(() => {
    if (!replies.length || !isRepliesExpanded) return null;

    return replies.map((reply) => (
      <components.ReplyItem
        key={reply.id}
        reply={reply}
        reviewId={id}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
        formatDate={formatDate}
        icons={icons}
        onLikeReply={onLikeReply ? () => onLikeReply(reply.id) : undefined}
        onReplyToReply={onReplyToReply ? () => onReplyToReply(reply.id, reply.user_name || '') : undefined}
        onEditReply={onEditReply ? (comment: string) => onEditReply(reply.id, comment) : undefined}
        onDeleteReply={onDeleteReply ? () => onDeleteReply(reply.id) : undefined}
        onReportReply={onReportReply ? (reason: string) => onReportReply(reply.id, reason) : undefined}
        currentUserId={currentUserId}
        isOwner={reply.user_id === currentUserId}
      />
    ));
  }, [replies, isRepliesExpanded, id, getAvatarColor, getInitials, formatDate, icons, components.ReplyItem, onLikeReply, onReplyToReply, onEditReply, onDeleteReply, onReportReply, currentUserId]);

  const handleLikeClick = React.useCallback(() => {
    onLikeReview?.();
  }, [onLikeReview]);

  const handleFollowClick = React.useCallback(() => {
    if (isFollowing) {
      onUnfollowUser?.();
    } else {
      onFollowUser?.();
    }
  }, [isFollowing, onFollowUser, onUnfollowUser]);

  const handleHelpfulClick = React.useCallback(() => {
    onMarkHelpful?.();
  }, [onMarkHelpful]);

  const handleCommentClick = React.useCallback(() => {
    if (onToggleShowMoreReplies) {
      onToggleShowMoreReplies();
    } else {
      navigate(`/reviews/${id}`);
      onCommentClick?.();
    }
  }, [id, onToggleShowMoreReplies, navigate, onCommentClick]);

  const handleShareClick = React.useCallback(() => {
    onShareClick?.();
  }, [onShareClick]);

  const handleMenuAction = React.useCallback((action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(action);
    setShowMenu(false);
  }, [onMenuAction]);

  const toggleMenu = React.useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleReadMoreClick = React.useCallback(() => {
    onToggleReadMore();
  }, [onToggleReadMore]);

  const handleShowRepliesClick = React.useCallback(() => {
    onToggleShowMoreReplies?.();
  }, [onToggleShowMoreReplies]);

  const handleLoadMoreReplies = React.useCallback(() => {
    loadMoreReplies?.();
  }, [loadMoreReplies]);

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

  const hasReplies = React.useMemo(() => replies.length > 0, [replies.length]);
  const hasMedia = React.useMemo(() => media.length > 0, [media.length]);

  return (
    <div 
      className={`bg-white py-2 transition-colors ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      {/* Review Header */}
      <div className="flex gap-2 mb-2">
        <div 
          className={`w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-[15px] truncate block">
                {user_name || 'Anonymous'}
              </span>
              {verified_purchase && (
                <components.VerificationBadge />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formattedDate}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button 
              onClick={handleFollowClick}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isFollowing 
                  ? 'text-gray-700 bg-gray-200 hover:bg-gray-300' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="More options"
              >
                <icons.MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => handleMenuAction('share')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Share review
                  </button>

                  {isOwner && (
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit review
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  {!isOwner && (
                    <button
                      onClick={() => handleMenuAction('report')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Report review
                    </button>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <div className="text-gray-800 leading-relaxed mb-2 text-[15px]">
        <span>
          {isExpanded ? comment : truncatedComment}
          {shouldShowReadMore && (
            <button
              onClick={handleReadMoreClick}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors"
            >
              {isExpanded ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {hasMedia && (
        <div className="mb-2" ref={mediaContainerRef}>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {renderedMedia}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label={`Like this review. ${like_count} likes`}
          >
            <icons.Heart
              className={`w-5 h-5 transition-all ${
                isLiked 
                  ? 'fill-red-500 stroke-red-500 scale-110' 
                  : 'fill-none stroke-current group-hover:scale-110'
              }`}
              strokeWidth={isLiked ? "2" : "2"}
            />
            {like_count > 0 && (
              <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
                {like_count}
              </span>
            )}
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentClick}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label={`Comment on this review. ${comment_count} comments`}
          >
            <icons.MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {comment_count > 0 && <span>{comment_count}</span>}
          </button>

          {/* Helpful Button */}
          <button
            onClick={handleHelpfulClick}
            className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label="Mark this review as helpful"
          >
            <icons.ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Helpful</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label="Share this review"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
              />
            </svg>
          </button>
        </div>

        {rating && renderStars(rating)}
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowMoreReplies && (
            <button
              onClick={handleShowRepliesClick}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2 transition-colors"
              aria-expanded={isRepliesExpanded}
            >
              {isRepliesExpanded ? (
                <icons.ChevronUp className="w-4 h-4" />
              ) : (
                <icons.ChevronDown className="w-4 h-4" />
              )}
              {isRepliesExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {isRepliesExpanded && renderedReplies && (
            <div className="space-y-3">
              {renderedReplies}
              {hasMoreReplies && (
                <button
                  onClick={handleLoadMoreReplies}
                  className="ml-12 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Load more replies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;