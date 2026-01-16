import React from 'react';
import { Minus, Check } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const ExistingDepositsList = ({
  vendeur,
  depots,
  mettreAJourDepot,
  supprimerDepot,
  isRecentlyAdded,
  getDisplayValue,
  isUSDDepot,
  getMontantHTG,
  getDepositDisplay,
  hasBreakdown,
  getOriginalDepotAmount
}) => {
  if (depots.length === 0) {
    return (
      <div className="text-center py-3 text-white text-opacity-70 text-sm">
        Aucun dépôt ajouté
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {depots.map((depot, index) => {
        const isUSD = isUSDDepot(depot);
        const displayValue = getDisplayValue(depot);
        const montantHTG = getMontantHTG(depot);
        const montantOriginal = getOriginalDepotAmount(depot);
        const displayText = getDepositDisplay(depot);
        const hasBd = hasBreakdown(depot);
        const isRecent = isRecentlyAdded(vendeur, index);

        return (
          <div 
            key={index} 
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-300 ${
              isRecent 
                ? 'bg-green-500 bg-opacity-20 rounded-lg p-2 border border-green-400 border-opacity-30' 
                : ''
            }`}
          >
            {/* Highlight indicator */}
            {isRecent && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full absolute top-0"></div>
              </div>
            )}

            {/* Input container */}
            <div className="flex-1 w-full">
              <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                <input
                  type="number"
                  step="0.01"
                  value={displayValue}
                  onChange={(e) => {
                    if (isUSD) {
                      mettreAJourDepot(vendeur, index, {
                        montant: e.target.value,
                        devise: 'USD',
                        ...(depot.breakdown && { breakdown: depot.breakdown }),
                        ...(depot.sequences && { sequences: depot.sequences })
                      });
                    } else if (typeof depot === 'object' && depot.value) {
                      // HTG deposit with breakdown
                      mettreAJourDepot(vendeur, index, {
                        ...depot,
                        value: e.target.value
                      });
                    } else {
                      mettreAJourDepot(vendeur, index, e.target.value);
                    }
                  }}
                  placeholder="Montant"
                  className="flex-1 w-0 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none text-sm sm:text-base"
                />
                <span className={`px-3 py-2 font-bold text-xs sm:text-sm w-16 sm:w-20 text-center ${
                  isUSD ? 'bg-green-500 bg-opacity-50' : ''
                }`}>
                  {isUSD ? 'USD' : 'HTG'}
                </span>
              </div>
              <div className="text-xs text-right opacity-75 mt-1">
                <div className="truncate flex items-center justify-end gap-1">
                  {displayText}
                  {isRecent && (
                    <Check size={10} className="text-green-300" />
                  )}
                </div>
                {isUSD && (
                  <div className="text-[10px] sm:text-xs">
                    = {formaterArgent(montantHTG)} HTG
                  </div>
                )}
                {hasBd && !isUSD && (
                  <div className="text-[10px] opacity-60 mt-0.5">
                    {depot.breakdown}
                  </div>
                )}
              </div>
            </div>

            {/* Delete button - always visible */}
            <button
              onClick={() => supprimerDepot(vendeur, index)}
              className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition self-end sm:self-center"
              aria-label={`Supprimer dépôt ${index + 1}`}
            >
              <Minus size={14} className="sm:size-[16px]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ExistingDepositsList;