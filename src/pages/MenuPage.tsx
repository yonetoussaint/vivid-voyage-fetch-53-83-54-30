
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Search, MoreVertical } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth/AuthContext';
import { cn } from '@/lib/utils';
import {
  MessageCircle, Users, Film, PlayCircle, ShoppingBag, Star,
  Bookmark, Gift, Calendar, CheckCircle, Camera, Clock,
  Heart, HelpCircle, Settings, Bell, Store
} from 'lucide-react';

const MenuPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'profile-dashboard',
      title: 'Profile Dashboard',
      icon: Users,
      color: 'bg-blue-600',
      iconColor: 'text-white',
      path: '/profile/orders',
      fullWidth: true
    },
    {
      id: 'seller-dashboard',
      title: 'Seller Dashboard',
      icon: Store,
      color: 'bg-green-600',
      iconColor: 'text-white',
      path: '/seller-dashboard/overview',
      fullWidth: true
    },
    {
      id: 'invite',
      title: 'Invite friends',
      icon: Heart,
      color: 'bg-red-500',
      iconColor: 'text-white',
      path: '/invite-friends',
      fullWidth: true
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      path: '/messages'
    },
    {
      id: 'groups',
      title: 'Groups',
      icon: Users,
      color: 'bg-blue-600',
      iconColor: 'text-white',
      path: '/groups'
    },
    {
      id: 'reels',
      title: 'Reels',
      icon: Film,
      color: 'bg-purple-500',
      iconColor: 'text-white',
      path: '/reels'
    },
    {
      id: 'live',
      title: 'Live videos',
      icon: PlayCircle,
      color: 'bg-red-600',
      iconColor: 'text-white',
      badge: 'LIVE',
      badgeColor: 'bg-red-600 text-white',
      path: '/live'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: ShoppingBag,
      color: 'bg-teal-500',
      iconColor: 'text-white',
      path: '/shopping'
    },
    {
      id: 'pages',
      title: 'Pages',
      icon: Star,
      color: 'bg-orange-500',
      iconColor: 'text-white',
      path: '/pages'
    },
    {
      id: 'saved',
      title: 'Saved',
      icon: Bookmark,
      color: 'bg-purple-600',
      iconColor: 'text-white',
      path: '/bookmarks'
    },
    {
      id: 'birthdays',
      title: 'Birthdays',
      icon: Gift,
      color: 'bg-blue-400',
      iconColor: 'text-white',
      path: '/birthdays'
    },
    {
      id: 'events',
      title: 'Events',
      icon: Calendar,
      color: 'bg-red-500',
      iconColor: 'text-white',
      path: '/events'
    },
    {
      id: 'verified',
      title: 'Meta Verified',
      icon: CheckCircle,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      path: '/verified'
    },
    {
      id: 'feeds',
      title: 'Feeds',
      icon: Camera,
      color: 'bg-orange-600',
      iconColor: 'text-white',
      path: '/feeds'
    },
    {
      id: 'instagram',
      title: 'Instagram Lite',
      icon: Camera,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      iconColor: 'text-white',
      path: '/instagram'
    },
    {
      id: 'memories',
      title: 'Memories',
      icon: Clock,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      path: '/memories',
      fullWidth: true
    }
  ];

  const handleItemClick = (item: any) => {
    // Store the selected item for the bottom nav
    localStorage.setItem('selectedMoreItem', item.title);
    
    // Navigate to the item's path
    if (item.path !== '#') {
      navigate(item.path);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* User Profile Section */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="User" />
                <AvatarFallback className="text-sm font-medium bg-gray-200 text-gray-700">
                  {user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your profile</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isFullWidth = item.fullWidth;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  isFullWidth ? "w-full" : "w-full"
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-full", item.color)}>
                    <Icon className={cn("w-6 h-6", item.iconColor)} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {item.title}
                    </p>
                  </div>
                  {item.badge && (
                    <div className={cn("px-2 py-1 rounded text-xs font-bold", item.badgeColor)}>
                      {item.badge}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
