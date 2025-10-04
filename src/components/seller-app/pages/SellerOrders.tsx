import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Eye, MessageCircle,
  Download, Plus, Package, RefreshCw
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
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(8);

  // Add filter state
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Define filter categories matching BookGenreFlashDeals structure
  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']
    },
    {
      id: 'customer',
      label: 'Customer',
      options: ['All', 'New Customers', 'Returning Customers']
    },
    {
      id: 'amount',
      label: 'Order Amount',
      options: ['All', 'Under $50', '$50-$100', '$100-$200', 'Over $200']
    },
    {
      id: 'date',
      label: 'Date',
      options: ['All', 'Today', 'This Week', 'This Month', 'Last 30 Days']
    }
  ];

  // Filter handler functions matching BookGenreFlashDeals
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

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

  const getStatusColor = (status: string) => {
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

  const orderStats = [
    { value: '1,247', label: 'Total', color: 'text-blue-600' },
    { value: '23', label: 'Pending', color: 'text-yellow-600' },
    { value: '89', label: 'Processing', color: 'text-blue-600' },
    { value: '156', label: 'Shipped', color: 'text-purple-600' },
    { value: '979', label: 'Completed', color: 'text-green-600' }
  ];

  // Infinite scroll logic matching BookGenreFlashDeals
  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= filteredOrders.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, filteredOrders.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredOrders.length]);

  // Reset display count when orders change
  React.useEffect(() => {
    setDisplayCount(8);
  }, [filteredOrders.length]);

  return (
    <div className="w-full bg-white">
      {/* Header & Stats Section - Same structure as BookGenreFlashDeals */}
      <SellerSummaryHeader
        title="Orders"
        subtitle="Manage your orders"
        stats={orderStats}
        actionButton={{
          label: 'New Order',
          icon: Plus,
          onClick: () => console.log('New order clicked')
        }}
        showStats={filteredOrders.length > 0}
      />

      {/* Filter Bar Section - Same as BookGenreFlashDeals */}
      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

      {/* Orders Grid - Using same spacing and structure as BookGenreFlashDeals */}
      <div className="py-4">
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {filteredOrders.slice(0, displayCount).map((order) => (
                <Card key={order.id} className="overflow-hidden border border-gray-200">
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
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium">No orders found</div>
            <div className="text-sm mt-1">Try adjusting your search terms or filters</div>
            <Button size="sm" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;