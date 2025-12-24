import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, MoreHorizontal, CheckCircle } from "lucide-react";

interface Post {
  id: string;
  type: 'post';
  author: {
    id: string;
    username: string;
    avatar: string;
    is_verified: boolean;
    follower_count: number;
  };
  content: {
    images: string[];
    caption: string;
    location?: string;
    hashtags: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views?: number;
  };
  products_tagged: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    x_position: number;
    y_position: number;
  }>;
  created_at: string;
  is_sponsored: boolean;
  is_liked?: boolean;
  is_saved?: boolean;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.engagement.likes);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const navigate = useNavigate();

  const minSwipeDistance = 50;

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${post.author.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share post:', post.id);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSwiping) {
      setCurrentImageIndex((prev) => (prev + 1) % post.content.images.length);
    }
    setIsSwiping(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchStart !== null) {
      setTouchEnd(e.targetTouches[0].clientX);
      setIsSwiping(true);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => 
        prev === post.content.images.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? post.content.images.length - 1 : prev - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsSwiping(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (touchStart !== null && e.buttons === 1) {
      setTouchEnd(e.clientX);
      setIsSwiping(true);
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => 
        prev === post.content.images.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? post.content.images.length - 1 : prev - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded overflow-hidden">
      <div className="py-2 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleUserClick}
        >
          <div className="relative">
            <img 
              src={post.author.avatar} 
              alt={post.author.username}
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
            />
            {post.author.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-900">
                {post.author.username}
              </span>
              {post.is_sponsored && (
                <span className="bg-blue-100 text-blue-700 text-[9px] px-1 py-0.5 rounded">Sponsored</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500">
                {formatTimeAgo(post.created_at)}
              </span>
            </div>
          </div>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div 
        className="relative bg-gray-100 cursor-pointer overflow-hidden"
        onClick={handleImageClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ aspectRatio: '1/1' }}
      >
        <div className={`relative w-full h-full transition-transform duration-300 ease-out ${
          isSwiping ? 'transition-none' : ''
        }`}>
          {post.content.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                transform: `translateX(${
                  index === currentImageIndex ? '0%' :
                  index < currentImageIndex ? '-100%' : '100%'
                })`,
              }}
            >
              <img 
                src={image} 
                alt={`Post by ${post.author.username} - ${index + 1}/${post.content.images.length}`}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {post.content.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {post.content.images.map((_, index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {isSwiping && touchStart !== null && touchEnd !== null && (
          <>
            <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 transition-opacity duration-200 ${
              touchStart - touchEnd < -20 ? 'opacity-100' : 'opacity-30'
            }`}>
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-1.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
            <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 transition-opacity duration-200 ${
              touchStart - touchEnd > 20 ? 'opacity-100' : 'opacity-30'
            }`}>
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-1.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </>
        )}

        {post.products_tagged.length > 0 && (
          <div className="absolute inset-0 z-10">
            {post.products_tagged.map((product, index) => (
              <div
                key={product.id}
                className="absolute"
                style={{
                  left: `${product.x_position}%`,
                  top: `${product.y_position}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-3 h-3 bg-white/90 rounded-full ring-2 ring-white/80 shadow-sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-2">
        <div className="flex items-center justify-between mb-1">
          <button 
            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{formatNumber(likeCount)}</span>
          </button>

          <button className="flex items-center gap-1 text-gray-700">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{formatNumber(post.engagement.comments)}</span>
          </button>

          <button 
            className="flex items-center gap-1 text-gray-700"
            onClick={handleShare}
          >
            <Send className="w-4 h-4" />
            <span className="text-xs font-medium">{formatNumber(post.engagement.shares)}</span>
          </button>
        </div>

        <div className="mb-0.5">
          <p className="text-xs text-gray-900 line-clamp-2">
            <span className="font-semibold mr-1">{post.author.username}</span>
            {post.content.caption}
          </p>
        </div>

        {post.content.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {post.content.hashtags.slice(0, 2).map((hashtag, index) => (
              <span 
                key={index}
                className="text-[10px] text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => navigate(`/hashtag/${hashtag.replace('#', '')}`)}
              >
                #{hashtag}
              </span>
            ))}
            {post.content.hashtags.length > 2 && (
              <span className="text-[10px] text-gray-500">
                +{post.content.hashtags.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { PostCard };