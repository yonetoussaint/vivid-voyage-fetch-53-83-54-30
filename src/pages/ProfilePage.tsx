import React, { useState } from 'react';
import { User, Grid, Bookmark, UserSquare2, ChevronDown, Plus, Settings, Menu, MapPin } from 'lucide-react';

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

export default function InstagramProfile() {
  const [activeTab, setActiveTab] = useState('posts');
  
  const posts = Array(12).fill(null).map((_, i) => ({
    id: i,
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 100000000}?w=400&h=400&fit=crop`
  }));

  return (
    <div className="bg-black text-white min-h-screen w-full mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black flex items-center justify-between px-4 py-3 border-b border-gray-800 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl">@{sellerData.username}</span>
        </div>
        <div className="flex items-center gap-5">
          <Plus size={26} strokeWidth={2.5} />
          <Menu size={26} strokeWidth={2} />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4 max-w-md mx-auto">
        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-black p-0.5">
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#3897f0" className="flex-shrink-0">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div>
                <div className="font-semibold text-sm">{formatNumber(sellerData.followers_count)}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{formatNumber(sellerData.following_count)}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{sellerData.store_age_years}</div>
                <div className="text-xs text-gray-400">Since</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <div className="text-sm mb-2 leading-relaxed">
            {sellerData.bio}
          </div>
          
          {/* Location & Stats Row */}
          <div className="flex items-start justify-between gap-4">
            {/* Location */}
            <div className="flex flex-col gap-0.5 text-sm text-gray-400 flex-1">
              <span>{sellerData.location}</span>
              <span className="text-xs text-gray-500">{sellerData.location}, Philippines</span>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Products</span>
                <span className="text-sm font-semibold text-white">247</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Rating</span>
                <span className="text-sm font-semibold text-yellow-500">{sellerData.rating}★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mb-4">
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-1.5 px-4 rounded-lg font-semibold text-sm">
            Edit profile
          </button>
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-1.5 px-4 rounded-lg font-semibold text-sm">
            Share profile
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 py-1.5 px-3 rounded-lg">
            <UserSquare2 size={16} />
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

      {/* Featured Products */}
      <div className="pb-4 w-full">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Featured Products</h3>
          <button className="text-xs text-blue-500 font-semibold">View All</button>
        </div>
        <div className="overflow-x-scroll scrollbar-hide">
          <div className="flex gap-2.5 pl-4 pr-4">
            {[
              { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
              { image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
              { image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
              { image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop' },
              { image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop' }
            ].map((product, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-gray-800"
              >
                <img
                  src={product.image}
                  alt={`Product ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex border-t border-gray-800">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex justify-center ${
              activeTab === 'posts' ? 'border-t border-white' : 'text-gray-500'
            }`}
          >
            <Grid size={24} strokeWidth={activeTab === 'posts' ? 2 : 1.5} />
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-3 flex justify-center ${
              activeTab === 'reels' ? 'border-t border-white' : 'text-gray-500'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'reels' ? 2 : 1.5}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18M3 9h18"/>
            </svg>
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`flex-1 py-3 flex justify-center ${
              activeTab === 'tagged' ? 'border-t border-white' : 'text-gray-500'
            }`}
          >
            <UserSquare2 size={24} strokeWidth={activeTab === 'tagged' ? 2 : 1.5} />
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-900">
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}