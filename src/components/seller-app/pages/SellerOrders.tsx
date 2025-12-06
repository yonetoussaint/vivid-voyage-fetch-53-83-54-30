import React, { useState } from 'react';
import { 
  MoreHorizontal, Truck, Eye, MessageCircle,
  Download, Plus, Package, RefreshCw, Copy, MapPin,
  ChevronRight, DollarSign, Calendar, User, CheckCircle,
  Clock, Package2, ArrowUpRight, ArrowDownRight
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

  // Filter handler functions
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
      paymentMethod: 'Credit Card ****3456'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'Processing': return Package2;
      case 'Shipped': return Truck;
      case 'Pending': return Clock;
      case 'Cancelled': return ArrowDownRight;
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
    { value: '1,247', label: 'Total', color: 'text-blue-600', icon: Package },
    { value: '23', label: 'Pending', color: 'text-yellow-600', icon: Clock },
    { value: '89', label: 'Processing', color: 'text-blue-600', icon: Package2 },
    { value: '156', label: 'Shipped', color: 'text-purple-600', icon: Truck },
    { value: '979', label: 'Completed', color: 'text-green-600', icon: CheckCircle }
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

  // Infinite scroll logic
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
      className="w-full bg-gray-50 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-50" />
      )}

      {/* Header & Stats Section */}
      <div className="sticky top-0 z-40 bg-white border-b">
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

      {/* Filter Bar */}
      <ProductFilterBar
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAll}
        onFilterButtonClick={handleFilterButtonClick}
      />

      {/* Compact Orders List */}
      <div className="py-4 px-2 md:px-4 max-w-6xl mx-auto">
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {/* Table Headers (Desktop only) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3">Order & Customer</div>
              <div className="col-span-2">Products</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Tracking</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.slice(0, displayCount).map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                
                return (
                  <Card key={order.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Order & Customer Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="font-bold text-base text-foreground">{order.id}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getStatusColor(order.status)} px-2 py-0.5 text-xs font-medium border`}
                                  >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-foreground font-medium truncate">{order.customer.name}</span>
                                  <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                                  <span className="text-muted-foreground text-xs hidden sm:inline truncate">{order.customer.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Products Summary */}
                          <div className="md:w-48">
                            <div className="text-sm text-foreground font-medium mb-1">Products</div>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {order.products.slice(0, 3).map((product, idx) => (
                                  <img
                                    key={idx}
                                    src={product.image}
                                    alt=""
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  />
                                ))}
                                {order.products.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                    +{order.products.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.products.length} item{order.products.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>

                          {/* Tracking Info */}
                          <div className="md:w-40">
                            <div className="text-sm text-foreground font-medium mb-1">Tracking</div>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex-1">
                                <p className="text-xs font-mono text-foreground truncate">{order.trackingNumber}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(order.trackingNumber)}
                                className="h-8 w-8 flex-shrink-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Total Amount */}
                          <div className="md:w-32">
                            <div className="text-sm text-foreground font-medium mb-1">Total</div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">{order.paymentMethod}</div>
                          </div>

                          {/* Action Buttons */}
                          <div className="md:w-40">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 flex items-center gap-2 flex-1"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contact Customer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/pickup-station/overview`)}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    View Station
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {order.date}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Additional Info */}
                        <div className="mt-4 pt-4 border-t border-gray-100 md:hidden">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Pickup Station</div>
                              <div className="text-sm font-medium text-foreground truncate">{order.pickupStation}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Date</div>
                              <div className="text-sm font-medium text-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {order.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Loading More Indicator */}
            {displayCount < filteredOrders.length && (
              <div className="text-center py-6">
                <Button
                  variant="ghost"
                  onClick={() => setDisplayCount(prev => Math.min(prev + 8, filteredOrders.length))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Load More Orders
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
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