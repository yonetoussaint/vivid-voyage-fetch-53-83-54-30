import { useState, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";
import { 
  ShoppingBag, Store, Crown, Award, Zap, Star, 
  Smartphone, Shirt, Home, Sparkles, Dumbbell, Car, 
  Watch, Trophy, Gift, Leaf, Diamond, TrendingUp,
  Package, CheckCircle, Shield, Truck, Tag, Clock
} from "lucide-react";

export interface MallFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  brand: string | null;
  category: string | null;
  color: string | null;
  sellerRating: number | null;
  fastDispatch: boolean;
  discount: boolean;
  verifiedSeller: boolean;
  mallExclusive: boolean;
}

export const useMallFilters = () => {
  const [filters, setFilters] = useState<MallFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    brand: null,
    category: null,
    color: null,
    sellerRating: null,
    fastDispatch: false,
    discount: false,
    verifiedSeller: false,
    mallExclusive: false,
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
        case 'category':
          newFilters.category = null;
          break;
        case 'color':
          newFilters.color = null;
          break;
        case 'sellerRating':
          newFilters.sellerRating = null;
          break;
        case 'fastDispatch':
          newFilters.fastDispatch = false;
          break;
        case 'discount':
          newFilters.discount = false;
          break;
        case 'verifiedSeller':
          newFilters.verifiedSeller = false;
          break;
        case 'mallExclusive':
          newFilters.mallExclusive = false;
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
      category: null,
      color: null,
      sellerRating: null,
      fastDispatch: false,
      discount: false,
      verifiedSeller: false,
      mallExclusive: false,
    });
  };

  const mallTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under G10', value: { min: 0, max: 10 } },
          { label: 'G10 - G50', value: { min: 10, max: 50 } },
          { label: 'G50 - G100', value: { min: 50, max: 100 } },
          { label: 'G100 - G500', value: { min: 100, max: 500 } },
          { label: 'Over G500', value: { min: 500, max: 10000 } },
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
        id: 'fastDispatch',
        label: 'Fast Dispatch',
        type: 'checkbox' as const,
        value: filters.fastDispatch,
      },
      {
        id: 'discount',
        label: 'Discount',
        type: 'checkbox' as const,
        value: filters.discount,
      },
      {
        id: 'verifiedSeller',
        label: 'Verified Seller',
        type: 'checkbox' as const,
        value: filters.verifiedSeller,
      },
      {
        id: 'mallExclusive',
        label: 'Mall Exclusive',
        type: 'checkbox' as const,
        value: filters.mallExclusive,
      },
      {
        id: 'sellerRating',
        label: 'Seller Rating',
        type: 'dropdown' as const,
        value: filters.sellerRating,
        options: [
          { label: 'Any Seller', value: null },
          { label: '95%+ Positive', value: 95 },
          { label: '90%+ Positive', value: 90 },
          { label: '85%+ Positive', value: 85 },
          { label: '80%+ Positive', value: 80 },
        ],
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
          { label: 'Nike', value: 'nike' },
          { label: 'Adidas', value: 'adidas' },
          { label: 'Sony', value: 'sony' },
          { label: 'LG', value: 'lg' },
          { label: 'Xiaomi', value: 'xiaomi' },
          { label: 'Huawei', value: 'huawei' },
          { label: 'Dell', value: 'dell' },
          { label: 'HP', value: 'hp' },
          { label: 'Lenovo', value: 'lenovo' },
          { label: 'Asus', value: 'asus' },
          { label: 'Acer', value: 'acer' },
        ],
      },
      {
        id: 'category',
        label: 'Category',
        type: 'dropdown' as const,
        value: filters.category,
        options: [
          { label: 'All Categories', value: null },
          { label: 'Smartphones', value: 'smartphones' },
          { label: 'Laptops', value: 'laptops' },
          { label: 'TVs', value: 'tvs' },
          { label: 'Headphones', value: 'headphones' },
          { label: 'Wearables', value: 'wearables' },
          { label: 'Home Appliances', value: 'home-appliances' },
          { label: 'Cameras', value: 'cameras' },
          { label: 'Gaming', value: 'gaming' },
          { label: 'Fashion', value: 'fashion' },
          { label: 'Beauty', value: 'beauty' },
          { label: 'Sports', value: 'sports' },
          { label: 'Toys', value: 'toys' },
          { label: 'Automotive', value: 'automotive' },
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
          { label: 'Silver', value: 'silver' },
          { label: 'Gold', value: 'gold' },
          { label: 'Blue', value: 'blue' },
          { label: 'Red', value: 'red' },
          { label: 'Green', value: 'green' },
          { label: 'Gray', value: 'gray' },
          { label: 'Rose Gold', value: 'rose-gold' },
          { label: 'Space Gray', value: 'space-gray' },
        ],
      },
      {
        id: 'shippedFrom',
        label: 'Ships From',
        type: 'dropdown' as const,
        value: filters.shippedFrom,
        options: [
          { label: 'Any Location', value: null },
          { label: 'Official Stores', value: 'official' },
          { label: 'Mall Stores', value: 'mall' },
          { label: 'China', value: 'china' },
          { label: 'United States', value: 'us' },
          { label: 'Europe', value: 'europe' },
          { label: 'Japan', value: 'japan' },
          { label: 'Korea', value: 'korea' },
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
      { id: 'fastDispatch', label: 'Dispatch', displayValue: 'Fast', value: filters.fastDispatch },
      { id: 'discount', label: 'Discount', displayValue: 'Discounted', value: filters.discount },
      { id: 'verifiedSeller', label: 'Seller', displayValue: 'Verified', value: filters.verifiedSeller },
      { id: 'mallExclusive', label: 'Exclusive', displayValue: 'Mall Exclusive', value: filters.mallExclusive },
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
      { id: 'category', label: 'Category', value: filters.category },
      { id: 'color', label: 'Color', value: filters.color },
      { id: 'sellerRating', label: 'Seller', value: filters.sellerRating },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `G${filter.value.min} - G${filter.value.max}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else if (filter.id === 'sellerRating' && filter.value) {
          displayValue = `${filter.value}%+ Positive`;
        } else {
          const tab = mallTabs.find(t => t.id === filter.id);
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
  }, [filters, mallTabs]);

  return {
    filters,
    setFilters,
    mallTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useMallData = () => {
  const mallChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All',
      icon: <ShoppingBag className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'official-stores',
      name: 'Official Stores',
      icon: <Store className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'mall-exclusives',
      name: 'Mall Exclusives',
      icon: <Diamond className="w-6 h-6" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      id: 'top-brands',
      name: 'Top Brands',
      icon: <Crown className="w-6 h-6" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: <Award className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'trending',
      name: 'Trending',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: <Smartphone className="w-6 h-6" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      icon: <Shirt className="w-6 h-6" />,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      id: 'home-living',
      name: 'Home & Living',
      icon: <Home className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'beauty',
      name: 'Beauty',
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    {
      id: 'sports-outdoors',
      name: 'Sports & Outdoors',
      icon: <Dumbbell className="w-6 h-6" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'toys-kids',
      name: 'Toys & Kids',
      icon: <Gift className="w-6 h-6" />,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: <Car className="w-6 h-6" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'best-deals',
      name: 'Best Deals',
      icon: <Tag className="w-6 h-6" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'fast-shipping',
      name: 'Fast Shipping',
      icon: <Truck className="w-6 h-6" />,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'official-stores':
        filters.verifiedSeller = true;
        filters.shippedFrom = 'official';
        filters.sellerRating = 90;
        break;
      case 'mall-exclusives':
        filters.mallExclusive = true;
        filters.verifiedSeller = true;
        break;
      case 'top-brands':
        filters.brand = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];
        filters.verifiedSeller = true;
        break;
      case 'luxury':
        filters.priceRange = { min: 500, max: 10000 };
        filters.brand = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP'];
        filters.verifiedSeller = true;
        break;
      case 'trending':
        filters.sortBy = 'popular';
        filters.rating = 4.0;
        break;
      case 'electronics':
        filters.category = ['smartphones', 'laptops', 'tvs', 'headphones', 'wearables', 'cameras'];
        filters.verifiedSeller = true;
        break;
      case 'fashion':
        filters.category = 'fashion';
        filters.brand = ['Nike', 'Adidas'];
        filters.verifiedSeller = true;
        break;
      case 'home-living':
        filters.category = 'home-appliances';
        filters.verifiedSeller = true;
        break;
      case 'beauty':
        filters.category = 'beauty';
        filters.verifiedSeller = true;
        break;
      case 'sports-outdoors':
        filters.category = 'sports';
        filters.brand = ['Nike', 'Adidas'];
        break;
      case 'toys-kids':
        filters.category = 'toys';
        filters.verifiedSeller = true;
        break;
      case 'automotive':
        filters.category = 'automotive';
        break;
      case 'best-deals':
        filters.onSale = true;
        filters.discount = true;
        filters.priceRange = { min: 0, max: 100 };
        break;
      case 'fast-shipping':
        filters.fastDispatch = true;
        filters.freeShipping = true;
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    mallChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions
export const getPriceRangeDisplay = (priceRange: { min: number; max: number } | null): string => {
  if (!priceRange) return 'Any Price';
  return `G${priceRange.min} - G${priceRange.max}`;
};

export const getRatingDisplay = (rating: number | null): string => {
  if (!rating) return 'Any Rating';
  return `${rating}+ Stars`;
};

export const getSellerRatingDisplay = (sellerRating: number | null): string => {
  if (!sellerRating) return 'Any Seller';
  return `${sellerRating}%+ Positive`;
};

export const isPriceRangeValid = (priceRange: any): boolean => {
  return priceRange && 
         typeof priceRange === 'object' && 
         'min' in priceRange && 
         'max' in priceRange &&
         typeof priceRange.min === 'number' &&
         typeof priceRange.max === 'number';
};