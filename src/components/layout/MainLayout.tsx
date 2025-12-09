import React, { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/layout/Footer";
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

// Add this import for useAuthOverlay
import { useAuthOverlay } from "@/context/AuthOverlayContext";

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

  // Now useAuthOverlay is defined
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

  // Icon mapper to convert string names to components
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
    Book
  };

  // Get filter from URL params for messages, wallet, and explore
  const searchParams = new URLSearchParams(location.search);
  const messagesFilter = searchParams.get('filter') || 'all';
  const walletFilter = searchParams.get('tab') || 'buyer';
  const exploreFilter = searchParams.get('tab') || 'products';

  // Check if we should apply spacing (messages list only, not conversation detail, wallet, explore, products)
  const shouldApplySpacing = isMessagesListPage || isExplorePage || isWalletPage || isProductsPage;

  // Check if current page is reels
  const isReelsPage = pathname === '/reels' && !location.search.includes('video=');

  // Calculate header and bottom nav heights for CSS variables
  const headerHeight = shouldShowHeader ? (isMobile ? '80px' : '120px') : '0px';
  const bottomNavHeight = (shouldApplySpacing || isReelsPage) && isMobile && !isMultiStepTransferPage && !isMultiStepTransferSheetPage && !isTransferOldPage ? '48px' : '0px';

  // Check if current page is conversation detail
  const isConversationDetailPage = pathname.startsWith('/messages/') && pathname !== '/messages';

  // Get icon from URL and map to component
  const iconName = searchParams.get('icon');
  const sectionHeaderIcon = iconName ? iconMapper[iconName] : undefined;

  // Check if current page is seller onboarding (should not show bottom nav)
  const isSellerOnboardingPage = pathname.includes('/seller-dashboard/onboarding');

  // NEW: Check if current page is categories page (main categories page)
  const isCategoriesPage = pathname === '/categories';

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

  /* Special styling for categories page - ADD padding top */
  ${isCategoriesPage ? `
  main {
    padding-top: var(--header-height) !important;
    padding-bottom: 0 !important;
  }
  .categories-page-container {
    height: 100%;
    overflow: hidden;
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
    '/categories',  // ADDED: Main categories page
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
            showCategoryTabs={!isProductsPage && !pathname.startsWith('/categories')} // Hide tabs for categories routes
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
            // Pass mapped icon component
            {...(sectionHeaderIcon && { sectionHeaderIcon })}
            // FIXED: Only show View All when no other right-side elements are present
            sectionHeaderViewAllLink={
              (searchParams.get('showProfiles') !== 'true' &&
               searchParams.get('showVerifiedSellers') !== 'true' &&
               searchParams.get('showCountdown') !== 'true')
                ? "/vendors"
                : undefined
            }
            sectionHeaderViewAllText="View All"
          />
        )}

        <main className="flex-grow relative">
          {/* Wrap outlet with categories container when on categories page */}
          {isCategoriesPage ? (
            <div className="categories-page-container">
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        {/* Footer removed */}

        {/* Show IndexBottomNav only on specific paths defined in the component */}
        {/* Don't show IndexBottomNav when reels is opened in modal mode (with video parameter) */}
        {isMobile && (
          (pathname === '/for-you' ||
          pathname === '/' ||
          pathname === '/categories' ||  // Add this line for the main categories page
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
          pathname === '/categories/electronics' ||  // Add specific category pages
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
          // Include seller dashboard routes but exclude edit-profile and onboarding
          (pathname.startsWith('/seller-dashboard') && !pathname.includes('/edit-profile') && !pathname.includes('/onboarding')))
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