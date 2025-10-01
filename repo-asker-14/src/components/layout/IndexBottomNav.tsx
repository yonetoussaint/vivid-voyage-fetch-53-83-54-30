import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Zap, Rss, Wallet, Tv, LayoutGrid, X, MoreHorizontal,
  Settings, Bell, Bookmark, Star, Users, ShoppingBag, ChevronDown, User,
  MessageCircle, Film, Calendar, Gift, Camera, PlayCircle, 
  MapPin, Heart, HelpCircle, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ProductUploadOverlay from '@/components/product/ProductUploadOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import SimpleAuthPage from '@/pages/SimpleAuthPage';
import SignInBanner from './SignInBanner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import Logo from '@/components/home/Logo';
import { useTranslation } from 'react-i18next';

interface BottomNavTab {
  id: string;
  nameKey: string;
  icon: React.FC<any> | React.ForwardRefExoticComponent<any>;
  path: string;
  isAvatar?: boolean;
  badge?: number;
}

const getNavItems = (isSellerDashboard: boolean): BottomNavTab[] => [
  { 
    id: 'home', 
    nameKey: isSellerDashboard ? 'navigation.store' : 'navigation.home', 
    icon: isSellerDashboard ? Store : Logo, 
    path: isSellerDashboard ? '/seller-dashboard' : '/for-you' 
  }, 
  { id: 'shorts', nameKey: 'navigation.shorts', icon: Zap, path: '/reels' },
  { id: 'categories', nameKey: 'navigation.categories', icon: LayoutGrid, path: '/search' },
  { id: 'wallet', nameKey: 'navigation.wallet', icon: Wallet, path: '/wallet' },
  { id: 'profile', nameKey: 'navigation.account', icon: User, path: '/profile/dashboard', isAvatar: true },
];

// More menu items that will appear in the side panel
const moreMenuItems = [
  { id: 'account', nameKey: 'navigation.account', icon: User, path: '/profile' },
  { id: 'messages', nameKey: 'navigation.messages', icon: MessageCircle, path: '/messages' },
  { id: 'videos', nameKey: 'navigation.videos', icon: Tv, path: '/videos' },
  { id: 'reels', nameKey: 'navigation.shorts', icon: Film, path: '/reels' },
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
  const { user } = useAuth();
  const { hasActiveOverlay } = useScreenOverlay();
  const { t } = useTranslation('home');
  const navRef = useRef<HTMLDivElement>(null); // Add ref

  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState(null);
  const [animating, setAnimating] = useState(false);

  // Check if we're in seller dashboard
  const isSellerDashboard = location.pathname.startsWith('/seller-dashboard');
  const navItems = getNavItems(isSellerDashboard);

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
  }, [isSellerDashboard]);

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

  // Don't render if overlay screens are active
  if (hasActiveOverlay) {
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
        ref={navRef} // Add ref here
        data-bottom-nav // Add data attribute for the hook
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
          paddingBottom: 'env(safe-area-inset-bottom)', // Add safe area support
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
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}