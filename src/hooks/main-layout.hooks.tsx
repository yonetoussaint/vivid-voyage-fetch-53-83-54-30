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

  // State
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [measurements, setMeasurements] = useState<LayoutMeasurements>({
    headerHeight: 0,
    bottomNavHeight: 0,
    contentHeight: 0
  });

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Icon mapper
  const iconMapper = useMemo(() => ({
    Trophy, Tag, ShieldCheck, Zap, Star, Crown, Award,
    Home, Smartphone, Shirt, Baby, Dumbbell, Sparkles,
    Car, Book, CreditCard, DollarSign, History,
    BarChart, ShoppingBag
  }), []);

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

  // Page flags
  const pageFlags = useMemo<PageFlags>(() => {
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

  // Update active tab based on location
  useEffect(() => {
    const currentCategory = categories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [location.pathname, categories]);

  // Auth redirect effect
  useEffect(() => {
    if (pathname === "/auth") {
      openAuthOverlay();
      window.history.replaceState({}, "", "/");
    }
  }, [pathname, openAuthOverlay]);

  // Redirect to include default filter if missing
  useEffect(() => {
    if (pageFlags.isMessagesPage && pathname === '/messages' && !searchParams.get('filter')) {
      navigate('/messages?filter=all', { replace: true });
    }
    if (pageFlags.isWalletPage && !searchParams.get('tab')) {
      navigate('/wallet?tab=main', { replace: true });
    }
    if (pageFlags.isExplorePage && !searchParams.get('tab')) {
      navigate('/explore?tab=products', { replace: true });
    }
  }, [pageFlags.isMessagesPage, pageFlags.isWalletPage, pageFlags.isExplorePage, searchParams, navigate, pathname]);

  // Measure header height dynamically
  const updateHeaderHeight = useCallback(() => {
    if (pageFlags.shouldShowHeader && headerRef.current) {
      const headerElement = headerRef.current.querySelector('header, [data-header]');
      if (headerElement) {
        const height = headerElement.getBoundingClientRect().height;
        setMeasurements(prev => ({ ...prev, headerHeight: height }));
        document.documentElement.style.setProperty('--header-height', `${height}px`);
        return;
      }
    }
    setMeasurements(prev => ({ ...prev, headerHeight: 0 }));
    document.documentElement.style.setProperty('--header-height', '0px');
  }, [pageFlags.shouldShowHeader]);

  // Measure bottom nav height dynamically
  const updateBottomNavHeight = useCallback(() => {
    if (pageFlags.shouldShowBottomNav && bottomNavRef.current) {
      const bottomNavElement = bottomNavRef.current.querySelector('nav, [data-bottom-nav]');
      if (bottomNavElement) {
        const height = bottomNavElement.getBoundingClientRect().height;
        setMeasurements(prev => ({ ...prev, bottomNavHeight: height }));
        document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);

        const safeAreaBottom = getComputedStyle(document.documentElement)
          .getPropertyValue('--safe-area-inset-bottom') || '0px';
        const totalBottomHeight = height + parseInt(safeAreaBottom);
        document.documentElement.style.setProperty('--total-bottom-height', `${totalBottomHeight}px`);
        return;
      }
    }
    setMeasurements(prev => ({ ...prev, bottomNavHeight: 0 }));
    document.documentElement.style.setProperty('--bottom-nav-height', '0px');
    document.documentElement.style.setProperty('--total-bottom-height', '0px');
  }, [pageFlags.shouldShowBottomNav]);

  // Update content height
  const updateContentHeight = useCallback(() => {
    if (contentRef.current) {
      const windowHeight = window.innerHeight;
      const { headerHeight, bottomNavHeight } = measurements;
      const calculatedHeight = windowHeight - headerHeight - bottomNavHeight;

      setMeasurements(prev => ({ ...prev, contentHeight: calculatedHeight }));

      // Apply directly to the element
      contentRef.current.style.height = `${calculatedHeight}px`;
      contentRef.current.style.maxHeight = `${calculatedHeight}px`;
      contentRef.current.style.minHeight = `${calculatedHeight}px`;
    }
  }, [measurements.headerHeight, measurements.bottomNavHeight]);

  // Setup measurements observers and listeners
  useEffect(() => {
    const updateMeasurements = () => {
      updateHeaderHeight();
      updateBottomNavHeight();
      updateContentHeight();
    };

    // Initial measurements with delay
    const timer = setTimeout(updateMeasurements, 50);

    // Setup observers
    const headerObserver = new MutationObserver(updateHeaderHeight);
    const bottomNavObserver = new MutationObserver(updateBottomNavHeight);

    if (headerRef.current) {
      headerObserver.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    if (bottomNavRef.current) {
      bottomNavObserver.observe(bottomNavRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    // Setup resize listener
    let rafId: number;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateMeasurements);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      headerObserver.disconnect();
      bottomNavObserver.disconnect();
    };
  }, [updateHeaderHeight, updateBottomNavHeight, updateContentHeight]);

  // Generate CSS for layout
  const layoutHeightStyle = useMemo(() => {
    const { headerHeight, bottomNavHeight } = measurements;

    return `
      :root {
        --header-height: ${headerHeight}px;
        --bottom-nav-height: ${bottomNavHeight}px;
        --safe-area-inset-top: env(safe-area-inset-top, 0px);
        --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        --total-bottom-height: ${bottomNavHeight}px;
      }

      .app-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background: white;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000;
        will-change: transform;
      }

      .app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: white;
        transform: translateZ(0);
        will-change: transform;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }

      .app-content {
        position: absolute;
        top: ${headerHeight}px;
        left: 0;
        right: 0;
        bottom: ${bottomNavHeight}px;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        transform: translateZ(0);
        will-change: transform, scroll-position;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
        backface-visibility: hidden;
        perspective: 1000;
      }

      .app-content::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }

      .app-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        transform: translateZ(0);
        will-change: transform;
        padding-bottom: env(safe-area-inset-bottom, 0px);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
      }

      ${pageFlags.isConversationDetailPage ? `
        .app-content {
          top: 0 !important;
          bottom: 0 !important;
        }
      ` : ''}

      *:not(input):not(textarea):not([contenteditable="true"]) {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }

      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        user-select: text;
      }

      .page-transition {
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @supports (-webkit-overflow-scrolling: touch) {
        .app-content {
          -webkit-overflow-scrolling: touch;
          overflow-y: scroll;
        }
      }

      @supports (overflow: overlay) {
        .app-content {
          overflow-y: overlay;
        }
      }

      .app-content {
        overscroll-behavior-y: contain;
        height: calc(100vh - ${headerHeight}px - ${bottomNavHeight}px);
      }
    `;
  }, [measurements, pageFlags.isConversationDetailPage]);

  // Tabs configuration
  const categoryTabs = useMemo(() => {
    if (pageFlags.isCategoryRoute) {
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        path: cat.path
      }));
    }
    return undefined;
  }, [pageFlags.isCategoryRoute, categories]);

  const messagesTabs = useMemo(() => {
    if (pageFlags.isMessagesListPage) {
      return [
        { id: 'all', name: 'All', path: '/messages?filter=all' },
        { id: 'unread', name: 'Unread', path: '/messages?filter=unread' },
        { id: 'groups', name: 'Groups', path: '/messages?filter=groups' },
        { id: 'archived', name: 'Archived', path: '/messages?filter=archived' }
      ];
    }
    return undefined;
  }, [pageFlags.isMessagesListPage]);

  const walletTabs = useMemo(() => {
    if (pageFlags.isWalletPage) {
      return [
        { id: 'main', name: 'Main Wallet', path: '/wallet?tab=main' },
        { id: 'crypto', name: 'Crypto Wallet', path: '/wallet?tab=crypto' },
        { id: 'usd', name: 'USD Wallet', path: '/wallet?tab=usd' },
        { id: 'transactions', name: 'Transactions', path: '/wallet?tab=transactions' },
        { id: 'trades', name: 'Trades', path: '/wallet?tab=trades' }
      ];
    }
    return undefined;
  }, [pageFlags.isWalletPage]);

  const exploreTabs = useMemo(() => {
    if (pageFlags.isExplorePage) {
      return [
        { id: 'products', name: 'Products', path: '/explore?tab=products' },
        { id: 'reels', name: 'Reels', path: '/explore?tab=reels' },
        { id: 'posts', name: 'Posts', path: '/explore?tab=posts' },
        { id: 'sellers', name: 'Sellers', path: '/explore?tab=sellers' },
        { id: 'stations', name: 'Stations', path: '/explore?tab=stations' },
      ];
    }
    return undefined;
  }, [pageFlags.isExplorePage]);

  // Section header configuration
  const productsTitle = pageFlags.isProductsPage ? searchParams.get('title') || 'Products' : '';
  const iconName = searchParams.get('icon');
  const sectionHeaderIcon = iconName ? iconMapper[iconName as keyof typeof iconMapper] : undefined;

  // Tab change handler
  const handleCustomTabChange = useCallback((tabId: string) => {
    if (pageFlags.isCategoryRoute) {
      const category = categories.find(cat => cat.id === tabId);
      if (category) {
        navigate(category.path);
      }
    } else if (pageFlags.isMessagesListPage) {
      const tab = messagesTabs?.find(t => t.id === tabId);
      if (tab?.path) {
        navigate(tab.path);
      }
    } else if (pageFlags.isWalletPage) {
      const tab = walletTabs?.find(t => t.id === tabId);
      if (tab?.path) {
        navigate(tab.path);
      }
    } else if (pageFlags.isExplorePage) {
      const tab = exploreTabs?.find(t => t.id === tabId);
      if (tab?.path) {
        navigate(tab.path);
      }
    }
  }, [pageFlags.isCategoryRoute, pageFlags.isMessagesListPage, pageFlags.isWalletPage, 
      pageFlags.isExplorePage, categories, messagesTabs, walletTabs, exploreTabs, navigate]);

  // Current active tab ID
  const currentActiveTabId = pageFlags.isCategoryRoute ? activeTab : 
                            pageFlags.isMessagesListPage ? searchParams.get('filter') || 'all' :
                            pageFlags.isWalletPage ? searchParams.get('tab') || 'main' :
                            pageFlags.isExplorePage ? searchParams.get('tab') || 'products' : 
                            activeTab;

  return {
    // State
    activeTab,
    showProductUpload,
    searchQuery,
    measurements,

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

    // Functions
    setShowProductUpload,
    setSearchQuery,
    handleCustomTabChange,

    // Layout
    layoutHeightStyle,

    // Header props
    headerProps: {
      activeTabId: currentActiveTabId,
      showFilterBar,
      // Show category tabs on home, for-you, and category routes, but NOT on mall route
      showCategoryTabs: (pageFlags.isRootHomePage || pageFlags.isForYouPage || pageFlags.isCategoryRoute) && !pageFlags.isMallPage,
      // Show search list only on mall route
      showSearchList: pageFlags.isMallPage,
      searchListTitle: pageFlags.isMallPage ? "Popular in Mall" : undefined,
      flatBorders: pageFlags.isMallPage ? true : undefined,
      // Custom search items for mall
      searchListItems: pageFlags.isMallPage ? [
        "Luxury watches",
        "Designer bags", 
        "Premium electronics",
        "High-end fashion",
        "Branded cosmetics",
        "Smart home devices",
        "Gaming accessories",
        "Premium watches",
        "Designer sunglasses",
        "Luxury skincare"
      ] : undefined,
      
      filterCategories,
      selectedFilters,
      onFilterSelect,
      onFilterClear,
      onClearAll,
      onFilterButtonClick,
      isFilterDisabled,
      
      // Pass customTabs for mall too, but they won't show when showCategoryTabs is false
      customTabs: categoryTabs || messagesTabs || walletTabs || exploreTabs,
      onCustomTabChange: handleCustomTabChange,
      
      showSectionHeader: pageFlags.isProductsPage,
      sectionHeaderTitle: productsTitle,
      sectionHeaderShowStackedProfiles: searchParams.get('showProfiles') === 'true',
      sectionHeaderShowVerifiedSellers: searchParams.get('showVerifiedSellers') === 'true',
      sectionHeaderVerifiedSellersText: searchParams.get('verifiedSellersText') || 'Verified Sellers',
      sectionHeaderStackedProfiles: searchParams.get('showProfiles') === 'true' ? [
        {
          id: '1',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          alt: 'Sarah Johnson'
        },
        {
          id: '2',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          alt: 'Mike Chen'
        },
        {
          id: '3',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          alt: 'Emma Davis'
        }
      ] : [],
      sectionHeaderStackedProfilesText: searchParams.get('profilesText') || 'Handpicked by',
      sectionHeaderShowCountdown: searchParams.get('showCountdown') === 'true',
      sectionHeaderCountdown: searchParams.get('countdown') || undefined,
      sectionHeaderShowSponsorCount: searchParams.get('showSponsorCount') === 'true',
      ...(sectionHeaderIcon && { sectionHeaderIcon }),
      sectionHeaderViewAllLink: (
        (searchParams.get('showProfiles') !== 'true' &&
         searchParams.get('showVerifiedSellers') !== 'true' &&
         searchParams.get('showCountdown') !== 'true')
          ? "/vendors"
          : undefined
      ),
      sectionHeaderViewAllText: "View All"
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