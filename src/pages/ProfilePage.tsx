import React, { useState } from 'react';
import { User, Grid, Bookmark, UserSquare2, ChevronDown, Plus, Settings, Menu, MapPin, MoreHorizontal, Calendar, Link as LinkIcon, CalendarDays } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('posts');
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
    <div className="bg-black text-white min-h-screen w-full mx-auto max-w-[600px]">
      {/* X-style Header - Fixed */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight">{sellerData.name}</span>
            <span className="text-sm text-gray-500">{sellerData.total_sales} sales</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 hover:bg-gray-900 rounded-full cursor-pointer">
            <MoreHorizontal size={20} />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <img 
            src={sellerData.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Profile Picture on Banner */}
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full border-4 border-black bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
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

      {/* Profile Actions - Below Banner */}
      <div className="flex justify-end p-4">
        {isOwnProfile ? (
          <button className="px-4 py-2 border border-gray-600 rounded-full font-semibold text-sm hover:bg-gray-900 transition-colors">
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="p-2 border border-gray-600 rounded-full hover:bg-gray-900">
              <MoreHorizontal size={20} />
            </button>
            <button className="p-2 border border-gray-600 rounded-full hover:bg-gray-900">
              <UserSquare2 size={20} />
            </button>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
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
      <div className="px-4">
        {/* Name and Username */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-xl">{sellerData.name}</span>
            {sellerData.verified && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D9BF0" className="flex-shrink-0">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          <span className="text-gray-500">@{sellerData.username}</span>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-gray-100">
            {sellerData.bio}
          </p>
        </div>

        {/* Info Links */}
        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-500">
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
        <div className="flex gap-4 mb-4">
          <button className="hover:underline">
            <span className="font-bold text-white">{formatNumber(sellerData.following_count)}</span>
            <span className="text-gray-500"> Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold text-white">{formatNumber(sellerData.followers_count)}</span>
            <span className="text-gray-500"> Followers</span>
          </button>
        </div>

        {/* Seller Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-gray-900/50 rounded-xl">
          <div className="text-center">
            <div className="font-bold text-lg text-white">{formatNumber(sellerData.total_sales)}</div>
            <div className="text-xs text-gray-500">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-500">{sellerData.rating}★</div>
            <div className="text-xs text-gray-500">Seller Rating</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">{sellerData.store_age_years}y</div>
            <div className="text-xs text-gray-500">Store Age</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-500">98%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs - X Style */}
      <div className="border-b border-gray-800 sticky top-[53px] bg-black/80 backdrop-blur-md z-40">
        <div className="flex">
          {['Products', 'Reviews', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-4 text-sm font-medium relative ${
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

      {/* Promotional Banners - X Style Cards */}
      <div className="p-4 space-y-3">
        {[
          { 
            color: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
            text: '🔥 New Collection Drop',
            subtext: 'Limited edition items available now'
          },
          { 
            color: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30',
            text: '⚡ Flash Sale Live',
            subtext: '24 hours only - Up to 70% off'
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

      {/* Components Section */}
      <div className="px-4">

        {/* Favourite Channels Component */}
        <div className="pt-2">
          <FavouriteChannels 
            channels={channelsData}
            activeChannel={'all'}
            onChannelSelect={(channelId) => console.log('Selected channel:', channelId)}
            variant="dark"
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-800 h-px my-4"></div>

        {/* Flash Deals Component */}
        <div className="pt-2">
          <FlashDeals
            showCountdown={true}
            showTitleChevron={true}
            category="electronics"
            variant="dark"
          />
        </div>

        {/* Separator */}
        <div className="w-full bg-gray-800 h-px my-4"></div>

        {/* Infinite Content Grid Component */}
        <div className="pt-2">
          <InfiniteContentGrid 
            category="user-products"
            filters={filters}
            variant="dark"
          />
        </div>

      </div>

      {/* Bottom Navigation - X Style */}
      <div className="sticky bottom-0 bg-black border-t border-gray-800 p-3 flex justify-around">
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <Grid size={24} />
        </button>
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <Search size={24} />
        </button>
        <button className="p-2 bg-[#1D9BF0] text-white rounded-full w-12 h-12 flex items-center justify-center">
          <Plus size={24} />
        </button>
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <Bell size={24} />
        </button>
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <Mail size={24} />
        </button>
      </div>
    </div>
  );
}

// Add missing icons
const Search = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.25 3.75a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-8.5 6.5a8.5 8.5 0 1115.176 5.262l4.781 4.781-1.414 1.414-4.781-4.781A8.5 8.5 0 011.75 10.25z"/>
  </svg>
);

const Bell = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.5 16.5v-5.25a7.5 7.5 0 00-15 0v5.25m15 0H4.5m15 0v1.5a3 3 0 01-3 3h-9a3 3 0 01-3-3v-1.5"/>
  </svg>
);

const Mail = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
  </svg>
);