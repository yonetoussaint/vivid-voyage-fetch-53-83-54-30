import React from 'react';
import { User, Calculator } from 'lucide-react';
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

        {/* FIRST CARD - EXACTLY LIKE REPORTVIEW FIRST CARD */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-white" />
              <h2 className="text-lg font-bold">Résumé {pompe}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Shift {shift}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white bg-opacity-15 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-300"></div>
                <p className="text-xs font-medium opacity-90">Essence</p>
              </div>
              <p className="text-lg font-bold">{formaterArgent(totalPompe?.ventesEssence || 0)}</p>
              <div className="text-[10px] opacity-80 mt-1">
                <p>{formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-15 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                <p className="text-xs font-medium opacity-90">Diesel</p>
              </div>
              <p className="text-lg font-bold">{formaterArgent(totalPompe?.ventesDiesel || 0)}</p>
              <div className="text-[10px] opacity-80 mt-1">
                <p>{formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
              </div>
            </div>
          </div>
          
          {/* Daily Quick Stats */}
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-white bg-opacity-10 rounded p-1">
              <p className="text-[10px] opacity-90">Pompe</p>
              <p className="text-xs font-bold">{pompe}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded p-1">
              <p className="text-[10px] opacity-90">Vendeur</p>
              <p className="text-xs font-bold">{vendeurActuel ? 'Oui' : 'Non'}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded p-1">
              <p className="text-[10px] opacity-90">Total</p>
              <p className="text-xs font-bold">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
            </div>
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