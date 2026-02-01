// easy/TotalSalesCard.jsx
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formaterArgent, formaterCaisse } from '@/utils/formatters';

const TotalSalesCard = ({ 
  ventesTotales, 
  isPropane = false,
  pompe = '' 
}) => {
  // Calculate rounded adjusted total
  const totalAjusteArrondi = formaterCaisse(ventesTotales || 0);
  const exactValue = parseFloat(ventesTotales || 0);
  const roundedValue = parseFloat(totalAjusteArrondi.replace(/'/g, ''));
  const adjustment = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0;
  const isRoundedUp = adjustment > 0;

  const getMainCardColor = () => {
    if (isPropane) {
      return 'bg-gradient-to-br from-red-600 to-orange-600';
    }
    return 'bg-gradient-to-br from-indigo-600 to-purple-600';
  };

  const getProductLabel = () => {
    if (isPropane) {
      return 'Propane';
    }
    return pompe;
  };

  return (
    <div className={`rounded-xl p-4 shadow-xl mb-3 ${getMainCardColor()} text-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-80"></div>
          <p className="text-sm font-bold">TOTAL VENTES ({getProductLabel()})</p>
        </div>
        <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
          Final
        </div>
      </div>

      <div className="space-y-2">
        {/* Main Total Sales */}
        <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
          <p className="text-xs opacity-90 mb-1">
            {isPropane ? 'VENTES BRUTES PROPANE' : 'VENTES BRUTES (Essence + Diesel)'}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(ventesTotales)}</p>
            <span className="text-sm font-medium opacity-90">HTG</span>
          </div>
        </div>

        {/* Final Adjusted Total */}
        <div className={`rounded-lg p-3 relative overflow-hidden ${
          isPropane 
            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600'
        }`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>

          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <DollarSign size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">TOTAL AJUSTÉ (CAISSE)</p>
                <p className="text-[10px] opacity-80">Arrondi au 0 ou 5 le plus proche</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
              <p className="text-xs font-bold">FINAL</p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-1">
              <div className="flex items-end justify-between">
                <p className="text-2xl sm:text-3xl font-bold">{formaterCaisse(ventesTotales)}</p>
                <span className="text-xl font-bold ml-2">HTG</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs opacity-80">Valeur arrondie</p>
              {hasAdjustment && (
                <div className="flex items-center gap-1">
                  <span className="text-xs opacity-80">Écart:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isRoundedUp ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {isRoundedUp ? `+${adjustment.toFixed(2)}` : `${adjustment.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSalesCard;