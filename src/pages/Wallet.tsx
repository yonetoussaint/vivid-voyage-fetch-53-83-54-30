import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, Plus, Eye, EyeOff, X, Check, ArrowLeftRight, CreditCard } from 'lucide-react';

export default function BinanceWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const balance = 1736590.00;
  const change = 3.42; // Positive percentage change

  const depositMethods = [
    { id: 'moncash', name: 'MonCash', color: 'bg-red-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'natcash', name: 'NatCash', color: 'bg-blue-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'sogebank', name: 'SogeBank', color: 'bg-green-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'bnc', name: 'BNC', color: 'bg-purple-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
  ];

  const transactions = [
    { type: 'deposit', amount: '50,000', date: 'Dec 12, 18:30', method: 'NatCash' },
    { type: 'withdraw', amount: '25,000', date: 'Dec 11, 14:15', method: 'MonCash' },
    { type: 'deposit', amount: '100,000', date: 'Dec 10, 09:45', method: 'SogeBank' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="px-4 py-4 sm:py-6">
        {/* Balance Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)} 
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              {showBalance ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-end gap-2 sm:gap-4 mb-1">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900">
              {showBalance ? `${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <span className="text-lg sm:text-2xl text-gray-500 mb-1">HTG</span>
          </div>

          {/* Percentage Change */}
          <div className={`inline-flex items-center gap-1 text-sm sm:text-base font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>{change >= 0 ? '+' : ''}{change}%</span>
            <span className="text-gray-400 ml-1">Today</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
            <button 
              onClick={() => setShowDepositModal(true)}
              className="bg-yellow-400 text-black py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold hover:bg-yellow-500 transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Deposit</span>
            </button>
            <button className="bg-white border border-gray-200 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold hover:bg-gray-100 transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Withdraw</span>
            </button>
            <button className="bg-white border border-gray-200 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold hover:bg-gray-100 transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base">
              <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium">View All</button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:bg-gray-50 transition border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'deposit' ? 
                        <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : 
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 capitalize text-sm sm:text-base mb-0.5">
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">{tx.date} • {tx.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm sm:text-base ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} HTG
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
              <button 
                onClick={() => {
                  setShowDepositModal(false);
                  setSelectedMethod(null);
                }} 
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
              <div className="space-y-2">
                {depositMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full bg-white rounded-xl p-4 transition border-2 shadow-sm ${
                      selectedMethod === method.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                          {method.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-base">{method.name}</div>
                          <div className="text-sm text-gray-500">HTG</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <Check className="w-3 h-3 text-black" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4">
              <button 
                disabled={!selectedMethod}
                onClick={() => {
                  if (selectedMethod) {
                    setShowDepositModal(false);
                    setSelectedMethod(null);
                  }
                }}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition ${
                  selectedMethod 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}