import React, { useRef } from 'react';
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
  HelpCircle 
} from 'lucide-react';
import SectionHeader from "./SectionHeader";

interface SpaceSavingCategoriesProps {
  onCategorySelect?: (category: string) => void;
  // Optional SectionHeader props
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerIcon?: LucideIcon;
  headerViewAllLink?: string;
  headerViewAllText?: string;
  headerTitleTransform?: "uppercase" | "capitalize" | "none";
}

// Category shortcut component - FIXED for centered text
const CategoryShortcut = ({ category, onCategorySelect }) => {
  const IconComponent = category.icon;

  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className={`relative w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
        <IconComponent className={`w-7 h-7 ${category.iconBg}`} />
      </div>
      {/* Add ellipsis truncation to prevent line breaks */}
      <span className="text-xs font-normal text-gray-800 text-center w-full mt-2 leading-tight px-1 truncate">
        {category.name}
      </span>
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
  headerTitleTransform = "uppercase"
}) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'Shorts') {
      // Open reels in modal mode
      navigate('/reels?video=modal');
    } else if (categoryName === 'My Store') {
      // Navigate to seller dashboard
      navigate('/seller-dashboard');
    } else if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  // Top 10 product categories data
  const categories = [
    { 
      id: 'new-arrivals', 
      name: 'Shorts', 
      icon: Zap,
      bgColor: 'bg-red-100', 
      iconBg: 'text-red-500',
      labelBg: 'bg-red-600/90',
      isSpecial: true
    },
    { 
      id: 'trending', 
      name: 'My Store', 
      icon: Store,
      bgColor: 'bg-purple-100', 
      iconBg: 'text-purple-500',
      labelBg: 'bg-purple-600/90',
      isSpecial: true
    },
    { 
      id: 'wishlist', 
      name: 'Wishlist', 
      icon: Heart,
      bgColor: 'bg-teal-100', 
      iconBg: 'text-teal-500',
      labelBg: 'bg-teal-600/90',
      isSpecial: true
    },
    { 
      id: 'cart', 
      name: 'Cart', 
      icon: ShoppingCart,
      bgColor: 'bg-yellow-100', 
      iconBg: 'text-yellow-500',
      labelBg: 'bg-yellow-600/90',
      isSpecial: true
    },
    
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      bgColor: 'bg-blue-100', 
      iconBg: 'text-blue-500',
      labelBg: 'bg-blue-600/90',
      isSpecial: true
    },
    { 
      id: 'addresses', 
      name: 'Addresses', 
      icon: MapPin,
      bgColor: 'bg-indigo-100', 
      iconBg: 'text-indigo-500',
      labelBg: 'bg-indigo-600/90',
      isSpecial: true
    },
    { 
      id: 'help', 
      name: 'Help', 
      icon: HelpCircle,
      bgColor: 'bg-gray-100', 
      iconBg: 'text-gray-500',
      labelBg: 'bg-gray-600/90',
      isSpecial: true
    }
  ];

  return (
    <div className="w-full bg-white">
      {showHeader && headerTitle && (
        <SectionHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          icon={headerIcon}
          viewAllLink={headerViewAllLink}
          viewAllText={headerViewAllText}
          titleTransform={headerTitleTransform}
        />
      )}
      <div className="bg-white">
        <div 
          ref={rowRef}
          className="flex overflow-x-auto pl-1 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {categories.map(category => (
            <div 
              key={category.id}
              className="flex-shrink-0 mr-[3vw]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CategoryShortcut category={category} onCategorySelect={handleCategorySelect} />
            </div>
          ))}

          {/* Add right spacing for proper scrolling to the end */}
          <div className="flex-shrink-0 w-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SpaceSavingCategories;