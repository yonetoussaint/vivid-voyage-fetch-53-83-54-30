import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/components/home/SectionHeader";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, LayoutPanelLeft, Sparkles, ChevronRight, DollarSign, 
  Zap, Video, Crown, Play, Users, Image, Heart, MessageCircle, 
  Send, Bookmark, MoreHorizontal, Share2, Eye, Camera,
  Store, Star, User, CheckCircle, ChevronDown
} from "lucide-react";

interface ForYouContentProps {
  category: string;
}

// Filter interfaces
interface PriceFilter {
  min?: number;
  max?: number;
}

interface FilterState {
  price: PriceFilter;
  rating: number | null;
  freeShipping: boolean;
  onSale: boolean;
  freeReturns: boolean;
  newArrivals: boolean;
  shippedFrom: string[];
  sortBy: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating';
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
  shipping?: {
    free_shipping?: boolean;
    returns?: boolean;
    location?: string;
  };
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

// Helper function to check if an object is empty
const isEmptyObject = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return true;
  return Object.keys(obj).length === 0;
};

// Helper function to check if filters are active
const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    (filters.price.min !== undefined || filters.price.max !== undefined) ||
    filters.rating !== null ||
    filters.freeShipping ||
    filters.onSale ||
    filters.freeReturns ||
    filters.newArrivals ||
    filters.shippedFrom.length > 0
  );
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

    // Add shipping information to products for filtering
    const productsWithShipping = products.map(p => ({
      ...p,
      shipping: {
        free_shipping: Math.random() > 0.5,
        returns: Math.random() > 0.7,
        location: Math.random() > 0.5 ? 'United States' : 'International'
      }
    }));

    // Combine all content
    const allContent: ContentItem[] = [
      ...productsWithShipping.map(p => ({ ...p, type: 'product' as const })),
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

// FilterTabs Component
const FilterTabs: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}> = ({ filters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (filter: string) => {
    setActiveDropdown(activeDropdown === filter ? null : filter);
  };

  const handlePriceFilter = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      price: { min, max }
    });
    setActiveDropdown(null);
  };

  const handleRatingFilter = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? null : rating
    });
    setActiveDropdown(null);
  };

  const handleShippingFilter = (location: string) => {
    const updatedLocations = filters.shippedFrom.includes(location)
      ? filters.shippedFrom.filter(l => l !== location)
      : [...filters.shippedFrom, location];
    
    onFilterChange({
      ...filters,
      shippedFrom: updatedLocations
    });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy
    });
    setActiveDropdown(null);
  };

  const toggleCheckboxFilter = (filterKey: keyof FilterState) => {
    onFilterChange({
      ...filters,
      [filterKey]: !filters[filterKey]
    });
  };

  const getPriceLabel = () => {
    if (filters.price.min !== undefined && filters.price.max !== undefined) {
      return `$${filters.price.min} - $${filters.price.max}`;
    }
    if (filters.price.min !== undefined) {
      return `Above $${filters.price.min}`;
    }
    if (filters.price.max !== undefined) {
      return `Under $${filters.price.max}`;
    }
    return "Price";
  };

  const getRatingLabel = () => {
    if (filters.rating) {
      return `${'ôţ'.repeat(filters.rating)} & Up`;
    }
    return "Rating";
  };

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'newest': return 'Newest';
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      case 'rating': return 'Top Rated';
      default: return 'Popular';
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Sort by dropdown */}
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto border-b border-gray-100">
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-transform ${
              activeDropdown === 'sort' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Sort by: {getSortLabel()}
            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'sort' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.sortBy === 'popular' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.sortBy === 'newest' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => handleSortChange('price_low')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.sortBy === 'price_low' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleSortChange('price_high')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.sortBy === 'price_high' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => handleSortChange('rating')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.sortBy === 'rating' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Top Rated
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('filter')}
            className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-transform ${
              activeDropdown === 'filter' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'filter' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'filter' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Filters</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.onSale}
                    onChange={() => toggleCheckboxFilter('onSale')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.freeReturns}
                    onChange={() => toggleCheckboxFilter('freeReturns')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">Free Returns</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.newArrivals}
                    onChange={() => toggleCheckboxFilter('newArrivals')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">New Arrivals</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Free Shipping */}
        <button
          onClick={() => toggleCheckboxFilter('freeShipping')}
          className={`whitespace-nowrap text-sm font-medium ${
            filters.freeShipping ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Free Shipping
          {filters.freeShipping && <span className="ml-1 text-blue-500">✓</span>}
        </button>

        {/* Price */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('price')}
            className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium ${
              activeDropdown === 'price' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {getPriceLabel()}
            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'price' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => handlePriceFilter(undefined, 25)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.price.max === 25 && filters.price.min === undefined ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Under $25
                </button>
                <button
                  onClick={() => handlePriceFilter(25, 50)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.price.min === 25 && filters.price.max === 50 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  $25 - $50
                </button>
                <button
                  onClick={() => handlePriceFilter(50, 100)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.price.min === 50 && filters.price.max === 100 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => handlePriceFilter(100, undefined)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.price.min === 100 && filters.price.max === undefined ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Over $100
                </button>
                <div className="border-t border-gray-200 pt-2 mt-2 px-4">
                  <button
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        price: {}
                      });
                      setActiveDropdown(null);
                    }}
                    className="w-full text-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear Price Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipped From */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('shipped')}
            className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium ${
              activeDropdown === 'shipped' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Shipped From
            {filters.shippedFrom.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center">
                {filters.shippedFrom.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'shipped' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'shipped' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.shippedFrom.includes('United States')}
                    onChange={() => handleShippingFilter('United States')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">United States</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.shippedFrom.includes('International')}
                    onChange={() => handleShippingFilter('International')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">International</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.shippedFrom.includes('Local Pickup')}
                    onChange={() => handleShippingFilter('Local Pickup')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">Local Pickup</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('rating')}
            className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium ${
              activeDropdown === 'rating' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {getRatingLabel()}
            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'rating' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'rating' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => handleRatingFilter(5)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.rating === 5 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <span className="text-yellow-400 mr-2">ôţôţôţôţôţ</span>
                    5 Stars
                  </span>
                </button>
                <button
                  onClick={() => handleRatingFilter(4)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.rating === 4 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <span className="text-yellow-400 mr-2">ôţôţôţôţ</span>
                    4 Stars & Up
                  </span>
                </button>
                <button
                  onClick={() => handleRatingFilter(3)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.rating === 3 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <span className="text-yellow-400 mr-2">ôţôţôţ</span>
                    3 Stars & Up
                  </span>
                </button>
                <button
                  onClick={() => handleRatingFilter(2)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.rating === 2 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <span className="text-yellow-400 mr-2">ôţôţ</span>
                    2 Stars & Up
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters(filters) && (
          <button
            onClick={() => {
              onFilterChange({
                price: {},
                rating: null,
                freeShipping: false,
                onSale: false,
                freeReturns: false,
                newArrivals: false,
                shippedFrom: [],
                sortBy: 'popular'
              });
              setActiveDropdown(null);
            }}
            className="whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 ml-auto"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters(filters) && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {filters.price.min !== undefined && filters.price.max !== undefined && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                Price: ${filters.price.min} - ${filters.price.max}
                <button 
                  onClick={() => onFilterChange({...filters, price: {}})}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.rating !== null && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                Rating: {filters.rating}+ Stars
                <button 
                  onClick={() => onFilterChange({...filters, rating: null})}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.freeShipping && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                Free Shipping
                <button 
                  onClick={() => onFilterChange({...filters, freeShipping: false})}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.shippedFrom.map(location => (
              <span key={location} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                From: {location}
                <button 
                  onClick={() => handleShippingFilter(location)}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
            <span className="text-[10px] text-gray-700 mr-0.5">ˇú</span>
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
            <span>Live now ôţ {formatNumber(reel.views)} watching</span>
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

// Helper function to apply filters
const applyFilters = (items: ContentItem[], filters: FilterState): ContentItem[] => {
  return items.filter(item => {
    if (item.type === 'product') {
      const product = item as Product;
      
      // Price filter
      if (filters.price.min !== undefined && product.price < filters.price.min) return false;
      if (filters.price.max !== undefined && product.price > filters.price.max) return false;
      
      // Rating filter
      if (filters.rating !== null && (product.rating || 0) < filters.rating) return false;
      
      // Free shipping filter
      if (filters.freeShipping && (!product.shipping?.free_shipping)) return false;
      
      // On sale filter
      if (filters.onSale && !product.discount_price) return false;
      
      // Free returns filter
      if (filters.freeReturns && (!product.shipping?.returns)) return false;
      
      // New arrivals filter (within last 7 days)
      if (filters.newArrivals) {
        const createdDate = product.created_at ? new Date(product.created_at) : new Date(0);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (createdDate < sevenDaysAgo) return false;
      }
      
      // Shipped from filter
      if (filters.shippedFrom.length > 0 && product.shipping?.location) {
        if (!filters.shippedFrom.includes(product.shipping.location)) return false;
      }
      
      return true;
    }
    
    // Keep non-product items (reels, posts, vendors) in the feed
    return true;
  });
};

// Helper function to sort content
const sortContent = (items: ContentItem[], sortBy: FilterState['sortBy']): ContentItem[] => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
      
    case 'price_low':
      sorted.sort((a, b) => {
        if (a.type === 'product' && b.type === 'product') {
          return (a as Product).price - (b as Product).price;
        }
        // Keep non-product items in place
        return 0;
      });
      break;
      
    case 'price_high':
      sorted.sort((a, b) => {
        if (a.type === 'product' && b.type === 'product') {
          return (b as Product).price - (a as Product).price;
        }
        // Keep non-product items in place
        return 0;
      });
      break;
      
    case 'rating':
      sorted.sort((a, b) => {
        const ratingA = (a.type === 'product' ? (a as Product).rating || 0 : 0);
        const ratingB = (b.type === 'product' ? (b as Product).rating || 0 : 0);
        return ratingB - ratingA;
      });
      break;
      
    case 'popular':
    default:
      // Keep original shuffled order for popular
      break;
  }
  
  return sorted;
};

// InfiniteContentGrid Component
const InfiniteContentGrid: React.FC<{ 
  category?: string;
  filters: FilterState;
}> = ({ category, filters }) => {
  const [page, setPage] = useState(0);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
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

  // Filter and sort content when filters or initialContent change
  useEffect(() => {
    if (initialContent) {
      // First filter by category
      let categoryFiltered = initialContent;
      if (category && category !== 'recommendations') {
        categoryFiltered = initialContent.filter(item => {
          if (item.type === 'product') {
            const product = item as Product;
            return product.category?.toLowerCase() === category.toLowerCase() ||
                   product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase());
          }
          return true;
        });
      }
      
      // Then apply all filters
      const filtered = applyFilters(categoryFiltered, filters);
      
      // Finally sort the filtered results
      const sorted = sortContent(filtered, filters.sortBy);
      
      setAllContent(sorted);
      setFilteredContent(sorted);
      setHasMore(sorted.length > contentPerPage);
      setPage(0);
    }
  }, [initialContent, category, filters]);

  // Calculate visible content
  const visibleContent = useMemo(() => {
    const startIndex = 0;
    const endIndex = (page + 1) * contentPerPage;
    return filteredContent.slice(startIndex, endIndex);
  }, [filteredContent, page, contentPerPage]);

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
    if (filteredContent.length > 0) {
      const totalLoaded = (page + 1) * contentPerPage;
      const hasMoreContent = totalLoaded < filteredContent.length;
      setHasMore(hasMoreContent);
    }
  }, [filteredContent, page, contentPerPage]);

  // Load more content function
  const loadMoreContent = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      setPage(nextPage);

      const totalLoaded = (nextPage + 1) * contentPerPage;
      if (totalLoaded >= filteredContent.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more content:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, filteredContent, contentPerPage]);

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
  if (!initialLoading && filteredContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="text-center py-8 text-gray-500">
          {hasActiveFilters(filters) ? (
            <>
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">No matching items found</p>
              <p className="text-xs text-gray-500 mb-4">Try adjusting your filters</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </>
          ) : (
            "No content found. Check back soon!"
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* Results count */}
      <div className="px-4 py-2 text-sm text-gray-600">
        Showing {visibleContent.length} of {filteredContent.length} results
      </div>

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
  
  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    price: {},
    rating: null,
    freeShipping: false,
    onSale: false,
    freeReturns: false,
    newArrivals: false,
    shippedFrom: [],
    sortBy: 'popular'
  });

  // Remove scroll detection logic since we don't need header mode switching anymore
  useEffect(() => {
    return () => {
      setHeaderMode('categories');
    };
  }, [setHeaderMode]);

  // Components array with reduced height separators - REMOVED HeroBanner
  const components = [
    // Filter Tabs
    <div key="filter-tabs-wrapper" className="sticky top-0 z-50 bg-white">
      <FilterTabs filters={filters} onFilterChange={setFilters} />
    </div>,

    // Favorite Channels is now the first component after filters
    <div key="favourite-channels-wrapper" className="mb-2 px-4">
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

    <InfiniteContentGrid key="infinite-grid" category={category} filters={filters} />,
  ];

  return (
    <div className="overflow-hidden relative">
      <div className="pb-2 pt-2"> {/* Added pt-2 for top padding since HeroBanner is removed */}
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

const ElectronicsPage: React.FC = () => {
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

export default ElectronicsPage;