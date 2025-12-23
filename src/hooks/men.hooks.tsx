import { useState, useEffect, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface MenFilters {
  sortBy: string;
  freeShipping: boolean;
  brand: string | null;
  priceRange: { min: number; max: number } | null;
}

export const useMenFilters = () => {
  const [filters, setFilters] = useState<MenFilters>({
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

  const menTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under $20', value: { min: 0, max: 20 } },
          { label: '$20 - $50', value: { min: 20, max: 50 } },
          { label: '$50 - $100', value: { min: 50, max: 100 } },
          { label: '$100 - $200', value: { min: 100, max: 200 } },
          { label: 'Over $200', value: { min: 200, max: 10000 } },
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
          { label: 'Nike', value: 'nike' },
          { label: 'Adidas', value: 'adidas' },
          { label: 'Levi\'s', value: 'levis' },
          { label: 'Calvin Klein', value: 'calvin-klein' },
          { label: 'Tommy Hilfiger', value: 'tommy-hilfiger' },
          { label: 'Ralph Lauren', value: 'ralph-lauren' },
          { label: 'Zara', value: 'zara' },
          { label: 'H&M', value: 'h-m' },
          { label: 'Uniqlo', value: 'uniqlo' },
          { label: 'Puma', value: 'puma' },
          { label: 'Under Armour', value: 'under-armour' },
          { label: 'Lacoste', value: 'lacoste' },
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
      const brandOption = menTabs.find(t => t.id === 'brand')?.options?.find(o => o.value === filters.brand);
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
  }, [filters, menTabs]);

  return {
    filters,
    setFilters,
    menTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

// ... rest of the file

export const useMenData = () => {
  const menChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 't-shirts',
      name: 'T-Shirts',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-gray-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'shirts',
      name: 'Shirts',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-white/20 to-gray-100/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'jeans',
      name: 'Jeans',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'jackets',
      name: 'Jackets',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-600/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
    {
      id: 'shoes',
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-black/20 to-gray-800/20',
      textColor: 'text-white',
      icon: <div className="w-6 h-6" />
    },
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const subcategoryFilters: Partial<MenFilters> = {};
    // Since we removed most filters, just return empty object
    return subcategoryFilters;
  };

  return {
    menChannels,
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