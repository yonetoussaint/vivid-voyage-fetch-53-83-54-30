import React, { useState } from 'react';
import { 
  MoreHorizontal, Truck, Eye, MessageCircle,
  Download, Plus, Package, RefreshCw, Copy, MapPin,
  ChevronRight, Calendar, CreditCard, User, Box,
  CheckCircle, Clock, PackageOpen, XCircle, Truck as TruckIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerOrders = () => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(8);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied to clipboard');
  };

  const navigateToOrderDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

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
        { 
          name: 'Wireless Earbuds Pro', 
          quantity: 2, 
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop'
        }
      ],
      total: 149.99,
      status: 'Completed',
      date: '2024-01-20',
      trackingNumber: 'TRK1234567890',
      pickupStation: 'Downtown Station #45',
      pickupStationId: 'station-1',
      paymentMethod: 'Credit Card ****1234',
      itemsCount: 1,
      shippingMethod: 'Standard Delivery',
      orderPlacedAt: '2024-01-19 14:30'
    },
    {
      id: '#3428',
      customer: {
        name: 'Mike Chen',
        email: 'mike@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { 
          name: 'Smart Watch Series 5', 
          quantity: 1, 
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
        },
        { 
          name: 'USB-C Fast Charger', 
          quantity: 1, 
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop'
        }
      ],
      total: 319.98,
      status: 'Processing',
      date: '2024-01-20',
      trackingNumber: 'TRK0987654321',
      pickupStation: 'West Side Station #12',
      pickupStationId: 'station-2',
      paymentMethod: 'PayPal',
      itemsCount: 2,
      shippingMethod: 'Express Delivery',
      orderPlacedAt: '2024-01-20 09:15'
    },
    {
      id: '#3427',
      customer: {
        name: 'Emma Davis',
        email: 'emma@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { 
          name: 'Bluetooth Speaker', 
          quantity: 1, 
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop'
        }
      ],
      total: 79.99,
      status: 'Shipped',
      date: '2024-01-19',
      trackingNumber: 'TRK5647382910',
      pickupStation: 'East End Station #28',
      pickupStationId: 'station-3',
      paymentMethod: 'Credit Card ****5678',
      itemsCount: 1,
      shippingMethod: 'Standard Delivery',
      orderPlacedAt: '2024-01-19 16:45'
    },
    {
      id: '#3426',
      customer: {
        name: 'Alex Kim',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { 
          name: 'Phone Case Premium', 
          quantity: 3, 
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop'
        }
      ],
      total: 74.97,
      status: 'Pending',
      date: '2024-01-19',
      trackingNumber: 'TRK2938475610',
      pickupStation: 'South Plaza Station #67',
      pickupStationId: 'station-4',
      paymentMethod: 'Credit Card ****9012',
      itemsCount: 1,
      shippingMethod: 'Standard Delivery',
      orderPlacedAt: '2024-01-19 11:20'
    },
    {
      id: '#3425',
      customer: {
        name: 'Lisa Wang',
        email: 'lisa@example.com',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { 
          name: 'Wireless Earbuds Pro', 
          quantity: 1, 
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop'
        }
      ],
      total: 49.99,
      status: 'Cancelled',
      date: '2024-01-18',
      trackingNumber: 'TRK8765432109',
      pickupStation: 'North Market Station #91',
      pickupStationId: 'station-5',
      paymentMethod: 'Credit Card ****3456',
      itemsCount: 1,
      shippingMethod: 'Standard Delivery',
      orderPlacedAt: '2024-01-18 13:10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'Processing': return Clock;
      case 'Shipped': return TruckIcon;
      case 'Pending': return PackageOpen;
      case 'Cancelled': return XCircle;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilters.status && selectedFilters.status !== 'All') {
      if (order.status !== selectedFilters.status) return false;
    }

    if (selectedFilters.amount && selectedFilters.amount !== 'All') {
      const amount = order.total;
      switch (selectedFilters.amount) {
        case 'Under $50':
          if (amount >= 50) return false;
          break;
        case '$50-$100':
          if (amount < 50 || amount > 100) return false;
          break;
        case '$100-$200':
          if (amount < 100 || amount > 200) return false;
          break;
        case 'Over $200':
          if (amount <= 200) return false;
          break;
      }
    }

    return true;
  });

  const orderStats = [
    { value: '1,247', label: 'Total', color: 'text-blue-600' },
    { value: '23', label: 'Pending', color: 'text-yellow-600' },
    { value: '89', label: 'Processing', color: 'text-blue-600' },
    { value: '156', label: 'Shipped', color: 'text-purple-600' },
    { value: '979', label: 'Completed', color: 'text-green-600' }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart > 0) {
      const touchCurrent = e.touches[0].clientY;
      const diff = touchCurrent - touchStart;
      if (diff > 100 && window.scrollY === 0) {
        handleRefresh();
        setTouchStart(0);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setDisplayCount(8);
    }, 1000);
  };

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

  React.useEffect(() => {
    setDisplayCount(8);
  }, [filteredOrders.length]);

  return (
    <div 
      className="w-full bg-white min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-50" />
      )}

      {/* Header & Stats Section */}
      <div className="sticky top-0 z-40 bg-white">
        <SellerSummaryHeader
          title="Orders"
          subtitle="Manage your orders"
          subtitleIcon={Truck}
          stats={orderStats}
          actionButton={{
            label: 'New Order',
            icon: Plus,
            onClick: () => console.log('New order clicked')
          }}
          showStats={filteredOrders.length > 0}
        />
      </div>

      {/* Product Filter Bar */}
      <ProductFilterBar
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAll}
        onFilterButtonClick={handleFilterButtonClick}
      />

      {/* Orders Grid - Clean & Flat Design */}
      <div className="py-4 px-2">
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {filteredOrders.slice(0, displayCount).map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const orderId = order.id.replace('#', '');
                
                return (
                  <Card 
                    key={order.id} 
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => navigateToOrderDetails(orderId)}
                  >
                    <CardContent className="p-4">
                      {/* Order Header - Minimal */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground text-base">{order.id}</h3>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(order.status)} px-2.5 py-1 flex items-center gap-1 text-xs font-medium`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status}
                        </Badge>
                      </div>

                      {/* Customer Info - Simple */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={order.customer.avatar} />
                          <AvatarFallback>
                            {order.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {/* Order Summary - Clean */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Box className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs text-muted-foreground">Items</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{order.products.length}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs text-muted-foreground">Total</span>
                          </div>
                          <span className="text-base font-bold text-foreground">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quick Actions & Navigation */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(order.trackingNumber);
                            }}
                            className="text-xs h-8 px-2"
                          >
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            Copy Tracking
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pickup-station/${order.pickupStationId}`);
                            }}
                            className="text-xs h-8 px-2"
                          >
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            View Station
                          </Button>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Loading More Indicator */}
            {displayCount < filteredOrders.length && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading more orders...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-1">No orders found</div>
            <div className="text-sm text-muted-foreground mb-6">Try adjusting your filters</div>
            <Button onClick={handleRefresh} className="h-11 px-6">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;