import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Eye, ArrowUpRight, ArrowDownRight, Calendar,
  Filter, Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const revenueData = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 18 },
    { name: 'Mar', revenue: 5000, orders: 30 },
    { name: 'Apr', revenue: 4500, orders: 27 },
    { name: 'May', revenue: 6000, orders: 36 },
    { name: 'Jun', revenue: 5500, orders: 33 },
    { name: 'Jul', revenue: 7000, orders: 42 },
  ];

  const productCategoryData = [
    { name: 'Electronics', value: 45, color: '#3b82f6' },
    { name: 'Accessories', value: 30, color: '#10b981' },
    { name: 'Audio', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#ef4444' },
  ];

  const topProductsData = [
    { name: 'Wireless Earbuds Pro', sales: 234, revenue: 11700 },
    { name: 'Smart Watch Series 5', sales: 189, revenue: 9450 },
    { name: 'USB-C Fast Charger', sales: 156, revenue: 3120 },
    { name: 'Bluetooth Speaker', sales: 123, revenue: 6150 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,590',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Page Views',
      value: '45,678',
      change: '-2.1%',
      trend: 'down',
      icon: Eye,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Analytics</h1>
              <p className="text-xs text-muted-foreground">Track your store performance</p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
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

      {/* Charts Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Revenue Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View Report
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Sales by Category</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View Details
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productCategoryData.map((category) => (
                    <div key={category.name} className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-muted-foreground">{category.name}</span>
                      <span className="font-medium ml-auto">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Orders Over Time</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View Report
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="orders" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                {topProductsData.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-3">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs">New order #3429 received from Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs">Product "Wireless Earbuds Pro" restocked</p>
                  <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs">New customer Lisa Wang registered</p>
                  <p className="text-xs text-muted-foreground mt-1">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs">Order #3427 shipped to Emma Davis</p>
                  <p className="text-xs text-muted-foreground mt-1">8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerAnalytics;