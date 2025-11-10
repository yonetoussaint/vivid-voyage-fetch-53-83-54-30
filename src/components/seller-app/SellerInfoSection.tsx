import React, { useState } from 'react';
import {
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star,
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell, Link2, X,
  MessageCircle, Shield, CheckCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HeroBanner from '@/components/home/HeroBanner';
import { getSellerLevel } from '@/utils/sellerLevels';
import VerificationBadge from '@/components/shared/VerificationBadge';
import XIcon from '@/components/icons/social/XIcon';
import TikTokIcon from '@/components/icons/social/TikTokIcon';
import WhatsAppIcon from '@/components/icons/social/WhatsAppIcon';

interface SellerInfoSectionProps {
  sellerData: any;
  sellerLoading: boolean;
  getSellerLogoUrl: (imagePath?: string) => string;
  onBecomeSeller: () => void;
  onBack: () => void;
  showActionButtons?: boolean;
  isOwnProfile?: boolean;
  onVerifySeller?: () => void;
  onEditProfile?: () => void;
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({
  sellerData,
  sellerLoading,
  getSellerLogoUrl,
  onBecomeSeller,
  onBack,
  showActionButtons = true,
  isOwnProfile = false,
  onVerifySeller = () => console.log('Verify seller clicked'),
  onEditProfile = () => console.log('Edit profile clicked')
}) => {
  const [showBusinessHours, setShowBusinessHours] = useState(false);
  const [showSocialPanel, setShowSocialPanel] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '2008';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric' });
    } catch {
      return '2008';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
  };

  // FIXED: Properly handle seller data with correct field mapping
  const safeSellerData = sellerData ? {
    id: sellerData.id, // Make sure ID is included
    name: sellerData.name || 'Seller Name',
    username: sellerData.username || sellerData.name?.toLowerCase().replace(/\s+/g, '') || 'seller',
    image_url: sellerData.image_url, // Use the actual image_url from database
    verified: sellerData.verified || false,
    bio: sellerData.bio || sellerData.description || 'No bio provided yet.',
    business_type: sellerData.business_type || sellerData.category || 'Business',
    location: sellerData.location || sellerData.address || 'Location not specified',
    website: sellerData.website,
    rating: sellerData.rating ? Number(sellerData.rating) : 0,
    reviews_count: sellerData.reviews_count || 0,
    total_sales: sellerData.total_sales || 0,
    join_date: formatDate(sellerData.join_date || sellerData.created_at),
    followers_count: sellerData.followers_count || 0,
    mentions: sellerData.mentions || [],
    social_media: sellerData.social_media || {},
    last_active: sellerData.last_active || 'Active recently',
    business_hours: sellerData.business_hours || null,
    followed_by: Array.isArray(sellerData.followed_by)
      ? sellerData.followed_by
      : typeof sellerData.followed_by === 'string'
        ? JSON.parse(sellerData.followed_by || "[]")
        : [],
    store_age_years: (() => {
      const joinDate = sellerData.join_date || sellerData.created_at;
      if (!joinDate) return 1;
      try {
        const date = new Date(joinDate);
        const now = new Date();
        const years = now.getFullYear() - date.getFullYear();
        return years > 0 ? years : 1;
      } catch {
        return 1;
      }
    })()
  } : null;

  if (sellerLoading) {
    return (
      <div className="bg-white text-gray-900">
        <div className="relative w-full h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!safeSellerData) {
    return (
      <div className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
        <p className="text-lg font-medium">No seller profile found</p>
        <p className="text-sm text-gray-400">You need to create a seller account to access the dashboard.</p>
        <button
          onClick={onBecomeSeller}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-bold"
        >
          Become a Seller
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Banner - FIXED: Pass correct sellerId and use seller-logos bucket */}
      <div className="relative w-full overflow-hidden z-0">
        <HeroBanner 
          asCarousel={false} 
          showNewsTicker={false} 
          customHeight="180px" 
          sellerId={safeSellerData.id} // Use the actual seller ID
          showEditButton={isOwnProfile}
          editButtonPosition="top-right"
          dataSource="seller_banners"
        />
      </div>

      {/* Profile Image Section - FIXED: Use the actual image_url */}
      <div className="relative z-30 -mt-12 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden shadow-lg">
            {safeSellerData.image_url ? (
              <img 
                src={getSellerLogoUrl(safeSellerData.image_url)} 
                alt="Profile" 
                className="w-full h-full object-cover profile-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          {isOwnProfile && (
            <button
              onClick={onEditProfile}
              className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white shadow-lg"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="px-2 pt-3 relative z-10">
        {/* Profile Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
              <div className="bg-white rounded-full p-0.5">
                <Avatar className="w-12 h-12 rounded-full">
                  <AvatarImage 
                    src={getSellerLogoUrl(safeSellerData.image_url)} 
                    className="rounded-full" 
                  />
                  <AvatarFallback className="rounded-full">
                    {safeSellerData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-start justify-between w-full h-12">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 h-full justify-center">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold truncate">{safeSellerData.name}</h1>
                {safeSellerData.verified && <VerificationBadge size="sm" />}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="font-mono whitespace-nowrap">
                  ID: {(() => {
                    const numericOnly = sellerData?.id?.replace(/\D/g, '') || '';
                    const eightDigits = numericOnly.substring(0, 8).padEnd(8, '0');
                    const twoLetters = safeSellerData.name.substring(0, 2).toUpperCase();
                    return `${twoLetters}${eightDigits}`;
                  })()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-center">
              {isOwnProfile ? (
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    title="Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${
                      isFollowing 
                        ? 'bg-gray-900 text-white hover:bg-gray-800' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-2">
          <p className="text-gray-900 text-sm leading-relaxed">
            {safeSellerData.bio}
            {safeSellerData.mentions && safeSellerData.mentions.length > 0 && (
              <span className="text-blue-500">
                {' '}{safeSellerData.mentions.map((m: string) => `@${m}`).join(' ')}
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="font-bold text-black text-sm">
              {formatNumber(safeSellerData.followers_count)}
            </div>
            <div className="text-gray-600 text-xs">Followers</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-black font-bold text-sm">
              {formatNumber(safeSellerData.total_sales)}
            </div>
            <div className="text-gray-600 text-xs">Orders</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-black font-bold text-sm">
              {safeSellerData.rating || '0.0'}
            </div>
            <div className="text-gray-600 text-xs">Average</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-black font-bold text-sm">
              {safeSellerData.store_age_years}
            </div>
            <div className="text-gray-600 text-xs">Years</div>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!safeSellerData.verified && isOwnProfile && (
        <div className="mx-2 mb-2">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Get verified to build trust</span>
              </div>
              <button
                onClick={onVerifySeller}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <CheckCircle className="w-3 h-3" />
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Panel - Remains the same */}
      {showSocialPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          {/* ... social panel content ... */}
        </div>
      )}
    </div>
  );
};

export default SellerInfoSection;