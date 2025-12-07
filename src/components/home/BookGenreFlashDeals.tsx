import React, { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, User, Search, Camera, ChevronRight, Star, Zap, Clock, Shield, Truck, Award, Home, Tag, Percent, Sparkles } from 'lucide-react';

export default function LazadaClone() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    { name: 'For You', icon: Heart, active: true },
    { name: 'LazMall', icon: ShoppingCart },
    { name: 'Message+', icon: MessageCircle },
    { name: 'Cart', icon: ShoppingCart, badge: 3 },
    { name: 'Me', icon: User }
  ];

  const quickCategories = ['hair clip', 'sunglasses', 'anker soundcore', 'freezer', 'airpods 4', 'fashion', 'electronics', 'home'];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto relative font-sans">
      {/* Enhanced Status Bar */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-2.5 flex justify-between items-center text-white text-xs font-medium shadow-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>7:08 AM</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>22.0 K/S</span>
          </div>
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span className="font-bold">4G</span>
          <div className="flex items-center gap-1">
            <div className="w-10 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="w-8/12 h-full bg-white rounded-full"></div>
            </div>
            <span>86%</span>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar with Gradient */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white shadow-lg text-sm outline-none ring-2 ring-white/50 focus:ring-pink-300 transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                HOT
              </div>
              <button className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <button className="bg-white text-pink-600 px-4 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 active:scale-95 transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Pull to Refresh with Animation */}
      <div 
        className={`bg-gradient-to-b from-white to-gray-50 py-8 text-center transition-all duration-300 ${refreshing ? 'opacity-80' : 'opacity-100'}`}
        onMouseDown={handleRefresh}
      >
        <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center transition-transform ${refreshing ? 'animate-spin' : ''}`}>
          <Heart className={`w-6 h-6 text-white ${refreshing ? 'animate-pulse' : ''}`} />
        </div>
        <p className="text-gray-500 text-sm font-medium">
          {refreshing ? 'Refreshing...' : '↓ Pull down to refresh'}
        </p>
      </div>

      {/* Enhanced Category Pills with Active State */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">Trending Searches</h3>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickCategories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === index 
                ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Banner with Icons */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mx-4 my-3 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Global Brand Selection</p>
              <p className="text-xs text-gray-300 mt-0.5">Official Stores • 100% Authentic</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-green-400" />
            <span className="text-xs">Free Shipping</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs">Fast Delivery</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-xs">Warranty</span>
          </div>
        </div>
      </div>

      {/* Enhanced Icon Menu Grid */}
      <div className="bg-white mx-4 rounded-2xl p-4 shadow-lg mb-3">
        <div className="grid grid-cols-5 gap-4">
          {[
            { icon: '💎', label: 'Coins', color: 'from-yellow-400 to-orange-400', badge: 'Earn' },
            { icon: '👚', label: 'Fashion', color: 'from-pink-400 to-rose-400' },
            { icon: '🏢', label: 'LazLand', color: 'from-green-400 to-emerald-400' },
            { icon: '🔥', label: '12.12', color: 'from-red-500 to-pink-500', badge: 'Hot' },
            { icon: '💄', label: 'Beauty', color: 'from-purple-400 to-pink-400' },
            { icon: '📱', label: 'Channels', color: 'from-blue-400 to-cyan-400' },
            { icon: '🛒', label: 'Super', color: 'from-orange-500 to-red-500', badge: 'Sale' },
            { icon: '✈️', label: 'Overseas', color: 'from-teal-400 to-blue-400' },
            { icon: '🎮', label: 'Games', color: 'from-indigo-400 to-purple-400' },
            { icon: '📺', label: 'Live', color: 'from-red-400 to-orange-400' }
          ].map((item, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-xl">{item.icon}</span>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-3 flex items-center justify-between group hover:from-pink-100 hover:to-orange-100 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Collect Rewards Now!</p>
              <p className="text-xs text-gray-600">Limited time offers • Daily check-ins</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-pink-600">Collect</span>
            <ChevronRight className="w-4 h-4 text-pink-600" />
          </div>
        </button>
      </div>

      {/* New User Exclusive - Enhanced */}
      <div className="bg-white mx-4 rounded-2xl p-4 shadow-lg mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-orange-400 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">
              New User <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Exclusive!</span>
            </h2>
          </div>
          <button className="text-sm font-bold text-pink-600 flex items-center gap-1 hover:text-pink-700 transition-colors">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { price: 'RM7.66', discount: '-66%', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop' },
            { price: 'RM18.99', discount: '-81%', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop' },
            { 
              price: 'RM13.00', 
              subtitle: 'Voucher bundle', 
              button: true,
              gradient: 'from-pink-400 to-orange-300'
            }
          ].map((item, index) => (
            <div key={index} className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${item.button ? 'bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-dashed border-pink-200' : 'bg-white'}`}>
              {item.image && (
                <div className="relative h-32 overflow-hidden">
                  <img src={item.image} alt="Product" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  {item.discount && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      {item.discount}
                    </div>
                  )}
                </div>
              )}
              <div className={`p-3 ${item.button ? 'text-center' : ''}`}>
                {item.button ? (
                  <>
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                      {item.price}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.subtitle}</p>
                    <button className="mt-3 w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-2 rounded-lg font-bold text-sm hover:from-pink-600 hover:to-orange-500 active:scale-95 transition-all">
                      Claim Now
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-gray-900">{item.price}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-gray-500 line-through">RM22.50</div>
                      <div className="text-xs font-bold text-green-600">Save 66%</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories - Enhanced */}
      <div className="bg-white mx-4 rounded-2xl p-4 shadow-lg mb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular for You</h2>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">Personalized</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Two-Way Radio', discount: '-90%', tag: 'Top discount', searches: null, image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=300&h=300&fit=crop' },
            { title: 'Protein Supplements', discount: '-26%', tag: '3K+ searches', searches: '3K+', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop' },
            { title: "Women's Dresses", discount: '-75%', tag: '153K+ searches', searches: '153K+', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=300&fit=crop' },
            { title: 'Washing Machine', discount: '-58%', tag: '4K+ searches', searches: '4K+', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop' }
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative h-40 rounded-xl overflow-hidden mb-2">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 left-2">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.discount}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-bold truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-300" />
                      <span className="text-xs text-green-300 font-medium">{item.tag}</span>
                    </div>
                    {item.searches && (
                      <span className="text-xs text-gray-300">{item.searches}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Product Grid with Masonry Layout */}
      <div className="px-4 mb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-gray-900">Recommended For You</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Percent className="w-4 h-4" />
            <span>Best Prices</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${150000000 + index}?w=400&h=500&fit=crop&auto=format`}
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    COINS
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    FAST & FREE
                  </div>
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                  Premium Wireless Earbuds with Noise Cancellation - 2024 Edition
                </h4>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-gray-800">4.8</span>
                    <span className="text-xs text-gray-500">(2.1k)</span>
                  </div>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">474 sold</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                      RM29.90
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 line-through">RM49.90</span>
                      <span className="text-xs font-bold text-green-600">Save 40%</span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-lg font-bold text-sm hover:from-pink-600 hover:to-orange-500 active:scale-95 transition-all shadow-md">
                    Add +
                  </button>
                </div>

                <div className="text-xs text-gray-600 mt-2">
                  <span className="text-green-600 font-bold">Free shipping</span>
                  <span className="mx-2">•</span>
                  <span>Delivery by tomorrow</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-2xl">
        <div className="flex justify-around py-3 px-2">
          {categories.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center relative group"
            >
              <div className={`relative p-2 rounded-xl transition-all ${item.active 
                ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white' 
                : 'text-gray-400 hover:text-gray-600'
              }`}>
                <item.icon className="w-5 h-5" />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 transition-colors ${item.active 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 font-bold' 
                : 'text-gray-500'
              }`}>
                {item.name}
              </span>
              {item.active && (
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full mt-1"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Login Banner */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto">
        <div className="mx-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Welcome to Lazada!</p>
                <p className="text-xs text-gray-300 mt-0.5">Log in for exclusive first-order benefits</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-pink-600 hover:to-orange-500 active:scale-95 transition-all shadow-lg">
              LOGIN
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-700">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-300">RM100</div>
              <div className="text-[10px] text-gray-400">Welcome Voucher</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-300">Free</div>
              <div className="text-[10px] text-gray-400">Shipping</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-300">50%</div>
              <div className="text-[10px] text-gray-400">Off Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all z-50">
        <ShoppingCart className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          3
        </div>
      </button>
    </div>
  );
}

// Helper component for trending up icon
function TrendingUp({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  );
}