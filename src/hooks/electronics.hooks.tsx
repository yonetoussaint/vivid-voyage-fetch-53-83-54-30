import { useState, useEffect, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";
import { ArrowUpDown, Truck, Tag } from "lucide-react"; // Added Truck and Tag icons

export interface ElectronicsFilters {
  sortBy: string;
  priceSortDirection: 'asc' | 'desc' | null;
  freeShipping: boolean;
  brand: string | null;
  // Removed all other filters
}

export const useElectronicsFilters = () => {
  const [filters, setFilters] = useState<ElectronicsFilters>({
    sortBy: 'popular',
    priceSortDirection: null,
    freeShipping: false,
    brand: null,
  });

  const handleTabChange = (tabId: string, value: any) => {
    // Special handling for price sort toggle
    if (tabId === 'priceSort') {
      setFilters(prev => {
        let newSortBy: string;
        let newPriceSortDirection: 'asc' | 'desc' | null;
        
        if (prev.priceSortDirection === 'asc') {
          // Switch from asc to desc
          newSortBy = 'price_high';
          newPriceSortDirection = 'desc';
        } else if (prev.priceSortDirection === 'desc') {
          // Switch from desc back to no price sorting
          newSortBy = 'popular';
          newPriceSortDirection = null;
        } else {
          // Start price sorting with asc
          newSortBy = 'price_low';
          newPriceSortDirection = 'asc';
        }
        
        return {
          ...prev,
          sortBy: newSortBy,
          priceSortDirection: newPriceSortDirection,
        };
      });
      return;
    }
    
    // For other tabs
    setFilters(prev => ({
      ...prev,
      [tabId]: value,
    }));
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      switch (filterId) {
        case 'priceSort':
          newFilters.priceSortDirection = null;
          // If current sort is a price sort, reset to popular
          if (newFilters.sortBy === 'price_low' || newFilters.sortBy === 'price_high') {
            newFilters.sortBy = 'popular';
          }
          break;
        case 'freeShipping':
          newFilters.freeShipping = false;
          break;
        case 'brand':
          newFilters.brand = null;
          break;
        default:
          // Handle any other cases
          break;
      }

      return newFilters;
    });
  };

  const handleClearAll = () => {
    setFilters({
      sortBy: 'popular',
      priceSortDirection: null,
      freeShipping: false,
      brand: null,
    });
  };

  const electronicsTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceSort',
        label: 'Price',
        type: 'toggle' as const,
        value: filters.priceSortDirection,
        icon: <ArrowUpDown className="w-3 h-3" />,
      },
      {
        id: 'freeShipping',
        label: 'Free Shipping',
        type: 'checkbox' as const,
        value: filters.freeShipping,
        icon: <Truck className="w-3 h-3" />,
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
        icon: <Tag className="w-3 h-3" />,
        options: [
          { label: 'All Brands', value: null },
          { label: 'Apple', value: 'apple' },
          { label: 'Samsung', value: 'samsung' },
          { label: 'Sony', value: 'sony' },
          { label: 'LG', value: 'lg' },
          { label: 'Microsoft', value: 'microsoft' },
          { label: 'Dell', value: 'dell' },
          { label: 'HP', value: 'hp' },
          { label: 'Lenovo', value: 'lenovo' },
          { label: 'Asus', value: 'asus' },
          { label: 'Acer', value: 'acer' },
          { label: 'Google', value: 'google' },
          { label: 'OnePlus', value: 'oneplus' },
          { label: 'Xiaomi', value: 'xiaomi' },
        ],
      },
    ];
  }, [filters]);

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filtersArray: ActiveFilter[] = [];

    // Add price sort filter if active
    if (filters.priceSortDirection) {
      const displayValue = filters.priceSortDirection === 'asc' ? 'Price: Low to High' : 'Price: High to Low';
      filtersArray.push({
        id: 'priceSort',
        label: 'Price Sort',
        value: filters.priceSortDirection,
        displayValue: displayValue,
      });
    }

    // Add free shipping filter if active
    if (filters.freeShipping) {
      filtersArray.push({
        id: 'freeShipping',
        label: 'Shipping',
        value: true,
        displayValue: 'Free',
      });
    }

    // Add brand filter if active
    if (filters.brand) {
      const brandOption = electronicsTabs.find(t => t.id === 'brand')?.options?.find(o => o.value === filters.brand);
      filtersArray.push({
        id: 'brand',
        label: 'Brand',
        value: filters.brand,
        displayValue: brandOption?.label || filters.brand,
      });
    }

    return filtersArray;
  }, [filters, electronicsTabs]);

  return {
    filters,
    setFilters,
    electronicsTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useElectronicsData = () => {
  const electronicsChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'smartphones',
      name: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'laptops',
      name: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-700/20 to-gray-800/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'headphones',
      name: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'tvs',
      name: 'TVs',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'smartwatches',
      name: 'Smart Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const subcategoryFilters: Partial<ElectronicsFilters> = {};
    // Since we removed most filters, just return empty object
    return subcategoryFilters;
  };

  return {
    electronicsChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions
export const getPriceRangeDisplay = (priceRange: { min: number; max: number } | null): string => {
  if (!priceRange) return 'Any Price';
  return `$${priceRange.min} - $${priceRange.max}`;
};

export const isPriceRangeValid = (priceRange: any): boolean => {
  return priceRange && 
         typeof priceRange === 'object' && 
         'min' in priceRange && 
         'max' in priceRange &&
         typeof priceRange.min === 'number' &&
         typeof priceRange.max === 'number';
};