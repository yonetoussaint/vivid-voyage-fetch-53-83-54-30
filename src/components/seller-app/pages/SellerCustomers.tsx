import React, { useState } from 'react';
import { 
  MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Eye, Plus,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerCustomers = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('all');

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      totalOrders: 12,
      totalSpent: 1249.99,
      lastOrder: '2024-01-20',
      status: 'Active',
      rating: 4.8,
      joinDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      totalOrders: 8,
      totalSpent: 899.50,
      lastOrder: '2024-01-18',
      status: 'Active',
      rating: 4.6,
      joinDate: '2023-08-22'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Chicago, IL',
      totalOrders: 15,
      totalSpent: 2199.75,
      lastOrder: '2024-01-15',
      status: 'VIP',
      rating: 4.9,
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Houston, TX',
      totalOrders: 3,
      totalSpent: 299.97,
      lastOrder: '2024-01-10',
      status: 'New',
      rating: 4.5,
      joinDate: '2024-01-05'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      location: 'Miami, FL',
      totalOrders: 6,
      totalSpent: 649.94,
      lastOrder: '2023-12-20',
      status: 'Inactive',
      rating: 4.3,
      joinDate: '2023-07-08'
    }
  ];

  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All Status', 'Active', 'VIP', 'New', 'Inactive']
    },
    {
      id: 'orders',
      label: 'Orders',
      options: ['All Orders', '1-5 orders', '6-10 orders', '10+ orders']
    },
    {
      id: 'spending',
      label: 'Spending',
      options: ['All Spending', '$0-$500', '$501-$1000', '$1000+']
    },
    {
      id: 'location',
      label: 'Location',
      options: ['All Locations', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['All Ratings', '4.5+ stars', '4.0+ stars', '3.5+ stars']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFilterSelect = (filterId, option) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const filteredCustomers = customers.filter(customer => {
    // Status filter
    if (selectedFilters.status && selectedFilters.status !== 'All Status') {
      if (customer.status !== selectedFilters.status) return false;
    }

    // Orders filter
    if (selectedFilters.orders && selectedFilters.orders !== 'All Orders') {
      const orders = customer.totalOrders;
      switch (selectedFilters.orders) {
        case '1-5 orders':
          if (orders < 1 || orders > 5) return false;
          break;
        case '6-10 orders':
          if (orders < 6 || orders > 10) return false;
          break;
        case '10+ orders':
          if (orders <= 10) return false;
          break;
      }
    }

    // Spending filter
    if (selectedFilters.spending && selectedFilters.spending !== 'All Spending') {
      const spent = customer.totalSpent;
      switch (selectedFilters.spending) {
        case '$0-$500':
          if (spent < 0 || spent > 500) return false;
          break;
        case '$501-$1000':
          if (spent < 501 || spent > 1000) return false;
          break;
        case '$1000+':
          if (spent <= 1000) return false;
          break;
      }
    }

    // Location filter
    if (selectedFilters.location && selectedFilters.location !== 'All Locations') {
      if (!customer.location.includes(selectedFilters.location)) return false;
    }

    // Rating filter
    if (selectedFilters.rating && selectedFilters.rating !== 'All Ratings') {
      const rating = customer.rating;
      switch (selectedFilters.rating) {
        case '4.5+ stars':
          if (rating < 4.5) return false;
          break;
        case '4.0+ stars':
          if (rating < 4.0) return false;
          break;
        case '3.5+ stars':
          if (rating < 3.5) return false;
          break;
      }
    }

    return true;
  });

  const stats = [
    { value: filteredCustomers.length.toString(), label: 'Showing', color: 'text-blue-600' },
    { value: customers.filter(c => c.status === 'Active').length.toString(), label: 'Active', color: 'text-green-600' },
    { value: customers.filter(c => c.status === 'VIP').length.toString(), label: 'VIP', color: 'text-purple-600' },
    { value: customers.filter(c => c.status === 'New').length.toString(), label: 'New', color: 'text-orange-600' }
  ];

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header & Stats Section */}
      <SellerSummaryHeader
        title="Customers"
        subtitle="Manage your customer relationships"
        stats={stats}
        actionButton={{
          label: 'Add Customer',
          icon: Plus,
          onClick: () => console.log('Add customer clicked')
        }}
      />

      {/* Product Filter Bar */}
      <div className="bg-white border-b">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-orange-800 font-medium">Active filters:</span>
              {Object.entries(selectedFilters).map(([filterId, value]) => (
                <Badge 
                  key={filterId} 
                  variant="secondary" 
                  className="bg-orange-100 text-orange-800 border-orange-200 px-2 py-1"
                >
                  {filterCategories.find(f => f.id === filterId)?.label}: {value}
                  <button
                    onClick={() => handleFilterClear(filterId)}
                    className="ml-1 hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <button
              onClick={handleClearAll}
              className="text-sm text-orange-700 hover:text-orange-800 font-medium flex items-center gap-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Customers Grid */}
      <div className="p-4">
        {filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback className="text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-foreground truncate">{customer.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(customer.status)} border text-xs px-2 py-0`}
                          >
                            {customer.status}
                          </Badge>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-muted-foreground">{customer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <X className="w-4 h-4 mr-2" />
                          Remove Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{customer.location}</span>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="pt-4 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Orders</p>
                        <p className="text-sm font-semibold text-foreground">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spent</p>
                        <p className="text-sm font-semibold text-foreground">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Last Order</p>
                        <p className="text-sm font-semibold text-foreground text-xs">
                          {new Date(customer.lastOrder).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {hasActiveFilters ? 'No customers found' : 'No customers yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters 
                  ? "No customers match your current filters. Try adjusting your filter criteria."
                  : "Get started by adding your first customer to your store."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="h-11">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
                {hasActiveFilters && (
                  <Button variant="outline" size="lg" className="h-11" onClick={handleClearAll}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;