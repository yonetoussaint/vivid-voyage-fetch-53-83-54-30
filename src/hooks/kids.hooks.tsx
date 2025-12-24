import { useState, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface KidsFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  brand: string | null;
  ageGroup: string | null;
  gender: string | null;
  category: string | null;
  material: string | null;
  color: string | null;
  educational: boolean;
  organic: boolean;
  bpaFree: boolean;
}

export const useKidsFilters = () => {
  const [filters, setFilters] = useState<KidsFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    brand: null,
    ageGroup: null,
    gender: null,
    category: null,
    material: null,
    color: null,
    educational: false,
    organic: false,
    bpaFree: false,
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
        case 'ageGroup':
          newFilters.ageGroup = null;
          break;
        case 'gender':
          newFilters.gender = null;
          break;
        case 'category':
          newFilters.category = null;
          break;
        case 'material':
          newFilters.material = null;
          break;
        case 'color':
          newFilters.color = null;
          break;
        case 'educational':
          newFilters.educational = false;
          break;
        case 'organic':
          newFilters.organic = false;
          break;
        case 'bpaFree':
          newFilters.bpaFree = false;
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
      ageGroup: null,
      gender: null,
      category: null,
      material: null,
      color: null,
      educational: false,
      organic: false,
      bpaFree: false,
    });
  };

  const kidsTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under $10', value: { min: 0, max: 10 } },
          { label: '$10 - $25', value: { min: 10, max: 25 } },
          { label: '$25 - $50', value: { min: 25, max: 50 } },
          { label: '$50 - $100', value: { min: 50, max: 100 } },
          { label: 'Over $100', value: { min: 100, max: 500 } },
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
        id: 'educational',
        label: 'Educational',
        type: 'checkbox' as const,
        value: filters.educational,
      },
      {
        id: 'organic',
        label: 'Organic',
        type: 'checkbox' as const,
        value: filters.organic,
      },
      {
        id: 'bpaFree',
        label: 'BPA Free',
        type: 'checkbox' as const,
        value: filters.bpaFree,
      },
      {
        id: 'ageGroup',
        label: 'Age',
        type: 'dropdown' as const,
        value: filters.ageGroup,
        options: [
          { label: 'All Ages', value: null },
          { label: '0-12 months', value: '0-12m' },
          { label: '1-2 years', value: '1-2y' },
          { label: '3-4 years', value: '3-4y' },
          { label: '5-7 years', value: '5-7y' },
          { label: '8-10 years', value: '8-10y' },
          { label: '11-12 years', value: '11-12y' },
          { label: 'Teens', value: 'teens' },
        ],
      },
      {
        id: 'gender',
        label: 'Gender',
        type: 'dropdown' as const,
        value: filters.gender,
        options: [
          { label: 'All Genders', value: null },
          { label: 'Boys', value: 'boys' },
          { label: 'Girls', value: 'girls' },
          { label: 'Unisex', value: 'unisex' },
        ],
      },
      {
        id: 'category',
        label: 'Category',
        type: 'dropdown' as const,
        value: filters.category,
        options: [
          { label: 'All Categories', value: null },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Toys', value: 'toys' },
          { label: 'Baby Gear', value: 'baby-gear' },
          { label: 'Books', value: 'books' },
          { label: 'Furniture', value: 'furniture' },
          { label: 'Feeding', value: 'feeding' },
          { label: 'Bath & Potty', value: 'bath-potty' },
          { label: 'Safety', value: 'safety' },
          { label: 'Educational', value: 'educational' },
          { label: 'Outdoor', value: 'outdoor' },
        ],
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
        options: [
          { label: 'All Brands', value: null },
          { label: 'Carter\'s', value: 'carters' },
          { label: 'Gap Kids', value: 'gap-kids' },
          { label: 'Old Navy', value: 'old-navy' },
          { label: 'H&M Kids', value: 'hm-kids' },
          { label: 'Fisher-Price', value: 'fisher-price' },
          { label: 'LEGO', value: 'lego' },
          { label: 'Melissa & Doug', value: 'melissa-doug' },
          { label: 'Disney', value: 'disney' },
          { label: 'Hasbro', value: 'hasbro' },
          { label: 'Mattel', value: 'mattel' },
          { label: 'VTech', value: 'vtech' },
          { label: 'Graco', value: 'graco' },
          { label: 'Evenflo', value: 'evenflo' },
          { label: 'Skip Hop', value: 'skip-hop' },
        ],
      },
      {
        id: 'material',
        label: 'Material',
        type: 'dropdown' as const,
        value: filters.material,
        options: [
          { label: 'Any Material', value: null },
          { label: 'Cotton', value: 'cotton' },
          { label: 'Polyester', value: 'polyester' },
          { label: 'Organic Cotton', value: 'organic-cotton' },
          { label: 'Bamboo', value: 'bamboo' },
          { label: 'Plastic', value: 'plastic' },
          { label: 'Wood', value: 'wood' },
          { label: 'Silicone', value: 'silicone' },
          { label: 'Fleece', value: 'fleece' },
          { label: 'Denim', value: 'denim' },
        ],
      },
      {
        id: 'color',
        label: 'Color',
        type: 'dropdown' as const,
        value: filters.color,
        options: [
          { label: 'Any Color', value: null },
          { label: 'Blue', value: 'blue' },
          { label: 'Pink', value: 'pink' },
          { label: 'White', value: 'white' },
          { label: 'Black', value: 'black' },
          { label: 'Gray', value: 'gray' },
          { label: 'Red', value: 'red' },
          { label: 'Green', value: 'green' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Purple', value: 'purple' },
          { label: 'Orange', value: 'orange' },
          { label: 'Multi-color', value: 'multicolor' },
        ],
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
          { label: 'Canada', value: 'canada' },
          { label: 'India', value: 'india' },
          { label: 'Bangladesh', value: 'bangladesh' },
        ],
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
      { id: 'educational', label: 'Educational', displayValue: 'Educational', value: filters.educational },
      { id: 'organic', label: 'Material', displayValue: 'Organic', value: filters.organic },
      { id: 'bpaFree', label: 'Safety', displayValue: 'BPA Free', value: filters.bpaFree },
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
      { id: 'ageGroup', label: 'Age', value: filters.ageGroup },
      { id: 'gender', label: 'Gender', value: filters.gender },
      { id: 'category', label: 'Category', value: filters.category },
      { id: 'material', label: 'Material', value: filters.material },
      { id: 'color', label: 'Color', value: filters.color },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `$${filter.value.min} - $${filter.value.max}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else {
          const tab = kidsTabs.find(t => t.id === filter.id);
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
  }, [filters, kidsTabs]);

  return {
    filters,
    setFilters,
    kidsTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useKidsData = () => {
  const kidsChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All Kids',
      imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'clothing',
      name: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1592598015799-35c84b09394c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      id: 'toys',
      name: 'Toys',
      imageUrl: 'https://images.unsplash.com/photo-1587654780298-8ded0b58d469?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'baby-gear',
      name: 'Baby Gear',
      imageUrl: 'https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'books',
      name: 'Books',
      imageUrl: 'https://images.unsplash.com/photo-1545693313-8d10c4c2b653?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'furniture',
      name: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1591369822093-3554c987c4e8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-brown-50',
      textColor: 'text-brown-600'
    },
    {
      id: 'feeding',
      name: 'Feeding',
      imageUrl: 'https://images.unsplash.com/photo-1563262012-d1d8e1a9a9a1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'bath-potty',
      name: 'Bath & Potty',
      imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      id: 'safety',
      name: 'Safety',
      imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'educational',
      name: 'Educational',
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      imageUrl: 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      id: 'party',
      name: 'Party',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-600'
    },
    {
      id: 'dolls',
      name: 'Dolls',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    {
      id: 'puzzles',
      name: 'Puzzles',
      imageUrl: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'clothing':
        filters.category = 'clothing';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y', '5-7y', '8-10y'];
        filters.gender = ['boys', 'girls', 'unisex'];
        break;
      case 'toys':
        filters.category = 'toys';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y', '5-7y', '8-10y', '11-12y', 'teens'];
        filters.brand = ['LEGO', 'Fisher-Price', 'Melissa & Doug', 'Hasbro', 'Mattel'];
        break;
      case 'baby-gear':
        filters.category = 'baby-gear';
        filters.ageGroup = ['0-12m', '1-2y'];
        filters.brand = ['Graco', 'Evenflo', 'Fisher-Price', 'Skip Hop'];
        break;
      case 'books':
        filters.category = 'books';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y', '5-7y', '8-10y', '11-12y', 'teens'];
        filters.educational = true;
        break;
      case 'furniture':
        filters.category = 'furniture';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y', '5-7y'];
        filters.material = ['wood', 'plastic'];
        break;
      case 'feeding':
        filters.category = 'feeding';
        filters.ageGroup = ['0-12m', '1-2y'];
        filters.material = ['silicone', 'plastic'];
        filters.bpaFree = true;
        break;
      case 'bath-potty':
        filters.category = 'bath-potty';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y'];
        filters.material = ['plastic', 'silicone'];
        break;
      case 'safety':
        filters.category = 'safety';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y'];
        filters.brand = ['Safety 1st', 'Summer Infant', 'Graco'];
        break;
      case 'educational':
        filters.category = 'educational';
        filters.educational = true;
        filters.ageGroup = ['1-2y', '3-4y', '5-7y', '8-10y'];
        break;
      case 'outdoor':
        filters.category = 'outdoor';
        filters.ageGroup = ['1-2y', '3-4y', '5-7y', '8-10y', '11-12y'];
        filters.gender = ['boys', 'girls', 'unisex'];
        break;
      case 'shoes':
        filters.category = 'clothing';
        filters.ageGroup = ['0-12m', '1-2y', '3-4y', '5-7y', '8-10y', '11-12y'];
        filters.gender = ['boys', 'girls'];
        break;
      case 'party':
        filters.category = 'toys';
        filters.ageGroup = ['1-2y', '3-4y', '5-7y', '8-10y'];
        filters.brand = ['Disney', 'Hasbro', 'Mattel'];
        break;
      case 'dolls':
        filters.category = 'toys';
        filters.gender = 'girls';
        filters.ageGroup = ['3-4y', '5-7y', '8-10y', '11-12y'];
        filters.brand = ['Barbie', 'Disney', 'American Girl'];
        break;
      case 'puzzles':
        filters.category = 'educational';
        filters.educational = true;
        filters.ageGroup = ['3-4y', '5-7y', '8-10y', '11-12y'];
        filters.brand = ['Melissa & Doug', 'Ravensburger', 'LEGO'];
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    kidsChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions
export const getPriceRangeDisplay = (priceRange: { min: number; max: number } | null): string => {
  if (!priceRange) return 'Any Price';
  return `$${filter.value.min} - $${filter.value.max}`;
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