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
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [displayCount, setDisplayCount] = useState(8);

  // Add filter state matching BookGenreFlashDeals
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Define filter categories matching BookGenreFlashDeals structure
  const filterCategories = [
    {
      id: 'period',
      label: 'Period',
      options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']
    },
    {
      id: 'metric',
      label: 'Metric',
      options: ['Revenue', 'Orders', 'Customers', 'Page Views']
    },
    {
      id: 'category',
      label: 'Category',
      options: ['All', 'Electronics', 'Accessories', 'Audio', 'Other']
    },
    {
      id: 'trend',
      label: 'Trend',
      options: ['All', 'Growing', 'Declining', 'Stable']
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
      value: '$24,590',
      label: 'Total Revenue',
      color: 'text-blue-600'
    },
    {
      value: '1,247',
      label: 'Total Orders',
      color: 'text-green-600'
    },
    {
      value: '892',
      label: 'Customers',
      color: 'text-purple-600'
    },
    {
      value: '45,678',
      label: 'Page Views',
      color: 'text-orange-600'
    },
  ];

  // Infinite scroll logic matching BookGenreFlashDeals
  React.useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= topProductsData.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, topProductsData.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, topProductsData.length]);

  return (
    <div className="w-full bg-white">
      {/* Header & Stats Section - Same structure as BookGenreFlashDeals */}
      <SellerSummaryHeader
        title="Analytics"
        subtitle="Track your store performance"
        stats={stats}
        actionButton={{
          label: 'Export',
          icon: Download,
          onClick: () => console.log('Export clicked')
        }}
        showStats={true}
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

      {/* Charts Grid - Using same spacing and structure */}
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Revenue Chart */}
          <Card className="overflow-hidden border border-gray-200">
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
          <Card className="overflow-hidden border border-gray-200">
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
          <Card className="overflow-hidden border border-gray-200">
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
          <Card className="overflow-hidden border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Top Products</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {topProductsData.slice(0, displayCount).map((product, index) => (
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
      <div className="py-4">
        <Card className="overflow-hidden border border-gray-200">
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