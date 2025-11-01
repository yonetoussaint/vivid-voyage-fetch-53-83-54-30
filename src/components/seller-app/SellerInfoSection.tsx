import React, { useState } from 'react';
import {
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star,
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell, Link2, X
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
        <div className="flex items-start gap-3 mb-3">
          {/* Circular Avatar - Height matches name + code */}
          <div className="relative flex-shrink-0">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
              <div className="bg-white rounded-full p-0.5">
                <Avatar className="w-12 h-12 rounded-full">
                  <AvatarImage src={getSellerLogoUrl(safeSellerData.image_url)} className="rounded-full" />
                  <AvatarFallback className="rounded-full">
                    {safeSellerData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Name + ID + Link icon */}
          <div className="flex items-start justify-between w-full h-12">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 h-full justify-center">
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
            </div>

            {/* Three Icons: Link, Share, More */}
            <div className="flex items-center gap-1 self-center">
              <button
                onClick={() => setShowSocialPanel(true)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="View social links"
              >
                <Link2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
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

        {/* Stats - No border separators */}
        <div className="flex items-center justify-between -mx-4 mb-2 px-4">
          <div className="flex items-center">
            <span className="font-bold text-gray-900 text-base">{formatNumber(safeSellerData.followers_count)}</span>
            <span className="text-gray-500 text-xs ml-1">Followers</span>
          </div>

          {safeSellerData.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-gray-900 font-bold text-base">{safeSellerData.rating}</span>
              {safeSellerData.reviews_count > 0 && (
                <span className="text-gray-500 text-xs">({formatNumber(safeSellerData.reviews_count)})</span>
              )}
            </div>
          )}

          {safeSellerData.total_sales > 0 && (
            <div className="flex items-center">
              <span className="text-gray-900 font-bold text-base">{formatNumber(safeSellerData.total_sales)}</span>
              <span className="text-gray-500 text-xs ml-1">orders</span>
            </div>
          )}
        </div>

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

      {/* Social Media Bottom Sheet */}
      {showSocialPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-lg p-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Social Links</h2>
              <button
                onClick={() => setShowSocialPanel(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal Social Links */}
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

            {/* Close Button */}
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