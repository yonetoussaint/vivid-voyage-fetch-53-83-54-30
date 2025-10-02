import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  CreditCard, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Eye,
  EyeOff,
  History,
  ShoppingCart,
  TrendingUp,
  Search,
  X,
  DollarSign,
  Smartphone,
  Send,
  Shield,
  ChevronRight,
  Zap,
  Gift,
  Star,
  Check
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import SectionHeader from '@/components/home/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SuperDealsSection from '@/components/home/SuperDealsSection';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile';
  brand: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function Wallet() {
  const [purchaseBalance] = useState(2847.50);
  const [salesBalance] = useState(1523.75);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeBalanceView, setActiveBalanceView] = useState<'total' | 'purchases' | 'sales'>('total');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch products for wallet deals section
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
  });

  const totalBalance = purchaseBalance + salesBalance;

  const quickActions = [
    {
      id: 'deposit',
      title: 'Deposit',
      icon: <ArrowDownLeft className="h-5 w-5" />,
      gradient: 'from-blue-500 to-blue-600',
      action: () => console.log('Deposit')
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: <ArrowUpRight className="h-5 w-5" />,
      gradient: 'from-green-500 to-green-600',
      action: () => console.log('Withdraw')
    },
    {
      id: 'pay',
      title: 'Pay in Store',
      icon: <ShoppingCart className="h-5 w-5" />,
      gradient: 'from-purple-500 to-purple-600',
      action: () => console.log('Pay')
    },
    {
      id: 'transfer',
      title: 'Transfer',
      icon: <Send className="h-5 w-5" />,
      gradient: 'from-orange-500 to-orange-600',
      action: () => console.log('Transfer')
    },
    {
      id: 'addcard',
      title: 'Add Card',
      icon: <Plus className="h-5 w-5" />,
      gradient: 'from-cyan-500 to-cyan-600',
      action: () => console.log('Add Card')
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true,
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'bank',
      brand: 'Bank of America',
      last4: '8765',
      isDefault: false,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'mobile',
      brand: 'Mobile Money',
      last4: '1234',
      isDefault: false,
      icon: <Smartphone className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      amount: 124.99,
      description: 'iPhone 15 Pro Max',
      timestamp: '2 min ago',
      status: 'completed',
      category: 'Electronics'
    },
    {
      id: '2', 
      type: 'purchase',
      amount: -45.00,
      description: 'Nike Air Jordan',
      timestamp: '1 hour ago',
      status: 'completed',
      category: 'Fashion'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 500.00,
      description: 'Bank transfer',
      timestamp: 'Yesterday',
      status: 'completed'
    },
    {
      id: '4',
      type: 'sale',
      amount: 89.50,
      description: 'Sony Headphones',
      timestamp: '2 days ago',
      status: 'completed',
      category: 'Electronics'
    },
    {
      id: '5',
      type: 'purchase',
      amount: -156.00,
      description: 'Samsung Galaxy Watch',
      timestamp: '3 days ago',
      status: 'pending',
      category: 'Electronics'
    },
  ];

  const getFilteredTransactions = useMemo(() => {
    let filtered = recentTransactions;

    if (activeTab !== 'all') {
      filtered = filtered.filter(t => {
        if (activeTab === 'purchases') return t.type === 'purchase';
        if (activeTab === 'sales') return t.type === 'sale';
        if (activeTab === 'deposits') return t.type === 'deposit' || t.type === 'withdrawal';
        return true;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  const getTransactionIcon = useCallback((type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-red-600" />;
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />;
      default:
        return <WalletIcon className="h-4 w-4 text-gray-600" />;
    }
  }, []);

  const getTransactionBg = useCallback((type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'purchase':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'deposit':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'withdrawal':
        return 'bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: recentTransactions.length },
    { id: 'purchases', label: 'Purchases', count: recentTransactions.filter(t => t.type === 'purchase').length },
    { id: 'sales', label: 'Sales', count: recentTransactions.filter(t => t.type === 'sale').length },
    { id: 'deposits', label: 'Transfers', count: recentTransactions.filter(t => t.type === 'deposit' || t.type === 'withdrawal').length }
  ];

  const displayBalance = activeBalanceView === 'total' ? totalBalance : 
                         activeBalanceView === 'purchases' ? purchaseBalance : salesBalance;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="full" padding="none">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <h1 className="text-lg font-bold text-foreground">Wallet</h1>
            <p className="text-xs text-muted-foreground">Manage your finances</p>
          </div>
        </div>

        <div className="space-y-4 pb-20">
          {/* Balance Overview Card */}
          <div className="px-4 pt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-5 w-5" />
                      <span className="font-medium text-sm">
                        {activeBalanceView === 'total' ? 'Total Balance' : 
                         activeBalanceView === 'purchases' ? 'Purchase Balance' : 'Sales Balance'}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="text-3xl font-bold mb-4">
                    {showBalance ? `$${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                  </div>

                  {/* Balance Type Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveBalanceView('total')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        activeBalanceView === 'total' 
                          ? 'bg-white text-blue-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Total
                    </button>
                    <button
                      onClick={() => setActiveBalanceView('purchases')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        activeBalanceView === 'purchases' 
                          ? 'bg-white text-blue-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Purchases
                    </button>
                    <button
                      onClick={() => setActiveBalanceView('sales')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        activeBalanceView === 'sales' 
                          ? 'bg-white text-blue-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Sales
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="px-4">
            <SectionHeader 
              title="Quick Actions" 
              icon={Zap}
              titleSize="sm"
            />
            <div 
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex-shrink-0 w-24"
                >
                  <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 text-white hover:shadow-lg transition-all active:scale-95`}>
                    <div className="flex flex-col items-center gap-2">
                      {action.icon}
                      <span className="text-xs font-medium text-center">{action.title}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-4">
            <SectionHeader 
              title="Payment Methods" 
              icon={CreditCard}
              titleSize="sm"
              viewAllText="Manage"
              viewAllLink="#"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`${method.color} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{method.brand}</p>
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          •••• {method.last4}
                          {method.expiryDate && ` • ${method.expiryDate}`}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Method Card */}
              <Card className="border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Add New Method</p>
                      <p className="text-xs text-muted-foreground">Card, Bank, or Mobile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="px-4">
            <SectionHeader 
              title="Recent Transactions" 
              icon={History}
              titleSize="sm"
              viewAllText="View All"
              viewAllLink="#"
            />
            
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg p-1 border border-gray-200 mb-3">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div>{tab.label}</div>
                    <div className={`text-xs ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {tab.count}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {getFilteredTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTransactionBg(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{transaction.timestamp}</span>
                            {transaction.category && (
                              <>
                                <span>•</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                  {transaction.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className={`font-bold text-sm ${
                            transaction.type === 'sale' || transaction.type === 'deposit' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {(transaction.type === 'purchase' || transaction.type === 'withdrawal') ? '-' : '+'}
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <Badge className={`text-xs mt-1 ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredTransactions.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">No transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Wallet Deals Section */}
          {products && products.length > 0 && (
            <div className="px-4">
              <SectionHeader 
                title="Pay with Wallet Deals" 
                icon={Gift}
                titleSize="sm"
                viewAllText="See All"
                viewAllLink="/trending"
              />
              <SuperDealsSection products={products} />
            </div>
          )}

          {/* Security & Limits */}
          <div className="px-4">
            <SectionHeader 
              title="Security & Limits" 
              icon={Shield}
              titleSize="sm"
            />
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Identity Verified</p>
                        <p className="text-xs text-muted-foreground">KYC Level 2</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Daily Limit</span>
                      <span className="font-medium">$5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Limit</span>
                      <span className="font-medium">$50,000</span>
                    </div>
                  </div>

                  <Button className="w-full mt-2" variant="outline" size="sm">
                    View Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
