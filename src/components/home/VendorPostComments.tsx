
import React, { useState } from 'react';
import { ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
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
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Great products! I bought similar items last month and they are amazing quality.',
      timestamp: '2h ago',
      likes: 24,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          userName: 'Jane Smith',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
          content: 'I agree! The quality is outstanding.',
          timestamp: '1h ago',
          likes: 5,
          isLiked: false,
        }
      ]
    },
    {
      id: '2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'How long does shipping usually take?',
      timestamp: '3h ago',
      likes: 8,
      isLiked: false,
    },
    {
      id: '3',
      userName: 'Mike Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: 'These look amazing! Adding to my wishlist.',
      timestamp: '5h ago',
      likes: 15,
      isLiked: false,
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
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
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    
    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
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

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-10 mt-3' : 'py-3'}`}>
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.userAvatar} alt={comment.userName} />
          <AvatarFallback>{comment.userName[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 rounded-2xl px-3 py-2">
            <p className="font-semibold text-sm">{comment.userName}</p>
            <p className="text-sm text-gray-800 mt-0.5">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-1 px-3">
            <button
              onClick={() => handleLike(comment.id)}
              className={`text-xs font-semibold ${comment.isLiked ? 'text-blue-600' : 'text-gray-600'} hover:underline`}
            >
              Like
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs font-semibold text-gray-600 hover:underline"
              >
                Reply
              </button>
            )}
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
            {comment.likes > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <ThumbsUp className="h-3 w-3 text-blue-600 fill-blue-600" />
                <span className="text-xs text-gray-600">{comment.likes}</span>
              </div>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="You" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px] text-sm resize-none"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyText.trim()}
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

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-gray-500 mb-2">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to comment!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input - Sticky at bottom */}
      <div className="border-t bg-white p-3">
        <div className="flex gap-2 items-start">
          <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[60px] text-sm resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPostComments;
