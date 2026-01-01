import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  return (
    <div className="space-y-3">
      {Object.entries(donneesPompe).filter(([key]) => key !== '_vendeur').map(([pistolet, donnees]) => (
        <div key={pistolet} className={`rounded-xl shadow-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)}`}>
          <div className={`${getCouleurBadge(donnees.typeCarburant)} text-white px-4 py-3 flex justify-between items-center`}>
            <div>
              <p className="text-lg font-bold">{pistolet.replace('pistolet', 'Pistolet ')}</p>
              <p className="text-sm opacity-90">{donnees.typeCarburant}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Prix</p>
              <p className="text-lg font-bold">
                {donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.essence} HTG
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                INDEX DÉBUT
              </label>
              <input
                type="number"
                step="0.001"
                value={donnees.debut}
                onChange={(e) => mettreAJourLecture(pompe, pistolet, 'debut', e.target.value)}
                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.000"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                INDEX FIN
              </label>
              <input
                type="number"
                step="0.001"
                value={donnees.fin}
                onChange={(e) => mettreAJourLecture(pompe, pistolet, 'fin', e.target.value)}
                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.000"
              />
            </div>

            {(donnees.debut || donnees.fin) && (
              <div className="bg-white rounded-lg p-3 space-y-1 border-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Gallons</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formaterGallons(calculerGallons(donnees.debut, donnees.fin))}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Ventes Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {formaterArgent(
                      calculerGallons(donnees.debut, donnees.fin) * 
                      (donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.essence)
                    )} HTG
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PumpPistolets;