import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Package, Users, Eye, Star, ArrowUpRight, ArrowDownRight,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SellerOverview = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,590',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Products',
      value: '89',
      change: '+2',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
    },
  ];

  const recentOrders = [
    { id: '#3429', customer: 'Sarah Johnson', amount: '$149.99', status: 'Completed', date: '2 hours ago' },
    { id: '#3428', customer: 'Mike Chen', amount: '$89.50', status: 'Processing', date: '4 hours ago' },
    { id: '#3427', customer: 'Emma Davis', amount: '$299.99', status: 'Shipped', date: '6 hours ago' },
    { id: '#3426', customer: 'Alex Kim', amount: '$199.99', status: 'Pending', date: '8 hours ago' },
    { id: '#3425', customer: 'Lisa Wang', amount: '$79.99', status: 'Completed', date: '1 day ago' },
  ];

  const topProducts = [
    { name: 'Wireless Earbuds Pro', sales: 234, revenue: '$11,700', trend: '+23%' },
    { name: 'Smart Watch Series 5', sales: 189, revenue: '$9,450', trend: '+15%' },
    { name: 'USB-C Fast Charger', sales: 156, revenue: '$3,120', trend: '+8%' },
    { name: 'Bluetooth Speaker', sales: 123, revenue: '$6,150', trend: '+12%' },
    { name: 'Phone Case Premium', sales: 98, revenue: '$1,960', trend: '+5%' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Store performance overview</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.title} className="text-center">
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
                <div className={`flex items-center justify-center text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? 
                    <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  }
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Recent Orders */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                        <ShoppingCart className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{order.amount}</p>
                      <Badge variant="secondary" className={`${getStatusColor(order.status)} text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Top Products</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{product.revenue}</p>
                      <p className="text-xs text-green-600">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs">
                <Package className="w-4 h-4" />
                Add Product
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs">
                <ShoppingCart className="w-4 h-4" />
                Process Orders
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs">
                <Users className="w-4 h-4" />
                Contact Customers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerOverview;