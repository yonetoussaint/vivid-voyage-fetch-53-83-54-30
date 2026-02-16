interface Reply {
  id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
  like_count: number;
  isLiked: boolean;
}

interface ReplyItemProps {
  reply: Reply;
  reviewId: string;
  getAvatarColor: (name?: string) => string;
  getInitials: (name?: string) => string;
  formatDate: (date: string) => string;
  icons: {
    Heart: React.ComponentType<any>;
    MoreHorizontal: React.ComponentType<any>;
  };
  onLikeReply?: () => void;
  onReplyToReply?: () => void;
  onEditReply?: (comment: string) => void;
  onDeleteReply?: () => void;
  onReportReply?: (reason: string) => void;
  currentUserId?: string;
  isOwner?: boolean;
}

const ReplyItem = ({
  reply,
  reviewId,
  getAvatarColor,
  getInitials,
  formatDate,
  icons,
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  currentUserId,
  isOwner = false,
}: ReplyItemProps) => {
  const [showReplyMenu, setShowReplyMenu] = React.useState(false);
  const replyMenuRef = React.useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    comment,
    created_at,
    like_count = 0,
    isLiked = false,
  } = reply;

  const handleLikeClick = React.useCallback(() => {
    onLikeReply?.();
  }, [onLikeReply]);

  const handleReplyClick = React.useCallback(() => {
    onReplyToReply?.();
  }, [onReplyToReply]);

  const handleEditClick = React.useCallback(() => {
    onEditReply?.(comment || '');
    setShowReplyMenu(false);
  }, [comment, onEditReply]);

  const handleDeleteClick = React.useCallback(() => {
    onDeleteReply?.();
    setShowReplyMenu(false);
  }, [onDeleteReply]);

  const handleReportClick = React.useCallback(() => {
    onReportReply?.('inappropriate');
    setShowReplyMenu(false);
  }, [onReportReply]);

  const toggleReplyMenu = React.useCallback(() => {
    setShowReplyMenu(prev => !prev);
  }, []);

  React.useEffect(() => {
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

  const formattedDate = React.useMemo(() => formatDate(created_at), [created_at, formatDate]);
  const avatarColor = React.useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = React.useMemo(() => getInitials(user_name), [user_name, getInitials]);

  return (
    <div className="ml-12 mt-3 pl-3 border-l-2 border-gray-200">
      <div className="flex items-start gap-2 mb-1">
        <div 
          className={`w-8 h-8 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                {user_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Reply Like Button */}
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors group"
                aria-label={`Like this reply. ${like_count} likes`}
              >
                <icons.Heart
                  className={`w-4 h-4 transition-all ${
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

              {/* Reply Button */}
              <button
                onClick={handleReplyClick}
                className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                aria-label={`Reply to ${user_name || 'this user'}`}
              >
                Reply
              </button>

              {/* Reply Menu */}
              <div className="relative" ref={replyMenuRef}>
                <button
                  onClick={toggleReplyMenu}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Reply options"
                >
                  <icons.MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {showReplyMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {isOwner && (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit reply
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete reply
                        </button>
                      </>
                    )}

                    {!isOwner && (
                      <button
                        onClick={handleReportClick}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Report reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-1">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;