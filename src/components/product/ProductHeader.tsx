import React, { useState } from "react";
import { 
  Heart, 
  Settings,
  Globe,
  MapPin,
  Edit,
  Check,
  Languages,
  LucideIcon,
  ChevronDown
} from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

// Language and Location interfaces
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Location {
  name: string;
  flag?: string;
}

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

interface ProductHeaderProps {
  activeSection?: string;
  onTabChange?: (section: string) => void;
  focusMode?: boolean;
  showHeaderInFocus?: boolean;
  onProductDetailsClick?: () => void;
  currentImageIndex?: number;
  totalImages?: number;
  onShareClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: (query: string) => void;
  onSearchFocus?: () => void;
  inPanel?: boolean;
  showCloseIcon?: boolean;
  onCloseClick?: () => void;
  actionButtons?: ActionButton[];
  forceScrolledState?: boolean;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
  // NEW PROPS:
  title?: string; // For showing a title in the center
  hideSearch?: boolean; // For hiding search bar
  showSellerInfo?: boolean; // For controlling seller info display
  // PROGRESS BAR PROPS:
  showProgressBar?: boolean; // Conditionally show progress bar
  currentStep?: number; // Current step for progress bar
  totalSteps?: number; // Total steps for progress bar
  progressBarColor?: string; // Custom color for active progress
  // SETTINGS PANEL PROPS:
  currentLanguage?: Language;
  currentLocation?: Location;
  supportedLanguages?: Language[];
  onLanguageChange?: (language: Language) => void;
  onOpenLocationScreen?: () => void;
  showSettingsButton?: boolean; // Control whether to show settings button
  // NEW: Language selector props
  showLanguageSelector?: boolean; // Control whether to show language selector
}

// Header Action Button Component - Integrated directly
interface HeaderActionButtonProps {
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
  likeCount?: number;
  shareCount?: number;
}

const HeaderActionButton = ({ 
  Icon, 
  active = false, 
  onClick, 
  progress, 
  activeColor = '#f97316',
  badge,
  fillWhenActive = true,
  transform = '',
  likeCount,
  shareCount
}: HeaderActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    // Only trigger animation for heart icon
    if (Icon.name === "Heart" || Icon.displayName === "Heart") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  // Determine which count to show
  const count = likeCount ?? shareCount;

  // Improved transition thresholds for smoother animation
  const expandedThreshold = 0.2;
  const fadingThreshold = 0.4;

  // Show horizontal layout with count in non-scroll state
  if (count !== undefined && progress < expandedThreshold) {
    return (
      <div 
        className="rounded-full transition-all duration-700 hover-scale"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700 ease-out animate-fade-in"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.95 - (progress * 0.2)})`,
              opacity: 1 - (progress / expandedThreshold),
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Transitional state - fading count while shrinking
  if (count !== undefined && progress < fadingThreshold) {
    const transitionProgress = (progress - expandedThreshold) / (fadingThreshold - expandedThreshold);

    return (
      <div 
        className="rounded-full transition-all duration-700"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center h-8 px-3 rounded-full transition-all duration-700 relative"
          style={{
            gap: `${6 - (transitionProgress * 6)}px`,
          }}
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: progress > 0.5 
                ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`,
              opacity: 1 - transitionProgress,
              transform: `scaleX(${1 - transitionProgress})`,
              transformOrigin: 'left center',
              width: `${20 * (1 - transitionProgress)}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Compact circular button state (matches back button exactly)
  return (
    <div 
      className="rounded-full transition-all duration-700"
      style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
    >
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 relative"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
};

// NEW: Language Selector Component with Flags
const LanguageSelector = ({ 
  currentLanguage,
  onOpenSettings,
  progress
}: {
  currentLanguage?: Language;
  onOpenSettings: () => void;
  progress: number;
}) => {
  return (
    <button
      onClick={onOpenSettings}
      className="flex items-center gap-2 px-3 h-8 rounded-full transition-all duration-700 hover:bg-black/10"
      style={{ 
        backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})`,
        color: progress > 0.5 
          ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
          : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
      }}
    >
      {currentLanguage?.flag && (
        <img 
          src={currentLanguage.flag} 
          alt={currentLanguage.name}
          className="w-4 h-3 object-cover rounded-sm"
          onError={(e) => {
            // Fallback to globe icon if flag fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
      <span className="text-xs font-medium uppercase">
        {currentLanguage?.code || 'EN'}
      </span>
      <ChevronDown size={14} className="opacity-70" />
    </button>
  );
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
  activeSection = "overview",
  onTabChange,
  focusMode = false,
  showHeaderInFocus = false,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSearch,
  onSearchFocus,
  inPanel = false,
  showCloseIcon = false,
  onCloseClick,
  actionButtons = [],
  forceScrolledState = false,
  seller,
  onSellerClick,
  // NEW PROPS:
  title,
  hideSearch = false,
  showSellerInfo = true,
  // PROGRESS BAR PROPS:
  showProgressBar = false,
  currentStep = 1,
  totalSteps = 4,
  progressBarColor = "bg-blue-600",
  // SETTINGS PANEL PROPS:
  currentLanguage: propCurrentLanguage,
  currentLocation: propCurrentLocation,
  supportedLanguages: propSupportedLanguages,
  onLanguageChange = () => {},
  onOpenLocationScreen = () => {},
  showSettingsButton = false,
  // NEW: Language selector prop
  showLanguageSelector = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLocationScreen, setShowLocationScreen] = useState(false);

  const { progress: scrollProgress } = useScrollProgress();
  const displayProgress = forceScrolledState ? 1 : scrollProgress;
  const navigate = useNavigate();
  const { isLoading } = useNavigationLoading();

  // Use language context
  const { 
    currentLanguage: contextCurrentLanguage, 
    setLanguage, 
    supportedLanguages: contextSupportedLanguages,
    currentLocation: contextCurrentLocation
  } = useLanguageSwitcher();

  // Use props if provided, otherwise use context
  const currentLanguage = propCurrentLanguage || contextCurrentLanguage;
  const currentLocation = propCurrentLocation || contextCurrentLocation;
  
  // Enhanced supported languages with flags
  const enhancedSupportedLanguages = (propSupportedLanguages || contextSupportedLanguages || [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl' }
  ]).map(lang => ({
    ...lang,
    flag: `https://flagcdn.com/24x18/${getCountryCode(lang.code)}.png`
  }));

  // Helper function to get country code from language code
  function getCountryCode(languageCode: string): string {
    const countryMap: { [key: string]: string } = {
      'en': 'us',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
      'pt': 'pt',
      'ru': 'ru',
      'zh': 'cn',
      'ja': 'jp',
      'ko': 'kr',
      'ar': 'sa',
      'hi': 'in',
      'ht': 'ht', // Haiti for Haitian Creole
    };
    return countryMap[languageCode] || languageCode;
  }

  // Enhanced current language with flag
  const enhancedCurrentLanguage = currentLanguage ? {
    ...currentLanguage,
    flag: `https://flagcdn.com/24x18/${getCountryCode(currentLanguage.code)}.png`
  } : enhancedSupportedLanguages[0];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleLanguageChange = (language: Language) => {
    // Call the parent handler if provided
    onLanguageChange(language);

    // Call the language context setter
    setLanguage(language.code);
    setIsSettingsOpen(false);
  };

  const handleOpenLocationScreen = () => {
    setShowLocationScreen(true);
    setIsSettingsOpen(false);
    // Call the parent handler if provided
    onOpenLocationScreen();
  };

  const handleCloseLocationScreen = () => {
    setShowLocationScreen(false);
  };

  // Removed SearchPageSkeleton - just return null if loading
  if (isLoading) {
    return null;
  }

  return (
    <>
      <div
        className={`flex flex-col transition-all duration-300 ${
          focusMode && !showHeaderInFocus ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Main Header Container - Now includes progress bar */}
        <div
          className="w-full transition-all duration-700"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
            backdropFilter: `blur(${displayProgress * 8}px)`,
          }}
        >
          {/* Main Header Content */}
          <div className="py-2 px-3 w-full">
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-4">
              {/* Left side - Back button and Title */}
              <div className="flex items-center gap-3 flex-shrink-0 min-w-0 flex-1">
                <BackButton
                  progress={displayProgress}
                  showCloseIcon={showCloseIcon}
                  onClick={onCloseClick || (() => navigate(-1))}
                />

                {/* Show title next to back button when provided */}
                {title && (
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-semibold text-gray-900 truncate">
                      {title}
                    </h1>
                  </div>
                )}

                {/* Show seller info when not scrolled AND showSellerInfo is true AND no title */}
                {!title && displayProgress < 0.5 && seller && showSellerInfo && (
                  <div 
                    className="rounded-full transition-all duration-700 flex-shrink-0"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
                  >
                    <button
                      onClick={() => {
                        if (onSellerClick) {
                          onSellerClick();
                        } else {
                          navigate(`/seller/${seller.id}`);
                        }
                      }}
                      className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={seller.image_url || "https://picsum.photos/100/100?random=1"}
                          alt={`${seller.name} seller`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://picsum.photos/100/100?random=1";
                            target.onerror = null;
                          }}
                        />
                      </div>
                      <span 
                        className="text-xs font-medium transition-all duration-700"
                        style={{
                          color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
                        }}
                      >
                        {seller.name}
                      </span>
                      {seller.verified && <VerificationBadge />}
                      <span 
                        className="text-xs font-medium transition-all duration-700"
                        style={{
                          color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
                        }}
                      >
                        {seller.followers_count >= 1000000 
                          ? `${(seller.followers_count / 1000000).toFixed(1)}M`
                          : seller.followers_count >= 1000
                          ? `${(seller.followers_count / 1000).toFixed(1)}K`
                          : seller.followers_count.toString()
                        }
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {/* Language Selector - Show instead of settings button when showLanguageSelector is true */}
                {showLanguageSelector ? (
                  <LanguageSelector
                    currentLanguage={enhancedCurrentLanguage}
                    onOpenSettings={toggleSettings}
                    progress={displayProgress}
                  />
                ) : (
                  // Settings Button - Conditionally shown
                  showSettingsButton && (
                    <HeaderActionButton
                      Icon={Settings}
                      active={isSettingsOpen}
                      onClick={toggleSettings}
                      progress={displayProgress}
                      activeColor="#3b82f6"
                    />
                  )
                )}

                {/* Only show action buttons if not showing language selector (hides save button) */}
                {!showLanguageSelector && actionButtons.length > 0 ? (
                  actionButtons.map((button, index) => (
                    <HeaderActionButton
                      key={index}
                      Icon={button.Icon}
                      active={button.active}
                      onClick={button.onClick}
                      progress={displayProgress}
                      activeColor={button.activeColor}
                      likeCount={button.count}
                    />
                  ))
                ) : (
                  !showLanguageSelector && (
                    <HeaderActionButton
                      Icon={Heart}
                      active={isFavorite}
                      onClick={toggleFavorite}
                      progress={displayProgress}
                      activeColor="#f43f5e"
                      likeCount={147}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar - Now inside the same background container without border */}
          {showProgressBar && (
            <div className="px-4 py-1">
              <div className="max-w-2xl mx-auto">
                {/* Progress Bar - Bars Only */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber <= currentStep;

                    return (
                      <div
                        key={stepNumber}
                        className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                          isActive ? progressBarColor : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NO TABS HERE - Tabs are managed in SellerLayout */}
      </div>

      {/* Integrated Settings Panel */}
      <SlideUpPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Language & Settings"
        preventBodyScroll={true}
        className="p-4 space-y-6"
        dynamicHeight={true}
        maxHeight={0.95}
      >
        {/* Language Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <Globe className="h-4 w-4" />
            <span className="font-medium">Language</span>
          </div>

          {/* Language List */}
          <div className="space-y-2">
            {enhancedSupportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full p-3 text-sm rounded-lg border transition-all flex items-center justify-between ${
                  enhancedCurrentLanguage?.code === language.code
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={language.flag} 
                    alt={language.name}
                    className="h-4 w-5 object-cover rounded-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="text-left">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                </div>
                {enhancedCurrentLanguage?.code === language.code && (
                  <Check className="h-4 w-4 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Location</span>
          </div>

          <button
            onClick={handleOpenLocationScreen}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {currentLocation?.flag ? (
                <img
                  src={`https://flagcdn.com/${currentLocation.flag.toLowerCase()}.svg`}
                  alt={currentLocation.name}
                  className="h-5 w-5 rounded object-cover"
                />
              ) : (
                <MapPin className="h-5 w-5 text-orange-600" />
              )}
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {currentLocation?.name?.split(',')[0] || 'Select Location'}
                </div>
                <div className="text-xs text-gray-500">
                  {currentLocation?.name || 'Choose your location'}
                </div>
              </div>
            </div>
            <Edit className="h-4 w-4 text-gray-400 hover:text-orange-600" />
          </button>
        </div>
      </SlideUpPanel>

      {/* Location Screen Overlay */}
      {showLocationScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <button 
                onClick={handleCloseLocationScreen}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Location selection screen would appear here. This is a placeholder for the actual location selection functionality.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseLocationScreen}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseLocationScreen}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductHeader;