import React, { useState, useEffect, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import { Home, Smartphone, Shirt, Baby, Dumbbell, Sparkles, Car, Book, Trophy, Tag, ShieldCheck, Zap, Star, Crown, Award, CreditCard, DollarSign, History, BarChart } from "lucide-react";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationScreen from "@/components/home/header/LocationScreen";
import LocationListScreen from "@/components/home/header/LocationListScreen";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTranslation } from 'react-i18next';
import { HeaderFilterProvider, useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { useAuthOverlay } from "@/context/AuthOverlayContext";

function MainLayoutContent() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Get search params early
  const searchParams = new URLSearchParams(location.search);
  const messagesFilter = searchParams.get('filter') || 'all';
  const walletFilter = searchParams.get('tab') || 'main';
  const exploreFilter = searchParams.get('tab') || 'products';
  const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');
  const isMessagesListPage = pathname === '/messages';
  const isWalletPage = pathname === '/wallet';
  const isExplorePage = pathname === '/explore';
  const isProductsPage = pathname === '/products';
  const productsTitle = isProductsPage ? new URLSearchParams(location.search).get('title') || 'Products' : '';
  const iconName = searchParams.get('icon');

  // Check if current page is conversation detail - DECLARE THIS EARLY
  const isConversationDetailPage = pathname.startsWith('/messages/') && pathname !== '/messages';

  const isProductPage = pathname.includes('/product/');
  const isRootHomePage = pathname === "/" || pathname === "/for-you";
  const isForYouPage = pathname === "/" || pathname === "/for-you";
  const isMultiStepTransferPage = pathname === "/multi-step-transfer";
  const isMultiStepTransferSheetPage = pathname === "/multi-step-transfer-page";
  const isTransferOldPage = pathname === "/transfer-old";

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [actualHeaderHeight, setActualHeaderHeight] = useState<number>(0);
  const [actualBottomNavHeight, setActualBottomNavHeight] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const { openAuthOverlay, isAuthOverlayOpen, setIsAuthOverlayOpen } = useAuthOverlay();
  const { user } = useAuth();
  const { isLocationListScreenOpen, locationListScreenData, setLocationListScreenOpen, isLocationScreenOpen, setLocationScreenOpen } = useScreenOverlay();
  const { t } = useTranslation();
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

  // Icon mapper - DECLARE BEFORE USING
  const iconMapper: Record<string, React.ComponentType<{ className?: string }>> = {
    Trophy,
    Tag,
    ShieldCheck,
    Zap,
    Star,
    Crown,
    Award,
    Home,
    Smartphone,
    Shirt,
    Baby,
    Dumbbell,
    Sparkles,
    Car,
    Book,
    CreditCard,
    DollarSign,
    History,
    BarChart
  };

  const sectionHeaderIcon = iconName ? iconMapper[iconName] : undefined;

  const categories = useMemo(() => [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), path: '/categories/home-living' },
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), path: '/categories/fashion' },
    { id: 'entertainment', name: t('entertainment', { ns: 'categories' }), path: '/categories/entertainment' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), path: '/categories/kids-hobbies' },
    { id: 'sports', name: t('sports', { ns: 'categories' }), path: '/categories/sports-outdoors' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), path: '/categories/automotive' },
    { id: 'women', name: t('women', { ns: 'categories' }), path: '/categories/women' },
    { id: 'men', name: t('men', { ns: 'categories' }), path: '/categories/men' },
    { id: 'books', name: t('books', { ns: 'categories' }), path: '/categories/books' },
  ], [t]);

  // Update active tab based on location
  useEffect(() => {
    const currentCategory = categories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [location.pathname, categories]);

  // Determine if we should show the header
  const shouldShowHeader = [
    '/',
    '/for-you',
    '/messages',
    '/wallet',
    '/explore',
    '/wishlist',
    '/cart',
    '/notifications',
    '/addresses',
    '/help',
    '/products',
    '/categories',
    '/categories/electronics',
    '/categories/home-living',
    '/categories/fashion',
    '/categories/entertainment',
    '/categories/kids-hobbies',
    '/categories/sports-outdoors',
    '/categories/automotive',
    '/categories/women',
    '/categories/men',
    '/categories/books'
  ].includes(pathname);

  // Check if current page is reels
  const isReelsPage = pathname === '/reels' && !location.search.includes('video=');

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
  ) && !isMultiStepTransferPage && !isMultiStepTransferSheetPage && !isTransferOldPage;

  // Measure actual header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (shouldShowHeader && headerRef.current) {
        const headerElement = headerRef.current.querySelector('header, [data-header]');
        if (headerElement) {
          const height = headerElement.getBoundingClientRect().height;
          setActualHeaderHeight(height);
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      } else {
        setActualHeaderHeight(0);
        document.documentElement.style.setProperty('--header-height', '0px');
      }
    };

    const timer = setTimeout(updateHeaderHeight, 50);
    window.addEventListener('resize', updateHeaderHeight);

    const observer = new MutationObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, [shouldShowHeader, pathname, activeTab]);

  // Measure actual bottom nav height dynamically
  useEffect(() => {
    const updateBottomNavHeight = () => {
      if (shouldShowBottomNav && bottomNavRef.current) {
        const bottomNavElement = bottomNavRef.current.querySelector('nav, [data-bottom-nav]');
        if (bottomNavElement) {
          const height = bottomNavElement.getBoundingClientRect().height;
          setActualBottomNavHeight(height);
          document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);

          // Also update safe area inset for mobile browsers
          const safeAreaBottom = getComputedStyle(document.documentElement)
            .getPropertyValue('--safe-area-inset-bottom') || '0px';
          const totalBottomHeight = height + parseInt(safeAreaBottom);
          document.documentElement.style.setProperty('--total-bottom-height', `${totalBottomHeight}px`);
        }
      } else {
        setActualBottomNavHeight(0);
        document.documentElement.style.setProperty('--bottom-nav-height', '0px');
        document.documentElement.style.setProperty('--total-bottom-height', '0px');
      }
    };

    const timer = setTimeout(updateBottomNavHeight, 50);
    window.addEventListener('resize', updateBottomNavHeight);

    const observer = new MutationObserver(updateBottomNavHeight);
    if (bottomNavRef.current) {
      observer.observe(bottomNavRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBottomNavHeight);
      observer.disconnect();
    };
  }, [shouldShowBottomNav, pathname]);

  // Update content height calculation
  useEffect(() => {
    const updateContentHeight = () => {
      if (contentRef.current) {
        const windowHeight = window.innerHeight;
        const headerHeight = actualHeaderHeight;
        const bottomNavHeight = actualBottomNavHeight;
        const calculatedHeight = windowHeight - headerHeight - bottomNavHeight;
        setContentHeight(calculatedHeight);

        // Apply directly to the element
        contentRef.current.style.height = `${calculatedHeight}px`;
        contentRef.current.style.maxHeight = `${calculatedHeight}px`;
        contentRef.current.style.minHeight = `${calculatedHeight}px`;
      }
    };

    updateContentHeight();

    // Use requestAnimationFrame for smooth updates
    let rafId: number;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateContentHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [actualHeaderHeight, actualBottomNavHeight]);

  // Add smooth scrolling CSS to the content element
  useEffect(() => {
    if (contentRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        .smooth-scroll {
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth !important;
          overscroll-behavior: contain !important;
        }
        
        .smooth-scroll::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
        }
        
        /* Momentum scrolling for iOS */
        .smooth-scroll {
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Prevent rubber banding on body */
        body {
          overscroll-behavior: none;
          position: fixed;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);

      // Add smooth-scroll class
      contentRef.current.classList.add('smooth-scroll');

      return () => {
        document.head.removeChild(style);
        if (contentRef.current) {
          contentRef.current.classList.remove('smooth-scroll');
        }
      };
    }
  }, []);

  // CSS for native-like experience - SIMPLIFIED
  const layoutHeightStyle = `
    :root {
      --header-height: ${actualHeaderHeight}px;
      --bottom-nav-height: ${actualBottomNavHeight}px;
      --safe-area-inset-top: env(safe-area-inset-top, 0px);
      --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      --total-bottom-height: ${actualBottomNavHeight}px;
    }

    /* Reset body for mobile web app */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }

    /* App container */
    .app-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      background: white;
      /* Enable hardware acceleration */
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000;
      will-change: transform;
    }

    /* Header - fixed at top */
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

    /* Content area - absolutely positioned between header and bottom nav */
    .app-content {
      position: absolute;
      top: ${actualHeaderHeight}px;
      left: 0;
      right: 0;
      bottom: ${actualBottomNavHeight}px;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      transform: translateZ(0);
      will-change: transform, scroll-position;
      /* Native-like scroll */
      scrollbar-width: none;
      -ms-overflow-style: none;
      /* Smooth scrolling */
      scroll-behavior: smooth;
      /* Prevent momentum scrolling issues */
      -webkit-overflow-scrolling: touch;
      /* Hardware acceleration */
      backface-visibility: hidden;
      perspective: 1000;
    }

    /* Hide scrollbar but keep functionality */
    .app-content::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    /* Bottom navigation - fixed at bottom */
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

    /* Remove padding for conversation detail page */
    ${isConversationDetailPage ? `
      .app-content {
        top: 0 !important;
        bottom: 0 !important;
      }
    ` : ''}

    /* Prevent text selection for native feel (except inputs) */
    *:not(input):not(textarea):not([contenteditable="true"]) {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Allow text selection in input fields */
    input, textarea, [contenteditable="true"] {
      -webkit-user-select: text;
      user-select: text;
    }

    /* Native-like page transitions */
    .page-transition {
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Momentum scrolling fix for iOS */
    @supports (-webkit-overflow-scrolling: touch) {
      .app-content {
        /* iOS momentum scrolling */
        -webkit-overflow-scrolling: touch;
        /* Prevent elastic scroll */
        overflow-y: scroll;
      }
    }

    /* Fix for Android Chrome */
    @supports (overflow: overlay) {
      .app-content {
        overflow-y: overlay;
      }
    }

    /* Prevent overscroll glow/bounce */
    .app-content {
      overscroll-behavior-y: contain;
    }

    /* Fix for mobile safari 100vh issue */
    .app-content {
      height: calc(100vh - ${actualHeaderHeight}px - ${actualBottomNavHeight}px);
    }
  `;

  // Update auth redirect effect
  useEffect(() => {
    if (pathname === "/auth") {
      openAuthOverlay();
      window.history.replaceState({}, "", "/");
    }
  }, [pathname, openAuthOverlay]);

  // Redirect to include default filter if missing
  useEffect(() => {
    if (isMessagesPage && pathname === '/messages' && !searchParams.get('filter')) {
      navigate('/messages?filter=all', { replace: true });
    }
    if (isWalletPage && !searchParams.get('tab')) {
      navigate('/wallet?tab=main', { replace: true });
    }
    if (isExplorePage && !searchParams.get('tab')) {
      navigate('/explore?tab=products', { replace: true });
    }
  }, [isMessagesPage, isWalletPage, isExplorePage, searchParams, navigate, pathname]);

  
const walletTabs = isWalletPage ? [
    { id: 'main', name: 'Main Wallet', path: '/wallet?tab=main' },
    { id: 'crypto', name: 'Crypto Wallet', path: '/wallet?tab=crypto' },
    { id: 'usd', name: 'USD Wallet', path: '/wallet?tab=usd' },
    { id: 'transactions', name: 'Transactions', path: '/wallet?tab=transactions' },
    { id: 'trades', name: 'Trades', path: '/wallet?tab=trades' }
] : undefined;

  const messagesTabs = isMessagesListPage ? [
    { id: 'all', name: 'All', path: '/messages?filter=all' },
    { id: 'unread', name: 'Unread', path: '/messages?filter=unread' },
    { id: 'groups', name: 'Groups', path: '/messages?filter=groups' },
    { id: 'archived', name: 'Archived', path: '/messages?filter=archived' }
  ] : undefined;

  const exploreTabs = isExplorePage ? [
    { id: 'products', name: 'Products', path: '/explore?tab=products' },
    { id: 'reels', name: 'Reels', path: '/explore?tab=reels' },
    { id: 'posts', name: 'Posts', path: '/explore?tab=posts' },
    { id: 'sellers', name: 'Sellers', path: '/explore?tab=sellers' },
    { id: 'stations', name: 'Stations', path: '/explore?tab=stations' },
  ] : undefined;

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: layoutHeightStyle }} />

      {/* Header */}
      {shouldShowHeader && (
        <div ref={headerRef} className="app-header">
          <AliExpressHeader
            activeTabId={isMessagesListPage ? messagesFilter : isWalletPage ? walletFilter : isExplorePage ? exploreFilter : activeTab}
            showFilterBar={showFilterBar}
            // FIXED: Changed from !isWalletPage to allow tabs on wallet page
            showCategoryTabs={!isProductsPage && !pathname.startsWith('/categories') || isWalletPage || isMessagesListPage || isExplorePage}
            filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            onFilterSelect={onFilterSelect}
            onFilterClear={onFilterClear}
            onClearAll={onClearAll}
            onFilterButtonClick={onFilterButtonClick}
            isFilterDisabled={isFilterDisabled}
            customTabs={messagesTabs || walletTabs || exploreTabs}
            onCustomTabChange={isMessagesListPage ? (tabId) => {
              const tab = messagesTabs?.find(t => t.id === tabId);
              if (tab?.path) {
                navigate(tab.path);
              }
            } : isWalletPage ? (tabId) => {
              const tab = walletTabs?.find(t => t.id === tabId);
              if (tab?.path) {
                navigate(tab.path);
              }
            } : isExplorePage ? (tabId) => {
              const tab = exploreTabs?.find(t => t.id === tabId);
              if (tab?.path) {
                navigate(tab.path);
              }
            } : undefined}
            showSectionHeader={isProductsPage}
            sectionHeaderTitle={productsTitle}
            sectionHeaderShowStackedProfiles={searchParams.get('showProfiles') === 'true'}
            sectionHeaderShowVerifiedSellers={searchParams.get('showVerifiedSellers') === 'true'}
            sectionHeaderVerifiedSellersText={searchParams.get('verifiedSellersText') || 'Verified Sellers'}
            sectionHeaderStackedProfiles={searchParams.get('showProfiles') === 'true' ? [
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
            ] : []}
            sectionHeaderStackedProfilesText={searchParams.get('profilesText') || 'Handpicked by'}
            sectionHeaderShowCountdown={searchParams.get('showCountdown') === 'true'}
            sectionHeaderCountdown={searchParams.get('countdown') || undefined}
            sectionHeaderShowSponsorCount={searchParams.get('showSponsorCount') === 'true'}
            {...(sectionHeaderIcon && { sectionHeaderIcon })}
            sectionHeaderViewAllLink={
              (searchParams.get('showProfiles') !== 'true' &&
               searchParams.get('showVerifiedSellers') !== 'true' &&
               searchParams.get('showCountdown') !== 'true')
                ? "/vendors"
                : undefined
            }
            sectionHeaderViewAllText="View All"
          />
        </div>
      )}

      {/* Main Content Area - Native-like scrolling */}
      <div 
        ref={contentRef} 
        className="app-content page-transition"
        style={{
          height: `${contentHeight}px`,
          maxHeight: `${contentHeight}px`,
          minHeight: `${contentHeight}px`,
        }}
      >
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {shouldShowBottomNav && (
        <div ref={bottomNavRef} className="app-bottom-nav">
          <IndexBottomNav />
        </div>
      )}

      {/* Product Upload Overlay */}
      <ProductUploadOverlay
        isOpen={showProductUpload}
        onClose={() => setShowProductUpload(false)}
      />

      {/* Location List Screen */}
      {isLocationListScreenOpen && locationListScreenData && (
        <LocationListScreen
          title={locationListScreenData.title}
          items={locationListScreenData.items}
          onSelect={(item) => {
            locationListScreenData.onSelect(item);
            setLocationListScreenOpen(false);
          }}
          onClose={() => setLocationListScreenOpen(false)}
          searchPlaceholder={locationListScreenData.searchPlaceholder}
        />
      )}

      {/* Location Screen */}
      {isLocationScreenOpen && (
        <LocationScreen
          onClose={() => setLocationScreenOpen(false)}
          showHeader={true}
        />
      )}

      {/* Auth Overlay */}
      <AuthOverlay
        isOpen={isAuthOverlayOpen}
        onClose={() => setIsAuthOverlayOpen(false)}
      />
    </div>
  );
}

// Main export that wraps with provider
export default function MainLayout() {
  return (
    <HeaderFilterProvider>
      <MainLayoutContent />
    </HeaderFilterProvider>
  );
}