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

const SellerMarketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
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

  const campaigns = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      type: 'Discount',
      status: 'Active',
      discount: '25%',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      views: 1250,
      clicks: 89,
      conversions: 23,
      revenue: 1450.50
    },
    {
      id: '2',
      name: 'Free Shipping Weekend',
      type: 'Shipping',
      status: 'Active',
      discount: 'Free Shipping',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      views: 890,
      clicks: 67,
      conversions: 34,
      revenue: 2100.75
    },
    {
      id: '3',
      name: 'Electronics Bundle Deal',
      type: 'Bundle',
      status: 'Scheduled',
      discount: 'Buy 2 Get 1',
      startDate: '2024-01-25',
      endDate: '2024-02-25',
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    },
    {
      id: '4',
      name: 'Customer Loyalty Rewards',
      type: 'Loyalty',
      status: 'Ended',
      discount: '10% Cashback',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Discount': return 'bg-purple-100 text-purple-800';
      case 'Shipping': return 'bg-blue-100 text-blue-800';
      case 'Bundle': return 'bg-orange-100 text-orange-800';
      case 'Loyalty': return 'bg-pink-100 text-pink-800';
      case 'Flash Sale': return 'bg-red-100 text-red-800';
      case 'Welcome': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Infinite scroll logic matching BookGenreFlashDeals
  React.useEffect(() => {
    const handleScroll = () => {
      const currentItems = activeTab === 'campaigns' ? filteredCampaigns : promotions;
      if (displayCount >= currentItems.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, currentItems.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredCampaigns.length, promotions.length, activeTab]);

  // Reset display count when data changes
  React.useEffect(() => {
    setDisplayCount(8);
  }, [filteredCampaigns.length, promotions.length, activeTab]);

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
            variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('campaigns')}
            className="text-xs h-7"
          >
            Campaigns
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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="py-4">
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {filteredCampaigns.slice(0, displayCount).map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-xs text-muted-foreground">{campaign.discount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${getTypeColor(campaign.type)} text-xs`}>
                            {campaign.type}
                          </Badge>
                          <Badge variant="secondary" className={`${getStatusColor(campaign.status)} text-xs`}>
                            {campaign.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-xs font-medium">{campaign.startDate} to {campaign.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="text-xs font-medium text-green-600">${campaign.revenue.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>CTR: {campaign.clicks > 0 ? ((campaign.clicks / campaign.views) * 100).toFixed(1) : '0'}%</span>
                          <span>{campaign.views} views • {campaign.conversions} conversions</span>
                        </div>
                        <Progress 
                          value={campaign.clicks > 0 ? (campaign.clicks / campaign.views) * 100 : 0} 
                          className="h-1.5" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="text-lg font-medium">No campaigns found</div>
              <div className="text-sm mt-1">Try adjusting your search terms or filters</div>
              <Button size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
        </div>
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
                        <Badge variant="secondary" className={`${getTypeColor(promotion.type)} text-xs`}>
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