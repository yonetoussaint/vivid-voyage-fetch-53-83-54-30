import React, { useState, useEffect, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import { Home, Smartphone, Shirt, Baby, Dumbbell, Sparkles, Car, Book, Trophy, Tag, ShieldCheck, Zap, Star, Crown, Award } from "lucide-react";
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
  const isProductPage = pathname.includes('/product/');
  const isRootHomePage = pathname === "/" || pathname === "/for-you";
  const isForYouPage = pathname === "/" || pathname === "/for-you";
  const isMultiStepTransferPage = pathname === "/multi-step-transfer";
  const isMultiStepTransferSheetPage = pathname === "/multi-step-transfer-page";
  const isTransferOldPage = pathname === "/transfer-old";
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const [actualHeaderHeight, setActualHeaderHeight] = useState<number>(0);
  const [actualBottomNavHeight, setActualBottomNavHeight] = useState<number>(0);

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

  // Use shouldShowHeader for spacing
  const shouldApplySpacing = shouldShowHeader;

  // Measure actual header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (shouldShowHeader && headerRef.current) {
        const headerElement = headerRef.current.querySelector('header, [data-header]');
        if (headerElement) {
          const height = headerElement.getBoundingClientRect().height;
          setActualHeaderHeight(height);
          // Also update CSS variable
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      } else {
        setActualHeaderHeight(0);
        document.documentElement.style.setProperty('--header-height', '0px');
      }
    };

    const timer = setTimeout(updateHeaderHeight, 100);
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
          // Also update CSS variable
          document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);
        }
      } else {
        setActualBottomNavHeight(0);
        document.documentElement.style.setProperty('--bottom-nav-height', '0px');
      }
    };

    const timer = setTimeout(updateBottomNavHeight, 100);
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

  // Calculate header and bottom nav heights for CSS variables
  const headerHeight = `${actualHeaderHeight}px`;
  const bottomNavHeight = `${actualBottomNavHeight}px`;

  // Check if current page is conversation detail
  const isConversationDetailPage = pathname.startsWith('/messages/') && pathname !== '/messages';

  // CSS with dynamic header and bottom nav heights
  const layoutHeightStyle = `
    :root {
      --header-height: ${headerHeight};
      --bottom-nav-height: ${bottomNavHeight};
    }

    /* Apply padding to main content area based on visible elements */
    .main-content-container {
      padding-top: var(--header-height);
      padding-bottom: var(--bottom-nav-height);
      min-height: calc(100vh - var(--header-height) - var(--bottom-nav-height));
      width: 100%;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }

    /* Ensure outlet content fills the available space */
    .outlet-content {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    /* Remove padding for conversation detail page */
    ${isConversationDetailPage ? `
      .main-content-container {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    ` : ''}

    /* Force CSS variables update */
    * {
      --header-height: ${headerHeight};
      --bottom-nav-height: ${bottomNavHeight};
    }
  `;

  // Update the effect that manages auth redirect
  useEffect(() => {
    if (pathname === "/auth") {
      openAuthOverlay();
      window.history.replaceState({}, "", "/");
    }
  }, [pathname, openAuthOverlay]);

  // Check if current page is electronics
  const isElectronicsPage = pathname === '/categories/electronics';

  // Redirect to include default filter if missing
  useEffect(() => {
    if (isMessagesPage && pathname === '/messages' && !searchParams.get('filter')) {
      navigate('/messages?filter=all', { replace: true });
    }
    if (isWalletPage && !searchParams.get('tab')) {
      navigate('/wallet?tab=buyer', { replace: true });
    }
    if (isExplorePage && !searchParams.get('tab')) {
      navigate('/explore?tab=products', { replace: true });
    }
  }, [isMessagesPage, isWalletPage, isExplorePage, searchParams, navigate, pathname]);

  // Define custom tabs for messages page
  const messagesTabs = isMessagesListPage ? [
    { id: 'all', name: 'All', path: '/messages?filter=all' },
    { id: 'unread', name: 'Unread', path: '/messages?filter=unread' },
    { id: 'groups', name: 'Groups', path: '/messages?filter=groups' },
    { id: 'archived', name: 'Archived', path: '/messages?filter=archived' }
  ] : undefined;

  // Define custom tabs for wallet page
  const walletTabs = isWalletPage ? [
    { id: 'buyer', name: 'Buyer', path: '/wallet?tab=buyer' },
    { id: 'seller', name: 'Seller', path: '/wallet?tab=seller' },
    { id: 'transactions', name: 'Transactions', path: '/wallet?tab=transactions' },
    { id: 'payouts', name: 'Payouts', path: '/wallet?tab=payouts' },
    { id: 'payment-methods', name: 'Payment Methods', path: '/wallet?tab=payment-methods' },
    { id: 'rewards', name: 'Rewards', path: '/wallet?tab=rewards' },
  ] : undefined;

  // Define custom tabs for explore page
  const exploreTabs = isExplorePage ? [
    { id: 'products', name: 'Products', path: '/explore?tab=products' },
    { id: 'reels', name: 'Reels', path: '/explore?tab=reels' },
    { id: 'posts', name: 'Posts', path: '/explore?tab=posts' },
    { id: 'sellers', name: 'Sellers', path: '/explore?tab=sellers' },
    { id: 'stations', name: 'Stations', path: '/explore?tab=stations' },
  ] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: layoutHeightStyle }} />

      {/* Show AliExpressHeader for category pages - wrapped for measurement */}
      {shouldShowHeader && (
        <div ref={headerRef} className="fixed top-0 left-0 right-0 z-40">
          <AliExpressHeader
            activeTabId={isMessagesListPage ? messagesFilter : isWalletPage ? walletFilter : isExplorePage ? exploreFilter : activeTab}
            showFilterBar={showFilterBar}
            showCategoryTabs={!isProductsPage && !pathname.startsWith('/categories')}
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

      {/* Main content area with dynamic padding */}
      <div className="main-content-container flex-grow relative">
        <div className="outlet-content">
          <Outlet />
        </div>
      </div>

      {/* Show IndexBottomNav only on specific paths defined in the component */}
      {shouldShowBottomNav && (
        <div ref={bottomNavRef} className="fixed bottom-0 left-0 right-0 z-50">
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