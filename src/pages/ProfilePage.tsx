import React, { useState } from 'react';
import { 
  ShoppingBag, Bookmark, Heart, Camera, Edit2, 
  MessageCircle, Link2, Share2, X, CheckCircle, 
  Shield, ChevronDown, Plus
} from 'lucide-react';
import InfiniteContentGrid from '@/components/InfiniteContentGrid';
import XIcon from '@/components/icons/social/XIcon';
import TikTokIcon from '@/components/icons/social/TikTokIcon';
import WhatsAppIcon from '@/components/icons/social/WhatsAppIcon';
import { Facebook, Instagram } from 'lucide-react';

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

// Seller data
const sellerData = {
  id: "JD12345678",
  name: "John Doe",
  username: "johndoe",
  image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
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
  following_count: 342,
  mentions: ["premium", "quality", "affordable"],
  social_media: {
    whatsapp: "https://wa.me/639123456789",
    facebook: "https://facebook.com/johndoe",
    instagram: "https://instagram.com/johndoe",
    x: "https://x.com/johndoe",
    tiktok: "https://tiktok.com/@johndoe"
  },
  last_active: "Active 2 hours ago",
  store_age_years: 4
};

function TabButton({ active, children, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 font-medium text-sm transition-all relative ${
        active ? 'text-slate-900' : 'text-slate-500'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        {icon}
        <span className={`text-xs ${active ? 'font-semibold' : 'font-normal'}`}>
          {children}
        </span>
      </div>
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-slate-900 rounded-full" />
      )}
    </button>
  );
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default function TikTokProfile() {
  const [activeTab, setActiveTab] = useState('products');
  const [showSocialPanel, setShowSocialPanel] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

  const handleEmptyStateAction = () => {
    if (activeTab === 'products') {
      console.log('Add product clicked');
    } else {
      setActiveTab('products');
    }
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleEditBanner = () => {
    console.log('Edit banner clicked');
  };

  const handleVerifySeller = () => {
    console.log('Verify seller clicked');
  };

  return (
    <div className="min-h-screen bg-white max-w-full mx-auto overflow-x-hidden">
      {/* Banner Section */}
      <div className="relative h-32 md:h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        {sellerData.banner_url && (
          <img 
            src={sellerData.banner_url} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        )}

        {isOwnProfile && (
          <button
            onClick={handleEditBanner}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors z-20"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}

        {/* Profile Picture */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2 z-10">
          <div className="relative">
            <div className="bg-white rounded-full p-1">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={sellerData.image_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>

            {isOwnProfile && (
              <button
                onClick={handleEditProfile}
                className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg transition-colors z-20"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 pt-16 pb-4">
        {/* Action Buttons */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
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

        {/* User Info */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-xl font-bold">{sellerData.name}</h1>
            {sellerData.verified && (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <div className="text-gray-600 text-sm mb-2">
            @{sellerData.username}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{sellerData.location}</span>
          </div>

          <div className="mb-3">
            <p className="text-gray-800 text-sm leading-relaxed">
              {sellerData.bio}
              {sellerData.mentions && sellerData.mentions.length > 0 && (
                <span className="text-blue-500">
                  {' '}{sellerData.mentions.map((m: string) => `@${m}`).join(' ')}
                </span>
              )}
            </p>
          </div>

          {sellerData.website && (
            <div className="mb-3">
              <a 
                href={sellerData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Link2 className="w-4 h-4" />
                <span className="truncate">{sellerData.website.replace(/^https?:\/\//, '')}</span>
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Followers', value: sellerData.followers_count },
            { label: 'Following', value: sellerData.following_count },
            { label: 'Orders', value: sellerData.total_sales },
            { label: 'Years', value: sellerData.store_age_years }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
              <div className="font-bold text-black text-sm">
                {formatNumber(stat.value)}
              </div>
              <div className="text-gray-600 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 mb-4">
          {(sellerData.social_media.whatsapp || sellerData.social_media.instagram || sellerData.social_media.facebook) && (
            <button
              onClick={() => setShowSocialPanel(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              <span>Social Links</span>
            </button>
          )}
        </div>

        {/* Verification Banner */}
        {!sellerData.verified && isOwnProfile && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-t border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center px-4">
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
            icon={<ShoppingBag className="w-5 h-5" />}
          >
            Products
          </TabButton>
          <TabButton 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')}
            icon={<Bookmark className="w-5 h-5" />}
          >
            Saved
          </TabButton>
          <TabButton 
            active={activeTab === 'liked'} 
            onClick={() => setActiveTab('liked')}
            icon={<Heart className="w-5 h-5" />}
          >
            Liked
          </TabButton>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-20">
        <div className="px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900 capitalize">{activeTab}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'products' && "Your product listings"}
            {activeTab === 'saved' && "Products you've saved for later"}
            {activeTab === 'liked' && "Products you've liked"}
          </p>
        </div>

        {/* Content Grid */}
        {activeTab === 'products' && (
          <InfiniteContentGrid 
            category="user-products"
            filters={tabFilters.products}
          />
        )}

        {activeTab === 'saved' && (
          <InfiniteContentGrid 
            category="saved"
            filters={tabFilters.saved}
          />
        )}

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

            <div className="flex flex-wrap justify-center gap-4 pb-4">
              {Object.entries(sellerData.social_media).map(([platform, url]) => {
                if (!url) return null;
                
                const platformConfig = {
                  whatsapp: { icon: WhatsAppIcon, color: 'text-green-600', bg: 'bg-green-100', label: 'WhatsApp' },
                  facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Facebook' },
                  instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Instagram' },
                  x: { icon: XIcon, color: 'text-black', bg: 'bg-gray-100', label: 'X' },
                  tiktok: { icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100', label: 'TikTok' }
                };

                const config = platformConfig[platform];
                if (!config) return null;

                const IconComponent = config.icon;

                return (
                  <a 
                    key={platform}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-12 h-12 ${config.bg} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <span className="text-xs font-medium">{config.label}</span>
                  </a>
                );
              })}
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

      {/* Floating Action Button */}
      <FloatingActionButton 
        activeTab={activeTab}
        onProductsClick={() => console.log('Add product')}
        onSavedClick={() => setActiveTab('products')}
        onLikedClick={() => setActiveTab('products')}
      />

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

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

  const { icon: Icon, bgColor, onClick } = getButtonConfig();

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-r ${bgColor} rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50`}
    >
      <Icon className="w-6 h-6 text-white" />
    </button>
  );
}