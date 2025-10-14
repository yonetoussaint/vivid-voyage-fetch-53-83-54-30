import React, { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/layout/Footer";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import { useAuthOverlay } from "@/context/AuthOverlayContext";
import { Home, Smartphone, Shirt, Baby, Dumbbell, Sparkles, Car, Book } from "lucide-react";
import { useScreenOverlay } from "@/context/ScreenOverlayContext";
import ProductUploadOverlay from "@/components/product/ProductUploadOverlay";
import LocationScreen from "@/components/home/header/LocationScreen";
import LocationListScreen from "@/components/home/header/LocationListScreen";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTranslation } from 'react-i18next';
import { HeaderFilterProvider, useHeaderFilter } from "@/contexts/HeaderFilterContext";

// Create a wrapper component that uses the hook
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

  // Define categories once at layout level
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: !isFavorite ? "Added to Wishlist" : "Removed from Wishlist",
      description: !isFavorite ? "This item has been added to your wishlist" : "This item has been removed from your wishlist",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this product',
        text: 'I found this amazing product I thought you might like!',
        url: window.location.href,
      }).catch(() => {
        toast({
          title: "Sharing Failed",
          description: "There was an error sharing this content.",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search submitted",
      description: `Searching for: ${searchQuery}`,
    });
  };

  // Check if current page is messages, wallet, explore, or products
  const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');
  const isMessagesListPage = pathname === '/messages';
  const isWalletPage = pathname === '/wallet';
  const isExplorePage = pathname === '/explore';
  const isProductsPage = pathname === '/products';
  
  // Get title from URL params for products page
  const productsTitle = isProductsPage ? new URLSearchParams(location.search).get('title') || 'Products' : '';

  // Get filter from URL params for messages, wallet, and explore
  const searchParams = new URLSearchParams(location.search);
  const messagesFilter = searchParams.get('filter') || 'all';
  const walletFilter = searchParams.get('tab') || 'buyer';
  const exploreFilter = searchParams.get('tab') || 'products';

  // Check if we should apply spacing (messages list only, not conversation detail, wallet, explore, products)
  const shouldApplySpacing = isMessagesListPage || isExplorePage || isWalletPage || isProductsPage;

  // Check if current page is reels
  const isReelsPage = pathname === '/reels' && !location.search.includes('video=');

  // Define custom tabs for explore page


  // Calculate header and bottom nav heights for CSS variables
  const headerHeight = shouldApplySpacing ? (isMobile ? '80px' : '120px') : '0px';
  const bottomNavHeight = (shouldApplySpacing || isReelsPage) && isMobile && !isMultiStepTransferPage && !isMultiStepTransferSheetPage && !isTransferOldPage ? '48px' : '0px';

  // Check if current page is conversation detail
  const isConversationDetailPage = pathname.startsWith('/messages/') && pathname !== '/messages';

  // In MainLayout.tsx, update the headerHeightStyle to ensure bottom nav height is set correctly
  const headerHeightStyle = `
  :root {
    --header-height: ${headerHeight};
    --bottom-nav-height: ${bottomNavHeight};
  }

  /* Ensure main content respects the header and bottom nav */
  main {
    padding-top: var(--header-height);
    padding-bottom: var(--bottom-nav-height);
    min-height: calc(100vh - var(--header-height) - var(--bottom-nav-height));
  }

  /* Remove padding for conversation detail page */
  ${isConversationDetailPage ? `
  main {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  ` : ''}
`;

  useEffect(() => {
    if (pathname === "/auth") {
      openAuthOverlay();
      window.history.replaceState({}, "", "/");
    }
  }, [pathname, openAuthOverlay]);

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

  // Check if current page is electronics (has filter functionality)
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
    { id: 'blocked', name: 'Blocked', path: '/messages?filter=blocked' },
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
        <style dangerouslySetInnerHTML={{ __html: headerHeightStyle }} />

        {/* Show AliExpressHeader for category pages */}
        {shouldShowHeader && (
          <AliExpressHeader 
            activeTabId={isMessagesListPage ? messagesFilter : isWalletPage ? walletFilter : isExplorePage ? exploreFilter : activeTab}
            showFilterBar={showFilterBar}
            showCategoryTabs={!isProductsPage}
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
            sectionHeaderShowStackedProfiles={productsTitle !== 'Flash Deals'}
            sectionHeaderStackedProfiles={[
              { 
                id: '1', 
                image: 'https://example.com/profile1.jpg', 
                alt: 'Sarah Johnson' 
              },
              { 
                id: '2', 
                image: 'https://example.com/profile2.jpg', 
                alt: 'Mike Chen' 
              },
              { 
                id: '3', 
                image: 'https://example.com/profile3.jpg', 
                alt: 'Emma Davis' 
              }
            ]}
            sectionHeaderStackedProfilesText="Handpicked by"
            sectionHeaderShowCountdown={searchParams.get('type') === 'flash'}
            sectionHeaderCountdown={searchParams.get('countdown') || undefined}
          />
        )}

        <main className="flex-grow relative">
          <Outlet />
        </main>

        {/* Show Footer only on non-mobile and on specific pages */}
        {!isMobile && !isRootHomePage && <Footer />}

        {/* Show IndexBottomNav only on specific paths defined in the component */}
        {/* Don't show IndexBottomNav when reels is opened in modal mode (with video parameter) */}
        {isMobile && (
          pathname === '/for-you' || 
          pathname === '/' ||
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
          pathname.startsWith('/seller-dashboard') ||
          pathname.startsWith('/pickup-station')
        ) && (
          <div className="z-30">
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