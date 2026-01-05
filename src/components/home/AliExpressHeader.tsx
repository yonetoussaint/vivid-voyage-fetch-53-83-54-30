// components/home/AliExpressHeader.tsx
import { useState, useEffect } from 'react';
import CategoryTabs from './header/CategoryTabs';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { X,Heart, Camera, MapPin, ChevronDown, ChevronLeft, MoreHorizontal, Share2, Flag } from 'lucide-react';
import {
  useHeaderSearch,
  useHeaderScroll,
  useHeaderLocation,
  useHeaderTabs,
  useHeaderActionButtons,
  useHeaderActionButton,
  useSellerInfo,
  useHeaderBackground,
  useHeaderSearchBar,
  useHeaderIcon,
  useHeaderRightIcons
} from '@/hooks/header.hooks';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;

  cityName?: string;
  locationOptions?: Array<{ id: string; name: string }>;
  onLocationChange?: (locationId: string) => void;
  onOpenLocationsPanel?: () => void;

  mode?: 'home' | 'product-detail';
  scrollY?: number;
  productData?: {
    sellers?: {
      id?: string;
      name?: string;
      image_url?: string;
      verified?: boolean;
      followers_count?: number;
    };
    favorite_count?: number;
  };
  onBackClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
  isFavorite?: boolean;
  inPanel?: boolean;
  actionButtons?: Array<{
    Icon: React.ComponentType<any>;
    onClick?: () => void;
    active?: boolean;
    activeColor?: string;
    count?: number;
  }>;
  hideSearchBar?: boolean;
  onSearchSubmit?: (query: string) => void;
}

// Inline Header Action Button Component
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
  shareCount,
  scrolled = false
}: {
  Icon: React.ComponentType<any>;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
  likeCount?: number;
  shareCount?: number;
  scrolled?: boolean;
}) => {
  const {
    isAnimating,
    iconProps,
    count,
    shouldShowHorizontalLayout,
    shouldShowFadingCount,
    shouldShowCompactButton,
    transitionProgress,
    handleClick,
    getIconStyle,
    expandedThreshold,
    fadingThreshold
  } = useHeaderActionButton({
    Icon,
    active,
    onClick,
    activeColor,
    fillWhenActive,
    progress,
    likeCount,
    shareCount,
    scrolled,
    badge
  });

  const iconStyle = getIconStyle();

  // When scrolled, show simple button without background
  if (scrolled) {
    return (
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
      >
        <Icon
          size={20}
          {...iconProps}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Show horizontal layout with count in non-scroll state
  if (shouldShowHorizontalLayout) {
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
            {...iconProps}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={iconStyle}
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
  if (shouldShowFadingCount) {
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
            {...iconProps}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={iconStyle}
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

  // Compact circular button state (for transition before scrolled)
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
          {...iconProps}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
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

// Three Dots Menu Component
const ThreeDotsMenu = ({
  onShareClick,
  onReportClick,
  displayProgress,
  showSearchBarInProductDetail
}: {
  onShareClick?: () => void;
  onReportClick?: () => void;
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShareClick = () => {
    setIsMenuOpen(false);
    onShareClick?.();
  };

  const handleReportClick = () => {
    setIsMenuOpen(false);
    onReportClick?.();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Three Dots Button */}
      <div 
        className="rounded-full transition-all duration-700 hover-scale"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
      >
        <button
          onClick={toggleMenu}
          className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 relative"
          style={{
            backgroundColor: showSearchBarInProductDetail ? 'transparent' : undefined
          }}
        >
          <MoreHorizontal
            size={20}
            className="transition-all duration-700"
            style={{
              color: showSearchBarInProductDetail
                ? `rgba(75, 85, 99, 0.9)`
                : displayProgress > 0.5 
                  ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                  : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
            }}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
          <button
            onClick={handleShareClick}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-3" />
            Share
          </button>
          <button
            onClick={handleReportClick}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Flag className="h-4 w-4 mr-3" />
            Report
          </button>
          {/* Add more menu items as needed */}
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="ml-7">Save</span>
          </button>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="ml-7">Follow</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function AliExpressHeader({
  activeTabId = 'recommendations',
  showCategoryTabs = true,
  customTabs,
  onCustomTabChange,
  cityName = 'New York',
  onLocationChange,
  onOpenLocationsPanel,
  mode = 'home',
  scrollY = 0,
  productData,
  onBackClick,
  onFavoriteClick,
  onShareClick,
  onReportClick,
  isFavorite = false,
  inPanel = false,
  actionButtons = [],
  hideSearchBar = false,
  onSearchSubmit,
}: AliExpressHeaderProps) {
  const {
    displayProgress,
    showSearchBarInProductDetail
  } = useHeaderScroll(mode, scrollY);

  const {
    activeTab,
    tabsToShow,
    categoryTabsKey,
    handleTabChange
  } = useHeaderTabs(activeTabId, customTabs, onCustomTabChange);

  const {
    searchQuery,
    placeholder,
    handleSubmit,
    handleClearSearch,
    handleInputChange,
    handleFocus
  } = useHeaderSearch('', onSearchSubmit);

  const {
    selectedCity,
    locationDropdownRef,
    handleLocationClick
  } = useHeaderLocation(cityName, onLocationChange, onOpenLocationsPanel);

  const {
    defaultActionButtons
  } = useHeaderActionButtons({
    mode,
    actionButtons,
    productData,
    onFavoriteClick,
    onShareClick,
    isFavorite
  });

  const { getHeaderStyle } = useHeaderBackground({ mode, displayProgress });
  const { getInputClassName } = useHeaderSearchBar({
    searchQuery,
    placeholder,
    handleSubmit,
    handleInputChange,
    handleFocus,
    handleClearSearch
  });
  const { IconComponent, iconStrokeWidth } = useHeaderIcon({ Icon: inPanel ? X : ChevronLeft, inPanel });
  const { 
    shouldShowSellerInfo,
    formatFollowerCount,
    handleSellerClick,
    getSellerContainerStyle,
    getSellerTextStyle,
    getFollowerTextStyle
  } = useSellerInfo({
    productData,
    displayProgress,
    showSearchBarInProductDetail
  });
  const {
    handleCameraClick,
    getLocationButtonClassName
  } = useHeaderRightIcons({
    searchQuery,
    handleClearSearch,
    selectedCity,
    locationDropdownRef,
    handleLocationClick
  });

  return (
    <header 
      className="fixed top-0 w-full z-40" 
      style={getHeaderStyle()}
    >
      {/* Header content based on mode */}
      {mode === 'home' && !hideSearchBar ? (
        <HomeHeader 
          searchQuery={searchQuery}
          placeholder={placeholder}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
          selectedCity={selectedCity}
          locationDropdownRef={locationDropdownRef}
          handleLocationClick={handleLocationClick}
          getInputClassName={getInputClassName}
          handleCameraClick={handleCameraClick}
          getLocationButtonClassName={getLocationButtonClassName}
        />
      ) : mode === 'product-detail' ? (
        <ProductDetailHeader
          displayProgress={displayProgress}
          showSearchBarInProductDetail={showSearchBarInProductDetail}
          productData={productData}
          onBackClick={onBackClick}
          onFavoriteClick={onFavoriteClick}
          onShareClick={onShareClick}
          onReportClick={onReportClick}
          isFavorite={isFavorite}
          inPanel={inPanel}
          IconComponent={IconComponent}
          iconStrokeWidth={iconStrokeWidth}
          searchQuery={searchQuery}
          placeholder={placeholder}
          getInputClassName={getInputClassName}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
          defaultActionButtons={defaultActionButtons}
          shouldShowSellerInfo={shouldShowSellerInfo}
          formatFollowerCount={formatFollowerCount}
          handleSellerClick={handleSellerClick}
          getSellerContainerStyle={getSellerContainerStyle}
          getSellerTextStyle={getSellerTextStyle}
          getFollowerTextStyle={getFollowerTextStyle}
        />
      ) : null}

      {/* Optional Category Tabs Below Header */}
      {mode === 'home' && showCategoryTabs && (
        <CategoryTabsSection
          categoryTabsKey={categoryTabsKey}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabsToShow={tabsToShow}
        />
      )}
    </header>
  );
}

// Sub-components for better organization
const HomeHeader = ({
  searchQuery,
  placeholder,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch,
  selectedCity,
  locationDropdownRef,
  handleLocationClick,
  getInputClassName,
  handleCameraClick,
  getLocationButtonClassName
}: {
  searchQuery: string;
  placeholder: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
  selectedCity: string;
  locationDropdownRef: React.RefObject<HTMLDivElement>;
  handleLocationClick: () => void;
  getInputClassName: () => string;
  handleCameraClick: () => void;
  getLocationButtonClassName: () => string;
}) => (
  <div className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white" style={{ height: '36px' }}>
    <div className="flex-1 relative max-w-full mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className={getInputClassName()}
          />
          <RightIcons
            searchQuery={searchQuery}
            handleClearSearch={handleClearSearch}
            selectedCity={selectedCity}
            locationDropdownRef={locationDropdownRef}
            handleLocationClick={handleLocationClick}
            handleCameraClick={handleCameraClick}
            getLocationButtonClassName={getLocationButtonClassName}
          />
        </div>
      </form>
    </div>
  </div>
);

const RightIcons = ({
  searchQuery,
  handleClearSearch,
  selectedCity,
  locationDropdownRef,
  handleLocationClick,
  handleCameraClick,
  getLocationButtonClassName
}: {
  searchQuery: string;
  handleClearSearch: () => void;
  selectedCity: string;
  locationDropdownRef: React.RefObject<HTMLDivElement>;
  handleLocationClick: () => void;
  handleCameraClick: () => void;
  getLocationButtonClassName: () => string;
}) => (
  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
    {searchQuery.trim() ? (
      <button
        type="button"
        onClick={handleClearSearch}
        className="p-1 hover:bg-gray-100 transition-colors"
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>
    ) : (
      <>
        <button
          type="button"
          className="p-1 transition-colors"
          onClick={handleCameraClick}
        >
          <Camera className="h-6 w-6 text-gray-900 font-bold stroke-[1.5]" />
        </button>
        <div className="relative" ref={locationDropdownRef}>
          <button
            type="button"
            onClick={handleLocationClick}
            className={getLocationButtonClassName()}
          >
            <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="max-w-[80px] truncate">{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
          </button>
        </div>
      </>
    )}
  </div>
);

const ProductDetailHeader = ({
  displayProgress,
  showSearchBarInProductDetail,
  productData,
  onBackClick,
  onFavoriteClick,
  onShareClick,
  onReportClick,
  isFavorite,
  inPanel,
  IconComponent,
  iconStrokeWidth,
  searchQuery,
  placeholder,
  getInputClassName,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch,
  defaultActionButtons,
  shouldShowSellerInfo,
  formatFollowerCount,
  handleSellerClick,
  getSellerContainerStyle,
  getSellerTextStyle,
  getFollowerTextStyle
}: {
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  productData?: any;
  onBackClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
  isFavorite: boolean;
  inPanel: boolean;
  IconComponent: React.ComponentType<any>;
  iconStrokeWidth: number;
  searchQuery: string;
  placeholder: string;
  getInputClassName: () => string;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
  defaultActionButtons: Array<any>;
  shouldShowSellerInfo: boolean;
  formatFollowerCount: (count?: number) => string;
  handleSellerClick: () => void;
  getSellerContainerStyle: () => React.CSSProperties;
  getSellerTextStyle: () => React.CSSProperties;
  getFollowerTextStyle: () => React.CSSProperties;
}) => (
  <div className="py-2 px-3 w-full">
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      <LeftSection
        displayProgress={displayProgress}
        showSearchBarInProductDetail={showSearchBarInProductDetail}
        productData={productData}
        onBackClick={onBackClick}
        IconComponent={IconComponent}
        iconStrokeWidth={iconStrokeWidth}
        shouldShowSellerInfo={shouldShowSellerInfo}
        formatFollowerCount={formatFollowerCount}
        handleSellerClick={handleSellerClick}
        getSellerContainerStyle={getSellerContainerStyle}
        getSellerTextStyle={getSellerTextStyle}
        getFollowerTextStyle={getFollowerTextStyle}
      />
      {showSearchBarInProductDetail && (
        <SearchBarSection
          searchQuery={searchQuery}
          placeholder={placeholder}
          getInputClassName={getInputClassName}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
        />
      )}
      <ActionButtonsSection
        displayProgress={displayProgress}
        showSearchBarInProductDetail={showSearchBarInProductDetail}
        onFavoriteClick={onFavoriteClick}
        onShareClick={onShareClick}
        onReportClick={onReportClick}
        isFavorite={isFavorite}
        productData={productData}
      />
    </div>
  </div>
);

const LeftSection = ({
  displayProgress,
  showSearchBarInProductDetail,
  productData,
  onBackClick,
  IconComponent,
  iconStrokeWidth,
  shouldShowSellerInfo,
  formatFollowerCount,
  handleSellerClick,
  getSellerContainerStyle,
  getSellerTextStyle,
  getFollowerTextStyle
}: {
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  productData?: any;
  onBackClick?: () => void;
  IconComponent: React.ComponentType<any>;
  iconStrokeWidth: number;
  shouldShowSellerInfo: boolean;
  formatFollowerCount: (count?: number) => string;
  handleSellerClick: () => void;
  getSellerContainerStyle: () => React.CSSProperties;
  getSellerTextStyle: () => React.CSSProperties;
  getFollowerTextStyle: () => React.CSSProperties;
}) => (
  <div className="flex items-center flex-shrink-0">
    <button 
      className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
      onClick={onBackClick}
      style={{
        backgroundColor: showSearchBarInProductDetail 
          ? 'transparent' 
          : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
      }}
    >
      <IconComponent
        size={24}
        strokeWidth={iconStrokeWidth}
        className="transition-all duration-700"
        style={{
          color: showSearchBarInProductDetail
            ? `rgba(75, 85, 99, 0.9)`
            : displayProgress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
        }}
      />
    </button>
    {shouldShowSellerInfo && productData?.sellers && (
      <SellerInfo 
        productData={productData}
        formatFollowerCount={formatFollowerCount}
        handleSellerClick={handleSellerClick}
        getSellerContainerStyle={getSellerContainerStyle}
        getSellerTextStyle={getSellerTextStyle}
        getFollowerTextStyle={getFollowerTextStyle}
      />
    )}
  </div>
);

const SellerInfo = ({ 
  productData, 
  formatFollowerCount,
  handleSellerClick,
  getSellerContainerStyle,
  getSellerTextStyle,
  getFollowerTextStyle
}: { 
  productData: any; 
  formatFollowerCount: (count?: number) => string;
  handleSellerClick: () => void;
  getSellerContainerStyle: () => React.CSSProperties;
  getSellerTextStyle: () => React.CSSProperties;
  getFollowerTextStyle: () => React.CSSProperties;
}) => (
  <div 
    className="ml-2 rounded-full transition-all duration-700 flex-shrink-0"
    style={getSellerContainerStyle()}
  >
    <button
      onClick={handleSellerClick}
      className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
    >
      <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
        <img 
          src={productData.sellers.image_url || "https://picsum.photos/100/100?random=1"}
          alt={`${productData.sellers.name} seller`}
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
        style={getSellerTextStyle()}
      >
        {productData.sellers.name}
      </span>
      {productData.sellers.verified && <VerificationBadge />}
      <span 
        className="text-xs font-medium transition-all duration-700"
        style={getFollowerTextStyle()}
      >
        {formatFollowerCount(productData.sellers.followers_count)}
      </span>
    </button>
  </div>
);

const SearchBarSection = ({
  searchQuery,
  placeholder,
  getInputClassName,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch
}: {
  searchQuery: string;
  placeholder: string;
  getInputClassName: () => string;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
}) => (
  <div className="flex-1 px-2">
    <div className="relative max-w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className={getInputClassName()}
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  </div>
);

const ActionButtonsSection = ({
  displayProgress,
  showSearchBarInProductDetail,
  onFavoriteClick,
  onShareClick,
  onReportClick,
  isFavorite,
  productData
}: {
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
  isFavorite: boolean;
  productData?: any;
}) => (
  <div className="flex gap-1 flex-shrink-0">
    {/* Favorite/Like Button */}
    <HeaderActionButton
      Icon={Heart}
      active={isFavorite}
      onClick={onFavoriteClick}
      progress={displayProgress}
      activeColor="#f97316"
      likeCount={productData?.favorite_count || 0}
      scrolled={showSearchBarInProductDetail}
    />
    
    {/* Three Dots Menu */}
    <ThreeDotsMenu
      onShareClick={onShareClick}
      onReportClick={onReportClick}
      displayProgress={displayProgress}
      showSearchBarInProductDetail={showSearchBarInProductDetail}
    />
  </div>
);

const CategoryTabsSection = ({
  categoryTabsKey,
  activeTab,
  handleTabChange,
  tabsToShow
}: {
  categoryTabsKey: string;
  activeTab: string;
  handleTabChange: (tabId: string) => void;
  tabsToShow: Array<any>;
}) => (
  <div className="relative overflow-hidden">
    <CategoryTabs 
      key={categoryTabsKey}
      progress={1}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      categories={tabsToShow}
      isSearchOverlayActive={false}
    />
  </div>
);