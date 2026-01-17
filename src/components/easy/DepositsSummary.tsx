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

  // Helper function to render sequences from deposit object
  const renderSequences = (depot) => {
    if (!depot || typeof depot !== 'object') return null;

    // Use the sequences array if available
    const sequences = depot.sequences;
    if (!sequences || !Array.isArray(sequences) || sequences.length === 0) return null;

    // Sort sequences by amount (largest first)
    const sortedSequences = [...sequences].sort((a, b) => b.amount - a.amount);

    // Calculate total of all sequences
    const sequencesTotal = sortedSequences.reduce((sum, seq) => sum + seq.amount, 0);

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-medium opacity-80 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
            <span>Composition</span>
          </div>
          <div className="text-[11px] opacity-70">
            <span className="opacity-60 mr-1">Total:</span>
            <span className="font-semibold">
              {isUSDDepot(depot) ? 
                `${formaterArgent(sequencesTotal)} USD` : 
                `${formaterArgent(sequencesTotal)} HTG`
              }
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          {sortedSequences.map((seq, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between w-full group ${
                seq.currency === 'USD' ? 'text-green-200' : ''
              }`}
            >
              {/* Left column - Description */}
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    seq.currency === 'USD' 
                      ? 'bg-green-500 bg-opacity-60' 
                      : 'bg-white bg-opacity-40'
                  }`}></div>
                  <div className={`absolute inset-0 rounded-full ${
                    seq.currency === 'USD' 
                      ? 'bg-green-400 bg-opacity-30' 
                      : 'bg-white bg-opacity-20'
                  } group-hover:scale-125 transition-transform`}></div>
                </div>
                <span className="text-[11px] opacity-90 truncate">{seq.note || `${seq.amount} ${seq.currency || 'HTG'}`}</span>
              </div>

              {/* Right column - Total */}
              <div className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                seq.currency === 'USD' 
                  ? 'bg-green-900 bg-opacity-40 text-green-200' 
                  : 'bg-white bg-opacity-15'
              }`}>
                {formaterArgent(seq.amount)} {seq.currency || 'HTG'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to get display text
  const getDisplayText = (depot) => {
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
        <div className="text-xs font-medium opacity-90 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
            <span>Dépôts individuels</span>
          </div>
          <span className="text-[11px] opacity-60">
            {depots.length} dépôt{depots.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {sortedDepots.map((depot, idx) => {
            const originalIndex = depots.indexOf(depot);
            const montantHTG = getMontantHTG(depot);
            const isUSD = isUSDDepot(depot);
            const displayText = getDisplayText(depot);
            const isRecent = isRecentlyAdded(vendeur, originalIndex);
            const hasSequences = depot && typeof depot === 'object' && depot.sequences && Array.isArray(depot.sequences) && depot.sequences.length > 0;
            const isEditing = isEditingThisDeposit(vendeur, originalIndex);

            return (
              <div 
                key={originalIndex} 
                className={`
                  px-3 py-2 rounded-lg text-sm
                  transition-all duration-200
                  ${isRecent ? 'animate-pulse-subtle' : ''}
                  ${isEditing 
                    ? 'ring-2 ring-amber-400 bg-amber-500 bg-opacity-10' 
                    : isUSD 
                    ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-800/30' 
                    : 'bg-white/10 border border-white/10'
                  }
                  ${isRecent && !isEditing ? 'ring-2 ring-green-400/30 shadow-lg shadow-green-500/10' : ''}
                  hover:bg-opacity-40 hover:scale-[1.02] hover:shadow-md
                `}
              >
                {/* Main deposit info with action buttons */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                      <div className="flex items-center gap-2 min-w-0">
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
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold truncate">{displayText}</span>
                            {isRecent && !isEditing && (
                              <Check size={10} className="text-green-300 flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          {isUSD && (
                            <div className="text-xs opacity-80 bg-green-900/30 px-2 py-1 rounded inline-flex items-center gap-1 mt-1">
                              <span className="opacity-70">≈</span>
                              <span>{formaterArgent(montantHTG)} HTG</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - Pen and Trash icons */}
                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <button
                      onClick={() => onEditDeposit(vendeur, originalIndex)}
                      className={`p-1.5 rounded transition-colors ${
                        isEditing
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-opacity-30'
                      }`}
                      title="Éditer ce dépôt"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDeleteDeposit(vendeur, originalIndex)}
                      className="p-1.5 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 rounded transition-colors"
                      title="Supprimer ce dépôt"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Render sequences - Only show for deposits with sequences array */}
                {hasSequences && renderSequences(depot)}
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