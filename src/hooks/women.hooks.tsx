import { useState, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface WomenFashionFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  brand: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
  occasion: string | null;
  sustainable: boolean;
  plusSize: boolean;
}

export const useWomenFashionFilters = () => {
  const [filters, setFilters] = useState<WomenFashionFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    brand: null,
    size: null,
    color: null,
    material: null,
    occasion: null,
    sustainable: false,
    plusSize: false,
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
        case 'size':
          newFilters.size = null;
          break;
        case 'color':
          newFilters.color = null;
          break;
        case 'material':
          newFilters.material = null;
          break;
        case 'occasion':
          newFilters.occasion = null;
          break;
        case 'sustainable':
          newFilters.sustainable = false;
          break;
        case 'plusSize':
          newFilters.plusSize = false;
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
      size: null,
      color: null,
      material: null,
      occasion: null,
      sustainable: false,
      plusSize: false,
    });
  };

  const womenFashionTabs: FilterTab[] = useMemo(() => {
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
          { label: 'Over $200', value: { min: 200, max: 1000 } },
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
        id: 'sustainable',
        label: 'Sustainable',
        type: 'checkbox' as const,
        value: filters.sustainable,
      },
      {
        id: 'plusSize',
        label: 'Plus Size',
        type: 'checkbox' as const,
        value: filters.plusSize,
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
        options: [
          { label: 'All Brands', value: null },
          { label: 'Zara', value: 'zara' },
          { label: 'H&M', value: 'hm' },
          { label: 'Nike', value: 'nike' },
          { label: 'Adidas', value: 'adidas' },
          { label: 'Forever 21', value: 'forever21' },
          { label: 'Mango', value: 'mango' },
          { label: 'ASOS', value: 'asos' },
          { label: 'Shein', value: 'shein' },
          { label: 'Lululemon', value: 'lululemon' },
          { label: 'Uniqlo', value: 'uniqlo' },
          { label: 'Levi\'s', value: 'levis' },
          { label: 'Calvin Klein', value: 'calvinklein' },
          { label: 'Victoria\'s Secret', value: 'victoriassecret' },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'dropdown' as const,
        value: filters.size,
        options: [
          { label: 'All Sizes', value: null },
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
          { label: 'XXL', value: 'xxl' },
          { label: 'XXXL', value: 'xxxl' },
          { label: 'Petite', value: 'petite' },
          { label: 'Tall', value: 'tall' },
        ],
      },
      {
        id: 'color',
        label: 'Color',
        type: 'dropdown' as const,
        value: filters.color,
        options: [
          { label: 'Any Color', value: null },
          { label: 'Black', value: 'black' },
          { label: 'White', value: 'white' },
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Pink', value: 'pink' },
          { label: 'Purple', value: 'purple' },
          { label: 'Orange', value: 'orange' },
          { label: 'Brown', value: 'brown' },
          { label: 'Gray', value: 'gray' },
          { label: 'Beige', value: 'beige' },
          { label: 'Multi-color', value: 'multicolor' },
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
          { label: 'Silk', value: 'silk' },
          { label: 'Wool', value: 'wool' },
          { label: 'Leather', value: 'leather' },
          { label: 'Denim', value: 'denim' },
          { label: 'Linen', value: 'linen' },
          { label: 'Spandex', value: 'spandex' },
          { label: 'Velvet', value: 'velvet' },
          { label: 'Cashmere', value: 'cashmere' },
        ],
      },
      {
        id: 'occasion',
        label: 'Occasion',
        type: 'dropdown' as const,
        value: filters.occasion,
        options: [
          { label: 'Any Occasion', value: null },
          { label: 'Casual', value: 'casual' },
          { label: 'Formal', value: 'formal' },
          { label: 'Work', value: 'work' },
          { label: 'Party', value: 'party' },
          { label: 'Wedding', value: 'wedding' },
          { label: 'Beach', value: 'beach' },
          { label: 'Sports', value: 'sports' },
          { label: 'Evening', value: 'evening' },
          { label: 'Vacation', value: 'vacation' },
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
          { label: 'India', value: 'india' },
          { label: 'Bangladesh', value: 'bangladesh' },
          { label: 'Vietnam', value: 'vietnam' },
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
      { id: 'sustainable', label: 'Sustainable', displayValue: 'Eco-Friendly', value: filters.sustainable },
      { id: 'plusSize', label: 'Size', displayValue: 'Plus Size', value: filters.plusSize },
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
      { id: 'size', label: 'Size', value: filters.size },
      { id: 'color', label: 'Color', value: filters.color },
      { id: 'material', label: 'Material', value: filters.material },
      { id: 'occasion', label: 'Occasion', value: filters.occasion },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `$${filter.value.min} - $${filter.value.max}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else {
          const tab = womenFashionTabs.find(t => t.id === filter.id);
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
  }, [filters, womenFashionTabs]);

  return {
    filters,
    setFilters,
    womenFashionTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useWomenFashionData = () => {
  const womenFashionChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      id: 'dresses',
      name: 'Dresses',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'tops',
      name: 'Tops',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'bottoms',
      name: 'Bottoms',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      id: 'handbags',
      name: 'Handbags',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-brown-50',
      textColor: 'text-brown-600'
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'activewear',
      name: 'Activewear',
      imageUrl: 'https://images.unsplash.com/photo-1591369822093-3554c987c4e8?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'lingerie',
      name: 'Lingerie',
      imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-700'
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      id: 'swimwear',
      name: 'Swimwear',
      imageUrl: 'https://images.unsplash.com/photo-1576827471283-36a1a251d5c0?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      id: 'beauty',
      name: 'Beauty',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-600'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1590649887894-3d70487e81c4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    {
      id: 'maternity',
      name: 'Maternity',
      imageUrl: 'https://images.unsplash.com/photo-1518674660708-0e2c0473e68e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'plus-size',
      name: 'Plus Size',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600'
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'dresses':
        filters.category = 'dresses';
        filters.occasion = ['casual', 'formal', 'party', 'wedding'];
        filters.length = ['mini', 'midi', 'maxi'];
        break;
      case 'tops':
        filters.category = 'tops';
        filters.type = ['t-shirts', 'blouses', 'sweaters', 'tank-tops'];
        filters.material = ['cotton', 'silk', 'polyester', 'wool'];
        break;
      case 'bottoms':
        filters.category = 'bottoms';
        filters.type = ['jeans', 'pants', 'skirts', 'shorts'];
        filters.material = ['denim', 'cotton', 'polyester', 'leather'];
        break;
      case 'shoes':
        filters.category = 'shoes';
        filters.type = ['sneakers', 'heels', 'flats', 'boots', 'sandals'];
        filters.material = ['leather', 'suede', 'canvas', 'synthetic'];
        break;
      case 'handbags':
        filters.category = 'handbags';
        filters.type = ['tote', 'crossbody', 'clutch', 'backpack', 'shoulder-bag'];
        filters.material = ['leather', 'canvas', 'straw', 'synthetic'];
        break;
      case 'jewelry':
        filters.category = 'jewelry';
        filters.type = ['necklaces', 'earrings', 'bracelets', 'rings'];
        filters.material = ['gold', 'silver', 'rose-gold', 'costume'];
        break;
      case 'activewear':
        filters.category = 'activewear';
        filters.brand = ['Nike', 'Adidas', 'Lululemon', 'Under Armour'];
        filters.type = ['leggings', 'sports-bras', 't-shirts', 'shorts'];
        break;
      case 'lingerie':
        filters.category = 'lingerie';
        filters.type = ['bras', 'panties', 'sleepwear', 'shapewear'];
        filters.material = ['silk', 'lace', 'cotton', 'satin'];
        break;
      case 'outerwear':
        filters.category = 'outerwear';
        filters.type = ['jackets', 'coats', 'blazers', 'cardigans'];
        filters.material = ['wool', 'leather', 'denim', 'polyester'];
        break;
      case 'swimwear':
        filters.category = 'swimwear';
        filters.type = ['bikinis', 'one-pieces', 'cover-ups'];
        filters.material = ['nylon', 'polyester', 'spandex'];
        break;
      case 'beauty':
        filters.category = 'beauty';
        filters.type = ['makeup', 'skincare', 'fragrance', 'haircare'];
        break;
      case 'accessories':
        filters.category = 'accessories';
        filters.type = ['hats', 'scarves', 'belts', 'sunglasses', 'hair-accessories'];
        break;
      case 'maternity':
        filters.category = 'maternity';
        filters.plusSize = true;
        filters.material = ['stretchy', 'cotton', 'breathable'];
        break;
      case 'plus-size':
        filters.category = 'plus-size';
        filters.plusSize = true;
        filters.size = ['xl', 'xxl', 'xxxl', '1x', '2x', '3x'];
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    womenFashionChannels,
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