import React, { useState } from 'react';
import { UserSquare2, Plus, Menu } from 'lucide-react';
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";

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

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default function SellerProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

  // Dummy data for components
  const channelsData = [
    { id: 'all', name: 'All Products', icon: '📱' },
    { id: 'phones', name: 'Phones', icon: '📲' },
    { id: 'laptops', name: 'Laptops', icon: '💻' },
    { id: 'accessories', name: 'Accessories', icon: '🎧' },
    { id: 'gadgets', name: 'Gadgets', icon: '⌚' }
  ];

  const filters = {
    priceRange: [0, 1000000],
    tags: [],
    searchQuery: '',
    rating: 0,
    userId: sellerData.id
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen w-full mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl">@{sellerData.username}</span>
        </div>
        <div className="flex items-center gap-5">
          <Plus size={26} strokeWidth={2.5} className="text-gray-700" />
          <Menu size={26} strokeWidth={2} className="text-gray-700" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4 max-w-md mx-auto">
        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img 
                  src={sellerData.image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Name & Stats */}
          <div className="flex-1">
            {/* Name with badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-semibold text-base">{sellerData.name}</span>
              {sellerData.verified && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6" className="flex-shrink-0">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div>
                <div className="font-semibold text-sm">{formatNumber(sellerData.followers_count)}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{formatNumber(sellerData.following_count)}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{sellerData.store_age_years}</div>
                <div className="text-xs text-gray-500">Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <div className="text-sm mb-2 leading-relaxed text-gray-800">
            {sellerData.bio}
          </div>
          
          {/* Location & Stats Row */}
          <div className="flex items-start justify-between gap-4">
            {/* Location */}
            <div className="flex flex-col gap-0.5 text-sm text-gray-600 flex-1">
              <span>{sellerData.location}</span>
              <span className="text-xs text-gray-500">{sellerData.location}, Philippines</span>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Sales</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(sellerData.total_sales)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Rating</span>
                <span className="text-sm font-semibold text-yellow-500">{sellerData.rating}★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links - Simplified */}
        <div className="flex gap-3 mb-4">
          {['facebook', 'instagram', 'whatsapp', 'twitter'].map((platform, index) => (
            <button
              key={platform}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <span className="text-gray-700 text-sm font-medium">
                {platform.charAt(0).toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isOwnProfile ? (
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors">
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                isFollowing 
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <button className="bg-gray-100 hover:bg-gray-200 py-2.5 px-4 rounded-lg font-semibold text-sm border border-gray-300 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="pb-3 w-full">
        <div className="overflow-x-scroll scrollbar-hide">
          <div className="flex gap-3 pl-4 pr-4">
            {[
              { color: 'from-purple-500 to-pink-500', text: 'New Collection' },
              { color: 'from-blue-500 to-cyan-500', text: 'Limited Offer' },
              { color: 'from-orange-500 to-red-500', text: 'Flash Sale' }
            ].map((banner, i) => (
              <div
                key={i}
                style={{ minWidth: 'calc(100vw - 5rem)' }}
                className={`h-32 rounded-xl bg-gradient-to-r ${banner.color} flex items-center justify-center flex-shrink-0`}
              >
                <span className="font-bold text-lg text-white">{banner.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Components Section - Added after carousel */}
      <div className="max-w-md mx-auto space-y-4 px-4">
        
        {/* Favourite Channels Component */}
        <div className="pt-4">
          <FavouriteChannels 
            channels={channelsData}
            activeChannel={'all'}
            onChannelSelect={(channelId) => console.log('Selected channel:', channelId)}
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-100 h-1"></div>

        {/* Flash Deals Component */}
        <div className="pt-4">
          <FlashDeals
            showCountdown={true}
            showTitleChevron={true}
            category="electronics"
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-100 h-1"></div>

        {/* Infinite Content Grid Component */}
        <div className="pt-4">
          <InfiniteContentGrid 
            category="user-products"
            filters={filters}
          />
        </div>

      </div>
    </div>
  );
}