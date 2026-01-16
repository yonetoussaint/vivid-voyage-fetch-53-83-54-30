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

  return (
    <div className="pt-3 border-t border-white border-opacity-30">
      <div className="flex flex-col gap-1">
        <div className="text-xs opacity-90">Dépôts individuels:</div>
        <div className="flex flex-col gap-1">
          {depots.map((depot, idx) => {
            const montantHTG = getMontantHTG(depot);
            const isUSD = isUSDDepot(depot);
            const montantOriginal = getOriginalDepotAmount(depot);
            const displayText = getDepositDisplay(depot);
            const isRecent = isRecentlyAdded(vendeur, idx);

            return (
              <div 
                key={idx} 
                className={`px-2 py-1 rounded text-xs flex items-start gap-2 ${
                  isUSD 
                    ? 'bg-green-500 bg-opacity-30 text-green-100' 
                    : 'bg-white bg-opacity-20'
                } ${isRecent ? 'ring-1 ring-green-400 ring-opacity-50' : ''}`}
              >
                <span className="font-bold min-w-[20px]">{idx + 1}.</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="truncate flex items-center gap-1">
                    {displayText}
                    {isRecent && (
                      <Check size={8} className="text-green-300 flex-shrink-0" />
                    )}
                  </span>
                  {isUSD && (
                    <span className="text-[10px] opacity-75">
                      ({formaterArgent(montantOriginal)} USD)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositsSummary;