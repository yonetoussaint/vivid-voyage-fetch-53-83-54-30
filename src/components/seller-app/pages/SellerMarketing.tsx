import React, { useState } from 'react';
import { 
  Megaphone, Mail, Users, TrendingUp, 
  Plus, Eye, Edit, Calendar, Target, 
  BarChart3, Share2, Gift, Zap, Filter, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

const SellerMarketing = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(8);

  // Add filter state matching BookGenreFlashDeals
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Define filter categories matching BookGenreFlashDeals structure
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

  // Filter handler functions matching BookGenreFlashDeals
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

  // Mock campaigns data formatted as products for BookGenreFlashDeals
  const campaignProducts = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      price: 100,
      discount_price: 75,
      product_images: [{ src: 'https://placehold.co/300x300?text=Summer+Sale' }],
      inventory: 1250,
      category: 'Discount',
      status: 'Active',
      type: 'Discount',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      expiry: '2024-02-15',
      views: 1250,
      clicks: 89,
      conversions: 23,
      revenue: 1450.50
    },
    {
      id: '2',
      name: 'Free Shipping Weekend',
      price: 50,
      discount_price: 0,
      product_images: [{ src: 'https://placehold.co/300x300?text=Free+Shipping' }],
      inventory: 890,
      category: 'Shipping',
      status: 'Active',
      type: 'Shipping',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      expiry: '2024-01-22',
      views: 890,
      clicks: 67,
      conversions: 34,
      revenue: 2100.75
    },
    {
      id: '3',
      name: 'Electronics Bundle Deal',
      price: 200,
      discount_price: 150,
      product_images: [{ src: 'https://placehold.co/300x300?text=Bundle+Deal' }],
      inventory: 0,
      category: 'Bundle',
      status: 'Scheduled',
      type: 'Bundle',
      startDate: '2024-01-25',
      endDate: '2024-02-25',
      expiry: '2024-02-25',
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    },
    {
      id: '4',
      name: 'Customer Loyalty Rewards',
      price: 100,
      discount_price: 90,
      product_images: [{ src: 'https://placehold.co/300x300?text=Loyalty' }],
      inventory: 0,
      category: 'Loyalty',
      status: 'Ended',
      type: 'Loyalty',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      expiry: '2024-01-14',
      views: 2100,
      clicks: 156,
      conversions: 78,
      revenue: 3250.25
    }
  ];

  const promotions = [
    {
      id: '1',
      title: 'Flash Sale - Wireless Earbuds',
      description: 'Limited time offer on premium wireless earbuds',
      type: 'Flash Sale',
      discount: '40%',
      expiry: '2024-01-22',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Bundle Deal - Smart Home Kit',
      description: 'Complete smart home setup at unbeatable price',
      type: 'Bundle',
      discount: 'Save $150',
      expiry: '2024-01-30',
      status: 'Active'
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
    {
      value: '5',
      label: 'Active',
      color: 'text-blue-600'
    },
    {
      value: '2,456',
      label: 'Clicks',
      color: 'text-green-600'
    },
    {
      value: '189',
      label: 'Conversions',
      color: 'text-purple-600'
    },
    {
      value: '$8,901',
      label: 'Revenue',
      color: 'text-orange-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header & Stats Section - Same structure as BookGenreFlashDeals */}
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

      {/* Filter Bar Section - Same as BookGenreFlashDeals */}
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

      {/* Tabs */}
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

      {/* Products Tab - Using Customized BookGenreFlashDeals */}
      {activeTab === 'products' && (
        <BookGenreFlashDeals
          products={campaignProducts}
          title="Marketing Campaigns"
          subtitle="Manage your marketing campaigns and promotions"
          showSectionHeader={false}
          showSummary={false}
          showFilters={false}
          className="marketing-campaigns"
          // Custom render function - REMOVED the campaign type badge
          customProductRender={(product: any) => (
            <div className="relative">
              {/* Expiry Date Badge */}
              {product.expiry && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 font-medium z-10 rounded">
                  Expires: {new Date(product.expiry).toLocaleDateString()}
                </div>
              )}

              {/* Campaign Status Badge */}
              <div className="absolute top-2 left-2 z-10">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(product.status)} text-xs`}
                >
                  {product.status}
                </Badge>
              </div>

              {/* REMOVED: Campaign Type Badge (bundle, discount, shipping, loyalty) */}
            </div>
          )}
          // Additional campaign metrics in product info
          customProductInfo={(product: any) => (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Views: {product.views}</span>
                <span>Clicks: {product.clicks}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Conversions: {product.conversions}</span>
                <span className="text-green-600 font-medium">
                  ${product.revenue?.toFixed(2)}
                </span>
              </div>
              {product.clicks > 0 && (
                <div className="mt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>CTR: {((product.clicks / product.views) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={product.clicks > 0 ? (product.clicks / product.views) * 100 : 0} 
                    className="h-1.5" 
                  />
                </div>
              )}
            </div>
          )}
        />
      )}

      {/* Promotions Tab */}
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