import React from 'react';
import { ChevronRight, Globe, Trophy, Star, MessageCircle, ThumbsUp, Shield, Truck, Package, CreditCard, Clock, Award, Users, Zap, Heart, CheckCircle } from 'lucide-react';

export default function StoreBanner() {
  const [isFollowing, setIsFollowing] = React.useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-white px-2">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded flex items-center justify-center p-1.5">
              <div className="text-center leading-tight">
                <div className="text-blue-600 font-bold text-xs">PHILIPS</div>
                <div className="text-blue-600 font-semibold text-[10px]">AVENT</div>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              +
            </div>
          </div>

          {/* Store Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <h1 className="text-sm font-bold text-gray-900 leading-tight">
                PHILIPS AVENT STORE
              </h1>
              <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">4.9</span>
              <span className="text-gray-500">(12.5k reviews)</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 truncate">Active 4 hours ago</span>
            </div>
          </div>
        </div>

        {/* Visit Store Button */}
        <div className="flex flex-col gap-1">
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap">
            Visit Store
          </button>
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-3 py-1 rounded text-[11px] font-semibold whitespace-nowrap border transition-colors ${
              isFollowing 
                ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' 
                : 'bg-white border-red-600 text-red-600 hover:bg-red-50'
            }`}
          >
            {isFollowing ? 'Following' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="overflow-x-auto mb-3 -mx-3 px-3">
        <div className="flex items-center gap-2 text-[11px] w-max">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded whitespace-nowrap">
            <Globe className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Oversea Selection Store</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded whitespace-nowrap">
            <Trophy className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Top 1 Seller for Baby Safety</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded whitespace-nowrap">
            <Truck className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Free Shipping</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
            <Shield className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Official Store</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded whitespace-nowrap">
            <Award className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Premium Brand</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded whitespace-nowrap">
            <Zap className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}