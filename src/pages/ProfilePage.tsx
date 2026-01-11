import React, { useState } from 'react';
import { User, Settings, Heart, ShoppingBag, Package, TrendingUp, Eye, Users, MessageCircle, Share2, Plus, Grid3x3, Bookmark, Lock, ChevronRight, Star, DollarSign, Video, PlayCircle, BarChart3, Clock, Award, Shield, Camera, Sparkles } from 'lucide-react';

// Import the InfiniteContentGrid component
import InfiniteContentGrid, { type FilterState } from '@/components/InfiniteContentGrid';

// Import SellerInfoSection components and icons
import {
  Clock as ClockIcon,
  ChevronUp,
  ArrowLeft,
  ChevronDown,
  Store,
  MapPin,
  Calendar,
  Star as StarIcon,
  Facebook,
  Instagram,
  Mail,
  Edit2,
  Share2 as Share2Icon,
  MoreVertical,
  Bell,
  Link2,
  X,
  MessageCircle as MessageCircleIcon,
  Shield as ShieldIcon,
  CheckCircle
} from 'lucide-react';
import HeroBanner from '@/components/home/HeroBanner';
import { getSellerLevel } from '@/utils/sellerLevels';
import VerificationBadge from '@/components/shared/VerificationBadge';
import XIcon from '@/components/icons/social/XIcon';
import TikTokIcon from '@/components/icons/social/TikTokIcon';
import WhatsAppIcon from '@/components/icons/social/WhatsAppIcon';

