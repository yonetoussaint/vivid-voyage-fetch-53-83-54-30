import React, { useState, useRef } from 'react';
import { ChevronDown, Star, CheckCircle, Image, Calendar, Filter, X, Tag, Truck, DollarSign, Package } from 'lucide-react';

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
  variant?: 'default' | 'cards'; // New variant prop
  className?: string;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled,
  variant = 'default', // Default to original design
  className = ''
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  };

  // Check if a filter has an active selection (not "All" option)
  const hasActiveFilter = (filterId: string) => {
    return selectedFilters[filterId] && !isAllOption(selectedFilters[filterId]);
  };

  // Handle clear filter
  const handleClearFilter = (filterId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from opening
    onFilterClear(filterId);
  };

  // Get icon for each filter category
  const getFilterIcon = (filterId: string) => {
    switch (filterId) {
      case 'rating':
        return <Star className="w-4 h-4" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'media':
        return <Image className="w-4 h-4" />;
      case 'time':
        return <Calendar className="w-4 h-4" />;
      case 'sort':
        return <Filter className="w-4 h-4" />;
      case 'category':
        return <Tag className="w-4 h-4" />;
      case 'price':
        return <DollarSign className="w-4 h-4" />;
      case 'shipping':
        return <Truck className="w-4 h-4" />;
      case 'availability':
        return <Package className="w-4 h-4" />;
      case 'discount':
        return <Tag className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleDropdownToggle = (filterId: string) => {
    if (isFilterDisabled && isFilterDisabled(filterId)) return;

    // Scroll to the clicked filter to ensure it's visible
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const filterElement = container.querySelector(`[data-filter-id="${filterId}"]`) as HTMLElement;

      if (filterElement) {
        const containerRect = container.getBoundingClientRect();
        const filterRect = filterElement.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        const filterLeft = filterRect.left - containerRect.left + scrollLeft;

        // Calculate maximum scroll position
        const maxScroll = container.scrollWidth - container.clientWidth;
        const targetScroll = Math.min(filterLeft, maxScroll);

        // Smooth scroll to the filter element, aligning to the left
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    }

    if (openDropdown === filterId) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(filterId);
    }
  };

  const handleOptionSelect = (filterId: string, option: string) => {
    onFilterSelect(filterId, option);
    setOpenDropdown(null);
  };

  // Handle scroll events for snapping
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    const maxScroll = scrollWidth - containerWidth;

    // Check if we're at the end of scroll
    if (scrollLeft >= maxScroll - 1) {
      // At the end, no need to snap
      return;
    }

    // Find the closest filter element to snap to
    const filterElements = container.querySelectorAll('[data-filter-id]');
    let closestElement: HTMLElement | null = null;
    let closestDistance = Infinity;

    filterElements.forEach((element) => {
      const el = element as HTMLElement;
      const elementLeft = el.offsetLeft;
      const distance = Math.abs(scrollLeft - elementLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = el;
      }
    });

    // Snap to the closest element when scrolling stops
    if (closestElement && closestDistance < containerWidth / 3) {
      setTimeout(() => {
        if (container.scrollLeft === scrollLeft) { // Only snap if scrolling has stopped
          const targetScroll = Math.min(closestElement!.offsetLeft, maxScroll);
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  };

  // ========== RENDER CARDS VARIANT ==========
  const renderCardsVariant = () => (
    <div className={`product-filter-bar w-full bg-white relative ${className}`}>
      {/* Cards container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-2 py-1"
        onScroll={handleScroll}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex gap-2 min-w-max py-1">
          {filterCategories.map((filter, index) => (
            <div 
              key={filter.id} 
              className="relative flex"
              data-filter-id={filter.id}
            >
              {/* Filter button as card */}
              <button
                type="button"
                onClick={() => handleDropdownToggle(filter.id)}
                disabled={isFilterDisabled && isFilterDisabled(filter.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all whitespace-nowrap rounded-lg border shadow-sm snap-start ${
                  isFilterDisabled && isFilterDisabled(filter.id)
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50 border-gray-200'
                    : hasActiveFilter(filter.id)
                    ? 'text-orange-700 bg-orange-50 border-orange-200 shadow-orange-100 hover:shadow-orange-200'
                    : 'text-gray-700 bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {getFilterIcon(filter.id)}
                <span className="truncate max-w-[100px]">
                  {selectedFilters[filter.id] || filter.label}
                </span>

                {/* X icon for clearing active filter */}
                {hasActiveFilter(filter.id) && (
                  <X
                    size={14}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors ml-1"
                    onClick={(e) => handleClearFilter(filter.id, e)}
                  />
                )}

                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 flex-shrink-0 ${
                    openDropdown === filter.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Options grid below cards */}
      {openDropdown && (
        <div className="bg-white border-t border-gray-100 p-4 mt-1 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {filterCategories
              .find(f => f.id === openDropdown)
              ?.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(openDropdown, option)}
                  className={`px-4 py-2.5 text-sm text-left rounded-lg transition-all border ${
                    selectedFilters[openDropdown] === option
                      ? 'bg-orange-50 text-orange-700 font-medium border-orange-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  // ========== RENDER DEFAULT VARIANT ==========
  const renderDefaultVariant = () => (
    <div className={`product-filter-bar w-full bg-white relative ${className}`}>
      {/* Main filter bar */}
      <div className="border-b border-gray-200">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          onScroll={handleScroll}
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex justify-start min-w-max">
            {filterCategories.map((filter, index) => (
              <div 
                key={filter.id} 
                className="relative flex flex-1 snap-start"
                data-filter-id={filter.id}
              >
                {/* Vertical separator */}
                {index > 0 && (
                  <div className="w-px bg-gray-200 h-full" />
                )}

                {/* Filter button */}
                <div className="relative flex-1 min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle(filter.id)}
                    disabled={isFilterDisabled && isFilterDisabled(filter.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-0 w-full snap-start ${
                      isFilterDisabled && isFilterDisabled(filter.id)
                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                        : hasActiveFilter(filter.id)
                        ? 'text-gray-700 bg-orange-50 hover:bg-orange-100 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 bg-transparent'
                    }`}
                  >
                    {getFilterIcon(filter.id)}
                    <span className="truncate">
                      {selectedFilters[filter.id] || filter.label}
                    </span>

                    {/* X icon for clearing active filter */}
                    {hasActiveFilter(filter.id) && (
                      <X
                        size={14}
                        className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={(e) => handleClearFilter(filter.id, e)}
                      />
                    )}

                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        openDropdown === filter.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options grid below tabs */}
      {openDropdown && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-2">
            {filterCategories
              .find(f => f.id === openDropdown)
              ?.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(openDropdown, option)}
                  className={`px-4 py-2 text-sm text-left rounded-md transition-colors ${
                    selectedFilters[openDropdown] === option
                      ? 'bg-orange-50 text-orange-700 font-medium border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  // Return the appropriate variant
  return variant === 'cards' ? renderCardsVariant() : renderDefaultVariant();
};

export default ProductFilterBar;