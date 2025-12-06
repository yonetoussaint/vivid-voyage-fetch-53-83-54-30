import React, { useState } from 'react';
import { 
  Eye, Mail, Phone, Package, 
  DollarSign, Star, MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SellerCustomers = () => {
  const [displayCount, setDisplayCount] = useState(12);

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      location: 'NY',
      orders: 12,
      spent: 1249,
      lastOrder: 'Jan 20',
      status: 'Active',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '(555) 234-5678',
      location: 'LA',
      orders: 8,
      spent: 899,
      lastOrder: 'Jan 18',
      status: 'Active',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '(555) 345-6789',
      location: 'CHI',
      orders: 15,
      spent: 2199,
      lastOrder: 'Jan 15',
      status: 'VIP',
      rating: 4.9,
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '(555) 456-7890',
      location: 'TX',
      orders: 3,
      spent: 299,
      lastOrder: 'Jan 10',
      status: 'New',
      rating: 4.5,
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '(555) 567-8901',
      location: 'FL',
      orders: 6,
      spent: 649,
      lastOrder: 'Dec 20',
      status: 'Inactive',
      rating: 4.3,
    },
    {
      id: '6',
      name: 'James Wilson',
      email: 'james@example.com',
      phone: '(555) 678-9012',
      location: 'WA',
      orders: 9,
      spent: 1100,
      lastOrder: 'Jan 19',
      status: 'Active',
      rating: 4.7,
    },
    {
      id: '7',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '(555) 789-0123',
      location: 'CA',
      orders: 5,
      spent: 450,
      lastOrder: 'Jan 17',
      status: 'Active',
      rating: 4.4,
    },
    {
      id: '8',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '(555) 890-1234',
      location: 'IL',
      orders: 11,
      spent: 1350,
      lastOrder: 'Jan 16',
      status: 'VIP',
      rating: 4.8,
    },
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

  // Flat scroll loading
  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= customers.length) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setDisplayCount(prev => Math.min(prev + 8, customers.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
          <div className="text-sm text-gray-500">{customers.length} total</div>
        </div>
      </div>

      {/* Ultra Clean Customer List */}
      <div className="px-2 py-2">
        {customers.slice(0, displayCount).map((customer) => (
          <Card key={customer.id} className="mb-1 border border-gray-200 bg-white hover:bg-gray-50">
            <CardContent className="p-3">
              {/* Single Compact Row */}
              <div className="flex items-center justify-between">
                {/* Customer Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Initials */}
                  <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Name and Status */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-900 truncate">{customer.name}</span>
                      <Badge className={`${getStatusColor(customer.status)} px-1.5 py-0 text-xs h-5`}>
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-3 px-2">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Package className="w-3.5 h-3.5" />
                      <span className="font-medium">{customer.orders}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-medium">{customer.spent}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span>{customer.rating}</span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 flex-shrink-0"
                  onClick={() => console.log('View', customer.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Stats */}
              <div className="mt-2 pt-2 border-t border-gray-100 sm:hidden">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span className="font-medium">{customer.orders} orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">${customer.spent}</span>
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

        {/* Simple Load More */}
        {displayCount < customers.length && (
          <div className="text-center py-3">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 8, customers.length))}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;