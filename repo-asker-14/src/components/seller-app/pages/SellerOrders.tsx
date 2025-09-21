import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Package, Truck, 
  CheckCircle, Clock, AlertCircle, Eye, MessageCircle,
  Download, RefreshCw, Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SellerOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: '#3429',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { name: 'Wireless Earbuds Pro', quantity: 2, price: 49.99 }
      ],
      total: 149.99,
      status: 'Completed',
      date: '2024-01-20',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card ****1234'
    },
    {
      id: '#3428',
      customer: {
        name: 'Mike Chen',
        email: 'mike@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { name: 'Smart Watch Series 5', quantity: 1, price: 299.99 },
        { name: 'USB-C Fast Charger', quantity: 1, price: 19.99 }
      ],
      total: 319.98,
      status: 'Processing',
      date: '2024-01-20',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      paymentMethod: 'PayPal'
    },
    {
      id: '#3427',
      customer: {
        name: 'Emma Davis',
        email: 'emma@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { name: 'Bluetooth Speaker', quantity: 1, price: 79.99 }
      ],
      total: 79.99,
      status: 'Shipped',
      date: '2024-01-19',
      shippingAddress: '789 Pine St, Chicago, IL 60601',
      paymentMethod: 'Credit Card ****5678'
    },
    {
      id: '#3426',
      customer: {
        name: 'Alex Kim',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { name: 'Phone Case Premium', quantity: 3, price: 24.99 }
      ],
      total: 74.97,
      status: 'Pending',
      date: '2024-01-19',
      shippingAddress: '321 Elm St, Houston, TX 77001',
      paymentMethod: 'Credit Card ****9012'
    },
    {
      id: '#3425',
      customer: {
        name: 'Lisa Wang',
        email: 'lisa@example.com',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { name: 'Wireless Earbuds Pro', quantity: 1, price: 49.99 }
      ],
      total: 49.99,
      status: 'Cancelled',
      date: '2024-01-18',
      shippingAddress: '654 Maple Dr, Miami, FL 33101',
      paymentMethod: 'Credit Card ****3456'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Orders</h1>
              <p className="text-xs text-muted-foreground">Manage your orders</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Order
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">1,247</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">23</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">89</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">156</div>
              <div className="text-xs text-muted-foreground">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">979</div>
              <div className="text-xs text-muted-foreground">Completed</div>
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
              placeholder="Search orders..."
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={order.customer.avatar} />
                      <AvatarFallback>{order.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Products</p>
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{product.quantity}x {product.name}</span>
                          <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Order Total</p>
                    <div className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-sm text-foreground">{order.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Orders
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;