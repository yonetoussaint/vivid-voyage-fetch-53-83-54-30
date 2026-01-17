import React from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepositsSummary = ({
  vendeur,
  depots,
  isRecentlyAdded,
  getMontantHTG,
  isUSDDepot,
  getOriginalDepositAmount,
  getDepositDisplay,
  onEditDeposit,
  onDeleteDeposit,
  editingDeposit,
  isEditingThisDeposit,
  exchangeRate = 132 // Default exchange rate, should come from props/context
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
        currency: currency.toUpperCase()
      };
    });

    // Sort by value descending (largest first)
    const sortedSequences = [...parsedSequences].sort((a, b) => b.value - a.value);

    // Calculate total of all sequences
    const sequencesTotal = sortedSequences.reduce((sum, seq) => sum + seq.value, 0);

    // Function to convert USD to HTG
    const convertUSDToHTG = (usdAmount) => {
      return usdAmount * exchangeRate;
    };

    return (
      <div className="mt-3">
        {/* Breakdown Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-medium opacity-90 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
            <span>Composition</span>
          </div>
          <div className="text-xs opacity-80">
            <span className="opacity-60 mr-1">Total:</span>
            <span className="font-semibold">{formaterArgent(sequencesTotal)}</span>
          </div>
        </div>

        {/* Separate Cards for each sequence */}
        <div className="grid grid-cols-1 gap-2">
          {sortedSequences.map((seq, idx) => {
            // Calculate HTG conversion for USD sequences
            const htgValue = seq.isUSD ? convertUSDToHTG(seq.value) : 0;
            const htgPerUnit = seq.isUSD ? convertUSDToHTG(seq.singleValue) : 0;
            
            return (
              <div 
                key={idx} 
                className={`
                  rounded-xl p-3 border
                  ${seq.isUSD 
                    ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-800/30' 
                    : 'bg-white/10 border-white/15'
                  }
                  transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                `}
              >
                {/* Main Sequence Card */}
                <div className="flex flex-col gap-2">
                  {/* Sequence Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          seq.isUSD 
                            ? 'bg-green-500 text-green-100' 
                            : 'bg-white/40 text-white'
                        }`}>
                          <span className="text-[8px] font-bold">
                            {seq.currency === 'USD' ? '$' : 'G'}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium opacity-90 truncate">
                          {seq.text}
                        </div>
                        {seq.multiplier > 1 && (
                          <div className="text-[10px] opacity-70 mt-0.5">
                            {seq.multiplier} × {formaterArgent(seq.singleValue)} {seq.currency}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Total Amount */}
                    <div className={`
                      px-3 py-1.5 rounded-lg text-xs font-bold min-w-[70px] text-center
                      ${seq.isUSD 
                        ? 'bg-green-900/50 text-green-200' 
                        : 'bg-white/20 text-white'
                      }
                    `}>
                      {seq.displayTotal}
                    </div>
                  </div>

                  {/* HTG Conversion for USD sequences */}
                  {seq.isUSD && (
                    <div className={`
                      mt-2 pt-2 border-t border-dashed
                      ${seq.isUSD ? 'border-green-800/40' : 'border-white/20'}
                    `}>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 opacity-80">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60"></div>
                            <span>En Gourdes:</span>
                          </div>
                          <div className="font-semibold text-amber-300">
                            {formaterArgent(htgValue)} HTG
                          </div>
                        </div>
                        
                        {seq.multiplier > 1 && (
                          <div className="flex items-center justify-between text-[10px] opacity-70 pl-2">
                            <div className="flex items-center gap-1">
                              <span className="opacity-60">×</span>
                              <span>{formaterArgent(htgPerUnit)} HTG</span>
                              <span className="opacity-60">×</span>
                              <span>{seq.multiplier}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="opacity-60">Taux:</span>
                              <span>1 USD = {exchangeRate} HTG</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to get display text without breakdown
  const getDisplayTextWithoutBreakdown = (depot) => {
    if (!depot) return '';
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        const amount = parseFloat(depot.montant) || 0;
        return `${amount} USD`;
      } else if (depot.value) {
        const amount = parseFloat(depot.value) || 0;
        return `${formaterArgent(amount)} HTG`;
      }
    }
    const amount = parseFloat(depot) || 0;
    return `${formaterArgent(amount)} HTG`;
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
    <div className="pt-3 border-t border-white border-opacity-30">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium opacity-90 flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            <span>Dépôts individuels</span>
          </div>
          <span className="text-xs opacity-60 bg-white/10 px-2 py-1 rounded-full">
            {depots.length} dépôt{depots.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Deposit Cards */}
        <div className="flex flex-col gap-3">
          {sortedDepots.map((depot, idx) => {
            const originalIndex = depots.indexOf(depot);
            const montantHTG = getMontantHTG(depot);
            const isUSD = isUSDDepot(depot);
            const montantOriginal = getOriginalDepositAmount(depot);
            const displayText = getDisplayTextWithoutBreakdown(depot);
            const isRecent = isRecentlyAdded(vendeur, originalIndex);
            const hasBreakdown = depot && typeof depot === 'object' && depot.breakdown;
            const isEditing = isEditingThisDeposit(vendeur, originalIndex);

            return (
              <div 
                key={originalIndex} 
                className={`
                  rounded-xl p-4
                  transition-all duration-300
                  ${isRecent ? 'animate-pulse-subtle' : ''}
                  ${isEditing 
                    ? 'ring-2 ring-amber-400 bg-amber-500 bg-opacity-10' 
                    : isUSD 
                    ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border border-green-800/30' 
                    : 'bg-white/10 border border-white/15'
                  }
                  ${isRecent && !isEditing ? 'ring-2 ring-green-400/30 shadow-xl shadow-green-500/10' : ''}
                  hover:shadow-lg hover:scale-[1.01]
                `}
              >
                {/* Deposit Card Content */}
                <div className="flex flex-col gap-3">
                  {/* Deposit Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                        ${isUSD 
                          ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-green-50' 
                          : 'bg-gradient-to-br from-white/30 to-white/10 text-white'
                        }
                        ${isRecent ? 'animate-bounce-subtle' : ''}
                        shadow-md
                      `}>
                        {originalIndex + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base truncate">{displayText}</span>
                          {isRecent && !isEditing && (
                            <Check size={12} className="text-green-300 flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        {isUSD && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="text-xs opacity-90 bg-green-900/40 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                              <span className="opacity-70">≈</span>
                              <span className="font-medium">{formaterArgent(montantHTG)} HTG</span>
                            </div>
                            <div className="text-[10px] opacity-60">
                              1 USD = {exchangeRate} HTG
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditDeposit(vendeur, originalIndex)}
                        className={`
                          p-2 rounded-lg transition-all duration-200
                          ${isEditing
                            ? 'bg-amber-500 text-white shadow-lg'
                            : 'bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-opacity-30 hover:shadow-md'
                          }
                        `}
                        title="Éditer ce dépôt"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteDeposit(vendeur, originalIndex)}
                        className="p-2 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 rounded-lg transition-all duration-200 hover:shadow-md"
                        title="Supprimer ce dépôt"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Render breakdown if exists */}
                  {hasBreakdown && renderBreakdown(depot)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.05); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DepositsSummary;