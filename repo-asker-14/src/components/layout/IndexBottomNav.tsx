import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Zap, Rss, Wallet, Tv, LayoutGrid, X, MoreHorizontal,
  Settings, Bell, Bookmark, Star, Users, ShoppingBag, ChevronDown, User,
  MessageCircle, Film, Calendar, Gift, Camera, PlayCircle, 
  MapPin, Heart, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ProductUploadOverlay from '@/components/product/ProductUploadOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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

const navItems: BottomNavTab[] = [
  { id: 'home', nameKey: 'navigation.home', icon: Logo, path: '/for-you' }, 
  { id: 'shorts', nameKey: 'navigation.shorts', icon: Zap, path: '/reels' },
  { id: 'categories', nameKey: 'navigation.categories', icon: LayoutGrid, path: '/posts' },
  { id: 'wallet', nameKey: 'navigation.wallet', icon: Wallet, path: '/wallet' },
  { id: 'more', nameKey: 'navigation.more', icon: MoreHorizontal, path: '#' },
];

// More menu items that will appear in the side panel
const moreMenuItems = [
  { id: 'account', nameKey: 'navigation.account', icon: User, path: '/profile' },
  { id: 'messages', nameKey: 'Messages', icon: MessageCircle, path: '/messages' },
  { id: 'videos', nameKey: 'navigation.videos', icon: Tv, path: '/videos' },
  { id: 'reels', nameKey: 'Reels', icon: Film, path: '/reels' },
  { id: 'marketplace', nameKey: 'Marketplace', icon: ShoppingBag, path: '/shopping' },
  { id: 'events', nameKey: 'Events', icon: Calendar, path: '/events' },
  { id: 'memories', nameKey: 'Memories', icon: Camera, path: '/memories' },
  { id: 'saved', nameKey: 'Saved', icon: Bookmark, path: '/bookmarks' },
  { id: 'groups', nameKey: 'Groups', icon: Users, path: '/groups' },
  { id: 'pages', nameKey: 'Pages', icon: Star, path: '/pages' },
  { id: 'live', nameKey: 'Live Videos', icon: PlayCircle, path: '/live' },
  { id: 'notifications', nameKey: 'navigation.notifications', icon: Bell, path: '/notifications', badge: 12 },
  { id: 'friends', nameKey: 'navigation.friends', icon: Users, path: '/friends', badge: 3 },
  { id: 'settings', nameKey: 'navigation.settings', icon: Settings, path: '/settings' },
  { id: 'help', nameKey: 'Help & Support', icon: HelpCircle, path: '/help' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasActiveOverlay } = useScreenOverlay(); // Use the context
  const { t } = useTranslation('home');

  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSignInBanner, setShowSignInBanner] = useState(true);
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [reorderedNavItems, setReorderedNavItems] = useState(navItems);
  const [selectedMoreItem, setSelectedMoreItem] = useState(() => t('navigation.more'));

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

    // Check for changes periodically
    const interval = setInterval(handleStorageChange, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // All navigation items are now visible, no overflow management needed
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

      {/* More Panel Sheet */}
      <Sheet open={showMorePanel} onOpenChange={setShowMorePanel}>
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
          </SheetHeader>
          
          {/* User Profile Section */}
          {user && (
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="User" />
                  <AvatarFallback className="text-sm font-medium">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.user_metadata?.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View your profile</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Menu Items Grid */}
          <div className="p-4 grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
            {moreMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMoreItemClick(item)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors relative"
                >
                  <div className="relative mb-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <span className="text-center text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                    {typeof item.nameKey === 'string' && item.nameKey.startsWith('navigation.') 
                      ? t(item.nameKey) 
                      : item.nameKey}
                  </span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex justify-between items-center h-12 px-2 max-w-md mx-auto relative">
          {/* Render visible items */}
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
                  {item.isAvatar && user ? (
                    <Avatar className="w-5 h-5 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="User" />
                      <AvatarFallback className="text-xs">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                   ) : (
                   <Icon
                      className={cn(
                        'transition-transform duration-300',
                        'w-5 h-5',
                        isActive ? 'scale-110' : 'scale-100'
                      )}
                      width={20}
                      height={20}
                    />
                  )}
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