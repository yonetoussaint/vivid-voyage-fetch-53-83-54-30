
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Eye, Truck, 
  Package, CheckCircle, Clock, AlertTriangle,
  DollarSign, User, Calendar, MapPin, Phone
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

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  seller: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  dispute?: boolean;
}

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001234',
      customer: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      seller: 'Tech Gadgets Pro',
      product: 'iPhone 15 Pro Max 256GB',
      quantity: 1,
      totalAmount: 1199.99,
      status: 'Shipped',
      paymentStatus: 'Paid',
      shippingAddress: '123 Main St, New York, NY 10001',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'TRK123456789',
      dispute: false
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-001235',
      customer: 'Mike Chen',
      customerEmail: 'mike@example.com',
      seller: 'Fashion Forward',
      product: 'Nike Air Jordan 1 Retro High',
      quantity: 2,
      totalAmount: 340.00,
      status: 'Processing',
      paymentStatus: 'Paid',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      orderDate: '2024-01-14',
      estimatedDelivery: '2024-01-19',
      dispute: false
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-001236',
      customer: 'Emma Davis',
      customerEmail: 'emma@example.com',
      seller: 'Home Essentials',
      product: 'Smart Coffee Maker Pro',
      quantity: 1,
      totalAmount: 299.99,
      status: 'Pending',
      paymentStatus: 'Failed',
      shippingAddress: '789 Pine St, Chicago, IL 60601',
      orderDate: '2024-01-13',
      estimatedDelivery: '2024-01-20',
      dispute: false
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-001237',
      customer: 'Alex Kim',
      customerEmail: 'alex@example.com',
      seller: 'Tech Gadgets Pro',
      product: 'Gaming Mechanical Keyboard',
      quantity: 1,
      totalAmount: 129.99,
      status: 'Delivered',
      paymentStatus: 'Paid',
      shippingAddress: '321 Elm Dr, Houston, TX 77001',
      orderDate: '2024-01-10',
      estimatedDelivery: '2024-01-15',
      trackingNumber: 'TRK987654321',
      dispute: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'Processing': return <Package className="w-3 h-3" />;
      case 'Shipped': return <Truck className="w-3 h-3" />;
      case 'Delivered': return <CheckCircle className="w-3 h-3" />;
      case 'Cancelled': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'orderDate': return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'amount': return b.totalAmount - a.totalAmount;
        case 'customer': return a.customer.localeCompare(b.customer);
        default: return 0;
      }
    });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    disputes: orders.filter(o => o.dispute).length
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Order Management</h1>
              <p className="text-xs text-muted-foreground">Monitor and manage marketplace orders</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.processing}</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.shipped}</div>
              <div className="text-xs text-muted-foreground">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.delivered}</div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.disputes}</div>
              <div className="text-xs text-muted-foreground">Disputes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
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
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orderDate">Sort by Date</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
              <SelectItem value="customer">Sort by Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-3">
        <div className="grid gap-3">
          {filteredAndSortedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{order.orderNumber}</h3>
                      {order.dispute && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge variant="secondary" className={`${getStatusColor(order.status)} text-xs flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                      <Badge variant="secondary" className={`${getPaymentColor(order.paymentStatus)} text-xs`}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{order.customer} ({order.customerEmail})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{order.product} (Qty: {order.quantity})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{order.shippingAddress}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Ordered: {order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Est. Delivery: {order.estimatedDelivery}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Amount */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Order Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Contact Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="w-4 h-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      {order.trackingNumber && (
                        <DropdownMenuItem>
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </DropdownMenuItem>
                      )}
                      {order.dispute && (
                        <DropdownMenuItem className="text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Handle Dispute
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Process Refund
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
