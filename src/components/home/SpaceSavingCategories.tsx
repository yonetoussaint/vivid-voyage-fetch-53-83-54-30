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
  Zap,
  TrendingUp,
  ChevronRight
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

// Promo Card Component
const SellerPromoCard = () => {
  const navigate = useNavigate();
  
  const handleBecomeSeller = () => {
    navigate('/become-seller');
  };

  return (
    <div 
      className="flex flex-col w-20 h-24 flex-shrink-0 cursor-pointer bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2.5 active:opacity-90 transition-all touch-manipulation shadow-sm"
      onClick={handleBecomeSeller}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <Zap className="w-3 h-3 text-white/80" />
      </div>
      
      <div className="flex-grow">
        <div className="text-white text-xs font-semibold leading-tight mb-1">
          Become a Seller
        </div>
        <div className="text-white/90 text-[10px] leading-tight">
          Start earning today
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <TrendingUp className="w-3 h-3 text-white/70" />
        <ChevronRight className="w-3 h-3 text-white" />
      </div>
    </div>
  );
};

// Category shortcut component - reduced size and more square
const CategoryShortcut = ({ category, onCategorySelect }: { category: Category; onCategorySelect?: (category: string) => void }) => {
  return (
    <div 
      className="flex flex-col items-center w-14 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className="relative mb-1.5">
        <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center border border-gray-200`}>
          {React.createElement(category.icon, { 
            className: `w-5 h-5 ${category.iconBg}` 
          })}
        </div>

        {category.count !== undefined && category.count > 0 && (
          <div className="absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-medium px-1 border border-white shadow-sm z-10">
            {category.count > 99 ? '99+' : category.count}
          </div>
        )}
      </div>

      <span className="text-[11px] font-normal text-gray-800 text-center w-full leading-tight px-0.5 truncate">
        {category.name}
      </span>
    </div>
  );
};

const SpaceSavingCategories: React.FC<SpaceSavingCategoriesProps> = ({ 
  onCategorySelect,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showGridView, setShowGridView] = useState(false);

  // Default categories structure - All items included, no "More" button
  const defaultCategories: Category[] = [
    { 
      id: 'explore', 
      name: 'Explore', 
      icon: Sparkles,
      bgColor: 'bg-pink-50', 
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
      bgColor: 'bg-purple-50', 
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
      bgColor: 'bg-teal-50', 
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
      bgColor: 'bg-blue-50', 
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
      bgColor: 'bg-gray-50', 
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

  const displayedCategories = [...categories];

  return (
    <div className="w-full bg-white overflow-visible">
      <div className="bg-white overflow-visible">
        {/* Horizontal row with seller promo card + all categories */}
        <div 
          ref={rowRef}
          className="px-2 overflow-visible"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Seller Promo Card - First element */}
            <SellerPromoCard />
            
            {/* All categories in a row - including the last element */}
            {displayedCategories.map(category => (
              <div key={category.id} className="overflow-visible py-1">
                <CategoryShortcut category={category} onCategorySelect={handleCategorySelect} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceSavingCategories;