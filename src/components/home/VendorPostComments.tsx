import React, { useState, useRef, useEffect } from 'react';
import { Heart, Smile, Send, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import ReactionButton from '@/components/shared/ReactionButton';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const VendorPostComments: React.FC<VendorPostCommentsProps> = ({ 
  postId, 
  initialComments = [],
  sortBy = 'relevant',
  onSortChange
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Fetch comments from database
  const { data: dbComments = [], isLoading } = useQuery({
    queryKey: ['post-comments', postId, sortBy],
    queryFn: async () => {
      // Get current user for fetching reactions
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      const { data: commentsData, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          image_url,
          like_count,
          love_count,
          haha_count,
          created_at,
          parent_comment_id,
          user_id,
          profiles!post_comments_user_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: sortBy === 'newest' ? false : true });

      if (error) throw error;

      // Fetch user reactions
      let userReactions = [];
      if (userId) {
        const { data: reactionsData } = await supabase
          .from('comment_reactions')
          .select('comment_id, reaction_type')
          .eq('user_id', userId);

        userReactions = reactionsData || [];
      }

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: repliesData } = await supabase
            .from('post_comments')
            .select(`
              id,
              content,
              image_url,
              like_count,
              love_count,
              haha_count,
              created_at,
              user_id,
              profiles!post_comments_user_id_fkey (
                id,
                full_name,
                username,
                avatar_url
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          const replies = (repliesData || []).map((reply: any) => {
            const replyReaction = userReactions.find((r: any) => r.comment_id === reply.id);
            return {
              id: reply.id,
              userName: reply.profiles?.full_name || reply.profiles?.username || 'Anonymous',
              userAvatar: reply.profiles?.avatar_url || '',
              content: reply.content,
              timestamp: formatDistanceToNow(new Date(reply.created_at), { addSuffix: true }),
              reactions: {
                like: reply.like_count || 0,
                love: reply.love_count || 0,
                haha: reply.haha_count || 0,
              },
              userReaction: replyReaction?.reaction_type as 'like' | 'love' | 'haha' | undefined,
              image: reply.image_url || undefined,
            };
          });

          const userReaction = userReactions.find((r: any) => r.comment_id === comment.id);

          return {
            id: comment.id,
            userName: comment.profiles?.full_name || comment.profiles?.username || 'Anonymous',
            userAvatar: comment.profiles?.avatar_url || '',
            content: comment.content,
            timestamp: formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }),
            reactions: {
              like: comment.like_count || 0,
              love: comment.love_count || 0,
              haha: comment.haha_count || 0,
            },
            userReaction: userReaction?.reaction_type as 'like' | 'love' | 'haha' | undefined,
            image: comment.image_url || undefined,
            replies,
          };
        })
      );

      return commentsWithReplies;
    },
    enabled: !!postId,
  });

  const comments = dbComments.length > 0 ? dbComments : initialComments;

  // Mutation to add comment
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to comment');

      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          parent_comment_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId, sortBy] });
      setNewComment('');
      setReplyingTo(null);
    },
  });

  // Mutation to handle reactions
  const reactionMutation = useMutation({
    mutationFn: async ({ 
      commentId, 
      reactionType 
    }: { 
      commentId: string; 
      reactionType: 'like' | 'love' | 'haha' | null 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to react');

      // First, get the current reaction (if any)
      const { data: existingReaction } = await supabase
        .from('comment_reactions')
        .select('reaction_type')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      const oldReactionType = existingReaction?.reaction_type;

      if (reactionType === null) {
        // Remove reaction - only proceed if there's an existing reaction
        if (!oldReactionType) return;

        const { error: deleteError } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // The trigger should handle count decrement automatically,
        // but we'll also do it manually to ensure consistency
        const columnName = `${oldReactionType}_count`;
        const { error: updateError } = await supabase.rpc('decrement_comment_count', {
          comment_id: commentId,
          column_name: columnName
        }).single();

        // If RPC doesn't exist, fall back to manual update
        if (updateError) {
          const { data: commentData } = await supabase
            .from('post_comments')
            .select(columnName)
            .eq('id', commentId)
            .single();
          
          if (commentData) {
            const currentCount = commentData[columnName] || 0;
            const newCount = Math.max(0, currentCount - 1);
            
            await supabase
              .from('post_comments')
              .update({ [columnName]: newCount })
              .eq('id', commentId);
          }
        }
      } else {
        // Upsert reaction
        const { error: upsertError } = await supabase
          .from('comment_reactions')
          .upsert({
            comment_id: commentId,
            user_id: user.id,
            reaction_type: reactionType,
          }, {
            onConflict: 'comment_id,user_id',
          });

        if (upsertError) throw upsertError;

        // Update counts in post_comments
        const { data: commentData } = await supabase
          .from('post_comments')
          .select('like_count, love_count, haha_count')
          .eq('id', commentId)
          .single();
        
        if (commentData) {
          const updates: any = {};
          
          if (oldReactionType && oldReactionType !== reactionType) {
            // Decrement old reaction count and increment new reaction count
            const oldCount = commentData[`${oldReactionType}_count`] || 0;
            const newCount = commentData[`${reactionType}_count`] || 0;
            
            updates[`${oldReactionType}_count`] = Math.max(0, oldCount - 1);
            updates[`${reactionType}_count`] = newCount + 1;
          } else if (!oldReactionType) {
            // Increment new reaction count only
            const count = commentData[`${reactionType}_count`] || 0;
            updates[`${reactionType}_count`] = count + 1;
          }
          
          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
              .from('post_comments')
              .update(updates)
              .eq('id', commentId);
            
            if (updateError) throw updateError;
          }
        }
      }
    },
    onMutate: async ({ commentId, reactionType }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post-comments', postId, sortBy] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['post-comments', postId, sortBy]);

      // Optimistically update the cache
      queryClient.setQueryData(['post-comments', postId, sortBy], (old: any) => {
        if (!old) return old;

        return old.map((comment: Comment) => {
          // Check if this is the comment being reacted to
          if (comment.id === commentId) {
            return { ...comment, userReaction: reactionType || undefined };
          }
          
          // Check if any reply matches
          if (comment.replies && comment.replies.length > 0) {
            const hasMatchingReply = comment.replies.some((reply: Comment) => reply.id === commentId);
            
            if (hasMatchingReply) {
              return {
                ...comment,
                replies: comment.replies.map((reply: Comment) => 
                  reply.id === commentId 
                    ? { ...reply, userReaction: reactionType || undefined }
                    : reply
                )
              };
            }
          }
          
          // Return unchanged
          return comment;
        });
      });

      return { previousComments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(['post-comments', postId, sortBy], context.previousComments);
      }
    },
    onSuccess: () => {
      // Only invalidate after successful save to refetch with correct data
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId, sortBy] });
    },
  });

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
    const comment = comments.find(c => c.id === commentId || c.replies?.some(r => r.id === commentId));
    const targetComment = comment?.id === commentId ? comment : comment?.replies?.find(r => r.id === commentId);

    if (!targetComment) return;

    // If clicking the same reaction, remove it
    if (reactionId === targetComment.userReaction) {
      reactionMutation.mutate({ commentId, reactionType: null });
    } else if (reactionId) {
      reactionMutation.mutate({ commentId, reactionType: reactionId as 'like' | 'love' | 'haha' });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addCommentMutation.mutate({
      content: newComment,
      parentId: replyingTo || undefined,
    });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
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
              disabled={!newComment.trim() || addCommentMutation.isPending}
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