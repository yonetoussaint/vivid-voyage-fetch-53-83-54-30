import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, Plus, Eye, EyeOff, X, Check, ArrowLeftRight, Bitcoin, DollarSign, Coins, CreditCard, History, BarChart, Gem, Diamond, Circle } from 'lucide-react';

export default function BinanceWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const wallets = {
    main: {
      name: 'Main Wallet',
      currency: 'HTG',
      balance: 1736590.00,
      usdValue: 12847.56,
      change: 3.42,
      icon: <Coins className="w-6 h-6 text-white" />,
      color: 'from-blue-600 to-cyan-700'
    },
    crypto: {
      name: 'Crypto Wallet',
      currency: 'HTG',
      balance: 1685234.80,
      usdValue: 12475.64,
      change: 2.87,
      icon: <Bitcoin className="w-6 h-6 text-white" />,
      color: 'from-orange-600 to-yellow-600'
    },
    usd: {
      name: 'USD Wallet',
      currency: 'USD',
      balance: 371.92,
      usdValue: 371.92,
      change: 0.00,
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'from-green-600 to-emerald-700'
    }
  };

  const currentWallet = wallets[selectedWallet];

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.2451, value: 1431000.00, change: 2.15, icon: <Bitcoin className="w-6 h-6 text-white" />, color: 'bg-orange-500' },
    { symbol: 'ETH', name: 'Ethereum', amount: 0.8234, value: 253600.00, change: -0.87, icon: <Gem className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
    { symbol: 'BNB', name: 'BNB', amount: 1.2, value: 50400.00, change: 5.23, icon: <Diamond className="w-6 h-6 text-white" />, color: 'bg-yellow-500' },
    { symbol: 'USDT', name: 'Tether', amount: 0, value: 0, change: 0.01, icon: <Circle className="w-6 h-6 text-white" />, color: 'bg-green-500' },
  ];

  const depositMethods = [
    { id: 'moncash', name: 'MonCash', currency: 'HTG', color: 'bg-red-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'natcash', name: 'NatCash', currency: 'HTG', color: 'bg-blue-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'sogebank', name: 'SogeBank', currency: 'HTG', color: 'bg-green-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'bnc', name: 'BNC', currency: 'HTG', color: 'bg-purple-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'usd', name: 'Bank Transfer', currency: 'USD', color: 'bg-emerald-500', icon: <CreditCard className="w-6 h-6 text-white" /> },
    { id: 'usdt', name: 'USDT (TRC20)', currency: 'USDT', color: 'bg-teal-500', icon: <Coins className="w-6 h-6 text-white" /> },
    { id: 'pesos', name: 'Dominican Pesos', currency: 'DOP', color: 'bg-indigo-500', icon: <DollarSign className="w-6 h-6 text-white" /> },
  ];

  const transactions = [
    { type: 'buy', asset: 'BTC', amount: 0.0123, fiat: '16,590 HTG', date: 'Dec 13, 14:23', method: 'MonCash' },
    { type: 'buy', asset: 'ETH', amount: 0.15, fiat: '30,780 HTG', date: 'Dec 13, 10:05', method: 'SogeBank' },
    { type: 'deposit', asset: 'HTG', amount: 50000, fiat: '50,000 HTG', date: 'Dec 12, 18:30', method: 'NatCash' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="px-4 py-4 sm:py-6">
        {/* Removed Wallet Selector tabs - Now using MainLayout tabs */}

        {/* Balance Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-500">
              {currentWallet.name} Balance
            </span>
            <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-gray-200 rounded transition">
              {showBalance ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-end gap-2 sm:gap-4 mb-1">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900">
              {showBalance ? `${currentWallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <span className="text-lg sm:text-2xl text-gray-500 mb-1">{currentWallet.currency}</span>
          </div>

          {currentWallet.currency !== 'USD' && (
            <div className="text-sm sm:text-base text-gray-600 mb-3">
              ≈ ${showBalance ? currentWallet.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'} USD
            </div>
          )}

          <div className={`inline-flex items-center gap-1 text-sm sm:text-base font-medium ${currentWallet.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentWallet.change >= 0 ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>{currentWallet.change >= 0 ? '+' : ''}{currentWallet.change}%</span>
            <span className="text-gray-400 ml-1">Today</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
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
              <span>Trade</span>
            </button>
          </div>
        </div>

        {/* Exchange Rates Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-xl font-bold text-gray-900">Exchange Rates</h3>
            <button className="text-xs sm:text-sm text-yellow-500 hover:text-yellow-600 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition cursor-pointer shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs sm:text-sm font-medium">USDT/HTG</span>
                <TrendingUp className="w-4 h-4 text-white/90" />
              </div>
              <div className="font-bold text-white text-xl sm:text-2xl mb-1">135.25</div>
              <div className="text-xs sm:text-sm text-white/90">+2.15% today</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition cursor-pointer shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs sm:text-sm font-medium">HTG/USD</span>
                <TrendingDown className="w-4 h-4 text-white/90" />
              </div>
              <div className="font-bold text-white text-xl sm:text-2xl mb-1">0.0074</div>
              <div className="text-xs sm:text-sm text-white/90">-0.45% today</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition cursor-pointer shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs sm:text-sm font-medium">BTC/HTG</span>
                <TrendingUp className="w-4 h-4 text-white/90" />
              </div>
              <div className="font-bold text-white text-xl sm:text-2xl mb-1">5.84M</div>
              <div className="text-xs sm:text-sm text-white/90">+3.28% today</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition cursor-pointer shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs sm:text-sm font-medium">ETH/HTG</span>
                <TrendingUp className="w-4 h-4 text-white/90" />
              </div>
              <div className="font-bold text-white text-xl sm:text-2xl mb-1">308.5K</div>
              <div className="text-xs sm:text-sm text-white/90">+1.87% today</div>
            </div>
          </div>
        </div>

        {/* Assets List - Only show for Crypto Wallet */}
        {selectedWallet === 'crypto' && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-xl font-bold text-gray-900">Crypto Assets</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:bg-gray-50 transition cursor-pointer border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${asset.color} rounded-full flex items-center justify-center shadow-lg`}>
                        {asset.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">{asset.symbol}</span>
                          <span className="text-xs sm:text-sm text-gray-500">{asset.name}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">{asset.amount.toFixed(4)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-sm sm:text-base mb-0.5">{asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} HTG</div>
                      <div className={`text-xs sm:text-sm font-semibold ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
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
                      tx.type === 'buy' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {tx.type === 'buy' ? 
                        <Plus className={`w-4 h-4 sm:w-5 sm:h-5 text-green-600`} /> : 
                        <ArrowDownLeft className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600`} />
                      }
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 capitalize text-sm sm:text-base mb-0.5">
                        {tx.type === 'buy' ? `Buy ${tx.asset}` : 'Deposit'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">{tx.date} • {tx.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm sm:text-base ${tx.type === 'buy' ? 'text-green-600' : 'text-blue-600'}`}>
                      {tx.type === 'buy' ? `+${tx.amount}` : `+${tx.amount}`} {tx.asset}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{tx.fiat}</div>
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
                  setSelectedCurrency(null);
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
                    onClick={() => setSelectedCurrency(method.id)}
                    className={`w-full bg-white rounded-xl p-4 transition border-2 shadow-sm ${
                      selectedCurrency === method.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                          {method.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-base">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.currency}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedCurrency === method.id ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300'
                      }`}>
                        {selectedCurrency === method.id && (
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
                disabled={!selectedCurrency}
                onClick={() => {
                  if (selectedCurrency) {
                    setShowDepositModal(false);
                    setSelectedCurrency(null);
                  }
                }}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition ${
                  selectedCurrency 
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