import React, { useState } from 'react';
import {
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star,
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell, Link2, X,
  MessageCircle, Shield, CheckCircle
} from 'lucide-react';
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
  sellerStories?: any[]; // Add stories data
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
  onEditProfile = () => console.log('Edit profile clicked'),
  sellerStories = [] // Default to empty array
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

  // Stories ring configuration
  const getStoriesRing = () => {
    const storiesCount = sellerStories.length;
    if (storiesCount === 0) return null;

    const size = 60; // Total size of the SVG
    const center = size / 2;
    const radius = 26;
    const strokeWidth = 2.5;
    const gapAngle = 8; // Gap between segments in degrees
    const segmentAngle = (360 / storiesCount) - gapAngle;

    return (
      <svg 
        width={size} 
        height={size} 
        className="absolute -top-0.5 -left-0.5 transform -rotate-90"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        <defs>
          <linearGradient id="storyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
        
        {sellerStories.map((_, index) => {
          const startAngle = index * (segmentAngle + gapAngle);
          const endAngle = startAngle + segmentAngle;
          
          // Convert angles to radians
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          // Calculate start and end points
          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);
          
          // Large arc flag
          const largeArcFlag = segmentAngle > 180 ? 1 : 0;
          
          const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
          
          return (
            <path
              key={index}
              d={pathData}
              fill="none"
              stroke="url(#storyGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  };

  const safeSellerData = sellerData ? {
    id: sellerData.id,
    name: sellerData.name || 'Seller Name',
    username: sellerData.username || sellerData.name?.toLowerCase().replace(/\s+/g, '') || 'seller',
    image_url: sellerData.image_url,
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
      {/* Banner */}
      <div className="relative w-full overflow-hidden z-0">
        <HeroBanner 
          asCarousel={false} 
          showNewsTicker={false} 
          customHeight="180px" 
          sellerId={safeSellerData.id}
          dataSource="seller_banners"
        />
      </div>

      {/* Profile Info */}
      <div className="px-2 pt-3 relative z-10">
        <div className="flex items-start gap-3 mb-3">
          {/* Small Avatar with Stories Ring */}
          <div className="relative flex-shrink-0">
            <div className="relative p-0.5 rounded-full">
              {/* Stories Ring */}
              {sellerStories.length > 0 && getStoriesRing()}
              
              <div className="bg-white rounded-full p-0.5">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {safeSellerData.image_url ? (
                    <img 
                      src={safeSellerData.image_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Profile image failed to load, using fallback');
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                      {safeSellerData.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
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

      {/* Social Media Panel */}
      {showSocialPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-lg p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Social Links</h2>
              <button
                onClick={() => setShowSocialPanel(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-6 pb-4">
              <a 
                href={safeSellerData.social_media?.whatsapp || '#'} 
                target="_blank" 
                className="flex flex-col items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">WhatsApp</span>
              </a>

              <a 
                href={safeSellerData.social_media?.facebook || '#'} 
                target="_blank" 
                className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">Facebook</span>
              </a>

              <a 
                href={safeSellerData.social_media?.instagram || '#'} 
                target="_blank" 
                className="flex flex-col items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Instagram className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">Instagram</span>
              </a>

              <a 
                href={safeSellerData.social_media?.x || '#'} 
                target="_blank" 
                className="flex flex-col items-center gap-2 text-black hover:text-gray-800 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <XIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">X</span>
              </a>

              <a 
                href={safeSellerData.social_media?.tiktok || '#'} 
                target="_blank" 
                className="flex flex-col items-center gap-2 text-black hover:text-gray-800 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <TikTokIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">TikTok</span>
              </a>
            </div>

            <button
              onClick={() => setShowSocialPanel(false)}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfoSection;