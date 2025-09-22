import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Eye,
  EyeOff,
  History,
  ShoppingCart,
  TrendingUp,
  Download,
  Filter,
  Search,
  X,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
}

export default function Wallet() {
  const [purchaseBalance] = useState(2847.50);
  const [salesBalance] = useState(1523.75);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [balanceAnimation, setBalanceAnimation] = useState(false);

  // Trigger balance animation on mount
  useEffect(() => {
    setBalanceAnimation(true);
  }, []);

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
    {
      id: '6',
      type: 'withdrawal',
      amount: -200.00,
      description: 'ATM Withdrawal',
      timestamp: '4 days ago',
      status: 'completed'
    }
  ];

  const totalBalance = purchaseBalance + salesBalance;

  const getFilteredTransactions = () => {
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
  };

  const getTransactionIcon = (type: string) => {
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
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionBg = (type: string) => {
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
  };

  const tabs = [
    { id: 'all', label: 'All', count: recentTransactions.length },
    { id: 'purchases', label: 'Purchases', count: recentTransactions.filter(t => t.type === 'purchase').length },
    { id: 'sales', label: 'Sales', count: recentTransactions.filter(t => t.type === 'sale').length },
    { id: 'deposits', label: 'Transfers', count: recentTransactions.filter(t => t.type === 'deposit' || t.type === 'withdrawal').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Wallet</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your finances</p>
          </div>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <span className="font-medium">Total Balance</span>
            </div>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>

          <div className={`transition-all duration-700 ${balanceAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="text-4xl font-bold mb-4">
              {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-white/30 transition-all duration-200 active:scale-95">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="h-4 w-4" />
                <span className="font-medium text-sm">Deposit</span>
              </div>
              <div className="text-xs opacity-80">Add funds</div>
            </button>

            <button className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-white/30 transition-all duration-200 active:scale-95">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="h-4 w-4" />
                <span className="font-medium text-sm">Send</span>
              </div>
              <div className="text-xs opacity-80">Transfer money</div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">This Month</div>
            <div className="text-lg font-bold text-green-600">+$324.50</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Spent</div>
            <div className="text-lg font-bold text-red-600">-$201.00</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pb-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 border border-gray-200 dark:border-gray-800">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
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
      </div>

      {/* Transactions */}
      <div className="px-4 pb-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {getFilteredTransactions().map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 active:bg-gray-100 dark:active:bg-gray-700"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getTransactionBg(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {transaction.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{transaction.timestamp}</span>
                        {transaction.category && (
                          <>
                            <span>•</span>
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                              {transaction.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <div className={`font-bold text-sm ${
                      transaction.type === 'sale' || transaction.type === 'deposit' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {(transaction.type === 'purchase' || transaction.type === 'withdrawal') ? '-' : '+'}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : transaction.status === 'pending' 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getFilteredTransactions().length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                No transactions found
              </div>
            </div>
          )}

          {getFilteredTransactions().length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium py-2 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}