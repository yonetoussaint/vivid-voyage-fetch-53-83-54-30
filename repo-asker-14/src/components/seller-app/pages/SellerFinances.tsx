import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, 
  Banknote, Receipt, Download, Calendar, ArrowUpRight, 
  ArrowDownRight, Filter, Search, Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const SellerFinances = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const revenueData = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1800, profit: 1200 },
    { name: 'Mar', revenue: 5000, expenses: 3000, profit: 2000 },
    { name: 'Apr', revenue: 4500, expenses: 2700, profit: 1800 },
    { name: 'May', revenue: 6000, expenses: 3600, profit: 2400 },
    { name: 'Jun', revenue: 5500, expenses: 3300, profit: 2200 },
    { name: 'Jul', revenue: 7000, expenses: 4200, profit: 2800 },
  ];

  const transactions = [
    {
      id: 'TXN-001',
      type: 'Sale',
      description: 'Order #3429 - Wireless Earbuds Pro',
      amount: 149.99,
      fee: 4.50,
      net: 145.49,
      date: '2024-01-20',
      status: 'Completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'TXN-002',
      type: 'Sale',
      description: 'Order #3428 - Smart Watch Series 5',
      amount: 299.99,
      fee: 9.00,
      net: 290.99,
      date: '2024-01-20',
      status: 'Pending',
      paymentMethod: 'PayPal'
    },
    {
      id: 'TXN-003',
      type: 'Refund',
      description: 'Refund for Order #3425',
      amount: -49.99,
      fee: -1.50,
      net: -48.49,
      date: '2024-01-19',
      status: 'Completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'TXN-004',
      type: 'Sale',
      description: 'Order #3427 - Bluetooth Speaker',
      amount: 79.99,
      fee: 2.40,
      net: 77.59,
      date: '2024-01-19',
      status: 'Completed',
      paymentMethod: 'Debit Card'
    },
    {
      id: 'TXN-005',
      type: 'Withdrawal',
      description: 'Bank transfer to account ****1234',
      amount: -500.00,
      fee: 0,
      net: -500.00,
      date: '2024-01-18',
      status: 'Completed',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,590',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Net Profit',
      value: '$16,280',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Fees',
      value: '$1,247',
      change: '+3.1%',
      trend: 'up',
      icon: Receipt,
    },
    {
      title: 'Available Balance',
      value: '$8,963',
      change: '+5.7%',
      trend: 'up',
      icon: Banknote,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Sale': return 'text-green-600';
      case 'Refund': return 'text-red-600';
      case 'Withdrawal': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Finances</h1>
              <p className="text-xs text-muted-foreground">Track revenue and expenses</p>
            </div>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
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

      {/* Compact Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Revenue Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Revenue & Profit</h3>
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
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Monthly Expenses</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View Details
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
                    <Bar dataKey="expenses" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{transaction.id}</h3>
                    <p className="text-xs text-muted-foreground">{transaction.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`${getStatusColor(transaction.status)} text-xs`}>
                      {transaction.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Receipt className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className={`text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-xs font-medium">{transaction.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className={`text-xs font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="text-xs font-semibold">
                      ${Math.abs(transaction.fee).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Net</p>
                    <p className={`text-xs font-semibold ${transaction.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${transaction.net.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground mb-1">Withdraw Funds</h3>
              <p className="text-xs text-muted-foreground">Transfer to bank</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground mb-1">Generate Invoice</h3>
              <p className="text-xs text-muted-foreground">Create invoices</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center mx-auto mb-2">
                <Download className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground mb-1">Tax Report</h3>
              <p className="text-xs text-muted-foreground">Download documents</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerFinances;
