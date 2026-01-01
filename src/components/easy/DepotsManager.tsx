import React from 'react';
import { DollarSign, User, Plus, Minus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const depotsActuels = tousDepots[shift] || {};

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold">Dépôts - Shift {shift}</h3>
          </div>
        </div>

        <div className="space-y-4">
          {vendeurs.length === 0 ? (
            <div className="text-center py-6 text-white text-opacity-70">
              Aucun vendeur ajouté
            </div>
          ) : (
            vendeurs.map(vendeur => {
              const depots = depotsActuels[vendeur] || [];
              const depotsValides = depots.filter(depot => depot !== '');
              const totalDepot = depotsValides.reduce((sum, depot) => sum + (parseFloat(depot) || 0), 0);
              const donneesVendeur = totauxVendeurs[vendeur];
              const especesAttendues = donneesVendeur ? (donneesVendeur.ventesTotales - totalDepot) : 0;

              return (
                <div key={vendeur} className="bg-white bg-opacity-15 rounded-lg p-3 space-y-3">
                  {/* En-tête Vendeur */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-bold">{vendeur}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold text-center ${
                      especesAttendues > 0 
                        ? 'bg-green-500' 
                        : especesAttendues < 0 
                        ? 'bg-red-500' 
                        : 'bg-gray-500'
                    }`}>
                      Espèces: {formaterArgent(especesAttendues)} HTG
                    </div>
                  </div>

                  {/* Info Ventes */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Ventes Total</span>
                      <span className="font-bold">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Dépôts</span>
                      <span className="font-bold">{formaterArgent(totalDepot)} HTG</span>
                    </div>
                  </div>

                  {/* Entrées Dépôts */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Entrées Dépôts</span>
                      <button
                        onClick={() => ajouterDepot(vendeur)}
                        className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
                      >
                        <Plus size={14} />
                        Ajouter
                      </button>
                    </div>

                    {depots.length === 0 ? (
                      <div className="text-center py-3 text-white text-opacity-70 text-sm">
                        Aucun dépôt ajouté
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {depots.map((depot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                              <input
                                type="number"
                                step="0.01"
                                value={depot}
                                onChange={(e) => mettreAJourDepot(vendeur, index, e.target.value)}
                                placeholder="Montant"
                                className="flex-1 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50"
                              />
                              <span className="px-2 py-2 font-bold text-sm">HTG</span>
                            </div>
                            <button
                              onClick={() => supprimerDepot(vendeur, index)}
                              className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition"
                              aria-label={`Supprimer dépôt ${index + 1}`}
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Résumé Dépôts */}
                  {depotsValides.length > 0 && (
                    <div className="pt-3 border-t border-white border-opacity-30">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs opacity-90">Dépôts individuels:</div>
                        <div className="flex flex-wrap gap-1">
                          {depotsValides.map((depot, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center gap-1"
                            >
                              <span>{idx + 1}.</span>
                              <span>{formaterArgent(depot)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DepotsManager;