import React from 'react';
import { Globe, Plus, Minus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const USDManager = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD, tauxUSD }) => {
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * tauxUSD;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-6 w-6" />
          <div>
            <h3 className="text-xl font-bold">Ventes en USD</h3>
            <p className="text-sm opacity-90">Shift {shift}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Total USD</p>
            <p className="text-2xl font-bold">${formaterArgent(totalUSD)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Équivalent HTG</p>
            <p className="text-2xl font-bold">{formaterArgent(totalHTG)} HTG</p>
            <p className="text-xs opacity-90 mt-2">Taux: 1 USD = {tauxUSD} HTG</p>
          </div>
        </div>

        {/* USD Entries */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-3 opacity-90">Entrées USD</h4>
          
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center mb-4">
              <div className="mb-3">
                <Globe className="h-10 w-10 mx-auto opacity-50" />
              </div>
              <p className="text-white text-opacity-70 mb-1">Aucune vente en USD enregistrée</p>
              <p className="text-xs opacity-70">Appuyez sur le bouton ci-dessous pour ajouter</p>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {usdVentes[shift].map((usd, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium opacity-90">Entrée #{index + 1}</span>
                    <button
                      onClick={() => supprimerUSD(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md font-bold transition-colors active:scale-95"
                      aria-label="Supprimer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs opacity-80 mb-1">Montant USD</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={usd}
                          onChange={(e) => mettreAJourUSD(index, e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-3 bg-white bg-opacity-20 rounded-lg text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-xl font-bold mx-2 opacity-80">=</span>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs opacity-80 mb-1">Équivalent HTG</label>
                      <div className="bg-white bg-opacity-20 rounded-lg px-3 py-3">
                        <p className="text-white font-semibold text-right">
                          {formaterArgent((parseFloat(usd) || 0) * tauxUSD)} HTG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button - Now at the bottom */}
          <button
            onClick={() => ajouterUSD()}
            className="w-full bg-white text-amber-600 py-3 rounded-lg font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-transform hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="text-lg">Ajouter une entrée USD</span>
          </button>
        </div>

        {/* Information Note */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mt-6">
          <p className="font-bold mb-2">Note importante</p>
          <p className="text-sm opacity-90 leading-relaxed">
            Les ventes en USD sont soustraites du total HTG pour l'équilibrage de caisse. 
            Assurez-vous que les montants soient correctement convertis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default USDManager;