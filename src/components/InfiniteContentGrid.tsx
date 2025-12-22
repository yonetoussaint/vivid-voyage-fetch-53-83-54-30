import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { Sparkles, Tag, LayoutPanelLeft, Sparkles as SparklesIcon, ChevronRight, DollarSign, Zap, Video, Crown, Play, Users, Image, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share2, Eye, Camera, Store, Star, User, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  inventory: number;
  rating?: number;
  sold_count?: number;
  product_images?: Array<{ src: string }>;
  description?: string;
  category?: string;
  tags?: string[];
  flash_start_time?: string;
  created_at?: string;
  type?: 'product';
}

// Reel interface
interface Reel {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  duration: number;
  likes?: number;
  comments?: number;
  created_at?: string;
  is_live?: boolean;
  type: 'reel';
}

// Post interface with stacked images
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
    images: string[]; // Array of image URLs
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
    x_position: number; // Position percentage for tag
    y_position: number;
  }>;
  created_at: string;
  is_sponsored: boolean;
  is_liked?: boolean;
  is_saved?: boolean;
}

// Vendor interface
interface Vendor {
  id: string;
  name: string;
  type: 'vendor';
  rating: number;
  followers: number;
  verified: boolean;
  rank: number;
  discount?: string;
  image?: string;
  products: Array<{
    id: string;
    image?: string;
  }>;
  isPickupStation?: boolean;
}

// Combined content type
type ContentItem = Product | Reel | Post | Vendor;

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Helper function to render tag elements
const renderTag = (tag: string) => {
  if (tag === "Sale" || tag === "sale") {
    return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>;
  }
  if (tag === "SuperDeals" || tag === "flash_deal") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">SuperDeals</span>;
  }
  if (tag === "Brand+" || tag === "premium") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Brand+</span>;
  }
  if (tag === "POST" || tag === "post") {
    return <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-1.5 py-0.5 rounded text-[10px] mr-1 inline-block align-middle font-semibold">POST</span>;
  }
  return null;
};

// Fetch functions
const fetchAllProducts = async () => {
  // Mock implementation - replace with actual import
  return [];
};

const fetchReels = async (limit: number = 8): Promise<Reel[]> => {
  // Mock data
  const mockReels: Reel[] = Array.from({ length: limit }, (_, i) => ({
    id: `reel-${i}`,
    title: `Trending Reel #${i + 1}`,
    video_url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    thumbnail_url: `https://images.unsplash.com/photo-${150000 + i}?w=400&h=600&fit=crop`,
    views: Math.floor(Math.random() * 1000000) + 10000,
    duration: Math.floor(Math.random() * 60) + 15,
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 1000) + 10,
    created_at: new Date().toISOString(),
    is_live: i % 5 === 0,
    type: 'reel' as const
  }));

  return mockReels;
};

const fetchPosts = async (limit: number = 15): Promise<Post[]> => {
  // Mock data
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      type: 'post',
      author: {
        id: 'user-1',
        username: 'FashionistaJane',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        is_verified: true,
        follower_count: 14500
      },
      content: {
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop'
        ],
        caption: 'Just got these amazing summer outfits! Perfect for the beach #summerfashion #beachvibes #ootd',
        location: 'Miami Beach',
        hashtags: ['summerfashion', 'beachvibes', 'ootd', 'fashion', 'style']
      },
      engagement: {
        likes: 2450,
        comments: 128,
        shares: 56,
        saves: 312,
        views: 12500
      },
      products_tagged: [
        {
          id: 'prod-1',
          name: 'Floral Summer Dress',
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1561042187-5b4d1c493f3d?w=300&h=400&fit=crop',
          x_position: 65,
          y_position: 40
        },
        {
          id: 'prod-2',
          name: 'Straw Beach Hat',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w-300&h=400&fit=crop',
          x_position: 35,
          y_position: 20
        }
      ],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_sponsored: false,
      is_liked: false,
      is_saved: false
    }
  ];

  return mockPosts.slice(0, limit);
};

const fetchVendors = async (limit: number = 6): Promise<Vendor[]> => {
  // Mock data
  const mockVendors: Vendor[] = Array.from({ length: limit }, (_, i) => ({
    id: `vendor-${i}`,
    name: `Vendor ${i + 1}`,
    type: 'vendor' as const,
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
    followers: Math.floor(Math.random() * 10000) + 1000,
    verified: Math.random() > 0.3,
    rank: i + 1,
    discount: Math.random() > 0.5 ? `-${Math.floor(Math.random() * 50) + 10}%` : undefined,
    image: `https://images.unsplash.com/photo-${150000 + i}?w=200&h=200&fit=crop&crop=face`,
    products: Array.from({ length: 4 }, (_, j) => ({
      id: `vendor-${i}-product-${j}`,
      image: `https://images.unsplash.com/photo-${160000 + (i * 10) + j}?w=200&h=200&fit=crop`
    })),
    isPickupStation: i % 3 === 0
  }));

  return mockVendors;
};

