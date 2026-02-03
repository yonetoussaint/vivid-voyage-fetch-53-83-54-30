import React from 'react';
import { DollarSign, Coins } from 'lucide-react';

const CurrencySelector = ({ currency, onCurrencyChange }) => (
  <div className="flex items-center w-full bg-gray-200 rounded-full p-2 text-sm">
    {/* HTG */}
    <div
      onClick={() => onCurrencyChange('HTG')}
      className={`flex-1 flex items-center justify-center py-0.5 gap-2 cursor-pointer rounded-full transition-all duration-200 ${
        currency === 'HTG' ? 'bg-blue-500 text-white' : 'text-gray-700'
      }`}
    >
      <Coins size={20} />
      HTG
    </div>

    {/* USD */}
    <div
      onClick={() => onCurrencyChange('USD')}
      className={`flex-1 flex items-center justify-center py-0.5 gap-2 cursor-pointer rounded-full transition-all duration-200 ${
        currency === 'USD' ? 'bg-green-500 text-white' : 'text-gray-700'
      }`}
    >
      <DollarSign size={20} />
      USD
    </div>
  </div>
);

export default CurrencySelector;