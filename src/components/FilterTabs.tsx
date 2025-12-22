import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PriceFilter {
  min?: number;
  max?: number;
}

interface FilterState {
  price: PriceFilter;
  rating: number | null;
  freeShipping: boolean;
  onSale: boolean;
  freeReturns: boolean;
  newArrivals: boolean;
  shippedFrom: string[];
  sortBy: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating';
}

interface FilterTabsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (filter: string) => {
    setActiveDropdown(activeDropdown === filter ? null : filter);
  };

  const handlePriceFilter = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      price: { min, max }
    });
    setActiveDropdown(null);
  };

  const handleRatingFilter = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? null : rating
    });
    setActiveDropdown(null);
  };

  const handleShippingFilter = (location: string) => {
    const updatedLocations = filters.shippedFrom.includes(location)
      ? filters.shippedFrom.filter(l => l !== location)
      : [...filters.shippedFrom, location];
    
    onFilterChange({
      ...filters,
      shippedFrom: updatedLocations
    });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy
    });
    setActiveDropdown(null);
  };

  const toggleCheckboxFilter = (filterKey: keyof FilterState) => {
    onFilterChange({
      ...filters,
      [filterKey]: !filters[filterKey]
    });
  };

  const getPriceLabel = () => {
    if (filters.price.min !== undefined && filters.price.max !== undefined) {
      return `$${filters.price.min} - $${filters.price.max}`;
    }
    if (filters.price.min !== undefined) {
      return `Above $${filters.price.min}`;
    }
    if (filters.price.max !== undefined) {
      return `Under $${filters.price.max}`;
    }
    return "Price";
  };

  const getRatingLabel = () => {
    if (filters.rating) {
      return `${'★'.repeat(filters.rating)} & Up`;
    }
    return "Rating";
  };

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'newest': return 'Newest';
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      case 'rating': return 'Top Rated';
      default: return 'Popular';
    }
  };

  const hasActiveFilters = () => {
    return (
      (filters.price.min !== undefined || filters.price.max !== undefined) ||
      filters.rating !== null ||
      filters.freeShipping ||
      filters.onSale ||
      filters.freeReturns ||
      filters.newArrivals ||
      filters.shippedFrom.length > 0
    );
  };

  const clearAllFilters = () => {
    onFilterChange({
      price: {},
      rating: null,
      freeShipping: false,
      onSale: false,
      freeReturns: false,
      newArrivals: false,
      shippedFrom: [],
      sortBy: 'popular'
    });
    setActiveDropdown(null);
  };

  const renderActiveFilters = () => {
    if (activeDropdown) return null;

    const activeFilters = [];
    
    if (filters.price.min !== undefined && filters.price.max !== undefined) {
      activeFilters.push(
        <span key="price" className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
          Price: ${filters.price.min} - ${filters.price.max}
          <button 
            onClick={() => onFilterChange({...filters, price: {}})}
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            ×
          </button>
        </span>
      );
    }
    
    if (filters.rating !== null) {
      activeFilters.push(
        <span key="rating" className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
          Rating: {filters.rating}+ Stars
          <button 
            onClick={() => onFilterChange({...filters, rating: null})}
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            ×
          </button>
        </span>
      );
    }
    
    filters.shippedFrom.forEach(location => {
      activeFilters.push(
        <span key={`shipped-${location}`} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
          From: {location}
          <button 
            onClick={() => handleShippingFilter(location)}
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            ×
          </button>
        </span>
      );
    });
    
    if (activeFilters.length === 0) return null;
    
    return (
      <div className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          {activeFilters}
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
      
      <div>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 px-2 min-w-max py-1">
            {/* Sort */}
            <button
              onClick={() => toggleDropdown('sort')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeDropdown === 'sort' 
                  ? 'bg-white border border-gray-200 shadow-sm text-gray-900' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {getSortLabel()}
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>

            {/* Price */}
            <button
              onClick={() => toggleDropdown('price')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.price.min || filters.price.max
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : activeDropdown === 'price' 
                    ? 'bg-white border border-gray-200 shadow-sm text-gray-900'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {getPriceLabel()}
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {/* Rating */}
            <button
              onClick={() => toggleDropdown('rating')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.rating 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : activeDropdown === 'rating' 
                    ? 'bg-white border border-gray-200 shadow-sm text-gray-900'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {getRatingLabel()}
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'rating' ? 'rotate-180' : ''}`} />
            </button>

            {/* Free Shipping */}
            <button
              onClick={() => toggleCheckboxFilter('freeShipping')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.freeShipping 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Free Shipping
            </button>

            {/* On Sale */}
            <button
              onClick={() => toggleCheckboxFilter('onSale')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.onSale 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              On Sale
            </button>

            {/* Free Returns */}
            <button
              onClick={() => toggleCheckboxFilter('freeReturns')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.freeReturns 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Free Returns
            </button>

            {/* New Arrivals */}
            <button
              onClick={() => toggleCheckboxFilter('newArrivals')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.newArrivals 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              New Arrivals
            </button>

            {/* Shipped From */}
            <button
              onClick={() => toggleDropdown('shipped')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                filters.shippedFrom.length > 0 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm'
                  : activeDropdown === 'shipped' 
                    ? 'bg-white border border-gray-200 shadow-sm text-gray-900'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Shipped From
              {filters.shippedFrom.length > 0 && (
                <span className="ml-1 text-[9px] bg-blue-600 text-white rounded-full w-3 h-3 flex items-center justify-center">
                  {filters.shippedFrom.length}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'shipped' ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear All */}
            {hasActiveFilters() && (
              <button 
                onClick={clearAllFilters} 
                className="px-2 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap hover:bg-blue-50 rounded-md transition-all"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown panels */}
      {activeDropdown && (
        <div className="px-3 pb-3 pt-1">
          {activeDropdown === 'sort' && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="py-1">
                {['popular', 'newest', 'price_low', 'price_high', 'rating'].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort as FilterState['sortBy'])}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      filters.sortBy === sort ? 'text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {sort === 'popular' && 'Popular'}
                    {sort === 'newest' && 'Newest'}
                    {sort === 'price_low' && 'Price: Low to High'}
                    {sort === 'price_high' && 'Price: High to Low'}
                    {sort === 'rating' && 'Top Rated'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeDropdown === 'price' && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="py-1">
                <button 
                  onClick={() => handlePriceFilter(undefined, 25)} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    filters.price.max === 25 && filters.price.min === undefined ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Under $25
                </button>
                <button 
                  onClick={() => handlePriceFilter(25, 50)} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    filters.price.min === 25 && filters.price.max === 50 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  $25 - $50
                </button>
                <button 
                  onClick={() => handlePriceFilter(50, 100)} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    filters.price.min === 50 && filters.price.max === 100 ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  $50 - $100
                </button>
                <button 
                  onClick={() => handlePriceFilter(100, undefined)} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    filters.price.min === 100 && filters.price.max === undefined ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Over $100
                </button>
              </div>
            </div>
          )}

          {activeDropdown === 'rating' && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="py-1">
                {[5, 4, 3, 2].map((rating) => (
                  <button 
                    key={rating} 
                    onClick={() => handleRatingFilter(rating)} 
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      filters.rating === rating ? 'text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {'★'.repeat(rating)} & Up
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeDropdown === 'shipped' && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="p-2 space-y-1">
                {['United States', 'International', 'Local Pickup'].map((location) => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                    <input 
                      type="checkbox" 
                      checked={filters.shippedFrom.includes(location)}
                      onChange={() => handleShippingFilter(location)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-xs text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters display */}
      {renderActiveFilters()}
    </div>
  );
};

export default FilterTabs;

export type { FilterState, PriceFilter };