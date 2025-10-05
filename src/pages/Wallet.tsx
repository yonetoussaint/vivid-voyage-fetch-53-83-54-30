
import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  Send,
  Download,
  TrendingUp,
  Clock,
  Settings,
  Shield,
  ChevronRight,
  DollarSign,
  Repeat,
  Target,
  BarChart3,
  Lock,
  ShoppingCart,
  Store,
  Wallet as WalletIcon,
  TrendingDown,
  Receipt,
  FileText
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Transaction {
  id: string;
  type: 'purchase' | 'deposit' | 'withdrawal' | 'payment_received' | 'payout';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  relatedTo?: string;
}

interface QuickAction {
  id: string;
  icon: any;
  label: string;
  action: string;
  color: string;
  description: string;
}

export default function Wallet() {
  const { user } = useAuth();
  const { data: sellerData } = useSellerByUserId(user?.id || '');
  const isSeller = !!sellerData;

  const [buyerBalance] = useState(1247.50);
  const [sellerBalance] = useState(3124.75);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>(isSeller ? 'seller' : 'buyer');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'deposit' | 'withdrawal' | 'payment_received' | 'payout'>('all');

  // Buyer Quick Actions
  const buyerActions: QuickAction[] = [
    { id: '1', icon: Plus, label: 'Add Money', action: 'add', color: 'bg-blue-600', description: 'Top up your wallet' },
    { id: '2', icon: ShoppingCart, label: 'Shop', action: 'shop', color: 'bg-green-600', description: 'Browse products' },
    { id: '3', icon: Receipt, label: 'Purchases', action: 'purchases', color: 'bg-purple-600', description: 'Order history' },
    { id: '4', icon: Repeat, label: 'Auto-top up', action: 'auto', color: 'bg-orange-600', description: 'Set automatic refills' },
  ];

  // Seller Quick Actions
  const sellerActions: QuickAction[] = [
    { id: '1', icon: Download, label: 'Withdraw', action: 'withdraw', color: 'bg-green-600', description: 'Transfer to bank' },
    { id: '2', icon: BarChart3, label: 'Sales', action: 'sales', color: 'bg-blue-600', description: 'View analytics' },
    { id: '3', icon: FileText, label: 'Invoices', action: 'invoices', color: 'bg-purple-600', description: 'Generate receipts' },
    { id: '4', icon: Target, label: 'Payouts', action: 'payouts', color: 'bg-orange-600', description: 'Scheduled transfers' },
  ];

  // Sample transactions
  const buyerTransactions: Transaction[] = [
    {
      id: '1',
      type: 'purchase',
      amount: -45.99,
      description: 'Nike Air Jordan - Order #3429',
      timestamp: 'Today, 2:30 PM',
      status: 'completed',
      relatedTo: 'Electronics Store'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 500.00,
      description: 'Wallet top-up via Credit Card',
      timestamp: 'Today, 10:15 AM',
      status: 'completed'
    },
    {
      id: '3',
      type: 'purchase',
      amount: -124.99,
      description: 'Smart Watch Series 5 - Order #3428',
      timestamp: 'Yesterday, 5:20 PM',
      status: 'completed',
      relatedTo: 'Tech World'
    },
  ];

  const sellerTransactions: Transaction[] = [
    {
      id: '1',
      type: 'payment_received',
      amount: 149.99,
      description: 'Sale: Wireless Earbuds Pro',
      timestamp: 'Today, 3:15 PM',
      status: 'completed',
      relatedTo: 'Order #3429'
    },
    {
      id: '2',
      type: 'payment_received',
      amount: 299.99,
      description: 'Sale: Smart Watch Series 5',
      timestamp: 'Today, 11:30 AM',
      status: 'pending',
      relatedTo: 'Order #3428'
    },
    {
      id: '3',
      type: 'payout',
      amount: -1000.00,
      description: 'Bank transfer to account ****1234',
      timestamp: 'Yesterday, 9:00 AM',
      status: 'completed'
    },
  ];

  const currentBalance = activeTab === 'buyer' ? buyerBalance : sellerBalance;
  const currentTransactions = activeTab === 'buyer' ? buyerTransactions : sellerTransactions;
  const currentActions = activeTab === 'buyer' ? buyerActions : sellerActions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4" />;
      case 'withdrawal':
      case 'payout':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'payment_received':
        return <Store className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'payment_received':
        return 'bg-green-50 text-green-600';
      case 'purchase':
      case 'withdrawal':
      case 'payout':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTransactions = filterType === 'all' 
    ? currentTransactions 
    : currentTransactions.filter(t => t.type === filterType);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="lg" padding="none">
        <div className="space-y-4 pb-20">
          
          {/* Header */}
          <div className="bg-white px-4 py-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-6 w-6 text-gray-900" />
                <h1 className="text-2xl font-semibold">Wallet</h1>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {activeTab === 'buyer' ? 'Shop and pay seamlessly' : 'Accept payments and manage earnings'}
            </p>
          </div>

          {/* Tabs for Buyer/Seller */}
          {isSeller && (
            <div className="px-4">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buyer' | 'seller')}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="buyer" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Buyer
                  </TabsTrigger>
                  <TabsTrigger value="seller" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Seller
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Balance Card */}
          <div className="px-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-gray-300">
                      {activeTab === 'buyer' ? 'Shopping Balance' : 'Available Earnings'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-1">
                    {activeTab === 'buyer' ? 'Available to spend' : 'Ready to withdraw'}
                  </p>
                  <div className="text-4xl font-light">
                    {showBalance ? `$${currentBalance.toLocaleString('en-US', { minimumFractionDigals: 2 })}` : '••••••'}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  {currentActions.map((action) => (
                    <button
                      key={action.id}
                      className="flex flex-col items-center gap-2"
                      title={action.description}
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs text-gray-300">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="px-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    {activeTab === 'buyer' ? (
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'buyer' ? 'Total Spent This Month' : 'Total Sales This Month'}
                    </p>
                    <p className="text-sm font-semibold">
                      {activeTab === 'buyer' ? '$1,245.50' : '$4,589.99'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">vs Last Month</p>
                  <p className={`text-sm font-semibold ${activeTab === 'buyer' ? 'text-green-600' : 'text-green-600'}`}>
                    {activeTab === 'buyer' ? '-15%' : '+28%'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Recent Activity</h2>
              <button className="text-xs text-gray-500 hover:text-gray-700">View All</button>
            </div>

            {/* Transaction Filters */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
              {['all', ...(activeTab === 'buyer' ? ['deposit', 'purchase'] : ['payment_received', 'payout'])].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === type
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <button 
                  key={transaction.id} 
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      getTransactionColor(transaction.type)
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                        <span className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          • {transaction.status}
                        </span>
                      </div>
                      {transaction.relatedTo && (
                        <p className="text-xs text-gray-400 mt-0.5">{transaction.relatedTo}</p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`font-semibold text-sm ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div className="px-4">
            <h2 className="text-sm font-semibold mb-3">
              {activeTab === 'buyer' ? 'Shopping Tools' : 'Seller Tools'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {activeTab === 'buyer' ? (
                <>
                  <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-xs text-gray-500">Set limits</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>

                  <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                        <Repeat className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Auto-refill</p>
                        <p className="text-xs text-gray-500">Enable</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Analytics</p>
                        <p className="text-xs text-gray-500">View reports</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>

                  <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Payouts</p>
                        <p className="text-xs text-gray-500">Schedule</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}
