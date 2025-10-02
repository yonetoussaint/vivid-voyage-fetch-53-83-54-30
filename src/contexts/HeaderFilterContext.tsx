// HeaderFilterContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderFilterContextType {
  // Existing filter bar properties
  showFilterBar: boolean;
  setShowFilterBar: (show: boolean) => void;
  filterCategories: Array<{
    id: string;
    label: string;
    options: string[];
  }>;
  setFilterCategories: (categories: Array<{
    id: string;
    label: string;
    options: string[];
  }>) => void;
  selectedFilters: Record<string, string>;
  setSelectedFilters: (filters: Record<string, string>) => void;
  onFilterSelect?: (filterId: string, option: string) => void;
  setOnFilterSelect: (handler: (filterId: string, option: string) => void) => void;
  onFilterClear?: (filterId: string) => void;
  setOnFilterClear: (handler: (filterId: string) => void) => void;
  onClearAll?: () => void;
  setOnClearAll: (handler: () => void) => void;
  onFilterButtonClick?: (filterId: string) => void;
  setOnFilterButtonClick: (handler: (filterId: string) => void) => void;
  isFilterDisabled?: (filterId: string) => boolean;
  setIsFilterDisabled: (handler: (filterId: string) => boolean) => void;

  // New properties for news ticker
  showNewsTicker: boolean;
  setShowNewsTicker: (show: boolean) => void;
  headerMode: 'categories' | 'news' | 'filters';
  setHeaderMode: (mode: 'categories' | 'news' | 'filters') => void;
  scrollDirection: 'up' | 'down' | null;
  setScrollDirection: (direction: 'up' | 'down' | null) => void;
  lastScrollY: number;
  setLastScrollY: (position: number) => void;
}

const HeaderFilterContext = createContext<HeaderFilterContextType | undefined>(undefined);

export const HeaderFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showNewsTicker, setShowNewsTicker] = useState(false);
  const [headerMode, setHeaderMode] = useState<'categories' | 'news' | 'filters'>('categories');
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [filterCategories, setFilterCategories] = useState<Array<{
    id: string;
    label: string;
    options: string[];
  }>>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [onFilterSelect, setOnFilterSelect] = useState<(filterId: string, option: string) => void>(() => () => {});
  const [onFilterClear, setOnFilterClear] = useState<(filterId: string) => void>(() => () => {});
  const [onClearAll, setOnClearAll] = useState<() => void>(() => () => {});
  const [onFilterButtonClick, setOnFilterButtonClick] = useState<(filterId: string) => void>(() => () => {});
  const [isFilterDisabled, setIsFilterDisabled] = useState<(filterId: string) => boolean>(() => () => false);

  return (
    <HeaderFilterContext.Provider
      value={{
        showFilterBar,
        setShowFilterBar,
        filterCategories,
        setFilterCategories,
        selectedFilters,
        setSelectedFilters,
        onFilterSelect,
        setOnFilterSelect,
        onFilterClear,
        setOnFilterClear,
        onClearAll,
        setOnClearAll,
        onFilterButtonClick,
        setOnFilterButtonClick,
        isFilterDisabled,
        setIsFilterDisabled,
        showNewsTicker,
        setShowNewsTicker,
        headerMode,
        setHeaderMode,
        scrollDirection,
        setScrollDirection,
        lastScrollY,
        setLastScrollY,
      }}
    >
      {children}
    </HeaderFilterContext.Provider>
  );
};

export const useHeaderFilter = () => {
  const context = useContext(HeaderFilterContext);
  if (context === undefined) {
    throw new Error('useHeaderFilter must be used within a HeaderFilterProvider');
  }
  return context;
};