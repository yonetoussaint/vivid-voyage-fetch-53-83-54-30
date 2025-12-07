import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  Store,
  Heart,
  Bell,
  HelpCircle,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface SpaceSavingCategoriesProps {
  onCategorySelect?: (category: string) => void;
}

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  bgColor: string;
  iconBg: string;
  labelBg?: string;
  isSpecial?: boolean;
  count?: number;
  orderIndex?: number;
}

// Category shortcut component
const CategoryShortcut = ({ category, onCategorySelect }: { category: Category; onCategorySelect?: (category: string) => void }) => {
  return (
    <div 
      className="flex flex-col items-center w-14 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className="relative mb-1">
        <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
          {React.createElement(category.icon, { 
            className: `w-5 h-5 ${category.iconBg}` 
          })}
        </div>

        {category.count !== undefined && category.count > 0 && (
          <div className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium px-1 border border-white shadow-sm z-10">
            {category.count > 99 ? '99+' : category.count}
          </div>
        )}
      </div>

      <span className="text-[10px] font-normal text-gray-800 text-center w-full leading-tight px-0.5 truncate">
        {category.name}
      </span>
    </div>
  );
};

// Promo card component for sellers
const SellerPromoCard = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="w-40 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100 p-3 flex flex-col justify-between active:opacity-90 transition-opacity touch-manipulation cursor-pointer shadow-sm"
      onClick={() => navigate('/become-seller')}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Become a Seller</h3>
            <p className="text-xs text-gray-600 mt-0.5">Start earning today</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-700 font-medium">0% commission</span>
        </div>
        <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-medium">
          Join now
        </span>
      </div>
    </div>
  );
};

const SpaceSavingCategories: React.FC<SpaceSavingCategoriesProps> = ({ 
  onCategorySelect,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Default categories structure
  const defaultCategories: Category[] = [
    { 
      id: 'explore', 
      name: 'Explore', 
      icon: Sparkles,
      bgColor: 'bg-pink-100', 
      iconBg: 'text-pink-500',
      labelBg: 'bg-pink-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 0
    },
    { 
      id: 'trending', 
      name: 'My Store', 
      icon: Store,
      bgColor: 'bg-purple-100', 
      iconBg: 'text-purple-500',
      labelBg: 'bg-purple-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 1
    },
    { 
      id: 'wishlist', 
      name: 'Wishlist', 
      icon: Heart,
      bgColor: 'bg-teal-100', 
      iconBg: 'text-teal-500',
      labelBg: 'bg-teal-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 2
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      bgColor: 'bg-blue-100', 
      iconBg: 'text-blue-500',
      labelBg: 'bg-blue-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 3
    },
    { 
      id: 'help', 
      name: 'Help', 
      icon: HelpCircle,
      bgColor: 'bg-gray-100', 
      iconBg: 'text-gray-500',
      labelBg: 'bg-gray-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 4
    }
  ];

  // Initialize categories from cache if available
  const getCachedCategories = (): Category[] => {
    if (!user) return defaultCategories;

    try {
      const cached = localStorage.getItem(`shortcut-order-${user.id}`);
      if (cached) {
        const cachedOrder = JSON.parse(cached) as string[];
        const ordered: Category[] = [];

        cachedOrder.forEach(categoryId => {
          const cat = defaultCategories.find(c => c.id === categoryId);
          if (cat) ordered.push(cat);
        });

        const remaining = defaultCategories.filter(
          cat => !cachedOrder.includes(cat.id)
        );

        return [...ordered, ...remaining];
      }
    } catch (error) {
      console.error('Error loading cached categories:', error);
    }

    return defaultCategories;
  };

  const [categories, setCategories] = useState<Category[]>(getCachedCategories());

  // Fetch real user data for counters
  const fetchUserDataCounts = async (userId: string) => {
    try {
      // Fetch all counts in parallel
      const [
        wishlistResult,
        notificationsResult,
        helpTicketsResult
      ] = await Promise.all([
        supabase
          .from('wishlist')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_read', false),

        supabase
          .from('help_tickets')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'open')
      ]);

      return {
        wishlist: wishlistResult.count || 0,
        notifications: notificationsResult.count || 0,
        help: helpTicketsResult.count || 0
      };
    } catch (error) {
      return {
        wishlist: 0,
        notifications: 0,
        help: 0
      };
    }
  };

  // Use React Query to cache user counts
  const { data: userCounts } = useQuery({
    queryKey: ['shortcut-counts', user?.id],
    queryFn: () => fetchUserDataCounts(user!.id),
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Use React Query to cache user preferences
  const { data: userPreferences } = useQuery({
    queryKey: ['shortcut-preferences', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('shortcuts_order')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return (data?.shortcuts_order as string[]) || null;
    },
    enabled: !!user,
    staleTime: 60000, // Cache for 1 minute
  });

  // Helper function to get count for specific category
  const getCountForCategory = (categoryId: string): number => {
    if (!userCounts) return 0;

    switch (categoryId) {
      case 'wishlist':
        return userCounts.wishlist ?? 0;
      case 'notifications':
        return userCounts.notifications ?? 0;
      case 'help':
        return userCounts.help ?? 0;
      default:
        return 0;
    }
  };

  // Update categories when user data changes
  useEffect(() => {
    if (!user) {
      setCategories(defaultCategories);
      return;
    }

    // Apply counts to categories
    let updatedCategories = categories.map(cat => ({
      ...cat,
      count: getCountForCategory(cat.id)
    }));

    // Only apply order from server if preferences are loaded and different from cache
    if (userPreferences && Array.isArray(userPreferences)) {
      try {
        const cached = localStorage.getItem(`shortcut-order-${user.id}`);
        const cachedOrder = cached ? JSON.parse(cached) : null;

        // Only reorder if server preferences differ from cached
        if (JSON.stringify(cachedOrder) !== JSON.stringify(userPreferences)) {
          const ordered: Category[] = [];
          userPreferences.forEach(categoryId => {
            const cat = updatedCategories.find(c => c.id === categoryId);
            if (cat) ordered.push(cat);
          });

          const remaining = updatedCategories.filter(
            cat => !userPreferences.includes(cat.id)
          );

          const newCategories = [...ordered, ...remaining];
          setCategories(newCategories);

          // Update cache
          localStorage.setItem(`shortcut-order-${user.id}`, JSON.stringify(userPreferences));
        } else {
          // Just update counts without reordering
          setCategories(updatedCategories);
        }
      } catch (error) {
        console.error('Error processing categories:', error);
        setCategories(updatedCategories);
      }
    } else {
      setCategories(updatedCategories);
    }
  }, [user, userCounts, userPreferences]);

  // Reset scroll position when categories change
  useEffect(() => {
    if (rowRef.current) {
      setTimeout(() => {
        if (rowRef.current) {
          rowRef.current.scrollLeft = 0;
        }
      }, 0);
    }
  }, [categories]);

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'Explore') {
      navigate('/explore');
    } else if (categoryName === 'My Store') {
      navigate('/seller-dashboard');
    } else if (categoryName === 'Wishlist') {
      navigate('/wishlist');
    } else if (categoryName === 'Notifications') {
      navigate('/notifications');
    } else if (categoryName === 'Help') {
      navigate('/help');
    } else if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  if (!user) {
    return null;
  }

  // Always show all categories in a single scrollable row
  const displayedCategories = [...categories];

  return (
    <div className="w-full bg-white overflow-visible">
      <div className="bg-white overflow-visible">
        {/* Horizontal scrollable row with promo card + categories */}
        <div 
          ref={rowRef}
          className="flex overflow-x-auto overflow-y-hidden pb-3 px-4 gap-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Promo card as first element */}
          <div className="flex-shrink-0">
            <SellerPromoCard />
          </div>

          {/* All categories displayed in the same row */}
          {displayedCategories.map(category => (
            <div 
              key={category.id}
              className="flex-shrink-0"
            >
              <CategoryShortcut category={category} onCategorySelect={handleCategorySelect} />
            </div>
          ))}
        </div>

        {/* Hide scrollbar for WebKit browsers */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SpaceSavingCategories;