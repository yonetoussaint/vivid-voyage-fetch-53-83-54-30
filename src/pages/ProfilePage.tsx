import React, { useState } from 'react';
import { User, Settings, Heart, ShoppingBag, Package, TrendingUp, Eye, Users, MessageCircle, Share2, Plus, Grid3x3, Bookmark, Lock, ChevronRight, Star, DollarSign, Video, PlayCircle, BarChart3, Clock, Award, Shield, Camera } from 'lucide-react';

function TabButton({ active, children, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 font-medium text-xs transition-all relative min-w-0 ${
        active ? 'text-slate-900' : 'text-slate-400'
      }`}
    >
      <div className="flex items-center justify-center space-x-1.5">
        {icon}
        <span className="block truncate">{children}</span>
      </div>
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-slate-900 rounded-full" />
      )}
    </button>
  );
}

function ProductCard({ image, title, price, sales }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative">
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-slate-600 flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>{sales}</span>
        </div>
      </div>
      <div className="p-2.5">
        <div className="text-xs text-slate-700 mb-1 line-clamp-2 leading-relaxed">{title}</div>
        <div className="text-base font-bold text-slate-900">{price}</div>
      </div>
    </div>
  );
}

function MenuItem({ icon, title, badge, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3.5 active:bg-slate-50 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-900 font-medium text-sm">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
        {badge && (
          <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
            {badge}
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}

export default function TikTokProfile() {
  const [activeTab, setActiveTab] = useState('products');

  const products = [
    { title: 'Wireless Earbuds Pro Max', price: '$89.99', sales: '2.4K' },
    { title: 'Smart Watch Series 5', price: '$199.99', sales: '1.8K' },
    { title: 'Phone Case Premium', price: '$24.99', sales: '5.2K' },
    { title: 'USB-C Fast Charger', price: '$34.99', sales: '3.1K' },
    { title: 'Bluetooth Speaker Mini', price: '$45.99', sales: '1.5K' },
    { title: 'Screen Protector Glass', price: '$12.99', sales: '4.7K' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white px-4 pt-6 pb-3 border-b border-slate-200">
        <div className="flex flex-col items-center text-center mb-3">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-slate-700">
                JD
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 border-2 border-white">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-center space-x-1.5 mb-1">
              <h1 className="text-lg font-bold text-slate-900">@johndoe</h1>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                PRO
              </div>
            </div>
            <p className="text-slate-600 text-sm">Living my best life 🌟 | Shop owner 🛍️</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-3">
            <div className="flex flex-col items-center">
              <div className="font-bold text-lg text-slate-900">248</div>
              <div className="text-slate-500 text-xs mt-0.5">Following</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-lg text-slate-900">12.8K</div>
              <div className="text-slate-500 text-xs mt-0.5">Followers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-lg text-slate-900">89.2K</div>
              <div className="text-slate-500 text-xs mt-0.5">Likes</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium active:bg-slate-800">
            Edit profile
          </button>
          <button className="px-4 py-2 bg-slate-100 rounded-lg active:bg-slate-200">
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center px-4">
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            Products
          </TabButton>
          <TabButton 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')}
            icon={<Bookmark className="w-4 h-4" />}
          >
            Saved
          </TabButton>
          <TabButton 
            active={activeTab === 'liked'} 
            onClick={() => setActiveTab('liked')}
            icon={<Heart className="w-4 h-4" />}
          >
            Liked
          </TabButton>
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === 'products' && (
        <div className="p-3 pb-24">
          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="p-3 pb-24">
          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Heart className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">No liked videos yet</p>
        </div>
      )}

      {/* Floating Add Product Button */}
      {activeTab === 'products' && (
        <button className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50">
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}