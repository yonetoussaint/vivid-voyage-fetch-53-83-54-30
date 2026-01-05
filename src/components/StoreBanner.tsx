import React from 'react';
import { Star, CheckCircle, Shield, Trophy, Truck } from 'lucide-react';

export default function StoreBanner() {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleFollow = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setIsFollowing(true);
      setShowSuccess(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-2">
      <div className="flex items-center gap-2.5">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 bg-white border border-gray-200 flex items-center justify-center">
            <div className="text-center leading-none">
              <div className="text-blue-700 font-bold text-[10px]">PHILIPS</div>
              <div className="text-blue-600 font-semibold text-[8px] mt-0.5">AVENT</div>
            </div>
          </div>
          {!isFollowing && !showSuccess && (
            <button 
              onClick={handleFollow}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white bg-red-600 hover:bg-red-700 transition-all"
            >
              +
            </button>
          )}
          {showSuccess && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white bg-green-500 animate-ping">
              ✓
            </div>
          )}
          {showSuccess && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white bg-green-500">
              ✓
            </div>
          )}
        </div>

        {/* Store Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              PHILIPS AVENT STORE
            </h1>
            <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-600 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">4.9</span>
            <span className="text-gray-500">(12.5k)</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">285k followers</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex">
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap h-8">
            Visit Store
          </button>
        </div>
      </div>
    </div>
  );
}