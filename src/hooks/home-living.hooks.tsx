import { useState, useEffect, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface HomeLivingFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  brand: string | null;
  material: string | null;
  color: string | null;
  roomType: string | null;
  ecoFriendly: boolean;
  assemblyRequired: boolean;
}

export const useHomeLivingFilters = () => {
  const [filters, setFilters] = useState<HomeLivingFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    brand: null,
    material: null,
    color: null,
    roomType: null,
    ecoFriendly: false,
    assemblyRequired: false,
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
        case 'freeReturns':
          newFilters.freeReturns = false;
          break;
        case 'onSale':
          newFilters.onSale = false;
          break;
        case 'newArrivals':
          newFilters.newArrivals = false;
          break;
        case 'rating':
          newFilters.rating = null;
          break;
        case 'priceRange':
          newFilters.priceRange = null;
          break;
        case 'shippedFrom':
          newFilters.shippedFrom = null;
          break;
        case 'brand':
          newFilters.brand = null;
          break;
        case 'material':
          newFilters.material = null;
          break;
        case 'color':
          newFilters.color = null;
          break;
        case 'roomType':
          newFilters.roomType = null;
          break;
        case 'ecoFriendly':
          newFilters.ecoFriendly = false;
          break;
        case 'assemblyRequired':
          newFilters.assemblyRequired = false;
          break;
        default:
          break;
      }

      return newFilters;
    });
  };

  const handleClearAll = () => {
    setFilters({
      sortBy: 'popular',
      freeShipping: false,
      freeReturns: false,
      onSale: false,
      newArrivals: false,
      rating: null,
      priceRange: null,
      shippedFrom: null,
      brand: null,
      material: null,
      color: null,
      roomType: null,
      ecoFriendly: false,
      assemblyRequired: false,
    });
  };

  const homeLivingTabs: FilterTab[] = useMemo(() => {
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
        id: 'rating',
        label: 'Rating',
        type: 'dropdown' as const,
        value: filters.rating,
        options: [
          { label: 'Any Rating', value: null },
          { label: '4.5+ Stars', value: 4.5 },
          { label: '4.0+ Stars', value: 4.0 },
          { label: '3.5+ Stars', value: 3.5 },
          { label: '3.0+ Stars', value: 3.0 },
        ],
      },
      {
        id: 'freeShipping',
        label: 'Free Shipping',
        type: 'checkbox' as const,
        value: filters.freeShipping,
      },
      {
        id: 'freeReturns',
        label: 'Free Returns',
        type: 'checkbox' as const,
        value: filters.freeReturns,
      },
      {
        id: 'onSale',
        label: 'On Sale',
        type: 'checkbox' as const,
        value: filters.onSale,
      },
      {
        id: 'newArrivals',
        label: 'New Arrivals',
        type: 'checkbox' as const,
        value: filters.newArrivals,
      },
      {
        id: 'shippedFrom',
        label: 'Ships From',
        type: 'dropdown' as const,
        value: filters.shippedFrom,
        options: [
          { label: 'Any Location', value: null },
          { label: 'United States', value: 'us' },
          { label: 'China', value: 'china' },
          { label: 'Europe', value: 'europe' },
          { label: 'Japan', value: 'japan' },
          { label: 'Korea', value: 'korea' },
        ],
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
        options: [
          { label: 'All Brands', value: null },
          { label: 'IKEA', value: 'ikea' },
          { label: 'West Elm', value: 'west-elm' },
          { label: 'Crate & Barrel', value: 'crate-barrel' },
          { label: 'Wayfair', value: 'wayfair' },
          { label: 'Pottery Barn', value: 'pottery-barn' },
          { label: 'Target', value: 'target' },
          { label: 'Amazon Basics', value: 'amazon-basics' },
          { label: 'Bed Bath & Beyond', value: 'bed-bath-beyond' },
          { label: 'Williams Sonoma', value: 'williams-sonoma' },
          { label: 'Home Depot', value: 'home-depot' },
          { label: 'Lowe\'s', value: 'lowes' },
        ],
      },
      {
        id: 'material',
        label: 'Material',
        type: 'dropdown' as const,
        value: filters.material,
        options: [
          { label: 'Any Material', value: null },
          { label: 'Wood', value: 'wood' },
          { label: 'Metal', value: 'metal' },
          { label: 'Glass', value: 'glass' },
          { label: 'Fabric', value: 'fabric' },
          { label: 'Leather', value: 'leather' },
          { label: 'Plastic', value: 'plastic' },
          { label: 'Ceramic', value: 'ceramic' },
          { label: 'Stone', value: 'stone' },
          { label: 'Bamboo', value: 'bamboo' },
          { label: 'Rattan', value: 'rattan' },
        ],
      },
      {
        id: 'color',
        label: 'Color',
        type: 'dropdown' as const,
        value: filters.color,
        options: [
          { label: 'Any Color', value: null },
          { label: 'White', value: 'white' },
          { label: 'Black', value: 'black' },
          { label: 'Gray', value: 'gray' },
          { label: 'Brown', value: 'brown' },
          { label: 'Beige', value: 'beige' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Red', value: 'red' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Pink', value: 'pink' },
          { label: 'Multi-color', value: 'multicolor' },
        ],
      },
      {
        id: 'roomType',
        label: 'Room',
        type: 'dropdown' as const,
        value: filters.roomType,
        options: [
          { label: 'Any Room', value: null },
          { label: 'Living Room', value: 'living-room' },
          { label: 'Bedroom', value: 'bedroom' },
          { label: 'Kitchen', value: 'kitchen' },
          { label: 'Dining Room', value: 'dining-room' },
          { label: 'Bathroom', value: 'bathroom' },
          { label: 'Office', value: 'office' },
          { label: 'Outdoor', value: 'outdoor' },
          { label: 'Kids Room', value: 'kids-room' },
          { label: 'Entryway', value: 'entryway' },
        ],
      },
      {
        id: 'ecoFriendly',
        label: 'Eco-Friendly',
        type: 'checkbox' as const,
        value: filters.ecoFriendly,
      },
      {
        id: 'assemblyRequired',
        label: 'Assembly Required',
        type: 'checkbox' as const,
        value: filters.assemblyRequired,
      },
    ];
  }, [filters]);

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filtersArray: ActiveFilter[] = [];

    // Add checkbox filters if active
    const checkboxFilters = [
      { id: 'freeShipping', label: 'Shipping', displayValue: 'Free', value: filters.freeShipping },
      { id: 'freeReturns', label: 'Returns', displayValue: 'Free', value: filters.freeReturns },
      { id: 'onSale', label: 'Sale', displayValue: 'On Sale', value: filters.onSale },
      { id: 'newArrivals', label: 'New', displayValue: 'New Arrivals', value: filters.newArrivals },
      { id: 'ecoFriendly', label: 'Eco', displayValue: 'Eco-Friendly', value: filters.ecoFriendly },
      { id: 'assemblyRequired', label: 'Assembly', displayValue: 'Required', value: filters.assemblyRequired },
    ];

    checkboxFilters.forEach(filter => {
      if (filter.value) {
        filtersArray.push({
          id: filter.id,
          label: filter.label,
          value: filter.value,
          displayValue: filter.displayValue,
        });
      }
    });

    // Add dropdown filters if active
    const dropdownFilters = [
      { id: 'rating', label: 'Rating', value: filters.rating },
      { id: 'priceRange', label: 'Price', value: filters.priceRange },
      { id: 'shippedFrom', label: 'Ships From', value: filters.shippedFrom },
      { id: 'brand', label: 'Brand', value: filters.brand },
      { id: 'material', label: 'Material', value: filters.material },
      { id: 'color', label: 'Color', value: filters.color },
      { id: 'roomType', label: 'Room', value: filters.roomType },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `$${filter.value.min} - $${filter.value.max}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else {
          const tab = homeLivingTabs.find(t => t.id === filter.id);
          const option = tab?.options?.find(o => o.value === filter.value);
          displayValue = option?.label || String(filter.value);
        }

        filtersArray.push({
          id: filter.id,
          label: filter.label,
          value: filter.value,
          displayValue,
        });
      }
    });

    return filtersArray;
  }, [filters, homeLivingTabs]);

  return {
    filters,
    setFilters,
    homeLivingTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useHomeLivingData = () => {
  const homeLivingChannels = useMemo(() => [
    {
      id: "all",
      name: "All",
      imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      id: "furniture",
      name: "Furniture",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-brown-50",
      textColor: "text-brown-600"
    },
    {
      id: "decor",
      name: "Decor",
      imageUrl: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      id: "kitchen",
      name: "Kitchen",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      id: "bedding",
      name: "Bedding",
      imageUrl: "https://images.unsplash.com/photo-1616627561950-6f3ac43b6d13?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "lighting",
      name: "Lighting",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700"
    },
    {
      id: "storage",
      name: "Storage",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600"
    },
    {
      id: "outdoor",
      name: "Outdoor",
      imageUrl: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      id: "bath",
      name: "Bath",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    },
    {
      id: "rugs",
      name: "Rugs",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop&crop=center",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'furniture':
        filters.category = 'furniture';
        filters.roomType = ['living-room', 'bedroom', 'dining-room', 'office'];
        filters.material = ['wood', 'metal', 'fabric', 'leather'];
        break;
      case 'decor':
        filters.category = 'decor';
        filters.material = ['ceramic', 'glass', 'metal', 'wood'];
        filters.color = ['white', 'black', 'gray', 'brown', 'beige', 'blue', 'green'];
        break;
      case 'kitchen':
        filters.category = 'kitchen';
        filters.brand = ['IKEA', 'Williams Sonoma', 'Crate & Barrel'];
        filters.material = ['stainless-steel', 'glass', 'ceramic', 'wood'];
        break;
      case 'bedding':
        filters.category = 'bedding';
        filters.material = ['cotton', 'linen', 'silk', 'polyester'];
        filters.color = ['white', 'beige', 'gray', 'blue', 'pink'];
        break;
      case 'lighting':
        filters.category = 'lighting';
        filters.roomType = ['living-room', 'bedroom', 'kitchen', 'dining-room', 'office'];
        filters.style = ['modern', 'traditional', 'industrial', 'minimalist'];
        break;
      case 'storage':
        filters.category = 'storage';
        filters.roomType = ['living-room', 'bedroom', 'kitchen', 'office', 'bathroom'];
        filters.material = ['wood', 'metal', 'plastic', 'fabric'];
        break;
      case 'outdoor':
        filters.category = 'outdoor';
        filters.material = ['rattan', 'wood', 'metal', 'plastic'];
        filters.weatherResistant = true;
        break;
      case 'bath':
        filters.category = 'bath';
        filters.brand = ['Bed Bath & Beyond', 'Pottery Barn', 'West Elm'];
        filters.material = ['ceramic', 'metal', 'glass'];
        break;
      case 'rugs':
        filters.category = 'rugs';
        filters.material = ['wool', 'synthetic', 'cotton', 'jute'];
        filters.size = ['small', 'medium', 'large', 'runner'];
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    homeLivingChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions
export const getPriceRangeDisplay = (priceRange: { min: number; max: number } | null): string => {
  if (!priceRange) return 'Any Price';
  return `$${priceRange.min} - $${priceRange.max}`;
};

export const getRatingDisplay = (rating: number | null): string => {
  if (!rating) return 'Any Rating';
  return `${rating}+ Stars`;
};

export const isPriceRangeValid = (priceRange: any): boolean => {
  return priceRange && 
         typeof priceRange === 'object' && 
         'min' in priceRange && 
         'max' in priceRange &&
         typeof priceRange.min === 'number' &&
         typeof priceRange.max === 'number';
};