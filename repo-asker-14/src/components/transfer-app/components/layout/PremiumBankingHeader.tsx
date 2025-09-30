
import React, { useState } from 'react';
import { Menu, X, Bell, User, Globe, ChevronDown, Send, CreditCard, History, Settings, Shield, Lock, Eye, EyeOff, TrendingUp, Camera } from 'lucide-react';

export default function PremiumBankingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  return (
    <div className="w-full sticky top-0 z-[9999]">
      {/* Main Header */}
      <header className="bg-gradient-to-r from-[#2E4A4A] via-[#3D5F5F] to-[#4A7373] text-white shadow-xl relative">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Account with Menu Overlay */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="relative"
                  aria-label="Account and Menu"
                >
                  {/* Main Account Icon - Now Circular */}
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/30 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Hamburger Menu Overlay */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#5A8A8A] rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-[#7BA3A3] transition-colors">
                    {isMenuOpen ? <X size={10} className="text-white" /> : <Menu size={10} className="text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 ml-3 mr-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions, recipients..."
                  className="w-full px-4 py-2 pl-10 pr-12 bg-black/20 backdrop-blur-sm rounded-full border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors">
                  <Camera className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
            {/* Right Actions */}
            <div className="flex items-center space-x-0.5">
              {/* Security Status */}
              <div className="hidden sm:flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30">
                <Lock size={12} className="text-green-300" />
                <span className="text-xs text-green-100 font-medium">Secured</span>
              </div>

              {/* Flag */}
              <button className="p-2 rounded-lg hover:bg-black/20 transition-colors backdrop-blur-sm">
                <span className="text-lg">🇺🇸</span>
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-black/20 transition-colors backdrop-blur-sm relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-semibold shadow-lg">2</span>
              </button>
            </div>
          </div>


        </div>
      </header>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <div className="bg-[#3D5F5F] text-white shadow-xl border-t border-[#4A7373]">
          <div className="py-2">
            <MenuItem icon={<Send size={20} />} text="Send Money" primary />
            <MenuItem icon={<CreditCard size={20} />} text="Add Funds" />
            <MenuItem icon={<History size={20} />} text="Transaction History" />
            <MenuItem icon={<Globe size={20} />} text="Exchange Rates" />
            <MenuItem icon={<User size={20} />} text="Recipients" />
            <MenuItem icon={<Shield size={20} />} text="Security Center" />
            <MenuItem icon={<Settings size={20} />} text="Settings" />
            
            <div className="border-t border-[#4A7373] mt-2 pt-2">
              <div className="px-4 py-3 bg-[#2E4A4A]/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">24/7 Secure Support</span>
                </div>
                <p className="text-sm text-[#BDD1D1]">1-800-GLOBAL-TF</p>
                <p className="text-xs text-[#A8C5C5]">Available in 15+ languages</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="bg-[#3D5F5F] text-white shadow-xl border-t border-[#4A7373]">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-[#4A7373] bg-[#2E4A4A]/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5A8A8A] to-[#7BA3A3] rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-[#BDD1D1]">Premium Member</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Shield size={12} className="text-green-400" />
                      <span className="text-xs text-green-400">Verified</span>
                    </div>
                    <div className="w-1 h-1 bg-[#A8C5C5] rounded-full"></div>
                    <span className="text-xs text-[#A8C5C5]">ID: #SG789456</span>
                  </div>
                </div>
              </div>
            </div>
            <ProfileMenuItem text="Account Details" />
            <ProfileMenuItem text="Security & Privacy" />
            <ProfileMenuItem text="Payment Methods" />
            <ProfileMenuItem text="Transaction Limits" />
            <ProfileMenuItem text="Notification Settings" />
            <ProfileMenuItem text="Help & Support" />
            <div className="border-t border-[#4A7373] mt-1">
              <ProfileMenuItem text="Sign Out" danger />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, text, primary = false }: { icon: React.ReactNode; text: string; primary?: boolean }) {
  return (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#4A7373] transition-colors ${
      primary ? 'bg-gradient-to-r from-[#5A8A8A]/20 to-[#7BA3A3]/20 border-l-4 border-[#6B9999] text-[#BDD1D1]' : 'text-[#BDD1D1]'
    }`}>
      <span className={primary ? 'text-[#7BA3A3]' : 'text-[#A8C5C5]'}>{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );
}

function ProfileMenuItem({ text, danger = false }: { text: string; danger?: boolean }) {
  return (
    <button className={`w-full text-left px-4 py-2 hover:bg-[#4A7373] transition-colors ${
      danger ? 'text-red-400 hover:bg-red-900/20' : 'text-[#BDD1D1]'
    }`}>
      {text}
    </button>
  );
}
