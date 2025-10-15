
import React, { useState } from 'react';
import { ThumbsUp, Heart, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';

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
}

const VendorPostComments: React.FC<VendorPostCommentsProps> = ({ 
  postId, 
  initialComments = [] 
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments.length > 0 ? initialComments : [
    {
      id: '1',
      userName: 'Aleex Reverte',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Sheinbaun de tres puntos!!!!!',
      timestamp: '2h',
      reactions: { like: 2, love: 0, haha: 1 },
      userReaction: 'like',
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
  const [sortBy, setSortBy] = useState<'relevant' | 'newest'>('relevant');

  const totalReactions = comments.reduce((sum, comment) => {
    const commentTotal = comment.reactions.like + comment.reactions.love + comment.reactions.haha;
    return sum + commentTotal;
  }, 0);

  const totalShares = 394; // Mock data

  const handleReaction = (commentId: string, reactionType: 'like' | 'love' | 'haha') => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const newReactions = { ...comment.reactions };
          
          // Remove old reaction if exists
          if (comment.userReaction) {
            newReactions[comment.userReaction] = Math.max(0, newReactions[comment.userReaction] - 1);
          }
          
          // Add new reaction or toggle off
          if (comment.userReaction === reactionType) {
            return { ...comment, userReaction: undefined, reactions: newReactions };
          } else {
            newReactions[reactionType] = newReactions[reactionType] + 1;
            return { ...comment, userReaction: reactionType, reactions: newReactions };
          }
        }
        
        // Handle nested replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const newReactions = { ...reply.reactions };
                
                if (reply.userReaction) {
                  newReactions[reply.userReaction] = Math.max(0, newReactions[reply.userReaction] - 1);
                }
                
                if (reply.userReaction === reactionType) {
                  return { ...reply, userReaction: undefined, reactions: newReactions };
                } else {
                  newReactions[reactionType] = newReactions[reactionType] + 1;
                  return { ...reply, userReaction: reactionType, reactions: newReactions };
                }
              }
              return reply;
            })
          };
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
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
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

  const getReactionIcons = (reactions: Comment['reactions']) => {
    const icons = [];
    if (reactions.like > 0) icons.push(<div key="like" className="bg-[#0866FF] rounded-full w-[18px] h-[18px] flex items-center justify-center border border-[#242526]"><ThumbsUp className="h-2.5 w-2.5 text-white fill-white" /></div>);
    if (reactions.love > 0) icons.push(<div key="love" className="bg-[#F43373] rounded-full w-[18px] h-[18px] flex items-center justify-center border border-[#242526]"><Heart className="h-2.5 w-2.5 text-white fill-white" /></div>);
    if (reactions.haha > 0) icons.push(<div key="haha" className="bg-[#F7B125] rounded-full w-[18px] h-[18px] flex items-center justify-center border border-[#242526]"><Smile className="h-2.5 w-2.5 text-white fill-white" /></div>);
    return icons;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const totalReactions = comment.reactions.like + comment.reactions.love + comment.reactions.haha;
    const reactionIcons = getReactionIcons(comment.reactions);
    
    return (
      <div className={`${isReply ? 'ml-10 mt-3' : 'py-3'}`}>
        <div className="flex gap-2">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
            <AvatarFallback className="bg-gray-600 text-white">{comment.userName[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="bg-[#3A3B3C] rounded-2xl px-3 py-2 inline-block max-w-full">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-[13px] text-white">{comment.userName}</p>
                {comment.isTopFan && (
                  <div className="flex items-center gap-1 bg-[#4E4F50] rounded px-1.5 py-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0L9.5 5.5H15L10.5 9L12 14.5L8 11L4 14.5L5.5 9L1 5.5H6.5L8 0Z" fill="#8E8E8E"/>
                    </svg>
                    <span className="text-[10px] text-[#B0B3B8]">Top fan</span>
                  </div>
                )}
              </div>
              <p className="text-[15px] text-[#E4E6EB] break-words">{comment.content}</p>
              {comment.isTranslated && (
                <p className="text-[12px] text-[#B0B3B8] mt-1">See translation</p>
              )}
              
              {comment.image && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img 
                    src={comment.image} 
                    alt="Comment attachment" 
                    className="w-full max-w-[320px] rounded-lg"
                  />
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mt-1 px-3">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`text-[12px] font-semibold ${comment.userReaction ? 'text-[#0866FF]' : 'text-[#B0B3B8]'} hover:underline`}
                >
                  {comment.userReaction === 'like' ? 'Like' : 
                   comment.userReaction === 'love' ? 'Love' : 
                   comment.userReaction === 'haha' ? 'Haha' : 'Like'}
                </button>
                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-[12px] font-semibold text-[#B0B3B8] hover:underline"
                  >
                    Reply
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#B0B3B8]">{comment.timestamp}</span>
                  {totalReactions > 0 && (
                    <StackedReactionIcons 
                      count={totalReactions} 
                      size="sm" 
                      className="gap-1 text-[12px] text-[#B0B3B8]"
                      reactions={comment.reactions}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-2 flex gap-2">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" alt="You" />
                  <AvatarFallback className="bg-gray-600 text-white">Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[60px] text-sm resize-none bg-[#3A3B3C] border-none text-white placeholder:text-[#B0B3B8] focus:ring-1 focus:ring-[#0866FF]"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="bg-[#0866FF] hover:bg-[#0757D4] text-white h-7 text-xs"
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
                      className="text-[#B0B3B8] hover:bg-[#3A3B3C] h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#242526]">
      {/* Header with reaction count and shares */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#3A3B3C] flex items-center justify-between">
        <StackedReactionIcons 
          count={totalReactions > 0 ? `${totalReactions}K` : '1.6K'} 
          size="sm" 
          className="gap-2 text-sm text-[#E4E6EB]"
        />
        <span className="text-sm text-[#B0B3B8]">{totalShares} shares</span>
      </div>

      {/* Sort dropdown */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#3A3B3C]">
        <button 
          onClick={() => setSortBy(sortBy === 'relevant' ? 'newest' : 'relevant')}
          className="flex items-center gap-2 text-[15px] font-semibold text-[#E4E6EB]"
        >
          {sortBy === 'relevant' ? 'Most relevant' : 'Newest first'}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-[#B0B3B8] mb-2">No comments yet</p>
            <p className="text-sm text-[#65676B]">Be the first to comment!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#3A3B3C]">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input - Sticky at bottom */}
      <div className="flex-shrink-0 border-t border-[#3A3B3C] bg-[#242526] p-3">
        <div className="flex gap-2 items-start">
          <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" alt="You" />
            <AvatarFallback className="bg-gray-600 text-white">Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[40px] text-sm resize-none bg-[#3A3B3C] border-none text-white placeholder:text-[#B0B3B8] rounded-full px-4 py-2 focus:ring-1 focus:ring-[#0866FF]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPostComments;
