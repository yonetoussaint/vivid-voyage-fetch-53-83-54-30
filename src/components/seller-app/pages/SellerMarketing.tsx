import React, { useState } from 'react';
import {
  Megaphone, Plus, Gift, Edit, Share2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

const SellerMarketing = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [displayCount, setDisplayCount] = useState(8);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All', 'Active', 'Scheduled', 'Ended', 'Paused']
    },
    {
      id: 'type',
      label: 'Type',
      options: ['All', 'Discount', 'Shipping', 'Bundle', 'Loyalty', 'Flash Sale', 'Welcome']
    },
    {
      id: 'performance',
      label: 'Performance',
      options: ['All', 'High Performing', 'Medium', 'Low']
    },
    {
      id: 'duration',
      label: 'Duration',
      options: ['All', 'Active Now', 'Upcoming', 'Ended']
    }
  ];

  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  // Campaign products data (same as before)
  const campaignProducts = [
    {
      id: '1',
      name: 'Holiday Sale 2025',
      price: 100,
      discount_price: 75,
      product_images: [{ src: 'https://placehold.co/300x300?text=Holiday+Sale' }],
      inventory: 1250,
      category: 'Discount',
      status: 'Active',
      type: 'Discount',
      startDate: '2025-11-01',
      endDate: '2025-12-31',
      expiry: '2025-12-31T23:59:59',
      views: 1250,
      clicks: 89,
      conversions: 23,
      revenue: 1450.50
    },
    // ... other products
  ];

  // Promotions data (same as before)
  const promotions = [
    // ... promotions data
  ];

  const stats = [
    { value: '5', label: 'Active', color: 'text-blue-600' },
    { value: '2,456', label: 'Clicks', color: 'text-green-600' },
    { value: '189', label: 'Conversions', color: 'text-purple-600' },
    { value: '$8,901', label: 'Revenue', color: 'text-orange-600' }
  ];

  return (
    <div className="w-full bg-white">
      <SellerSummaryHeader
        title="Marketing"
        subtitle="Create and manage campaigns"
        stats={stats}
        actionButton={{
          label: 'Create',
          icon: Plus,
          onClick: () => console.log('Create clicked')
        }}
        showStats={true}
      />

      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

      <div className="py-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('products')}
            className="text-xs h-7"
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'promotions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('promotions')}
            className="text-xs h-7"
          >
            Promotions
          </Button>
        </div>
      </div>

      {activeTab === 'products' && (
        <BookGenreFlashDeals
          products={campaignProducts}
          title="Marketing Campaigns"
          subtitle="Manage your marketing campaigns and promotions"
          showSectionHeader={false}
          showSummary={false}
          showFilters={false}
          className="marketing-campaigns"
          showExpiryTimer={true}
          expiryField="expiry"
          showMarketingMetrics={true}
          showStatusBadge={true}
        />
      )}

      {activeTab === 'promotions' && (
        <div className="py-4">
          {/* Promotions tab content remains the same */}
        </div>
      )}
    </div>
  );
};

export default SellerMarketing;