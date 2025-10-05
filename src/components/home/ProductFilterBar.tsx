import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
  filterCategories = [], // Default empty array
  selectedFilters = {}, // Default empty object
  onFilterSelect = () => {}, // Default empty function
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (filterId: string) => {
    if (isFilterDisabled && isFilterDisabled(filterId)) return;
    setOpenDropdown(prev => prev === filterId ? null : filterId);
  };

  const handleOptionSelect = (filterId: string, option: string) => {
    onFilterSelect(filterId, option);
    setOpenDropdown(null);
  };

  const clearFilter = (filterId: string) => {
    onFilterClear(filterId);
  };

  return (
    <div className="product-filter-bar w-full bg-white">
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
                    onClick={() => handleDropdownToggle(filter.id)}
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

                  {/* Dropdown menu */}
                  {openDropdown === filter.id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium">Active:</span>
            {Object.entries(selectedFilters).map(([filterId, value]) => (
              <span
                key={filterId}
                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full"
              >
                {value}
                <button
                  type="button"
                  onClick={() => clearFilter(filterId)}
                  className="hover:text-orange-900 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onClearAll}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilterBar;