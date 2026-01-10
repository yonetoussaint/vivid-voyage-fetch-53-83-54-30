import React, { useState } from 'react';
import { User, Settings, Heart, ShoppingBag, Package, TrendingUp, Eye, Users, MessageCircle, Share2, Plus, Grid3x3, Bookmark, Lock, ChevronRight, Star, DollarSign, Video, PlayCircle, BarChart3, Clock, Award, Shield, Camera, Sparkles } from 'lucide-react';

// Import the InfiniteContentGrid component
import InfiniteContentGrid, { type FilterState } from '@/components/InfiniteContentGrid';

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

// ProductCard component - Keep this for Saved/Liked tabs if you want grid layout
function ProductCard({ product }) {
  const renderTag = (tag: string) => {
    if (tag === "Sale") {
      return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "SuperDeals") {
      return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "Brand+") {
      return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "Certified Original") {
      return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "250%") {
      return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    return null;
  };

  return (
    <div className="bg-white rounded overflow-hidden">
      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-1">
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight min-h-[2.2rem]">
          {product.tags?.map(tag => renderTag(tag))}
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] text-gray-500">{product.soldCount} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            <span className="text-[10px] text-gray-700 mr-0.5">★</span>
            <span className="text-[10px] text-gray-700">{product.rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">₱{parseInt(product.price).toLocaleString('en-US')}</p>
        {product.note && (
          <p className="text-[10px] text-gray-500">{product.note}</p>
        )}
        {product.qualityNote && (
          <p className="text-[10px] text-orange-600">{product.qualityNote}</p>
        )}
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

  // Sample products for saved and liked tabs (you might want to fetch these from API)
  const sampleProducts = [
    {
      id: "1",
      title: "Wireless Bluetooth Headphones Noise Cancel",
      price: "79523",
      soldCount: "234",
      rating: "4.8",
      imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&h=300&auto=format&fit=crop",
      tags: ["Sale", "SuperDeals"],
      description: "Wireless Bluetooth Headphones Noise Cancel",
      note: ""
    },
    {
      id: "2",
      title: "Smart Watch Fitness Tracker Heart Rate",
      price: "67019",
      soldCount: "18081",
      rating: "4.7",
      imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&h=300&auto=format&fit=crop",
      tags: ["Sale"],
      description: "Smart Watch Fitness Tracker Heart Rate",
      note: "Top selling on AliExpress"
    },
    {
      id: "3",
      title: "Sport Smart Watch Fitness Call",
      price: "105730",
      soldCount: "1361",
      rating: "4.6",
      imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=300&h=300&auto=format&fit=crop",
      tags: ["Sale", "SuperDeals"],
      description: "Sport Smart Watch Fitness Call",
      qualityNote: "Premium Quality"
    },
    {
      id: "4",
      title: "30 36 Inch Curly Highlight Wig Human",
      price: "741510",
      soldCount: "637",
      rating: "4.7",
      imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=300&h=300&auto=format&fit=crop",
      tags: ["Brand+", "Sale"],
      description: "30 36 Inch Curly Highlight Wig Human",
      note: "Top selling on AliExpress"
    },
  ];

  const savedProducts = sampleProducts.slice(0, 2);
  const likedProducts = sampleProducts.slice(2, 4);

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
        <div className="pb-20">
          {/* Use InfiniteContentGrid for products tab with infinite scroll */}
          <InfiniteContentGrid 
            category="all" // or specify a category
            filters={{ 
              priceRange: [0, 1000000],
              tags: [],
              searchQuery: '',
              rating: 0
            }}
          />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="p-2 pb-24">
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-slate-900">Saved Products</h2>
              <span className="text-xs text-slate-500">{savedProducts.length} items</span>
            </div>
            <p className="text-xs text-slate-500">Products you've saved for later</p>
          </div>
          
          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {savedProducts.map((product) => (
                <ProductCard key={`saved-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">No saved products</p>
              <p className="text-xs text-gray-500 mb-4">Save products to see them here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="p-2 pb-24">
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-slate-900">Liked Products</h2>
              <span className="text-xs text-slate-500">{likedProducts.length} items</span>
            </div>
            <p className="text-xs text-slate-500">Products you've liked</p>
          </div>
          
          {likedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {likedProducts.map((product) => (
                <ProductCard key={`liked-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">No liked products</p>
              <p className="text-xs text-gray-500 mb-4">Like products to see them here</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Add Product Button (only for products tab) */}
      {activeTab === 'products' && (
        <button className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50">
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Global Styles for consistency */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}