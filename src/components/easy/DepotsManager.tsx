import React from 'react';
import { DollarSign, User, Plus, Minus, Globe } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132; // Fixed exchange rate: 1 USD = 132 HTG
  const depotsActuels = tousDepots[shift] || {};

  // Function to convert USD to HTG
  const convertirUSDversHTG = (montantUSD) => {
    return (parseFloat(montantUSD) || 0) * TAUX_DE_CHANGE;
  };

  // Helper function to get deposit amount in HTG
  const getMontantHTG = (depot) => {
    if (!depot) return 0;
    
    if (typeof depot === 'object' && depot.devise === 'USD') {
      return convertirUSDversHTG(depot.montant);
    }
    
    return parseFloat(depot) || 0;
  };

  // Helper function to get the display value for input
  const getDisplayValue = (depot) => {
    if (!depot) return '';
    
    if (typeof depot === 'object' && depot.devise === 'USD') {
      return depot.montant || '';
    }
    
    return depot || '';
  };

  // Check if deposit is in USD
  const isUSDDepot = (depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
  };

  return (
    <div className="space-y-4">
      {/* Exchange Rate Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <Globe size={18} />
          <div className="text-center">
            <div className="font-bold">Taux de Change</div>
            <div className="text-sm opacity-90">1 USD = {TAUX_DE_CHANGE} HTG</div>
          </div>
          <Globe size={18} />
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
              const totalDepotHTG = depots.reduce((sum, depot) => sum + getMontantHTG(depot), 0);
              const donneesVendeur = totauxVendeurs[vendeur];
              const especesAttendues = donneesVendeur ? (donneesVendeur.ventesTotales - totalDepotHTG) : 0;

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
                      <span className="font-bold">{formaterArgent(totalDepotHTG)} HTG</span>
                    </div>
                  </div>

                  {/* Entrées Dépôts */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Entrées Dépôts</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => ajouterDepot(vendeur, 'HTG')}
                          className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
                        >
                          <Plus size={14} />
                          HTG
                        </button>
                        <button
                          onClick={() => ajouterDepot(vendeur, 'USD')}
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
                          const isUSD = isUSDDepot(depot);
                          const displayValue = getDisplayValue(depot);
                          const montantHTG = getMontantHTG(depot);
                          
                          return (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              {/* Input container */}
                              <div className="flex-1 w-full">
                                <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={displayValue}
                                    onChange={(e) => {
                                      if (isUSD) {
                                        mettreAJourDepot(vendeur, index, {
                                          montant: e.target.value,
                                          devise: 'USD'
                                        });
                                      } else {
                                        mettreAJourDepot(vendeur, index, e.target.value);
                                      }
                                    }}
                                    placeholder="Montant"
                                    className="flex-1 w-0 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none"
                                  />
                                  <span className={`px-3 py-2 font-bold text-sm w-20 text-center ${
                                    isUSD ? 'bg-green-500 bg-opacity-50' : ''
                                  }`}>
                                    {isUSD ? 'USD' : 'HTG'}
                                  </span>
                                </div>
                                {isUSD && (
                                  <div className="text-xs text-right opacity-75 mt-1">
                                    = {formaterArgent(montantHTG)} HTG
                                  </div>
                                )}
                              </div>
                              
                              {/* Delete button - always visible */}
                              <button
                                onClick={() => supprimerDepot(vendeur, index)}
                                className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition self-end sm:self-center"
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
                  {depots.length > 0 && (
                    <div className="pt-3 border-t border-white border-opacity-30">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs opacity-90">Dépôts individuels (en HTG):</div>
                        <div className="flex flex-wrap gap-1">
                          {depots.map((depot, idx) => {
                            const montantHTG = getMontantHTG(depot);
                            const isUSD = isUSDDepot(depot);
                            const montantOriginal = isUSD ? depot.montant : depot;
                            
                            return (
                              <div 
                                key={idx} 
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                  isUSD 
                                    ? 'bg-green-500 bg-opacity-30 text-green-100' 
                                    : 'bg-white bg-opacity-20'
                                }`}
                              >
                                <span className="font-bold">{idx + 1}.</span>
                                <span>{formaterArgent(montantHTG)} HTG</span>
                                {isUSD && (
                                  <span className="text-xs opacity-75 ml-1">
                                    ({parseFloat(montantOriginal) || 0} USD)
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