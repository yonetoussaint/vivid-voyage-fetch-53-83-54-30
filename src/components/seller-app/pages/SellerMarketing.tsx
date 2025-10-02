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

const SellerMarketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
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

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Marketing</h1>
              <p className="text-xs text-muted-foreground">Create and manage campaigns</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">5</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">2,456</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">189</div>
              <div className="text-xs text-muted-foreground">Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">$8,901</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Ended">Ended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3">
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
        <div className="p-3">
          <div className="grid grid-cols-1 gap-3">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
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
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="p-3">
          <div className="grid grid-cols-1 gap-3">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="overflow-hidden">
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
      )}

      {/* Empty State */}
      {activeTab === 'campaigns' && filteredCampaigns.length === 0 && (
        <div className="p-8 text-center">
          <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerMarketing;