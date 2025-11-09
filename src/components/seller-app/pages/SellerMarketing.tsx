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

  // Campaign products data
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
    {
      id: '2',
      name: 'Black Friday Free Shipping',
      price: 50,
      discount_price: 0,
      product_images: [{ src: 'https://placehold.co/300x300?text=Free+Shipping' }],
      inventory: 890,
      category: 'Shipping',
      status: 'Active',
      type: 'Shipping',
      startDate: '2025-11-25',
      endDate: '2025-11-30',
      expiry: '2025-11-30T23:59:59',
      views: 890,
      clicks: 67,
      conversions: 34,
      revenue: 2100.75
    },
    {
      id: '3',
      name: 'New Year Electronics Bundle',
      price: 200,
      discount_price: 150,
      product_images: [{ src: 'https://placehold.co/300x300?text=Bundle+Deal' }],
      inventory: 0,
      category: 'Bundle',
      status: 'Scheduled',
      type: 'Bundle',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      expiry: '2026-01-31T23:59:59',
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    },
    {
      id: '4',
      name: 'Customer Loyalty Rewards 2025',
      price: 100,
      discount_price: 90,
      product_images: [{ src: 'https://placehold.co/300x300?text=Loyalty' }],
      inventory: 0,
      category: 'Loyalty',
      status: 'Ended',
      type: 'Loyalty',
      startDate: '2025-09-01',
      endDate: '2025-10-01',
      expiry: '2025-10-01T23:59:59',
      views: 2100,
      clicks: 156,
      conversions: 78,
      revenue: 3250.25
    }
  ];

  // Promotions data
  const promotions = [
    {
      id: '1',
      title: 'Flash Sale - Wireless Earbuds',
      description: 'Limited time offer on premium wireless earbuds',
      type: 'Flash Sale',
      discount: '40%',
      expiry: '2025-11-30',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Bundle Deal - Smart Home Kit',
      description: 'Complete smart home setup at unbeatable price',
      type: 'Bundle',
      discount: 'Save $150',
      expiry: '2026-01-15',
      status: 'Scheduled'
    },
    {
      id: '3',
      title: 'New Customer Welcome',
      description: 'Special discount for first-time buyers',
      type: 'Welcome',
      discount: '15%',
      expiry: 'Ongoing',
      status: 'Active'
    }
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
          {promotions.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {promotions.slice(0, displayCount).map((promotion) => (
                  <Card key={promotion.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{promotion.title}</h3>
                          <p className="text-xs text-muted-foreground">{promotion.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                          {promotion.type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Discount</p>
                          <p className="text-xs font-medium text-green-600">{promotion.discount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expires</p>
                          <p className="text-xs font-medium">{promotion.expiry}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="text-lg font-medium">No promotions found</div>
              <div className="text-sm mt-1">Create your first promotion to get started</div>
              <Button size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerMarketing;