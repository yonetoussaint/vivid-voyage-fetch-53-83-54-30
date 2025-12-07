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
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className="relative mb-2">
        <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
          {React.createElement(category.icon, { 
            className: `w-7 h-7 ${category.iconBg}` 
          })}
        </div>

        {category.count !== undefined && category.count > 0 && (
          <div className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium px-1 border-2 border-white shadow-sm z-10">
            {category.count > 99 ? '99+' : category.count}
          </div>
        )}
      </div>

      <span className="text-xs font-normal text-gray-800 text-center w-full leading-tight px-1 truncate">
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

  const displayedCategories = [...categories];
  const firstRowCategories = showGridView ? displayedCategories.slice(0, 5) : displayedCategories.slice(0, 4);
  const remainingCategories = showGridView ? displayedCategories.slice(5) : displayedCategories.slice(4);
  const remainingCount = displayedCategories.slice(4).length;

  return (
    <div className="w-full bg-white overflow-visible">
      <div className="bg-white overflow-visible">
        {/* Horizontal row with first 4 or 5 categories + expand/collapse button - aligned with 5-column grid */}
        <div 
          ref={rowRef}
          className="px-2 overflow-visible"
        >
          <div className="grid grid-cols-5 gap-4">
            {firstRowCategories.map(category => (
              <div 
                key={category.id}
                className="flex justify-center overflow-visible py-2"
              >
                <CategoryShortcut category={category} onCategorySelect={handleCategorySelect} />
              </div>
            ))}

            {/* Show More button for remaining categories */}
            {!showGridView && remainingCategories.length > 0 && (
              <div className="flex justify-center overflow-visible py-2">
                <div 
                  className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer relative"
                  onClick={() => setShowGridView(true)}
                >
                  <div className="relative mb-2 w-14 h-14 bg-gray-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-px">
                      {remainingCategories[0] && (
                        <div className={`${remainingCategories[0].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[0].icon, { 
                            className: `w-4 h-4 ${remainingCategories[0].iconBg}` 
                          })}
                        </div>
                      )}
                      {remainingCategories[1] && (
                        <div className={`${remainingCategories[1].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[1].icon, { 
                            className: `w-4 h-4 ${remainingCategories[1].iconBg}` 
                          })}
                        </div>
                      )}
                      {remainingCategories[2] && (
                        <div className={`${remainingCategories[2].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[2].icon, { 
                            className: `w-4 h-4 ${remainingCategories[2].iconBg}` 
                          })}
                        </div>
                      )}
                      {remainingCategories[3] && (
                        <div className={`${remainingCategories[3].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[3].icon, { 
                            className: `w-4 h-4 ${remainingCategories[3].iconBg}` 
                          })}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-lg font-bold text-white drop-shadow-md">
                        +{remainingCount}
                      </span>
                    </div>

                    {remainingCategories[0]?.count !== undefined && remainingCategories[0].count > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium px-1 border-2 border-white shadow-sm z-10">
                        {remainingCategories[0].count > 99 ? '99+' : remainingCategories[0].count}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-normal text-gray-800 text-center w-full leading-tight px-1 truncate">
                    More
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid view for remaining categories */}
        {showGridView && (
          <div className="px-2 pb-4 pt-2 bg-white">
            <div className="grid grid-cols-5 gap-4">
              {remainingCategories.map((category) => (
                <div 
                  key={category.id}
                  className="flex flex-col items-center active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <div className="relative mb-2">
                    <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      {React.createElement(category.icon, { 
                        className: `w-7 h-7 ${category.iconBg}` 
                      })}
                    </div>

                    {category.count !== undefined && category.count > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium px-1 border-2 border-white shadow-sm z-10">
                        {category.count > 99 ? '99+' : category.count}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-normal text-gray-800 text-center w-full leading-tight px-1 truncate">
                    {category.name}
                  </span>
                </div>
              ))}

              {/* Hide button */}
              <div 
                className="flex flex-col items-center active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
                onClick={() => setShowGridView(false)}
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-7 h-7 text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-normal text-gray-800 text-center w-full leading-tight px-1 truncate">
                  Hide
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceSavingCategories;