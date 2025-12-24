import { useState, useMemo } from "react";
import { FilterTab, ActiveFilter } from "@/components/FilterTabs";

export interface BooksFilters {
  sortBy: string;
  freeShipping: boolean;
  freeReturns: boolean;
  onSale: boolean;
  newArrivals: boolean;
  rating: number | null;
  priceRange: { min: number; max: number } | null;
  shippedFrom: string | null;
  format: string | null;
  language: string | null;
  author: string | null;
  publisher: string | null;
  condition: string | null;
  bestseller: boolean;
  awardWinning: boolean;
}

export const useBooksFilters = () => {
  const [filters, setFilters] = useState<BooksFilters>({
    sortBy: 'popular',
    freeShipping: false,
    freeReturns: false,
    onSale: false,
    newArrivals: false,
    rating: null,
    priceRange: null,
    shippedFrom: null,
    format: null,
    language: null,
    author: null,
    publisher: null,
    condition: null,
    bestseller: false,
    awardWinning: false,
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
        case 'format':
          newFilters.format = null;
          break;
        case 'language':
          newFilters.language = null;
          break;
        case 'author':
          newFilters.author = null;
          break;
        case 'publisher':
          newFilters.publisher = null;
          break;
        case 'condition':
          newFilters.condition = null;
          break;
        case 'bestseller':
          newFilters.bestseller = false;
          break;
        case 'awardWinning':
          newFilters.awardWinning = false;
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
      format: null,
      language: null,
      author: null,
      publisher: null,
      condition: null,
      bestseller: false,
      awardWinning: false,
    });
  };

  const booksTabs: FilterTab[] = useMemo(() => {
    return [
      {
        id: 'priceRange',
        label: 'Price',
        type: 'dropdown' as const,
        value: filters.priceRange,
        options: [
          { label: 'Any Price', value: null },
          { label: 'Under $10', value: { min: 0, max: 10 } },
          { label: '$10 - $20', value: { min: 10, max: 20 } },
          { label: '$20 - $30', value: { min: 20, max: 30 } },
          { label: '$30 - $50', value: { min: 30, max: 50 } },
          { label: 'Over $50', value: { min: 50, max: 200 } },
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
        id: 'bestseller',
        label: 'Bestseller',
        type: 'checkbox' as const,
        value: filters.bestseller,
      },
      {
        id: 'awardWinning',
        label: 'Award Winning',
        type: 'checkbox' as const,
        value: filters.awardWinning,
      },
      {
        id: 'format',
        label: 'Format',
        type: 'dropdown' as const,
        value: filters.format,
        options: [
          { label: 'All Formats', value: null },
          { label: 'Paperback', value: 'paperback' },
          { label: 'Hardcover', value: 'hardcover' },
          { label: 'Ebook', value: 'ebook' },
          { label: 'Audiobook', value: 'audiobook' },
          { label: 'Digital', value: 'digital' },
        ],
      },
      {
        id: 'condition',
        label: 'Condition',
        type: 'dropdown' as const,
        value: filters.condition,
        options: [
          { label: 'Any Condition', value: null },
          { label: 'New', value: 'new' },
          { label: 'Like New', value: 'like-new' },
          { label: 'Very Good', value: 'very-good' },
          { label: 'Good', value: 'good' },
          { label: 'Acceptable', value: 'acceptable' },
        ],
      },
      {
        id: 'language',
        label: 'Language',
        type: 'dropdown' as const,
        value: filters.language,
        options: [
          { label: 'All Languages', value: null },
          { label: 'English', value: 'english' },
          { label: 'Spanish', value: 'spanish' },
          { label: 'French', value: 'french' },
          { label: 'German', value: 'german' },
          { label: 'Chinese', value: 'chinese' },
          { label: 'Japanese', value: 'japanese' },
          { label: 'Korean', value: 'korean' },
        ],
      },
      {
        id: 'author',
        label: 'Author',
        type: 'dropdown' as const,
        value: filters.author,
        options: [
          { label: 'All Authors', value: null },
          { label: 'Stephen King', value: 'stephen-king' },
          { label: 'J.K. Rowling', value: 'jk-rowling' },
          { label: 'George R.R. Martin', value: 'george-martin' },
          { label: 'James Patterson', value: 'james-patterson' },
          { label: 'Dan Brown', value: 'dan-brown' },
          { label: 'John Grisham', value: 'john-grisham' },
          { label: 'Nora Roberts', value: 'nora-roberts' },
          { label: 'Margaret Atwood', value: 'margaret-atwood' },
          { label: 'Toni Morrison', value: 'toni-morrison' },
        ],
      },
      {
        id: 'publisher',
        label: 'Publisher',
        type: 'dropdown' as const,
        value: filters.publisher,
        options: [
          { label: 'All Publishers', value: null },
          { label: 'Penguin Random House', value: 'penguin' },
          { label: 'HarperCollins', value: 'harpercollins' },
          { label: 'Simon & Schuster', value: 'simon-schuster' },
          { label: 'Hachette', value: 'hachette' },
          { label: 'Macmillan', value: 'macmillan' },
          { label: 'Scholastic', value: 'scholastic' },
          { label: 'Oxford University Press', value: 'oxford' },
          { label: 'Cambridge University Press', value: 'cambridge' },
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
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Canada', value: 'canada' },
          { label: 'Australia', value: 'australia' },
          { label: 'India', value: 'india' },
          { label: 'China', value: 'china' },
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
      { id: 'bestseller', label: 'Bestseller', displayValue: 'Bestseller', value: filters.bestseller },
      { id: 'awardWinning', label: 'Award', displayValue: 'Award Winning', value: filters.awardWinning },
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
      { id: 'format', label: 'Format', value: filters.format },
      { id: 'language', label: 'Language', value: filters.language },
      { id: 'author', label: 'Author', value: filters.author },
      { id: 'publisher', label: 'Publisher', value: filters.publisher },
      { id: 'condition', label: 'Condition', value: filters.condition },
    ];

    dropdownFilters.forEach(filter => {
      if (filter.value !== null) {
        let displayValue = '';
        
        if (filter.id === 'priceRange' && filter.value) {
          displayValue = `$${filter.value.min} - $${filter.value.max}`;
        } else if (filter.id === 'rating' && filter.value) {
          displayValue = `${filter.value}+ Stars`;
        } else {
          const tab = booksTabs.find(t => t.id === filter.id);
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
  }, [filters, booksTabs]);

  return {
    filters,
    setFilters,
    booksTabs,
    activeFilters,
    handleTabChange,
    handleRemoveFilter,
    handleClearAll,
  };
};

export const useBooksData = () => {
  const bookChannels = useMemo(() => [
    {
      id: 'all',
      name: 'All Books',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      id: 'fiction',
      name: 'Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'non-fiction',
      name: 'Non-Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'science-fiction',
      name: 'Science Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'mystery-thriller',
      name: 'Mystery & Thriller',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    },
    {
      id: 'romance',
      name: 'Romance',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      id: 'biography',
      name: 'Biography',
      imageUrl: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-brown-50',
      textColor: 'text-brown-600'
    },
    {
      id: 'self-help',
      name: 'Self-Help',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      id: 'history',
      name: 'History',
      imageUrl: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'science',
      name: 'Science',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      id: 'children',
      name: "Children's",
      imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'young-adult',
      name: 'Young Adult',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'cookbooks',
      name: 'Cookbooks',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    {
      id: 'poetry',
      name: 'Poetry',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    {
      id: 'graphic-novels',
      name: 'Graphic Novels',
      imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=200&fit=crop&crop=center',
      bgColor: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-600'
    }
  ], []);

  const getSubcategoryFilters = (channelId: string) => {
    const filters: Record<string, any> = {};
    
    switch(channelId) {
      case 'fiction':
        filters.category = 'fiction';
        filters.format = ['paperback', 'hardcover', 'ebook'];
        filters.language = 'english';
        break;
      case 'non-fiction':
        filters.category = 'non-fiction';
        filters.format = ['hardcover', 'paperback'];
        filters.condition = 'new';
        break;
      case 'fantasy':
        filters.category = 'fantasy';
        filters.format = ['hardcover', 'paperback', 'ebook'];
        filters.bestseller = true;
        break;
      case 'science-fiction':
        filters.category = 'science-fiction';
        filters.format = ['paperback', 'ebook'];
        filters.author = ['george-martin', 'stephen-king'];
        break;
      case 'mystery-thriller':
        filters.category = 'mystery-thriller';
        filters.author = ['dan-brown', 'john-grisham', 'james-patterson'];
        filters.format = ['paperback'];
        break;
      case 'romance':
        filters.category = 'romance';
        filters.author = ['nora-roberts'];
        filters.format = ['paperback', 'ebook'];
        break;
      case 'biography':
        filters.category = 'biography';
        filters.format = ['hardcover'];
        filters.condition = 'new';
        break;
      case 'self-help':
        filters.category = 'self-help';
        filters.format = ['paperback', 'audiobook'];
        filters.bestseller = true;
        break;
      case 'history':
        filters.category = 'history';
        filters.format = ['hardcover', 'paperback'];
        filters.publisher = ['oxford', 'cambridge'];
        break;
      case 'science':
        filters.category = 'science';
        filters.format = ['hardcover', 'paperback'];
        filters.publisher = ['oxford', 'cambridge', 'penguin'];
        break;
      case 'children':
        filters.category = 'children';
        filters.format = ['hardcover', 'paperback'];
        filters.publisher = ['scholastic'];
        break;
      case 'young-adult':
        filters.category = 'young-adult';
        filters.format = ['paperback', 'ebook'];
        filters.bestseller = true;
        break;
      case 'cookbooks':
        filters.category = 'cookbooks';
        filters.format = ['hardcover'];
        filters.condition = 'new';
        break;
      case 'poetry':
        filters.category = 'poetry';
        filters.format = ['paperback', 'hardcover'];
        filters.author = ['toni-morrison', 'margaret-atwood'];
        break;
      case 'graphic-novels':
        filters.category = 'graphic-novels';
        filters.format = ['hardcover', 'paperback'];
        filters.condition = 'new';
        break;
      default:
        // For 'all' or other categories, no specific filters
        break;
    }
    
    return filters;
  };

  return {
    bookChannels,
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