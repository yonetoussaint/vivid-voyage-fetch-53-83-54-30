import React, { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/layout/Footer";
import IndexBottomNav from "@/components/layout/IndexBottomNav";
import { Outlet, useLocation } from "react-router-dom";
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

  // In MainLayout.tsx, update the headerHeightStyle to ensure bottom nav height is set correctly
  const headerHeightStyle = `
    :root {
      --header-height: ${isMobile ? '80px' : '120px'};
      --bottom-nav-height: ${isMobile && !isMultiStepTransferPage && !isMultiStepTransferSheetPage && !isTransferOldPage ? '48px' : '0px'};
    }
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

  // Check if current page is messages or wallet
  const isMessagesPage = pathname === '/messages';
  const isWalletPage = pathname === '/wallet';

  // Get filter from URL params for messages and wallet
  const searchParams = new URLSearchParams(location.search);
  const messagesFilter = searchParams.get('filter') || 'all';
  const walletFilter = searchParams.get('tab') || 'buyer';

  // Define custom tabs for messages page
  const messagesTabs = isMessagesPage ? [
    { id: 'all', name: 'All', path: '/messages?filter=all' },
    { id: 'unread', name: 'Unread', path: '/messages?filter=unread' },
    { id: 'blocked', name: 'Blocked', path: '/messages?filter=blocked' },
    { id: 'archived', name: 'Archived', path: '/messages?filter=archived' }
  ] : undefined;

  // Define custom tabs for wallet page
  const walletTabs = isWalletPage ? [
    { id: 'buyer', name: 'Buyer', path: '/wallet?tab=buyer' },
    { id: 'seller', name: 'Seller', path: '/wallet?tab=seller' }
  ] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: headerHeightStyle }} />

        {/* Show AliExpressHeader for category pages */}
        {shouldShowHeader && (
          <AliExpressHeader 
            activeTabId={isMessagesPage ? messagesFilter : isWalletPage ? walletFilter : activeTab}
            showFilterBar={showFilterBar}
            filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            onFilterSelect={onFilterSelect}
            onFilterClear={onFilterClear}
            onClearAll={onClearAll}
            onFilterButtonClick={onFilterButtonClick}
            isFilterDisabled={isFilterDisabled}
            customTabs={messagesTabs || walletTabs}
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
          pathname === '/categories/electronics' ||
          pathname === '/categories/home-living' ||
          pathname === '/categories/fashion' ||
          pathname === '/categories/entertainment' ||
          pathname === '/categories/kids-hobbies' ||
          pathname === '/categories/sports-outdoors' ||
          pathname === '/categories/automotive' ||
          pathname.startsWith('/seller-dashboard')
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