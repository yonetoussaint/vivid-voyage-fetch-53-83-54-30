import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MediaItem, Reply, Review } from '@/hooks/useProductReviews';

export const useReviewItem = (
  review: Review,
  onReviewView?: (reviewId: string) => void,
  onMediaClick?: (media: MediaItem[], index: number) => void,
  onLikeReview?: (reviewId: string) => void,
  onFollowUser?: (userId: string, userName: string) => void,
  onUnfollowUser?: (userId: string, userName: string) => void,
  isFollowing?: boolean,
  onMarkHelpful?: (reviewId: string) => void,
  onToggleReadMore?: (reviewId: string) => void,
  onToggleShowMoreReplies?: (reviewId: string) => void,
  onCommentClick?: (reviewId: string) => void,
  onShareClick?: (reviewId: string) => void,
  onMenuAction?: (reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => void,
  loadMoreReplies?: (reviewId: string) => void,
  getRepliesForReview?: (reviewId: string) => Reply[]
) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

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

  // Get replies for this review
  const replies = useMemo(() => {
    return getRepliesForReview ? getRepliesForReview(id) : [];
  }, [getRepliesForReview, id]);

  useEffect(() => {
    onReviewView?.(id);
  }, [id, onReviewView]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getAvatarColor = useCallback((name?: string) => {
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
  }, []);

  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(user_name), [user_name, getInitials]);
  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);
  const truncatedComment = useMemo(() => truncateText(comment), [comment]);
  const shouldShowReadMore = useMemo(() => comment.length > 120, [comment.length]);
  const isRepliesExpanded = useMemo(() => expandedReplies?.has(id), [expandedReplies, id]);
  const hasReplies = useMemo(() => replies.length > 0, [replies.length]);
  const hasMedia = useMemo(() => media.length > 0, [media.length]);
  const hasMoreReplies = useMemo(() => replyPagination?.hasMore, [replyPagination?.hasMore]);

  const handleMediaItemClick = useCallback((item: MediaItem, index: number) => {
    if (onMediaClick) {
      onMediaClick(media, index);
    } else {
      window.open(item.url, '_blank');
    }
  }, [media, onMediaClick]);

  const handleLikeClick = useCallback(() => {
    onLikeReview?.(id);
  }, [id, onLikeReview]);

  const handleFollowClick = useCallback(() => {
    if (isFollowing) {
      onUnfollowUser?.(user_id || id, user_name || '');
    } else {
      onFollowUser?.(user_id || id, user_name || '');
    }
  }, [id, user_id, user_name, isFollowing, onFollowUser, onUnfollowUser]);

  const handleHelpfulClick = useCallback(() => {
    onMarkHelpful?.(id);
  }, [id, onMarkHelpful]);

  const handleCommentClick = useCallback(() => {
    if (onToggleShowMoreReplies) {
      onToggleShowMoreReplies(id);
    } else {
      navigate(`/reviews/${id}`);
      onCommentClick?.(id);
    }
  }, [id, onToggleShowMoreReplies, navigate, onCommentClick]);

  const handleShareClick = useCallback(() => {
    onShareClick?.(id);
  }, [id, onShareClick]);

  const handleMenuAction = useCallback((action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(id, action);
    setShowMenu(false);
  }, [id, onMenuAction]);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleReadMoreClick = useCallback(() => {
    onToggleReadMore?.(id);
  }, [id, onToggleReadMore]);

  const handleShowRepliesClick = useCallback(() => {
    onToggleShowMoreReplies?.(id);
  }, [id, onToggleShowMoreReplies]);

  const handleLoadMoreReplies = useCallback(() => {
    loadMoreReplies?.(id);
  }, [id, loadMoreReplies]);

  useEffect(() => {
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

  const renderStars = useCallback((ratingNum: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= ratingNum ? '#FBBF24' : 'none'}
          stroke={star <= ratingNum ? '#FBBF24' : '#D1D5DB'}
          strokeWidth="1.5"
        />
      ))}
    </div>
  ), []);

  return {
    // State
    showMenu,
    isMediaLoaded,
    menuRef,
    mediaContainerRef,
    setIsMediaLoaded,
    
    // Data
    id,
    user_id,
    user_name,
    comment,
    created_at,
    verified_purchase,
    media,
    like_count,
    comment_count,
    rating,
    isLiked,
    replies,
    avatarColor,
    initials,
    formattedDate,
    truncatedComment,
    shouldShowReadMore,
    isRepliesExpanded,
    hasReplies,
    hasMedia,
    hasMoreReplies,
    
    // Handlers
    handleMediaItemClick,
    handleLikeClick,
    handleFollowClick,
    handleHelpfulClick,
    handleCommentClick,
    handleShareClick,
    handleMenuAction,
    toggleMenu,
    handleReadMoreClick,
    handleShowRepliesClick,
    handleLoadMoreReplies,
    renderStars,
    getAvatarColor,
    getInitials,
  };
};

export const useReplyItem = (
  reply: Reply,
  reviewId: string,
  onLikeReply?: (replyId: string, reviewId: string) => void,
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void,
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void,
  onDeleteReply?: (replyId: string, reviewId: string) => void,
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void
) => {
  const [showReplyMenu, setShowReplyMenu] = useState(false);
  const replyMenuRef = useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    comment,
    created_at,
    like_count = 0,
    isLiked = false,
  } = reply;

  const handleLikeClick = useCallback(() => {
    onLikeReply?.(id, reviewId);
  }, [id, reviewId, onLikeReply]);

  const handleReplyClick = useCallback(() => {
    onReplyToReply?.(id, reviewId, user_name || '');
  }, [id, reviewId, user_name, onReplyToReply]);

  const handleEditClick = useCallback(() => {
    onEditReply?.(id, reviewId, comment || '');
    setShowReplyMenu(false);
  }, [id, reviewId, comment, onEditReply]);

  const handleDeleteClick = useCallback(() => {
    onDeleteReply?.(id, reviewId);
    setShowReplyMenu(false);
  }, [id, reviewId, onDeleteReply]);

  const handleReportClick = useCallback(() => {
    onReportReply?.(id, reviewId, 'inappropriate');
    setShowReplyMenu(false);
  }, [id, reviewId, onReportReply]);

  const toggleReplyMenu = useCallback(() => {
    setShowReplyMenu(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyMenuRef.current && !replyMenuRef.current.contains(event.target as Node)) {
        setShowReplyMenu(false);
      }
    };

    if (showReplyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReplyMenu]);

  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);

  return {
    showReplyMenu,
    replyMenuRef,
    id,
    user_name,
    comment,
    created_at,
    like_count,
    isLiked,
    formattedDate,
    handleLikeClick,
    handleReplyClick,
    handleEditClick,
    handleDeleteClick,
    handleReportClick,
    toggleReplyMenu,
  };
};