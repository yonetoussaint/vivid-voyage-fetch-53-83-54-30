import React from 'react';
import { User, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix, totauxQuotidiens, tauxUSD, date }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  return (
    <div className="w-full">
      {/* Masonry-style container optimized for mobile */}
      <div className="flex flex-col gap-3">

        {/* Compact Pump Header Card */}
        <div className={`${getCouleurPompe(numeroPompe)} text-white rounded-xl p-4 shadow-lg`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-bold">{pompe}</h3>
            <div className="text-right">
              <p className="text-xs opacity-80 uppercase tracking-wide mb-1">{shift}</p>
              <div className="flex items-baseline justify-end gap-1">
                <p className="text-2xl font-bold leading-none">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
                <p className="text-xs opacity-80 flex-shrink-0">HTG</p>
              </div>
            </div>
          </div>

          {/* Masonry grid for fuel types */}
          <div className={`grid gap-2 ${pompe === 'P5' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-200 min-w-0">
              <div className="flex items-center justify-between mb-2 gap-1">
                <div className="bg-green-100 px-2 py-0.5 rounded flex-shrink-0">
                  <p className="text-xs font-bold text-green-700 uppercase">ESS</p>
                </div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              </div>

              <div className="space-y-2">
                <div className="min-w-0 flex items-baseline gap-1">
                  <p className="text-xl font-black leading-none truncate text-gray-900">
                    {formaterGallons(totalPompe?.gallonsEssence || 0)}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">gal</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="min-w-0 flex items-baseline gap-1">
                    <p className="text-sm font-bold leading-tight truncate text-gray-900">
                      {formaterArgent(totalPompe?.ventesEssence || 0)}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">HTG</p>
                  </div>
                </div>
              </div>
            </div>

            {pompe !== 'P5' && (
              <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-200 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-1">
                  <div className="bg-amber-100 px-2 py-0.5 rounded flex-shrink-0">
                    <p className="text-xs font-bold text-amber-700 uppercase">DIE</p>
                  </div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                </div>

                <div className="space-y-2">
                  <div className="min-w-0 flex items-baseline gap-1">
                    <p className="text-xl font-black leading-none truncate text-gray-900">
                      {formaterGallons(totalPompe?.gallonsDiesel || 0)}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">gal</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="min-w-0 flex items-baseline gap-1">
                      <p className="text-sm font-bold leading-tight truncate text-gray-900">
                        {formaterArgent(totalPompe?.ventesDiesel || 0)}
                      </p>
                      <p className="text-xs text-gray-500 flex-shrink-0">HTG</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vendor Assignment Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <User size={20} className="text-indigo-600" />
            </div>
            <h4 className="text-base font-bold text-gray-800 flex-1">
              Vendeur assigné
            </h4>
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

        {/* SINGLE PROMINENT TOTAL SALES CARD - Like in ReportView */}
        {pompe === 'P1' && totauxQuotidiens && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-white" />
                <h2 className="text-lg font-bold">TOTAL VENTES QUOTIDIEN</h2>
              </div>
              <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
                {date}
              </div>
            </div>
            
            <div className="space-y-3">
              {/* TOTAL SALES - BIG AND BOLD */}
              <div className="bg-white bg-opacity-15 rounded-xl p-4 border-2 border-white border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                    <p className="text-base font-bold">VENTES BRUTES TOTALES</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Essence + Diesel</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formaterArgent(totauxQuotidiens.totalBrut)}</p>
                  <span className="text-xl font-medium">HTG</span>
                </div>
              </div>
              
              {/* Fuel Breakdown */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="text-xs font-bold opacity-90">Essence</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold">{formaterArgent(totauxQuotidiens.ventesEssence)}</p>
                    <span className="text-xs opacity-80">HTG</span>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <p className="text-xs font-bold opacity-90">Diesel</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold">{formaterArgent(totauxQuotidiens.ventesDiesel)}</p>
                    <span className="text-xs opacity-80">HTG</span>
                  </div>
                </div>
              </div>
              
              {/* USD Adjustment - Less Prominent */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={14} className="text-white" />
                    <p className="text-sm font-bold">MOINS: USD Converti</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">${formaterArgent(totauxQuotidiens.totalUSD)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 mb-0.5">= {formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-80">Taux: 1 USD = {tauxUSD} HTG</p>
                  </div>
                </div>
              </div>
              
              {/* FINAL ADJUSTED TOTAL - Still Important */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-white" />
                    <p className="text-lg font-bold">TOTAL FINAL AJUSTÉ</p>
                  </div>
                  <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                    <p className="text-xs font-bold">CAISSE FINALE</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-90 mb-0.5">Ventes Brutes - USD converti</p>
                    <p className="text-2xl sm:text-3xl font-bold">{formaterArgent(totauxQuotidiens.totalAjuste)}</p>
                  </div>
                  <span className="text-xl font-bold">HTG</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PumpHeader;