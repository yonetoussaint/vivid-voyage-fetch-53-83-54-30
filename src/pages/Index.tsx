import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/components/home/SectionHeader";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, LayoutPanelLeft, Sparkles, ChevronRight, DollarSign, 
  Zap, Video, Crown, Play, Users, Image, Heart, MessageCircle, 
  Send, Bookmark, MoreHorizontal, Share2, Eye, Camera,
  Store, Star, User, CheckCircle
} from "lucide-react";

interface ForYouContentProps {
  category: string;
}

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

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Fetch reels function
const fetchReels = async (limit: number = 8): Promise<Reel[]> => {
  // Mock data - replace with actual API call
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

// Fetch posts function
const fetchPosts = async (limit: number = 15): Promise<Post[]> => {
  // Mock data - replace with actual API call
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
    },
    {
      id: 'post-2',
      type: 'post',
      author: {
        id: 'user-2',
        username: 'TechGuruMike',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        is_verified: true,
        follower_count: 89200
      },
      content: {
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop'
        ],
        caption: 'My new photography setup is complete! All gear tagged below. #photography #cameragear #tech',
        location: 'Home Studio',
        hashtags: ['photography', 'cameragear', 'tech', 'gadgets']
      },
      engagement: {
        likes: 5200,
        comments: 342,
        shares: 189,
        saves: 890,
        views: 45200
      },
      products_tagged: [
        {
          id: 'prod-3',
          name: 'DSLR Camera Bundle',
          price: 899.99,
          image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop',
          x_position: 50,
          y_position: 50
        }
      ],
      created_at: new Date(Date.now() - 7200000).toISOString(),
      is_sponsored: true,
      is_liked: true,
      is_saved: false
    },
    {
      id: 'post-3',
      type: 'post',
      author: {
        id: 'user-3',
        username: 'HomeDecorLover',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        is_verified: false,
        follower_count: 5600
      },
      content: {
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop'
        ],
        caption: 'Living room makeover complete! Loving the minimalist vibe. All items available with discount code HOMEDECOR20',
        location: 'New York',
        hashtags: ['homedecor', 'minimalist', 'interiordesign', 'livingroom']
      },
      engagement: {
        likes: 890,
        comments: 45,
        shares: 23,
        saves: 156,
        views: 7800
      },
      products_tagged: [
        {
          id: 'prod-4',
          name: 'Modern Sofa',
          price: 699.99,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
          x_position: 40,
          y_position: 60
        },
        {
          id: 'prod-5',
          name: 'Coffee Table',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
          x_position: 60,
          y_position: 40
        }
      ],
      created_at: new Date(Date.now() - 10800000).toISOString(),
      is_sponsored: false,
      is_liked: false,
      is_saved: true
    }
  ];

  return mockPosts.slice(0, limit);
};

