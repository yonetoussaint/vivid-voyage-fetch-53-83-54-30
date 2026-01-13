import React, { useState } from 'react';
import { 
  ShoppingBag, Camera, Plus
} from 'lucide-react';
import InfiniteContentGrid from '@/components/InfiniteContentGrid';

// Seller data
const sellerData = {
  id: "JD12345678",
  name: "John Doe",
  username: "johndoe",
  image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
  verified: true,
  bio: "Living my best life 🌟 | Shop owner 🛍️ | Premium quality products at affordable prices",
  location: "Manila, Philippines",
  website: "https://johndoe.store",
  rating: 4.8,
  total_sales: 89200,
  followers_count: 12800,
  following_count: 342,
  store_age_years: 4
};

// Custom filters
const productsFilter = {
  priceRange: [0, 1000000],
  tags: [],
  searchQuery: '',
  rating: 0,
  userId: 'johndoe'
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default function TikTokProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

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
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 pt-16 pb-4">
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
            </p>
          </div>

          {sellerData.website && (
            <div className="mb-3">
              <a 
                href={sellerData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {sellerData.website.replace(/^https?:\/\//, '')}
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
            <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-bold text-black text-sm">
                {formatNumber(stat.value)}
              </div>
              <div className="text-gray-600 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Follow Button */}
        {!isOwnProfile && (
          <button
            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-colors mb-4 ${
              isFollowing 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* Products Section */}
      <div className="px-4 pb-20">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Product listings from {sellerData.name}
          </p>
        </div>

        {/* Content Grid */}
        <InfiniteContentGrid 
          category="user-products"
          filters={productsFilter}
        />
      </div>

      {/* Floating Action Button */}
      {isOwnProfile && (
        <button
          onClick={() => console.log('Add product clicked')}
          className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}