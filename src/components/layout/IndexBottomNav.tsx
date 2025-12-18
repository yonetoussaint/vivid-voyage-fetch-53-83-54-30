import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, Wallet, LayoutGrid, X,
  Settings, Bell, Bookmark, Star, Users, ShoppingBag, User,
  MessageCircle, Film, Calendar, Gift, Camera, PlayCircle, 
  MapPin, Heart, HelpCircle, Store, ShoppingCart, Grid3X3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ProductUploadOverlay from '@/components/product/ProductUploadOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import { Store04Icon } from '@hugeicons-pro/core-stroke-rounded';

import SimpleAuthPage from '@/pages/SimpleAuthPage';
import SignInBanner from './SignInBanner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import { useTranslation } from 'react-i18next';

interface BottomNavTab {
  id: string;
  nameKey: string;
  icon: React.FC<any> | React.ForwardRefExoticComponent<any>;
  path: string;
  isAvatar?: boolean;
  badge?: number;
}

// Custom HomeIcon component that uses the image
const HomeIcon = ({ className, width, height }: { className?: string; width?: number; height?: number }) => {
  return (
    <img 
      src="/20251125_090458.png" 
      alt="Home"
      className={className}
      style={{ 
        width: width || 20, 
        height: height || 20,
        objectFit: 'contain'
      }}
    />
  );
};

// Custom MallIcon component using Hugeicons Store04Icon
const MallIcon = ({ className, width, height }: { className?: string; width?: number; height?: number }) => {
  return (
    <HugeiconsIcon
      icon={Store04Icon}
      size={width || 20}
      color="currentColor"
      strokeWidth={1.5}
      className={className}
    />
  );
};

const getNavItems = (
  isSellerDashboard: boolean, 
  isPickupStation: boolean, 
  isExplorePage: boolean,
  isWishlistPage: boolean,
  isCartPage: boolean,
  isNotificationsPage: boolean,
  isAddressesPage: boolean,
  isHelpPage: boolean,
  isMessagesPage: boolean,
  isMallPage: boolean,
  isReelsPage: boolean,
  isProfilePage: boolean,
  isCategoriesPage: boolean
): BottomNavTab[] => {
  let homeLabel = 'navigation.home';
  let homeIcon: any = HomeIcon;
  let homePath = '/for-you';

  if (isSellerDashboard || isPickupStation) {
    homeLabel = 'navigation.store';
    homeIcon = Store;
    homePath = isSellerDashboard ? '/seller-dashboard' : '/pickup-station';
  } else if (isExplorePage) {
    homeLabel = 'navigation.explore';
    homeIcon = LayoutGrid;
    homePath = '/explore';
  } else if (isWishlistPage) {
    homeLabel = 'Wishlist';
    homeIcon = Heart;
    homePath = '/wishlist';
  } else if (isCartPage) {
    homeLabel = 'Cart';
    homeIcon = ShoppingCart;
    homePath = '/cart';
  } else if (isNotificationsPage) {
    homeLabel = 'Notifications';
    homeIcon = Bell;
    homePath = '/notifications';
  } else if (isAddressesPage) {
    homeLabel = 'Addresses';
    homeIcon = MapPin;
    homePath = '/addresses';
  } else if (isHelpPage) {
    homeLabel = 'Help';
    homeIcon = HelpCircle;
    homePath = '/help';
  }

  // Determine labels and icons for other nav items
  let reelsLabel = 'navigation.shorts';
  let reelsIcon: any = Zap;
  let reelsPath = '/reels';

  let mallLabel = 'navigation.mall';
  let mallIcon: any = MallIcon;
  let mallPath = '/mall';

  let messagesLabel = 'navigation.messages';
  let messagesIcon: any = MessageCircle;
  let messagesPath = '/messages';

  let profileLabel = 'navigation.account';
  let profileIcon: any = User;
  let profilePath = '/profile/orders';

  // Update if on specific pages
  if (isReelsPage) {
    reelsLabel = 'navigation.shorts';
    reelsIcon = Zap;
    reelsPath = '/reels';
  }

  if (isMallPage) {
    mallLabel = 'navigation.mall';
    mallIcon = MallIcon;
    mallPath = '/mall';
  }

  if (isMessagesPage) {
    messagesLabel = 'navigation.messages';
    messagesIcon = MessageCircle;
    messagesPath = '/messages';
  }

  if (isProfilePage) {
    profileLabel = 'navigation.account';
    profileIcon = User;
    profilePath = '/profile/orders';
  }

  // Updated order: Home, Reels, Mall, Messages, Profile
  return [
    { 
      id: 'home', 
      nameKey: homeLabel, 
      icon: homeIcon, 
      path: homePath
    }, 
    { id: 'reels', nameKey: reelsLabel, icon: reelsIcon, path: reelsPath },
    { id: 'mall', nameKey: mallLabel, icon: mallIcon, path: mallPath },
    { id: 'messages', nameKey: messagesLabel, icon: messagesIcon, path: messagesPath },
    { id: 'profile', nameKey: profileLabel, icon: profileIcon, path: profilePath, isAvatar: true },
  ];
};

// More menu items that will appear in the side panel
const moreMenuItems = [
  { id: 'account', nameKey: 'navigation.account', icon: User, path: '/profile' },
  { id: 'messages', nameKey: 'navigation.messages', icon: MessageCircle, path: '/messages' },
  { id: 'videos', nameKey: 'navigation.videos', icon: Film, path: '/videos' },
  { id: 'categories', nameKey: 'navigation.categories', icon: Grid3X3, path: '/categories' },
  { id: 'marketplace', nameKey: 'navigation.shopping', icon: ShoppingBag, path: '/shopping' },
  { id: 'events', nameKey: 'navigation.events', icon: Calendar, path: '/events' },
  { id: 'memories', nameKey: 'navigation.memories', icon: Camera, path: '/memories' },
  { id: 'saved', nameKey: 'navigation.bookmarks', icon: Bookmark, path: '/bookmarks' },
  { id: 'groups', nameKey: 'navigation.groups', icon: Users, path: '/groups' },
  { id: 'pages', nameKey: 'navigation.pages', icon: Star, path: '/pages' },
  { id: 'live', nameKey: 'navigation.live', icon: PlayCircle, path: '/live' },
  { id: 'notifications', nameKey: 'navigation.notifications', icon: Bell, path: '/notifications', badge: 12 },
  { id: 'friends', nameKey: 'navigation.friends', icon: Users, path: '/friends', badge: 3 },
  { id: 'settings', nameKey: 'navigation.settings', icon: Settings, path: '/settings' },
  { id: 'help', nameKey: 'navigation.help', icon: HelpCircle, path: '/help' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setIsAuthOverlayOpen } = useAuth();
  const { hasActiveOverlay } = useScreenOverlay();
  const { t } = useTranslation('home');
  const navRef = useRef<HTMLDivElement>(null);

  // Check if we're on the seller edit profile page
  const isSellerEditProfile = location.pathname.includes('/seller-dashboard/edit-profile');
  // Check if we're on the product edit page
  const isProductEditPage = location.pathname.includes('/products/edit/');

  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState(null);
  const [animating, setAnimating] = useState(false);

  // Check if we're in special pages that should show X button
  const isSellerDashboard = location.pathname.startsWith('/seller-dashboard');
  const isPickupStation = location.pathname.startsWith('/pickup-station');
  const isExplorePage = location.pathname.startsWith('/explore');
  const isWishlistPage = location.pathname.startsWith('/wishlist');
  const isCartPage = location.pathname.startsWith('/cart');
  const isNotificationsPage = location.pathname.startsWith('/notifications');
  const isAddressesPage = location.pathname.startsWith('/addresses');
  const isHelpPage = location.pathname.startsWith('/help');
  const isMessagesPage = location.pathname.startsWith('/messages');
  const isMallPage = location.pathname.startsWith('/mall');
  const isReelsPage = location.pathname.startsWith('/reels');
  const isProfilePage = location.pathname.startsWith('/profile');
  const isCategoriesPage = location.pathname.startsWith('/categories');

  const navItems = getNavItems(
    isSellerDashboard, 
    isPickupStation, 
    isExplorePage, 
    isWishlistPage, 
    isCartPage, 
    isNotificationsPage, 
    isAddressesPage, 
    isHelpPage, 
    isMessagesPage, 
    isMallPage,
    isReelsPage, 
    isProfilePage,
    isCategoriesPage
  );

  // Sync activeTab with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = navItems.find(item => item.path === currentPath);
    if (matchingItem) {
      setActiveTab(matchingItem.id);
    }
  }, [location.pathname]);

  // Set CSS custom property for the nav height
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);
      }
    };

    // Initial measurement
    updateNavHeight();

    // Re-measure on resize
    window.addEventListener('resize', updateNavHeight);

    // Use ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(updateNavHeight);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateNavHeight);
      resizeObserver.disconnect();
    };
  }, []);

  const [showProductUpload, setShowProductUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSignInBanner, setShowSignInBanner] = useState(true);
  const [showMorePanel, setShowMorePanel] = useState(false);

  const [reorderedNavItems, setReorderedNavItems] = useState(navItems);
  const [selectedMoreItem, setSelectedMoreItem] = useState(() => t('navigation.more'));

  // Update reorderedNavItems when navItems change
  useEffect(() => {
    setReorderedNavItems(navItems);
  }, [isSellerDashboard, isPickupStation, isExplorePage, isWishlistPage, isCartPage, isNotificationsPage, isAddressesPage, isHelpPage, isMessagesPage, isMallPage, isReelsPage, isProfilePage, isCategoriesPage]);

  // Load selected more item from localStorage on mount
  useEffect(() => {
    const savedSelectedItem = localStorage.getItem('selectedMoreItem');
    if (savedSelectedItem) {
      setSelectedMoreItem(savedSelectedItem);
    }
  }, []);

  // Listen for localStorage changes to update the button text and icon
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSelectedItem = localStorage.getItem('selectedMoreItem');
      if (savedSelectedItem) {
        setSelectedMoreItem(savedSelectedItem);
      }
    };

    const interval = setInterval(handleStorageChange, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Handle tab click navigation
  const handleTabClick = (item: BottomNavTab) => {
    if (item.path === '#') return;

    // Check if clicking on profile/account tab and user is not authenticated
    if (item.id === 'profile' && !user) {
      setIsAuthOverlayOpen(true);
      return;
    }

    setActiveTab(item.id);
    setPreviousTab(activeTab);
    setAnimating(true);

    navigate(item.path);

    setTimeout(() => {
      setAnimating(false);
      setPreviousTab(null);
    }, 300);
  };

  // Handle more menu item click
  const handleMoreItemClick = (item: any) => {
    localStorage.setItem('selectedMoreItem', item.nameKey);
    setShowMorePanel(false);

    if (item.path !== "#") {
      navigate(item.path);
    }
  };

  const visibleItems = navItems;

  // Don't render if overlay screens are active OR if we're on seller edit profile page OR product edit page
  if (hasActiveOverlay || isSellerEditProfile || isProductEditPage) {
    return null;
  }

  // Don't show SignInBanner on reels route
  const shouldShowSignInBanner = showSignInBanner && !location.pathname.startsWith('/reels');

  return (
    <>
      {shouldShowSignInBanner && <SignInBanner />}

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="w-full max-w-sm p-0 h-[100dvh] sm:h-auto overflow-auto">
          <button 
            onClick={() => setShowAuthDialog(false)}
            className="absolute left-4 top-4 z-50 rounded-sm opacity-70 text-white bg-gray-800/40 hover:bg-gray-700/40 transition-opacity p-1"
          >
            <X className="h-4 w-4" />
          </button>
          <SimpleAuthPage isOverlay onClose={() => setShowAuthDialog(false)} />
        </DialogContent>
      </Dialog>

      <ProductUploadOverlay
        isOpen={showProductUpload}
        onClose={() => setShowProductUpload(false)}
      />

      <motion.div
        ref={navRef}
        data-bottom-nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex justify-between items-center h-12 px-2 max-w-md mx-auto relative">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const wasActive = previousTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={cn(
                  'flex items-center justify-center relative transition-all duration-300 ease-out transform px-3 py-1 rounded-full',
                  isActive
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : wasActive
                      ? 'scale-95 text-gray-500'
                      : 'scale-100 text-gray-500'
                )}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      'transition-transform duration-300',
                      'w-5 h-5',
                      isActive ? 'scale-110' : 'scale-100'
                    )}
                    width={20}
                    height={20}
                  />
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full"
                    >
                      {item.badge}
                    </motion.div>
                  )}
                  {isActive && (
                    <span className="ml-2 font-medium whitespace-nowrap max-w-[80px] overflow-hidden">
                      {t(item.nameKey)}
                    </span>
                  )}
                  {/* X button for special pages when active */}
                  {isActive && (
                    (item.id === 'home' && (isSellerDashboard || isPickupStation || isExplorePage || isWishlistPage || isCartPage || isNotificationsPage || isAddressesPage || isHelpPage)) ||
                    (item.id === 'reels' && isReelsPage) ||
                    (item.id === 'mall' && isMallPage) ||
                    (item.id === 'messages' && isMessagesPage) ||
                    (item.id === 'profile' && isProfilePage)
                  ) && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to the default page for each button
                        if (item.id === 'home') navigate('/for-you');
                        else if (item.id === 'reels') navigate('/reels');
                        else if (item.id === 'mall') navigate('/mall');
                        else if (item.id === 'messages') navigate('/messages');
                        else if (item.id === 'profile') navigate('/profile/orders');
                        setActiveTab(item.id);
                      }}
                      className="ml-2 p-1 hover:bg-red-700 rounded-full transition-colors cursor-pointer inline-flex"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          if (item.id === 'home') navigate('/for-you');
                          else if (item.id === 'reels') navigate('/reels');
                          else if (item.id === 'mall') navigate('/mall');
                          else if (item.id === 'messages') navigate('/messages');
                          else if (item.id === 'profile') navigate('/profile/orders');
                          setActiveTab(item.id);
                        }
                      }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}