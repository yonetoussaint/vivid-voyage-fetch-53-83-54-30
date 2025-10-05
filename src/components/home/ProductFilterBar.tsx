
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProductFilterBarProps {
  filterCategories?: Array<{
    id: string;
    label: string;
    options: string[];
  }>;
  selectedFilters?: Record<string, string>;
  onFilterSelect?: (filterId: string, option: string) => void;
  onFilterClear?: (filterId: string) => void;
  onClearAll?: () => void;
  onFilterButtonClick?: (filterId: string) => void;
  isFilterDisabled?: (filterId: string) => boolean;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  // Auto-select first option for each filter on mount
  React.useEffect(() => {
    filterCategories.forEach((filter) => {
      if (!selectedFilters[filter.id] && filter.options.length > 0) {
        onFilterSelect(filter.id, filter.options[0]);
      }
    });
  }, []);

  const handleDropdownToggle = (filterId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isFilterDisabled && isFilterDisabled(filterId)) return;
    
    if (openDropdown === filterId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setOpenDropdown(filterId);
    }
  };

  const handleOptionSelect = (filterId: string, option: string) => {
    onFilterSelect(filterId, option);
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  const clearFilter = (filterId: string) => {
    onFilterClear(filterId);
  };

  const renderDropdown = (filter: { id: string; label: string; options: string[] }) => {
    if (openDropdown !== filter.id || !dropdownPosition) return null;

    return createPortal(
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            setOpenDropdown(null);
            setDropdownPosition(null);
          }}
        />
        {/* Dropdown */}
        <div
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: `${dropdownPosition.width}px`,
            width: '192px'
          }}
        >
          <div className="py-2">
            {filter.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(filter.id, option)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  selectedFilters[filter.id] === option
                    ? 'bg-orange-50 text-orange-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="product-filter-bar w-full bg-white relative">
      {/* Main filter bar */}
      <div className="border-b border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-start">
            {filterCategories.map((filter, index) => (
              <div key={filter.id} className="relative flex flex-1">
                {/* Vertical separator */}
                {index > 0 && (
                  <div className="w-px bg-gray-200 h-full" />
                )}

                {/* Filter button */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={(e) => handleDropdownToggle(filter.id, e)}
                    disabled={isFilterDisabled && isFilterDisabled(filter.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-0 bg-transparent w-full ${
                      isFilterDisabled && isFilterDisabled(filter.id)
                        ? 'text-gray-400 cursor-not-allowed'
                        : selectedFilters[filter.id]
                        ? 'text-orange-600 hover:text-orange-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">
                      {selectedFilters[filter.id] || filter.label}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        openDropdown === filter.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Render dropdown via portal */}
                  {renderDropdown(filter)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProductFilterBar;
