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
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from "@/contexts/auth/AuthContext";
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
      className="flex flex-col items-center w-full flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className="relative mb-1.5">
        <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center border border-gray-200`}>
          {React.createElement(category.icon, { 
            className: `w-5 h-5 ${category.iconBg}` 
          })}
        </div>

        {category.count !== undefined && category.count > 0 && (
          <div className="absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-medium px-0.5 border border-white shadow-sm z-10">
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
  const [showAllCategories, setShowAllCategories] = useState(false);

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
      name: 'Alerts', 
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
    } else if (categoryName === 'Alerts') {
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

  const displayedCategories = categories;
  const firstRowCategories = displayedCategories.slice(0, 5);
  const remainingCategories = displayedCategories.slice(5);

  return (
    <div className="w-full bg-white overflow-visible">
      <div className="bg-white overflow-visible">
        {/* Horizontal row with all 5 categories in a single row - FULL WIDTH */}
        <div 
          ref={rowRef}
          className="overflow-visible"
        >
          <div className="grid grid-cols-5 gap-0">
            {firstRowCategories.map(category => (
              <div 
                key={category.id}
                className="flex justify-center overflow-visible py-1"
              >
                <CategoryShortcut category={category} onCategorySelect={handleCategorySelect} />
              </div>
            ))}
          </div>
        </div>

        {/* Seller Promotion Banner - Adjusted to have side margins */}
        <div className="mt-2 mx-2 mb-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg overflow-hidden shadow-sm border border-orange-300">
          <div className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Become a Seller</p>
                <p className="text-[10px] text-white/90">Start earning in just 5 minutes</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/seller-registration')}
              className="flex items-center gap-1 bg-white text-orange-600 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
              <span>Join Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="bg-black/10 px-2 py-1 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-white/80" />
              <span className="text-[10px] text-white/90 font-medium">10K+ Sellers</span>
            </div>
            <div className="h-3 w-px bg-white/30"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span className="text-[10px] text-white/90 font-medium">₹50K+ Avg. Monthly</span>
            </div>
          </div>
        </div>

        {/* Show remaining categories if any (though we only have 5) */}
        {showAllCategories && remainingCategories.length > 0 && (
          <div className="px-3 pb-3 pt-2 bg-white border-t border-gray-100">
            <div className="grid grid-cols-5 gap-2">
              {remainingCategories.map((category) => (
                <div 
                  key={category.id}
                  className="flex flex-col items-center active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <div className="relative mb-1.5">
                    <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center border border-gray-200`}>
                      {React.createElement(category.icon, { 
                        className: `w-5 h-5 ${category.iconBg}` 
                      })}
                    </div>

                    {category.count !== undefined && category.count > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-medium px-0.5 border border-white shadow-sm z-10">
                        {category.count > 99 ? '99+' : category.count}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-normal text-gray-800 text-center w-full leading-tight px-0.5 truncate">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceSavingCategories;