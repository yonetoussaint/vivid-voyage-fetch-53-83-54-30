import React from 'react';
import { Plus } from 'lucide-react';

const DepositInputsSection = ({
  vendeur,
  vendorState,
  isSequenceManagerOpen,
  handleCurrencyButtonClick,
  toggleSequenceManager,
  handleSimpleDeposit,
  children
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">Entrées Dépôts</span>
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
          <button
            onClick={() => toggleSequenceManager(vendeur)}
            className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
              isSequenceManagerOpen
                ? 'bg-amber-500 text-white'
                : 'bg-amber-500 bg-opacity-20 text-white'
            }`}
            title="Gérer les séquences de dépôt"
          >
            <Plus size={12} />
            Séq.
          </button>
        </div>
      </div>

      {/* Children content (SequenceManager or Simple deposit) */}
      {children}

      {/* Simple deposit addition (when sequence manager is not open) */}
      {!isSequenceManagerOpen && (
        <div className="space-y-2">
          <p className="text-[10px] opacity-70 text-center">
            Cliquez sur "Séq." pour ajouter plusieurs séquences à un dépôt
          </p>
          
          {/* Quick add section - simple deposits */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white font-bold text-xs">
                HTG
              </span>
            </div>
            <input
              type="number"
              data-simple={vendeur}
              placeholder="Montant simple..."
              className="w-full pl-10 pr-20 py-2.5 text-sm sm:text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSimpleDeposit(vendeur);
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
              <button
                onClick={() => handleSimpleDeposit(vendeur)}
                className="px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <Plus size={12} />
                Simple
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositInputsSection;