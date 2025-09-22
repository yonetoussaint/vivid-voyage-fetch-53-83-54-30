
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Package, 
  ShoppingCart, DollarSign, Eye, BarChart3,
  Calendar, Filter, Download, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  period: string;
  users: number;
  sales: number;
  orders: number;
  revenue: number;
}

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '45,892',
      change: '+12.8%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Sellers',
      value: '2,847',
      change: '+5.2%',
      trend: 'up',
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: '89,432',
      change: '+18.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: '$2.4M',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Page Views',
      value: '1.2M',
      change: '-2.3%',
      trend: 'down',
      icon: Eye,
      color: 'text-orange-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.8%',
      change: '+0.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-indigo-600'
    }
  ];

  const chartData: ChartData[] = [
    { period: 'Mon', users: 1250, sales: 89, orders: 156, revenue: 12500 },
    { period: 'Tue', users: 1380, sales: 95, orders: 189, revenue: 15800 },
    { period: 'Wed', users: 1120, sales: 78, orders: 134, revenue: 11200 },
    { period: 'Thu', users: 1590, sales: 112, orders: 234, revenue: 18900 },
    { period: 'Fri', users: 1890, sales: 134, orders: 298, revenue: 24500 },
    { period: 'Sat', users: 2100, sales: 156, orders: 345, revenue: 31200 },
    { period: 'Sun', users: 1750, sales: 123, orders: 267, revenue: 22800 }
  ];

  const topCategories = [
    { name: 'Electronics', sales: 45230, percentage: 28.5, change: '+12%' },
    { name: 'Fashion', sales: 38950, percentage: 24.5, change: '+8%' },
    { name: 'Home & Living', sales: 29100, percentage: 18.3, change: '+15%' },
    { name: 'Sports', sales: 22800, percentage: 14.4, change: '+5%' },
    { name: 'Beauty', sales: 18600, percentage: 11.7, change: '+22%' },
    { name: 'Books', sales: 4320, percentage: 2.6, change: '-3%' }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 1250, revenue: 1498750, seller: 'Tech Gadgets Pro' },
    { name: 'Nike Air Jordan 1', sales: 890, revenue: 151300, seller: 'Fashion Forward' },
    { name: 'MacBook Pro M3', sales: 567, revenue: 1134000, seller: 'Tech Gadgets Pro' },
    { name: 'Samsung TV 65"', sales: 445, revenue: 533400, seller: 'Electronics World' },
    { name: 'Coffee Maker Pro', sales: 678, revenue: 203400, seller: 'Home Essentials' }
  ];

  const getUserGrowthRate = () => {
    const lastWeek = 42100;
    const thisWeek = 45892;
    return ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-xs text-muted-foreground">Platform performance insights and metrics</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-lg font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Growth
                <Badge variant="outline" className="text-xs">+{getUserGrowthRate()}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-32 flex items-end gap-2">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t min-h-[4px] transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height: `${(data.users / Math.max(...chartData.map(d => d.users))) * 100}%`
                      }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-2">{data.period}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Revenue Trend
                <Badge variant="outline" className="text-xs">$136.9K</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-32 flex items-end gap-2">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t min-h-[4px] transition-all duration-300 hover:bg-green-600"
                      style={{
                        height: `${(data.revenue / Math.max(...chartData.map(d => d.revenue))) * 100}%`
                      }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-2">{data.period}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{category.name}</span>
                        <span className="text-xs text-muted-foreground">{category.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <Badge 
                          variant={category.change.startsWith('+') ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {category.change}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="w-4 h-4" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {product.seller}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {product.sales} sales
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${product.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
