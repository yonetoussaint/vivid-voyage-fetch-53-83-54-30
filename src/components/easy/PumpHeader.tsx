import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  return (
    <div className="space-y-4 md:space-y-3">
      {/* Affectation Vendeur - Mobile Optimized */}
      <div className="bg-white rounded-xl p-4 border-2 border-indigo-300 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <User size={20} className="text-indigo-600" />
          </div>
          <h4 className="text-base font-bold text-gray-800">Vendeur {pompe}</h4>
        </div>
        
        <div className="space-y-3">
          <select
            value={vendeurActuel}
            onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value)}
            className="w-full px-4 py-3.5 text-base font-semibold border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 active:border-blue-500 touch-manipulation"
            style={{ minHeight: '48px' }} // Better touch target
          >
            <option value="">Sélectionner Vendeur</option>
            {vendeurs.map(vendeur => (
              <option key={vendeur} value={vendeur}>{vendeur}</option>
            ))}
          </select>
          
          {vendeurActuel && (
            <div className="bg-indigo-100 text-indigo-800 px-4 py-3 rounded-xl font-bold text-sm truncate max-w-full text-center border border-indigo-200">
              {vendeurActuel}
            </div>
          )}
        </div>
      </div>

      {/* En-tête Pompe avec Total - Mobile Optimized */}
      <div className={`${getCouleurPompe(numeroPompe)} text-white rounded-2xl p-5 shadow-lg`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">{pompe}</h3>
              <span className="bg-white bg-opacity-30 text-xs font-bold px-2 py-1 rounded-full">
                {pompe === 'P5' ? '1 Pistolet' : '2 Pistolets'}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {pompe === 'P5' 
                ? 'Pistolet Essence uniquement' 
                : numeroPompe < 4 ? 'Phase 1' : 'Phase 2'
              }
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-xl p-3 sm:p-4 min-w-[160px] w-full sm:w-auto">
            <p className="text-xs opacity-90 mb-1">Total {shift}</p>
            <p className="text-2xl sm:text-3xl font-bold">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
            <p className="text-xs opacity-90 mt-1">HTG</p>
          </div>
        </div>

        {/* Résumé Pompe - Grid optimized for mobile */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mt-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs opacity-90 mb-1">Essence</p>
            <p className="text-xl font-bold mb-1">{formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
            <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesEssence || 0)} HTG</p>
          </div>
          
          {pompe !== 'P5' && (
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs opacity-90 mb-1">Diesel</p>
              <p className="text-xl font-bold mb-1">{formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
              <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesDiesel || 0)} HTG</p>
            </div>
          )}
          
          {/* Single column layout for P5 */}
          {pompe === 'P5' && (
            <div className="col-span-full text-center pt-2">
              <p className="text-sm opacity-90">Diesel non disponible sur cette pompe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;