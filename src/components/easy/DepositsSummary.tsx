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

  // Helper function to parse breakdown and create list items
  const renderBreakdown = (depot) => {
    if (!depot || typeof depot !== 'object') return null;
    
    const breakdown = depot.breakdown;
    if (!breakdown) return null;

    // Split by comma and clean up the items
    const items = breakdown.split(',').map(item => item.trim());
    
    return (
      <div className="mt-1 ml-4">
        <div className="text-[10px] opacity-75 mb-0.5">Séquences:</div>
        <ul className="space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-[10px] opacity-90 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 mr-1.5"></span>
              {item}
            </li>
          ))}
        </ul>
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

  return (
    <div className="pt-3 border-t border-white border-opacity-30">
      <div className="flex flex-col gap-1">
        <div className="text-xs opacity-90">Dépôts individuels:</div>
        <div className="flex flex-col gap-2">
          {depots.map((depot, idx) => {
            const montantHTG = getMontantHTG(depot);
            const isUSD = isUSDDepot(depot);
            const montantOriginal = getOriginalDepotAmount(depot);
            const displayText = getDisplayTextWithoutBreakdown(depot);
            const isRecent = isRecentlyAdded(vendeur, idx);
            const hasBreakdown = depot && typeof depot === 'object' && depot.breakdown;

            return (
              <div 
                key={idx} 
                className={`px-2 py-1.5 rounded text-xs ${
                  isUSD 
                    ? 'bg-green-500 bg-opacity-30 text-green-100' 
                    : 'bg-white bg-opacity-20'
                } ${isRecent ? 'ring-1 ring-green-400 ring-opacity-50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">{idx + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate">{displayText}</span>
                      {isRecent && (
                        <Check size={8} className="text-green-300 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Show USD amount for USD deposits */}
                    {isUSD && (
                      <div className="text-[10px] opacity-75 mt-0.5">
                        ({formaterArgent(montantOriginal)} USD)
                      </div>
                    )}
                    
                    {/* Render breakdown as vertical list */}
                    {renderBreakdown(depot)}
                  </div>
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