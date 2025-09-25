import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ProductFilterBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const filterCategories = [
    {
      id: 'category',
      label: 'Category',
      options: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys']
    },
    {
      id: 'brand',
      label: 'Brand',
      options: ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Canon']
    },
    {
      id: 'price',
      label: 'Price Range',
      options: ['Under $25', '$25-$50', '$50-$100', '$100-$250', '$250+']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['4+ Stars', '3+ Stars', '2+ Stars', 'All Ratings']
    },
    {
      id: 'availability',
      label: 'Availability',
      options: ['In Stock', 'Out of Stock', 'Pre-order', 'All']
    },
    {
      id: 'color',
      label: 'Color',
      options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown']
    }
  ];

  const handleDropdownToggle = (filterId) => {
    setOpenDropdown(prev => prev === filterId ? null : filterId);
  };

  const handleOptionSelect = (filterId, option) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
    setOpenDropdown(null);
  };

  const clearFilter = (filterId) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[filterId];
    setSelectedFilters(newFilters);
  };

  return (
    <div className="product-filter-bar w-full bg-white"> {/* ← ADD THIS CLASS */}
      {/* Main filter bar */}
      <div className="border-b border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max relative">
            {filterCategories.map((filter, index) => (
              <div key={filter.id} className="relative flex">
                {/* Vertical separator */}
                {index > 0 && (
                  <div className="w-px bg-gray-200 h-full" />
                )}

                {/* Filter button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle(filter.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap border-0 bg-transparent"
                  >
                    <span>
                      {selectedFilters[filter.id] || filter.label}
                    </span>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${
                        openDropdown === filter.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {openDropdown === filter.id && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="py-2">
                        {filter.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleOptionSelect(filter.id, option)}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                              selectedFilters[filter.id] === option
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Selected filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium">Active:</span>
            {Object.entries(selectedFilters).map(([filterId, value]) => (
              <span
                key={filterId}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {value}
                <button
                  type="button"
                  onClick={() => clearFilter(filterId)}
                  className="hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setSelectedFilters({})}
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