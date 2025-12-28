// components/home/AliExpressHeader.tsx
import { useState, useEffect } from 'react';
import CategoryTabs from './header/CategoryTabs';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { X, Camera, MapPin, ChevronDown, ChevronLeft } from 'lucide-react';
import {
  useHeaderSearch,
  useHeaderScroll,
  useHeaderLocation,
  useHeaderTabs,
  useHeaderSearchList,
  useHeaderActionButtons
} from '@/hooks/header.hooks';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;

  showSearchList?: boolean;
  searchListItems?: Array<{ term: string; trend?: 'hot' | 'trending-up' | 'trending-down' | 'popular' }> | string[];
  onSearchItemClick?: (searchTerm: string) => void;
  flatBorders?: boolean;

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconProps, setIconProps] = useState<Record<string, any>>({});

  // Check if it's a lucide icon or react-icon
  useEffect(() => {
    const isLucideIcon = Icon.name && typeof Icon.name === 'string';
    const isReactIcon = Icon.displayName && typeof Icon.displayName === 'string';

    if (isLucideIcon) {
      setIconProps({ strokeWidth: 2.5 });
    } else if (isReactIcon) {
      setIconProps({});
    }
  }, [Icon]);

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

  // Check icon type
  const isLucideIcon = Icon.name && typeof Icon.name === 'string';
  const isReactIcon = Icon.displayName && typeof Icon.displayName === 'string';

  // Get appropriate color and fill based on icon type
  const getIconStyle = () => {
    const baseColor = progress > 0.5 
      ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
      : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`;

    const scrolledColor = 'rgba(75, 85, 99, 0.9)';

    if (scrolled) {
      return {
        color: scrolledColor,
        fill: isReactIcon ? scrolledColor : (active && fillWhenActive ? activeColor : 'transparent')
      };
    }

    if (isReactIcon) {
      return {
        color: baseColor,
        fill: active && fillWhenActive ? activeColor : baseColor
      };
    }

    // Lucide icons
    return {
      color: baseColor,
      fill: active && fillWhenActive ? activeColor : 'transparent'
    };
  };

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

export default function AliExpressHeader({
  activeTabId = 'recommendations',
  showCategoryTabs = true,
  customTabs,
  onCustomTabChange,
  showSearchList = false,
  searchListItems,
  onSearchItemClick,
  flatBorders = true,
  cityName = 'New York',
  onLocationChange,
  onOpenLocationsPanel,
  mode = 'home',
  scrollY = 0,
  productData,
  onBackClick,
  onFavoriteClick,
  onShareClick,
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
    searchItemsToShow,
    searchListRef,
    getTrendIcon,
    handleSearchItemClick
  } = useHeaderSearchList(searchListItems, onSearchItemClick);

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

  const IconComponent = inPanel ? X : ChevronLeft;

  return (
    <header 
      className="fixed top-0 w-full z-40" 
      style={{ 
        margin: 0, 
        padding: 0, 
        boxShadow: 'none',
        backgroundColor: mode === 'product-detail' 
          ? `rgba(255, 255, 255, ${displayProgress * 0.95})` 
          : 'white',
        backdropFilter: mode === 'product-detail' && displayProgress > 0 ? `blur(${displayProgress * 8}px)` : 'none',
        boxShadow: mode === 'product-detail' && displayProgress > 0.1 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      {/* Header content based on mode */}
      {mode === 'home' && !hideSearchBar ? (
        <HomeHeader 
          searchQuery={searchQuery}
          placeholder={placeholder}
          flatBorders={flatBorders}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
          selectedCity={selectedCity}
          locationDropdownRef={locationDropdownRef}
          handleLocationClick={handleLocationClick}
        />
      ) : mode === 'product-detail' ? (
        <ProductDetailHeader
          displayProgress={displayProgress}
          showSearchBarInProductDetail={showSearchBarInProductDetail}
          productData={productData}
          onBackClick={onBackClick}
          inPanel={inPanel}
          IconComponent={IconComponent}
          searchQuery={searchQuery}
          placeholder={placeholder}
          flatBorders={flatBorders}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
          defaultActionButtons={defaultActionButtons}
        />
      ) : null}

      {/* Optional Element Below Header */}
      {mode === 'home' && showCategoryTabs ? (
        <CategoryTabsSection
          categoryTabsKey={categoryTabsKey}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabsToShow={tabsToShow}
        />
      ) : mode === 'home' && showSearchList ? (
        <SearchListSection
          searchListRef={searchListRef}
          searchItemsToShow={searchItemsToShow}
          getTrendIcon={getTrendIcon}
          handleSearchItemClick={handleSearchItemClick}
          flatBorders={flatBorders}
        />
      ) : null}
    </header>
  );
}

// Sub-components for better organization
const HomeHeader = ({
  searchQuery,
  placeholder,
  flatBorders,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch,
  selectedCity,
  locationDropdownRef,
  handleLocationClick
}: {
  searchQuery: string;
  placeholder: string;
  flatBorders: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
  selectedCity: string;
  locationDropdownRef: React.RefObject<HTMLDivElement>;
  handleLocationClick: () => void;
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
            className={`
              w-full px-3 py-1 pr-16 text-sm font-medium text-gray-900 bg-white 
              transition-all duration-300 shadow-sm placeholder-gray-500
              ${flatBorders ? 'rounded-none border-2 border-gray-900' : 'rounded-full border-2 border-gray-800'}
            `}
          />
          <RightIcons
            searchQuery={searchQuery}
            handleClearSearch={handleClearSearch}
            selectedCity={selectedCity}
            locationDropdownRef={locationDropdownRef}
            handleLocationClick={handleLocationClick}
            flatBorders={flatBorders}
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
  flatBorders
}: {
  searchQuery: string;
  handleClearSearch: () => void;
  selectedCity: string;
  locationDropdownRef: React.RefObject<HTMLDivElement>;
  handleLocationClick: () => void;
  flatBorders: boolean;
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
          onClick={() => console.log('Camera button clicked')}
        >
          <Camera className="h-6 w-6 text-gray-900 font-bold stroke-[1.5]" />
        </button>
        <div className="relative" ref={locationDropdownRef}>
          <button
            type="button"
            onClick={handleLocationClick}
            className={`
              flex items-center justify-between gap-1.5
              px-2.5 py-1
              text-xs font-medium text-gray-600 
              bg-gray-100 hover:bg-gray-200
              transition-all duration-200
              ${flatBorders ? 'rounded-none' : 'rounded-full'}
            `}
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
  inPanel,
  IconComponent,
  searchQuery,
  placeholder,
  flatBorders,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch,
  defaultActionButtons
}: {
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  productData?: any;
  onBackClick?: () => void;
  inPanel: boolean;
  IconComponent: React.ComponentType<any>;
  searchQuery: string;
  placeholder: string;
  flatBorders: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
  defaultActionButtons: Array<any>;
}) => (
  <div className="py-2 px-3 w-full">
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      <LeftSection
        displayProgress={displayProgress}
        showSearchBarInProductDetail={showSearchBarInProductDetail}
        productData={productData}
        onBackClick={onBackClick}
        inPanel={inPanel}
        IconComponent={IconComponent}
      />
      {showSearchBarInProductDetail && (
        <SearchBarSection
          searchQuery={searchQuery}
          placeholder={placeholder}
          flatBorders={flatBorders}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFocus={handleFocus}
          handleClearSearch={handleClearSearch}
        />
      )}
      <ActionButtonsSection
        defaultActionButtons={defaultActionButtons}
        displayProgress={displayProgress}
        showSearchBarInProductDetail={showSearchBarInProductDetail}
      />
    </div>
  </div>
);

const LeftSection = ({
  displayProgress,
  showSearchBarInProductDetail,
  productData,
  onBackClick,
  inPanel,
  IconComponent
}: {
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  productData?: any;
  onBackClick?: () => void;
  inPanel: boolean;
  IconComponent: React.ComponentType<any>;
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
        strokeWidth={2.5}
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
    {displayProgress < 0.3 && productData?.sellers && !showSearchBarInProductDetail && (
      <SellerInfo productData={productData} displayProgress={displayProgress} />
    )}
  </div>
);

const SellerInfo = ({ productData, displayProgress }: { productData: any; displayProgress: number }) => (
  <div 
    className="ml-2 rounded-full transition-all duration-700 flex-shrink-0"
    style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
  >
    <button
      onClick={() => {
        if (productData?.sellers?.id) {
          // navigate(`/seller/${productData.sellers.id}`);
        }
      }}
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
        style={{
          color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
        }}
      >
        {productData.sellers.name}
      </span>
      {productData.sellers.verified && <VerificationBadge />}
      <span 
        className="text-xs font-medium transition-all duration-700"
        style={{
          color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
        }}
      >
        {productData.sellers.followers_count && productData.sellers.followers_count >= 1000000 
          ? `${(productData.sellers.followers_count / 1000000).toFixed(1)}M`
          : productData.sellers.followers_count && productData.sellers.followers_count >= 1000
          ? `${(productData.sellers.followers_count / 1000).toFixed(1)}K`
          : productData.sellers.followers_count?.toString() || '0'
        }
      </span>
    </button>
  </div>
);

const SearchBarSection = ({
  searchQuery,
  placeholder,
  flatBorders,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch
}: {
  searchQuery: string;
  placeholder: string;
  flatBorders: boolean;
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
            className={`
              w-full px-3 py-1 pr-10 text-sm font-medium text-gray-900 bg-white 
              transition-all duration-300 shadow-sm placeholder-gray-500
              ${flatBorders ? 'rounded-none border-2 border-gray-900' : 'rounded-full border-2 border-gray-800'}
            `}
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
  defaultActionButtons,
  displayProgress,
  showSearchBarInProductDetail
}: {
  defaultActionButtons: Array<any>;
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
}) => (
  <div className="flex gap-1 flex-shrink-0">
    {defaultActionButtons.map((button, index) => (
      <HeaderActionButton
        key={index}
        Icon={button.Icon}
        active={button.active}
        onClick={button.onClick}
        progress={displayProgress}
        activeColor={button.activeColor}
        likeCount={button.count}
        scrolled={showSearchBarInProductDetail}
      />
    ))}
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

const SearchListSection = ({
  searchListRef,
  searchItemsToShow,
  getTrendIcon,
  handleSearchItemClick,
  flatBorders
}: {
  searchListRef: React.RefObject<HTMLDivElement>;
  searchItemsToShow: Array<any>;
  getTrendIcon: (trend: string) => JSX.Element;
  handleSearchItemClick: (term: string) => void;
  flatBorders: boolean;
}) => (
  <div className="bg-white">
    <div 
      ref={searchListRef}
      className="relative overflow-x-auto scrollbar-hide"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <div className="flex px-2 py-1 space-x-2 min-w-max">
        {searchItemsToShow.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSearchItemClick(item.term)}
            className={`
              flex items-center justify-center
              px-3 py-1
              text-xs font-medium
              whitespace-nowrap
              transition-all duration-200
              ${flatBorders ? 'rounded-none' : 'rounded-full'}
              bg-gray-100
              text-gray-700
              hover:bg-gray-200
              hover:text-gray-900
              active:bg-gray-300
              focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1
            `}
          >
            {getTrendIcon(item.trend)}
            {item.term}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  </div>
);