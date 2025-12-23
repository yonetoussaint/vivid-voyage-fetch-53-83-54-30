import { useState, useMemo } from "react";
import { 
  Home, Sofa, Lamp, Coffee, Bed, Lightbulb, 
  Package, Bath, Palette, Sparkles, PawPrint, 
  Layers, Ruler, Box, 
  // Alternative icons that should be available
  Star, Heart, ShoppingCart, Truck, CheckCircle,
  Filter, DollarSign, Award, Shield, Leaf,
  Zap, RefreshCw, MapPin, Clock, Users
} from "lucide-react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface HomeLivingFilters {
  sortBy: string;
  freeShipping: boolean;
  onSale: boolean;
  freeReturns: boolean;
  newArrivals: boolean;
  brand: string | null;
  material: string[];
  color: string[];
  roomType: string[];
  priceRange: { min: number; max: number } | null;
  rating: number | null;
  shippedFrom: string[];
  ecoFriendly: boolean;
  assemblyRequired: boolean;
}

export const useHomeLivingFilters = () => {
  const [filters, setFilters] = useState<HomeLivingFilters>({
    sortBy: 'popular',
    freeShipping: false,
    onSale: false,
    freeReturns: false,
    newArrivals: false,
    brand: null,
    material: [],
    color: [],
    roomType: [],
    priceRange: null,
    rating: null,
    shippedFrom: [],
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
        case 'sortBy':
          newFilters.sortBy = 'popular';
          break;
        case 'priceRange':
          newFilters.priceRange = null;
          break;
        case 'brand':
          newFilters.brand = null;
          break;
        case 'material':
          newFilters.material = [];
          break;
        case 'color':
          newFilters.color = [];
          break;
        case 'roomType':
          newFilters.roomType = [];
          break;
        case 'rating':
          newFilters.rating = null;
          break;
        case 'shippedFrom':
          newFilters.shippedFrom = [];
          break;
        case 'ecoFriendly':
          newFilters.ecoFriendly = false;
          break;
        case 'assemblyRequired':
          newFilters.assemblyRequired = false;
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
            material: [],
            color: [],
            roomType: [],
            priceRange: null,
            rating: null,
            shippedFrom: [],
            ecoFriendly: false,
            assemblyRequired: false,
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
      material: [],
      color: [],
      roomType: [],
      priceRange: null,
      rating: null,
      shippedFrom: [],
      ecoFriendly: false,
      assemblyRequired: false,
    });
  };

  const homeLivingTabs: FilterTab[] = useMemo(() => [
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
      icon: <DollarSign className="w-3 h-3" />,
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
      icon: <Award className="w-3 h-3" />,
      options: [
        { label: 'All Brands', value: null },
        { label: 'IKEA', value: 'ikea' },
        { label: 'West Elm', value: 'west_elm' },
        { label: 'Crate & Barrel', value: 'crate_barrel' },
        { label: 'Pottery Barn', value: 'pottery_barn' },
        { label: 'Target', value: 'target' },
        { label: 'Wayfair', value: 'wayfair' },
        { label: 'Ashley', value: 'ashley' },
        { label: 'La-Z-Boy', value: 'la_z_boy' },
        { label: 'Williams Sonoma', value: 'williams_sonoma' },
      ],
    },
    {
      id: 'material',
      label: 'Material',
      type: 'multi-select',
      value: filters.material,
      icon: <Package className="w-3 h-3" />,
      options: [
        { label: 'Wood', value: 'wood' },
        { label: 'Metal', value: 'metal' },
        { label: 'Fabric', value: 'fabric' },
        { label: 'Leather', value: 'leather' },
        { label: 'Glass', value: 'glass' },
        { label: 'Rattan', value: 'rattan' },
        { label: 'Marble', value: 'marble' },
        { label: 'Ceramic', value: 'ceramic' },
        { label: 'Plastic', value: 'plastic' },
        { label: 'Bamboo', value: 'bamboo' },
      ],
    },
    {
      id: 'color',
      label: 'Color',
      type: 'multi-select',
      value: filters.color,
      icon: <Palette className="w-3 h-3" />,
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
        { label: 'Gray', value: 'gray' },
        { label: 'Beige', value: 'beige' },
        { label: 'Brown', value: 'brown' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Multi-color', value: 'multi' },
      ],
    },
    {
      id: 'roomType',
      label: 'Room Type',
      type: 'multi-select',
      value: filters.roomType,
      icon: <Home className="w-3 h-3" />,
      options: [
        { label: 'Living Room', value: 'living_room' },
        { label: 'Bedroom', value: 'bedroom' },
        { label: 'Kitchen', value: 'kitchen' },
        { label: 'Bathroom', value: 'bathroom' },
        { label: 'Dining Room', value: 'dining_room' },
        { label: 'Office', value: 'office' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'Kids Room', value: 'kids_room' },
        { label: 'Entryway', value: 'entryway' },
      ],
    },
    {
      id: 'ecoFriendly',
      label: 'Eco-Friendly',
      type: 'checkbox',
      value: filters.ecoFriendly,
      icon: <Leaf className="w-3 h-3" />,
    },
    {
      id: 'assemblyRequired',
      label: 'Assembly',
      type: 'checkbox',
      value: filters.assemblyRequired,
      icon: <Package className="w-3 h-3" />,
    },
    {
      id: 'warranty',
      label: 'Warranty',
      type: 'checkbox',
      value: filters.freeReturns,
      icon: <Shield className="w-3 h-3" />,
    },
    {
      id: 'freeShipping',
      label: 'Free Shipping',
      type: 'checkbox',
      value: filters.freeShipping,
      icon: <Truck className="w-3 h-3" />,
    },
    {
      id: 'onSale',
      label: 'On Sale',
      type: 'checkbox',
      value: filters.onSale,
      icon: <Zap className="w-3 h-3" />,
    },
    {
      id: 'freeReturns',
      label: 'Free Returns',
      type: 'checkbox',
      value: filters.freeReturns,
      icon: <RefreshCw className="w-3 h-3" />,
    },
    {
      id: 'newArrivals',
      label: 'New Arrivals',
      type: 'checkbox',
      value: filters.newArrivals,
      icon: <Clock className="w-3 h-3" />,
    },
    {
      id: 'shippedFrom',
      label: 'Shipped From',
      type: 'multi-select',
      value: filters.shippedFrom,
      icon: <MapPin className="w-3 h-3" />,
      options: [
        { label: 'United States', value: 'us' },
        { label: 'China', value: 'china' },
        { label: 'Sweden', value: 'sweden' },
        { label: 'Italy', value: 'italy' },
        { label: 'Local Pickup', value: 'local' },
      ],
    },
    {
      id: 'rating',
      label: 'Rating',
      type: 'dropdown',
      value: filters.rating,
      icon: <Star className="w-3 h-3" />,
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
      const sortOption = homeLivingTabs.find(t => t.id === 'sortBy')?.options?.find(o => o.value === filters.sortBy);
      filtersArray.push({
        id: 'sortBy',
        label: 'Sort',
        value: filters.sortBy,
        displayValue: sortOption?.label || filters.sortBy,
      });
    }

    if (filters.priceRange) {
      filtersArray.push({
        id: 'priceRange',
        label: 'Price',
        value: filters.priceRange,
        displayValue: `$${filters.priceRange.min} - $${filters.priceRange.max}`,
      });
    }

    if (filters.brand) {
      const brandOption = homeLivingTabs.find(t => t.id === 'brand')?.options?.find(o => o.value === filters.brand);
      filtersArray.push({
        id: 'brand',
        label: 'Brand',
        value: filters.brand,
        displayValue: brandOption?.label || filters.brand,
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

    if (filters.material.length > 0) {
      filtersArray.push({
        id: 'material',
        label: 'Material',
        value: filters.material,
        displayValue: filters.material.join(', '),
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

    if (filters.roomType.length > 0) {
      filtersArray.push({
        id: 'roomType',
        label: 'Room Type',
        value: filters.roomType,
        displayValue: filters.roomType.join(', '),
      });
    }

    if (filters.shippedFrom.length > 0) {
      const locationLabels = filters.shippedFrom.map(loc => {
        const option = homeLivingTabs.find(t => t.id === 'shippedFrom')?.options?.find(o => o.value === loc);
        return option?.label || loc;
      });
      filtersArray.push({
        id: 'shippedFrom',
        label: 'Shipped From',
        value: filters.shippedFrom,
        displayValue: locationLabels.join(', '),
      });
    }

    if (filters.ecoFriendly) {
      filtersArray.push({
        id: 'ecoFriendly',
        label: 'Eco-Friendly',
        value: true,
        displayValue: 'Yes',
      });
    }

    if (filters.assemblyRequired) {
      filtersArray.push({
        id: 'assemblyRequired',
        label: 'Assembly',
        value: true,
        displayValue: 'Required',
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
      id: 'all',
      name: 'All',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20',
      textColor: 'text-white',
      icon: <Home className="w-6 h-6" />
    },
    {
      id: 'furniture',
      name: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-brown-500/20 to-brown-700/20',
      textColor: 'text-white',
      icon: <Sofa className="w-6 h-6" />
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
      textColor: 'text-white',
      icon: <Palette className="w-6 h-6" />
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      textColor: 'text-white',
      icon: <Coffee className="w-6 h-6" />
    },
    {
      id: 'bedding',
      name: 'Bedding',
      imageUrl: 'https://images.unsplash.com/photo-1586023842181-8b8a5c2a7b3a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      textColor: 'text-white',
      icon: <Bed className="w-6 h-6" />
    },
    {
      id: 'lighting',
      name: 'Lighting',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
      textColor: 'text-white',
      icon: <Lamp className="w-6 h-6" />
    },
    {
      id: 'storage',
      name: 'Storage',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-gray-700/20',
      textColor: 'text-white',
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-600/20',
      textColor: 'text-white',
      icon: <Bath className="w-6 h-6" />
    },
    {
      id: 'garden-outdoor',
      name: 'Garden & Outdoor',
      imageUrl: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
      textColor: 'text-white',
      icon: <Leaf className="w-6 h-6" />
    },
    {
      id: 'rugs',
      name: 'Rugs',
      imageUrl: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
      textColor: 'text-white',
      icon: <Ruler className="w-6 h-6" />
    },
    {
      id: 'curtains-blinds',
      name: 'Curtains & Blinds',
      imageUrl: 'https://images.unsplash.com/photo-1583845112205-95cd8a7d5c5d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-white',
      icon: <Layers className="w-6 h-6" />
    },
    {
      id: 'wall-art',
      name: 'Wall Art',
      imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-600/20',
      textColor: 'text-white',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'smart-home',
      name: 'Smart Home',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
      textColor: 'text-white',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      id: 'pet-supplies',
      name: 'Pet Supplies',
      imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
      textColor: 'text-white',
      icon: <PawPrint className="w-6 h-6" />
    },
    {
      id: 'organization',
      name: 'Organization',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-98f1d9c6f8d9?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
      textColor: 'text-white',
      icon: <Box className="w-6 h-6" />
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const subcategoryFilters: Partial<HomeLivingFilters> = {};
    
    switch (channelId) {
      case 'furniture':
        subcategoryFilters.roomType = ['living_room', 'bedroom', 'dining_room'];
        subcategoryFilters.material = ['wood', 'fabric', 'leather'];
        break;
      case 'kitchen':
        subcategoryFilters.roomType = ['kitchen'];
        subcategoryFilters.material = ['metal', 'glass', 'ceramic'];
        break;
      case 'bedding':
        subcategoryFilters.roomType = ['bedroom'];
        subcategoryFilters.material = ['fabric'];
        break;
      case 'garden-outdoor':
        subcategoryFilters.roomType = ['outdoor'];
        subcategoryFilters.material = ['rattan', 'metal', 'plastic'];
        break;
      case 'eco-friendly':
        subcategoryFilters.ecoFriendly = true;
        subcategoryFilters.material = ['bamboo', 'rattan'];
        break;
    }
    
    return subcategoryFilters;
  };

  return {
    homeLivingChannels,
    getSubcategoryFilters,
  };
};