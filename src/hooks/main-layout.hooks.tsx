import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/auth/AuthContext";
import { useAuthOverlay } from "@/context/AuthOverlayContext";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { 
  Home, Smartphone, Shirt, Baby, Dumbbell, Sparkles, Car, Book, 
  Trophy, Tag, ShieldCheck, Zap, Star, Crown, Award, CreditCard, 
  DollarSign, History, BarChart, ShoppingBag 
} from "lucide-react";

// Define types for the hook
interface UseMainLayoutProps {
  isMobile?: boolean;
}

interface LayoutMeasurements {
  headerHeight: number;
  bottomNavHeight: number;
  contentHeight: number;
}

interface PageFlags {
  isRootHomePage: boolean;
  isForYouPage: boolean;
  isCategoryRoute: boolean;
  isMessagesPage: boolean;
  isMessagesListPage: boolean;
  isConversationDetailPage: boolean;
  isWalletPage: boolean;
  isExplorePage: boolean;
  isProductsPage: boolean;
  isProfilePage: boolean;
  isMallPage: boolean;
  isReelsPage: boolean;
  shouldShowHeader: boolean;
  shouldShowBottomNav: boolean;
}

interface TabConfig {
  id: string;
  name: string;
  path: string;
}

export const useMainLayout = (props?: UseMainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  // Context hooks
  const { openAuthOverlay, isAuthOverlayOpen, setIsAuthOverlayOpen } = useAuthOverlay();
  const { 
    isLocationListScreenOpen, 
    locationListScreenData, 
    setLocationListScreenOpen, 
    isLocationScreenOpen, 
    setLocationScreenOpen 
  } = useScreenOverlay();
  const {
    showFilterBar,
    filterCategories,
    selectedFilters,
    onFilterSelect,
    onFilterClear,
    onClearAll,
    onFilterButtonClick,
    isFilterDisabled
  } = useHeaderFilter();

  // State - ADD LOCATIONS PANEL STATE
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationsPanelOpen, setIsLocationsPanelOpen] = useState(false); // ADD THIS
  const [selectedCity, setSelectedCity] = useState(() => { // ADD THIS
    // Load from localStorage or use default
    return localStorage.getItem('currentCity') || 'New York';
  });
  const [measurements, setMeasurements] = useState<LayoutMeasurements>({
    headerHeight: 0,
    bottomNavHeight: 0,
    contentHeight: 0
  });

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Location options - ADD THIS
  const locationOptions = useMemo(() => [
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'houston', name: 'Houston' },
    { id: 'miami', name: 'Miami' },
    { id: 'london', name: 'London' },
    { id: 'paris', name: 'Paris' },
    { id: 'tokyo', name: 'Tokyo' },
    { id: 'sydney', name: 'Sydney' },
    { id: 'toronto', name: 'Toronto' }
  ], []);

  // Handle location change - ADD THIS
  const handleLocationChange = useCallback((locationId: string) => {
    console.log('Location changed to:', locationId);
    // You can add API calls or other logic here
    toast({
      title: "Location Updated",
      description: "Your location has been updated successfully",
    });
  }, [toast]);

  // Handle city select from panel - ADD THIS
  const handleCitySelect = useCallback((cityName: string) => {
    setSelectedCity(cityName);
    localStorage.setItem('currentCity', cityName);
    
    // Find the location ID from options
    const location = locationOptions.find(loc => loc.name === cityName);
    if (location) {
      handleLocationChange(location.id);
    }
  }, [locationOptions, handleLocationChange]);

  // ... rest of your existing code ...

  return {
    // State
    activeTab,
    showProductUpload,
    searchQuery,
    measurements,
    isLocationsPanelOpen, // ADD THIS
    setIsLocationsPanelOpen, // ADD THIS
    selectedCity, // ADD THIS
    setSelectedCity, // ADD THIS

    // Refs
    headerRef,
    bottomNavRef,
    contentRef,

    // Page flags
    pageFlags,

    // Configuration
    categories,
    categoryTabs,
    messagesTabs,
    walletTabs,
    exploreTabs,
    currentActiveTabId,
    locationOptions, // ADD THIS

    // Functions
    setShowProductUpload,
    setSearchQuery,
    handleCustomTabChange,
    handleLocationChange, // ADD THIS
    handleCitySelect, // ADD THIS

    // Layout
    layoutHeightStyle,

    // Header props - UPDATED WITH LOCATION PROPS
    headerProps: {
      activeTabId: currentActiveTabId,
      showCategoryTabs: (pageFlags.isRootHomePage || pageFlags.isForYouPage || pageFlags.isCategoryRoute) && !pageFlags.isMallPage,
      // Show search list only on mall route
      showSearchList: pageFlags.isMallPage,
      flatBorders: true,
      // Custom search items for mall with trend indicators
      searchListItems: pageFlags.isMallPage ? [
        { term: "Luxury watches", trend: 'hot' as const },
        { term: "Designer bags", trend: 'trending-up' as const },
        { term: "Premium electronics", trend: 'hot' as const },
        { term: "High-end fashion", trend: 'popular' as const },
        { term: "Branded cosmetics", trend: 'trending-up' as const },
        { term: "Smart home devices", trend: 'trending-down' as const },
        { term: "Gaming accessories", trend: 'popular' as const }
      ] : undefined,
      // Filter bar props
      showFilterBar,
      filterCategories,
      selectedFilters,
      onFilterSelect,
      onFilterClear,
      onClearAll,
      onFilterButtonClick,
      isFilterDisabled,
      // Custom tabs
      customTabs: categoryTabs || messagesTabs || walletTabs || exploreTabs,
      onCustomTabChange: handleCustomTabChange,
      // Location props - ADD THESE
      cityName: selectedCity,
      locationOptions: locationOptions,
      onLocationChange: handleLocationChange,
    },

    // Context values
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    isLocationListScreenOpen,
    locationListScreenData,
    setLocationListScreenOpen,
    isLocationScreenOpen,
    setLocationScreenOpen
  };
};