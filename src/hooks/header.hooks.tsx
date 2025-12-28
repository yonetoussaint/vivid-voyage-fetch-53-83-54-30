// hooks/use-header-actions.tsx
import { useState, useCallback, useEffect } from 'react';

export interface HeaderAction {
  id: string;
  icon: React.ComponentType<any>;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

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
          icon: PiShareFat, // Using react-icons share icon
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

  const addAction = useCallback((action: HeaderAction) => {
    setActions(prev => [...prev, action]);
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  }, []);

  return {
    actions,
    updateAction,
    addAction,
    removeAction
  };
};

export const useHeaderSearch = (
  initialQuery: string = '',
  onSubmit?: (query: string) => void
) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  return {
    searchQuery,
    isSearchFocused,
    setSearchQuery,
    setIsSearchFocused,
    handleSubmit,
    handleClearSearch,
    handleInputChange
  };
};

export const useHeaderScroll = (mode: 'home' | 'product-detail' = 'home', scrollY: number = 0) => {
  const maxScroll = 120;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const displayProgress = mode === 'product-detail' ? scrollProgress : 0;
  
  // Threshold when search bar should appear in product detail mode
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

  return {
    selectedCity,
    isLocationDropdownOpen,
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