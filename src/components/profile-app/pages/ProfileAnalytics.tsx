import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Eye, ArrowUpRight, ArrowDownRight, Calendar,
  Filter, Download, Package, Heart, Star
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
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';

const ProfileAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const spendingData = [
    { name: 'Jan', spending: 180, orders: 3 },
    { name: 'Feb', spending: 320, orders: 5 },
    { name: 'Mar', spending: 240, orders: 4 },
    { name: 'Apr', spending: 180, orders: 2 },
    { name: 'May', spending: 420, orders: 7 },
    { name: 'Jun', spending: 380, orders: 6 },
    { name: 'Jul', spending: 290, orders: 4 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, spending: 1200, color: '#3b82f6' },
    { name: 'Fashion', value: 25, spending: 680, color: '#10b981' },
    { name: 'Home & Garden', value: 15, spending: 420, color: '#f59e0b' },
    { name: 'Books', value: 10, spending: 280, color: '#ef4444' },
    { name: 'Sports', value: 5, spending: 140, color: '#8b5cf6' },
  ];

  const sellerData = [
    { name: 'TechStore Pro', orders: 8, spending: 650, rating: 4.8 },
    { name: 'Fashion Hub', orders: 6, spending: 420, rating: 4.6 },
    { name: 'Electronics Central', orders: 5, spending: 380, rating: 4.7 },
    { name: 'Home & Garden', orders: 4, spending: 320, rating: 4.5 },
  ];

  const stats = [
    {
      title: 'Total Spent',
      value: '$2,350',
      change: '+$180 this month',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: '47',
      change: '+3 this month',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Avg Order Value',
      value: '$50.00',
      change: '+$5.20 this month',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Wishlist Items',
      value: '23',
      change: '+5 this month',
      trend: 'up',
      icon: Heart,
      color: 'text-orange-600',
    },
  ];

  const monthlyInsights = [
    {
      title: 'Most Purchased Category',
      value: 'Electronics',
      description: '45% of your orders',
      icon: Package,
    },
    {
      title: 'Favorite Seller',
      value: 'TechStore Pro',
      description: '8 orders, $650 spent',
      icon: Users,
    },
    {
      title: 'Average Rating Given',
      value: '4.6/5',
      description: 'Based on 18 reviews',
      icon: Star,
    },
    {
      title: 'Money Saved',
      value: '$156',
      description: 'From deals and discounts',
      icon: TrendingDown,
    },
  ];

  const summaryStats = stats.map(stat => ({
    value: stat.value,
    label: stat.title,
    color: stat.color
  }));

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="bg-white">
        <div className="px-4 py-3">
          <SellerSummaryHeader
            title="Shopping Analytics"
            subtitle="Insights into your shopping habits"
            stats={summaryStats}
          />
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="px-4 space-y-4">
        {/* Spending Trend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Spending Trend</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Spending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Orders</span>
                </div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Category Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Spending by Category</h3>
              <div className="h-48 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${category.spending}</div>
                      <div className="text-muted-foreground">{category.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sellers */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Top Sellers</h3>
              <div className="space-y-3">
                {sellerData.map((seller, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{seller.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < Math.floor(seller.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-gray-200 text-gray-200'
                              }`} 
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {seller.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${seller.spending}</div>
                      <div className="text-xs text-muted-foreground">
                        {seller.orders} orders
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Insights */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">This Month's Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {monthlyInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="bg-muted/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{insight.title}</span>
                    </div>
                    <div className="text-lg font-bold text-foreground mb-1">
                      {insight.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {insight.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Shopping Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$156</div>
                <div className="text-xs text-green-700">Total Saved</div>
                <div className="text-xs text-muted-foreground">From deals & coupons</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.6</div>
                <div className="text-xs text-blue-700">Avg Rating Given</div>
                <div className="text-xs text-muted-foreground">18 reviews written</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <div className="text-xs text-purple-700">Satisfaction Rate</div>
                <div className="text-xs text-muted-foreground">Based on your ratings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileAnalytics;