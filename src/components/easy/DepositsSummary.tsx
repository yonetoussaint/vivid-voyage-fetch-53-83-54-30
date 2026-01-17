import React from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepositsSummary = ({
  vendeur,
  depots,
  isRecentlyAdded,
  getMontantHTG,
  isUSDDepot,
  getOriginalDepotAmount,
  getDepositDisplay,
  onEditDeposit,
  onDeleteDeposit,
  editingDeposit,
  isEditingThisDeposit
}) => {
  if (depots.length === 0) return null;

  // Helper function to parse breakdown and create sorted list items with totals
  const renderBreakdown = (depot) => {
    if (!depot || typeof depot !== 'object') return null;

    const breakdown = depot.breakdown;
    if (!breakdown) return null;

    // Parse sequences and extract numeric values for sorting
    const parsedSequences = breakdown.split(',').map(item => {
      const trimmed = item.trim();

      // Extract numeric value from different patterns
      let numericValue = 0;
      let displayTotal = '';
      let multiplier = 1;
      let value = 0;
      let currency = '';

      // Pattern: "5 × 20 USD" or "5 × 20 HTG"
      const multiplierMatch = trimmed.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
      if (multiplierMatch) {
        [, multiplier, value, currency] = multiplierMatch;
        const total = parseFloat(multiplier) * parseFloat(value);
        numericValue = total;
        displayTotal = `${formaterArgent(total)} ${currency}`;
      } 
      // Pattern: "20 USD" or "100 HTG"
      else {
        const valueMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
        if (valueMatch) {
          [, value, currency] = valueMatch;
          multiplier = 1;
          numericValue = parseFloat(value);
          displayTotal = `${formaterArgent(numericValue)} ${currency}`;
        }
      }

      return {
        text: trimmed,
        value: numericValue,
        displayTotal: displayTotal,
        isUSD: /USD/i.test(trimmed),
        multiplier: parseFloat(multiplier),
        singleValue: parseFloat(value),
        currency: currency
      };
    });

    // Sort by value descending (largest first)
    const sortedSequences = [...parsedSequences].sort((a, b) => b.value - a.value);

    // Calculate total of all sequences
    const sequencesTotal = sortedSequences.reduce((sum, seq) => sum + seq.value, 0);

    // Function to convert USD to HTG (replace with your actual conversion logic)
    const convertUSDToHTG = (usdAmount) => {
      // You should replace this with your actual exchange rate logic
      const exchangeRate = 132; // Example rate: 1 USD = 132 HTG
      return usdAmount * exchangeRate;
    };

    return (
      <div className="mt-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-medium opacity-80 flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
            <span>Composition</span>
          </div>
          <div className="text-[10px] opacity-70">
            <span className="opacity-60 mr-0.5">Total:</span>
            <span className="font-semibold">{formaterArgent(sequencesTotal)}</span>
          </div>
        </div>

        <div className="space-y-1">
          {sortedSequences.map((seq, idx) => {
            // Calculate HTG conversion for USD sequences
            const htgValue = seq.isUSD ? convertUSDToHTG(seq.value) : 0;
            const htgPerUnit = seq.isUSD ? convertUSDToHTG(seq.singleValue) : 0;
            
            return (
              <div key={idx} className="space-y-0.5">
                <div className={`flex items-center justify-between w-full group ${
                  seq.isUSD ? 'text-green-200' : ''
                }`}>
                  {/* Left column - Description */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        seq.isUSD 
                          ? 'bg-green-500 bg-opacity-60' 
                          : 'bg-white bg-opacity-40'
                      }`}></div>
                    </div>
                    <span className="text-[10px] opacity-90 truncate">{seq.text}</span>
                  </div>

                  {/* Right column - Total */}
                  <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded ml-1 flex-shrink-0 ${
                    seq.isUSD 
                      ? 'bg-green-900 bg-opacity-40 text-green-200' 
                      : 'bg-white bg-opacity-15'
                  }`}>
                    {seq.displayTotal}
                  </div>
                </div>
                
                {/* HTG Conversion for USD sequences */}
                {seq.isUSD && (
                  <div className="ml-3 pl-1 border-l border-green-800/50 border-dashed">
                    <div className="flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-0.5 opacity-70">
                        <span className="text-green-300">↳</span>
                        <span className="truncate">Conversion:</span>
                      </div>
                      <div className="flex items-center gap-1 ml-1">
                        {seq.multiplier > 1 && (
                          <>
                            <span className="opacity-70 truncate">{formaterArgent(htgPerUnit)}×{seq.multiplier}</span>
                            <span className="opacity-50">=</span>
                          </>
                        )}
                        <span className="font-medium bg-white/10 px-1 py-0.5 rounded truncate min-w-[60px] text-right">
                          {formaterArgent(htgValue)} HTG
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to get total value for sorting deposits
  const getDepositValue = (depot) => {
    if (!depot) return 0;
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return parseFloat(depot.montant) || 0;
      } else if (depot.value) {
        return parseFloat(depot.value) || 0;
      }
    }
    return parseFloat(depot) || 0;
  };

  // Sort deposits by value (largest first)
  const sortedDepots = [...depots].sort((a, b) => {
    const valueA = getDepositValue(a);
    const valueB = getDepositValue(b);
    return valueB - valueA;
  });

  return (
    <div className="pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
          <span className="text-xs font-medium opacity-90">Dépôts</span>
        </div>
        <span className="text-[10px] opacity-60 bg-white/10 px-1.5 py-0.5 rounded-full">
          {depots.length} dépôt{depots.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Deposit Cards Container */}
      <div className="flex flex-col gap-2.5">
        {sortedDepots.map((depot, idx) => {
          const originalIndex = depots.indexOf(depot);
          const montantHTG = getMontantHTG(depot);
          const isUSD = isUSDDepot(depot);
          const montantOriginal = getOriginalDepotAmount(depot);
          const isRecent = isRecentlyAdded(vendeur, originalIndex);
          const hasBreakdown = depot && typeof depot === 'object' && depot.breakdown;
          const isEditing = isEditingThisDeposit(vendeur, originalIndex);

          // Get display amount based on deposit type
          let displayAmount = '';
          if (depot && typeof depot === 'object') {
            if (depot.devise === 'USD') {
              const amount = parseFloat(depot.montant) || 0;
              displayAmount = `${amount} USD`;
            } else if (depot.value) {
              const amount = parseFloat(depot.value) || 0;
              displayAmount = `${formaterArgent(amount)} HTG`;
            }
          } else {
            const amount = parseFloat(depot) || 0;
            displayAmount = `${formaterArgent(amount)} HTG`;
          }

          return (
            <div 
              key={originalIndex} 
              className={`
                deposit-card p-2.5 rounded-xl text-sm
                transition-all duration-200 ease-out
                ${isRecent ? 'animate-pulse-subtle' : ''}
                ${isEditing 
                  ? 'ring-2 ring-amber-400 bg-amber-500 bg-opacity-10' 
                  : isUSD 
                  ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border border-green-800/30' 
                  : 'bg-white/10 border border-white/10'
                }
                ${isRecent && !isEditing ? 'ring-2 ring-green-400/30 shadow-lg shadow-green-500/10' : ''}
                hover:bg-opacity-40 active:scale-[0.99] active:opacity-90
              `}
            >
              {/* Card Header - Deposit Number and Action Buttons */}
              <div className="flex items-center justify-between mb-2.5">
                {/* Deposit Number */}
                <div className="flex items-center gap-1.5">
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${isUSD 
                      ? 'bg-gradient-to-br from-green-600 to-green-700 text-green-50 shadow-sm shadow-green-800/30' 
                      : 'bg-gradient-to-br from-white/25 to-white/15 text-white shadow-sm shadow-white/10'
                    }
                    ${isRecent ? 'animate-bounce-subtle' : ''}
                  `}>
                    {originalIndex + 1}
                  </div>
                  {isRecent && !isEditing && (
                    <Check size={11} className="text-green-300 flex-shrink-0 animate-pulse" />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDeposit(vendeur, originalIndex);
                    }}
                    className={`p-1 rounded-lg transition-all ${
                      isEditing
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                        : 'bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-opacity-30 active:scale-95'
                    }`}
                    title="Éditer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDeposit(vendeur, originalIndex);
                    }}
                    className="p-1 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 active:scale-95 rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Main Deposit Amount */}
              <div className="mb-2">
                <div className="flex flex-col gap-0.5">
                  <div className={`text-base font-bold truncate ${
                    isUSD ? 'text-green-100' : 'text-white'
                  }`}>
                    {displayAmount}
                  </div>
                  
                  {/* HTG Conversion for USD */}
                  {isUSD && (
                    <div className="flex items-center gap-1.5">
                      <div className="text-[10px] opacity-70 bg-green-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="opacity-70">≈</span>
                        <span className="font-medium">{formaterArgent(montantHTG)} HTG</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown Section */}
              {hasBreakdown && renderBreakdown(depot)}

              {/* Card Footer - Additional Info */}
              <div className="mt-2 pt-1.5 border-t border-white/10">
                <div className="text-[9px] opacity-60 flex items-center justify-between">
                  <span>Dépôt #{originalIndex + 1}</span>
                  <span>{isUSD ? 'USD → HTG' : 'Local'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Deposits Message */}
      <div className="mt-4 text-center">
        <div className="text-[10px] opacity-50 italic">
          Glissez pour voir plus de dépôts
        </div>
      </div>

      {/* Add custom CSS for mobile optimizations */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }

        .deposit-card {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* Mobile scroll hint */
        @media (max-width: 640px) {
          .deposit-card {
            min-height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default DepositsSummary;