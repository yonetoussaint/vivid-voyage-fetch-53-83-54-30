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
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5" />
          <div>
            <h3 className="text-lg font-bold">Ventes en USD</h3>
            <p className="text-sm opacity-90">Shift {shift}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs opacity-90 mb-1">Total USD</p>
            <p className="text-lg font-bold">${formaterArgent(totalUSD)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs opacity-90 mb-1">Équivalent HTG</p>
            <p className="text-lg font-bold">{formaterArgent(totalHTG)}</p>
          </div>
        </div>
        
        <div className="text-xs opacity-90 mb-4 text-center">
          Taux: 1 USD = {tauxUSD} HTG
        </div>

        {/* USD Entries - Compact Version */}
        <div className="space-y-2 mb-4">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <p className="text-white text-opacity-70">Aucune vente en USD</p>
            </div>
          ) : (
            usdVentes[shift].map((usd, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2">
                  <span className="font-bold mr-2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={usd}
                    onChange={(e) => mettreAJourUSD(index, e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none"
                    inputMode="decimal"
                  />
                  <span className="mx-2 opacity-70">=</span>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formaterArgent((parseFloat(usd) || 0) * tauxUSD)} HTG
                  </span>
                </div>
                <button
                  onClick={() => supprimerUSD(index)}
                  className="bg-red-500 text-white p-2 rounded-lg active:scale-95 transition-transform"
                  aria-label="Supprimer"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => ajouterUSD()}
          className="w-full bg-white text-amber-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mb-4"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter USD</span>
        </button>

        {/* Information Note */}
        <div className="text-xs opacity-90">
          <p className="font-semibold">Note:</p>
          <p>Les ventes en USD sont soustraites du total HTG.</p>
        </div>
      </div>
    </div>
  );
};

export default USDManager;