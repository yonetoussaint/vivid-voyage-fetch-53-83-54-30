import React, { useState, useRef, useEffect } from 'react';
import { Heart, Smile, Send, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import ReactionButton from '@/components/shared/ReactionButton';

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  reactions: {
    like: number;
    love: number;
    haha: number;
  };
  userReaction?: 'like' | 'love' | 'haha';
  image?: string;
  isTopFan?: boolean;
  isTranslated?: boolean;
  replies?: Comment[];
}

interface VendorPostCommentsProps {
  postId: string;
  initialComments?: Comment[];
  sortBy?: 'relevant' | 'newest';
  onSortChange?: (sortBy: 'relevant' | 'newest') => void;
}

const VendorPostComments: React.FC<VendorPostCommentsProps> = ({ 
  postId, 
  initialComments = [],
  sortBy = 'relevant',
  onSortChange
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments.length > 0 ? initialComments : [
    {
      id: '1',
      userName: 'Aleex Reverte',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Sheinbaun de tres puntos!!!!!',
      timestamp: '2h',
      reactions: { like: 2, love: 0, haha: 1 },
      // REMOVED initial userReaction to start empty
      isTranslated: true,
      replies: [
        {
          id: '1-1',
          userName: 'Tiro Libre',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          content: 'Aleex Reverte MVP!!',
          timestamp: '2h',
          reactions: { like: 0, love: 0, haha: 0 },
        }
      ]
    },
    {
      id: '2',
      userName: 'Joni Xochitla',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Did you see the Olympics of 2008 😏',
      timestamp: '2h',
      reactions: { like: 1, love: 1, haha: 1 },
      // REMOVED initial userReaction to start empty
      isTopFan: true,
      isTranslated: true,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
      replies: [
        {
          id: '2-1',
          userName: 'Tiro Libre',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          content: 'Joni Xochitla ahora entendemo...',
          timestamp: '2h',
          reactions: { like: 0, love: 0, haha: 0 },
        }
      ]
    },
    {
      id: '3',
      userName: 'Isela Muñoz',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Claudia Mamba Sheinbaun 🐍',
      timestamp: '2h',
      reactions: { like: 0, love: 0, haha: 0 },
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleReaction = (commentId: string, reactionId: string | null) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        // Handle main comment
        if (comment.id === commentId) {
          const newReactions = { ...comment.reactions };
          const currentReaction = comment.userReaction;

          // If reactionId is null, it means we're toggling off the current reaction
          // This happens when clicking the main button directly
          if (reactionId === null && currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
            return { ...comment, userReaction: undefined, reactions: newReactions };
          }

          // If clicking the same reaction that's already active, remove it (unfill)
          if (currentReaction && reactionId === currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
            return { ...comment, userReaction: undefined, reactions: newReactions };
          }

          // If clicking a different reaction or no reaction is currently active
          if (reactionId) {
            const newReactionType = reactionId as 'like' | 'love' | 'haha';

            // Remove old reaction if exists
            if (currentReaction) {
              newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
            }

            // Add new reaction
            newReactions[newReactionType] = (newReactions[newReactionType] || 0) + 1;
            return { ...comment, userReaction: newReactionType, reactions: newReactions };
          }

          return comment;
        }

        // Handle replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const newReactions = { ...reply.reactions };
              const currentReaction = reply.userReaction;

              // If reactionId is null, it means we're toggling off the current reaction
              if (reactionId === null && currentReaction) {
                newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
                return { ...reply, userReaction: undefined, reactions: newReactions };
              }

              // If clicking the same reaction that's already active, remove it (unfill)
              if (currentReaction && reactionId === currentReaction) {
                newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
                return { ...reply, userReaction: undefined, reactions: newReactions };
              }

              // If clicking a different reaction or no reaction is currently active
              if (reactionId) {
                const newReactionType = reactionId as 'like' | 'love' | 'haha';

                // Remove old reaction if exists
                if (currentReaction) {
                  newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
                }

                // Add new reaction
                newReactions[newReactionType] = (newReactions[newReactionType] || 0) + 1;
                return { ...reply, userReaction: newReactionType, reactions: newReactions };
              }

              return reply;
            }
            return reply;
          });

          return { ...comment, replies: updatedReplies };
        }

        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      content: newComment,
      timestamp: 'Just now',
      reactions: { like: 0, love: 0, haha: 0 },
      // No initial userReaction - starts empty
    };

    setComments([comment, ...comments]);
    setNewComment('');
    // Blur and refocus to close mobile keyboard and reopen for new comment
    inputRef.current?.blur();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      content: replyText,
      timestamp: 'Just now',
      reactions: { like: 0, love: 0, haha: 0 },
      // No initial userReaction - starts empty
    };

    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      })
    );

    setReplyText('');
    setReplyingTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const totalReactions = comment.reactions.like + comment.reactions.love + comment.reactions.haha;
    const [showReplies, setShowReplies] = useState(false);

    return (
      <div className={`${isReply ? 'ml-8 md:ml-10 mt-3' : 'py-3'}`}>
        <div className="flex gap-2">
          {/* Avatar */}
          <Avatar className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
            <AvatarFallback className="bg-gray-200 text-gray-800 text-xs">
              {comment.userName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Full-width comment bubble */}
            <div className="bg-gray-100 rounded-2xl px-3 py-2 w-full">
              {/* User name & top fan badge */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold text-[13px] text-gray-900 break-words">
                  {comment.userName}
                </p>
                {comment.isTopFan && (
                  <div className="flex items-center gap-1 bg-gray-200 rounded px-1.5 py-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 0L9.5 5.5H15L10.5 9L12 14.5L8 11L4 14.5L5.5 9L1 5.5H6.5L8 0Z"
                        fill="#8E8E8E"
                      />
                    </svg>
                    <span className="text-[10px] text-gray-600">Top fan</span>
                  </div>
                )}
              </div>

              {/* Comment text */}
              <p className="text-[15px] text-gray-800 break-words">{comment.content}</p>
              {comment.isTranslated && (
                <p className="text-[12px] text-gray-500 mt-1">See translation</p>
              )}

              {/* Optional image */}
              {comment.image && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img
                    src={comment.image}
                    alt="Comment attachment"
                    className="w-full max-w-[280px] md:max-w-[320px] rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between mt-1 text-[12px]">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ReactionButton
                    onReactionChange={(reactionId) => handleReaction(comment.id, reactionId)}
                    initialReaction={comment.userReaction} // This will be undefined initially
                    buttonClassName="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded-full h-8 flex items-center justify-center"
                    size="md"
                  />
                </div>

                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="font-semibold text-gray-600 hover:underline"
                  >
                    Reply
                  </button>
                )}

                <span className="text-gray-500">{comment.timestamp}</span>
              </div>

              {totalReactions > 0 && (
                <StackedReactionIcons count={totalReactions} />
              )}
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="mt-2 flex gap-2">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                    alt="You"
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-800 text-xs">Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[60px] text-sm resize-none bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs"
                    >
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="text-gray-600 hover:bg-gray-100 h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Nested replies toggle */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                <button 
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-600 text-[13px] font-semibold hover:underline"
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>

                {showReplies && (
                  <div className="mt-2">
                    {comment.replies.map((reply) => (
                      <CommentItem key={reply.id} comment={reply} isReply={true} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-24">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-gray-600 mb-2">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to comment!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Sticky Comment Input */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-all duration-200 ${
        isInputFocused ? 'pb-4' : ''
      }`}>
        <div className="p-3 max-w-screen-md mx-auto">
          <div className="flex gap-2 items-end">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" alt="You" />
              <AvatarFallback className="bg-gray-200 text-gray-800 text-xs">Y</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[44px] max-h-32 text-sm resize-none bg-gray-100 border-none text-gray-900 placeholder:text-gray-400 rounded-2xl px-4 py-3 pr-12 focus:ring-1 focus:ring-blue-500 transition-all"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                rows={1}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`absolute right-3 bottom-3 p-1 rounded-full transition-colors ${
                  newComment.trim() 
                    ? 'text-blue-500 hover:bg-gray-200' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Reactions - Only show when input is focused on mobile */}
          {isInputFocused && (
            <div className="flex gap-3 mt-3 px-1 overflow-x-auto">
              <button
                onClick={() => setNewComment(prev => prev + ' 👍')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-gray-700 text-sm whitespace-nowrap"
              >
                <i className="fa-solid fa-thumbs-up h-4 w-4" />
                Like
              </button>
              <button
                onClick={() => setNewComment(prev => prev + ' ❤️')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-gray-700 text-sm whitespace-nowrap"
              >
                <Heart className="h-4 w-4" />
                Love
              </button>
              <button
                onClick={() => setNewComment(prev => prev + ' 😂')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-gray-700 text-sm whitespace-nowrap"
              >
                <Smile className="h-4 w-4" />
                Haha
              </button>
            </div>
          )}
        </div>

        {/* Safe area for mobile devices with notches */}
        <div className="h-safe-bottom bg-white" />
      </div>
    </div>
  );
};

export default VendorPostComments;