import React from 'react';
import { Heart, ShoppingCart, MessageCircle, User, Search, Camera, ChevronRight } from 'lucide-react';

export default function LazadaClone() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto relative">
      {/* Status Bar */}
      <div className="bg-white px-3 py-1.5 flex justify-between items-center text-[10px] text-gray-600">
        <span>7:08 AM</span>
        <div className="flex items-center gap-1.5">
          <span>22.0 K/S</span>
          <span>G</span>
          <span>4G</span>
          <span>86%</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 border-b-2 border-pink-500">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center border-2 border-pink-500 rounded px-2 py-1.5">
            <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">HOT</span>
            <input 
              type="text" 
              placeholder="free item rm 0" 
              className="flex-1 text-xs outline-none"
              readOnly
            />
            <Camera className="w-4 h-4 text-gray-400" />
          </div>
          <button className="bg-pink-500 text-white px-3 py-1.5 rounded font-semibold text-xs">
            Search
          </button>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      <div className="bg-gray-100 py-6 text-center">
        <Heart className="w-10 h-10 text-pink-400 mx-auto mb-1" />
        <p className="text-gray-400 text-xs">Release to refresh</p>
      </div>

      {/* Category Pills */}
      <div className="bg-white px-2 py-1.5 overflow-x-auto whitespace-nowrap border-b">
        <div className="flex gap-1.5">
          {['hair clip', 'sunglasses', 'anker soundcore', 'freezer', 'airpods 4'].map((cat) => (
            <span key={cat} className="inline-block bg-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-700">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Brand Banner */}
      <div className="bg-gray-900 text-white px-3 py-1.5 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <span className="text-gray-900 text-[8px]">✓</span>
          </div>
          <span className="font-semibold">Global Brand Selection</span>
        </div>
        <span className="text-[9px]">Free Shipping · Fast Delivery</span>
        <ChevronRight className="w-3 h-3" />
      </div>

      {/* Icon Menu */}
      <div className="bg-white px-3 py-3">
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <p className="font-semibold text-xs">Earn</p>
              <p className="font-semibold text-xs">Coins</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-0.5">
              <span className="text-white font-bold text-xs">淘</span>
            </div>
            <p className="text-[10px] text-gray-600">Fashion</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-0.5">
              <span className="text-lg">🏢</span>
            </div>
            <p className="text-[10px] text-gray-600">LazLand</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center mx-auto mb-0.5">
              <span className="text-white font-bold text-[10px]">12.12</span>
            </div>
            <p className="text-[10px] text-gray-600">Countdown</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-0.5">
              <span className="text-lg">💄</span>
            </div>
            <p className="text-[10px] text-gray-600">LazBeauty</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-0.5">
              <span className="text-lg">📱</span>
            </div>
            <p className="text-[10px] text-gray-600">Channels</p>
          </div>
        </div>
        
        <div className="flex items-center text-xs">
          <span className="font-semibold">Collect Now!</span>
          <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>

      {/* New User Exclusive */}
      <div className="bg-white px-3 py-3 mt-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-bold">
            <span className="text-pink-500">New</span> User Exclusive!
          </h2>
          <span className="text-[10px] text-gray-600">Exclusive Deals &gt;</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg shadow">
            <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop" alt="Product" className="w-full h-24 object-cover rounded-t-lg" />
            <div className="p-1.5">
              <p className="text-pink-500 font-bold text-sm">RM7.66</p>
              <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded">-66%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop" alt="Camera" className="w-full h-24 object-cover rounded-t-lg" />
            <div className="p-1.5">
              <p className="text-pink-500 font-bold text-sm">RM18.99</p>
              <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded">-81%</span>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg flex flex-col items-center justify-center p-2">
            <p className="text-pink-500 font-bold text-lg mb-1">RM13.00</p>
            <p className="text-pink-400 text-[9px] text-center mb-2">New user voucher bundle</p>
            <button className="bg-pink-500 text-white px-4 py-1 rounded font-semibold text-[10px]">Collect</button>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-white px-3 py-3 mt-2">
        <h2 className="text-sm font-bold mb-2">Popular Categories for you</h2>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="relative">
            <span className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] font-bold px-1 py-0.5 rounded z-10">-90%</span>
            <img src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=150&h=150&fit=crop" alt="Robot" className="w-full h-20 object-cover rounded" />
            <p className="text-[10px] mt-0.5 font-medium truncate">Two-Way Rad...</p>
            <p className="text-[9px] text-pink-500 flex items-center gap-0.5">
              <span>▲</span> Top discount
            </p>
          </div>

          <div className="relative">
            <span className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] font-bold px-1 py-0.5 rounded z-10">-26%</span>
            <img src="https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=150&h=150&fit=crop" alt="Protein" className="w-full h-20 object-cover rounded" />
            <p className="text-[10px] mt-0.5 font-medium truncate">Protein</p>
            <p className="text-[9px] text-gray-500">3K+ search</p>
          </div>

          <div className="relative">
            <span className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] font-bold px-1 py-0.5 rounded z-10">-75%</span>
            <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&h=150&fit=crop" alt="Dress" className="w-full h-20 object-cover rounded" />
            <p className="text-[10px] mt-0.5 font-medium truncate">Women's Dres...</p>
            <p className="text-[9px] text-gray-500">153K+ search</p>
          </div>

          <div className="relative">
            <span className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] font-bold px-1 py-0.5 rounded z-10">-58%</span>
            <img src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=150&h=150&fit=crop" alt="Washing Machine" className="w-full h-20 object-cover rounded" />
            <p className="text-[10px] mt-0.5 font-medium truncate">Washing Mac...</p>
            <p className="text-[9px] text-gray-500">4K+ search</p>
          </div>
        </div>
      </div>

      {/* Product Grid - Masonry Style */}
      <div className="bg-white p-2 mt-2 mb-32">
        <div className="grid grid-cols-2 gap-2">
          {/* Product 1 */}
          <div className="border rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1599810730634-23960b6f8b2e?w=200&h=200&fit=crop" alt="Nuts" className="w-full h-32 object-cover" />
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">Daily Nuts Mixed Nuts Bul...</p>
              <p className="text-pink-500 font-bold text-xs">RM0.10</p>
              <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded inline-block mt-1">New User Deals</span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" alt="Earbuds" className="w-full h-32 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">G11 TWS Wireless Earbuds...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM19.90</p>
              <p className="text-pink-500 font-bold text-xs">RM0.00</p>
              <p className="text-[9px] text-gray-500">⭐ 4.8 (113) 474 sold</p>
            </div>
          </div>

          {/* Product 3 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=250&fit=crop" alt="Sunglasses" className="w-full h-40 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">Beneunder | Oval Cat Eye Sunglasses Womens...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">Voucher saves RM54.70</p>
              <p className="text-pink-500 font-bold text-xs">RM115.83</p>
              <p className="text-[9px] text-gray-500">⭐ 4.9 (255) 30k+ sold*</p>
            </div>
          </div>

          {/* Product 4 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=200&h=200&fit=crop" alt="Kids Clothing" className="w-full h-36 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">MiiOW | Boys Winter Three-layer Cotton Fleece Thi...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">Voucher saves RM18.00</p>
              <p className="text-pink-500 font-bold text-xs">RM123.50</p>
              <p className="text-[9px] text-gray-500">⭐ 4.5 (8) 87 sold*</p>
            </div>
          </div>

          {/* Product 5 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" alt="Monitor" className="w-full h-32 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">[China Plug] RUNING 4K Portable Monitor 15.6"...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">Voucher saves RM863.04</p>
              <p className="text-pink-500 font-bold text-xs">RM863.04</p>
              <p className="text-[9px] text-gray-500">⭐ 4.8 (45) 120+ sold*</p>
            </div>
          </div>

          {/* Product 6 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=250&fit=crop" alt="Headphones" className="w-full h-44 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">M90 Earphone Bluetooth Earbuds Smart...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM15.90</p>
              <p className="text-pink-500 font-bold text-xs">RM29.90</p>
              <p className="text-[9px] text-gray-500">⭐ 4.6 (892) 2.1k sold</p>
            </div>
          </div>

          {/* Product 7 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" alt="Watch" className="w-full h-28 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">Men Ring Punk Silver Gold Black Polished...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM3.18</p>
              <p className="text-pink-500 font-bold text-xs">RM0.00</p>
              <p className="text-[9px] text-gray-500">⭐ 5.0 (21) 181 sold*</p>
            </div>
          </div>

          {/* Product 8 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=200&h=200&fit=crop" alt="Gaming Chair" className="w-full h-36 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">🔥READY STOCK⚡ Ergonomic Adjustable Gaming Chair Offi...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM13.99</p>
              <p className="text-pink-500 font-bold text-xs">RM46.00</p>
              <p className="text-[9px] text-gray-500">⭐ 4.7 (84) 258 sold</p>
            </div>
          </div>

          {/* Product 9 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=250&fit=crop" alt="Sunglasses" className="w-full h-40 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">Fashion Sunglasses Korean Square Glasses Brown Retro S...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM12.50</p>
              <p className="text-pink-500 font-bold text-xs">RM0.00</p>
              <p className="text-[9px] text-gray-500">⭐ 4.9 (1438) 6.4k sold</p>
            </div>
          </div>

          {/* Product 10 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=200&h=200&fit=crop" alt="Camera Lens" className="w-full h-32 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">VILTROX | 35mm Prime Lens with Large A...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">Voucher saves RM78.10</p>
              <p className="text-pink-500 font-bold text-xs">RM485.19</p>
              <p className="text-[9px] text-gray-500">⭐ 4.6 (12) 91 sold*</p>
            </div>
          </div>

          {/* Product 11 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=250&fit=crop" alt="Kitchen Storage" className="w-full h-44 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">Kitchen Storage Organizer Spice Rack Wall Mount...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">New User Save RM8.50</p>
              <p className="text-pink-500 font-bold text-xs">RM25.90</p>
              <p className="text-[9px] text-gray-500">⭐ 4.8 (332) 1.2k sold</p>
            </div>
          </div>

          {/* Product 12 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-teal-400 text-white text-[7px] px-1 py-0.5 rounded z-10">FAST & FREE</span>
              <span className="absolute top-1 right-1 bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded z-10">COINS</span>
              <img src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=200&h=200&fit=crop" alt="Pajamas" className="w-full h-36 object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-2 mb-1">MiiOW | Men Long Sleeve Pajamas Set Winter...</p>
              <p className="text-pink-400 text-[9px] mb-0.5">Voucher saves RM22.00</p>
              <p className="text-pink-500 font-bold text-xs">RM89.00</p>
              <p className="text-[9px] text-gray-500">⭐ 4.7 (156) 523 sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-2 px-2">
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-[10px] text-pink-500 font-semibold mt-0.5">For You</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingCart className="w-5 h-5 text-gray-400" />
          <span className="text-[10px] text-gray-500 mt-0.5">LazMall</span>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-[10px] text-gray-500 mt-0.5">Message+</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingCart className="w-5 h-5 text-gray-400" />
          <span className="text-[10px] text-gray-500 mt-0.5">Cart</span>
        </div>
        <div className="flex flex-col items-center">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-[10px] text-gray-500 mt-0.5">Account</span>
        </div>
      </div>

      {/* Login Banner */}
      <div className="fixed bottom-14 left-0 right-0 max-w-md mx-auto bg-gray-900 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <p className="text-[10px]">Log in for a chance at first-order benefits!</p>
        </div>
        <button className="bg-pink-500 text-white px-4 py-1.5 rounded font-bold text-[10px]">LOGIN NOW</button>
      </div>
    </div>
  );
}