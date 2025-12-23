import { useState, useEffect, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

// Import available icons from lucide-react
import { 
  Cpu, 
  Battery, 
  HardDrive, 
  Monitor, 
  Shield, 
  MemoryStick,
  Cpu as Chip,
  Waves,
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Watch,
  Camera,
  Gamepad2,
  Speaker,
  Tablet,
  Cable,
  Home,
  Radio,
  Monitor as Display,
} from "lucide-react";

export interface ElectronicsFilters {
  sortBy: string;
  freeShipping: boolean;
  onSale: boolean;
  freeReturns: boolean;
  newArrivals: boolean;
  brand: string | null;
  condition: string;
  warranty: boolean;
  ram: string[];
  storage: string[];
  screenSize: string[];
  resolution: string[];
  batteryLife: string[];
  processor: string[];
  priceRange: { min: number; max: number } | null;
  rating: number | null;
  shippedFrom: string[];
  connectivity: string[];
  color: string[];
}

export const useElectronicsFilters = () => {
  const [filters, setFilters] = useState<ElectronicsFilters>({
    sortBy: 'popular',
    freeShipping: false,
    onSale: false,
    freeReturns: false,
    newArrivals: false,
    brand: null,
    condition: 'all',
    warranty: false,
    ram: [],
    storage: [],
    screenSize: [],
    resolution: [],
    batteryLife: [],
    processor: [],
    priceRange: null,
    rating: null,
    shippedFrom: [],
    connectivity: [],
    color: [],
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
        case 'sortBy':
          newFilters.sortBy = 'popular';
          break;
        case 'priceRange':
          newFilters.priceRange = null;
          break;
        case 'brand':
          newFilters.brand = null;
          break;
        case 'condition':
          newFilters.condition = 'all';
          break;
        case 'rating':
          newFilters.rating = null;
          break;
        case 'ram':
          newFilters.ram = [];
          break;
        case 'storage':
          newFilters.storage = [];
          break;
        case 'screenSize':
          newFilters.screenSize = [];
          break;
        case 'processor':
          newFilters.processor = [];
          break;
        case 'resolution':
          newFilters.resolution = [];
          break;
        case 'connectivity':
          newFilters.connectivity = [];
          break;
        case 'color':
          newFilters.color = [];
          break;
        case 'shippedFrom':
          newFilters.shippedFrom = [];
          break;
        case 'warranty':
          newFilters.warranty = false;
          break;
        case 'freeShipping':
          newFilters.freeShipping = false;
          break;
        case 'onSale':
          newFilters.onSale = false;
          break;
        case 'freeReturns':
          newFilters.freeReturns = false;
          break;
        case 'newArrivals':
          newFilters.newArrivals = false;
          break;
        default:
          const defaults: Record<string, any> = {
            sortBy: 'popular',
            freeShipping: false,
            onSale: false,
            freeReturns: false,
            newArrivals: false,
            brand: null,
            condition: 'all',
            warranty: false,
            ram: [],
            storage: [],
            screenSize: [],
            resolution: [],
            batteryLife: [],
            processor: [],
            priceRange: null,
            rating: null,
            shippedFrom: [],
            connectivity: [],
            color: [],
          };
          if (filterId in defaults) {
            (newFilters as any)[filterId] = defaults[filterId];
          }
      }
      
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setFilters({
      sortBy: 'popular',
      freeShipping: false,
      onSale: false,
      freeReturns: false,
      newArrivals: false,
      brand: null,
      condition: 'all',
      warranty: false,
      ram: [],
      storage: [],
      screenSize: [],
      resolution: [],
      batteryLife: [],
      processor: [],
      priceRange: null,
      rating: null,
      shippedFrom: [],
      connectivity: [],
      color: [],
    });
  };

  const electronicsTabs: FilterTab[] = useMemo(() => [
    {
      id: 'sortBy',
      label: 'Sort',
      type: 'dropdown',
      value: filters.sortBy,
      options: [
        { label: 'Popular', value: 'popular' },
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_low' },
        { label: 'Price: High to Low', value: 'price_high' },
        { label: 'Top Rated', value: 'rating' },
        { label: 'Best Sellers', value: 'best_sellers' },
      ],
    },
    {
      id: 'priceRange',
      label: 'Price',
      type: 'dropdown',
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
      id: 'brand',
      label: 'Brand',
      type: 'dropdown',
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
    {
      id: 'condition',
      label: 'Condition',
      type: 'dropdown',
      value: filters.condition,
      options: [
        { label: 'All Conditions', value: 'all' },
        { label: 'New', value: 'new' },
        { label: 'Refurbished', value: 'refurbished' },
        { label: 'Used - Like New', value: 'used_like_new' },
        { label: 'Used - Good', value: 'used_good' },
      ],
    },
    {
      id: 'ram',
      label: 'RAM',
      type: 'multi-select',
      value: filters.ram,
      icon: <MemoryStick className="w-3 h-3" />,
      options: [
        { label: '2 GB', value: '2gb' },
        { label: '4 GB', value: '4gb' },
        { label: '8 GB', value: '8gb' },
        { label: '16 GB', value: '16gb' },
        { label: '32 GB', value: '32gb' },
        { label: '64 GB+', value: '64gb+' },
      ],
    },
    {
      id: 'storage',
      label: 'Storage',
      type: 'multi-select',
      value: filters.storage,
      icon: <HardDrive className="w-3 h-3" />,
      options: [
        { label: '64 GB', value: '64gb' },
        { label: '128 GB', value: '128gb' },
        { label: '256 GB', value: '256gb' },
        { label: '512 GB', value: '512gb' },
        { label: '1 TB', value: '1tb' },
        { label: '2 TB+', value: '2tb+' },
      ],
    },
    {
      id: 'screenSize',
      label: 'Screen Size',
      type: 'multi-select',
      value: filters.screenSize,
      icon: <Monitor className="w-3 h-3" />,
      options: [
        { label: 'Under 5"', value: 'under_5' },
        { label: '5" - 6"', value: '5_6' },
        { label: '6" - 7"', value: '6_7' },
        { label: '13" - 15"', value: '13_15' },
        { label: '15" - 17"', value: '15_17' },
        { label: '24" - 27"', value: '24_27' },
        { label: '32" - 40"', value: '32_40' },
        { label: '40"+', value: '40_plus' },
      ],
    },
    {
      id: 'processor',
      label: 'Processor',
      type: 'multi-select',
      value: filters.processor,
      icon: <Cpu className="w-3 h-3" />,
      options: [
        { label: 'Intel Core i3', value: 'i3' },
        { label: 'Intel Core i5', value: 'i5' },
        { label: 'Intel Core i7', value: 'i7' },
        { label: 'Intel Core i9', value: 'i9' },
        { label: 'AMD Ryzen 3', value: 'ryzen3' },
        { label: 'AMD Ryzen 5', value: 'ryzen5' },
        { label: 'AMD Ryzen 7', value: 'ryzen7' },
        { label: 'AMD Ryzen 9', value: 'ryzen9' },
        { label: 'Apple M1', value: 'm1' },
        { label: 'Apple M2', value: 'm2' },
        { label: 'Apple M3', value: 'm3' },
        { label: 'Snapdragon', value: 'snapdragon' },
      ],
    },
    {
      id: 'batteryLife',
      label: 'Battery Life',
      type: 'multi-select',
      value: filters.batteryLife,
      icon: <Battery className="w-3 h-3" />,
      options: [
        { label: 'Under 8 hours', value: 'under_8' },
        { label: '8-12 hours', value: '8_12' },
        { label: '12-16 hours', value: '12_16' },
        { label: '16-20 hours', value: '16_20' },
        { label: '20+ hours', value: '20_plus' },
      ],
    },
    {
      id: 'resolution',
      label: 'Resolution',
      type: 'multi-select',
      value: filters.resolution,
      icon: <Monitor className="w-3 h-3" />,
      options: [
        { label: 'HD (720p)', value: '720p' },
        { label: 'Full HD (1080p)', value: '1080p' },
        { label: '2K (1440p)', value: '1440p' },
        { label: '4K (2160p)', value: '4k' },
        { label: '8K', value: '8k' },
        { label: 'Retina', value: 'retina' },
      ],
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      type: 'multi-select',
      value: filters.connectivity,
      icon: <Waves className="w-3 h-3" />,
      options: [
        { label: 'Wi-Fi 6', value: 'wifi6' },
        { label: 'Wi-Fi 6E', value: 'wifi6e' },
        { label: 'Bluetooth 5.0+', value: 'bluetooth5' },
        { label: '5G', value: '5g' },
        { label: 'USB-C', value: 'usbc' },
        { label: 'Thunderbolt', value: 'thunderbolt' },
        { label: 'HDMI 2.1', value: 'hdmi21' },
        { label: 'Ethernet', value: 'ethernet' },
      ],
    },
    {
      id: 'color',
      label: 'Color',
      type: 'multi-select',
      value: filters.color,
      options: [
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Silver', value: 'silver' },
        { label: 'Space Gray', value: 'space_gray' },
        { label: 'Midnight', value: 'midnight' },
        { label: 'Blue', value: 'blue' },
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Pink', value: 'pink' },
        { label: 'Gold', value: 'gold' },
      ],
    },
    {
      id: 'warranty',
      label: 'Warranty',
      type: 'checkbox',
      value: filters.warranty,
      icon: <Shield className="w-3 h-3" />,
    },
    {
      id: 'freeShipping',
      label: 'Free Shipping',
      type: 'checkbox',
      value: filters.freeShipping,
    },
    {
      id: 'onSale',
      label: 'On Sale',
      type: 'checkbox',
      value: filters.onSale,
    },
    {
      id: 'freeReturns',
      label: 'Free Returns',
      type: 'checkbox',
      value: filters.freeReturns,
    },
    {
      id: 'newArrivals',
      label: 'New Arrivals',
      type: 'checkbox',
      value: filters.newArrivals,
    },
    {
      id: 'shippedFrom',
      label: 'Shipped From',
      type: 'multi-select',
      value: filters.shippedFrom,
      options: [
        { label: 'United States', value: 'us' },
        { label: 'China', value: 'china' },
        { label: 'South Korea', value: 'south_korea' },
        { label: 'Japan', value: 'japan' },
        { label: 'Taiwan', value: 'taiwan' },
        { label: 'Germany', value: 'germany' },
        { label: 'Local Pickup', value: 'local' },
      ],
    },
    {
      id: 'rating',
      label: 'Rating',
      type: 'dropdown',
      value: filters.rating,
      options: [
        { label: 'Any Rating', value: null },
        { label: '4★ & Up', value: 4 },
        { label: '4.5★ & Up', value: 4.5 },
        { label: '5★', value: 5 },
      ],
    },
  ], [filters]);

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filtersArray: ActiveFilter[] = [];

    if (filters.sortBy !== 'popular') {
      const sortOption = electronicsTabs.find(t => t.id === 'sortBy')?.options?.find(o => o.value === filters.sortBy);
      filtersArray.push({
        id: 'sortBy',
        label: 'Sort',
        value: filters.sortBy,
        displayValue: sortOption?.label || filters.sortBy,
      });
    }

    // FIX: Add null check for priceRange
    if (filters.priceRange) {
      filtersArray.push({
        id: 'priceRange',
        label: 'Price',
        value: filters.priceRange,
        displayValue: `$${filters.priceRange.min} - $${filters.priceRange.max}`,
      });
    }

    if (filters.brand) {
      const brandOption = electronicsTabs.find(t => t.id === 'brand')?.options?.find(o => o.value === filters.brand);
      filtersArray.push({
        id: 'brand',
        label: 'Brand',
        value: filters.brand,
        displayValue: brandOption?.label || filters.brand,
      });
    }

    if (filters.condition !== 'all') {
      const conditionOption = electronicsTabs.find(t => t.id === 'condition')?.options?.find(o => o.value === filters.condition);
      filtersArray.push({
        id: 'condition',
        label: 'Condition',
        value: filters.condition,
        displayValue: conditionOption?.label || filters.condition,
      });
    }

    if (filters.rating !== null) {
      filtersArray.push({
        id: 'rating',
        label: 'Rating',
        value: filters.rating,
        displayValue: `${filters.rating}★ & Up`,
      });
    }

    if (filters.ram.length > 0) {
      filtersArray.push({
        id: 'ram',
        label: 'RAM',
        value: filters.ram,
        displayValue: filters.ram.join(', ').replace(/gb/gi, ' GB'),
      });
    }

    if (filters.storage.length > 0) {
      filtersArray.push({
        id: 'storage',
        label: 'Storage',
        value: filters.storage,
        displayValue: filters.storage.join(', ').replace(/gb/gi, ' GB').replace(/tb/gi, ' TB'),
      });
    }

    if (filters.screenSize.length > 0) {
      filtersArray.push({
        id: 'screenSize',
        label: 'Screen Size',
        value: filters.screenSize,
        displayValue: filters.screenSize.join(', '),
      });
    }

    if (filters.processor.length > 0) {
      filtersArray.push({
        id: 'processor',
        label: 'Processor',
        value: filters.processor,
        displayValue: filters.processor.join(', '),
      });
    }

    if (filters.resolution.length > 0) {
      filtersArray.push({
        id: 'resolution',
        label: 'Resolution',
        value: filters.resolution,
        displayValue: filters.resolution.join(', '),
      });
    }

    if (filters.connectivity.length > 0) {
      filtersArray.push({
        id: 'connectivity',
        label: 'Connectivity',
        value: filters.connectivity,
        displayValue: filters.connectivity.join(', '),
      });
    }

    if (filters.color.length > 0) {
      filtersArray.push({
        id: 'color',
        label: 'Color',
        value: filters.color,
        displayValue: filters.color.join(', '),
      });
    }

    if (filters.shippedFrom.length > 0) {
      const locationLabels = filters.shippedFrom.map(loc => {
        const option = electronicsTabs.find(t => t.id === 'shippedFrom')?.options?.find(o => o.value === loc);
        return option?.label || loc;
      });
      filtersArray.push({
        id: 'shippedFrom',
        label: 'Shipped From',
        value: filters.shippedFrom,
        displayValue: locationLabels.join(', '),
      });
    }

    if (filters.warranty) {
      filtersArray.push({
        id: 'warranty',
        label: 'Warranty',
        value: true,
        displayValue: 'Included',
      });
    }

    if (filters.freeShipping) {
      filtersArray.push({
        id: 'freeShipping',
        label: 'Shipping',
        value: true,
        displayValue: 'Free',
      });
    }

    if (filters.onSale) {
      filtersArray.push({
        id: 'onSale',
        label: 'Sale',
        value: true,
        displayValue: 'On Sale',
      });
    }

    if (filters.freeReturns) {
      filtersArray.push({
        id: 'freeReturns',
        label: 'Returns',
        value: true,
        displayValue: 'Free Returns',
      });
    }

    if (filters.newArrivals) {
      filtersArray.push({
        id: 'newArrivals',
        label: 'New Arrivals',
        value: true,
        displayValue: 'Yes',
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
      icon: <Chip className="w-6 h-6" />
    },
    {
      id: 'smartphones',
      name: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
      textColor: 'text-white',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'laptops',
      name: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-700/20 to-gray-800/20',
      textColor: 'text-white',
      icon: <Laptop className="w-6 h-6" />
    },
    {
      id: 'headphones',
      name: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
      textColor: 'text-white',
      icon: <Headphones className="w-6 h-6" />
    },
    {
      id: 'tvs',
      name: 'TVs',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      textColor: 'text-white',
      icon: <Tv className="w-6 h-6" />
    },
    {
      id: 'smartwatches',
      name: 'Smart Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20',
      textColor: 'text-white',
      icon: <Watch className="w-6 h-6" />
    },
    {
      id: 'cameras',
      name: 'Cameras',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/20',
      textColor: 'text-white',
      icon: <Camera className="w-6 h-6" />
    },
    {
      id: 'gaming',
      name: 'Gaming',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-white',
      icon: <Gamepad2 className="w-6 h-6" />
    },
    {
      id: 'speakers',
      name: 'Speakers',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
      textColor: 'text-white',
      icon: <Speaker className="w-6 h-6" />
    },
    {
      id: 'tablets',
      name: 'Tablets',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-600/20',
      textColor: 'text-white',
      icon: <Tablet className="w-6 h-6" />
    },
    {
      id: 'accessories',
      name: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-600/20',
      textColor: 'text-white',
      icon: <Cable className="w-6 h-6" />
    },
    {
      id: 'drones',
      name: 'Drones',
      imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-rose-500/20 to-rose-600/20',
      textColor: 'text-white',
      icon: <Radio className="w-6 h-6" />
    },
    {
      id: 'home_automation',
      name: 'Smart Home',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
      textColor: 'text-white',
      icon: <Home className="w-6 h-6" />
    },
    {
      id: 'monitors',
      name: 'Monitors',
      imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
      textColor: 'text-white',
      icon: <Display className="w-6 h-6" />
    },
    {
      id: 'storage',
      name: 'Storage',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-lime-500/20 to-lime-600/20',
      textColor: 'text-white',
      icon: <HardDrive className="w-6 h-6" />
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const subcategoryFilters: Partial<ElectronicsFilters> = {};
    
    switch (channelId) {
      case 'smartphones':
        subcategoryFilters.screenSize = ['5_6', '6_7'];
        subcategoryFilters.connectivity = ['5g', 'bluetooth5'];
        break;
      case 'laptops':
        subcategoryFilters.processor = ['i5', 'i7', 'ryzen5', 'ryzen7', 'm1', 'm2'];
        subcategoryFilters.ram = ['8gb', '16gb'];
        break;
      case 'gaming':
        subcategoryFilters.processor = ['i7', 'i9', 'ryzen7', 'ryzen9'];
        subcategoryFilters.ram = ['16gb', '32gb'];
        subcategoryFilters.resolution = ['1080p', '1440p', '4k'];
        break;
      case 'headphones':
        subcategoryFilters.connectivity = ['bluetooth5'];
        break;
      case 'monitors':
        subcategoryFilters.resolution = ['1080p', '1440p', '4k'];
        subcategoryFilters.screenSize = ['24_27', '32_40'];
        break;
      default:
        // No additional filters for other categories
        break;
    }
    
    return subcategoryFilters;
  };

  return {
    electronicsChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions to access filter values
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