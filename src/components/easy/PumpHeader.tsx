import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  return (
    <div className="space-y-3 w-full">
      {/* Affectation Vendeur - Optimized for mobile */}
      <div className="bg-white rounded-lg p-3 border-2 border-indigo-300 w-full">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="flex-shrink-0" />
          <h4 className="text-base font-bold text-gray-800 truncate flex-1">
            Vendeur pour {pompe}
          </h4>
        </div>
        
        <div className="flex flex-col gap-2">
          <select
            value={vendeurActuel}
            onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value)}
            className="w-full px-3 py-3 text-base font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            style={{ WebkitAppearance: 'none' }}
          >
            <option value="">Sélectionner Vendeur</option>
            {vendeurs.map(vendeur => (
              <option key={vendeur} value={vendeur}>{vendeur}</option>
            ))}
          </select>
          
          {vendeurActuel && (
            <div className="bg-indigo-100 text-indigo-800 px-4 py-3 rounded-lg font-bold text-sm truncate w-full text-center">
              {vendeurActuel}
            </div>
          )}
        </div>
      </div>

      {/* En-tête Pompe avec Total - Optimized for mobile */}
      <div className={`${getCouleurPompe(numeroPompe)} text-white rounded-xl p-4 shadow-lg w-full`}>
        <div className="flex flex-col mb-4 gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold leading-tight">{pompe}</h3>
              <p className="text-xs opacity-90 mt-1 line-clamp-2">
                {pompe === 'P5' ? '1 Pistolet Essence' : 'Phase 1: P1-P3 | Phase 2: P4-P6'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Total {shift}</p>
              <p className="text-xl font-bold leading-tight">
                {formaterArgent(totalPompe?.ventesTotales || 0)}
              </p>
              <p className="text-xs opacity-90">HTG</p>
            </div>
          </div>
        </div>

        {/* Résumé Pompe - Optimized grid for mobile */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs opacity-90 mb-1">Essence</p>
            <p className="text-base font-bold leading-tight">
              {formaterGallons(totalPompe?.gallonsEssence || 0)}
            </p>
            <p className="text-xs opacity-90 mt-1">gal</p>
            <p className="text-sm opacity-90 mt-1">
              {formaterArgent(totalPompe?.ventesEssence || 0)} HTG
            </p>
          </div>
          
          {pompe !== 'P5' && (
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90 mb-1">Diesel</p>
              <p className="text-base font-bold leading-tight">
                {formaterGallons(totalPompe?.gallonsDiesel || 0)}
              </p>
              <p className="text-xs opacity-90 mt-1">gal</p>
              <p className="text-sm opacity-90 mt-1">
                {formaterArgent(totalPompe?.ventesDiesel || 0)} HTG
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;