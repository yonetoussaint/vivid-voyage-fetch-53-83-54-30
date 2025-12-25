// hooks/main-layout.hooks.ts
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/auth/AuthContext";
import { useAuthOverlay } from "@/context/AuthOverlayContext";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";

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

  // State
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationsPanelOpen, setIsLocationsPanelOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => {
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

  // Categories configuration
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

  // Page flags - DEFINE THIS PROPERLY
  const pageFlags: PageFlags = useMemo(() => {
    const messagesFilter = searchParams.get('filter') || 'all';
    const walletFilter = searchParams.get('tab') || 'main';
    const exploreFilter = searchParams.get('tab') || 'products';

    const isRootHomePage = pathname === "/" || pathname === "/for-you";
    const isForYouPage = pathname === "/" || pathname === "/for-you";
    const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');
    const isMessagesListPage = pathname === '/messages';
    const isConversationDetailPage = pathname.startsWith('/messages/') && pathname !== '/messages';
    const isWalletPage = pathname === '/wallet';
    const isExplorePage = pathname === '/explore';
    const isProductsPage = pathname === '/products';
    const isProfilePage = pathname === '/profile' || pathname.startsWith('/profile/');
    const isMallPage = pathname === '/mall' || pathname.startsWith('/mall/');
    const isCategoryRoute = categories.some(cat => 
      pathname === cat.path || 
      (cat.path !== '/' && pathname.startsWith(cat.path))
    );
    const isReelsPage = pathname === '/reels' && !location.search.includes('video=');

    // Determine if we should show the header
    const shouldShowHeader = [
      '/', '/for-you', '/wallet', '/explore', '/wishlist', '/cart', '/notifications',
      '/addresses', '/help', '/products', '/mall', '/mall/', '/categories',
      '/categories/electronics', '/categories/home-living', '/categories/fashion',
      '/categories/entertainment', '/categories/kids-hobbies', '/categories/sports-outdoors',
      '/categories/automotive', '/categories/women', '/categories/men', '/categories/books',
      '/profile'
    ].includes(pathname) || isMessagesListPage || isProfilePage || isMallPage;

    // Determine if we should show the bottom nav
    const shouldShowBottomNav = isMobile && (
      pathname === '/for-you' ||
      pathname === '/' ||
      pathname === '/categories' ||
      (pathname === '/reels' && !location.search.includes('video=')) ||
      pathname === '/posts' ||
      pathname === '/messages' ||
      pathname === '/more-menu' ||
      pathname === '/profile' ||
      pathname.startsWith('/profile/') ||
      pathname === '/videos' ||
      pathname === '/notifications' ||
      pathname === '/bookmarks' ||
      pathname === '/friends' ||
      pathname === '/shopping' ||
      pathname === '/settings' ||
      pathname === '/wallet' ||
      pathname === '/explore' ||
      pathname === '/wishlist' ||
      pathname === '/cart' ||
      pathname === '/addresses' ||
      pathname === '/help' ||
      pathname === '/my-stations' ||
      pathname === '/products' ||
      pathname === '/mall' ||
      pathname.startsWith('/mall/') ||
      pathname === '/categories/electronics' ||
      pathname === '/categories/home-living' ||
      pathname === '/categories/fashion' ||
      pathname === '/categories/entertainment' ||
      pathname === '/categories/kids-hobbies' ||
      pathname === '/categories/sports-outdoors' ||
      pathname === '/categories/automotive' ||
      pathname === '/categories/women' ||
      pathname === '/categories/men' ||
      pathname === '/categories/books' ||
      pathname.startsWith('/pickup-station') ||
      (pathname.startsWith('/seller-dashboard') && !pathname.includes('/edit-profile') && !pathname.includes('/onboarding'))
    ) && !pathname.includes('/multi-step-transfer') && !pathname.includes('/transfer-old');

    return {
      isRootHomePage,
      isForYouPage,
      isCategoryRoute,
      isMessagesPage,
      isMessagesListPage,
      isConversationDetailPage,
      isWalletPage,
      isExplorePage,
      isProductsPage,
      isProfilePage,
      isMallPage,
      isReelsPage,
      shouldShowHeader,
      shouldShowBottomNav
    };
  }, [pathname, location.search, categories, isMobile]);

  // ... rest of your hook code remains the same ...

  // Location options
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

  // Handle location change
  const handleLocationChange = useCallback((locationId: string) => {
    console.log('Location changed to:', locationId);
    toast({
      title: "Location Updated",
      description: "Your location has been updated successfully",
    });
  }, [toast]);

  // Handle city select from panel
  const handleCitySelect = useCallback((cityName: string) => {
    setSelectedCity(cityName);
    localStorage.setItem('currentCity', cityName);
    
    const location = locationOptions.find(loc => loc.name === cityName);
    if (location) {
      handleLocationChange(location.id);
    }
  }, [locationOptions, handleLocationChange]);

  // Return statement - MAKE SURE pageFlags IS INCLUDED
  return {
    // State
    activeTab,
    showProductUpload,
    searchQuery,
    measurements,
    isLocationsPanelOpen,
    setIsLocationsPanelOpen,
    selectedCity,
    setSelectedCity,

    // Refs
    headerRef,
    bottomNavRef,
    contentRef,

    // Page flags - THIS IS CRITICAL
    pageFlags, // <-- Make sure this is returned

    // Configuration
    categories,
    locationOptions,

    // Functions
    setShowProductUpload,
    setSearchQuery,
    handleCitySelect,
    handleLocationChange,

    // Layout
    layoutHeightStyle,

    // Header props
    headerProps: {
      activeTabId: activeTab,
      showCategoryTabs: (pageFlags.isRootHomePage || pageFlags.isForYouPage || pageFlags.isCategoryRoute) && !pageFlags.isMallPage,
      showSearchList: pageFlags.isMallPage,
      flatBorders: true,
      searchListItems: pageFlags.isMallPage ? [
        { term: "Luxury watches", trend: 'hot' as const },
        { term: "Designer bags", trend: 'trending-up' as const },
        { term: "Premium electronics", trend: 'hot' as const },
        { term: "High-end fashion", trend: 'popular' as const },
        { term: "Branded cosmetics", trend: 'trending-up' as const },
        { term: "Smart home devices", trend: 'trending-down' as const },
        { term: "Gaming accessories", trend: 'popular' as const }
      ] : undefined,
      showFilterBar,
      filterCategories,
      selectedFilters,
      onFilterSelect,
      onFilterClear,
      onClearAll,
      onFilterButtonClick,
      isFilterDisabled,
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