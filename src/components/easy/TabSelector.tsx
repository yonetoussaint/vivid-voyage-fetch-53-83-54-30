// components/easy/TabSelector.jsx
import React from 'react';
import { Flame } from 'lucide-react';

const TabSelector = ({ 
  // Core props
  tabs = [],
  activeTab,
  onTabChange,
  
  // Size
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

  const currentSize = sizeClasses[size];

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
            font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5
            ${activeTab === tab.id 
              ? tab.activeColor || 'bg-slate-900 text-white border-slate-900'
              : tab.inactiveColor || 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
            }
            ${tab.className || ''}
          `}
          style={{ borderRadius: '20px', ...tab.style }}
        >
          {tab.icon && (
            <span className={currentSize.icon}>{tab.icon}</span>
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
            font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5
            ${activeTab === propaneId 
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
            }
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