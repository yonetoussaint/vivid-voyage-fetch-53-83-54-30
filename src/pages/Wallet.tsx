import { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  Send
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  timestamp: string;
}

export default function Wallet() {
  const [balance] = useState(4371.25);
  const [showBalance, setShowBalance] = useState(true);

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 500.00,
      description: 'Bank transfer',
      timestamp: 'Today, 2:30 PM',
    },
    {
      id: '2', 
      type: 'withdrawal',
      amount: 45.00,
      description: 'Nike Air Jordan',
      timestamp: 'Today, 10:15 AM',
    },
    {
      id: '3',
      type: 'transfer',
      amount: 124.99,
      description: 'Transfer to John',
      timestamp: 'Yesterday, 5:20 PM',
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
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageContainer maxWidth="lg" padding="md">
        <div className="space-y-8 py-6">
          
          {/* Balance Card */}
          <Card className="border-0 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gray-500">Available Balance</p>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {showBalance ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
                </button>
              </div>

              <div className="text-4xl font-light mb-8">
                {showBalance ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Money
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </Card>

          {/* Transactions */}
          <div>
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <div className="space-y-1">
              {recentTransactions.map((transaction) => (
                <button 
                  key={transaction.id} 
                  className="w-full p-4 hover:bg-gray-50 transition-colors rounded-lg text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{transaction.timestamp}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`font-medium text-sm ${
                        transaction.type === 'deposit' ? 'text-black' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}
