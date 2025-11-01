import React, { useState } from 'react';
import {
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star,
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell, Link2
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
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({
  sellerData,
  sellerLoading,
  getSellerLogoUrl,
  onBecomeSeller,
  onBack,
  showActionButtons = true
}) => {
  const [showBusinessHours, setShowBusinessHours] = useState(false);
  const [showSocialPanel, setShowSocialPanel] = useState(false);

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

  const safeSellerData = sellerData ? {
    name: sellerData.name || 'Seller Name',
    username: sellerData.username || sellerData.name?.toLowerCase().replace(/\s+/g, '') || 'seller',
    image_url: sellerData.image_url,
    verified: sellerData.verified || false,
    bio: sellerData.bio || sellerData.description || 'Award-winning seller with a passion for quality products and excellent customer service.',
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
    last_active: sellerData.last_active || 'Active 2 hours ago',
    business_hours: sellerData.business_hours || null,
    followed_by: Array.isArray(sellerData.followed_by)
      ? sellerData.followed_by
      : typeof sellerData.followed_by === 'string'
        ? JSON.parse(sellerData.followed_by || "[]")
        : []
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
        <HeroBanner asCarousel={false} showNewsTicker={false} customHeight="180px" sellerId={safeSellerData.id} />
      </div>

      <div className="px-3 pt-3 relative z-10">
        {/* Profile Info */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="p-0.5 rounded-lg bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
              <div className="bg-white rounded-lg p-0.5">
                <Avatar className="w-12 h-12 rounded-md">
                  <AvatarImage src={getSellerLogoUrl(safeSellerData.image_url)} className="rounded-md" />
                  <AvatarFallback className="rounded-md">
                    {safeSellerData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Name + ID + Link icon */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold truncate">{safeSellerData.name}</h1>
                {safeSellerData.verified && <VerificationBadge size="sm" />}
              </div>

              {/* Seller code below name */}
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

              {/* Seller Level (without progress bar) */}
              {(() => {
                const level = getSellerLevel(safeSellerData.total_sales);
                return (
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${level.gradient} text-white text-xs font-semibold mt-1`}
                  >
                    <span>{level.icon}</span>
                    <span>{level.name}</span>
                  </div>
                );
              })()}
            </div>

            {/* Big Link Icon */}
            <button
              onClick={() => setShowSocialPanel(true)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="View social links"
            >
              <Link2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-3">
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
        <div className="flex items-center justify-between py-3 mb-3 border-y border-gray-200 -mx-4 px-4">
          <div className="flex items-center">
            <span className="font-bold text-gray-900 text-base">{formatNumber(safeSellerData.followers_count)}</span>
            <span className="text-gray-500 text-xs ml-1">Followers</span>
          </div>

          {safeSellerData.rating > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-900 font-bold text-base">{safeSellerData.rating}</span>
                {safeSellerData.reviews_count > 0 && (
                  <span className="text-gray-500 text-xs">({formatNumber(safeSellerData.reviews_count)})</span>
                )}
              </div>
            </>
          )}

          {safeSellerData.total_sales > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <span className="text-gray-900 font-bold text-base">{formatNumber(safeSellerData.total_sales)}</span>
                <span className="text-gray-500 text-xs ml-1">orders</span>
              </div>
            </>
          )}
        </div>

        {/* Followed By */}
        {safeSellerData.followed_by?.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <div className="flex -space-x-1.5">
              {safeSellerData.followed_by.slice(0, 3).map((followerName: string, i: number) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {followerName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span>
              Followed by <span className="font-semibold text-gray-700">{safeSellerData.followed_by.slice(0, 2).join(', ')}</span>
              {safeSellerData.followed_by.length > 2 && ` and ${safeSellerData.followed_by.length - 2} others`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="flex gap-2 pb-4">
            <button className="flex-1 h-10 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors">
              Following
            </button>
            <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Social Media Slide Panel */}
      {showSocialPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-64 bg-white h-full shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Social Links</h2>
              <button
                onClick={() => setShowSocialPanel(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <a href={safeSellerData.social_media?.whatsapp || '#'} target="_blank" className="flex items-center gap-2 text-green-600 hover:text-green-700">
                <WhatsAppIcon className="w-5 h-5" /> WhatsApp
              </a>
              <a href={safeSellerData.social_media?.facebook || '#'} target="_blank" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <Facebook className="w-5 h-5" /> Facebook
              </a>
              <a href={safeSellerData.social_media?.instagram || '#'} target="_blank" className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a href={safeSellerData.social_media?.x || '#'} target="_blank" className="flex items-center gap-2 text-black hover:text-gray-800">
                <XIcon className="w-5 h-5" /> X (Twitter)
              </a>
              <a href={safeSellerData.social_media?.tiktok || '#'} target="_blank" className="flex items-center gap-2 text-black hover:text-gray-800">
                <TikTokIcon className="w-5 h-5" /> TikTok
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfoSection;