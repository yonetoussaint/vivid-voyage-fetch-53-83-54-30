import React from 'react';
import { User, DollarSign, TrendingUp } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix, date }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  return (
    <div className="w-full space-y-3">
      {/* Vendor Assignment Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <User size={20} className="text-indigo-600" />
          </div>
          <h4 className="text-base font-bold text-gray-800 flex-1">
            Vendeur assigné
          </h4>
          <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
            {pompe}
          </div>
        </div>

        <select
          value={vendeurActuel}
          onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value)}
          className="w-full px-4 py-3.5 text-base font-semibold border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all mb-2"
        >
          <option value="">Sélectionner un vendeur</option>
          {vendeurs.map(vendeur => (
            <option key={vendeur} value={vendeur}>{vendeur}</option>
          ))}
        </select>

        {vendeurActuel && (
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm text-center shadow-md">
            ✓ {vendeurActuel}
          </div>
        )}
      </div>

      {/* MOST PROMINENT TOTAL SALES CARD - Like in ReportView */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-white" />
            <h2 className="text-lg font-bold">TOTAL {pompe}</h2>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            Shift {shift}
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Fuel Breakdown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <p className="text-xs font-bold opacity-90">Essence</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-end justify-between">
                  <p className="text-lg font-bold">{formaterArgent(totalPompe?.ventesEssence || 0)}</p>
                  <span className="text-xs opacity-80">HTG</span>
                </div>
                <p className="text-[10px] opacity-80">{formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <p className="text-xs font-bold opacity-90">Diesel</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-end justify-between">
                  <p className="text-lg font-bold">{formaterArgent(totalPompe?.ventesDiesel || 0)}</p>
                  <span className="text-xs opacity-80">HTG</span>
                </div>
                <p className="text-[10px] opacity-80">{formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
              </div>
            </div>
          </div>
          
          {/* Fuel Gallons Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <p className="text-sm font-bold">TOTAL GALLONS</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{formaterGallons((totalPompe?.gallonsEssence || 0) + (totalPompe?.gallonsDiesel || 0))}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 mb-0.5">Essence: {formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
                <p className="text-xs opacity-90">Diesel: {formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-80">Prix: 600/650 HTG</p>
              </div>
            </div>
          </div>
          
          {/* FINAL PROMINENT CARD */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-white" />
                <p className="text-lg font-bold">TOTAL VENTES {pompe}</p>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">FINAL</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-90 mb-0.5">Ventes Brutes Total</p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
              </div>
              <span className="text-xl font-bold">HTG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;