import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Package, Truck, 
  CheckCircle, XCircle, Clock, ArrowRight, Download,
  Star, MessageCircle, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';

const ProfileOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-1234',
      orderNumber: '#1234',
      date: '2024-01-20',
      seller: 'TechStore Pro',
      items: [
        { name: 'Wireless Earbuds Pro', price: 149.99, quantity: 1, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop' }
      ],
      total: 149.99,
      status: 'Delivered',
      trackingNumber: 'TRK123456789',
      deliveryDate: '2024-01-22',
      canReview: true,
      canReturn: true
    },
    {
      id: 'ORD-1233',
      orderNumber: '#1233',
      date: '2024-01-18',
      seller: 'Fashion Hub',
      items: [
        { name: 'Casual T-Shirt', price: 29.99, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop' },
        { name: 'Jeans', price: 59.99, quantity: 1, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop' }
      ],
      total: 119.97,
      status: 'Shipped',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25',
      canReview: false,
      canReturn: false
    },
    {
      id: 'ORD-1232',
      orderNumber: '#1232',
      date: '2024-01-15',
      seller: 'Electronics Central',
      items: [
        { name: 'Smart Watch Series 5', price: 299.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' }
      ],
      total: 299.99,
      status: 'Processing',
      canReview: false,
      canReturn: false
    },
    {
      id: 'ORD-1231',
      orderNumber: '#1231',
      date: '2024-01-10',
      seller: 'Home & Garden',
      items: [
        { name: 'Air Purifier', price: 199.99, quantity: 1, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop' }
      ],
      total: 199.99,
      status: 'Delivered',
      trackingNumber: 'TRK456789123',
      deliveryDate: '2024-01-13',
      canReview: true,
      canReturn: true
    },
    {
      id: 'ORD-1230',
      orderNumber: '#1230',
      date: '2024-01-05',
      seller: 'Book World',
      items: [
        { name: 'Programming Guide', price: 29.99, quantity: 1, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop' }
      ],
      total: 29.99,
      status: 'Cancelled',
      canReview: false,
      canReturn: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return CheckCircle;
      case 'Shipped': return Truck;
      case 'Processing': return Clock;
      case 'Cancelled': return XCircle;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { value: orders.length.toString(), label: 'Total', color: 'text-blue-600' },
    { value: orders.filter(o => o.status === 'Processing').length.toString(), label: 'Pending', color: 'text-yellow-600' },
    { value: orders.filter(o => o.status === 'Delivered').length.toString(), label: 'Delivered', color: 'text-green-600' },
    { value: orders.filter(o => o.status === 'Cancelled').length.toString(), label: 'Cancelled', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      <SellerSummaryHeader
        title="My Orders"
        subtitle="Track and manage your orders"
        stats={stats}
      />

      {/* Orders List */}
      <div className="px-4 space-y-3">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);

          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{order.orderNumber}</span>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()} from {order.seller}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {order.trackingNumber && (
                        <DropdownMenuItem>Track Package</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Contact Seller</DropdownMenuItem>
                      {order.canReturn && (
                        <DropdownMenuItem>Return Item</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/20">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    {order.status === 'Delivered' && order.deliveryDate && (
                      <span className="text-green-600">
                        Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                      </span>
                    )}
                    {order.status === 'Shipped' && order.estimatedDelivery && (
                      <span className="text-blue-600">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </span>
                    )}
                    {order.status === 'Processing' && (
                      <span className="text-yellow-600">Order being processed</span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="text-red-600">Order cancelled</span>
                    )}
                    {order.trackingNumber && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Total: ${order.total.toFixed(2)}</span>
                    <div className="flex gap-1">
                      {order.canReview && (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      )}
                      {order.canReturn && (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Return
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No orders match your search criteria' 
                  : "You haven't placed any orders yet"}
              </p>
              <Button>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;