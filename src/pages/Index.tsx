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
  Tag, LayoutPanelLeft, Sparkles, ChevronRight, DollarSign, Zap, 
  Video, Crown, Play, Users, Heart, MessageCircle, Share2, 
  Star, CheckCircle, Target, TrendingUp, Clock, Award, 
  Package, Layers, Camera, BookOpen, Hash, Gift, 
  BarChart3, Sparkle, Eye, ShoppingBag, Trophy, Filter,
  ThumbsUp, TrendingDown, HelpCircle, BarChart
} from "lucide-react";

interface ForYouContentProps {
  category: string;
}

// Base Content Interface
interface BaseContent {
  id: string;
  type: string;
  created_at?: string;
}

// 1. PRODUCT
interface Product extends BaseContent {
  type: 'product';
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
}

// 2. REEL
interface Reel extends BaseContent {
  type: 'reel';
  title: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  duration: number;
  likes?: number;
  comments?: number;
  is_live?: boolean;
}

// 3. CREATOR POST
interface CreatorPost extends BaseContent {
  type: 'creator_post';
  creator_name: string;
  creator_avatar: string;
  creator_followers: number;
  content_image: string;
  description: string;
  product_tags: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
  }>;
  likes: number;
  comments: number;
  shares: number;
  posted_at: string;
  is_verified?: boolean;
}

// 4. USER REVIEW
interface UserReview extends BaseContent {
  type: 'user_review';
  user_name: string;
  user_avatar: string;
  rating: number;
  product_name: string;
  product_image: string;
  review_text: string;
  review_images: string[];
  helpful_count: number;
  verified_purchase: boolean;
  purchase_date: string;
  product_rating: number;
  usage_duration?: string;
}

// 5. LIVE STREAM
interface LiveStream extends BaseContent {
  type: 'live_stream';
  streamer_name: string;
  streamer_avatar: string;
  stream_title: string;
  thumbnail: string;
  viewers_count: number;
  products_featured: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
  }>;
  category: string;
  start_time: string;
  is_upcoming: boolean;
  discount_code?: string;
}

// 6. FLASH OFFER
interface FlashOffer extends BaseContent {
  type: 'flash_offer';
  title: string;
  discount_percentage: number;
  original_price: number;
  flash_price: number;
  product_image: string;
  time_left: number;
  items_left: number;
  participants: number;
  claim_method: 'first_come' | 'raffle' | 'bid';
  product_id: string;
  max_quantity: number;
}

// 7. PRODUCT COMPARISON
interface ProductComparison extends BaseContent {
  type: 'comparison';
  product_a: {
    name: string;
    image: string;
    price: number;
    rating: number;
    pros: string[];
    cons: string[];
  };
  product_b: {
    name: string;
    image: string;
    price: number;
    rating: number;
    pros: string[];
    cons: string[];
  };
  comparison_type: 'price' | 'features' | 'quality';
  winner: 'a' | 'b' | 'tie';
  comparison_score: number;
  topic: string;
}

// 8. INTERACTIVE POLL
interface InteractivePoll extends BaseContent {
  type: 'poll';
  question: string;
  options: Array<{
    id: string;
    text: string;
    image?: string;
    votes: number;
    is_selected?: boolean;
  }>;
  product_recommendations: Array<{
    option_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    reason: string;
  }>;
  total_votes: number;
  expires_at: string;
  is_voted?: boolean;
}

// 9. HASHTAG CHALLENGE
interface HashtagChallenge extends BaseContent {
  type: 'hashtag_challenge';
  hashtag: string;
  title: string;
  banner_image: string;
  description: string;
  participant_count: number;
  prize_pool: number;
  featured_products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    discount?: number;
  }>;
  end_date: string;
  rules: string[];
  is_participating?: boolean;
}

// 10. USER-GENERATED CONTENT
interface UGCContent extends BaseContent {
  type: 'ugc';
  user_id: string;
  user_name: string;
  user_avatar: string;
  content_type: 'video' | 'image' | 'text';
  media_url: string;
  caption: string;
  product_used: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  likes: number;
  shares: number;
  created_at: string;
  location?: string;
  tags: string[];
  is_featured?: boolean;
}

// 11. BUNDLE DEAL
interface BundleDeal extends BaseContent {
  type: 'bundle';
  title: string;
  products: Array<{
    id: string;
    name: string;
    image: string;
    original_price: number;
  }>;
  bundle_price: number;
  savings_percentage: number;
  items_count: number;
  bundle_image: string;
  popularity_score: number;
  times_bought: number;
  limited_time: boolean;
  expiration_date?: string;
}

// 12. AR/VR TRY-ON
interface ARTryOn extends BaseContent {
  type: 'ar_tryon';
  product_id: string;
  product_name: string;
  product_image: string;
  tryon_type: 'face' | 'room' | 'body';
  ar_preview_url: string;
  compatible_with: Array<'mobile' | 'desktop' | 'vr'>;
  try_count: number;
  conversion_rate: number;
  rating: number;
  category: string;
}

// 13. HOW-TO GUIDE
interface HowToGuide extends BaseContent {
  type: 'howto';
  title: string;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  time_required: string;
  tools_needed: string[];
  steps: Array<{
    step: number;
    title: string;
    image: string;
    description: string;
    products_used: Array<{
      id: string;
      name: string;
      image: string;
      price: number;
    }>;
  }>;
  final_result_image: string;
  likes: number;
  saves: number;
}

// 14. TREND ALERT
interface TrendAlert extends BaseContent {
  type: 'trend_alert';
  trend_name: string;
  trend_image: string;
  growth_percentage: number;
  time_frame: '24h' | '7d' | '30d';
  related_products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    sales_growth: number;
  }>;
  influencers_talking: number;
  hashtag: string;
  momentum: 'rising' | 'peak' | 'declining';
}

// Combined Content Type
type GridContentItem = 
  | Product 
  | Reel 
  | CreatorPost 
  | UserReview 
  | LiveStream 
  | FlashOffer 
  | ProductComparison 
  | InteractivePoll 
  | HashtagChallenge 
  | UGCContent 
  | BundleDeal 
  | ARTryOn 
  | HowToGuide 
  | TrendAlert;

