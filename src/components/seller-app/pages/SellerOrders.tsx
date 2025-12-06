import React, { useState } from 'react';
import { 
  MoreHorizontal, Truck, Eye, MessageCircle,
  Download, Plus, Package, RefreshCw, Copy, MapPin,
  ChevronRight, DollarSign, Calendar, User, CheckCircle,
  Clock, Package2, ArrowUpRight, ArrowDownRight, ShoppingBag
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
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerOrders = () => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(8);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied');
  };

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
      },
      products: [
        { 
          name: 'Wireless Earbuds Pro', 
          quantity: 2, 
          price: 49.99,
        }
      ],
      total: 149.99,
      status: 'Completed',
      date: 'Jan 20',
      time: '14:30',
      trackingNumber: 'TRK1234567890',
      pickupStation: 'Downtown #45',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#3428',
      customer: {
        name: 'Mike Chen',
        email: 'mike@example.com',
      },
      products: [
        { 
          name: 'Smart Watch Series 5', 
          quantity: 1, 
          price: 299.99,
        },
        { 
          name: 'USB-C Fast Charger', 
          quantity: 1, 
          price: 19.99,
        }
      ],
      total: 319.98,
      status: 'Processing',
      date: 'Jan 20',
      time: '10:15',
      trackingNumber: 'TRK0987654321',
      pickupStation: 'West Side #12',
      paymentMethod: 'PayPal'
    },
    {
      id: '#3427',
      customer: {
        name: 'Emma Davis',
        email: 'emma@example.com',
      },
      products: [
        { 
          name: 'Bluetooth Speaker', 
          quantity: 1, 
          price: 79.99,
        }
      ],
      total: 79.99,
      status: 'Shipped',
      date: 'Jan 19',
      time: '16:45',
      trackingNumber: 'TRK5647382910',
      pickupStation: 'East End #28',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#3426',
      customer: {
        name: 'Alex Kim',
        email: 'alex@example.com',
      },
      products: [
        { 
          name: 'Phone Case Premium', 
          quantity: 3, 
          price: 24.99,
        }
      ],
      total: 74.97,
      status: 'Pending',
      date: 'Jan 19',
      time: '09:20',
      trackingNumber: 'TRK2938475610',
      pickupStation: 'South Plaza #67',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#3425',
      customer: {
        name: 'Lisa Wang',
        email: 'lisa@example.com',
      },
      products: [
        { 
          name: 'Wireless Earbuds Pro', 
          quantity: 1, 
          price: 49.99,
        }
      ],
      total: 49.99,
      status: 'Cancelled',
      date: 'Jan 18',
      time: '11:30',
      trackingNumber: 'TRK8765432109',
      pickupStation: 'North Market #91',
      paymentMethod: 'Credit Card'
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

      if (scrollTop + windowHeight >= documentHeight - 100) {
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
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-50" />
      )}

      {/* Header & Stats */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <SellerSummaryHeader
          title="Orders"
          subtitle="Manage your orders"
          subtitleIcon={Truck}
          stats={orderStats}
          actionButton={{
            label: 'New',
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

      {/* Ultra Compact Orders List */}
      <div className="py-2 px-2 md:px-3 max-w-6xl mx-auto">
        {filteredOrders.length > 0 ? (
          <div className="space-y-1.5">
            {/* Compact Table Headers (Desktop only) */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide bg-gray-50 rounded">
              <div className="col-span-2">Order</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-1">Items</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Tracking</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Ultra Compact Orders */}
            <div className="space-y-1.5">
              {filteredOrders.slice(0, displayCount).map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                
                return (
                  <Card key={order.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-150 hover:shadow-xs">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        {/* Left Section: Order Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Order ID with icon */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-semibold text-sm text-foreground truncate">{order.id}</span>
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(order.status)} px-1.5 py-0 text-[11px] font-medium h-5`}
                              >
                                <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span className="truncate">{order.customer.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Center Section: Details (Desktop only) */}
                        <div className="hidden md:flex items-center gap-4 flex-1">
                          <div className="text-xs text-muted-foreground min-w-[80px]">
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {order.products.length} item{order.products.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div className="min-w-[120px]">
                            <div className="flex items-center gap-1.5">
                              <div className="bg-gray-50 px-2 py-1 rounded text-xs font-mono text-foreground truncate max-w-[100px]">
                                {order.trackingNumber}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(order.trackingNumber)}
                                className="h-6 w-6"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Right Section: Total & Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Total */}
                          <div className="text-right min-w-[70px]">
                            <div className="flex items-center gap-0.5 justify-end">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              <span className="font-bold text-sm text-foreground">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{order.date} {order.time}</div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 text-xs">
                                <DropdownMenuItem className="text-xs py-1.5">
                                  <MessageCircle className="w-3.5 h-3.5 mr-2" />
                                  Contact
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs py-1.5">
                                  <Download className="w-3.5 h-3.5 mr-2" />
                                  Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs py-1.5" onClick={() => navigate(`/pickup-station/overview`)}>
                                  <MapPin className="w-3.5 h-3.5 mr-2" />
                                  Station
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Details Row */}
                      <div className="mt-2 pt-2 border-t border-gray-100 md:hidden">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Package className="w-3 h-3" />
                              {order.products.length} item{order.products.length > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="bg-gray-50 px-2 py-1 rounded text-xs font-mono text-foreground truncate max-w-[100px]">
                                {order.trackingNumber}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(order.trackingNumber)}
                                className="h-6 w-6"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.pickupStation}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Load More */}
            {displayCount < filteredOrders.length && (
              <div className="text-center py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDisplayCount(prev => Math.min(prev + 8, filteredOrders.length))}
                  className="text-xs text-muted-foreground hover:text-foreground h-8"
                >
                  Load More
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-sm font-semibold text-foreground mb-1">No orders found</div>
            <div className="text-xs text-muted-foreground mb-4">Try adjusting your filters</div>
            <Button onClick={handleRefresh} size="sm" className="h-9 px-4 text-sm">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;