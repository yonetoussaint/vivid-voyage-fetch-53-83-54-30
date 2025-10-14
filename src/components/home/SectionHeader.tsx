// SectionHeader.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, LucideIcon, MoreHorizontal, Play } from "lucide-react"; // Added Play icon
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }> | string; // Allow string for Font Awesome classes
  viewAllLink?: string;
  viewAllText?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl"; // New title size prop
  // Clear button props
  showClearButton?: boolean;
  clearButtonText?: string;
  onClearClick?: () => void;
  // New props for tabs functionality
  showTabs?: boolean;
  compact?: boolean;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabsStyle?: "default" | "glassmorphic";
  // New props for vendor header functionality
  showVendorHeader?: boolean;
  vendorData?: {
    profilePic: string;
    vendorName: string;
    verified: boolean;
    followers: string;
    publishedAt: string;
  };
  onFollowClick?: () => void;
  // New countdown props
  showCountdown?: boolean;
  countdown?: string;
  // New props for custom button
  showCustomButton?: boolean;
  customButtonText?: string;
  customButtonIcon?: React.ComponentType<{ className?: string }> | string;
  onCustomButtonClick?: () => void;
  // New props for stacked profiles
  showStackedProfiles?: boolean;
  stackedProfiles?: Array<{ id: string; image: string; alt?: string }>;
  onProfileClick?: (profileId: string) => void;
  maxProfiles?: number;
  stackedProfilesText?: string;
  // New props for title chevron
  showTitleChevron?: boolean;
  onTitleClick?: () => void;
  // New prop for padding bottom
  paddingBottom?: boolean;
  // New prop for sponsor count display
  showSponsorCount?: boolean;
  // New props for verified sellers display
  showVerifiedSellers?: boolean;
  verifiedSellersText?: string;
  verifiedIcon?: React.ComponentType<{ className?: string }>;
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
  
  // Serialize icon names
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

export default function SectionHeader({
  title,
  subtitle,
  icon,
  viewAllLink,
  viewAllText,
  titleTransform = "uppercase",
  titleSize = "xs", // Default size
  // Clear button props
  showClearButton = false,
  clearButtonText = "× Clear",
  onClearClick,
  // Tabs props
  showTabs = false,
  compact = false,
  tabs = [],
  activeTab,
  onTabChange,
  tabsStyle = "default",
  // Vendor header props
  showVendorHeader = false,
  vendorData,
  onFollowClick,
  // Countdown props
  showCountdown = false,
  countdown,
  // Custom button props
  showCustomButton = false,
  customButtonText = "Tout regarder",
  customButtonIcon,
  onCustomButtonClick,
  // Stacked profiles props
  showStackedProfiles = false,
  stackedProfiles = [],
  onProfileClick,
  maxProfiles = 3,
  stackedProfilesText = "Handpicked by",
  // Title chevron props
  showTitleChevron = false,
  onTitleClick,
  // Padding bottom prop
  paddingBottom = true,
  // Sponsor count prop
  showSponsorCount = false,
  // Verified sellers props
  showVerifiedSellers = false,
  verifiedSellersText = "Verified Sellers",
  verifiedIcon
}: SectionHeaderProps) {

  const defaultViewAllText = viewAllText || 'View All';
  const navigate = useNavigate();

  // Automatic navigation handler for title chevron clicks
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
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const Button = ({ variant, size, className, children, ...props }) => (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  // Size mapping for title
  const titleSizeClass = 
    titleSize === 'xs' ? 'text-xs' :
    titleSize === 'sm' ? 'text-sm' :
    titleSize === 'base' ? 'text-base' :
    titleSize === 'lg' ? 'text-lg' :
    'text-xl';

  // Size mapping for countdown (slightly larger than title)
  const countdownSizeClass = 
    titleSize === 'xs' ? 'text-sm' :
    titleSize === 'sm' ? 'text-base' :
    titleSize === 'base' ? 'text-lg' :
    titleSize === 'lg' ? 'text-xl' :
    'text-2xl';

  // Render icon component
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a string (Font Awesome class), render as <i> element
    if (typeof icon === 'string') {
      return <i className={`${icon} w-4 h-4 flex-shrink-0`} />;
    }

    // If icon is a React component (Lucide icon), render as component
    const IconComponent = icon;
    return <IconComponent className="w-4 h-4 flex-shrink-0" />;
  };

  // Render custom button icon
  const renderCustomButtonIcon = () => {
    if (!customButtonIcon) return null;

    // If customButtonIcon is a string (Font Awesome class), render as <i> element
    if (typeof customButtonIcon === 'string') {
      return <i className={`${customButtonIcon} h-3.5 w-3.5 mr-1`} />;
    }

    // If customButtonIcon is a React component (Lucide icon), render as component
    const CustomIconComponent = customButtonIcon;
    return <CustomIconComponent className="h-3.5 w-3.5 mr-1" />;
  };

  // Stacked profiles component
  const StackedProfiles = () => {
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

  // Title with chevron component
  const TitleWithChevron = () => (
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

  // Countdown component for right side - replaces view all button
  const CountdownDisplay = () => {
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

  // Verified Sellers component
  const VerifiedSellersDisplay = () => {
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
    <div className="flex flex-col">
      {/* Vendor Header Section - Only shown when showVendorHeader is true */}
      {showVendorHeader && vendorData && (
        <div className="flex items-center p-3 border-b border-gray-100 bg-white">
          <div className="flex-shrink-0 mr-2 rounded-full overflow-hidden w-8 h-8">
            <img
              src={vendorData.profilePic}
              alt={vendorData.vendorName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-gray-800 text-sm truncate">
                {vendorData.vendorName}
              </h3>
              {vendorData.verified && (
                <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 text-xs truncate">
              {vendorData.followers} followers • {timeAgo(vendorData.publishedAt)}
            </p>
          </div>
          <button 
            onClick={onFollowClick}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium transition-colors"
          >
            Follow
          </button>
          <Button variant="ghost" size="icon" className="ml-1 rounded-full h-6 w-6">
            <MoreHorizontal className="text-gray-600 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Original Header section with padding - Only shown when NOT showing vendor header */}
      {!showVendorHeader && (
          <div className={` flex items-center px-2 ${paddingBottom ? 'mb-2' : ''} ${compact ? 'py-0' : 'py-0'}`}>
          <div className="flex items-center justify-between w-full">
            {/* First element (Title with Icon, optional Chevron) */}
            <TitleWithChevron />

            {/* Last element (Countdown or Verified Sellers or Stacked Profiles or Clear button or Custom Button or View All) */}
            
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

                  {/* Show custom button if enabled, otherwise show regular view all link */}
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
  );
}