// Fetch vendors function
const fetchVendors = async (limit: number = 6): Promise<Vendor[]> => {
  // Mock data - replace with actual API call
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

// Combined fetch function for all content
const fetchAllContent = async (): Promise<ContentItem[]> => {
  try {
    const [products, reels, posts, vendors] = await Promise.all([
      fetchAllProducts(),
      fetchReels(8),
      fetchPosts(10),
      fetchVendors(6)
    ]);

    // Combine all content
    const allContent: ContentItem[] = [
      ...products.map(p => ({ ...p, type: 'product' as const })),
      ...reels.map(r => ({ ...r, type: 'reel' as const })),
      ...posts.map(p => ({ ...p, type: 'post' as const })),
      ...vendors.map(v => ({ ...v, type: 'vendor' as const }))
    ];

    // Shuffle for mixed feed
    return shuffleArray(allContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
};

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// VendorCard Component using React Icons
const VendorCard = ({ vendor, onProductClick, onSellerClick }) => {
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

        {/* Products Grid */}
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

        {/* Vendor Info */}
        <div className="px-2 py-1">
          <div className="flex items-center gap-2">

            {/* Vendor Avatar */}
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

            {/* Vendor Details */}
            <div className="flex-1 min-w-0">
              {/* Name and Verification */}
              <div className="flex items-center mb-0.5">
                <h3 className="font-medium text-xs truncate mr-1">{vendor.name}</h3>
                {vendor.verified && <VerificationBadge />}
              </div>

              {/* Followers */}
              <div className="text-xs text-gray-500">
                {formatNumber(vendor.followers)} followers
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
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

// ProductCard component - MASONRY STYLE
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const soldCount = product.sold_count || Math.floor(Math.random() * 10000) + 100;
  const rating = product.rating || (Math.random() * 1 + 4).toFixed(1);
  const imageUrl = product.product_images?.[0]?.src || `https://placehold.co/300x400?text=Product`;
  
  // Use placeholder if image failed to load or no image URL
  const displayImageUrl = imageError 
    ? `https://placehold.co/300x400?text=${encodeURIComponent(product.name)}` 
    : imageUrl;

  // Generate tags based on product properties
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
      {/* Flat image container - removed rounded class */}
      <div className="w-full max-h-80 bg-white overflow-hidden mb-0.5 relative flex items-center justify-center">
        <img 
          src={displayImageUrl} 
          alt={product.name} 
          className="w-full h-auto max-h-full object-contain" 
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {/* Fallback placeholder shown while loading or on error */}
        {(imageError || !product.product_images?.[0]?.src) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-xs text-center px-2">
              {product.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-0.5 flex-grow">
        {/* Product name with tags inline */}
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
        {/* Currency changed to HTG (G) */}
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

// ReelCard component - MASONRY STYLE
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

// PostCard Component with Stacked Images - MASONRY STYLE
// PostCard Component with Stacked Images - MASONRY STYLE
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.engagement.likes);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const navigate = useNavigate();

  // Minimum swipe distance
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
    // Only navigate if not swiping
    if (!isSwiping) {
      setCurrentImageIndex((prev) => (prev + 1) % post.content.images.length);
    }
    setIsSwiping(false);
  };

  // Touch handlers for swipe
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
      // Swipe left - next image
      setCurrentImageIndex((prev) => 
        prev === post.content.images.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      // Swipe right - previous image
      setCurrentImageIndex((prev) => 
        prev === 0 ? post.content.images.length - 1 : prev - 1
      );
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  // Mouse handlers for desktop swipe
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
      // Swipe left - next image
      setCurrentImageIndex((prev) => 
        prev === post.content.images.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      // Swipe right - previous image
      setCurrentImageIndex((prev) => 
        prev === 0 ? post.content.images.length - 1 : prev - 1
      );
    }
    
    // Reset touch states
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
      {/* Post Header - COMPLETELY FLUSH */}
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

      {/* Image Carousel - SWIPEABLE & COMPLETELY FLUSH */}
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
        {/* Image container with animation */}
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

        {/* Image Dots Indicator - Bottom center */}
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

        {/* Swipe direction indicators - Only show when swiping */}
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

        {/* Product Tags Overlay - Simplified */}
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

      {/* Engagement & Content Section - COMPLETELY FLUSH */}
      <div className="py-2">
        {/* Social buttons - full width, edge to edge */}
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

        {/* Caption - flush to edges */}
        <div className="mb-0.5">
          <p className="text-xs text-gray-900 line-clamp-2">
            <span className="font-semibold mr-1">{post.author.username}</span>
            {post.content.caption}
          </p>
        </div>

        {/* Hashtags - flush to edges */}
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

// VendorCardWrapper component (adapted for masonry grid)
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
        showProducts={true}
        isPickupStation={vendor.isPickupStation || false}
        mode="grid"
        showBanner={vendor.isPickupStation || false}
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

// Favourite Channels Component
const FavouriteChannels: React.FC = () => {
  const channels = [
    {
      name: 'LazCash',
      icon: 'RM',
      bgColor: 'bg-gradient-to-br from-orange-300 to-orange-400',
      textColor: 'text-pink-600',
      iconType: 'text'
    },
    {
      name: 'LazFlash',
      icon: <Zap className="w-8 h-8" fill="white" stroke="white" />,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'Choice',
      icon: 'CHOICE',
      bgColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
      iconType: 'text'
    },
    {
      name: 'LazLive',
      icon: <Video className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'LazAffiliates',
      icon: <DollarSign className="w-10 h-10" strokeWidth={3} />,
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'Best Sellers',
      icon: <Crown className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-amber-600 to-amber-700',
      textColor: 'text-white',
      iconType: 'component'
    }
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-6 gap-1">
        {channels.map((channel, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-full ${channel.bgColor} flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform`}>
              {channel.iconType === 'text' ? (
                <span className={`font-bold ${channel.textColor} text-[8px]`}>
                  {channel.icon}
                </span>
              ) : (
                <div className={channel.textColor}>
                  {React.cloneElement(channel.icon, { 
                    className: channel.icon.props.className.replace(/w-\d+|h-\d+/g, '').trim() + ' w-3.5 h-3.5'
                  })}
                </div>
              )}
            </div>
            <span className="text-[8px] font-medium text-gray-800 text-center max-w-[42px] overflow-hidden text-ellipsis leading-tight">
              {channel.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Popular Categories Component
const PopularCategories: React.FC = () => {
  const navigate = useNavigate();
  const CategoryIcon = LayoutPanelLeft;

  const categories = [
    {
      id: 1,
      name: 'Mobiles',
      discount: 'HOT',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 2,
      name: 'Cribs & Cots',
      discount: '-50%',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Portable Speakers',
      discount: '-33%',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'Electric Insect Killers',
      discount: '-59%',
      image: 'https://images.unsplash.com/photo-1564424302846-62b1d09af73c?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 5,
      name: 'Smart Watches',
      discount: '-45%',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-purple-600'
    },
    {
      id: 6,
      name: 'Laptops',
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-green-600'
    },
    {
      id: 7,
      name: 'Headphones',
      discount: '-40%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-red-600'
    },
    {
      id: 8,
      name: 'Cameras',
      discount: '-30%',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-indigo-600'
    }
  ];

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/category/${categoryId}`, { state: { title: categoryName } });
  };

  const handleViewAllClick = () => {
    navigate('/categories');
  };

  return (
    <div className="bg-white">
      <SectionHeader
        title="Popular Categories for you"
        icon={CategoryIcon}
        showTitleChevron={true}
        viewAllLink="/categories"
        viewAllText="More"
        onViewAllClick={handleViewAllClick}
      />

      <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id, category.name)}
            className="flex-shrink-0 w-20 cursor-pointer group"
          >
            <div className="relative rounded-sm overflow-hidden mb-2 aspect-square transition-transform group-hover:scale-105 border border-gray-100">
              <div className={`absolute top-1 left-1 z-10 ${category.discountBg} text-white px-1 py-0.5 text-[9px] font-bold rounded-sm`}>
                {category.discount}
              </div>
              <div className="relative w-full h-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/80x80/cccccc/969696?text=${encodeURIComponent(category.name.charAt(0))}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[11px] text-gray-900 mb-0 truncate leading-tight">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Masonry Grid Component
const MasonryGrid: React.FC<{ items: ContentItem[] }> = ({ items }) => {
  // Group items into columns for masonry layout
  const columns = useMemo(() => {
    const colCount = 2; // 2 columns for mobile
    const cols: ContentItem[][] = Array.from({ length: colCount }, () => []);

    // Distribute items evenly between columns
    items.forEach((item, index) => {
      const colIndex = index % colCount;
      cols[colIndex].push(item);
    });

    return cols;
  }, [items]);

  return (
   <div className="grid grid-cols-2 gap-2 px-2"> {/* Keep existing gap between columns */}
  {columns.map((column, colIndex) => (
    <div key={colIndex} className="flex flex-col gap-px"> {/* Only this changes to 1px */}
      {column.map((item) => (
        <ContentCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  ))}
</div>
  );
};

// InfiniteContentGrid Component
const InfiniteContentGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const contentPerPage = 20;

  // Fetch ALL content
  const { data: initialContent, isLoading: initialLoading } = useQuery({
    queryKey: ["content", "for-you", category],
    queryFn: fetchAllContent,
    staleTime: 60000,
  });

  // Filter content by category if needed
  const filteredContent = useMemo(() => {
    if (!initialContent) return [];

    if (category && category !== 'recommendations') {
      return initialContent.filter(item => {
        if (item.type === 'product') {
          const product = item as Product;
          return product.category?.toLowerCase() === category.toLowerCase() ||
                 product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase());
        }
        return true;
      });
    }

    return initialContent;
  }, [initialContent, category]);

  // Set filtered content when data loads
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

  // Calculate visible content
  const visibleContent = useMemo(() => {
    const startIndex = 0;
    const endIndex = (page + 1) * contentPerPage;
    return allContent.slice(startIndex, endIndex);
  }, [allContent, page, contentPerPage]);

  // Calculate content type statistics
  const contentStats = useMemo(() => {
    const stats = {
      products: 0,
      reels: 0,
      posts: 0,
      vendors: 0,
      total: visibleContent.length
    };

    visibleContent.forEach(item => {
      if (item.type === 'product') stats.products++;
      if (item.type === 'reel') stats.reels++;
      if (item.type === 'post') stats.posts++;
      if (item.type === 'vendor') stats.vendors++;
    });

    return stats;
  }, [visibleContent]);

  // Check if we have more content to load
  useEffect(() => {
    if (allContent.length > 0) {
      const totalLoaded = (page + 1) * contentPerPage;
      const hasMoreContent = totalLoaded < allContent.length;
      setHasMore(hasMoreContent);
    }
  }, [allContent, page, contentPerPage]);

  // Load more content function
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

  // Intersection Observer for infinite scroll
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

  // Show loading state while fetching initial data
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

  // Show empty state if no content
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
      {/* Masonry Grid */}
      <MasonryGrid items={visibleContent} />

      {/* Load more trigger */}
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

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const navigate = useNavigate();
  const { setHeaderMode, headerMode } = useHeaderFilter();
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Improved scroll detection for header mode switching
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - scrollY.current;

          const header = document.getElementById("ali-header");
          if (!header) return;

          const headerHeight = header.getBoundingClientRect().height;
          const newsTicker = document.querySelector('.news-ticker');

          if (newsTicker) {
            const newsTickerRect = newsTicker.getBoundingClientRect();
            const newsTickerTopRelativeToHeader = newsTickerRect.top - headerHeight;
            const shouldShowNews = newsTickerTopRelativeToHeader <= 0;

            const scrollThreshold = 2;
            const isScrollingDown = scrollDelta > scrollThreshold;
            const isScrollingUp = scrollDelta < -scrollThreshold;

            if (shouldShowNews && isScrollingDown) {
              setHeaderMode('news');
            } else if (isScrollingUp) {
              setHeaderMode('categories');
            } else if (currentScrollY <= headerHeight) {
              setHeaderMode('categories');
            }
          }

          scrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setHeaderMode, headerMode]);

  // Reset to categories when component unmounts
  useEffect(() => {
    return () => {
      setHeaderMode('categories');
    };
  }, [setHeaderMode]);

  // Components array with reduced height separators
  const components = [
    <div key="hero" ref={heroBannerRef} className="mb-2">
      <HeroBanner showNewsTicker={true} />
    </div>,

    <div key="favourite-channels-wrapper" className="">
      <FavouriteChannels />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <div key="flash-deals-wrapper" className="mb-2">
      <FlashDeals
        showCountdown={true}
        icon={Tag}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <PopularCategories key="popular-categories" />,

    <div key="separator-3" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <InfiniteContentGrid key="infinite-grid" category={category} />,
  ];

  return (
    <div className="overflow-hidden relative">
      <div className="pb-2">
        {components.map((component, index) => (
          <React.Fragment key={`section-${index}`}>
            {component}
          </React.Fragment>
        ))}
      </div>

      {/* Hidden Footer */}
      <div 
        className="sr-only" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
        aria-hidden="true"
      >
        <Footer />
      </div>
    </div>
  );
};

const ForYou: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('recommendations');

  // Listen for category changes from header
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ForYouContent category={activeCategory} />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ForYou;