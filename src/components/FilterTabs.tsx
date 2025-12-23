import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface FilterTab {
  id: string;
  label: string;
  type: 'dropdown' | 'checkbox' | 'toggle' | 'multi-select';
  value: any;
  options?: Array<{
    label: string;
    value: any;
  }>;
  icon?: React.ReactNode;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: any;
  displayValue: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeFilters: ActiveFilter[];
  onTabChange: (tabId: string, value: any) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeFilters,
  onTabChange,
  onRemoveFilter,
  onClearAll,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (tabId: string) => {
    setActiveDropdown(activeDropdown === tabId ? null : tabId);
  };

  const handleDropdownSelect = (tabId: string, value: any) => {
    onTabChange(tabId, value);
    setActiveDropdown(null);
  };

  const handleCheckboxToggle = (tabId: string, currentValue: boolean) => {
    onTabChange(tabId, !currentValue);
  };

  const handlePriceSortToggle = (tabId: string, currentValue: 'asc' | 'desc' | null) => {
    onTabChange(tabId, null); // The value will be handled in the hook
  };

  const getTabLabel = (tab: FilterTab) => {
    if (tab.type === 'toggle' && tab.id === 'priceSort') {
      // Special handling for price sort toggle
      if (tab.value === 'asc') return 'Price: Low to High';
      if (tab.value === 'desc') return 'Price: High to Low';
      return tab.label;
    }

    if (tab.type === 'checkbox' || tab.type === 'toggle') {
      return tab.label;
    }

    if (tab.value && tab.value !== '' && !Array.isArray(tab.value)) {
      const option = tab.options?.find(o => o.value === tab.value);
      return option ? `${tab.label}: ${option.label}` : tab.label;
    }

    return tab.label;
  };

  const isTabActive = (tab: FilterTab) => {
    if (tab.id === 'priceSort') {
      return tab.value !== null;
    }

    if (tab.type === 'checkbox' || tab.type === 'toggle') {
      return Boolean(tab.value);
    }

    return tab.value && tab.value !== '' && tab.value !== null;
  };

  // Render price sort icon using carets (^)
  const renderPriceSortIcon = (value: 'asc' | 'desc' | null) => {
    // Using inline SVGs for carets
    const CaretUp = () => (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15L12 9L6 15" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

    const CaretDown = () => (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

    if (value === 'asc') {
      return (
        <div className="flex flex-col items-center justify-center gap-[1px]">
          <div className="text-blue-600">
            <CaretUp />
          </div>
          <div className="opacity-30">
            <CaretDown />
          </div>
        </div>
      );
    } else if (value === 'desc') {
      return (
        <div className="flex flex-col items-center justify-center gap-[1px]">
          <div className="opacity-30">
            <CaretUp />
          </div>
          <div className="text-blue-600">
            <CaretDown />
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-[1px]">
          <div className="opacity-30">
            <CaretUp />
          </div>
          <div className="opacity-30">
            <CaretDown />
          </div>
        </div>
      );
    }
  };

  const renderDropdownContent = (tab: FilterTab) => {
    if (!tab.options) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="py-1">
          {tab.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDropdownSelect(tab.id, option.value)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                tab.value === option.value ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Filter Tabs Row */}
      <div>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 px-2 min-w-max py-1">
            {tabs.map((tab) => (
              <React.Fragment key={tab.id}>
                {tab.type === 'dropdown' && (
                  <button
                    onClick={() => toggleDropdown(tab.id)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isTabActive(tab)
                        ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                        : activeDropdown === tab.id
                        ? 'bg-white border border-gray-200 shadow-sm text-gray-900'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate max-w-[80px]">{getTabLabel(tab)}</span>
                    <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${
                      activeDropdown === tab.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                )}

                {tab.type === 'checkbox' && (
                  <button
                    onClick={() => handleCheckboxToggle(tab.id, tab.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isTabActive(tab)
                        ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{getTabLabel(tab)}</span>
                  </button>
                )}

                {tab.type === 'toggle' && tab.id === 'priceSort' && (
                  <button
                    onClick={() => handlePriceSortToggle(tab.id, tab.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isTabActive(tab)
                        ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm hover:bg-blue-50'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {renderPriceSortIcon(tab.value)}
                    <span className="truncate max-w-[80px]">{getTabLabel(tab)}</span>
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Clear All Button - Only show if we have active filters */}
            {activeFilters.length > 0 && (
              <button 
                onClick={onClearAll} 
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap hover:bg-blue-50 rounded-md transition-all"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Panels */}
      {activeDropdown && (
        <div className="px-3 pb-3 pt-1">
          {tabs.map((tab) => (
            tab.id === activeDropdown && renderDropdownContent(tab)
          ))}
        </div>
      )}

      {/* Removed Active Filters Display section */}
    </div>
  );
};

export default FilterTabs;