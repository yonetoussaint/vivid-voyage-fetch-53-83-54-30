import { useState, useEffect, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface ElectronicsFilters {
  sortBy: string;
  freeShipping: boolean;
  brand: string | null;
  priceRange: { min: number; max: number } | null;
}

export const useElectronicsFilters = () => {
  const [filters, setFilters] = useState<ElectronicsFilters>({
    sortBy: 'popular',
    freeShipping: false,
    brand: null,
    priceRange: null,
  });

  const handleTabChange = (tabId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [tabId]: value,
    }));
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      switch (filterId) {
        case 'freeShipping':
          newFilters.freeShipping = false;
          break;
        case 'brand':
          newFilters.brand = null;
          break;
        case 'priceRange':
          newFilters.priceRange = null;
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
      freeShipping: false,
      brand: null,
      priceRange: null,
    });
  };

  const electronicsTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under $50', value: { min: 0, max: 50 } },
          { label: '$50 - $200', value: { min: 50, max: 200 } },
          { label: '$200 - $500', value: { min: 200, max: 500 } },
          { label: '$500 - $1000', value: { min: 500, max: 1000 } },
          { label: 'Over $1000', value: { min: 1000, max: 10000 } },
        ],
      },
      {
        id: 'freeShipping',
        label: 'Free Shipping',
        type: 'checkbox' as const,
        value: filters.freeShipping,
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
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

    // Add price range filter if active
    if (filters.priceRange) {
      filtersArray.push({
        id: 'priceRange',
        label: 'Price',
        value: filters.priceRange,
        displayValue: `$${filters.priceRange.min} - $${filters.priceRange.max}`,
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
      id: "all",
      name: "All",
      imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "smartphones",
      name: "Phones",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      id: "laptops",
      name: "Laptops",
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600"
    },
    {
      id: "headphones",
      name: "Audio",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      id: "smartwatches",
      name: "Watches",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      id: "cameras",
      name: "Cameras",
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      id: "gaming",
      name: "Gaming",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      id: "accessories",
      name: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      id: "tablets",
      name: "Tablets",
      imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      id: "home-appliances",
      name: "Home Tech",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'smartphones':
        filters.category = 'smartphones';
        filters.brand = ['Apple', 'Samsung', 'Google'];
        break;
      case 'laptops':
        filters.category = 'laptops';
        filters.brand = ['Apple', 'Dell', 'HP', 'Lenovo'];
        break;
      case 'headphones':
        filters.category = 'audio';
        filters.brand = ['Sony', 'Bose', 'Sennheiser'];
        break;
      case 'smartwatches':
        filters.category = 'wearables';
        filters.brand = ['Apple', 'Samsung', 'Fitbit'];
        break;
      case 'cameras':
        filters.category = 'cameras';
        filters.brand = ['Canon', 'Nikon', 'Sony'];
        break;
      case 'gaming':
        filters.category = 'gaming';
        filters.brand = ['PlayStation', 'Xbox', 'Nintendo'];
        break;
      case 'tablets':
        filters.category = 'tablets';
        filters.brand = ['Apple', 'Samsung', 'Microsoft'];
        break;
      case 'home-appliances':
        filters.category = 'home-electronics';
        filters.brand = ['LG', 'Samsung', 'Bosch'];
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
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