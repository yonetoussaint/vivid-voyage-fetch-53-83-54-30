import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Package, Heart, Eye, Star, ArrowUpRight, ArrowDownRight,
  Plus, Calendar, Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import { useNavigate } from 'react-router-dom';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Total Orders',
      value: '47',
      change: '+3 this month',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Total Spent',
      value: '$2,350',
      change: '+$120 this month',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Wishlist Items',
      value: '23',
      change: '+5 added',
      trend: 'up',
      icon: Heart,
    },
    {
      title: 'Reviews Written',
      value: '18',
      change: '+2 this month',
      trend: 'up',
      icon: Star,
    },
  ];

  const recentOrders = [
    { id: '#1234', seller: 'TechStore Pro', amount: '$149.99', status: 'Delivered', date: '2 days ago', product: 'Wireless Earbuds Pro' },
    { id: '#1233', seller: 'Fashion Hub', amount: '$89.50', status: 'Shipped', date: '5 days ago', product: 'Casual T-Shirt' },
    { id: '#1232', seller: 'Electronics Central', amount: '$299.99', status: 'Processing', date: '1 week ago', product: 'Smart Watch Series 5' },
    { id: '#1231', seller: 'Home & Garden', amount: '$199.99', status: 'Delivered', date: '2 weeks ago', product: 'Air Purifier' },
    { id: '#1230', seller: 'Book World', amount: '$29.99', status: 'Delivered', date: '3 weeks ago', product: 'Programming Guide' },
  ];

  const recentActivity = [
    { type: 'order', text: 'Placed order for Wireless Earbuds Pro', time: '2 days ago', amount: '$149.99' },
    { type: 'review', text: 'Left a review for Smart Phone Case', time: '5 days ago', rating: 5 },
    { type: 'wishlist', text: 'Added Gaming Headset to wishlist', time: '1 week ago' },
    { type: 'order', text: 'Order delivered: Air Purifier', time: '2 weeks ago', amount: '$199.99' },
    { type: 'review', text: 'Left a review for Programming Guide', time: '3 weeks ago', rating: 4 },
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'review': return Star;
      case 'wishlist': return Heart;
      default: return Package;
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header with Search Bar */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <ReusableSearchBar
              placeholder="Search products, orders, reviews..."
              onSubmit={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
              className="flex-1"
            />
            <Button size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Browse
            </Button>
          </div>

          {/* Compact Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.trend === 'up';
              
              return (
                <div key={index} className="bg-muted/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.title}</div>
                  <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Recent Orders</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{order.id}</span>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.product}</p>
                      <p className="text-xs text-muted-foreground">from {order.seller}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{order.amount}</div>
                      <div className="text-xs text-muted-foreground">{order.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-muted/20">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-xs font-medium">{activity.amount}</div>
                      )}
                      {activity.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < activity.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-gray-200 text-gray-200'
                              }`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Browse</span>
              </Button>
              <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">Wishlist</span>
              </Button>
              <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                <Star className="w-4 h-4" />
                <span className="text-xs">Reviews</span>
              </Button>
              <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDashboard;