import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, LucideIcon, MoreHorizontal, Play } from "lucide-react";
import { useTranslation } from 'react-i18next';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { useAuth } from '@/contexts/auth/AuthContext';

// Type definitions
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }> | string;
  viewAllLink?: string;
  viewAllText?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showClearButton?: boolean;
  clearButtonText?: string;
  onClearClick?: () => void;
  showTabs?: boolean;
  compact?: boolean;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabsStyle?: "default" | "glassmorphic";
  showVendorHeader?: boolean;
  vendorData?: {
    sellerId: string;
    profilePic: string;
    vendorName: string;
    verified: boolean;
    followers: string;
    publishedAt: string;
    isFollowing?: boolean;
  };
  onFollowClick?: () => void;
  showCountdown?: boolean;
  countdown?: string;
  showCustomButton?: boolean;
  customButtonText?: string;
  customButtonIcon?: React.ComponentType<{ className?: string }> | string;
  onCustomButtonClick?: () => void;
  showStackedProfiles?: boolean;
  stackedProfiles?: Array<{ id: string; image: string; alt?: string }>;
  onProfileClick?: (profileId: string) => void;
  maxProfiles?: number;
  stackedProfilesText?: string;
  showTitleChevron?: boolean;
  onTitleClick?: () => void;
  paddingBottom?: boolean;
  showSponsorCount?: boolean;
  showThreeDots?: boolean;
  onThreeDotsClick?: () => void;
  showVerifiedSellers?: boolean;
  verifiedSellersText?: string;
  verifiedIcon?: React.ComponentType<{ className?: string }>;
}

interface ButtonProps {
  variant?: string;
  size?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

// Error Boundary for SectionHeader
class SectionHeaderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SectionHeader Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">Header unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Helper function to serialize section header props to URL params
export const serializeSectionHeaderProps = (props: {
  showCountdown?: boolean;
  countdown?: string;
  showStackedProfiles?: boolean;
  stackedProfilesText?: string;
  showSponsorCount?: boolean;
  showVerifiedSellers?: boolean;
  verifiedSellersText?: string;
  icon?: React.ComponentType<{ className?: string }> | string;
  verifiedIcon?: React.ComponentType<{ className?: string }>;
}) => {
  const params = new URLSearchParams();

  if (props.showCountdown) params.set('showCountdown', 'true');
  if (props.countdown) params.set('countdown', props.countdown);
  if (props.showStackedProfiles) params.set('showProfiles', 'true');
  if (props.stackedProfilesText) params.set('profilesText', props.stackedProfilesText);
  if (props.showSponsorCount) params.set('showSponsorCount', 'true');
  if (props.showVerifiedSellers) params.set('showVerifiedSellers', 'true');
  if (props.verifiedSellersText) params.set('verifiedSellersText', props.verifiedSellersText);

  if (props.icon) {
    const iconName = typeof props.icon === 'string' ? props.icon : (props.icon as any).name || 'Tag';
    params.set('icon', iconName);
  }
  if (props.verifiedIcon) {
    const verifiedIconName = (props.verifiedIcon as any).name || 'ShieldCheck';
    params.set('verifiedIcon', verifiedIconName);
  }

  return params.toString();
};

const Button: React.FC<ButtonProps> = ({ variant, size, className, children, ...props }) => (
  <button className={`inline-flex items-center justify-center ${className}`} {...props}>
    {children}
  </button>
);

export default function SectionHeader({
  title,
  subtitle,
  icon,
  viewAllLink,
  viewAllText,
  titleTransform = "uppercase",
  titleSize = "xs",
  showClearButton = false,
  clearButtonText = "× Clear",
  onClearClick,
  showTabs = false,
  compact = false,
  tabs = [],
  activeTab,
  onTabChange,
  tabsStyle = "default",
  showVendorHeader = false,
  vendorData,
  onFollowClick,
  showCountdown = false,
  countdown,
  showCustomButton = false,
  customButtonText = "Tout regarder",
  customButtonIcon,
  onCustomButtonClick,
  showStackedProfiles = false,
  stackedProfiles = [],
  onProfileClick,
  maxProfiles = 3,
  stackedProfilesText = "Handpicked by",
  showTitleChevron = false,
  onTitleClick,
  paddingBottom = true,
  showSponsorCount = false,
  showThreeDots = false,
  onThreeDotsClick,
  showVerifiedSellers = false,
  verifiedSellersText = "Verified Sellers",
  verifiedIcon
}: SectionHeaderProps) {

  const defaultViewAllText = viewAllText || 'View All';
  const navigate = useNavigate();
  const { user, followedSellers } = useAuth();

  // Get follow status from centralized auth state
  const isFollowingSeller = vendorData ? followedSellers.includes(vendorData.sellerId) : false;

  const handleFollowClick = () => {
    if (onFollowClick) {
      onFollowClick();
    } else {
      console.log('No follow handler provided');
    }
  };

  const formatFollowers = (followers: string) => {
    return followers;
  };

  const handleTitleClick = onTitleClick || (showTitleChevron ? () => {
    const sectionProps = serializeSectionHeaderProps({
      showCountdown,
      countdown,
      showStackedProfiles,
      stackedProfilesText,
      showSponsorCount,
      showVerifiedSellers,
      verifiedSellersText,
      icon,
      verifiedIcon
    });
    const params = sectionProps ? `&${sectionProps}` : '';
    navigate(`/products?title=${encodeURIComponent(title)}${params}`);
  } : undefined);

  const timeAgo = (date: string) => {
    try {
      const now = new Date();
      const postDate = new Date(date);
      const diffInMs = now.getTime() - postDate.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

      const currentYear = now.getFullYear();
      const postYear = postDate.getFullYear();

      if (postYear === currentYear) {
        return postDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        return postDate.toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const titleSizeClass = 
    titleSize === 'xs' ? 'text-xs' :
    titleSize === 'sm' ? 'text-sm' :
    titleSize === 'base' ? 'text-base' :
    titleSize === 'lg' ? 'text-lg' :
    'text-xl';

  const countdownSizeClass = 
    titleSize === 'xs' ? 'text-sm' :
    titleSize === 'sm' ? 'text-base' :
    titleSize === 'base' ? 'text-lg' :
    titleSize === 'lg' ? 'text-xl' :
    'text-2xl';

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return <i className={`${icon} w-4 h-4 flex-shrink-0`} />;
    }

    const IconComponent = icon;
    return <IconComponent className="w-4 h-4 flex-shrink-0" />;
  };

  const renderCustomButtonIcon = () => {
    if (!customButtonIcon) return null;

    if (typeof customButtonIcon === 'string') {
      return <i className={`${customButtonIcon} h-3.5 w-3.5 mr-1`} />;
    }

    const CustomIconComponent = customButtonIcon;
    return <CustomIconComponent className="h-3.5 w-3.5 mr-1" />;
  };

  const StackedProfiles: React.FC = () => {
    const totalCount = stackedProfiles.length;
    const displayProfiles = stackedProfiles.slice(0, maxProfiles);
    const remainingCount = totalCount - maxProfiles;

    return (
      <div className="flex items-center gap-2">
        {showSponsorCount ? (
          <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
            {totalCount}+ {stackedProfilesText}
          </span>
        ) : (
          <span className="text-xs text-gray-600 whitespace-nowrap">{stackedProfilesText}</span>
        )}
        <div className="flex items-center -space-x-1.5">
          {displayProfiles.map((profile, index) => (
            <div
              key={profile.id}
              onClick={() => onProfileClick?.(profile.id)}
              className={`relative w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden ${
                onProfileClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''
              }`}
              style={{ zIndex: displayProfiles.length - index + 1 }}
            >
              <img
                src={profile.image}
                alt={profile.alt || `Profile ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                }}
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div
              className="relative w-5 h-5 rounded-full border-2 border-white bg-gray-700 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              style={{ zIndex: 1 }}
            >
              <span className="text-[8px] font-bold text-white">+{remainingCount}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TitleWithChevron: React.FC = () => (
    <div 
      onClick={handleTitleClick}
      className={`flex items-center gap-1 font-bold tracking-wide ${titleSizeClass} ${
        titleTransform === 'uppercase' ? 'uppercase' : titleTransform === 'capitalize' ? 'capitalize' : ''
      } ${handleTitleClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {renderIcon()}
      <span className="h-4 flex items-center justify-center">
        <span className="leading-none">
          {title}
        </span>
      </span>
      {showTitleChevron && (
        <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-400" />
      )}
    </div>
  );

  const CountdownDisplay: React.FC = () => {
    if (!showCountdown || !countdown) return null;

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-600 font-medium">Ends in</span>
        <span className="font-mono font-bold transition-colors duration-300 text-red-500 text-sm">
          {countdown}
        </span>
      </div>
    );
  };

  const VerifiedSellersDisplay: React.FC = () => {
    if (!showVerifiedSellers) return null;

    const VerifiedIconComponent = verifiedIcon;

    return (
      <div className="flex items-center gap-1">
        {VerifiedIconComponent ? (
          <VerifiedIconComponent className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        ) : (
          <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        <span className="text-xs text-gray-600 font-medium">{verifiedSellersText}</span>
      </div>
    );
  };

  return (
    <SectionHeaderErrorBoundary>
      <div className="flex flex-col">
        {/* Vendor Header Section */}
        {showVendorHeader && vendorData && (
          <div className="flex items-center p-3 border-b border-gray-100 bg-white">
            <div className="flex-shrink-0 mr-2 rounded-full overflow-hidden w-8 h-8">
              <img
                src={vendorData.profilePic}
                alt={vendorData.vendorName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-gray-800 text-sm truncate">
                  {vendorData.vendorName}
                </h3>
                {vendorData.verified && <VerificationBadge size="sm" />}
              </div>
              <p className="text-gray-500 text-xs truncate">
                {formatFollowers(vendorData.followers)} followers • {timeAgo(vendorData.publishedAt)}
              </p>
            </div>
            <button 
              onClick={handleFollowClick}
              className={`${
                isFollowingSeller 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200`}
            >
              {isFollowingSeller ? 'Following' : 'Follow'}
            </button>
            {showThreeDots && (
              <button 
                onClick={onThreeDotsClick}
                className="ml-1 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="text-gray-600 h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Original Header section with padding */}
        {!showVendorHeader && (
          <div className={`flex items-center px-2 ${paddingBottom ? 'mb-2' : ''} ${compact ? 'py-0' : 'py-0'}`}>
            <div className="flex items-center justify-between w-full">
              <TitleWithChevron />

              <div className="flex items-center gap-2">
                {showCountdown && countdown ? (
                  <CountdownDisplay />
                ) : showStackedProfiles && stackedProfiles.length > 0 ? (
                  <StackedProfiles />
                ) : showVerifiedSellers ? (
                  <VerifiedSellersDisplay />
                ) : (
                  <>
                    {showClearButton && onClearClick && (
                      <button 
                        onClick={onClearClick}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {clearButtonText}
                      </button>
                    )}

                    {showCustomButton ? (
                      <button 
                        onClick={onCustomButtonClick}
                        className="text-xs flex items-center font-medium transition-colors text-black"
                      >
                        {renderCustomButtonIcon()}
                        {customButtonText}
                      </button>
                    ) : (
                      viewAllLink && (
                        <a
                          href={viewAllLink}
                          className="text-xs hover:underline flex items-center font-medium transition-colors"
                        >
                          {defaultViewAllText}
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </a>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionHeaderErrorBoundary>
  );
}