// Helper Functions
const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K`;
  }
  return views.toString();
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatTimeLeft = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// ============================
// CARD COMPONENTS
// ============================

// 1. PRODUCT CARD
const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  const soldCount = item.sold_count || Math.floor(Math.random() * 10000) + 100;
  const rating = item.rating || (Math.random() * 1 + 4).toFixed(1);
  const imageUrl = item.product_images?.[0]?.src || `https://placehold.co/300x300?text=Product`;

  const generateTags = () => {
    const tags = [];
    if (item.discount_price) tags.push("Sale");
    if (item.flash_start_time) tags.push("SuperDeals");
    if (item.category?.toLowerCase().includes("premium")) tags.push("Brand+");
    if (item.tags && item.tags.length > 0) {
      tags.push(...item.tags.slice(0, 2));
    }
    return tags.length > 0 ? tags : ["Popular"];
  };

  const tags = generateTags();
  const displayPrice = item.discount_price || item.price;
  const hasDiscount = !!item.discount_price && item.discount_price < item.price;
  const salesNote = soldCount > 5000 ? "Top selling on AliExpress" : "";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-700 mb-1 line-clamp-2 leading-tight min-h-[2rem]">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] mr-1 mb-1">
              {tag}
            </span>
          ))}
          {item.name}
        </p>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] text-gray-500">{soldCount.toLocaleString()} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            <span className="text-[10px] text-yellow-500 mr-0.5">★</span>
            <span className="text-[10px] text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">
          G{displayPrice.toLocaleString('en-US')}
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through ml-1">
              G{item.price.toLocaleString('en-US')}
            </span>
          )}
        </p>
        {salesNote && (
          <p className="text-[10px] text-green-600 font-medium mt-0.5">{salesNote}</p>
        )}
      </div>
    </div>
  );
};

// 2. REEL CARD
const ReelCard: React.FC<{ item: Reel }> = ({ item }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/reels?video=${item.id}`);
  };

  return (
    <div 
      className="bg-black rounded-xl overflow-hidden relative cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-900 relative overflow-hidden group">
        <video 
          src={item.video_url}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          muted
          loop
          playsInline
          preload="metadata"
        />
        
        {item.is_live ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="font-bold">LIVE</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-medium px-2 py-1 rounded-lg z-10 backdrop-blur-sm">
            {formatDuration(item.duration)}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 z-10">
          <div className="flex items-center text-white gap-2">
            <Play className="w-4 h-4" fill="white" />
            <span className="text-sm font-semibold">{formatViews(item.views)}</span>
            <span className="text-xs text-gray-300">views</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
        REEL
      </div>
      
      <div className="p-3 bg-gradient-to-b from-gray-900 to-black">
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">{formatViews(item.likes || 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">{formatViews(item.comments || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. CREATOR POST CARD
const CreatorPostCard: React.FC<{ item: CreatorPost }> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Creator Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img 
              src={item.creator_avatar} 
              alt={item.creator_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
            {item.is_verified && (
              <CheckCircle className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h4 className="font-semibold text-sm">{item.creator_name}</h4>
              <Sparkle className="w-3 h-3 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500">{formatViews(item.creator_followers)} followers</p>
          </div>
          <button className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
            Follow
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        <img 
          src={item.content_image} 
          alt="Creator content"
          className="w-full aspect-square object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-sm line-clamp-2">{item.description}</p>
        </div>
      </div>
      
      {/* Product Tags */}
      {item.product_tags.length > 0 && (
        <div className="p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700">Featured Products</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {item.product_tags.map((product, idx) => (
              <div key={idx} className="flex-shrink-0">
                <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mb-1"
                  />
                  <p className="text-xs text-gray-700 truncate w-16">{product.name}</p>
                  <p className="text-xs font-bold text-gray-900">G{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Engagement Stats */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-600">{formatViews(item.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">{formatViews(item.comments)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">{formatViews(item.shares)}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">{item.posted_at}</span>
        </div>
      </div>
    </div>
  );
};

// 4. USER REVIEW CARD
const UserReviewCard: React.FC<{ item: UserReview }> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={item.user_avatar} 
              alt={item.user_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
            {item.verified_purchase && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">{item.user_name}</h4>
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 mr-1" fill="currentColor" />
                <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">Purchased {item.purchase_date}</p>
            {item.usage_duration && (
              <p className="text-xs text-gray-500">Used for {item.usage_duration}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Product */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img 
            src={item.product_image} 
            alt={item.product_name}
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <h5 className="font-semibold text-sm mb-1">{item.product_name}</h5>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(item.product_rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">{item.product_rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-3 line-clamp-4">{item.review_text}</p>
        
        {item.review_images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {item.review_images.slice(0, 2).map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`Review ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">{item.helpful_count} found helpful</span>
          </div>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Helpful ✓
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. LIVE STREAM CARD
const LiveStreamCard: React.FC<{ item: LiveStream }> = ({ item }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
      {/* Live Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1.5 rounded-full shadow-lg">
          <div className="flex items-center gap-0.5">
            <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-4 bg-white animate-pulse rounded" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="font-bold text-sm">LIVE NOW</span>
        </div>
      </div>
      
      {/* Viewer Count */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-bold">{formatViews(item.viewers_count)}</span>
        </div>
      </div>
      
      {/* Stream Thumbnail */}
      <div className="relative aspect-video">
        <img 
          src={item.thumbnail} 
          alt={item.stream_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Stream Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={item.streamer_avatar} 
            alt={item.streamer_name}
            className="w-12 h-12 rounded-full border-2 border-yellow-500"
          />
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm">{item.streamer_name}</h4>
            <p className="text-xs text-gray-300">{item.category} • {item.is_upcoming ? 'Starting Soon' : 'Live'}</p>
          </div>
        </div>
        
        <h3 className="text-white font-semibold text-base mb-3 line-clamp-2">{item.stream_title}</h3>
        
        {item.discount_code && (
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-200">Use code:</p>
                <p className="text-lg font-bold text-white">{item.discount_code}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-300">Live discount</p>
                <p className="text-sm font-bold text-green-400">-20% OFF</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Featured Products */}
        {item.products_featured.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Featured Products</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {item.products_featured.slice(0, 3).map((product, idx) => (
                <div key={idx} className="flex-shrink-0 bg-gray-800/50 rounded-lg p-2 backdrop-blur-sm">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mb-1"
                  />
                  <p className="text-xs text-white truncate w-16">{product.name}</p>
                  <p className="text-xs font-bold text-yellow-400">G{product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Video className="w-5 h-5" />
          {item.is_upcoming ? 'Set Reminder' : 'Join Live Stream'}
        </button>
      </div>
    </div>
  );
};

// 6. FLASH OFFER CARD
const FlashOfferCard: React.FC<{ item: FlashOffer }> = ({ item }) => {
  const [timeLeft, setTimeLeft] = useState(item.time_left);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getClaimMethodIcon = () => {
    switch (item.claim_method) {
      case 'first_come': return <Zap className="w-4 h-4" />;
      case 'raffle': return <Gift className="w-4 h-4" />;
      case 'bid': return <DollarSign className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Flash Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-white text-red-600 px-3 py-1.5 rounded-full shadow-lg">
          <Zap className="w-4 h-4" fill="currentColor" />
          <span className="font-bold text-sm">FLASH SALE</span>
        </div>
      </div>
      
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white text-red-600 font-black text-xl px-3 py-2 rounded-full shadow-lg">
          -{item.discount_percentage}%
        </div>
      </div>
      
      {/* Product Image */}
      <div className="relative p-6">
        <div className="flex justify-center">
          <img 
            src={item.product_image} 
            alt={item.title}
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-white p-4 rounded-t-2xl">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
        
        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl font-black text-red-600">
            G{item.flash_price.toLocaleString()}
          </div>
          <div className="text-lg text-gray-500 line-through">
            G{item.original_price.toLocaleString()}
          </div>
          <div className="text-sm font-bold text-green-600">
            Save {((item.original_price - item.flash_price) / item.original_price * 100).toFixed(0)}%
          </div>
        </div>
        
        {/* Progress & Stats */}
        <div className="space-y-3 mb-4">
          {/* Time Left */}
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">Time Left</span>
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black text-red-600 text-center">
              {formatTimeLeft(timeLeft)}
            </div>
          </div>
          
          {/* Items Left */}
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">Items Left</span>
              <div className="flex items-center gap-1">
                {getClaimMethodIcon()}
                <span className="text-xs text-gray-600 capitalize">{item.claim_method}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-orange-600">{item.items_left} left</span>
              <span className="text-sm text-gray-600">{item.participants} participants</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((item.max_quantity - item.items_left) / item.max_quantity) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          Claim Flash Deal
        </button>
      </div>
    </div>
  );
};

// 7. PRODUCT COMPARISON CARD
const ProductComparisonCard: React.FC<{ item: ProductComparison }> = ({ item }) => {
  const getWinnerBadge = (side: 'a' | 'b') => {
    if (item.winner === 'tie') return null;
    if (item.winner === side) {
      return (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          <Trophy className="w-3 h-3" />
        </div>
      );
    }
    return (
      <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
        <TrendingDown className="w-3 h-3" />
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Product Comparison</h3>
        </div>
        <p className="text-sm text-gray-600">Comparing {item.comparison_type}: {item.topic}</p>
      </div>
      
      {/* Comparison Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Product A */}
          <div className="relative bg-white rounded-lg border border-gray-200 p-4">
            {getWinnerBadge('a')}
            <div className="text-center mb-3">
              <img 
                src={item.product_a.image} 
                alt={item.product_a.name}
                className="w-24 h-24 object-contain mx-auto mb-2"
              />
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.product_a.name}</h4>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(item.product_a.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs text-gray-600">{item.product_a.rating.toFixed(1)}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">G{item.product_a.price.toLocaleString()}</p>
            </div>
            
            {/* Pros */}
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-green-600">Pros</span>
              </div>
              <ul className="space-y-1">
                {item.product_a.pros.slice(0, 3).map((pro, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Cons */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-semibold text-red-600">Cons</span>
              </div>
              <ul className="space-y-1">
                {item.product_a.cons.slice(0, 2).map((con, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="text-red-500">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Product B */}
          <div className="relative bg-white rounded-lg border border-gray-200 p-4">
            {getWinnerBadge('b')}
            <div className="text-center mb-3">
              <img 
                src={item.product_b.image} 
                alt={item.product_b.name}
                className="w-24 h-24 object-contain mx-auto mb-2"
              />
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.product_b.name}</h4>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(item.product_b.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs text-gray-600">{item.product_b.rating.toFixed(1)}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">G{item.product_b.price.toLocaleString()}</p>
            </div>
            
            {/* Pros */}
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-green-600">Pros</span>
              </div>
              <ul className="space-y-1">
                {item.product_b.pros.slice(0, 3).map((pro, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Cons */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-semibold text-red-600">Cons</span>
              </div>
              <ul className="space-y-1">
                {item.product_b.cons.slice(0, 2).map((con, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="text-red-500">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Comparison Score */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Comparison Score</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-blue-600">{item.comparison_score}/100</div>
              <p className="text-xs text-gray-600">
                {item.winner === 'tie' ? 'Both are great choices!' : 
                 `${item.winner === 'a' ? item.product_a.name : item.product_b.name} wins in ${item.comparison_type}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. INTERACTIVE POLL CARD
const InteractivePollCard: React.FC<{ item: InteractivePoll }> = ({ item }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(item.is_voted ? item.options.find(o => o.is_selected)?.id || null : null);
  const [hasVoted, setHasVoted] = useState(item.is_voted || false);
  
  const handleVote = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
      setHasVoted(true);
      // In a real app, you would send this vote to your backend
    }
  };
  
  const calculatePercentage = (votes: number) => {
    return item.total_votes > 0 ? (votes / item.total_votes) * 100 : 0;
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Quick Poll</h3>
        </div>
        <p className="text-sm text-gray-700">{item.question}</p>
        <div className="flex items-center gap-2 mt-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-600">{item.total_votes} votes</span>
          <Clock className="w-4 h-4 text-gray-500 ml-2" />
          <span className="text-xs text-gray-600">Ends {item.expires_at}</span>
        </div>
      </div>
      
      {/* Poll Options */}
      <div className="p-4">
        <div className="space-y-3">
          {item.options.map((option) => {
            const percentage = calculatePercentage(option.votes);
            const isSelected = selectedOption === option.id;
            
            return (
              <div 
                key={option.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  hasVoted ? 'cursor-default' : 'hover:scale-[1.02]'
                }`}
                onClick={() => handleVote(option.id)}
              >
                <div className={`relative p-3 rounded-lg border ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {option.image && (
                      <img 
                        src={option.image} 
                        alt={option.text}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">{option.text}</span>
                        {hasVoted && (
                          <span className="text-xs font-bold text-purple-600">{percentage.toFixed(0)}%</span>
                        )}
                      </div>
                      
                      {hasVoted && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    {isSelected && (
                      <div className="bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Recommendations */}
        {hasVoted && selectedOption && item.product_recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-gray-900">Recommended for you</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {item.product_recommendations
                .filter(rec => rec.option_id === selectedOption)
                .slice(0, 2)
                .map((rec, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                    <img 
                      src={rec.product_image} 
                      alt={rec.product_name}
                      className="w-full h-16 object-contain mb-2"
                    />
                    <p className="text-xs font-semibold text-gray-900 truncate">{rec.product_name}</p>
                    <p className="text-xs text-gray-600">{rec.reason}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {/* CTA */}
        <div className="mt-6">
          {!hasVoted ? (
            <button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => selectedOption && handleVote(selectedOption)}
              disabled={!selectedOption}
            >
              Submit Vote
            </button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600">Thanks for voting! 🎉</p>
              <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                View Results & Recommendations →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 9. HASHTAG CHALLENGE CARD
const HashtagChallengeCard: React.FC<{ item: HashtagChallenge }> = ({ item }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
      {/* Banner */}
      <div className="relative h-32">
        <img 
          src={item.banner_image} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent"></div>
        
        {/* Hashtag */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <span className="font-bold text-lg">{item.hashtag}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{item.description}</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-6 h-6 text-white mx-auto mb-1" />
            <div className="text-white font-bold text-lg">{formatViews(item.participant_count)}</div>
            <div className="text-gray-300 text-xs">Participants</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Gift className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-white font-bold text-lg">G{item.prize_pool.toLocaleString()}</div>
            <div className="text-gray-300 text-xs">Prize Pool</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <div className="text-white font-bold text-lg">{item.end_date}</div>
            <div className="text-gray-300 text-xs">Ends</div>
          </div>
        </div>
        
        {/* Featured Products */}
        {item.featured_products.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <h4 className="text-white font-semibold">Featured Products</h4>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {item.featured_products.slice(0, 3).map((product, idx) => (
                <div key={idx} className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[120px]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-16 object-contain mb-2"
                  />
                  <p className="text-xs text-white truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-yellow-400">G{product.price.toLocaleString()}</span>
                    {product.discount && (
                      <span className="text-xs text-green-400">-{product.discount}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Rules */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2">How to Participate</h4>
          <ul className="space-y-1">
            {item.rules.slice(0, 3).map((rule, idx) => (
              <li key={idx} className="text-gray-300 text-xs flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            {item.is_participating ? 'View Submission' : 'Join Challenge'}
          </button>
          <button className="px-4 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 10. UGC CONTENT CARD
const UGCContentCard: React.FC<{ item: UGCContent }> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* User Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={item.user_avatar} 
              alt={item.user_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h4 className="font-semibold text-sm">{item.user_name}</h4>
              {item.location && (
                <p className="text-xs text-gray-500">{item.location}</p>
              )}
            </div>
          </div>
          {item.is_featured && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Star className="w-3 h-3 inline mr-1" />
              Featured
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        {item.content_type === 'video' ? (
          <video 
            src={item.media_url}
            className="w-full aspect-square object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img 
            src={item.media_url} 
            alt="User content"
            className="w-full aspect-square object-cover"
          />
        )}
        
        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Caption */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-3">{item.caption}</p>
        
        {/* Product Used */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <img 
              src={item.product_used.image} 
              alt={item.product_used.name}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">{item.product_used.name}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">G{item.product_used.price.toLocaleString()}</p>
            </div>
            <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Engagement */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">{formatViews(item.likes)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{item.shares}</span>
            </button>
          </div>
          <button className="text-gray-600 hover:text-green-500 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 11. BUNDLE DEAL CARD
const BundleDealCard: React.FC<{ item: BundleDeal }> = ({ item }) => {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            <h3 className="font-bold text-lg">Bundle Deal</h3>
          </div>
          {item.limited_time && (
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Time</span>
            </div>
          )}
        </div>
        <h4 className="text-xl font-black">{item.title}</h4>
        <p className="text-sm opacity-90">{item.items_count} items in bundle</p>
      </div>
      
      {/* Bundle Image */}
      <div className="relative p-6">
        <div className="relative flex justify-center">
          <img 
            src={item.bundle_image} 
            alt={item.title}
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
          <div className="absolute top-0 right-6 bg-white text-emerald-600 font-black text-xl px-4 py-2 rounded-full shadow-lg">
            -{item.savings_percentage}%
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="bg-white p-4 rounded-t-2xl">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h5 className="font-bold text-gray-900">What's Included</h5>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {item.products.slice(0, 4).map((product, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-500 line-through">G{product.original_price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {item.products.length > 4 && (
            <p className="text-center text-sm text-gray-600 mt-2">+{item.products.length - 4} more items</p>
          )}
        </div>
        
        {/* Price & Savings */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600">Original Value</p>
              <p className="text-xl font-black text-gray-900 line-through">
                G{item.products.reduce((sum, p) => sum + p.original_price, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Bundle Price</p>
              <p className="text-3xl font-black text-emerald-600">
                G{item.bundle_price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              Save G{(item.products.reduce((sum, p) => sum + p.original_price, 0) - item.bundle_price).toLocaleString()} ({item.savings_percentage}%)
            </p>
          </div>
        </div>
        
        {/* Popularity */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-gray-700">Popularity: {item.popularity_score}/100</span>
          </div>
          <div className="text-gray-700">
            {item.times_bought.toLocaleString()} bought
          </div>
        </div>
        
        {/* CTA */}
        <button className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3">
          <ShoppingBag className="w-6 h-6" />
          <span>Add Bundle to Cart</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Save {item.savings_percentage}%</span>
        </button>
      </div>
    </div>
  );
};

// 12. AR TRY-ON CARD
const ARTryOnCard: React.FC<{ item: ARTryOn }> = ({ item }) => {
  const getTryOnTypeIcon = () => {
    switch (item.tryon_type) {
      case 'face': return <Sparkles className="w-6 h-6 text-pink-500" />;
      case 'room': return <LayoutPanelLeft className="w-6 h-6 text-blue-500" />;
      case 'body': return <Users className="w-6 h-6 text-green-500" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };
  
  const getTryOnTypeText = () => {
    switch (item.tryon_type) {
      case 'face': return 'Virtual Try-On';
      case 'room': return 'Room Preview';
      case 'body': return 'Body Fit';
      default: return 'AR Experience';
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
      {/* Header */}
      <div className="p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getTryOnTypeIcon()}
            <div>
              <h3 className="font-bold text-lg">{getTryOnTypeText()}</h3>
              <p className="text-sm opacity-80">{item.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-sm font-semibold">AR</span>
          </div>
        </div>
        <h4 className="text-xl font-black mb-2">{item.product_name}</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{formatViews(item.try_count)} tries</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm">{item.conversion_rate}% conversion</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Product & AR Preview */}
      <div className="relative">
        <div className="flex">
          {/* Product Image */}
          <div className="w-1/2 p-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <img 
                src={item.product_image} 
                alt={item.product_name}
                className="w-full h-40 object-contain"
              />
            </div>
          </div>
          
          {/* AR Preview */}
          <div className="w-1/2 p-6">
            <div className="relative bg-black/30 rounded-2xl overflow-hidden aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white font-semibold">AR Preview Available</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Try It Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compatibility & Info */}
      <div className="bg-white/10 backdrop-blur-sm m-4 rounded-xl p-4">
        <div className="mb-3">
          <p className="text-white text-sm font-semibold mb-2">Compatible With:</p>
          <div className="flex flex-wrap gap-2">
            {item.compatible_with.map((device, idx) => (
              <span key={idx} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {device}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white text-sm opacity-80">Try-On Rate</p>
            <p className="text-white text-2xl font-bold">{item.conversion_rate}%</p>
          </div>
          <div className="text-center">
            <p className="text-white text-sm opacity-80">User Rating</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-white text-2xl font-bold">{item.rating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="p-5 bg-gradient-to-t from-black/50 to-transparent">
        <button className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
          <Camera className="w-6 h-6" />
          <span>Launch AR Experience</span>
        </button>
        <p className="text-center text-gray-300 text-sm mt-3">
          See how it looks on you in real-time
        </p>
      </div>
    </div>
  );
};

// 13. HOW-TO GUIDE CARD
const HowToGuideCard: React.FC<{ item: HowToGuide }> = ({ item }) => {
  const getDifficultyColor = () => {
    switch (item.difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="relative">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Guide</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor()}`}>
              {item.difficulty}
            </span>
          </div>
          <h3 className="text-white font-bold text-xl">{item.title}</h3>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{item.time_required}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{formatViews(item.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>{formatViews(item.saves)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Steps Preview */}
      <div className="p-4">
        <h4 className="font-bold text-gray-900 mb-3">What You'll Need</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tools_needed.slice(0, 5).map((tool, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
              {tool}
            </span>
          ))}
        </div>
        
        <h4 className="font-bold text-gray-900 mb-3">Quick Steps</h4>
        <div className="space-y-3">
          {item.steps.slice(0, 3).map((step) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                {step.step}
              </div>
              <div>
                <h5 className="font-semibold text-sm text-gray-900 mb-1">{step.title}</h5>
                <p className="text-xs text-gray-600">{step.description}</p>
                {step.products_used.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                    {step.products_used.slice(0, 2).map((product, idx) => (
                      <div key={idx} className="flex-shrink-0 bg-gray-50 rounded p-2 min-w-[80px]">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 object-contain mx-auto mb-1"
                        />
                        <p className="text-[10px] text-gray-900 truncate text-center">{product.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {item.steps.length > 3 && (
          <p className="text-center text-sm text-gray-600 mt-3">
            +{item.steps.length - 3} more steps
          </p>
        )}
      </div>
      
      {/* Final Result */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <img 
            src={item.final_result_image} 
            alt="Final result"
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div>
            <p className="font-semibold text-sm text-gray-900">Final Result</p>
            <p className="text-xs text-gray-600">See what you'll achieve</p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
          View Complete Guide
        </button>
      </div>
    </div>
  );
};

// 14. TREND ALERT CARD
const TrendAlertCard: React.FC<{ item: TrendAlert }> = ({ item }) => {
  const getMomentumColor = () => {
    switch (item.momentum) {
      case 'rising': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'peak': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      case 'declining': return 'bg-gradient-to-r from-red-500 to-pink-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };
  
  const getMomentumText = () => {
    switch (item.momentum) {
      case 'rising': return 'Rising Fast 🔥';
      case 'peak': return 'Peak Popularity ⚡';
      case 'declining': return 'Trending Down ⬇️';
      default: return 'Trending';
    }
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className={`${getMomentumColor()} p-5 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="font-bold text-lg">Trend Alert</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold">{getMomentumText()}</span>
          </div>
        </div>
        <h4 className="text-2xl font-black mb-1">{item.trend_name}</h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span>+{item.growth_percentage}% growth</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4" />
            <span>#{item.hashtag}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{item.influencers_talking} influencers</span>
          </div>
        </div>
      </div>
      
      {/* Trend Image */}
      <div className="relative h-40">
        <img 
          src={item.trend_image} 
          alt={item.trend_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm">
            {item.time_frame === '24h' ? 'Last 24 hours' : 
             item.time_frame === '7d' ? 'This week' : 'This month'}
          </p>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="p-4">
        <h4 className="font-bold text-gray-900 mb-3">Hot Products in this Trend</h4>
        <div className="space-y-3">
          {item.related_products.slice(0, 3).map((product, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">{product.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    product.sales_growth > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.sales_growth > 0 ? '+' : ''}{product.sales_growth}%
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">G{product.price.toLocaleString()}</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Shop
              </button>
            </div>
          ))}
        </div>
        
        {item.related_products.length > 3 && (
          <p className="text-center text-sm text-gray-600 mt-3">
            +{item.related_products.length - 3} more trending products
          </p>
        )}
      </div>
      
      {/* Action */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            Explore Trend
          </button>
          <button className="px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================
// CONTENT CARD FACTORY
// ============================

const ContentCardFactory: React.FC<{ item: GridContentItem }> = ({ item }) => {
  switch (item.type) {
    case 'product':
      return <ProductCard item={item as Product} />;
    case 'reel':
      return <ReelCard item={item as Reel} />;
    case 'creator_post':
      return <CreatorPostCard item={item as CreatorPost} />;
    case 'user_review':
      return <UserReviewCard item={item as UserReview} />;
    case 'live_stream':
      return <LiveStreamCard item={item as LiveStream} />;
    case 'flash_offer':
      return <FlashOfferCard item={item as FlashOffer} />;
    case 'comparison':
      return <ProductComparisonCard item={item as ProductComparison} />;
    case 'poll':
      return <InteractivePollCard item={item as InteractivePoll} />;
    case 'hashtag_challenge':
      return <HashtagChallengeCard item={item as HashtagChallenge} />;
    case 'ugc':
      return <UGCContentCard item={item as UGCContent} />;
    case 'bundle':
      return <BundleDealCard item={item as BundleDeal} />;
    case 'ar_tryon':
      return <ARTryOnCard item={item as ARTryOn} />;
    case 'howto':
      return <HowToGuideCard item={item as HowToGuide} />;
    case 'trend_alert':
      return <TrendAlertCard item={item as TrendAlert} />;
    default:
      console.warn(`Unknown content type: ${(item as any).type}`);
      return null;
  }
};

// ============================
// FETCH FUNCTIONS
// ============================

const fetchReels = async (limit: number = 10): Promise<Reel[]> => {
  // Mock reels data
  return Array.from({ length: limit }, (_, i) => ({
    id: `reel-${i}`,
    type: 'reel',
    title: `Trending Reel #${i + 1} - Must Watch!`,
    video_url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    thumbnail_url: `https://images.unsplash.com/photo-${150000 + i}?w=400&h=600&fit=crop`,
    views: Math.floor(Math.random() * 1000000) + 10000,
    duration: Math.floor(Math.random() * 60) + 15,
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 1000) + 10,
    is_live: i % 5 === 0,
    created_at: new Date().toISOString(),
  }));
};

const fetchCreatorPosts = async (limit: number = 5): Promise<CreatorPost[]> => {
  // Mock creator posts
  return Array.from({ length: limit }, (_, i) => ({
    id: `creator-post-${i}`,
    type: 'creator_post',
    creator_name: `FashionInfluencer${i}`,
    creator_avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
    creator_followers: Math.floor(Math.random() * 1000000) + 10000,
    content_image: `https://images.unsplash.com/photo-${149000 + i}?w=800&h=800&fit=crop`,
    description: `Check out my latest outfit featuring these amazing products! #fashion #style`,
    product_tags: Array.from({ length: 3 }, (_, j) => ({
      id: `product-${j}`,
      name: `Product ${j + 1}`,
      image: `https://images.unsplash.com/photo-${160000 + j}?w=400&h=400`,
      price: Math.floor(Math.random() * 100) + 20,
    })),
    likes: Math.floor(Math.random() * 10000) + 1000,
    comments: Math.floor(Math.random() * 1000) + 100,
    shares: Math.floor(Math.random() * 500) + 50,
    posted_at: `${Math.floor(Math.random() * 24)}h ago`,
    is_verified: i % 3 === 0,
  }));
};

const fetchUserReviews = async (limit: number = 5): Promise<UserReview[]> => {
  // Mock user reviews
  return Array.from({ length: limit }, (_, i) => ({
    id: `review-${i}`,
    type: 'user_review',
    user_name: `Customer${i}`,
    user_avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
    rating: 4 + Math.random(),
    product_name: `Premium Wireless Headphones`,
    product_image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400`,
    review_text: `These headphones are amazing! Great sound quality, comfortable to wear for hours, and the battery life is incredible. Would definitely recommend to anyone looking for quality audio.`,
    review_images: [
      `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400`,
      `https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400`,
    ],
    helpful_count: Math.floor(Math.random() * 1000) + 100,
    verified_purchase: i % 2 === 0,
    purchase_date: `${Math.floor(Math.random() * 30) + 1} days ago`,
    product_rating: 4.5,
    usage_duration: `${Math.floor(Math.random() * 12) + 1} months`,
  }));
};

const fetchLiveStreams = async (limit: number = 3): Promise<LiveStream[]> => {
  // Mock live streams
  return Array.from({ length: limit }, (_, i) => ({
    id: `live-${i}`,
    type: 'live_stream',
    streamer_name: `LiveSeller${i}`,
    streamer_avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
    stream_title: `Flash Sale Live! Up to 70% OFF + Special Discounts!`,
    thumbnail: `https://images.unsplash.com/photo-${155000 + i}?w=800&h=450&fit=crop`,
    viewers_count: Math.floor(Math.random() * 10000) + 1000,
    products_featured: Array.from({ length: 4 }, (_, j) => ({
      id: `product-${j}`,
      name: `Featured Product ${j + 1}`,
      image: `https://images.unsplash.com/photo-${160000 + j}?w=400&h=400`,
      price: Math.floor(Math.random() * 100) + 20,
    })),
    category: ['Electronics', 'Fashion', 'Home'][i % 3],
    start_time: 'NOW',
    is_upcoming: i === 2,
    discount_code: i === 0 ? 'LIVE20' : undefined,
  }));
};

const fetchFlashOffers = async (limit: number = 3): Promise<FlashOffer[]> => {
  // Mock flash offers
  return Array.from({ length: limit }, (_, i) => ({
    id: `flash-${i}`,
    type: 'flash_offer',
    title: `Limited Time Flash Deal!`,
    discount_percentage: Math.floor(Math.random() * 50) + 20,
    original_price: Math.floor(Math.random() * 200) + 100,
    flash_price: Math.floor(Math.random() * 100) + 50,
    product_image: `https://images.unsplash.com/photo-${152000 + i}?w=400&h=400&fit=crop`,
    time_left: Math.floor(Math.random() * 3600) + 1800,
    items_left: Math.floor(Math.random() * 50) + 10,
    participants: Math.floor(Math.random() * 1000) + 500,
    claim_method: ['first_come', 'raffle', 'bid'][i % 3] as 'first_come' | 'raffle' | 'bid',
    product_id: `product-${i}`,
    max_quantity: 100,
  }));
};

const fetchProductComparisons = async (limit: number = 3): Promise<ProductComparison[]> => {
  // Mock product comparisons
  return Array.from({ length: limit }, (_, i) => ({
    id: `comparison-${i}`,
    type: 'comparison',
    product_a: {
      name: `Wireless Earbuds Pro`,
      image: `https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400`,
      price: 129.99,
      rating: 4.3,
      pros: ['Great battery life', 'Noise cancellation', 'Comfortable fit'],
      cons: ['Expensive', 'Case is bulky'],
    },
    product_b: {
      name: `SoundCore Liberty 3 Pro`,
      image: `https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400`,
      price: 89.99,
      rating: 4.5,
      pros: ['Excellent sound', 'Affordable', 'Good battery'],
      cons: ['Fit could be better', 'No wireless charging'],
    },
    comparison_type: ['price', 'features', 'quality'][i % 3] as 'price' | 'features' | 'quality',
    winner: i === 0 ? 'a' : i === 1 ? 'b' : 'tie',
    comparison_score: Math.floor(Math.random() * 40) + 60,
    topic: ['Audio Quality', 'Value for Money', 'Features'][i % 3],
  }));
};

const fetchInteractivePolls = async (limit: number = 3): Promise<InteractivePoll[]> => {
  // Mock polls
  return Array.from({ length: limit }, (_, i) => ({
    id: `poll-${i}`,
    type: 'poll',
    question: `Which feature matters most to you in headphones?`,
    options: [
      { id: '1', text: 'Sound Quality', votes: Math.floor(Math.random() * 1000) + 500, image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200` },
      { id: '2', text: 'Battery Life', votes: Math.floor(Math.random() * 800) + 400, image: `https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&h=200` },
      { id: '3', text: 'Noise Cancellation', votes: Math.floor(Math.random() * 600) + 300, image: `https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200` },
      { id: '4', text: 'Comfort & Fit', votes: Math.floor(Math.random() * 400) + 200, image: `https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200` },
    ],
    product_recommendations: [
      { option_id: '1', product_id: 'p1', product_name: 'Sony WH-1000XM4', product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200', reason: 'Best sound quality in class' },
      { option_id: '2', product_id: 'p2', product_name: 'Jabra Elite 85h', product_image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&h=200', reason: '36-hour battery life' },
    ],
    total_votes: 2500,
    expires_at: '2 days',
    is_voted: false,
  }));
};

const fetchHashtagChallenges = async (limit: number = 2): Promise<HashtagChallenge[]> => {
  // Mock hashtag challenges
  return Array.from({ length: limit }, (_, i) => ({
    id: `challenge-${i}`,
    type: 'hashtag_challenge',
    hashtag: i === 0 ? 'TechStyle2024' : 'SustainableFashion',
    title: i === 0 ? 'Show Your Tech Style' : 'Eco-Friendly Fashion Challenge',
    banner_image: `https://images.unsplash.com/photo-${151000 + i}?w=800&h=400&fit=crop`,
    description: i === 0 
      ? 'Show us how you style your tech gadgets! Win amazing prizes.'
      : 'Share your sustainable fashion looks and win eco-friendly products.',
    participant_count: Math.floor(Math.random() * 10000) + 5000,
    prize_pool: Math.floor(Math.random() * 10000) + 5000,
    featured_products: Array.from({ length: 3 }, (_, j) => ({
      id: `product-${j}`,
      name: `Eco Product ${j + 1}`,
      image: `https://images.unsplash.com/photo-${149000 + j}?w=400&h=400`,
      price: Math.floor(Math.random() * 100) + 30,
      discount: j === 0 ? 20 : undefined,
    })),
    end_date: 'Dec 31, 2024',
    rules: [
      'Use the hashtag in your post',
      'Follow our account',
      'Tag 3 friends',
      'Post must be public',
    ],
    is_participating: false,
  }));
};

const fetchUGCContent = async (limit: number = 5): Promise<UGCContent[]> => {
  // Mock UGC content
  return Array.from({ length: limit }, (_, i) => ({
    id: `ugc-${i}`,
    type: 'ugc',
    user_id: `user-${i}`,
    user_name: `StyleLover${i}`,
    user_avatar: `https://i.pravatar.cc/150?img=${i + 40}`,
    content_type: i % 2 === 0 ? 'video' : 'image',
    media_url: i % 2 === 0 
      ? `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
      : `https://images.unsplash.com/photo-${149500 + i}?w=800&h=800&fit=crop`,
    caption: `Just received my new headphones! The sound quality is amazing and they're so comfortable to wear all day. Highly recommend! #audio #tech`,
    product_used: {
      id: `product-${i}`,
      name: `Premium Wireless Headphones`,
      image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400`,
      price: 199.99,
    },
    likes: Math.floor(Math.random() * 5000) + 1000,
    shares: Math.floor(Math.random() * 500) + 100,
    created_at: `${Math.floor(Math.random() * 7) + 1}d ago`,
    location: i % 3 === 0 ? 'New York, NY' : undefined,
    tags: ['tech', 'audio', 'headphones', 'review'],
    is_featured: i === 0,
  }));
};

const fetchBundleDeals = async (limit: number = 3): Promise<BundleDeal[]> => {
  // Mock bundle deals
  return Array.from({ length: limit }, (_, i) => ({
    id: `bundle-${i}`,
    type: 'bundle',
    title: i === 0 ? 'Home Office Essentials Bundle' : i === 1 ? 'Fitness Starter Pack' : 'Beauty & Skincare Set',
    products: Array.from({ length: 6 }, (_, j) => ({
      id: `product-${j}`,
      name: i === 0 ? `Office Item ${j + 1}` : i === 1 ? `Fitness Gear ${j + 1}` : `Beauty Product ${j + 1}`,
      image: `https://images.unsplash.com/photo-${152000 + j}?w=400&h=400`,
      original_price: Math.floor(Math.random() * 100) + 30,
    })),
    bundle_price: i === 0 ? 299.99 : i === 1 ? 199.99 : 159.99,
    savings_percentage: i === 0 ? 35 : i === 1 ? 40 : 30,
    items_count: 6,
    bundle_image: `https://images.unsplash.com/photo-${155000 + i}?w=800&h-600&fit=crop`,
    popularity_score: Math.floor(Math.random() * 30) + 70,
    times_bought: Math.floor(Math.random() * 1000) + 500,
    limited_time: i !== 2,
    expiration_date: i !== 2 ? 'Dec 31, 2024' : undefined,
  }));
};

const fetchARTryOns = async (limit: number = 2): Promise<ARTryOn[]> => {
  // Mock AR try-ons
  return Array.from({ length: limit }, (_, i) => ({
    id: `ar-${i}`,
    type: 'ar_tryon',
    product_id: `product-${i}`,
    product_name: i === 0 ? 'Designer Sunglasses' : 'Living Room Sofa',
    product_image: i === 0 
      ? `https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400`
      : `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400`,
    tryon_type: i === 0 ? 'face' : 'room',
    ar_preview_url: 'https://example.com/ar-preview',
    compatible_with: ['mobile', 'desktop'],
    try_count: Math.floor(Math.random() * 50000) + 10000,
    conversion_rate: Math.floor(Math.random() * 30) + 15,
    rating: 4.2 + Math.random() * 0.8,
    category: i === 0 ? 'Fashion' : 'Home & Living',
  }));
};

const fetchHowToGuides = async (limit: number = 3): Promise<HowToGuide[]> => {
  // Mock how-to guides
  return Array.from({ length: limit }, (_, i) => ({
    id: `guide-${i}`,
    type: 'howto',
    title: i === 0 ? 'How to Set Up Your Home Office' : i === 1 ? 'Beginner\'s Guide to Photography' : 'DIY Home Plant Care',
    thumbnail: `https://images.unsplash.com/photo-${149600 + i}?w=800&h=450&fit=crop`,
    difficulty: i === 0 ? 'beginner' : i === 1 ? 'intermediate' : 'beginner',
    time_required: i === 0 ? '30 min' : i === 1 ? '2 hours' : '1 hour',
    tools_needed: i === 0 ? ['Desk', 'Chair', 'Monitor', 'Keyboard', 'Mouse'] : 
                  i === 1 ? ['Camera', 'Lens', 'Tripod', 'Memory Card'] : 
                  ['Plants', 'Pots', 'Soil', 'Fertilizer', 'Watering Can'],
    steps: Array.from({ length: 5 }, (_, j) => ({
      step: j + 1,
      title: i === 0 ? `Step ${j + 1}: Choose your desk location` : 
             i === 1 ? `Step ${j + 1}: Learn camera basics` : 
             `Step ${j + 1}: Select your plants`,
      image: `https://images.unsplash.com/photo-${150000 + j}?w=400&h=300`,
      description: i === 0 ? `Find a quiet, well-lit area for your desk` : 
                   i === 1 ? `Understand aperture, shutter speed, and ISO` : 
                   `Choose plants that suit your environment`,
      products_used: Array.from({ length: 2 }, (_, k) => ({
        id: `product-${k}`,
        name: i === 0 ? `Office Product ${k + 1}` : i === 1 ? `Camera Gear ${k + 1}` : `Plant ${k + 1}`,
        image: `https://images.unsplash.com/photo-${151000 + k}?w=200&h=200`,
        price: Math.floor(Math.random() * 100) + 20,
      })),
    })),
    final_result_image: `https://images.unsplash.com/photo-${149700 + i}?w=800&h=600&fit=crop`,
    likes: Math.floor(Math.random() * 1000) + 500,
    saves: Math.floor(Math.random() * 500) + 200,
  }));
};

const fetchTrendAlerts = async (limit: number = 3): Promise<TrendAlert[]> => {
  // Mock trend alerts
  return Array.from({ length: limit }, (_, i) => ({
    id: `trend-${i}`,
    type: 'trend_alert',
    trend_name: i === 0 ? 'Smart Home Devices' : i === 1 ? 'Sustainable Fashion' : 'Home Fitness Equipment',
    trend_image: `https://images.unsplash.com/photo-${155100 + i}?w=800&h=400&fit=crop`,
    growth_percentage: i === 0 ? 45 : i === 1 ? 68 : 32,
    time_frame: i === 0 ? '7d' : i === 1 ? '30d' : '24h',
    related_products: Array.from({ length: 5 }, (_, j) => ({
      id: `product-${j}`,
      name: i === 0 ? `Smart Device ${j + 1}` : i === 1 ? `Eco Fashion ${j + 1}` : `Fitness Gear ${j + 1}`,
      image: `https://images.unsplash.com/photo-${152000 + j}?w=400&h=400`,
      price: Math.floor(Math.random() * 200) + 50,
      sales_growth: Math.floor(Math.random() * 100) + 20,
    })),
    influencers_talking: Math.floor(Math.random() * 500) + 100,
    hashtag: i === 0 ? 'SmartHome' : i === 1 ? 'SustainableStyle' : 'HomeWorkout',
    momentum: i === 0 ? 'rising' : i === 1 ? 'peak' : 'declining',
  }));
};

// Combined fetch function
const fetchAllContent = async (): Promise<GridContentItem[]> => {
  try {
    const [
      products, 
      reels, 
      creatorPosts, 
      userReviews, 
      liveStreams, 
      flashOffers, 
      productComparisons, 
      interactivePolls, 
      hashtagChallenges, 
      ugcContent, 
      bundleDeals, 
      arTryOns, 
      howToGuides, 
      trendAlerts
    ] = await Promise.all([
      fetchAllProducts(),
      fetchReels(8),
      fetchCreatorPosts(5),
      fetchUserReviews(4),
      fetchLiveStreams(2),
      fetchFlashOffers(3),
      fetchProductComparisons(3),
      fetchInteractivePolls(3),
      fetchHashtagChallenges(2),
      fetchUGCContent(5),
      fetchBundleDeals(3),
      fetchARTryOns(2),
      fetchHowToGuides(3),
      fetchTrendAlerts(3)
    ]);
    
    // Convert products to have type
    const typedProducts = products.map(p => ({ ...p, type: 'product' as const }));
    
    // Combine all content
    const allContent: GridContentItem[] = [
      ...typedProducts,
      ...reels,
      ...creatorPosts,
      ...userReviews,
      ...liveStreams,
      ...flashOffers,
      ...productComparisons,
      ...interactivePolls,
      ...hashtagChallenges,
      ...ugcContent,
      ...bundleDeals,
      ...arTryOns,
      ...howToGuides,
      ...trendAlerts
    ];
    
    // Define content weights for distribution
    const contentWeights = {
      'product': 0.25,           // 25% products
      'reel': 0.15,             // 15% reels
      'creator_post': 0.10,     // 10% creator posts
      'user_review': 0.08,      // 8% user reviews
      'live_stream': 0.06,      // 6% live streams
      'flash_offer': 0.06,      // 6% flash offers
      'comparison': 0.06,       // 6% comparisons
      'poll': 0.05,             // 5% polls
      'hashtag_challenge': 0.04, // 4% challenges
      'ugc': 0.04,              // 4% UGC
      'bundle': 0.04,           // 4% bundles
      'ar_tryon': 0.03,         // 3% AR try-ons
      'howto': 0.03,            // 3% how-to guides
      'trend_alert': 0.03       // 3% trend alerts
    };
    
    // Categorize content by type
    const contentByType: Record<string, GridContentItem[]> = {};
    allContent.forEach(item => {
      if (!contentByType[item.type]) {
        contentByType[item.type] = [];
      }
      contentByType[item.type].push(item);
    });
    
    // Distribute content according to weights
    const distributedContent: GridContentItem[] = [];
    const targetTotal = 40; // Total items to show initially
    
    Object.entries(contentWeights).forEach(([type, weight]) => {
      const count = Math.floor(targetTotal * weight);
      const items = contentByType[type] || [];
      const selected = items.slice(0, count);
      distributedContent.push(...selected);
    });
    
    // Fill remaining spots with random content
    const remaining = targetTotal - distributedContent.length;
    if (remaining > 0) {
      const allItems = Object.values(contentByType).flat();
      const usedIds = new Set(distributedContent.map(item => item.id));
      const availableItems = allItems.filter(item => !usedIds.has(item.id));
      
      for (let i = 0; i < Math.min(remaining, availableItems.length); i++) {
        distributedContent.push(availableItems[i]);
      }
    }
    
    // Shuffle the distributed content
    return distributedContent.sort(() => Math.random() - 0.5);
    
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
};

// ============================
// INFINITE CONTENT GRID COMPONENT
// ============================

const InfiniteContentGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allContent, setAllContent] = useState<GridContentItem[]>([]);
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
      // Filter content by category
      return initialContent.filter(item => {
        if (item.type === 'product') {
          const product = item as Product;
          return product.category?.toLowerCase() === category.toLowerCase() ||
                 product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase());
        }
        // Other content types are included unless specifically filtered
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

  // Calculate content type distribution
  const contentDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    visibleContent.forEach(item => {
      distribution[item.type] = (distribution[item.type] || 0) + 1;
    });
    return distribution;
  }, [visibleContent]);

  // Show loading state while fetching initial data
  if (initialLoading && allContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="px-2">
          <div className="grid grid-cols-2 gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse aspect-square rounded-xl"></div>
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
      <div className="px-2">
        {/* Content Statistics */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Your Feed Content</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Products</p>
              <p className="text-xl font-bold text-gray-900">
                {contentDistribution['product'] || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Reels</p>
              <p className="text-xl font-bold text-gray-900">
                {contentDistribution['reel'] || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Live</p>
              <p className="text-xl font-bold text-gray-900">
                {(contentDistribution['live_stream'] || 0) + (contentDistribution['flash_offer'] || 0)}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-500">
              Mixed feed with {Object.keys(contentDistribution).length} content types
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-3">
          {visibleContent.map((item) => (
            <div key={`${item.type}-${item.id}`} className="w-full">
              <ContentCardFactory item={item} />
            </div>
          ))}
        </div>

        {/* Load more trigger */}
        <div 
          ref={loaderRef}
          className="flex justify-center items-center py-6"
        >
          {hasMore ? (
            <div className="text-center">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">Loading more amazing content...</p>
            </div>
          ) : visibleContent.length > 0 ? (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">You've seen it all! 🎉</p>
              <p className="text-[10px] text-gray-400 mt-1">Check back soon for fresh content</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ============================
// FAVOURITE CHANNELS (Keep as is)
// ============================

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

// ============================
// POPULAR CATEGORIES (Keep as is)
// ============================

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

// ============================
// FOR YOU CONTENT COMPONENT
// ============================

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const navigate = useNavigate();
  const { setHeaderMode, headerMode } = useHeaderFilter();
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Scroll detection for header mode switching
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

  // Components array
  const components = [
    <div key="hero" ref={heroBannerRef} className="mb-2">
      <HeroBanner showNewsTicker={true} />
    </div>,

    <div key="favourite-channels-wrapper" className="">
      <FavouriteChannels />
    </div>,

    <div key="separator-1" className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-0.5 mb-2"></div>,

    <div key="flash-deals-wrapper" className="mb-2">
      <FlashDeals
        showCountdown={true}
        icon={Tag}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 h-0.5 mb-2"></div>,

    <PopularCategories key="popular-categories" />,

    <div key="separator-3" className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-purple-500 h-0.5 mb-2"></div>,

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

// ============================
// MAIN FOR YOU COMPONENT
// ============================

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