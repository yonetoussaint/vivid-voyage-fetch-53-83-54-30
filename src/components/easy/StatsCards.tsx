import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Calculator } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse, formaterCaisseHTG } from '@/utils/formatters';

const StatsCards = ({ shift, totaux, tauxUSD }) => {
  // Calculate rounded adjusted total (to nearest 5)
  const totalAjusteArrondi = formaterCaisse(totaux.totalAjuste);

  // Calculate exact value for comparison
  const exactValue = parseFloat(totaux.totalAjuste);
  // Remove apostrophes for parsing
  const roundedValue = parseFloat(totalAjusteArrondi.replace(/'/g, ''));
  
  // Calculate adjustment (positive or negative)
  const adjustment = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0;
  
  // Determine if rounded up or down
  const isRoundedUp = adjustment > 0;
  const isRoundedDown = adjustment < 0;

  return (
    <>
      {/* Statistiques Rapides - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
            <p className="text-xs font-medium opacity-90">Essence ({shift})</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterGallons(totaux.totalGallonsEssence)}</p>
          <p className="text-[10px] opacity-90">gallons</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
            <p className="text-xs font-medium opacity-90">Diesel ({shift})</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterGallons(totaux.totalGallonsDiesel)}</p>
          <p className="text-[10px] opacity-90">gallons</p>
        </div>
      </div>

      {/* TOTAL SALES - Most Prominent Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white bg-opacity-80"></div>
            <p className="text-sm font-bold">TOTAL VENTES ({shift})</p>
          </div>
          <Calculator size={18} className="opacity-80" />
        </div>

        <div className="space-y-2">
          {/* Main Total Sales - Most Prominent */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">VENTES BRUTES (Essence + Diesel)</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(totaux.totalBrut)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>

          {/* USD Adjustment - Less Prominent */}
          <div className="bg-white bg-opacity-10 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <TrendingDown size={12} className="text-amber-300" />
                <p className="text-xs opacity-90">USD converti</p>
              </div>
              <p className="text-xs font-medium opacity-90">${formaterArgent(totaux.totalUSD)}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-80">= {formaterArgent(totaux.totalHTGenUSD)} HTG</span>
              <span className="text-[10px] opacity-70">1 USD = {tauxUSD} HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total - ROUNDED */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="flex items-center justify-between mb-1 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">TOTAL AJUSTÉ (CAISSE)</p>
                  <p className="text-[10px] opacity-80">Arrondi à 0 ou 5</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">FINAL</p>
              </div>
            </div>

            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{formaterCaisseHTG(totaux.totalAjuste)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] opacity-80">
                    Exact: {formaterArgent(totaux.totalAjuste)} HTG
                  </p>
                  {hasAdjustment && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isRoundedUp ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      {isRoundedUp ? `+${Math.abs(adjustment).toFixed(0)}` : `-${Math.abs(adjustment).toFixed(0)}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold">HTG</span>
                <span className="text-[10px] opacity-70 mt-1">
                  {roundedValue % 10 === 0 ? '0' : '5'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Row - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">USD Sales</p>
          <p className="text-sm font-bold">${formaterArgent(totaux.totalUSD)}</p>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">HTG (USD)</p>
          <p className="text-sm font-bold">{formaterArgent(totaux.totalHTGenUSD)}</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;