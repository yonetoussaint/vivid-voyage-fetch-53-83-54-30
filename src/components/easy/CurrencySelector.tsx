import React from 'react';
import { DollarSign, Coins } from 'lucide-react';

const CurrencySelector = ({ currency, onCurrencyChange }) => (
  <div className="flex gap-2 w-full">
    <button
      onClick={() => onCurrencyChange('HTG')}
      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm border transition ${
        currency === 'HTG'
          ? 'bg-blue-50 border-blue-400 text-blue-600'
          : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Coins size={16} className={currency === 'HTG' ? 'text-blue-500' : 'text-gray-500'} />
      HTG
    </button>

    <button
      onClick={() => onCurrencyChange('USD')}
      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm border transition ${
        currency === 'USD'
          ? 'bg-green-50 border-green-400 text-green-600'
          : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <DollarSign size={16} className={currency === 'USD' ? 'text-green-500' : 'text-gray-500'} />
      USD
    </button>
  </div>
);

export default CurrencySelector;