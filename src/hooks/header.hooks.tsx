// hooks/header.hooks.ts
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Search, TrendingUp, TrendingDown, Flame, Zap, ChevronDown, 
  MapPin, Camera, Heart, ChevronLeft 
} from 'lucide-react';
import { PiShareFat } from 'react-icons/pi';

export interface HeaderAction {
  id: string;
  icon: React.ComponentType<any>;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

export interface SearchListItem {
  term: string;
  trend?: 'hot' | 'trending-up' | 'trending-down' | 'popular';
}

export interface CategoryTab {
  id: string;
  name: string;
  path?: string;
}

export interface FilterCategory {
  id: string;
  name: string;
}

// Existing Hooks

export const useHeaderActions = (
  mode: 'home' | 'product-detail' = 'home',
  productData?: {
    favorite_count?: number;
  },
  onFavoriteClick?: () => void,
  onShareClick?: () => void,
  isFavorite: boolean = false
) => {
  const [actions, setActions] = useState<HeaderAction[]>([]);

  useEffect(() => {
    if (mode === 'product-detail') {
      const productActions: HeaderAction[] = [
        {
          id: 'favorite',
          icon: Heart,
          onClick: onFavoriteClick,
          active: isFavorite,
          activeColor: "#f43f5e",
          count: productData?.favorite_count || 0
        },
        {
          id: 'share',
          icon: PiShareFat,
          onClick: onShareClick,
          active: false,
          activeColor: "#3b82f6"
        }
      ];
      setActions(productActions);
    } else {
      setActions([]);
    }
  }, [mode, productData, onFavoriteClick, onShareClick, isFavorite]);

  const updateAction = useCallback((actionId: string, updates: Partial<HeaderAction>) => {
    setActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, ...updates } : action
    ));
  }, []);

  return { actions, updateAction };
};

export const useHeaderSearch = (
  initialQuery: string = '',
  onSubmit?: (query: string) => void
) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  const popularSearches = useMemo(() => [
    { term: "Wireless earbuds", trend: 'hot' as const },
    { term: "Smart watches", trend: 'trending-up' as const },
    { term: "Summer dresses", trend: 'hot' as const },
    { term: "Phone cases", trend: 'popular' as const },
    { term: "Home decor", trend: 'trending-down' as const },
    { term: "Fitness trackers", trend: 'trending-up' as const },
    { term: "LED strip lights", trend: 'popular' as const }
  ], []);

  // Cycle through popular searches for placeholder
  useEffect(() => {
    let currentIndex = 0;
    const updatePlaceholder = () => {
      setPlaceholder(popularSearches[currentIndex].term);
      currentIndex = (currentIndex + 1) % popularSearches.length;
    };

    updatePlaceholder();
    const interval = setInterval(updatePlaceholder, 3000);

    return () => clearInterval(interval);
  }, [popularSearches]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSubmit) {
        onSubmit(searchQuery.trim());
      }
      setSearchQuery('');
    }
  }, [searchQuery, onSubmit]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  return {
    searchQuery,
    placeholder,
    isSearchFocused,
    setSearchQuery,
    handleSubmit,
    handleClearSearch,
    handleInputChange,
    handleFocus,
    handleBlur,
    popularSearches
  };
};

export const useHeaderScroll = (mode: 'home' | 'product-detail' = 'home', scrollY: number = 0) => {
  const maxScroll = 120;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const displayProgress = mode === 'product-detail' ? scrollProgress : 0;

  const searchBarThreshold = 0.3;
  const showSearchBarInProductDetail = mode === 'product-detail' && displayProgress > searchBarThreshold;

  return {
    scrollProgress,
    displayProgress,
    showSearchBarInProductDetail
  };
};

export const useHeaderLocation = (
  initialCity: string = 'New York',
  onLocationChange?: (locationId: string) => void,
  onOpenLocationsPanel?: () => void
) => {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const locationOptions = useMemo(() => [
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'houston', name: 'Houston' },
    { id: 'miami', name: 'Miami' },
  ], []);

  const handleLocationClick = useCallback(() => {
    if (onOpenLocationsPanel) {
      onOpenLocationsPanel();
    }
    setIsLocationDropdownOpen(false);
  }, [onOpenLocationsPanel]);

  const handleLocationSelect = useCallback((locationId: string, locationName: string) => {
    setSelectedCity(locationName);
    setIsLocationDropdownOpen(false);

    if (onLocationChange) {
      onLocationChange(locationId);
    }
  }, [onLocationChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    selectedCity,
    locationOptions,
    isLocationDropdownOpen,
    locationDropdownRef,
    setSelectedCity,
    setIsLocationDropdownOpen,
    handleLocationClick,
    handleLocationSelect
  };
};

export const useHeaderFilters = (
  initialFilters: string[] = [],
  onFilterSelect?: (filterId: string) => void,
  onFilterClear?: (filterId: string) => void,
  onClearAll?: () => void
) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(initialFilters);

  const handleFilterSelect = useCallback((filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      }
      return [...prev, filterId];
    });

    if (onFilterSelect) {
      onFilterSelect(filterId);
    }
  }, [onFilterSelect]);

  const handleFilterClear = useCallback((filterId: string) => {
    setSelectedFilters(prev => prev.filter(id => id !== filterId));

    if (onFilterClear) {
      onFilterClear(filterId);
    }
  }, [onFilterClear]);

  const handleClearAll = useCallback(() => {
    setSelectedFilters([]);

    if (onClearAll) {
      onClearAll();
    }
  }, [onClearAll]);

  return {
    selectedFilters,
    handleFilterSelect,
    handleFilterClear,
    handleClearAll
  };
};

export const useHeaderTabs = (
  activeTabId: string = 'recommendations',
  customTabs?: CategoryTab[],
  onCustomTabChange?: (tabId: string) => void
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(activeTabId);

  const categories = useMemo(() => [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), path: '/categories/home-living' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), path: '/categories/kids-hobbies' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), path: '/categories/automotive' },
    { id: 'women', name: t('women', { ns: 'categories' }), path: '/categories/women' },
    { id: 'men', name: t('men', { ns: 'categories' }), path: '/categories/men' },
    { id: 'books', name: t('books', { ns: 'categories' }), path: '/categories/books' },
  ], [t]);

  const tabsToShow = customTabs || categories;

  // Update active tab when prop changes or route changes
  useEffect(() => {
    setActiveTab(activeTabId);
  }, [activeTabId, location.pathname]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);

    if (customTabs && onCustomTabChange) {
      onCustomTabChange(tabId);
    } else if (!customTabs) {
      const category = categories.find(cat => cat.id === tabId);
      if (category && category.path) {
        navigate(category.path);
      }
    }
  }, [customTabs, onCustomTabChange, categories, navigate]);

  const categoryTabsKey = useMemo(() => 
    tabsToShow.map(tab => tab.id).join('-'), 
    [tabsToShow]
  );

  return {
    activeTab,
    tabsToShow,
    categories,
    categoryTabsKey,
    handleTabChange
  };
};

export const useHeaderSearchList = (
  searchListItems?: Array<SearchListItem | string>,
  onSearchItemClick?: (searchTerm: string) => void
) => {
  const navigate = useNavigate();
  const searchListRef = useRef<HTMLDivElement>(null);

  const popularSearches = useMemo(() => [
    { term: "Wireless earbuds", trend: 'hot' as const },
    { term: "Smart watches", trend: 'trending-up' as const },
    { term: "Summer dresses", trend: 'hot' as const },
    { term: "Phone cases", trend: 'popular' as const },
    { term: "Home decor", trend: 'trending-down' as const },
    { term: "Fitness trackers", trend: 'trending-up' as const },
    { term: "LED strip lights", trend: 'popular' as const }
  ], []);

  const searchItemsToShow = useMemo(() => {
    if (!searchListItems) return popularSearches;

    const processedItems = searchListItems.map((item, index) => {
      if (typeof item === 'string') {
        const trends: Array<'hot' | 'trending-up' | 'trending-down' | 'popular'> = 
          ['hot', 'trending-up', 'popular', 'trending-down'];
        const trendIndex = index % trends.length;
        return { term: item, trend: trends[trendIndex] };
      }
      return { term: item.term, trend: item.trend || 'popular' };
    });

    return processedItems;
  }, [searchListItems, popularSearches]);

  const getTrendIcon = useMemo(() => {
    const iconMap = {
      'hot': <Flame className="h-3 w-3 mr-1.5 text-orange-500" />,
      'trending-up': <TrendingUp className="h-3 w-3 mr-1.5 text-green-500" />,
      'trending-down': <TrendingDown className="h-3 w-3 mr-1.5 text-red-500" />,
      'popular': <Zap className="h-3 w-3 mr-1.5 text-blue-500" />,
    };

    return (trend: string) => iconMap[trend as keyof typeof iconMap] || <Search className="h-3 w-3 mr-1.5 text-gray-500" />;
  }, []);

  const handleSearchItemClick = useCallback((searchTerm: string) => {
    if (onSearchItemClick) {
      onSearchItemClick(searchTerm);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  }, [onSearchItemClick, navigate]);

  return {
    searchItemsToShow,
    searchListRef,
    getTrendIcon,
    handleSearchItemClick
  };
};

export const useHeaderActionButtons = ({
  mode,
  actionButtons,
  productData,
  onFavoriteClick,
  onShareClick,
  isFavorite
}: {
  mode: 'home' | 'product-detail';
  actionButtons?: Array<{
    Icon: React.ComponentType<any>;
    onClick?: () => void;
    active?: boolean;
    activeColor?: string;
    count?: number;
  }>;
  productData?: {
    favorite_count?: number;
  };
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  isFavorite?: boolean;
}) => {
  const { actions } = useHeaderActions(mode, productData, onFavoriteClick, onShareClick, isFavorite || false);

  const defaultActionButtons = useMemo(() => {
    if (actionButtons && actionButtons.length > 0) return actionButtons;

    if (actions.length > 0) {
      return actions.map(action => ({
        Icon: action.icon,
        onClick: action.onClick,
        active: action.active,
        activeColor: action.activeColor,
        count: action.count
      }));
    }

    if (mode === 'product-detail') {
      return [
        {
          Icon: Heart,
          onClick: onFavoriteClick,
          active: isFavorite,
          activeColor: "#f43f5e",
          count: productData?.favorite_count || 0
        },
        {
          Icon: PiShareFat,
          onClick: onShareClick,
          active: false
        }
      ];
    }

    return [];
  }, [actionButtons, actions, mode, onFavoriteClick, onShareClick, isFavorite, productData]);

  return { defaultActionButtons };
};

// New Hooks

export interface UseHeaderActionButtonProps {
  Icon: React.ComponentType<any>;
  active?: boolean;
  onClick?: () => void;
  activeColor?: string;
  fillWhenActive?: boolean;
  progress: number;
  likeCount?: number;
  shareCount?: number;
  scrolled?: boolean;
  badge?: number;
}

export const useHeaderActionButton = ({
  Icon,
  active = false,
  onClick,
  activeColor = '#f97316',
  fillWhenActive = true,
  progress,
  likeCount,
  shareCount,
  scrolled = false,
  badge
}: UseHeaderActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconProps, setIconProps] = useState<Record<string, any>>({});
  
  // Determine which count to show
  const count = likeCount ?? shareCount;
  
  // Transition thresholds for smoother animation
  const expandedThreshold = 0.2;
  const fadingThreshold = 0.4;
  
  // Check icon type
  const isLucideIcon = Icon.name && typeof Icon.name === 'string';
  const isReactIcon = Icon.displayName && typeof Icon.displayName === 'string';

  useEffect(() => {
    const determineIconProps = () => {
      if (isLucideIcon) {
        return { strokeWidth: 2.5 };
      } else if (isReactIcon) {
        return {};
      }
      return {};
    };
    
    setIconProps(determineIconProps());
  }, [Icon, isLucideIcon, isReactIcon]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    // Only trigger animation for heart icon
    const isHeartIcon = Icon.name === "Heart" || Icon.displayName === "Heart";
    if (isHeartIcon) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const getIconStyle = (): { color: string; fill: string } => {
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

  const shouldShowHorizontalLayout = count !== undefined && progress < expandedThreshold;
  const shouldShowFadingCount = count !== undefined && progress < fadingThreshold;
  const shouldShowCompactButton = !shouldShowHorizontalLayout && !shouldShowFadingCount;
  
  const transitionProgress = shouldShowFadingCount 
    ? (progress - expandedThreshold) / (fadingThreshold - expandedThreshold)
    : 0;

  return {
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
  };
};

export interface UseSellerInfoProps {
  productData?: {
    sellers?: {
      id?: string;
      name?: string;
      image_url?: string;
      verified?: boolean;
      followers_count?: number;
    };
  };
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
}

export const useSellerInfo = ({ 
  productData, 
  displayProgress, 
  showSearchBarInProductDetail 
}: UseSellerInfoProps) => {
  const formatFollowerCount = (count?: number): string => {
    if (!count) return '0';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleSellerClick = () => {
    if (productData?.sellers?.id) {
      // navigate(`/seller/${productData.sellers.id}`);
      console.log(`Navigating to seller: ${productData.sellers.id}`);
    }
  };

  const shouldShowSellerInfo = displayProgress < 0.3 && 
                              productData?.sellers && 
                              !showSearchBarInProductDetail;

  const getSellerContainerStyle = (): React.CSSProperties => ({
    backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
  });

  const getSellerTextStyle = (): React.CSSProperties => ({
    color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
  });

  const getFollowerTextStyle = (): React.CSSProperties => ({
    color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
  });

  return {
    shouldShowSellerInfo,
    formatFollowerCount,
    handleSellerClick,
    getSellerContainerStyle,
    getSellerTextStyle,
    getFollowerTextStyle
  };
};

export interface UseHeaderBackgroundProps {
  mode: 'home' | 'product-detail';
  displayProgress: number;
}

export const useHeaderBackground = ({ mode, displayProgress }: UseHeaderBackgroundProps) => {
  const getHeaderStyle = (): React.CSSProperties => {
    if (mode === 'product-detail') {
      return {
        backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
        backdropFilter: displayProgress > 0 ? `blur(${displayProgress * 8}px)` : 'none',
        boxShadow: displayProgress > 0.1 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
      };
    }
    
    return {
      backgroundColor: 'white'
    };
  };

  return {
    getHeaderStyle
  };
};

export interface UseHeaderSearchBarProps {
  searchQuery: string;
  placeholder: string;
  flatBorders: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleClearSearch: () => void;
}

export const useHeaderSearchBar = ({
  searchQuery,
  placeholder,
  flatBorders,
  handleSubmit,
  handleInputChange,
  handleFocus,
  handleClearSearch
}: UseHeaderSearchBarProps) => {
  const getInputClassName = (): string => {
    const baseClass = `
      w-full px-3 py-1 pr-10 text-sm font-medium text-gray-900 bg-white 
      transition-all duration-300 shadow-sm placeholder-gray-500
    `;
    
    const borderClass = flatBorders 
      ? 'rounded-none border-2 border-gray-900' 
      : 'rounded-full border-2 border-gray-800';
    
    return `${baseClass} ${borderClass}`;
  };

  return {
    getInputClassName
  };
};

export interface UseHeaderIconProps {
  Icon: React.ComponentType<any>;
  inPanel?: boolean;
}

export const useHeaderIcon = ({ Icon, inPanel = false }: UseHeaderIconProps) => {
  const getIconComponent = (): React.ComponentType<any> => {
    return inPanel ? X : ChevronLeft;
  };

  const getIconStrokeWidth = (): number => {
    return 2.5; // Default for lucide icons
  };

  return {
    IconComponent: getIconComponent(),
    iconStrokeWidth: getIconStrokeWidth()
  };
};

export interface UseHeaderRightIconsProps {
  searchQuery: string;
  handleClearSearch: () => void;
  selectedCity: string;
  locationDropdownRef: React.RefObject<HTMLDivElement>;
  handleLocationClick: () => void;
  flatBorders: boolean;
}

export const useHeaderRightIcons = ({
  searchQuery,
  handleClearSearch,
  selectedCity,
  locationDropdownRef,
  handleLocationClick,
  flatBorders
}: UseHeaderRightIconsProps) => {
  const handleCameraClick = () => {
    console.log('Camera button clicked');
    // Add camera logic here
  };

  const getLocationButtonClassName = (): string => {
    const baseClass = `
      flex items-center justify-between gap-1.5
      px-2.5 py-1
      text-xs font-medium text-gray-600 
      bg-gray-100 hover:bg-gray-200
      transition-all duration-200
    `;
    
    const borderRadiusClass = flatBorders ? 'rounded-none' : 'rounded-full';
    
    return `${baseClass} ${borderRadiusClass}`;
  };

  return {
    handleCameraClick,
    getLocationButtonClassName
  };
};