import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Star, User } from 'lucide-react';

  export function IPhoneXRListing() {
  const [liveViews, setLiveViews] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViews(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newViews = Math.max(820, Math.min(1200, prev + change));
        return newViews;
      });
    }, 3000 + Math.random() * 2000); // 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-sm mx-auto p-3 bg-white">
      {/* Header with live views */}
      <div className="flex items-center mb-2">
        <div className="flex-1 overflow-hidden">
          <h1 className="text-lg font-medium text-gray-900 whitespace-nowrap overflow-x-auto scrollbar-hide">
            Apple iPhone XR 64GB Unlocked - Black - Fully Restored with New Battery and Screen
          </h1>
        </div>
        <div className="w-px h-5 bg-gray-300 mr-3"></div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span>{liveViews.toLocaleString()} viewing</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        Experience the perfect balance of performance and design with iPhone XR. Features an edge-to-edge 6.1-inch Liquid Retina display, powerful A12 Bionic processor, and all-day battery life for seamless use.</p>



      {/* Rating section */}
      <div className="flex items-center justify-between mb-4 py-2 border-y border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <Star className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-sm text-gray-600 ml-1">(4.8)</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>0 reviews</span>
          <span className="text-gray-300">|</span>
          <span>0 sold</span>
        </div>
      </div>



      {/* Stock and activity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-800 font-medium">In Stock</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-medium">Low</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-semibold text-gray-900">25</span>
            <span className="text-gray-400 text-sm ml-1">left</span>
          </div>
        </div>
        
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-orange-400 rounded-full"></div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last sold</span>
            <span className="text-orange-600">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}