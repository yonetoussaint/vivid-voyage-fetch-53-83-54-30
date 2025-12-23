import React, { useState } from "react";
import { ChevronDown, X, ArrowUp, ArrowDown } from "lucide-react";

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

  const handleMultiSelect = (tabId: string, optionValue: any, currentValues: any[]) => {
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];

    onTabChange(tabId, newValues);
  };

  // Special handler for price sort toggle
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

    if (tab.type === 'multi-select' && Array.isArray(tab.value) && tab.value.length > 0) {
      return `${tab.label} (${tab.value.length})`;
    }

    if (tab.value && typeof tab.value === 'object' && 'label' in tab.value) {
      return `${tab.label}: ${tab.value.label}`;
    }

    if (tab.value && tab.value !== '' && !Array.isArray(tab.value)) {
      return `${tab.label}: ${tab.value}`;
    }

    return tab.label;
  };

  const isTabActive = (tab: FilterTab) => {
    if (tab.id === 'priceSort') {
      return tab.value !== null; // Price sort is active when direction is set
    }

    if (tab.type === 'checkbox' || tab.type === 'toggle') {
      return Boolean(tab.value);
    }

    if (tab.type === 'multi-select') {
      return Array.isArray(tab.value) && tab.value.length > 0;
    }

    return tab.value && tab.value !== '' && tab.value !== null;
  };

  // Render price sort icon based on direction
  const renderPriceSortIcon = (value: 'asc' | 'desc' | null) => {
    if (value === 'asc') {
      return (
        <div className="flex items-center gap-0.5">
          <ArrowUp className="w-3 h-3" />
          <ArrowDown className="w-3 h-3 opacity-50" />
        </div>
      );
    } else if (value === 'desc') {
      return (
        <div className="flex items-center gap-0.5">
          <ArrowDown className="w-3 h-3" />
          <ArrowUp className="w-3 h-3 opacity-50" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-0.5">
          <ArrowUp className="w-3 h-3 opacity-50" />
          <ArrowDown className="w-3 h-3 opacity-50" />
        </div>
      );
    }
  };

  const renderDropdownContent = (tab: FilterTab) => {
    if (!tab.options) return null;

    if (tab.type === 'multi-select') {
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="p-2 space-y-1">
            {tab.options.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                <input 
                  type="checkbox" 
                  checked={tab.value?.includes(option.value) || false}
                  onChange={() => handleMultiSelect(tab.id, option.value, tab.value || [])}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-xs text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

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
                    {getTabLabel(tab)}
                    <ChevronDown className={`w-3 h-3 transition-transform ${
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
                    {getTabLabel(tab)}
                  </button>
                )}

                {tab.type === 'toggle' && tab.id === 'priceSort' && (
                  <button
                    onClick={() => handlePriceSortToggle(tab.id, tab.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isTabActive(tab)
                        ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {renderPriceSortIcon(tab.value)}
                    {getTabLabel(tab)}
                  </button>
                )}

                {tab.type === 'toggle' && tab.id !== 'priceSort' && (
                  <button
                    onClick={() => handleCheckboxToggle(tab.id, tab.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isTabActive(tab)
                        ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    {getTabLabel(tab)}
                  </button>
                )}

                {tab.type === 'multi-select' && (
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
                    {getTabLabel(tab)}
                    {isTabActive(tab) && (
                      <span className="ml-1 text-[9px] bg-blue-600 text-white rounded-full w-3 h-3 flex items-center justify-center">
                        {Array.isArray(tab.value) ? tab.value.length : 0}
                      </span>
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform ${
                      activeDropdown === tab.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Clear All Button */}
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

      {/* Active Filters Display */}
      {activeFilters.length > 0 && !activeDropdown && (
        <div className="px-3 py-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span 
                key={filter.id} 
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
              >
                {filter.label}: {filter.displayValue}
                <button 
                  onClick={() => onRemoveFilter(filter.id)}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTabs;