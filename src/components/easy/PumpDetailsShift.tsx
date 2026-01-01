import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurBadge, calculerGallons, calculerTotalPompe } from '@/utils/helpers';

const PumpDetailsShift = ({ shift, pompes, toutesDonnees, prix }) => {
  const prixForCalc = prix || { essence: 600, diesel: 650 };

  return (
    <div className={`bg-gradient-to-br ${shift === 'AM' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-indigo-600'} text-white rounded-xl p-4 shadow-xl`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{shift === 'AM' ? '🌅' : '🌇'}</span>
        <h3 className="text-lg font-bold">Détails Pompes - Shift {shift}</h3>
      </div>
      <div className="space-y-4">
        {pompes.map((pompe) => {
          const donneesPompe = toutesDonnees[shift][pompe];
          const totalPompe = calculerTotalPompe(donneesPompe, prixForCalc);
          const vendeurPompe = donneesPompe?._vendeur || '';

          return (
            <div key={`${shift}-${pompe}`} className="bg-white bg-opacity-15 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-base font-bold">{pompe}</h4>
                  {vendeurPompe && (
                    <div className="flex items-center gap-1 mt-1">
                      <User size={12} />
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded truncate">
                        Vendeur: {vendeurPompe}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full self-start sm:self-center">
                  {shift}
                </span>
              </div>

              <div className="space-y-2">
                {donneesPompe && Object.entries(donneesPompe)
                  .filter(([key]) => key !== '_vendeur')
                  .map(([pistolet, donnees]) => {
                    const gallons = calculerGallons(donnees.debut, donnees.fin);
                    if (gallons === 0 && !donnees.debut && !donnees.fin) return null;

                    return (
                      <div key={pistolet} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold truncate">{pistolet.replace('pistolet', 'P')}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${getCouleurBadge(donnees.typeCarburant)}`}>
                            {donnees.typeCarburant.replace('Essence ', 'E')}
                          </span>
                        </div>
                        <div className="text-right min-w-0">
                          <div className="font-bold truncate">{formaterGallons(gallons)} gal</div>
                          <div className="text-xs opacity-90 truncate">
                            {donnees.debut || '0'} → {donnees.fin || '0'}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Total Pompe */}
                {totalPompe && (totalPompe.totalGallons !== 0 || 
                  Object.values(donneesPompe).some(donnees => donnees && (donnees.debut || donnees.fin))) && (
                  <div className="pt-2 mt-2 border-t border-white border-opacity-30">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Total {pompe}:</span>
                      <div className="text-right">
                        <div className="font-bold text-sm">{formaterGallons(totalPompe.totalGallons)} gal</div>
                        <div className="font-bold">{formaterArgent(totalPompe.ventesTotales)} HTG</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PumpDetailsShift;