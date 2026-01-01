import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';

const StatsCards = ({ shift, totaux, tauxUSD }) => {
  return (
    <>
      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
          <p className="text-xs opacity-90 mb-1">Essence ({shift})</p>
          <p className="text-2xl font-bold">{formaterGallons(totaux.totalGallonsEssence)}</p>
          <p className="text-xs opacity-90">gallons</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-4 shadow-lg">
          <p className="text-xs opacity-90 mb-1">Diesel ({shift})</p>
          <p className="text-2xl font-bold">{formaterGallons(totaux.totalGallonsDiesel)}</p>
          <p className="text-xs opacity-90">gallons</p>
        </div>
      </div>

      {/* Total USD Ajusté SANS Propane */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs opacity-90 mb-1">Total Ajusté ({shift})</p>
            <p className="text-2xl font-bold">{formaterArgent(totaux.totalAjuste)} HTG</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">USD: ${formaterArgent(totaux.totalUSD)}</p>
            <p className="text-xs">= {formaterArgent(totaux.totalHTGenUSD)} HTG</p>
          </div>
        </div>
        <div className="pt-2 border-t border-white border-opacity-30">
          <div className="flex justify-between items-center text-xs opacity-90">
            <span>Essence & Diesel Bruts:</span>
            <span>{formaterArgent(totaux.totalBrut)} HTG</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;