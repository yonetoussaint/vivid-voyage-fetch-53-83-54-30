import React from 'react';
import { DollarSign, Coins } from 'lucide-react';

const CurrencySelector = ({ currency, onCurrencyChange }) => (
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={() => onCurrencyChange('HTG')}
      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
        currency === 'HTG'
          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Coins size={18} className={currency === 'HTG' ? 'text-blue-600' : 'text-gray-500'} />
      <span className="font-bold">HTG</span>
    </button>
    <button
      onClick={() => onCurrencyChange('USD')}
      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
        currency === 'USD'
          ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <DollarSign size={18} className={currency === 'USD' ? 'text-green-600' : 'text-gray-500'} />
      <span className="font-bold">USD</span>
    </button>
  </div>
);

export default CurrencySelector;