const fetchAllContent = async (category?: string): Promise<ContentItem[]> => {
  try {
    const [products, reels, posts, vendors] = await Promise.all([
      fetchAllProducts(),
      fetchReels(8),
      fetchPosts(10),
      fetchVendors(6)
    ]);

    const allContent: ContentItem[] = [
      ...products.map(p => ({ ...p, type: 'product' as const })),
      ...reels.map(r => ({ ...r, type: 'reel' as const })),
      ...posts.map(p => ({ ...p, type: 'post' as const })),
      ...vendors.map(v => ({ ...v, type: 'vendor' as const }))
    ];

    // Filter by category if needed
    if (category && category !== 'recommendations') {
      return allContent.filter(item => {
        if (item.type === 'product') {
          const product = item as Product;
          return product.category?.toLowerCase() === category.toLowerCase() ||
                 product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase());
        }
        return true;
      });
    }

    // Shuffle for mixed feed
    const shuffled = [...allContent];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
};

// ProductCard component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const soldCount = product.sold_count || Math.floor(Math.random() * 10000) + 100;
  const rating = product.rating || (Math.random() * 1 + 4).toFixed(1);
  const imageUrl = product.product_images?.[0]?.src || `https://placehold.co/300x400?text=Product`;
  const displayImageUrl = imageError 
    ? `https://placehold.co/300x400?text=${encodeURIComponent(product.name)}` 
    : imageUrl;

  const generateTags = () => {
    const tags = [];
    if (product.discount_price) tags.push("Sale");
    if (product.flash_start_time) tags.push("SuperDeals");
    if (product.category?.toLowerCase().includes("premium")) tags.push("Brand+");
    if (product.tags && product.tags.length > 0) {
      tags.push(...product.tags.slice(0, 2));
    }
    return tags.length > 0 ? tags : ["Popular"];
  };

  const tags = generateTags();
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;

  return (
    <div className="bg-white overflow-hidden mb-2 flex flex-col">
      <div className="w-full max-h-80 bg-white overflow-hidden mb-0.5 relative flex items-center justify-center">
        <img 
          src={displayImageUrl} 
          alt={product.name} 
          className="w-full h-auto max-h-full object-contain" 
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {(imageError || !product.product_images?.[0]?.src) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-xs text-center px-2">
              {product.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-0.5 flex-grow">
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
          {tags.map((tag) => renderTag(tag))}
          {product.name}
        </p>
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="text-[10px] text-gray-500">{soldCount.toLocaleString()} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            <span className="text-[10px] text-gray-700 mr-0.5">★</span>
            <span className="text-[10px] text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">
          G{displayPrice.toLocaleString('en-US')}
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through ml-0.5">
              G{product.price.toLocaleString('en-US')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

// ReelCard component
const ReelCard: React.FC<{ reel: Reel }> = ({ reel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/reels?video=${reel.id}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-black rounded overflow-hidden relative cursor-pointer mb-2"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-800 relative overflow-hidden">
        <video 
          src={reel.video_url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />

        {reel.is_live && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>LIVE</span>
          </div>
        )}

        {!reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
            {formatDuration(reel.duration)}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
          <div className="flex items-center text-white text-[10px] gap-1">
            <Play className="w-3 h-3" fill="white" />
            <span>{formatNumber(reel.views)} views</span>
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
        REEL
      </div>

      <div className="p-2">
        <p className="text-[11px] text-white font-medium line-clamp-2 mb-1">
          {reel.title}
        </p>
        {reel.is_live && (
          <div className="flex items-center gap-1 text-[10px] text-pink-300">
            <Users className="w-3 h-3" />
            <span>Live now • {formatNumber(reel.views)} watching</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Stacked Images Indicator Component
const StackedImagesIndicator: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 1) return null;

  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 z-20 flex items-center justify-center shadow-lg">
      <div className="relative">
        <Image className="w-3.5 h-3.5" />
        <div className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </div>
      </div>
    </div>
  );
};

// PostCard Component
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
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

// VendorCard Component
const VendorCard: React.FC<{ vendor: Vendor; onProductClick: (id: string) => void; onSellerClick: (id: string) => void }> = ({ vendor, onProductClick, onSellerClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const displayProducts = vendor.products.slice(0, 3);

  const handleProductClick = (productId: string) => {
    onProductClick(productId);
  };

  const handleSellerClick = () => {
    if (!vendor?.id) return;
    onSellerClick(vendor.id);
  };

  const DefaultSellerAvatar = ({ className }: { className?: string }) => (
    <User className={className} />
  );

  const VerificationBadge = () => (
    <CheckCircle className="w-3 h-3 text-blue-500" />
  );

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-all duration-300">
        <div className="px-2 pt-2 pb-1 relative">
          {vendor.discount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
              {vendor.discount}
            </div>
          )}

          <div className="grid grid-cols-3 gap-1">
            {displayProducts.map((product) => (
              <button
                key={product.id}
                className="group cursor-pointer relative"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-square rounded border border-gray-100 bg-gray-50 overflow-hidden hover:border-gray-200 transition-colors">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Store size={14} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {vendor.image && !imageError ? (
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <DefaultSellerAvatar className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-0.5">
                <h3 className="font-medium text-xs truncate mr-1">{vendor.name}</h3>
                {vendor.verified && <VerificationBadge />}
              </div>

              <div className="text-xs text-gray-500">
                {formatNumber(vendor.followers)} followers
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 pb-2">
          <button
            className={`w-full flex items-center justify-center text-xs font-medium py-1.5 px-2 rounded-full transition-colors ${
              isFollowing
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

// VendorCardWrapper component
const VendorCardWrapper: React.FC<{ vendor: Vendor }> = ({ vendor }) => {
  const navigate = useNavigate();
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const handleSellerClick = () => {
    navigate(`/vendor/${vendor.id}`);
  };

  return (
    <div className="mb-2">
      <VendorCard
        vendor={vendor}
        onProductClick={handleProductClick}
        onSellerClick={handleSellerClick}
      />
    </div>
  );
};

// ContentCard Factory
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  switch (item.type) {
    case 'product':
      return <ProductCard product={item} />;
    case 'reel':
      return <ReelCard reel={item} />;
    case 'post':
      return <PostCard post={item} />;
    case 'vendor':
      return <VendorCardWrapper vendor={item} />;
    default:
      return null;
  }
};

// Masonry Grid Component
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  const columns = useMemo(() => {
    const colCount = 2;
    const cols: ContentItem[][] = Array.from({ length: colCount }, () => []);

    items.forEach((item, index) => {
      const colIndex = index % colCount;
      cols[colIndex].push(item);
    });

    return cols;
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-px">
          {column.map((item) => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Main InfiniteContentGrid Component
interface InfiniteContentGridProps {
  category?: string;
}

const InfiniteContentGrid: React.FC<InfiniteContentGridProps> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const contentPerPage = 20;

  const { data: initialContent, isLoading: initialLoading } = useQuery({
    queryKey: ["content", "for-you", category],
    queryFn: () => fetchAllContent(category),
    staleTime: 60000,
  });

  const filteredContent = useMemo(() => {
    if (!initialContent) return [];
    return initialContent;
  }, [initialContent]);

  useEffect(() => {
    if (filteredContent && filteredContent.length > 0) {
      setAllContent(filteredContent);
      setHasMore(filteredContent.length > contentPerPage);
      setPage(0);
    } else if (filteredContent && filteredContent.length === 0) {
      setAllContent([]);
      setHasMore(false);
    }
  }, [filteredContent]);

  const visibleContent = useMemo(() => {
    const startIndex = 0;
    const endIndex = (page + 1) * contentPerPage;
    return allContent.slice(startIndex, endIndex);
  }, [allContent, page, contentPerPage]);

  useEffect(() => {
    if (allContent.length > 0) {
      const totalLoaded = (page + 1) * contentPerPage;
      const hasMoreContent = totalLoaded < allContent.length;
      setHasMore(hasMoreContent);
    }
  }, [allContent, page, contentPerPage]);

  const loadMoreContent = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      setPage(nextPage);

      const totalLoaded = (nextPage + 1) * contentPerPage;
      if (totalLoaded >= allContent.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more content:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, allContent, contentPerPage]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreContent();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadMoreContent]);

  if (initialLoading && allContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="px-2">
          <div className="grid grid-cols-2 gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{ height: '300px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!initialLoading && allContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="text-center py-8 text-gray-500">
          No content found. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <MasonryGrid items={visibleContent} />

      <div 
        ref={loaderRef}
        className="flex justify-center items-center py-6"
      >
        {hasMore ? (
          <div className="text-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading more content...</p>
          </div>
        ) : visibleContent.length > 0 ? (
          <div className="text-center py-4">
            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No more content to load</p>
            <p className="text-[10px] text-gray-400 mt-1">You've reached the end</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfiniteContentGrid;