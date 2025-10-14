import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  TrendingUp, 
  Percent, 
  Flame, 
  Star, 
  Tag, 
  DollarSign, 
  Gift, 
  Leaf, 
  Store,
  Zap,
  Crown,
  Heart,
  ShoppingCart,
  Bell,
  MapPin,
  HelpCircle,
  Pen,
  GripVertical,
  Check,
  Grid3x3,
  ChevronUp
} from 'lucide-react';
import SectionHeader from "./SectionHeader";
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface SpaceSavingCategoriesProps {
  onCategorySelect?: (category: string) => void;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerIcon?: LucideIcon;
  headerViewAllLink?: string;
  headerViewAllText?: string;
  headerTitleTransform?: "uppercase" | "capitalize" | "none";
  onCustomizeClick?: () => void;
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

// Draggable category item for reordering
const DraggableCategoryItem = ({ 
  category, 
  index, 
  isDragging, 
  onDragStart, 
  onDragOver, 
  onDragEnd 
}: { 
  category: Category; 
  index: number; 
  isDragging: boolean; 
  onDragStart: (e: React.DragEvent, index: number) => void; 
  onDragOver: (e: React.DragEvent, index: number) => void; 
  onDragEnd: () => void; 
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100 hover:bg-gray-50'
      }`}
    >
      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
          {React.createElement(category.icon, { 
            className: `w-5 h-5 ${category.iconBg}` 
          })}
        </div>

        {category.count !== undefined && category.count > 0 && (
          <div className="absolute -top-2 -right-2 min-w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium px-1 border border-white z-10">
            {category.count > 99 ? '99+' : category.count}
          </div>
        )}
      </div>

      <span className="text-sm font-medium text-gray-800 flex-grow">{category.name}</span>

      {category.count !== undefined && category.count > 0 && (
        <div className="bg-red-500 text-white text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {category.count > 99 ? '99+' : category.count}
        </div>
      )}

      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {!isDragging && (
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        )}
      </div>
    </div>
  );
};

const SpaceSavingCategories: React.FC<SpaceSavingCategoriesProps> = ({ 
  onCategorySelect,
  showHeader = true,
  headerTitle = "Popular Shortcuts",
  headerSubtitle,
  headerIcon = Star,
  headerViewAllLink,
  headerViewAllText,
  headerTitleTransform = "uppercase",
  onCustomizeClick
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCustomizePanelOpen, setIsCustomizePanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showGridView, setShowGridView] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Default categories structure
  const defaultCategories: Category[] = [
    { 
      id: 'new-arrivals', 
      name: 'Shorts', 
      icon: Zap,
      bgColor: 'bg-red-100', 
      iconBg: 'text-red-500',
      labelBg: 'bg-red-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 0
    },
    { 
      id: 'explore', 
      name: 'Explore', 
      icon: Sparkles,
      bgColor: 'bg-pink-100', 
      iconBg: 'text-pink-500',
      labelBg: 'bg-pink-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 1
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
      orderIndex: 2
    },
    { 
      id: 'my-station', 
      name: 'My Station', 
      icon: MapPin,
      bgColor: 'bg-orange-100', 
      iconBg: 'text-orange-500',
      labelBg: 'bg-orange-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 3
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
      orderIndex: 4
    },
    { 
      id: 'cart', 
      name: 'Cart', 
      icon: ShoppingCart,
      bgColor: 'bg-yellow-100', 
      iconBg: 'text-yellow-500',
      labelBg: 'bg-yellow-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 5
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
      orderIndex: 6
    },
    { 
      id: 'addresses', 
      name: 'Addresses', 
      icon: MapPin,
      bgColor: 'bg-indigo-100', 
      iconBg: 'text-indigo-500',
      labelBg: 'bg-indigo-600/90',
      isSpecial: true,
      count: 0,
      orderIndex: 7
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
      orderIndex: 8
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
        cartResult,
        notificationsResult,
        addressesResult,
        helpTicketsResult
      ] = await Promise.all([
        supabase
          .from('wishlist')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('cart')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_read', false),

        supabase
          .from('user_addresses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('help_tickets')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'open')
      ]);

      return {
        wishlist: wishlistResult.count || 0,
        cart: cartResult.count || 0,
        notifications: notificationsResult.count || 0,
        addresses: addressesResult.count || 0,
        help: helpTicketsResult.count || 0
      };
    } catch (error) {
      return {
        wishlist: 0,
        cart: 0,
        notifications: 0,
        addresses: 0,
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
      case 'cart':
        return userCounts.cart ?? 0;
      case 'notifications':
        return userCounts.notifications ?? 0;
      case 'addresses':
        return userCounts.addresses ?? 0;
      case 'help':
        return userCounts.help ?? 0;
      default:
        return 0;
    }
  };

  // Save category order to Supabase
  const saveCategoryOrder = async (categoriesToSave: Category[]) => {
    try {
      setIsSaving(true);

      if (!user) {
        toast.error('Please log in to save your preferences');
        return false;
      }

      const categoryOrder = categoriesToSave.map(cat => cat.id);

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          shortcuts_order: categoryOrder,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        toast.error('Failed to save changes');
        return false;
      }

      toast.success('Shortcuts order saved successfully');
      return true;
    } catch (error) {
      toast.error('Failed to save changes');
      return false;
    } finally {
      setIsSaving(false);
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
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (rowRef.current) {
          rowRef.current.scrollLeft = 0;
        }
      }, 0);
    }
  }, [categories]);

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'Shorts') {
      navigate('/reels?video=modal');
    } else if (categoryName === 'Explore') {
      navigate('/explore');
    } else if (categoryName === 'My Store') {
      navigate('/seller-dashboard');
    } else if (categoryName === 'My Station') {
      navigate('/pickup-station');
    } else if (categoryName === 'Wishlist') {
      navigate('/wishlist');
    } else if (categoryName === 'Cart') {
      navigate('/cart');
    } else if (categoryName === 'Notifications') {
      navigate('/notifications');
    } else if (categoryName === 'Addresses') {
      navigate('/addresses');
    } else if (categoryName === 'Help') {
      navigate('/help');
    } else if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  const handleCustomizeClick = () => {
    if (!user) {
      toast.error('Please log in to customize shortcuts');
      return;
    }
    setIsCustomizePanelOpen(true);
    onCustomizeClick?.();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];

    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    setCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSaveOrder = async () => {
    if (!user) {
      toast.error('Please log in to save changes');
      return;
    }
    const success = await saveCategoryOrder(categories);
    if (success) {
      // Update cache immediately
      const categoryOrder = categories.map(cat => cat.id);
      localStorage.setItem(`shortcut-order-${user.id}`, JSON.stringify(categoryOrder));

      setIsCustomizePanelOpen(false);
      // Reset scroll position to start after reordering
      if (rowRef.current) {
        rowRef.current.scrollLeft = 0;
      }
    }
  };

  const toggleExpandCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
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
      {showHeader && headerTitle && (
        <SectionHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          icon={headerIcon}
          viewAllLink={headerViewAllLink}
          viewAllText={headerViewAllText}
          titleTransform={headerTitleTransform}
          showCustomButton={true}
          customButtonText="Customize"
          customButtonIcon={Pen}
          onCustomButtonClick={handleCustomizeClick}
        />
      )}

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

            {/* Sophisticated 2x2 grid preview button */}
            {!showGridView && remainingCategories.length > 0 && (
              <div className="flex justify-center overflow-visible py-2">
                <div 
                  className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer relative"
                  onClick={() => setShowGridView(true)}
                >
                  {/* 2x2 grid container */}
                  <div className="relative mb-2 w-14 h-14 bg-gray-100 rounded-xl overflow-hidden">
                    {/* Grid layout */}
                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-px">
                      {/* Top-left */}
                      {remainingCategories[0] && (
                        <div className={`${remainingCategories[0].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[0].icon, { 
                            className: `w-4 h-4 ${remainingCategories[0].iconBg}` 
                          })}
                        </div>
                      )}
                      {/* Top-right */}
                      {remainingCategories[1] && (
                        <div className={`${remainingCategories[1].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[1].icon, { 
                            className: `w-4 h-4 ${remainingCategories[1].iconBg}` 
                          })}
                        </div>
                      )}
                      {/* Bottom-left */}
                      {remainingCategories[2] && (
                        <div className={`${remainingCategories[2].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[2].icon, { 
                            className: `w-4 h-4 ${remainingCategories[2].iconBg}` 
                          })}
                        </div>
                      )}
                      {/* Bottom-right */}
                      {remainingCategories[3] && (
                        <div className={`${remainingCategories[3].bgColor} flex items-center justify-center opacity-70`}>
                          {React.createElement(remainingCategories[3].icon, { 
                            className: `w-4 h-4 ${remainingCategories[3].iconBg}` 
                          })}
                        </div>
                      )}
                    </div>

                    {/* Overlay counter */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-lg font-bold text-white drop-shadow-md">
                        +{remainingCount}
                      </span>
                    </div>

                    {/* Show count badge from first category if it has notifications */}
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

        {/* Grid view for remaining categories with hide button as last item */}
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

              {/* Hide button as the last item in the grid */}
              <div 
                className="flex flex-col items-center active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
                onClick={() => setShowGridView(false)}
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ChevronUp className="w-7 h-7 text-gray-500" />
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

      <SlideUpPanel
        isOpen={isCustomizePanelOpen}
        onClose={() => setIsCustomizePanelOpen(false)}
        title="Customize Shortcuts"
        showCloseButton={true}
        preventBodyScroll={true}
        className="p-4"
        stickyFooter={
          <div className="p-2">
            <button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              Drag and drop to reorder your shortcuts. Changes will be saved when you tap "Save Changes".
            </p>
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <DraggableCategoryItem
                key={category.id}
                category={category}
                index={index}
                isDragging={draggedIndex === index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      </SlideUpPanel>
    </div>
  );
};

export default SpaceSavingCategories;