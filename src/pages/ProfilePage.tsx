import React, { useState } from 'react';
import { UserSquare2, MoreHorizontal, MapPin, Link as LinkIcon, CalendarDays } from 'lucide-react';

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
  store_age_years: 4,
  joined_date: "January 2020"
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default function XProfile() {
  const [activeTab, setActiveTab] = useState('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

  return (
    <div className="bg-black text-white min-h-screen w-full max-w-[600px] mx-auto">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <img 
          src={sellerData.banner_url}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture - Reduced size and positioned like X */}
        <div className="absolute -bottom-12 left-4">
          <div className="w-24 h-24 rounded-full border-4 border-black bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-black p-0.5">
              <img 
                src={sellerData.image_url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Follow Button - BELOW BANNER */}
      <div className="flex justify-end px-4 pt-3">
        {isOwnProfile ? (
          <button className="px-4 py-2 border border-gray-600 rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors">
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="p-2 border border-gray-600 rounded-full hover:bg-gray-900">
              <MoreHorizontal size={18} />
            </button>
            <button className="p-2 border border-gray-600 rounded-full hover:bg-gray-900">
              <UserSquare2 size={18} />
            </button>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isFollowing 
                  ? 'border border-gray-600 hover:bg-red-500/10 hover:text-red-500' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-2">
        {/* Name and Username */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-xl">{sellerData.name}</span>
            {sellerData.verified && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1D9BF0">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          <span className="text-gray-500">@{sellerData.username}</span>
        </div>

        {/* Bio */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed text-gray-100">
            {sellerData.bio}
          </p>
        </div>

        {/* Info Links */}
        <div className="flex flex-col gap-1.5 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{sellerData.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon size={16} />
            <a href={sellerData.website} className="text-[#1D9BF0] hover:underline">
              {sellerData.website.replace('https://', '')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>Joined {sellerData.joined_date}</span>
          </div>
        </div>

        {/* Follow Stats */}
        <div className="flex gap-4 mb-3">
          <button className="hover:underline">
            <span className="font-bold">{formatNumber(sellerData.following_count)}</span>
            <span className="text-gray-500"> Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold">{formatNumber(sellerData.followers_count)}</span>
            <span className="text-gray-500"> Followers</span>
          </button>
        </div>

        {/* Seller Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-gray-900/50 rounded-xl">
          <div className="text-center">
            <div className="font-bold text-lg text-white">{formatNumber(sellerData.total_sales)}</div>
            <div className="text-xs text-gray-500">Sales</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-500">{sellerData.rating}★</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">{sellerData.store_age_years}y</div>
            <div className="text-xs text-gray-500">Store Age</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-500">98%</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex px-4">
          {['Products', 'Reviews', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-3 text-sm font-medium relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#1D9BF0] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Promotional Cards */}
      <div className="px-4 py-3 space-y-3">
        {[
          { 
            color: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
            text: '🔥 New Collection',
            subtext: 'Limited edition now available'
          },
          { 
            color: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30',
            text: '⚡ Flash Sale Live',
            subtext: '24h only - Up to 70% off'
          },
          { 
            color: 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30',
            text: '🎯 Limited Offer',
            subtext: 'First 50 customers get free shipping'
          }
        ].map((banner, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl ${banner.color}`}
          >
            <div className="font-bold text-white mb-1">{banner.text}</div>
            <div className="text-sm text-gray-300">{banner.subtext}</div>
          </div>
        ))}
      </div>

      {/* Content Placeholder */}
      <div className="px-4 py-6">
        <div className="text-center text-gray-500">
          <p className="mb-2">Your content will appear here</p>
          <p className="text-sm">Select a tab above to view different content types</p>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}