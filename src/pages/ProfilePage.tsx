import React, { useState } from 'react';
import { UserSquare2, ChevronDown, MoreHorizontal, MapPin, Link as LinkIcon, CalendarDays } from 'lucide-react';
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
    <div className="bg-black text-white min-h-screen w-full max-w-[600px] mx-auto">
      {/* Ultra Low Banner */}
      <div className="relative h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <img 
          src={sellerData.banner_url}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture Positioned Lower */}
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

      {/* Profile Actions - Compact */}
      <div className="flex justify-end px-4 pt-12">
        {isOwnProfile ? (
          <button className="px-4 py-1.5 border border-gray-600 rounded-full text-sm hover:bg-gray-900 transition-colors">
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="p-1.5 border border-gray-600 rounded-full hover:bg-gray-900">
              <MoreHorizontal size={16} />
            </button>
            <button className="p-1.5 border border-gray-600 rounded-full hover:bg-gray-900">
              <UserSquare2 size={16} />
            </button>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-1.5 rounded-full text-sm ${
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

      {/* Profile Info - Compact */}
      <div className="px-4 pt-2">
        {/* Name and Username */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-lg">{sellerData.name}</span>
            {sellerData.verified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1D9BF0">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-500">@{sellerData.username}</span>
        </div>

        {/* Bio */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed text-gray-100">
            {sellerData.bio}
          </p>
        </div>

        {/* Info Links - Compact */}
        <div className="flex flex-col gap-1 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{sellerData.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon size={14} />
            <a href={sellerData.website} className="text-[#1D9BF0] hover:underline">
              {sellerData.website.replace('https://', '')}
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            <span>Joined {sellerData.joined_date}</span>
          </div>
        </div>

        {/* Follow Stats - Compact */}
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

        {/* Seller Stats - Compact Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-2 bg-gray-900/50 rounded-lg">
          <div className="text-center">
            <div className="font-bold text-base">{formatNumber(sellerData.total_sales)}</div>
            <div className="text-xs text-gray-500">Sales</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-base text-yellow-500">{sellerData.rating}★</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-base">{sellerData.store_age_years}y</div>
            <div className="text-xs text-gray-500">Store Age</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-base text-green-500">98%</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        </div>
      </div>

      {/* Tabs - Compact */}
      <div className="border-b border-gray-800">
        <div className="flex px-4">
          {['Products', 'Reviews', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-3 text-sm relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#1D9BF0] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Promotional Cards - Ultra Compact */}
      <div className="px-4 py-3 space-y-2">
        {[
          { 
            color: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
            text: '🔥 New Collection',
            subtext: 'Limited edition now'
          },
          { 
            color: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30',
            text: '⚡ Flash Sale',
            subtext: '24h only - 70% off'
          },
          { 
            color: 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30',
            text: '🎯 Limited Offer',
            subtext: 'Free shipping first 50'
          }
        ].map((banner, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${banner.color}`}
          >
            <div className="font-bold text-sm text-white mb-0.5">{banner.text}</div>
            <div className="text-xs text-gray-300">{banner.subtext}</div>
          </div>
        ))}
      </div>

      {/* Components Section */}
      <div className="px-4">

        {/* Favourite Channels Component */}
        <div className="pt-1">
          <FavouriteChannels 
            channels={channelsData}
            activeChannel={'all'}
            onChannelSelect={(channelId) => console.log('Selected channel:', channelId)}
            variant="dark"
            compact={true}
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-800 h-px my-3"></div>

        {/* Flash Deals Component */}
        <div className="pt-1">
          <FlashDeals
            showCountdown={true}
            showTitleChevron={true}
            category="electronics"
            variant="dark"
            compact={true}
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-800 h-px my-3"></div>

        {/* Infinite Content Grid Component */}
        <div className="pt-1">
          <InfiniteContentGrid 
            category="user-products"
            filters={filters}
            variant="dark"
            compact={true}
          />
        </div>

      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}