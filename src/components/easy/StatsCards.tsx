import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';

const StatsCards = ({ shift, totaux, tauxUSD }) => {
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
          <DollarSign size={18} className="opacity-80" />
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
          
          {/* Final Adjusted Total - Still Important */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-white" />
                <p className="text-sm font-bold">TOTAL AJUSTÉ</p>
              </div>
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                <p className="text-xs font-bold">CAISSE</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xl sm:text-2xl font-bold">{formaterArgent(totaux.totalAjuste)}</p>
              <span className="text-sm font-medium">HTG</span>
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