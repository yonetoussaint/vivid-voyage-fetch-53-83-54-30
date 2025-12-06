import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Star, 
  Plus, Eye, MoreHorizontal,
  Package, DollarSign, User, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SellerCustomers = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState({});

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      location: 'NY',
      orders: 12,
      spent: 1249.99,
      lastOrder: 'Jan 20',
      status: 'Active',
      rating: 4.8,
      joined: 'Jun 23'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '(555) 234-5678',
      location: 'LA',
      orders: 8,
      spent: 899.50,
      lastOrder: 'Jan 18',
      status: 'Active',
      rating: 4.6,
      joined: 'Aug 23'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '(555) 345-6789',
      location: 'CHI',
      orders: 15,
      spent: 2199.75,
      lastOrder: 'Jan 15',
      status: 'VIP',
      rating: 4.9,
      joined: 'Mar 23'
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '(555) 456-7890',
      location: 'TX',
      orders: 3,
      spent: 299.97,
      lastOrder: 'Jan 10',
      status: 'New',
      rating: 4.5,
      joined: 'Jan 24'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '(555) 567-8901',
      location: 'FL',
      orders: 6,
      spent: 649.94,
      lastOrder: 'Dec 20',
      status: 'Inactive',
      rating: 4.3,
      joined: 'Jul 23'
    }
  ];

  const filterOptions = [
    { id: 'status', label: 'Status', options: ['All', 'Active', 'VIP', 'New', 'Inactive'] },
    { id: 'orders', label: 'Orders', options: ['All', '1-5', '6-10', '10+'] },
    { id: 'spent', label: 'Spent', options: ['All', '$0-500', '$500+', '$1k+'] }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (selectedFilters.status && selectedFilters.status !== 'All') {
      if (customer.status !== selectedFilters.status) return false;
    }
    if (selectedFilters.orders && selectedFilters.orders !== 'All') {
      const orders = customer.orders;
      switch (selectedFilters.orders) {
        case '1-5': return orders >= 1 && orders <= 5;
        case '6-10': return orders >= 6 && orders <= 10;
        case '10+': return orders > 10;
        default: return true;
      }
    }
    if (selectedFilters.spent && selectedFilters.spent !== 'All') {
      const spent = customer.spent;
      switch (selectedFilters.spent) {
        case '$0-500': return spent <= 500;
        case '$500+': return spent > 500;
        case '$1k+': return spent >= 1000;
        default: return true;
      }
    }
    return true;
  });

  const stats = [
    { value: customers.length, label: 'Total' },
    { value: customers.filter(c => c.status === 'Active').length, label: 'Active' },
    { value: customers.filter(c => c.status === 'VIP').length, label: 'VIP' },
    { value: customers.filter(c => c.status === 'New').length, label: 'New' }
  ];

  // Flat scroll loading
  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= filteredCustomers.length) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 5, filteredCustomers.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredCustomers.length]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header - Flat */}
      <div className="bg-white border-b">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500">Manage your customers</p>
            </div>
            <Button size="sm" className="h-9 px-3 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1.5" />
              Add
            </Button>
          </div>
          
          {/* Stats - Simple row */}
          <div className="flex items-center gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Filter Bar - Flat */}
      <div className="bg-white border-b px-3 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((filter) => (
            <select
              key={filter.id}
              className="px-3 py-1.5 text-sm border rounded bg-white"
              value={selectedFilters[filter.id] || 'All'}
              onChange={(e) => setSelectedFilters(prev => ({
                ...prev,
                [filter.id]: e.target.value
              }))}
            >
              {filter.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Ultra Clean Customer List */}
      <div className="px-2 py-2 max-w-6xl mx-auto">
        {filteredCustomers.slice(0, displayCount).map((customer) => (
          <Card key={customer.id} className="mb-1.5 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <CardContent className="p-3">
              {/* Single Row Layout */}
              <div className="flex items-center justify-between">
                {/* Left: Basic Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Initials Avatar */}
                  <div className="w-9 h-9 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Name and Contact */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-gray-900 text-sm truncate">{customer.name}</span>
                      <Badge className={`${getStatusColor(customer.status)} px-1.5 py-0 text-xs h-5`}>
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Stats */}
                <div className="hidden md:flex items-center gap-4 flex-1 px-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Package className="w-3.5 h-3.5" />
                      {customer.orders}
                    </div>
                    <div className="text-xs text-gray-500">orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="w-3.5 h-3.5" />
                      {customer.spent.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">spent</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      {customer.rating}
                    </div>
                    <div className="text-xs text-gray-500">rating</div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                    onClick={() => console.log('View', customer.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Stats Row */}
              <div className="mt-2 pt-2 border-t border-gray-100 md:hidden">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span className="font-medium">{customer.orders} orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">${customer.spent.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        {displayCount < filteredCustomers.length && (
          <div className="text-center py-3">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 5, filteredCustomers.length))}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-1.5"
            >
              Load more...
            </button>
          </div>
        )}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">No customers found</div>
            <div className="text-xs text-gray-500 mb-4">Try adjusting your filters</div>
            <Button 
              size="sm" 
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setSelectedFilters({})}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;