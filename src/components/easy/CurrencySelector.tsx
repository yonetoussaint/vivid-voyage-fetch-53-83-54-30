import React from 'react';
import { DollarSign, Coins } from 'lucide-react';

const CurrencySelector = ({ currency, onCurrencyChange }) => (
  <div className="flex gap-3 justify-center">
    {/* HTG */}
    <div
      onClick={() => onCurrencyChange('HTG')}
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
        currency === 'HTG'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Coins size={22} />
      <span className="font-semibold text-sm">HTG</span>
    </div>

    {/* USD */}
    <div
      onClick={() => onCurrencyChange('USD')}
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
        currency === 'USD'
          ? 'bg-green-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <DollarSign size={22} />
      <span className="font-semibold text-sm">USD</span>
    </div>
  </div>
);

export default CurrencySelector;