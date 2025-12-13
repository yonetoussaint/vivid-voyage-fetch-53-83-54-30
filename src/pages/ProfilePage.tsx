import React from 'react';
import { User, ChevronRight, ShoppingBag, Heart, MessageCircle, MapPin, Headphones, FileText, Gift, DollarSign, Award, Bell, Settings, Star, Clock, Package, Truck, Shield, Search, Users, HelpCircle, Share2, TrendingUp, Zap, Crown, Target, Calendar, Send, Copy, ExternalLink } from 'lucide-react';

function MenuItem({ icon, title, badge }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-slate-800">{title}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            {badge}
          </div>
        )}
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
}

export default function AliExpressBuyerProfile() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Profile Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <div className="text-base font-semibold text-slate-800">John Doe</div>
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  GOLD
                </div>
              </div>
              <div className="text-xs text-slate-500">ID: 8762****231</div>
            </div>
          </div>
        </div>
        
        {/* Compact Profile Stats */}
        <div className="grid grid-cols-4 border-t border-slate-100 px-2 py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">248</div>
            <div className="text-xs text-slate-500 mt-0.5">Orders</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-bold text-slate-800">42</div>
            <div className="text-xs text-slate-500 mt-0.5">Wishlist</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-bold text-teal-600">$12</div>
            <div className="text-xs text-slate-500 mt-0.5">Savings</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-bold text-purple-600">18</div>
            <div className="text-xs text-slate-500 mt-0.5">Coupons</div>
          </div>
        </div>
      </div>

      {/* Spin the Wheel Daily Rewards */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 px-5 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">Daily Lucky Spin</span>
            </div>
            <p className="text-white text-sm opacity-90 mb-3">Spin to win coins, coupons & more!</p>
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-semibold">2 spins left today</span>
              </div>
            </div>
          </div>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold shadow-lg">
            SPIN
          </button>
        </div>
      </div>

      {/* Order Status Section */}
      <div className="bg-white px-5 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">My Orders</h2>
          <button className="text-sm text-slate-500 flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center relative mb-2">
              <Package className="w-6 h-6 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">5</div>
            </div>
            <span className="text-xs text-slate-600 text-center">To Ship</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center relative mb-2">
              <Truck className="w-6 h-6 text-purple-500" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">2</div>
            </div>
            <span className="text-xs text-slate-600 text-center">To Receive</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs text-slate-600 text-center">To Review</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-slate-500" />
            </div>
            <span className="text-xs text-slate-600 text-center">Refund</span>
          </div>
        </div>
      </div>

      {/* Share & Earn Referral */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="font-semibold text-slate-800 mb-1">Share & Earn</div>
            <div className="text-xs text-slate-500 mb-1">Invite friends and get $10 for each signup</div>
            <div className="text-sm text-teal-600 font-semibold">Earned: $127.50</div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-slate-700" />
            </button>
            <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Shopping Activity Group */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Shopping Activity</h3>
        </div>
        <MenuItem icon={<Award className="w-5 h-5 text-slate-600" />} title="Achievements" badge="5" />
        <MenuItem icon={<Heart className="w-5 h-5 text-slate-600" />} title="Favorite Sellers" badge="4" />
        <MenuItem icon={<Users className="w-5 h-5 text-slate-600" />} title="Following" badge="3" />
        <MenuItem icon={<HelpCircle className="w-5 h-5 text-slate-600" />} title="My Q&A Activity" />
        <MenuItem icon={<TrendingUp className="w-5 h-5 text-slate-600" />} title="Recommended for You" />
        <MenuItem icon={<Search className="w-5 h-5 text-slate-600" />} title="Recent Searches" />
      </div>

      {/* Membership Card */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 px-5 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              <div className="text-sm opacity-90 mb-1">Membership Level</div>
              <div className="text-2xl font-bold">Gold Member</div>
            </div>
            <Award className="w-12 h-12 text-white opacity-90" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="text-3xl font-bold">2,845</div>
              <div className="text-sm opacity-90">Points Balance</div>
            </div>
            <button className="bg-white text-orange-600 px-5 py-2 rounded-full font-semibold text-sm">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* My Services Group */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Services</h3>
        </div>
        <MenuItem icon={<Heart className="w-5 h-5 text-slate-600" />} title="Wish List" />
        <MenuItem icon={<MessageCircle className="w-5 h-5 text-slate-600" />} title="Messages" badge="3" />
        <MenuItem icon={<MapPin className="w-5 h-5 text-slate-600" />} title="Address" />
        <MenuItem icon={<Headphones className="w-5 h-5 text-slate-600" />} title="Support" />
        <MenuItem icon={<Gift className="w-5 h-5 text-slate-600" />} title="Coupons" badge="5" />
        <MenuItem icon={<DollarSign className="w-5 h-5 text-slate-600" />} title="Wallet" />
        <MenuItem icon={<Award className="w-5 h-5 text-slate-600" />} title="Points" />
        <MenuItem icon={<Shield className="w-5 h-5 text-slate-600" />} title="Protection" />
      </div>

      {/* Account Group */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account</h3>
        </div>
        <MenuItem icon={<FileText className="w-5 h-5 text-slate-600" />} title="My Reviews" />
        <MenuItem icon={<Heart className="w-5 h-5 text-slate-600" />} title="Followed Stores" badge="12" />
        <MenuItem icon={<Gift className="w-5 h-5 text-slate-600" />} title="Invites & Rewards" />
        <MenuItem icon={<ShoppingBag className="w-5 h-5 text-slate-600" />} title="Recently Viewed" />
      </div>

      {/* Support & Settings Group */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Support & Settings</h3>
        </div>
        <MenuItem icon={<Settings className="w-5 h-5 text-slate-600" />} title="Settings" />
        <MenuItem icon={<Headphones className="w-5 h-5 text-slate-600" />} title="Help Center" />
        <MenuItem icon={<Shield className="w-5 h-5 text-slate-600" />} title="Privacy & Security" />
      </div>
    </div>
  );
}