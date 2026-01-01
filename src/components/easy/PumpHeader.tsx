import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  return (
    <div className="space-y-3">
      {/* Affectation Vendeur */}
      <div className="bg-white rounded-lg p-3 border-2 border-indigo-300">
        <div className="flex items-center gap-2 mb-2">
          <User size={18} />
          <h4 className="text-base font-bold text-gray-800 truncate">Vendeur pour {pompe}</h4>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <select
            value={vendeurActuel}
            onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value)}
            className="flex-1 px-3 py-2.5 text-base font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            <option value="">Sélectionner Vendeur</option>
            {vendeurs.map(vendeur => (
              <option key={vendeur} value={vendeur}>{vendeur}</option>
            ))}
          </select>
          {vendeurActuel && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg font-bold text-sm truncate max-w-full sm:w-auto w-full text-center">
              {vendeurActuel}
            </div>
          )}
        </div>
      </div>

      {/* En-tête Pompe avec Total */}
      <div className={`${getCouleurPompe(numeroPompe)} text-white rounded-xl p-5 shadow-lg`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-xl font-bold">{pompe}</h3>
            <p className="text-sm opacity-90">
              {pompe === 'P5' ? '1 Pistolet Essence' : 'Phase 1: P1-P3 | Phase 2: P4-P6'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Total {shift}</p>
            <p className="text-2xl font-bold">{formaterArgent(totalPompe?.ventesTotales || 0)} HTG</p>
          </div>
        </div>

        {/* Résumé Pompe */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs opacity-90">Essence</p>
            <p className="text-lg font-bold">{formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
            <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesEssence || 0)} HTG</p>
          </div>
          {pompe !== 'P5' && (
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Diesel</p>
              <p className="text-lg font-bold">{formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
              <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesDiesel || 0)} HTG</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;