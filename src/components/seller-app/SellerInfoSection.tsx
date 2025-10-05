import React, { useState } from 'react';
import { 
  Clock, ChevronUp, ArrowLeft, ChevronDown, Store, MapPin, Calendar, Star, 
  Facebook, Instagram, Mail, Edit2, Share2, MoreVertical, Bell 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HeroBanner from '@/components/home/HeroBanner';

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
  
  console.log('[SellerInfoSection] Rendering with sellerData:', sellerData);
  console.log('[SellerInfoSection] showActionButtons:', showActionButtons);

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

  // Always render the banner section
  return (
    <div className="bg-white text-gray-900">
      {/* Banner with fixed height - Always visible */}
      <div className="relative w-full" style={{ height: '128px' }}>
        <HeroBanner 
          asCarousel={false}
          showNewsTicker={false}
          dotsPosition="right"
          useContainerHeight={true}
          customBanners={[
            {
              id: 'seller-banner-1',
              image: 'from-red-500 via-yellow-400 to-blue-500',
              alt: 'Seller Banner 1',
              type: 'color',
              duration: 5000
            },
            {
              id: 'seller-banner-2',
              image: 'from-purple-500 via-pink-500 to-red-500',
              alt: 'Seller Banner 2',
              type: 'color',
              duration: 5000
            },
            {
              id: 'seller-banner-3',
              image: 'from-blue-500 via-teal-400 to-green-500',
              alt: 'Seller Banner 3',
              type: 'color',
              duration: 5000
            },
            {
              id: 'seller-banner-4',
              image: 'from-indigo-500 via-purple-500 to-pink-500',
              alt: 'Seller Banner 4',
              type: 'color',
              duration: 5000
            }
          ]}
        />
      </div>

      {/* Main Content - Fixed structure */}
      {safeSellerData ? (
        <div className="px-3 -mt-12 relative z-10">
          {/* Profile Info with Action Buttons */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-end">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
                <div className="bg-white rounded-full p-1">
                  <Avatar className="w-20 h-20 flex-shrink-0 rounded-full">
                    <AvatarImage src={getSellerLogoUrl(safeSellerData.image_url)} />
                    <AvatarFallback>{safeSellerData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pb-2">
              <button className="px-4 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-md font-medium text-sm border border-gray-200">
                <Edit2 className="w-4 h-4 text-gray-700" />
                <span className="text-gray-700">Edit</span>
              </button>
              <button className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md border border-gray-200">
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md border border-gray-200">
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold">{safeSellerData.name}</h1>
                {safeSellerData.verified && (
                  <svg className="w-5 h-5 flex-shrink-0 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="font-mono">
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
                    // Optional: Add a toast notification here
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy seller ID"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
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
          <div className="flex items-center gap-x-3 text-xs text-gray-500 mb-3">
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
              <a href={safeSellerData.social_media?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={safeSellerData.social_media?.x || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href={safeSellerData.social_media?.tiktok || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href={safeSellerData.social_media?.whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
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

          {showBusinessHours && safeSellerData.business_hours && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-1.5 text-xs">
              {Object.entries(safeSellerData.business_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-gray-700">
                  <span className="font-semibold capitalize">{day}</span>
                  <span className="text-gray-600">{hours as string}</span>
                </div>
              ))}
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
      ) : (
        <div className="px-3 py-8 text-center space-y-4">
          <p className="text-lg font-medium">No seller profile found</p>
          <p className="text-sm text-gray-400">You need to create a seller account to access the dashboard.</p>
          <button
            onClick={onBecomeSeller}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-bold"
          >
            Become a Seller
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerInfoSection;