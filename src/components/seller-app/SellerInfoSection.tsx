import React, { useState } from 'react';
import { 
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star, 
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HeroBanner from '@/components/home/HeroBanner';
import { getSellerLevel, getProgressToNextLevel, getNextLevel } from '@/utils/sellerLevels';
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '2008';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric'
      });
    } catch {
      return '2008';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
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
    response_rate: sellerData.response_rate,
    response_time: sellerData.response_time,
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

        <div className="px-3 -mt-12">
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-end">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200">
                <div className="bg-white rounded-full p-1">
                  <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pb-2">
              <div className="px-4 h-9 rounded-full bg-gray-200 animate-pulse w-20" />
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="w-full mb-3">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>

          <div className="mb-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>

          <div className="flex items-center gap-x-3 mb-3">
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
          </div>

          <div className="flex items-center justify-between py-3 mb-3 border-y border-gray-200 -mx-4 px-4">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 w-px bg-gray-300" />
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 w-px bg-gray-300" />
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
          </div>

          <div className="flex gap-2 pb-4">
            <div className="flex-1 h-10 rounded-lg bg-gray-200 animate-pulse" />
            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (safeSellerData) {
    return (
      <div className="bg-white text-gray-900">
        {/* Banner with custom height */}
        <div className="relative w-full overflow-hidden z-0">
          <HeroBanner 
            asCarousel={false}
            showNewsTicker={false}
            customHeight="180px"
            sellerId={safeSellerData.id}
          />
        </div>

        {/* Main Content - Fixed structure */}
        <div className="px-3 pt-3 relative z-10">
          {/* Profile Info */}
          <div className="mb-3">
            {/* Single horizontal container with profile pic, name and ID */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="p-0.5 rounded-lg bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
                  <div className="bg-white rounded-lg p-0.5">
                    <Avatar className="w-12 h-12 rounded-md">
                      <AvatarImage src={getSellerLogoUrl(safeSellerData.image_url)} className="rounded-md" />
                      <AvatarFallback className="rounded-md">{safeSellerData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
              
              {/* Name and ID in single container */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-lg font-bold truncate">{safeSellerData.name}</h1>
                    {safeSellerData.verified && (
                      <VerificationBadge size="sm" />
                    )}
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="font-mono whitespace-nowrap">
                      ID: {(() => {
                        const numericOnly = sellerData?.id?.replace(/\D/g, '') || '';
                        const eightDigits = numericOnly.substring(0, 8).padEnd(8, '0');
                        const twoLetters = safeSellerData.name.substring(0, 2).toUpperCase();
                        return `${twoLetters}${eightDigits}`;
                      })()}
                    </span>
                    <button
                      onClick={() => {
                        const numericOnly = sellerData?.id?.replace(/\D/g, '') || '';
                        const eightDigits = numericOnly.substring(0, 8).padEnd(8, '0');
                        const twoLetters = safeSellerData.name.substring(0, 2).toUpperCase();
                        const sellerId = `${twoLetters}${eightDigits}`;
                        navigator.clipboard.writeText(sellerId);
                      }}
                      className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      title="Copy seller ID"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Seller Level Badge */}
                {(() => {
                  const level = getSellerLevel(safeSellerData.total_sales);
                  const nextLevel = getNextLevel(safeSellerData.total_sales);
                  const progress = getProgressToNextLevel(safeSellerData.total_sales);
                  
                  return (
                    <div className="flex items-center gap-2">
                      <div 
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${level.gradient} text-white text-xs font-semibold cursor-help`}
                        title={`${level.name} Level - ${safeSellerData.total_sales.toLocaleString()} sales`}
                      >
                        <span>{level.icon}</span>
                        <span>{level.name}</span>
                      </div>
                      {nextLevel && (
                        <div className="flex-1 max-w-[120px]">
                          <div 
                            className="flex items-center gap-1 text-xs text-gray-500 cursor-help"
                            title={`${Math.round(progress)}% to ${nextLevel.name} (${nextLevel.minSales.toLocaleString()} sales needed)`}
                          >
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${level.gradient} transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{nextLevel.icon}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
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

          {/* Additional Links */}
          <div className="flex items-center justify-between gap-x-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {safeSellerData.join_date}</span>
            </div>
            {safeSellerData.location && (
              <>
                <div className="text-gray-300">•</div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{safeSellerData.location}</span>
                </div>
              </>
            )}
            {safeSellerData.business_type && (
              <>
                <div className="text-gray-300">•</div>
                <div className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  <span>{safeSellerData.business_type}</span>
                </div>
              </>
            )}
          </div>

          {/* Social Media Links & Business Hours Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <a href={safeSellerData.social_media?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.x || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800 transition-colors">
                <XIcon className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.tiktok || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800 transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition-colors">
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>

            <button
              onClick={() => setShowBusinessHours(!showBusinessHours)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Hours</span>
              {showBusinessHours ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showBusinessHours && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-1.5 text-xs">
              {safeSellerData.business_hours && Object.keys(safeSellerData.business_hours).length > 0 ? (
                Object.entries(safeSellerData.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-gray-700">
                    <span className="font-semibold capitalize">{day}</span>
                    <span className="text-gray-600">{hours as string}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No business hours set</p>
                  <p className="text-gray-400 text-xs mt-1">This seller hasn't configured their business hours yet</p>
                </div>
              )}
            </div>
          )}

          {/* Stats Section */}
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
          {safeSellerData.followed_by && safeSellerData.followed_by.length > 0 && (
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

          {/* Action Buttons - Conditionally rendered */}
          {showActionButtons && (
            <div className="flex gap-2 pb-4"> {/* Added pb-4 here instead */}
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
      </div>
    );
  }

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
};

export default SellerInfoSection;