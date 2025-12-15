import React from 'react';
import { User, ChevronRight, ShoppingBag, Heart, MessageCircle, MapPin, Headphones, FileText, Gift, DollarSign, Award, Bell, Settings, Star, Clock, Package, Truck, Shield, Search, Users, HelpCircle, Share2, TrendingUp, Zap, Crown, Target, Calendar, Send, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MenuItem({ icon, title, badge, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 active:bg-slate-100"
    >
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
  const navigate = useNavigate();

  const handleCouponsClick = () => {
    navigate('/coupons');
  };

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

      {/* My Services Group */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-5 py-3 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Services</h3>
        </div>
        <MenuItem icon={<Heart className="w-5 h-5 text-slate-600" />} title="Wish List" />
        <MenuItem icon={<MessageCircle className="w-5 h-5 text-slate-600" />} title="Messages" badge="3" />
        <MenuItem icon={<MapPin className="w-5 h-5 text-slate-600" />} title="Address" />
        <MenuItem icon={<Headphones className="w-5 h-5 text-slate-600" />} title="Support" />
        <MenuItem 
          icon={<Gift className="w-5 h-5 text-slate-600" />} 
          title="Coupons" 
          badge="5"
          onClick={handleCouponsClick}
        />
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