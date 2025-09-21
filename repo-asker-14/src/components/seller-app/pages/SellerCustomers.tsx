import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Calendar, Eye, Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const SellerCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Customers</h1>
              <p className="text-xs text-muted-foreground">Manage your customer relationships</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Customer
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">892</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">743</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">67</div>
              <div className="text-xs text-muted-foreground">VIP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">34</div>
              <div className="text-xs text-muted-foreground">New</div>
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
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={`${getStatusColor(customer.status)} text-xs`}>
                          {customer.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {customer.location}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-sm font-semibold text-foreground">{customer.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="text-sm font-semibold text-foreground">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Last Order</p>
                    <p className="text-sm font-semibold text-foreground">{customer.lastOrder}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No customers found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerCustomers;