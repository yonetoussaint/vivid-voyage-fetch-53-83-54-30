import React, { useState, useRef } from 'react';
import { Heart, Smile, Send, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import ReactionButton from '@/components/shared/ReactionButton';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { formatDistanceToNow } from 'date-fns';

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
  isVerified?: boolean;
  replies?: Comment[];
}

interface VendorPostCommentsProps {
  postId: string;
  initialComments?: Comment[];
  sortBy?: 'relevant' | 'newest';
  onSortChange?: (sortBy: 'relevant' | 'newest') => void;
}

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108777-9f2e6b9f9b9a?w=150',
    content: 'This is absolutely gorgeous! 😍 I love the color combination and the quality looks amazing.',
    timestamp: '2 hours ago',
    reactions: {
      like: 15,
      love: 8,
      haha: 2,
    },
    userReaction: 'like',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150',
    isTopFan: true,
    isVerified: true,
    replies: [
      {
        id: '1-1',
        userName: 'Mike Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'I got one last week and can confirm it\'s even better in person!',
        timestamp: '1 hour ago',
        reactions: {
          like: 5,
          love: 2,
          haha: 0,
        },
        userReaction: 'love',
        isVerified: false,
      },
      {
        id: '1-2',
        userName: 'Emily Rodriguez',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        content: 'How long did shipping take?',
        timestamp: '45 mins ago',
        reactions: {
          like: 3,
          love: 1,
          haha: 0,
        },
        isVerified: false,
      },
    ],
  },
  {
    id: '2',
    userName: 'Jessica Williams',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content: 'Just ordered mine! Can\'t wait to try it out. The customer service was also super helpful when I had questions about sizing.',
    timestamp: '5 hours ago',
    reactions: {
      like: 23,
      love: 12,
      haha: 1,
    },
    userReaction: 'love',
    isTopFan: true,
    isVerified: true,
    replies: [
      {
        id: '2-1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108777-9f2e6b9f9b9a?w=150',
        content: 'You\'re going to love it! What color did you get?',
        timestamp: '4 hours ago',
        reactions: {
          like: 4,
          love: 2,
          haha: 0,
        },
        isVerified: true,
      },
      {
        id: '2-2',
        userName: 'Jessica Williams',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        content: 'I went with the rose gold! 🌹',
        timestamp: '3 hours ago',
        reactions: {
          like: 8,
          love: 5,
          haha: 0,
        },
        userReaction: 'like',
        isVerified: true,
      },
    ],
  },
  {
    id: '3',
    userName: 'David Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content: 'The quality is outstanding! Definitely worth every penny. I\'ve been using it daily for a month and it still looks brand new.',
    timestamp: '1 day ago',
    reactions: {
      like: 42,
      love: 18,
      haha: 3,
    },
    isVerified: true,
    replies: [],
  },
  {
    id: '4',
    userName: 'Priya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    content: 'Does this come in other sizes? I need a larger one for my collection.',
    timestamp: '2 days ago',
    reactions: {
      like: 7,
      love: 2,
      haha: 1,
    },
    isVerified: false,
    replies: [
      {
        id: '4-1',
        userName: 'Vendor Support',
        userAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
        content: 'Hi Priya! Yes, we offer sizes S, M, L, and XL. Check the size chart in the product description for exact measurements!',
        timestamp: '1 day ago',
        reactions: {
          like: 12,
          love: 4,
          haha: 0,
        },
        userReaction: 'like',
        isVerified: true,
        isTopFan: false,
      },
    ],
  },
];

const VendorPostComments: React.FC<VendorPostCommentsProps> = ({ 
  postId, 
  initialComments = MOCK_COMMENTS, // Use mock data as default
  sortBy = 'relevant',
  onSortChange
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    inputRef.current?.focus();
  };

  const getReplyingToName = () => {
    if (!replyingTo) return null;
    const comment = comments.find(c => c.id === replyingTo || c.replies?.some(r => r.id === replyingTo));
    if (comment?.id === replyingTo) return comment.userName;
    const reply = comment?.replies?.find(r => r.id === replyingTo);
    return reply?.userName;
  };

  const handleReaction = (commentId: string, reactionId: string | null) => {
    // Find the comment or reply
    const updateCommentReactions = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        // Check if this is the main comment
        if (comment.id === commentId) {
          const oldReaction = comment.userReaction;
          const newReactions = { ...comment.reactions };

          // Update counts
          if (oldReaction) {
            newReactions[oldReaction] = Math.max(0, (newReactions[oldReaction] || 0) - 1);
          }
          if (reactionId) {
            const reactionKey = reactionId as 'like' | 'love' | 'haha';
            newReactions[reactionKey] = (newReactions[reactionKey] || 0) + 1;
          }

          return { 
            ...comment, 
            userReaction: reactionId as 'like' | 'love' | 'haha' | undefined,
            reactions: newReactions
          };
        }

        // Check replies
        if (comment.replies && comment.replies.length > 0) {
          const hasMatchingReply = comment.replies.some(reply => reply.id === commentId);
          
          if (hasMatchingReply) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  const oldReaction = reply.userReaction;
                  const newReactions = { ...reply.reactions };

                  // Update counts
                  if (oldReaction) {
                    newReactions[oldReaction] = Math.max(0, (newReactions[oldReaction] || 0) - 1);
                  }
                  if (reactionId) {
                    const reactionKey = reactionId as 'like' | 'love' | 'haha';
                    newReactions[reactionKey] = (newReactions[reactionKey] || 0) + 1;
                  }

                  return { 
                    ...reply, 
                    userReaction: reactionId as 'like' | 'love' | 'haha' | undefined,
                    reactions: newReactions
                  };
                }
                return reply;
              })
            };
          }
        }

        return comment;
      });
    };

    setComments(prevComments => updateCommentReactions(prevComments));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `mock-${Date.now()}`,
      userName: 'Current User',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      content: newComment,
      timestamp: 'just now',
      reactions: {
        like: 0,
        love: 0,
        haha: 0,
      },
      isVerified: true,
      replies: [],
    };

    if (replyingTo) {
      // Add as reply
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === replyingTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentObj],
            };
          }
          return comment;
        })
      );
    } else {
      // Add as new comment
      setComments(prevComments => [newCommentObj, ...prevComments]);
    }

    setNewComment('');
    setReplyingTo(null);
  };

  const handleSortChange = (newSortBy: 'relevant' | 'newest') => {
    if (onSortChange) {
      onSortChange(newSortBy);
    } else {
      // Simple mock sorting
      const sortedComments = [...comments];
      if (newSortBy === 'newest') {
        sortedComments.sort((a, b) => {
          // This is a simplified mock sort - in reality you'd compare actual timestamps
          if (a.timestamp.includes('hour') && b.timestamp.includes('day')) return -1;
          if (a.timestamp.includes('day') && b.timestamp.includes('hour')) return 1;
          return 0;
        });
      } else {
        // Sort by reactions count for "relevant"
        sortedComments.sort((a, b) => {
          const aTotal = a.reactions.like + a.reactions.love + a.reactions.haha;
          const bTotal = b.reactions.like + b.reactions.love + b.reactions.haha;
          return bTotal - aTotal;
        });
      }
      setComments(sortedComments);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const totalReactions = comment.reactions.like + comment.reactions.love + comment.reactions.haha;
    const showReplies = expandedReplies.has(comment.id);

    return (
      <div className={`${isReply ? 'ml-8 md:ml-10 mt-3' : 'py-3'}`}>
        <div className="flex gap-2">
          <Avatar className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
            <AvatarFallback className="bg-gray-200 text-gray-800 text-xs">
              {comment.userName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-2xl px-3 py-2 w-full">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-[13px] text-gray-900 break-words">
                    {comment.userName}
                  </p>
                  {comment.isVerified && <VerificationBadge size="xs" />}
                </div>
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

              <p className="text-[15px] text-gray-800 break-words">{comment.content}</p>
              {comment.isTranslated && (
                <p className="text-[12px] text-gray-500 mt-1">See translation</p>
              )}

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

            <div className="flex items-center justify-between mt-1 text-[12px]">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ReactionButton
                    onReactionChange={(reactionId) => handleReaction(comment.id, reactionId)}
                    initialReaction={comment.userReaction}
                    buttonClassName="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded-full h-8 flex items-center justify-center"
                    size="md"
                  />
                </div>

                {!isReply && (
                  <button
                    onClick={() => handleReplyClick(comment.id)}
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

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                <button 
                  onClick={() => toggleReplies(comment.id)}
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
      {/* Sort options */}
      <div className="px-3 md:px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <button
          onClick={() => handleSortChange('relevant')}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            sortBy === 'relevant' 
              ? 'bg-blue-100 text-blue-600 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Relevant
        </button>
        <button
          onClick={() => handleSortChange('newest')}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            sortBy === 'newest' 
              ? 'bg-blue-100 text-blue-600 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Newest
        </button>
      </div>

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="p-2 max-w-screen-md mx-auto">
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-1 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">
                Replying to <span className="font-semibold text-gray-900">{getReplyingToName()}</span>
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="relative w-full">
            <Textarea
              ref={inputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[36px] max-h-32 w-full text-sm resize-none bg-gray-100 border-none text-gray-900 placeholder:text-gray-400 rounded-full px-4 py-2 pr-10 focus:ring-1 focus:ring-blue-500 transition-all"
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
              className={`absolute right-2 bottom-2 p-1 rounded-full transition-colors ${
                newComment.trim() 
                  ? 'text-blue-500 hover:bg-blue-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-safe-bottom bg-white" />
      </div>
    </div>
  );
};

export default VendorPostComments;