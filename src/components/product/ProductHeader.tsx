import React, { useState } from "react";
import { 
  Heart, 
  Search,
  Settings,
  LucideIcon
} from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

// Language and Location interfaces
interface Language {
  code: string;
  name: string;
  nativeName: string;
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
  currentLanguage = { code: 'en', name: 'English', nativeName: 'English' },
  currentLocation = { name: 'United States', flag: 'us' },
  supportedLanguages = [],
  onLanguageChange = () => {},
  onOpenLocationScreen = () => {},
  showSettingsButton = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [languageQuery, setLanguageQuery] = useState('');
  const [pinnedLanguages, setPinnedLanguages] = useState(new Set(['en', 'es']));
  const { progress: scrollProgress } = useScrollProgress();
  const displayProgress = forceScrolledState ? 1 : scrollProgress;
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isLoading } = useNavigationLoading();

  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
    setLanguageQuery(''); // Clear search when language is selected
  };

  const handleToggleLanguagePin = (languageCode: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setPinnedLanguages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(languageCode)) {
        newSet.delete(languageCode);
      } else {
        newSet.add(languageCode);
      }
      return newSet;
    });
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
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
              {/* Left side - Back button and Seller Info */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <BackButton
                  progress={displayProgress}
                  showCloseIcon={showCloseIcon}
                  onClick={onCloseClick || (() => navigate(-1))}
                />

                {/* Show seller info when not scrolled AND showSellerInfo is true */}
                {displayProgress < 0.5 && seller && showSellerInfo && (
                  <div 
                    className="rounded-full transition-all duration-700"
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

              {/* Center - Title or Search bar */}
              <div className="flex-1 mx-4">
                {title ? (
                  // Show title when provided
                  <div className="text-center">
                    <h1 className="text-lg font-semibold text-gray-900 truncate">
                      {title}
                    </h1>
                  </div>
                ) : (
                  // Show search bar when scrolled (unless hideSearch is true)
                  !hideSearch && displayProgress >= 0.5 && (
                    <div className="flex-1 relative max-w-md mx-auto">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (onSearchFocus) {
                            onSearchFocus();
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchSubmit();
                          }
                        }}
                        className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
                    </div>
                  )
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {/* Settings Button - Conditionally shown */}
                {showSettingsButton && (
                  <HeaderActionButton
                    Icon={Settings}
                    active={isSettingsOpen}
                    onClick={toggleSettings}
                    progress={displayProgress}
                    activeColor="#3b82f6"
                  />
                )}
                
                {actionButtons.length > 0 ? (
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
                  <HeaderActionButton
                    Icon={Heart}
                    active={isFavorite}
                    onClick={toggleFavorite}
                    progress={displayProgress}
                    activeColor="#f43f5e"
                    likeCount={147}
                  />
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
     {/* Integrated Settings Panel */}
<SlideUpPanel
  isOpen={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
  title="Settings"
  preventBodyScroll={true}
  className="p-4 space-y-6"
  dynamicHeight={true} // Add this to allow dynamic height
  maxHeight={0.95} // Increase max height to 95% of screen
>
  {/* Language Section */}
  <div className="space-y-3">
    <div className="flex items-center space-x-2 text-gray-700">
      <span className="font-medium">Language</span>
    </div>

    {/* Language Search Input */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search languages..."
        value={languageQuery}
        onChange={(e) => setLanguageQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>

    {/* Current Language Display */}
    <div className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="text-left">
          <div className="font-medium text-gray-900">
            {currentLanguage.nativeName || currentLanguage.name || 'English'}
          </div>
          <div className="text-xs text-gray-500">
            {currentLanguage.name || 'English'} • {currentLanguage.code.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {pinnedLanguages.has(currentLanguage.code) && (
          <span className="h-4 w-4 text-orange-600">📍</span>
        )}
        <span className="h-4 w-4 text-orange-600">✓</span>
      </div>
    </div>

    {/* Language Grid */}
    <div className="grid grid-cols-2 gap-2">
      {supportedLanguages
        .filter((lang) =>
          lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
          lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
        )
        .slice(0, 4)
        .map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`p-2 text-sm rounded-lg border transition-all flex items-center justify-between ${
              currentLanguage.code === language.code
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{language.nativeName}</span>
            <button
              onClick={(e) => handleToggleLanguagePin(language.code, e)}
              className={`p-1 rounded ${
                pinnedLanguages.has(language.code) 
                  ? 'text-orange-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`h-3 w-3 ${pinnedLanguages.has(language.code) ? 'text-orange-600' : ''}`}>
                📍
              </span>
            </button>
          </button>
        ))}
    </div>

    {/* Show more languages if there are more than 4 */}
    {supportedLanguages.filter((lang) =>
      lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
    ).length > 4 && (
      <div className="text-center">
        <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
          Show {supportedLanguages.filter((lang) =>
            lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
            lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
          ).length - 4} more languages
        </button>
      </div>
    )}
  </div>

  {/* Location Section */}
  <div className="space-y-3">
    <div className="flex items-center space-x-2 text-gray-700">
      <span className="font-medium">Location</span>
    </div>

    <button
      onClick={onOpenLocationScreen}
      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        {currentLocation.flag ? (
          <img
            src={`https://flagcdn.com/${currentLocation.flag.toLowerCase()}.svg`}
            alt={currentLocation.name}
            className="h-5 w-5 rounded object-cover"
          />
        ) : (
          <span className="h-5 w-5 text-orange-600">📍</span>
        )}
        <div className="text-left">
          <div className="font-medium text-gray-900">
            {currentLocation.name.split(',')[0]}
          </div>
          <div className="text-xs text-gray-500">
            {currentLocation.name}
          </div>
        </div>
      </div>
      <span className="h-4 w-4 text-gray-400 hover:text-orange-600">✏️</span>
    </button>
  </div>
</SlideUpPanel>
    </>
  );
};

export default ProductHeader;