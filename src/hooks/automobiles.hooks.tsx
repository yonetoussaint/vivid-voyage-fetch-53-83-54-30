import { useState, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface AutomobilesFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  brand: string | null;
  vehicleType: string | null;
  fuelType: string | null;
  transmission: string | null;
  condition: string | null;
  year: string | null;
  color: string | null;
  certifiedPreOwned: boolean;
  electricVehicle: boolean;
}

export const useAutomobilesFilters = () => {
  const [filters, setFilters] = useState<AutomobilesFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    brand: null,
    vehicleType: null,
    fuelType: null,
    transmission: null,
    condition: null,
    year: null,
    color: null,
    certifiedPreOwned: false,
    electricVehicle: false,
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
        case 'vehicleType':
          newFilters.vehicleType = null;
          break;
        case 'fuelType':
          newFilters.fuelType = null;
          break;
        case 'transmission':
          newFilters.transmission = null;
          break;
        case 'condition':
          newFilters.condition = null;
          break;
        case 'year':
          newFilters.year = null;
          break;
        case 'color':
          newFilters.color = null;
          break;
        case 'certifiedPreOwned':
          newFilters.certifiedPreOwned = false;
          break;
        case 'electricVehicle':
          newFilters.electricVehicle = false;
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
      vehicleType: null,
      fuelType: null,
      transmission: null,
      condition: null,
      year: null,
      color: null,
      certifiedPreOwned: false,
      electricVehicle: false,
    });
  };

  const automobilesTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under $10,000', value: { min: 0, max: 10000 } },
          { label: '$10,000 - $25,000', value: { min: 10000, max: 25000 } },
          { label: '$25,000 - $50,000', value: { min: 25000, max: 50000 } },
          { label: '$50,000 - $100,000', value: { min: 50000, max: 100000 } },
          { label: 'Over $100,000', value: { min: 100000, max: 1000000 } },
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
        id: 'certifiedPreOwned',
        label: 'Certified Pre-Owned',
        type: 'checkbox' as const,
        value: filters.certifiedPreOwned,
      },
      {
        id: 'electricVehicle',
        label: 'Electric Vehicle',
        type: 'checkbox' as const,
        value: filters.electricVehicle,
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'dropdown' as const,
        value: filters.brand,
        options: [
          { label: 'All Brands', value: null },
          { label: 'Toyota', value: 'toyota' },
          { label: 'Honda', value: 'honda' },
          { label: 'Ford', value: 'ford' },
          { label: 'Chevrolet', value: 'chevrolet' },
          { label: 'BMW', value: 'bmw' },
          { label: 'Mercedes-Benz', value: 'mercedes' },
          { label: 'Audi', value: 'audi' },
          { label: 'Tesla', value: 'tesla' },
          { label: 'Hyundai', value: 'hyundai' },
          { label: 'Kia', value: 'kia' },
          { label: 'Nissan', value: 'nissan' },
          { label: 'Volkswagen', value: 'volkswagen' },
          { label: 'Lexus', value: 'lexus' },
          { label: 'Subaru', value: 'subaru' },
        ],
      },
      {
        id: 'vehicleType',
        label: 'Vehicle Type',
        type: 'dropdown' as const,
        value: filters.vehicleType,
        options: [
          { label: 'All Types', value: null },
          { label: 'Sedan', value: 'sedan' },
          { label: 'SUV', value: 'suv' },
          { label: 'Truck', value: 'truck' },
          { label: 'Hatchback', value: 'hatchback' },
          { label: 'Coupe', value: 'coupe' },
          { label: 'Convertible', value: 'convertible' },
          { label: 'Minivan', value: 'minivan' },
          { label: 'Sports Car', value: 'sports-car' },
          { label: 'Electric Car', value: 'electric-car' },
          { label: 'Motorcycle', value: 'motorcycle' },
        ],
      },
      {
        id: 'fuelType',
        label: 'Fuel Type',
        type: 'dropdown' as const,
        value: filters.fuelType,
        options: [
          { label: 'All Fuel Types', value: null },
          { label: 'Gasoline', value: 'gasoline' },
          { label: 'Diesel', value: 'diesel' },
          { label: 'Electric', value: 'electric' },
          { label: 'Hybrid', value: 'hybrid' },
          { label: 'Plug-in Hybrid', value: 'plug-in-hybrid' },
          { label: 'Hydrogen', value: 'hydrogen' },
        ],
      },
      {
        id: 'transmission',
        label: 'Transmission',
        type: 'dropdown' as const,
        value: filters.transmission,
        options: [
          { label: 'All Transmissions', value: null },
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual', value: 'manual' },
          { label: 'CVT', value: 'cvt' },
          { label: 'Semi-Automatic', value: 'semi-automatic' },
        ],
      },
      {
        id: 'condition',
        label: 'Condition',
        type: 'dropdown' as const,
        value: filters.condition,
        options: [
          { label: 'All Conditions', value: null },
          { label: 'New', value: 'new' },
          { label: 'Used', value: 'used' },
          { label: 'Certified Pre-Owned', value: 'certified' },
          { label: 'Demo', value: 'demo' },
        ],
      },
      {
        id: 'year',
        label: 'Year',
        type: 'dropdown' as const,
        value: filters.year,
        options: [
          { label: 'All Years', value: null },
          { label: '2020-2024', value: '2020-2024' },
          { label: '2015-2019', value: '2015-2019' },
          { label: '2010-2014', value: '2010-2014' },
          { label: '2005-2009', value: '2005-2009' },
          { label: 'Before 2005', value: 'before-2005' },
        ],
      },
      {
        id: 'color',
        label: 'Color',
        type: 'dropdown' as const,
        value: filters.color,
        options: [
          { label: 'All Colors', value: null },
          { label: 'White', value: 'white' },
          { label: 'Black', value: 'black' },
          { label: 'Gray', value: 'gray' },
          { label: 'Silver', value: 'silver' },
          { label: 'Blue', value: 'blue' },
          { label: 'Red', value: 'red' },
          { label: 'Green', value: 'green' },
          { label: 'Brown', value: 'brown' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Orange', value: 'orange' },
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
          { label: 'Japan', value: 'japan' },
          { label: 'Germany', value: 'germany' },
          { label: 'South Korea', value: 'south-korea' },
          { label: 'China', value: 'china' },
          { label: 'Mexico', value: 'mexico' },
          { label: 'Canada', value: 'canada' },
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
      { id: 'certifiedPreOwned', label: 'Condition', displayValue: 'Certified Pre-Owned', value: filters.certifiedPreOwned },
      { id: 'electricVehicle', label: 'Type', displayValue: 'Electric Vehicle', value: filters.electricVehicle },
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
      { id: 'vehicleType', label: 'Type', value: filters.vehicleType },
      { id: 'fuelType', label: 'Fuel', value: filters.fuelType },
      { id: 'transmission', label: 'Transmission', value: filters.transmission },
      { id: 'condition', label: 'Condition', value: filters.condition },
      { id: 'year', label: 'Year', value: filters.year },
      { id: 'color', label: 'Color', value: filters.color },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `$${filter.value.min.toLocaleString()} - $${filter.value.max.toLocaleString()}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else {
          const tab = automobilesTabs.find(t => t.id === filter.id);
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
  }, [filters, automobilesTabs]);

  return {
    filters,
    setFilters,
    automobilesTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useAutomobilesData = () => {
  const automobilesChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All Vehicles',
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      id: 'sedans',
      name: 'Sedans',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'suvs',
      name: 'SUVs',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'trucks',
      name: 'Trucks',
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'sports-cars',
      name: 'Sports Cars',
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    {
      id: 'electric',
      name: 'Electric',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      imageUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      id: 'motorcycles',
      name: 'Motorcycles',
      imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'convertibles',
      name: 'Convertibles',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'hatchbacks',
      name: 'Hatchbacks',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'minivans',
      name: 'Minivans',
      imageUrl: 'https://images.unsplash.com/photo-1599912027611-8e4e6c6c4c7c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'hybrids',
      name: 'Hybrids',
      imageUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'classic-cars',
      name: 'Classic Cars',
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-brown-50',
      textColor: 'text-brown-600'
    },
    {
      id: 'performance',
      name: 'Performance',
      imageUrl: 'https://images.unsplash.com/photo-1519241047957-2d0c6b0e8c6b?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    {
      id: 'off-road',
      name: 'Off-Road',
      imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'sedans':
        filters.vehicleType = 'sedan';
        filters.brand = ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan'];
        filters.priceRange = { min: 15000, max: 40000 };
        break;
      case 'suvs':
        filters.vehicleType = 'suv';
        filters.brand = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Hyundai'];
        filters.priceRange = { min: 20000, max: 60000 };
        break;
      case 'trucks':
        filters.vehicleType = 'truck';
        filters.brand = ['Ford', 'Chevrolet', 'Toyota', 'Ram'];
        filters.priceRange = { min: 30000, max: 80000 };
        break;
      case 'sports-cars':
        filters.vehicleType = 'sports-car';
        filters.brand = ['Porsche', 'Chevrolet', 'Ford', 'BMW', 'Audi'];
        filters.priceRange = { min: 40000, max: 150000 };
        break;
      case 'electric':
        filters.fuelType = 'electric';
        filters.brand = ['Tesla', 'Ford', 'Chevrolet', 'Hyundai', 'Kia'];
        filters.priceRange = { min: 30000, max: 100000 };
        break;
      case 'luxury':
        filters.brand = ['Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Porsche'];
        filters.priceRange = { min: 50000, max: 200000 };
        break;
      case 'motorcycles':
        filters.vehicleType = 'motorcycle';
        filters.brand = ['Harley-Davidson', 'Honda', 'Yamaha', 'Kawasaki', 'Ducati'];
        filters.priceRange = { min: 5000, max: 30000 };
        break;
      case 'convertibles':
        filters.vehicleType = 'convertible';
        filters.brand = ['BMW', 'Mercedes-Benz', 'Porsche', 'Ford'];
        filters.priceRange = { min: 40000, max: 120000 };
        break;
      case 'hatchbacks':
        filters.vehicleType = 'hatchback';
        filters.brand = ['Volkswagen', 'Honda', 'Toyota', 'Hyundai', 'Mazda'];
        filters.priceRange = { min: 18000, max: 35000 };
        break;
      case 'minivans':
        filters.vehicleType = 'minivan';
        filters.brand = ['Honda', 'Toyota', 'Chrysler', 'Kia'];
        filters.priceRange = { min: 25000, max: 45000 };
        break;
      case 'hybrids':
        filters.fuelType = 'hybrid';
        filters.brand = ['Toyota', 'Honda', 'Ford', 'Hyundai'];
        filters.priceRange = { min: 25000, max: 50000 };
        break;
      case 'classic-cars':
        filters.condition = 'used';
        filters.year = 'before-2005';
        filters.priceRange = { min: 15000, max: 100000 };
        break;
      case 'performance':
        filters.vehicleType = 'sports-car';
        filters.brand = ['Porsche', 'BMW M', 'Mercedes-AMG', 'Audi RS'];
        filters.priceRange = { min: 60000, max: 200000 };
        break;
      case 'off-road':
        filters.vehicleType = 'suv';
        filters.brand = ['Jeep', 'Toyota', 'Ford', 'Land Rover'];
        filters.priceRange = { min: 30000, max: 80000 };
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    automobilesChannels,
    getSubcategoryFilters,
  };
};

// Safe helper functions
export const getPriceRangeDisplay = (priceRange: { min: number; max: number } | null): string => {
  if (!priceRange) return 'Any Price';
  return `$${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}`;
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