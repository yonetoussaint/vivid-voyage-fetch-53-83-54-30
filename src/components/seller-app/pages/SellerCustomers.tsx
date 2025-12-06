import React, { useState } from 'react';
import { 
  MoreHorizontal, MessageCircle, 
  MapPin,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerCustomers = () => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=100&h=100&fit=crop&crop=face',
      location: 'New York, NY',
      totalOrders: 12,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      totalOrders: 8,
      status: 'Active'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      location: 'Chicago, IL',
      totalOrders: 15,
      status: 'VIP'
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      location: 'Houston, TX',
      totalOrders: 3,
      status: 'New'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      location: 'Miami, FL',
      totalOrders: 6,
      status: 'Active'
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
      id: 'location',
      label: 'Location',
      options: ['All Locations', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami']
    }
  ];

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
    if (selectedFilters.status && selectedFilters.status !== 'All Status') {
      if (customer.status !== selectedFilters.status) return false;
    }

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

    if (selectedFilters.location && selectedFilters.location !== 'All Locations') {
      if (!customer.location.includes(selectedFilters.location)) return false;
    }

    return true;
  });

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Only Filter Bar at Top */}
      <ProductFilterBar
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAll}
      />

      {/* Ultra Clean Customers List with Consistent Padding */}
      <div className="py-2 max-w-6xl mx-auto">
        {filteredCustomers.length > 0 ? (
          <div className="space-y-1">
            {/* List Headers (Desktop) - Aligned with card content */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">
              <div className="col-span-5">Customer</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">Orders</div>
              <div className="col-span-2"></div>
            </div>

            {/* Customers List - Same padding as headers */}
            <div className="space-y-1">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-150 mx-0">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      {/* Customer Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-foreground truncate">{customer.name}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              customer.status === 'VIP' ? 'bg-purple-50 text-purple-700' :
                              customer.status === 'New' ? 'bg-blue-50 text-blue-700' :
                              'bg-green-50 text-green-700'
                            }`}>
                              {customer.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                        </div>
                      </div>

                      {/* Desktop Additional Info */}
                      <div className="hidden md:flex items-center gap-6 flex-1">
                        <div className="min-w-[120px]">
                          <div className="text-sm text-foreground truncate">
                            {customer.location}
                          </div>
                        </div>
                        
                        <div className="min-w-[80px]">
                          <div className="text-sm text-foreground">
                            {customer.totalOrders} orders
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => console.log('Chat with', customer.name)}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => console.log('More options', customer.id)}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Additional Info */}
                    <div className="mt-2 pt-2 border-t border-gray-100 md:hidden">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-foreground flex-1 truncate">
                          {customer.location}
                        </div>
                        
                        <div className="text-sm text-foreground">
                          {customer.totalOrders} orders
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-3">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-sm font-semibold text-foreground mb-1">No customers found</div>
            <div className="text-xs text-muted-foreground mb-4">Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;