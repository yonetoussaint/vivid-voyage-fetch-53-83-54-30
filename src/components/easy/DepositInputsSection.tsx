import React from 'react';
import { Plus } from 'lucide-react';

const DepositInputsSection = ({
  vendeur,
  vendorState,
  handleCurrencyButtonClick,
  children
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">Dépôt Séquentiel</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => handleCurrencyButtonClick(vendeur, 'HTG')}
            className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
              (!vendorState || vendorState.currency === 'HTG')
                ? 'bg-white text-indigo-600'
                : 'bg-white bg-opacity-20 text-white'
            }`}
          >
            <Plus size={12} />
            HTG
          </button>
          <button
            onClick={() => handleCurrencyButtonClick(vendeur, 'USD')}
            className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
              vendorState?.currency === 'USD'
                ? 'bg-green-500 text-white'
                : 'bg-green-500 bg-opacity-20 text-white'
            }`}
          >
            <Plus size={12} />
            USD
          </button>
        </div>
      </div>

      {/* Children content (SequenceManager) */}
      {children}
    </div>
  );
};

export default DepositInputsSection;