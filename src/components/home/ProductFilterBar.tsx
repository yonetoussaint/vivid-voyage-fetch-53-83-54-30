import React, { useState, useRef } from 'react';
import { ChevronDown, Star, CheckCircle, Image, Calendar, Filter } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
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
        
        // Smooth scroll to the filter element, aligning to the left
        container.scrollTo({
          left: filterLeft,
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
    
    // Find the closest filter element to snap to
    const filterElements = container.querySelectorAll('[data-filter-id]');
    let closestElement: HTMLElement | null = null;
    let closestDistance = Infinity;

    filterElements.forEach((element) => {
      const el = element as HTMLElement;
      const elementLeft = el.offsetLeft;
      const elementWidth = el.offsetWidth;
      const elementCenter = elementLeft + elementWidth / 2;
      const distance = Math.abs(scrollLeft - elementLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = el;
      }
    });

    // Snap to the closest element when scrolling stops
    if (closestElement && closestDistance < containerWidth / 4) {
      setTimeout(() => {
        if (container.scrollLeft === scrollLeft) { // Only snap if scrolling has stopped
          container.scrollTo({
            left: closestElement!.offsetLeft,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <div className="product-filter-bar w-full bg-white relative">
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
                <div className="relative flex-1 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle(filter.id)}
                    disabled={isFilterDisabled && isFilterDisabled(filter.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-0 bg-transparent w-full snap-start ${
                      isFilterDisabled && isFilterDisabled(filter.id)
                        ? 'text-gray-400 cursor-not-allowed'
                        : selectedFilters[filter.id] && !isAllOption(selectedFilters[filter.id])
                        ? 'text-orange-600 hover:text-orange-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {getFilterIcon(filter.id)}
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
};

export default ProductFilterBar;