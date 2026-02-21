// components/easy/UniversalTabSelector.jsx
import React from 'react';
import { Flame, Droplets, Fuel, Zap, Gauge, Circle, Users, User } from 'lucide-react';

const TabSelector = ({ 
  // Core props
  tabs = [],
  activeTab,
  onTabChange,
  
  // Styling props
  variant = 'default', // 'default', 'pills', 'underline', 'rounded'
  size = 'md', // 'sm', 'md', 'lg'
  
  // Badge configuration
  showBadges = false,
  
  // Custom class names
  containerClassName = '',
  
  // Special case for pump selector with propane
  showPropane = false,
  propaneId = 'propane',
  propaneLabel = 'Propane',
  propaneIcon = <Flame size={16} />,
  propaneColor = 'bg-red-500 text-white border-red-500',
  onPropaneClick
}) => {
  
  // Size mappings
  const sizeClasses = {
    sm: {
      container: 'gap-1',
      tab: 'px-2 py-0.5 text-xs',
      icon: 'w-3 h-3',
      badge: 'text-[10px] px-1'
    },
    md: {
      container: 'gap-1.5',
      tab: 'px-3 py-1 text-sm',
      icon: 'w-4 h-4',
      badge: 'text-xs px-1.5'
    },
    lg: {
      container: 'gap-2',
      tab: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      badge: 'text-sm px-2'
    }
  };

  // Variant styles
  const variantClasses = {
    default: {
      tab: 'border transition-all duration-200',
      active: 'bg-slate-900 text-white border-slate-900',
      inactive: 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
    },
    pills: {
      tab: 'rounded-full transition-all duration-200',
      active: 'bg-slate-900 text-white shadow-sm',
      inactive: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    },
    underline: {
      tab: 'border-b-2 transition-all duration-200',
      active: 'border-slate-900 text-slate-900',
      inactive: 'border-transparent text-slate-600 hover:border-slate-300'
    },
    rounded: {
      tab: 'border rounded-xl transition-all duration-200',
      active: 'bg-slate-900 text-white border-slate-900',
      inactive: 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Default icon mapping for string-based icons
  const getIconFromString = (icon) => {
    if (typeof icon !== 'string') return icon;
    
    const iconMap = {
      users: <Users className={currentSize.icon} />,
      user: <User className={currentSize.icon} />,
      flame: <Flame className={currentSize.icon} />,
      droplets: <Droplets className={currentSize.icon} />,
      fuel: <Fuel className={currentSize.icon} />,
      zap: <Zap className={currentSize.icon} />,
      gauge: <Gauge className={currentSize.icon} />,
      circle: <Circle className={currentSize.icon} />
    };
    
    return iconMap[icon] || icon;
  };

  // Handle propane click
  const handlePropaneClick = () => {
    if (onPropaneClick) {
      onPropaneClick();
    } else {
      onTabChange(propaneId);
    }
  };

  return (
    <div className={`flex ${currentSize.container} overflow-x-auto pb-1 px-2 no-scrollbar ${containerClassName}`}>
      {/* Main tabs */}
      {tabs.map((tab, index) => (
        <button
          key={tab.id || index}
          onClick={() => onTabChange(tab.id)}
          className={`
            ${currentSize.tab}
            ${currentVariant.tab}
            ${activeTab === tab.id 
              ? tab.activeColor || currentVariant.active 
              : tab.inactiveColor || currentVariant.inactive
            }
            flex items-center gap-1.5 whitespace-nowrap
            ${tab.className || ''}
          `}
          style={{ borderRadius: tab.rounded ? '20px' : undefined, ...tab.style }}
        >
          {tab.icon && (
            <span className={currentSize.icon}>
              {getIconFromString(tab.icon)}
            </span>
          )}
          {tab.label}
          {showBadges && tab.badge !== undefined && (
            <span className={`${currentSize.badge} rounded-full ${tab.badgeColor || 'bg-white/20'} px-1.5`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}

      {/* Optional Propane tab */}
      {showPropane && (
        <button
          onClick={handlePropaneClick}
          className={`
            ${currentSize.tab}
            ${currentVariant.tab}
            ${activeTab === propaneId ? propaneColor : currentVariant.inactive}
            flex items-center gap-1.5 whitespace-nowrap
          `}
          style={{ borderRadius: '20px' }}
        >
          <span className={currentSize.icon}>{propaneIcon}</span>
          {propaneLabel}
        </button>
      )}
    </div>
  );
};

export default TabSelector;