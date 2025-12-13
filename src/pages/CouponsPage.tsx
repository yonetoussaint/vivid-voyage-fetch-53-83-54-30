import React, { useState } from 'react';
import { ChevronLeft, Gift, Tag, Percent, Calendar, Clock, Copy, Check, ExternalLink, Zap, Star, Award, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border ${coupon.expiringSoon ? 'border-red-200' : 'border-slate-200'}`}>
      <div className={`p-4 ${coupon.type === 'store' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : coupon.type === 'platform' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {coupon.type === 'store' ? <StoreIcon /> : <Percent className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="text-white font-bold text-lg">{coupon.discount}</div>
              <div className="text-white/80 text-sm">{coupon.title}</div>
            </div>
          </div>
          {coupon.best && (
            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              BEST
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
              <div className="font-mono font-bold text-slate-800">{coupon.code}</div>
            </div>
            <button
              onClick={handleCopyCode}
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            Use Now
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Valid: {coupon.validDate}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Tag className="w-4 h-4 mr-2" />
            <span>{coupon.condition}</span>
          </div>
          {coupon.expiringSoon && (
            <div className="flex items-center text-sm text-red-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Expiring soon</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

export default function CouponsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const coupons = [
    {
      id: 1,
      type: 'platform',
      discount: '$12 OFF',
      title: 'Platform Coupon',
      code: 'AE2024SALE',
      validDate: 'Dec 1 - Dec 31, 2024',
      condition: 'Min. spend $50',
      expiringSoon: true,
      best: true
    },
    {
      id: 2,
      type: 'store',
      discount: '30% OFF',
      title: 'TechGadget Store',
      code: 'TECH30',
      validDate: 'Dec 1 - Dec 25, 2024',
      condition: 'For electronics only',
      expiringSoon: false,
      best: false
    },
    {
      id: 3,
      type: 'category',
      discount: '$8 OFF',
      title: 'Fashion Category',
      code: 'FASHION8',
      validDate: 'Dec 1 - Dec 20, 2024',
      condition: 'Min. spend $40',
      expiringSoon: true,
      best: false
    },
    {
      id: 4,
      type: 'store',
      discount: '20% OFF',
      title: 'HomeLiving Store',
      code: 'HOME20',
      validDate: 'Dec 1 - Jan 15, 2025',
      condition: 'No minimum spend',
      expiringSoon: false,
      best: true
    },
    {
      id: 5,
      type: 'platform',
      discount: '$5 OFF',
      title: 'New User Special',
      code: 'WELCOME5',
      validDate: 'Valid until used',
      condition: 'First order only',
      expiringSoon: false,
      best: false
    },
    {
      id: 6,
      type: 'category',
      discount: '15% OFF',
      title: 'Beauty Products',
      code: 'BEAUTY15',
      validDate: 'Dec 10 - Dec 30, 2024',
      condition: 'For skincare items',
      expiringSoon: false,
      best: false
    }
  ];

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true;
    if (activeTab === 'expiring') return coupon.expiringSoon;
    if (activeTab === 'store') return coupon.type === 'store';
    if (activeTab === 'platform') return coupon.type === 'platform';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-slate-800">My Coupons</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 px-5 py-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm opacity-90">Available Coupons</div>
            <div className="text-2xl font-bold">18</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Total Savings</div>
            <div className="text-2xl font-bold">$127</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-4 py-2 space-x-1 overflow-x-auto">
          {['all', 'expiring', 'store', 'platform'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Coupons' : 
               tab === 'expiring' ? 'Expiring Soon' : 
               tab === 'store' ? 'Store Coupons' : 'Platform Coupons'}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons List */}
      <div className="p-4 space-y-4">
        {filteredCoupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      {/* Empty State (if needed) */}
      {filteredCoupons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No coupons found</h3>
          <p className="text-slate-500 text-center text-sm mb-6">
            {activeTab === 'expiring' 
              ? 'No coupons expiring soon'
              : `No ${activeTab} coupons available`}
          </p>
          <button 
            onClick={() => setActiveTab('all')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium"
          >
            View All Coupons
          </button>
        </div>
      )}

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 mx-4 my-6 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg mb-1">Earn More Coupons!</div>
            <div className="text-sm opacity-90 mb-3">Complete tasks to unlock exclusive coupons</div>
            <button className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium">
              View Tasks
            </button>
          </div>
          <Award className="w-16 h-16 opacity-90" />
        </div>
      </div>
    </div>
  );
}