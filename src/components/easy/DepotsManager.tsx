import React, { useState } from 'react';
import { DollarSign, User, Plus, Minus, Globe } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132; // Fixed exchange rate: 1 USD = 132 HTG
  const depotsActuels = tousDepots[shift] || {};

  // Function to convert USD to HTG
  const convertirUSDversHTG = (montantUSD) => {
    return montantUSD * TAUX_DE_CHANGE;
  };

  return (
    <div className="space-y-4">
      {/* Exchange Rate Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <Globe size={20} />
          <div className="text-center">
            <div className="font-bold text-lg">Taux de Change Fixe</div>
            <div className="text-sm opacity-90">1 USD = {TAUX_DE_CHANGE} HTG</div>
          </div>
          <Globe size={20} />
        </div>
        <div className="text-center text-sm mt-2 bg-white bg-opacity-20 rounded-lg p-2">
          💡 Les dépôts en USD seront automatiquement convertis à {TAUX_DE_CHANGE} HTG
        </div>
      </div>

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
                      <div className="flex gap-2">
                        <button
                          onClick={() => ajouterDepot(vendeur)}
                          className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
                        >
                          <Plus size={14} />
                          HTG
                        </button>
                        <button
                          onClick={() => {
                            // Add a deposit in HTG but mark it as originating from USD
                            ajouterDepot(vendeur, 'USD');
                          }}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
                        >
                          <Plus size={14} />
                          USD
                        </button>
                      </div>
                    </div>

                    {depots.length === 0 ? (
                      <div className="text-center py-3 text-white text-opacity-70 text-sm">
                        Aucun dépôt ajouté
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {depots.map((depot, index) => {
                          const depotData = typeof depot === 'object' ? depot : { montant: depot, devise: 'HTG' };
                          const montantHTG = depotData.devise === 'USD' 
                            ? convertirUSDversHTG(parseFloat(depotData.montant) || 0)
                            : parseFloat(depotData.montant) || 0;

                          return (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden mb-1">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={depotData.montant}
                                    onChange={(e) => {
                                      const nouvelleValeur = e.target.value;
                                      if (depotData.devise === 'USD') {
                                        // For USD, convert to HTG and update
                                        const montantConverti = convertirUSDversHTG(parseFloat(nouvelleValeur) || 0);
                                        mettreAJourDepot(vendeur, index, { 
                                          montant: nouvelleValeur, 
                                          devise: 'USD',
                                          montantHTG: montantConverti
                                        });
                                      } else {
                                        mettreAJourDepot(vendeur, index, nouvelleValeur);
                                      }
                                    }}
                                    placeholder="Montant"
                                    className="flex-1 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50"
                                  />
                                  <span className="px-2 py-2 font-bold text-sm min-w-[60px] text-center">
                                    {depotData.devise === 'USD' ? 'USD' : 'HTG'}
                                  </span>
                                </div>
                                {depotData.devise === 'USD' && (
                                  <div className="text-xs text-right opacity-75">
                                    = {formaterArgent(montantHTG)} HTG
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => supprimerDepot(vendeur, index)}
                                className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition"
                                aria-label={`Supprimer dépôt ${index + 1}`}
                              >
                                <Minus size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Résumé Dépôts */}
                  {depotsValides.length > 0 && (
                    <div className="pt-3 border-t border-white border-opacity-30">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs opacity-90">Dépôts individuels (en HTG):</div>
                        <div className="flex flex-wrap gap-1">
                          {depots.map((depot, idx) => {
                            const depotData = typeof depot === 'object' ? depot : { montant: depot, devise: 'HTG' };
                            const montantFinal = depotData.devise === 'USD'
                              ? convertirUSDversHTG(parseFloat(depotData.montant) || 0)
                              : parseFloat(depotData.montant) || 0;

                            return (
                              <div 
                                key={idx} 
                                className={`bg-opacity-20 px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                  depotData.devise === 'USD' ? 'bg-green-500' : 'bg-white'
                                }`}
                              >
                                <span>{idx + 1}.</span>
                                <span>{formaterArgent(montantFinal)} HTG</span>
                                {depotData.devise === 'USD' && (
                                  <span className="text-xs opacity-75 ml-1">
                                    ({parseFloat(depotData.montant) || 0} USD)
                                  </span>
                                )}
                              </div>
                            );
                          })}
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