function TabButton({ active, children, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 font-medium text-xs transition-all relative min-w-0 ${
        active ? 'text-slate-900' : 'text-slate-400'
      }`}
    >
      <div className="flex items-center justify-center space-x-1.5">
        {icon}
        <span className="block truncate">{children}</span>
      </div>
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-slate-900 rounded-full" />
      )}
    </button>
  );
}

// Custom filters for different tabs
const tabFilters = {
  products: {
    priceRange: [0, 1000000],
    tags: [],
    searchQuery: '',
    rating: 0,
    userId: 'johndoe'
  },
  saved: {
    priceRange: [0, 1000000],
    tags: [],
    searchQuery: '',
    rating: 0,
    isSaved: true,
    userId: 'johndoe'
  },
  liked: {
    priceRange: [0, 1000000],
    tags: [],
    searchQuery: '',
    rating: 0,
    isLiked: true,
    userId: 'johndoe'
  }
};

// Tab-specific empty states
const tabEmptyStates = {
  products: {
    icon: ShoppingBag,
    title: "No products yet",
    message: "Add your first product to start selling!",
    actionText: "Add Product"
  },
  saved: {
    icon: Bookmark,
    title: "No saved products",
    message: "Save products to see them here",
    actionText: "Browse Products"
  },
  liked: {
    icon: Heart,
    title: "No liked products",
    message: "Like products to see them here",
    actionText: "Browse Products"
  }
};

// Seller data for the hero section
const sellerData = {
  id: "JD12345678",
  name: "John Doe",
  username: "johndoe",
  image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  verified: true,
  bio: "Living my best life 🌟 | Shop owner 🛍️ | Premium quality products at affordable prices",
  business_type: "E-commerce",
  location: "Manila, Philippines",
  website: "https://johndoe.store",
  rating: 4.8,
  reviews_count: 1289,
  total_sales: 89200,
  join_date: "2020-01-15T00:00:00.000Z",
  followers_count: 12800,
  mentions: ["premium", "quality", "affordable"],
  social_media: {
    whatsapp: "https://wa.me/639123456789",
    facebook: "https://facebook.com/johndoe",
    instagram: "https://instagram.com/johndoe",
    x: "https://x.com/johndoe",
    tiktok: "https://tiktok.com/@johndoe"
  },
  last_active: "Active 2 hours ago",
  business_hours: null,
  followed_by: [],
  store_age_years: 4
};

// Stories ring configuration
const getStoriesRing = () => {
  const storiesCount = 3; // Sample: 3 stories
  if (storiesCount === 0) return null;

  const size = 60;
  const center = size / 2;
  const radius = 26;
  const strokeWidth = 2.5;
  const gapAngle = 8;
  const segmentAngle = (360 / storiesCount) - gapAngle;

  return (
    <svg 
      width={size} 
      height={size} 
      className="absolute -top-0.5 -left-0.5 transform -rotate-90"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    >
      <defs>
        <linearGradient id="storyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCAF45" />
        </linearGradient>
      </defs>
      
      {Array.from({ length: storiesCount }).map((_, index) => {
        const startAngle = index * (segmentAngle + gapAngle);
        const endAngle = startAngle + segmentAngle;
        
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);
        
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;
        
        const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
        
        return (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke="url(#storyGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const formatNumber = (num: number) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

export default function TikTokProfile() {
  const [activeTab, setActiveTab] = useState('products');
  const [showSocialPanel, setShowSocialPanel] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBusinessHours, setShowBusinessHours] = useState(false);
  const [sellerLoading] = useState(false);
  const [sellerStories] = useState(Array(3).fill({})); // Sample stories

  const isOwnProfile = true; // Assuming this is the user's own profile

  const handleEmptyStateAction = () => {
    if (activeTab === 'products') {
      console.log('Add product clicked');
    } else {
      setActiveTab('products');
    }
  };

  const handleBecomeSeller = () => {
    console.log('Become seller clicked');
  };

  const handleBack = () => {
    console.log('Back clicked');
  };

  const handleVerifySeller = () => {
    console.log('Verify seller clicked');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  return (
  <div className="min-h-screen bg-slate-50 max-w-2xl mx-auto">
    {/* Hero Section - Using SellerInfoSection design */}
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Profile Info */}
      <div className="px-4 pt-6 pb-3 relative z-10">
        <div className="flex items-start gap-3 mb-3">
          {/* Small Avatar with Stories Ring */}
          <div className="relative flex-shrink-0">
            <div className="relative p-0.5 rounded-full">
              {/* Stories Ring */}
              {sellerStories.length > 0 && getStoriesRing()}

              <div className="bg-white rounded-full p-0.5">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={sellerData.image_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-start justify-between w-full h-12">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 h-full justify-center">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold truncate">{sellerData.name}</h1>
                {sellerData.verified && (
                  <div className="w-4 h-4">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{sellerData.location || 'Location not set'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-center">
              {isOwnProfile ? (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    title="Message"
                  >
                    <MessageCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${
                      isFollowing 
                        ? 'bg-gray-900 text-white hover:bg-gray-800' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-2">
          <p className="text-gray-900 text-sm leading-relaxed">
            {sellerData.bio}
            {sellerData.mentions && sellerData.mentions.length > 0 && (
              <span className="text-blue-500">
                {' '}{sellerData.mentions.map((m: string) => `@${m}`).join(' ')}
              </span>
            )}
          </p>
        </div>

        {/* Stats - Updated */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="font-bold text-black text-sm">
              {formatNumber(sellerData.followers_count)}
            </div>
            <div className="text-gray-600 text-xs">Followers</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="font-bold text-black text-sm">
              {formatNumber(sellerData.following_count || 0)}
            </div>
            <div className="text-gray-600 text-xs">Following</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="font-bold text-black text-sm">
              {formatNumber(sellerData.total_sales)}
            </div>
            <div className="text-gray-600 text-xs">Orders</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="font-bold text-black text-sm">
              {sellerData.store_age_years}
            </div>
            <div className="text-gray-600 text-xs">Years</div>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!sellerData.verified && isOwnProfile && (
        <div className="mx-4 mb-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <ShieldIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Get verified to build trust</span>
              </div>
              <button
                onClick={handleVerifySeller}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <CheckCircle className="w-3 h-3" />
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Tab Navigation */}
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center px-4">
        <TabButton 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
          icon={<ShoppingBag className="w-4 h-4" />}
        >
          Products
        </TabButton>
        <TabButton 
          active={activeTab === 'saved'} 
          onClick={() => setActiveTab('saved')}
          icon={<Bookmark className="w-4 h-4" />}
        >
          Saved
        </TabButton>
        <TabButton 
          active={activeTab === 'liked'} 
          onClick={() => setActiveTab('liked')}
          icon={<Heart className="w-4 h-4" />}
        >
          Liked
        </TabButton>
      </div>
    </div>

    {/* Tab Header Info */}
    <div className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-900 capitalize">{activeTab}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'products' && "Your product listings"}
            {activeTab === 'saved' && "Products you've saved for later"}
            {activeTab === 'liked' && "Products you've liked"}
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {/* You could add a count here if you track total items */}
        </div>
      </div>
    </div>

    {/* Content Sections - All using InfiniteContentGrid */}
    <div className="pb-20">
      {/* Products Tab */}
      {activeTab === 'products' && (
        <InfiniteContentGrid 
          category="user-products"
          filters={tabFilters.products}
        />
      )}

      {/* Saved Tab */}
      {activeTab === 'saved' && (
        <InfiniteContentGrid 
          category="saved"
          filters={tabFilters.saved}
        />
      )}

      {/* Liked Tab */}
      {activeTab === 'liked' && (
        <InfiniteContentGrid 
          category="liked"
          filters={tabFilters.liked}
        />
      )}
    </div>

    {/* Social Media Panel */}
    {showSocialPanel && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-2xl shadow-lg p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Social Links</h2>
            <button
              onClick={() => setShowSocialPanel(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-6 pb-4">
            <a 
              href={sellerData.social_media.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </a>

            <a 
              href={sellerData.social_media.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Facebook className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Facebook</span>
            </a>

            <a 
              href={sellerData.social_media.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Instagram</span>
            </a>

            <a 
              href={sellerData.social_media.x} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-black hover:text-gray-800 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <XIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">X</span>
            </a>

            <a 
              href={sellerData.social_media.tiktok} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-black hover:text-gray-800 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <TikTokIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">TikTok</span>
            </a>
          </div>

          <button
            onClick={() => setShowSocialPanel(false)}
            className="w-full mt-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )}

    {/* Custom Empty State Component */}
    <EmptyStateHandler 
      activeTab={activeTab}
      onAction={handleEmptyStateAction}
    />

    {/* Floating Action Button */}
    <FloatingActionButton 
      activeTab={activeTab}
      onProductsClick={() => console.log('Add product')}
      onSavedClick={() => setActiveTab('products')}
      onLikedClick={() => setActiveTab('products')}
    />

    {/* Add animation style */}
    <style jsx global>{`
      @keyframes slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `}</style>
  </div>
);
}

// Empty State Handler Component
function EmptyStateHandler({ activeTab, onAction }) {
  // This would need to be connected to actual content state
  const isEmpty = false; // Placeholder

  if (!isEmpty) return null;

  const { icon: Icon, title, message, actionText } = tabEmptyStates[activeTab];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-40">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-pink-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-sm font-medium active:scale-95 transition-transform"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}

// Floating Action Button Component
function FloatingActionButton({ activeTab, onProductsClick, onSavedClick, onLikedClick }) {
  const getButtonConfig = () => {
    switch (activeTab) {
      case 'products':
        return {
          icon: Plus,
          bgColor: 'from-pink-500 to-red-500',
          onClick: onProductsClick,
          tooltip: 'Add Product'
        };
      case 'saved':
        return {
          icon: ShoppingBag,
          bgColor: 'from-blue-500 to-cyan-500',
          onClick: onSavedClick,
          tooltip: 'Browse Products'
        };
      case 'liked':
        return {
          icon: ShoppingBag,
          bgColor: 'from-purple-500 to-pink-500',
          onClick: onLikedClick,
          tooltip: 'Browse Products'
        };
      default:
        return {
          icon: Plus,
          bgColor: 'from-pink-500 to-red-500',
          onClick: () => {},
          tooltip: 'Add'
        };
    }
  };

  const { icon: Icon, bgColor, onClick, tooltip } = getButtonConfig();

  return (
    <>
      <button
        onClick={onClick}
        className={`fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-r ${bgColor} rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50`}
        title={tooltip}
      >
        <Icon className="w-6 h-6 text-white" />
      </button>
    </>
  );
}