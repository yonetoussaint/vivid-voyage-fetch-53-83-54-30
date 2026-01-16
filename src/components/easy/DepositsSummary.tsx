import React from 'react';
import { Check } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepositsSummary = ({
  vendeur,
  depots,
  isRecentlyAdded,
  getMontantHTG,
  isUSDDepot,
  getOriginalDepotAmount,
  getDepositDisplay
}) => {
  if (depots.length === 0) return null;

  // Helper function to parse breakdown and create sorted list items
  const renderBreakdown = (depot) => {
    if (!depot || typeof depot !== 'object') return null;
    
    const breakdown = depot.breakdown;
    if (!breakdown) return null;

    // Parse sequences and extract numeric values for sorting
    const parsedSequences = breakdown.split(',').map(item => {
      const trimmed = item.trim();
      
      // Extract numeric value from different patterns
      let numericValue = 0;
      
      // Pattern: "5 × 20 USD" or "5 × 20 HTG"
      const multiplierMatch = trimmed.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
      if (multiplierMatch) {
        const [, multiplier, value] = multiplierMatch;
        numericValue = parseFloat(multiplier) * parseFloat(value);
      } 
      // Pattern: "20 USD" or "100 HTG"
      else {
        const valueMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
        if (valueMatch) {
          numericValue = parseFloat(valueMatch[1]);
        }
      }
      
      return {
        text: trimmed,
        value: numericValue,
        isUSD: /USD/i.test(trimmed)
      };
    });

    // Sort by value descending (largest first)
    const sortedSequences = [...parsedSequences].sort((a, b) => b.value - a.value);

    return (
      <div className="mt-1.5 ml-3 pl-2 border-l border-white border-opacity-20">
        <div className="text-[11px] font-medium opacity-80 mb-1.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
          <span>Séquences</span>
        </div>
        <div className="space-y-1.5">
          {sortedSequences.map((seq, idx) => (
            <div 
              key={idx} 
              className={`text-[11px] opacity-90 pl-1 flex items-start gap-2 group ${
                seq.isUSD ? 'text-green-200' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    seq.isUSD 
                      ? 'bg-green-500 bg-opacity-60' 
                      : 'bg-white bg-opacity-40'
                  }`}></div>
                  <div className={`absolute inset-0 rounded-full ${
                    seq.isUSD 
                      ? 'bg-green-400 bg-opacity-30' 
                      : 'bg-white bg-opacity-20'
                  } group-hover:scale-125 transition-transform`}></div>
                </div>
                <span className="truncate">{seq.text}</span>
              </div>
              {seq.value > 0 && (
                <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                  seq.isUSD 
                    ? 'bg-green-900 bg-opacity-30 text-green-300' 
                    : 'bg-white bg-opacity-10'
                }`}>
                  {seq.isUSD ? 'USD' : 'HTG'}
                </div>
              )}
            </div>
          ))}
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
        <div className="text-xs font-medium opacity-90 flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
          <span>Dépôts individuels</span>
        </div>
        <div className="flex flex-col gap-2">
          {sortedDepots.map((depot, idx) => {
            const originalIndex = depots.indexOf(depot);
            const montantHTG = getMontantHTG(depot);
            const isUSD = isUSDDepot(depot);
            const montantOriginal = getOriginalDepotAmount(depot);
            const displayText = getDisplayTextWithoutBreakdown(depot);
            const isRecent = isRecentlyAdded(vendeur, originalIndex);
            const hasBreakdown = depot && typeof depot === 'object' && depot.breakdown;

            return (
              <div 
                key={originalIndex} 
                className={`
                  px-3 py-2 rounded-lg text-sm
                  transition-all duration-200
                  ${isRecent ? 'animate-pulse-subtle' : ''}
                  ${isUSD 
                    ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-800/30' 
                    : 'bg-white/10 border border-white/10'
                  }
                  ${isRecent ? 'ring-2 ring-green-400/30 shadow-lg shadow-green-500/10' : ''}
                  hover:bg-opacity-40 hover:scale-[1.02] hover:shadow-md
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Number badge */}
                  <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isUSD 
                      ? 'bg-green-600 text-green-50' 
                      : 'bg-white/20 text-white'
                    }
                    ${isRecent ? 'animate-bounce-subtle' : ''}
                  `}>
                    {originalIndex + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Main deposit info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-semibold truncate">{displayText}</span>
                        {isRecent && (
                          <Check size={10} className="text-green-300 flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      
                      {/* USD conversion for USD deposits */}
                      {isUSD && (
                        <div className="text-xs opacity-80 bg-green-900/30 px-2 py-1 rounded inline-flex items-center gap-1">
                          <span className="opacity-70">≈</span>
                          <span>{formaterArgent(montantHTG)} HTG</span>
                          <span className="text-[10px] opacity-60 ml-1">({montantOriginal} USD)</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Render breakdown as beautiful vertical list */}
                    {renderBreakdown(depot)}
                  </div>
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
      `}</style>
    </div>
  );
};

export default DepositsSummary;