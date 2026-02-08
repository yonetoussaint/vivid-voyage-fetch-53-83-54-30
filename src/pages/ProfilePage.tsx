import React, { useState } from 'react';
import { UserSquare2, MoreHorizontal, MapPin, CalendarDays, Phone, Mail } from 'lucide-react';

// Seller data
const sellerData = {
  id: "JD12345678",
  name: "John Doe",
  image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
  verified: true,
  bio: "Living my best life 🌟 | Shop owner 🛍️ | Premium quality products at affordable prices",
  location: "Manila, Philippines",
  joined_date: "January 2020",
  is_online: false,
  last_seen_hours: 3,
  
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

export default function XProfile() {
  const [activeTab, setActiveTab] = useState('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true;

  const contactMethods = [
    { 
      type: 'whatsapp', 
      label: 'WhatsApp',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
        </svg>
      ),
      action: `https://wa.me/${sellerData.contacts.whatsapp.replace(/\D/g, '')}`,
      color: 'bg-green-100 hover:bg-green-200 text-green-700'
    },
    { 
      type: 'phone', 
      label: 'Call',
      icon: Phone,
      action: `tel:${sellerData.contacts.phone}`,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    { 
      type: 'email', 
      label: 'Email',
      icon: Mail,
      action: `mailto:${sellerData.contacts.email}`,
      color: 'bg-red-100 hover:bg-red-200 text-red-700'
    },
    { 
      type: 'facebook', 
      label: 'Facebook',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: `https://facebook.com/${sellerData.contacts.facebook}`,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    { 
      type: 'instagram', 
      label: 'Instagram',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
          <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fd5949" />
              <stop offset="45%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      action: `https://instagram.com/${sellerData.contacts.instagram.replace('@', '')}`,
      color: 'bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-purple-700'
    },
    { 
      type: 'telegram', 
      label: 'Telegram',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.509l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.656-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.941z"/>
        </svg>
      ),
      action: `https://t.me/${sellerData.contacts.telegram.replace('@', '')}`,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    { 
      type: 'twitter', 
      label: 'Twitter',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      action: `https://twitter.com/${sellerData.contacts.twitter.replace('@', '')}`,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    { 
      type: 'tiktok', 
      label: 'TikTok',
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
          <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-3.77-1.905"/>
        </svg>
      ),
      action: `https://tiktok.com/@${sellerData.contacts.tiktok.replace('@', '')}`,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen w-full max-w-[600px] mx-auto">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-blue-100 to-purple-100">
        <img 
          src={sellerData.banner_url}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture with Status Indicator */}
        <div className="absolute -bottom-12 left-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img 
                  src={sellerData.image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            
            {/* Simple Green Dot for Online - Positioned exactly like Facebook */}
            {sellerData.is_online && (
              <div className="absolute bottom-1 right-1">
                <div className="w-4 h-4 bg-green-500 rounded-full border-[3px] border-white"></div>
              </div>
            )}
            
            {/* Time Indicator for Offline - Appears on hover */}
            {!sellerData.is_online && sellerData.last_seen_hours && (
              <div className="absolute bottom-1 right-1 group">
                <div className="w-4 h-4 bg-gray-300 rounded-full border-[3px] border-white"></div>
                <div className="absolute -bottom-6 -right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {sellerData.last_seen_hours}h ago
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center px-4 pt-3">
        {/* Right side buttons */}
        <div className="flex gap-2">
          {/* Custom Share Icon from Noun Project */}
          <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 64 64"
              fill="currentColor"
              className="text-gray-700"
            >
              <path d="M34,21.54V8.64a.18.18,0,0,1,.3-.14L60.94,30.69a.18.18,0,0,1,0,.28L34.3,53.15A.18.18,0,0,1,34,53V40.86a1.14,1.14,0,0,0-.94-1.12c-3.57-.64-16.75-1.59-29.47,15.7a.26.26,0,0,1-.47-.12C2.7,50.31,1.67,21.54,34,21.54"/>
            </svg>
          </button>
          
          {isOwnProfile ? (
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors">
              Edit profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50">
                <MoreHorizontal size={18} className="text-gray-700" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50">
                <UserSquare2 size={18} className="text-gray-700" />
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isFollowing 
                    ? 'border border-gray-300 hover:bg-gray-50 text-gray-900' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-2 pt-2">
        {/* Name */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl text-gray-900">{sellerData.name}</span>
            {sellerData.verified && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1D9BF0">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-2">
          <p className="text-sm leading-relaxed text-gray-700">
            {sellerData.bio}
          </p>
        </div>

        {/* Info Links */}
        <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-500" />
            <span>{sellerData.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={14} className="text-gray-500" />
            <span>Joined {sellerData.joined_date}</span>
          </div>
        </div>

        {/* Horizontally Scrollable Contact Section - Reduced Height */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-900">Contact Seller</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <div className="relative">
            {/* Horizontal Scrollable Container - Smaller Height */}
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
              {contactMethods.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.type}
                    href={contact.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all active:scale-95 whitespace-nowrap ${contact.color}`}
                  >
                    <div className="flex-shrink-0">
                      {typeof Icon === 'function' ? <Icon /> : <Icon size={16} />}
                    </div>
                    <span className="text-xs font-medium">{contact.label}</span>
                  </a>
                );
              })}
            </div>
            
            {/* Fade Gradient Overlay for Scroll Hint */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex px-4">
          {['Products', 'Reviews', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2.5 text-sm font-medium relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-6">
        <div className="text-center text-gray-500 text-sm">
          <p>Seller's products and reviews appear here</p>
          <p className="text-xs mt-1">Select a tab above to view different content</p>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
}