import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix }) => {
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

      </div>
    </div>
  );
};

export default PumpHeader;