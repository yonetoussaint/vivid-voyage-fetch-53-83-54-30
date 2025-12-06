import React, { useState } from 'react';
import { 
  MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Eye, Plus,
  X, DollarSign, Package, Calendar, User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerCustomers = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [displayCount, setDisplayCount] = useState(8);

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York',
      totalOrders: 12,
      totalSpent: 1249.99,
      lastOrder: 'Jan 20',
      status: 'Active',
      rating: 4.8,
      joinDate: 'Jun 2023'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles',
      totalOrders: 8,
      totalSpent: 899.50,
      lastOrder: 'Jan 18',
      status: 'Active',
      rating: 4.6,
      joinDate: 'Aug 2023'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago',
      totalOrders: 15,
      totalSpent: 2199.75,
      lastOrder: 'Jan 15',
      status: 'VIP',
      rating: 4.9,
      joinDate: 'Mar 2023'
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston',
      totalOrders: 3,
      totalSpent: 299.97,
      lastOrder: 'Jan 10',
      status: 'New',
      rating: 4.5,
      joinDate: 'Jan 2024'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Miami',
      totalOrders: 6,
      totalSpent: 649.94,
      lastOrder: 'Dec 20',
      status: 'Inactive',
      rating: 4.3,
      joinDate: 'Jul 2023'
    }
  ];

  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All', 'Active', 'VIP', 'New', 'Inactive']
    },
    {
      id: 'orders',
      label: 'Orders',
      options: ['All', '1-5', '6-10', '10+']
    },
    {
      id: 'spending',
      label: 'Spending',
      options: ['All', '$0-$500', '$501-$1k', '$1k+']
    },
    {
      id: 'location',
      label: 'Location',
      options: ['All', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['All', '4.5+', '4.0+', '3.5+']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Active': return 'bg-green-50 text-green-700 border-green-200';
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Inactive': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
    if (selectedFilters.status && selectedFilters.status !== 'All') {
      if (customer.status !== selectedFilters.status) return false;
    }

    if (selectedFilters.orders && selectedFilters.orders !== 'All') {
      const orders = customer.totalOrders;
      switch (selectedFilters.orders) {
        case '1-5':
          if (orders < 1 || orders > 5) return false;
          break;
        case '6-10':
          if (orders < 6 || orders > 10) return false;
          break;
        case '10+':
          if (orders <= 10) return false;
          break;
      }
    }

    if (selectedFilters.spending && selectedFilters.spending !== 'All') {
      const spent = customer.totalSpent;
      switch (selectedFilters.spending) {
        case '$0-$500':
          if (spent < 0 || spent > 500) return false;
          break;
        case '$501-$1k':
          if (spent < 501 || spent > 1000) return false;
          break;
        case '$1k+':
          if (spent <= 1000) return false;
          break;
      }
    }

    if (selectedFilters.location && selectedFilters.location !== 'All') {
      if (!customer.location.includes(selectedFilters.location)) return false;
    }

    if (selectedFilters.rating && selectedFilters.rating !== 'All') {
      const rating = customer.rating;
      switch (selectedFilters.rating) {
        case '4.5+':
          if (rating < 4.5) return false;
          break;
        case '4.0+':
          if (rating < 4.0) return false;
          break;
        case '3.5+':
          if (rating < 3.5) return false;
          break;
      }
    }

    return true;
  });

  const stats = [
    { value: filteredCustomers.length.toString(), label: 'Showing', color: 'text-blue-600', icon: User },
    { value: customers.filter(c => c.status === 'Active').length.toString(), label: 'Active', color: 'text-green-600', icon: User },
    { value: customers.filter(c => c.status === 'VIP').length.toString(), label: 'VIP', color: 'text-purple-600', icon: Star },
    { value: customers.filter(c => c.status === 'New').length.toString(), label: 'New', color: 'text-orange-600', icon: User }
  ];

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= filteredCustomers.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setDisplayCount(prev => Math.min(prev + 8, filteredCustomers.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredCustomers.length]);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <SellerSummaryHeader
          title="Customers"
          subtitle="Manage your customers"
          stats={stats}
          actionButton={{
            label: 'New',
            icon: Plus,
            onClick: () => console.log('Add customer')
          }}
        />
      </div>

      {/* Filter Bar */}
      <ProductFilterBar
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAll}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-orange-50 border-y border-orange-200 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {Object.entries(selectedFilters).map(([filterId, value]) => (
                <Badge 
                  key={filterId} 
                  variant="secondary" 
                  className="bg-orange-100 text-orange-700 border-orange-200 px-2 py-0.5 text-xs h-6"
                >
                  {value}
                  <button
                    onClick={() => handleFilterClear(filterId)}
                    className="ml-1 hover:text-orange-800"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs text-orange-700 hover:text-orange-800 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Ultra Compact Customers List */}
      <div className="py-2 px-2 md:px-3 max-w-6xl mx-auto">
        {filteredCustomers.length > 0 ? (
          <div className="space-y-1.5">
            {/* Compact Headers (Desktop only) */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide bg-gray-50 rounded">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Orders</div>
              <div className="col-span-2">Spent</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Ultra Compact Customer Cards */}
            <div className="space-y-1.5">
              {filteredCustomers.slice(0, displayCount).map((customer) => (
                <Card key={customer.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-150 hover:shadow-xs">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Customer Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Customer Avatar/Initials */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-700">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-semibold text-sm text-foreground truncate">{customer.name}</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-muted-foreground">{customer.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Details (Desktop only) */}
                      <div className="hidden md:flex items-center gap-4 flex-1">
                        <div className="min-w-[100px]">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{customer.phone}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground min-w-[60px]">
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {customer.totalOrders} orders
                          </div>
                        </div>
                      </div>

                      {/* Right: Stats & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Total Spent */}
                        <div className="text-right min-w-[80px] hidden md:block">
                          <div className="flex items-center gap-0.5 justify-end">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="font-bold text-sm text-foreground">${customer.totalSpent.toFixed(0)}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">total spent</div>
                        </div>

                        {/* Status */}
                        <div className="min-w-[70px]">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(customer.status)} px-1.5 py-0 text-[11px] font-medium h-5`}
                          >
                            {customer.status}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => console.log('View customer', customer.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Details Row */}
                    <div className="mt-2 pt-2 border-t border-gray-100 md:hidden">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {customer.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Package className="w-3 h-3" />
                            {customer.totalOrders}
                          </div>
                          <div className="flex items-center gap-0.5 text-xs font-medium text-foreground">
                            <DollarSign className="w-3 h-3" />
                            ${customer.totalSpent.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {displayCount < filteredCustomers.length && (
              <div className="text-center py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDisplayCount(prev => Math.min(prev + 8, filteredCustomers.length))}
                  className="text-xs text-muted-foreground hover:text-foreground h-8"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-sm font-semibold text-foreground mb-1">
              {hasActiveFilters ? 'No customers found' : 'No customers yet'}
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              {hasActiveFilters 
                ? "Try adjusting your filter criteria"
                : "Get started by adding your first customer"
              }
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button size="sm" className="h-9 px-4 text-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Customer
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="h-9 px-4 text-sm" onClick={handleClearAll}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;