import React, { useState } from 'react';
import { UserSquare2, MoreHorizontal, MapPin, Link as LinkIcon, CalendarDays, MessageCircle, Phone, Mail, Globe } from 'lucide-react';

// Seller data
const sellerData = {
  id: "JD12345678",
  name: "John Doe",
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
  joined_date: "January 2020",
  
  // Contact Information
  contacts: {
    phone: "+63 912 345 6789",
    email: "john@doestore.com",
    whatsapp: "+63 912 345 6789",
    facebook: "johndoestore",
    instagram: "@johndoe.store",
    telegram: "@johndoe_store"
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default function XProfile() {
  const [activeTab, setActiveTab] = useState('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const isOwnProfile = true;

  const contactMethods = [
    { 
      type: 'phone', 
      label: 'Call', 
      value: sellerData.contacts.phone,
      icon: Phone,
      color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      action: `tel:${sellerData.contacts.phone}`
    },
    { 
      type: 'whatsapp', 
      label: 'WhatsApp', 
      value: 'Tap to chat',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      action: `https://wa.me/${sellerData.contacts.whatsapp.replace(/\D/g, '')}`
    },
    { 
      type: 'email', 
      label: 'Email', 
      value: sellerData.contacts.email,
      icon: Mail,
      color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      action: `mailto:${sellerData.contacts.email}`
    },
    { 
      type: 'facebook', 
      label: 'Facebook', 
      value: sellerData.contacts.facebook,
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      action: `https://facebook.com/${sellerData.contacts.facebook}`
    },
    { 
      type: 'instagram', 
      label: 'Instagram', 
      value: sellerData.contacts.instagram,
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
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
      color: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-pink-200 hover:from-pink-200 hover:to-purple-200',
      action: `https://instagram.com/${sellerData.contacts.instagram.replace('@', '')}`
    },
    { 
      type: 'telegram', 
      label: 'Telegram', 
      value: 'Message me',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.509l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.656-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.941z"/>
        </svg>
      ),
      color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      action: `https://t.me/${sellerData.contacts.telegram.replace('@', '')}`
    },
  ];

  const visibleContacts = showAllContacts ? contactMethods : contactMethods.slice(0, 3);

  return (
    <div className="bg-white text-gray-900 min-h-screen w-full max-w-[600px] mx-auto">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-blue-100 to-purple-100">
        <img 
          src={sellerData.banner_url}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <img 
                src={sellerData.image_url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Follow Button */}
      <div className="flex justify-end px-4 pt-3">
        {isOwnProfile ? (
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors">
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <MoreHorizontal size={18} className="text-gray-700" />
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
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

      {/* Profile Info */}
      <div className="px-4 pt-2">
        {/* Name Only */}
        <div className="mb-3">
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
        <div className="mb-3">
          <p className="text-sm leading-relaxed text-gray-700">
            {sellerData.bio}
          </p>
        </div>

        {/* Info Links */}
        <div className="flex flex-col gap-1.5 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span>{sellerData.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-500" />
            <a href={sellerData.website} className="text-blue-600 hover:underline">
              {sellerData.website.replace('https://', '')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />
            <span>Joined {sellerData.joined_date}</span>
          </div>
        </div>

        {/* Follow Stats */}
        <div className="flex gap-4 mb-3">
          <button className="hover:underline">
            <span className="font-bold text-gray-900">{formatNumber(sellerData.following_count)}</span>
            <span className="text-gray-600"> Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold text-gray-900">{formatNumber(sellerData.followers_count)}</span>
            <span className="text-gray-600"> Followers</span>
          </button>
        </div>

        {/* Seller Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{formatNumber(sellerData.total_sales)}</div>
            <div className="text-xs text-gray-600">Sales</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-600">{sellerData.rating}★</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{sellerData.store_age_years}y</div>
            <div className="text-xs text-gray-600">Store Age</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">98%</div>
            <div className="text-xs text-gray-600">Success</div>
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
              className={`flex-1 py-3 text-sm font-medium relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Section - Mobile Friendly */}
      <div className="px-4 py-4">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Seller</h3>
          
          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 gap-3">
            {visibleContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.type}
                  href={contact.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-[0.98] ${contact.color}`}
                >
                  <div className="flex-shrink-0">
                    {typeof Icon === 'function' ? <Icon /> : <Icon size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{contact.label}</div>
                    <div className="text-xs text-gray-600 truncate">{contact.value}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Show More/Less Toggle */}
          {contactMethods.length > 3 && (
            <button
              onClick={() => setShowAllContacts(!showAllContacts)}
              className="w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAllContacts ? 'Show Less' : `+${contactMethods.length - 3} More Contact Options`}
            </button>
          )}

          {/* Quick Action Buttons Row */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Message
            </button>
            <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Phone size={18} />
              Call Now
            </button>
          </div>

          {/* Contact Hours Note */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <div className="text-xs text-yellow-800">
                <span className="font-medium">Response time:</span> Usually responds within 30 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-6">
        <div className="text-center text-gray-500">
          <p className="mb-2">Seller's products and reviews appear here</p>
          <p className="text-sm">Select a tab above to view different content</p>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}