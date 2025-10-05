
import { useState } from 'react';
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
  Users,
  Settings,
  Gift,
  Zap,
  Shield,
  ChevronRight,
  DollarSign,
  Repeat,
  PiggyBank,
  Target,
  Calendar,
  BarChart3,
  Lock,
  Smartphone
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'reward';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface QuickAction {
  id: string;
  icon: any;
  label: string;
  action: string;
  color: string;
}

export default function Wallet() {
  const [balance] = useState(4371.25);
  const [savingsBalance] = useState(1250.00);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');

  const quickActions: QuickAction[] = [
    { id: '1', icon: Plus, label: 'Add Money', action: 'add', color: 'bg-black' },
    { id: '2', icon: Send, label: 'Send', action: 'send', color: 'bg-blue-500' },
    { id: '3', icon: Download, label: 'Request', action: 'request', color: 'bg-green-500' },
    { id: '4', icon: Repeat, label: 'Split Bill', action: 'split', color: 'bg-purple-500' },
  ];

  const features = [
    { icon: PiggyBank, label: 'Savings', value: `$${savingsBalance.toFixed(2)}`, trend: '+12%' },
    { icon: TrendingUp, label: 'Investments', value: '$2,845', trend: '+8.5%' },
    { icon: Gift, label: 'Rewards', value: '450 pts', trend: 'New' },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 500.00,
      description: 'Bank transfer',
      timestamp: 'Today, 2:30 PM',
      status: 'completed'
    },
    {
      id: '2', 
      type: 'withdrawal',
      amount: 45.00,
      description: 'Nike Air Jordan',
      timestamp: 'Today, 10:15 AM',
      status: 'completed'
    },
    {
      id: '3',
      type: 'transfer',
      amount: 124.99,
      description: 'Transfer to John',
      timestamp: 'Yesterday, 5:20 PM',
      status: 'completed'
    },
    {
      id: '4',
      type: 'reward',
      amount: 25.00,
      description: 'Cashback reward',
      timestamp: 'Yesterday, 2:10 PM',
      status: 'completed'
    },
    {
      id: '5',
      type: 'deposit',
      amount: 1000.00,
      description: 'Salary deposit',
      timestamp: '2 days ago',
      status: 'completed'
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'transfer':
        return <Send className="h-4 w-4" />;
      case 'reward':
        return <Gift className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
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

  const filteredTransactions = activeTab === 'all' 
    ? recentTransactions 
    : recentTransactions.filter(t => t.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="lg" padding="none">
        <div className="space-y-4 pb-20">
          
          {/* Header */}
          <div className="bg-white px-4 py-6">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-semibold">Wallet</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <div className="px-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-gray-300">Secured Balance</span>
                  </div>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-1">Total Balance</p>
                  <div className="text-4xl font-light">
                    {showBalance ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className="flex flex-col items-center gap-2"
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

          {/* Features Grid */}
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors text-left"
                >
                  <feature.icon className="h-5 w-5 text-gray-700 mb-3" />
                  <p className="text-xs text-gray-500 mb-1">{feature.label}</p>
                  <p className="text-sm font-semibold mb-1">{feature.value}</p>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-green-50 text-green-700 border-0">
                    {feature.trend}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly Spending</p>
                    <p className="text-sm font-semibold">$1,245.50</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">vs Last Month</p>
                  <p className="text-sm font-semibold text-green-600">-15%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="px-4">
            <h2 className="text-sm font-semibold mb-3">Services</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Cards</p>
                    <p className="text-xs text-gray-500">2 active</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Goals</p>
                    <p className="text-xs text-gray-500">3 active</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Bills</p>
                    <p className="text-xs text-gray-500">Auto-pay</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Security</p>
                    <p className="text-xs text-gray-500">2FA enabled</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Transactions</h2>
              <button className="text-xs text-gray-500 hover:text-gray-700">View All</button>
            </div>

            {/* Transaction Filters */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'deposit', 'withdrawal', 'transfer'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                      transaction.type === 'deposit' ? 'bg-green-50 text-green-600' :
                      transaction.type === 'withdrawal' ? 'bg-red-50 text-red-600' :
                      transaction.type === 'transfer' ? 'bg-blue-50 text-blue-600' :
                      'bg-purple-50 text-purple-600'
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
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`font-semibold text-sm ${
                        transaction.type === 'deposit' || transaction.type === 'reward' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Referral Banner */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Invite Friends</h3>
                  <p className="text-sm text-blue-100 mb-3">Get $25 for each friend who joins</p>
                  <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Now
                  </Button>
                </div>
                <Gift className="h-12 w-12 text-blue-200" />
              </div>
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}
