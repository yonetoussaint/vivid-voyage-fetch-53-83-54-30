import React, { useState } from 'react';
import { MapPin, CalendarDays, Phone, Mail, Grid, Film, Bookmark, Heart, Settings } from 'lucide-react';

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
  joined_date: "January 2020",
  
  // Stats
  posts: 42,
  followers: 1234,
  following: 567,
  
  // Contact Information
  contacts: {
    phone: "+63 912 345 6789",
    email: "john@doestore.com",
    facebook: "johndoestore",
    instagram: "@johndoe.store",
    whatsapp: "+63 912 345 6789",
    telegram: "@johndoe_store",
    twitter: "@johndoe",
    tiktok: "@johndoe"
  }
};

export default function InstagramProfile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

  const contactMethods = [
    { 
      type: 'whatsapp', 
      label: 'WhatsApp',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
        </svg>
      ),
      action: `https://wa.me/${sellerData.contacts.whatsapp.replace(/\D/g, '')}`,
    },
    { 
      type: 'phone', 
      label: 'Call',
      icon: Phone,
      action: `tel:${sellerData.contacts.phone}`,
    },
    { 
      type: 'email', 
      label: 'Email',
      icon: Mail,
      action: `mailto:${sellerData.contacts.email}`,
    },
    { 
      type: 'facebook', 
      label: 'Facebook',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: `https://facebook.com/${sellerData.contacts.facebook}`,
    },
    { 
      type: 'instagram', 
      label: 'Instagram',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      action: `https://instagram.com/${sellerData.contacts.instagram.replace('@', '')}`,
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen w-full max-w-[600px] mx-auto">
      {/* Banner - Instagram uses subtle gradient, no image */}
      <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200"></div>
      
      {/* Profile Header */}
      <div className="px-4 relative">
        {/* Profile Picture - Instagram style: left aligned, 1/3 overlap */}
        <div className="flex items-start justify-between">
          <div className="relative -mt-12">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img 
                  src={sellerData.image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons - Instagram style */}
          <div className="flex gap-2 mt-2">
            {isOwnProfile ? (
              <>
                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors">
                  Edit profile
                </button>
                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors">
                  Share profile
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Settings size={18} className="text-gray-700" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    isFollowing 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors">
                  Message
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-3">
          {/* Name and Username */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-base text-gray-900">{sellerData.name}</span>
            {sellerData.verified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#3897f0">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">@{sellerData.username}</p>
          
          {/* Bio */}
          <p className="text-sm leading-relaxed text-gray-900 mb-3 max-w-md">
            {sellerData.bio}
          </p>
          
          {/* Location */}
          <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            <span>{sellerData.location}</span>
          </div>
        </div>

        {/* Stats - Instagram style */}
        <div className="flex gap-6 py-3 border-t border-b border-gray-100">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{sellerData.posts}</span>
            <span className="text-xs text-gray-500">posts</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{sellerData.followers}</span>
            <span className="text-xs text-gray-500">followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{sellerData.following}</span>
            <span className="text-xs text-gray-500">following</span>
          </div>
        </div>

        {/* Contact Buttons - Horizontal scroll */}
        <div className="relative py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {contactMethods.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.type}
                  href={contact.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap text-sm text-gray-700"
                >
                  <div className="flex-shrink-0 text-gray-600">
                    {typeof Icon === 'function' ? <Icon /> : <Icon size={16} />}
                  </div>
                  <span className="font-medium">{contact.label}</span>
                </a>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Tabs - Instagram style */}
      <div className="border-t border-gray-200 mt-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 relative ${
              activeTab === 'posts' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Grid size={20} fill={activeTab === 'posts' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium hidden sm:inline">Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 relative ${
              activeTab === 'reels' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Film size={20} fill={activeTab === 'reels' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium hidden sm:inline">Reels</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 relative ${
              activeTab === 'saved' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Bookmark size={20} fill={activeTab === 'saved' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium hidden sm:inline">Saved</span>
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 relative ${
              activeTab === 'tagged' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Heart size={20} fill={activeTab === 'tagged' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium hidden sm:inline">Tagged</span>
          </button>
        </div>
        {/* Active Tab Indicator */}
        <div className="relative h-0.5">
          <div 
            className={`absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-200 ${
              activeTab === 'posts' ? 'left-0 w-1/4' :
              activeTab === 'reels' ? 'left-1/4 w-1/4' :
              activeTab === 'saved' ? 'left-2/4 w-1/4' :
              'left-3/4 w-1/4'
            }`}
          />
        </div>
      </div>

      {/* Content Grid - Instagram style 3-column grid */}
      <div className="p-0.5">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 hover:opacity-95 transition-opacity">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xs">
                  Post {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'reels' && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-sm">No reels yet</p>
          </div>
        )}
        
        {activeTab === 'saved' && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-sm">No saved posts</p>
          </div>
        )}
        
        {activeTab === 'tagged' && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-sm">No tagged posts</p>
          </div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
}