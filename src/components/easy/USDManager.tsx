import React from 'react';
import { Globe, Plus, Minus, DollarSign } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const USDManager = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD, tauxUSD }) => {
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * tauxUSD;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div>
              <h3 className="font-bold">USD - Shift {shift}</h3>
              <p className="text-xs opacity-90">Taux: {tauxUSD} HTG</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">Total</p>
            <p className="text-lg font-bold">${formaterArgent(totalUSD)}</p>
          </div>
        </div>

        {/* USD Entries */}
        <div className="space-y-2 mb-4">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-white text-opacity-70 text-sm">Aucune vente en USD</p>
            </div>
          ) : (
            usdVentes[shift].map((usd, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg overflow-hidden">
                {/* Entry Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-white bg-opacity-10">
                  <span className="text-sm font-medium">Entrée #{index + 1}</span>
                  <button
                    onClick={() => supprimerUSD(index)}
                    className="text-red-300 hover:text-white p-1 active:scale-95"
                    aria-label="Supprimer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Entry Content */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={usd}
                      onChange={(e) => mettreAJourUSD(index, e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-white text-lg font-bold text-center placeholder-white placeholder-opacity-50 focus:outline-none"
                      inputMode="decimal"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 bg-white bg-opacity-10 px-3 py-1.5 rounded-lg">
                      <span className="text-xs opacity-90">=</span>
                      <span className="font-semibold text-sm">
                        {formaterArgent((parseFloat(usd) || 0) * tauxUSD)}
                      </span>
                      <span className="text-xs opacity-90 ml-1">HTG</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button - Always visible */}
        <button
          onClick={() => ajouterUSD()}
          className="w-full bg-white text-amber-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mb-3"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter USD</span>
        </button>

        {/* Summary */}
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90 mb-1">Total USD</p>
              <p className="font-bold">${formaterArgent(totalUSD)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90 mb-1">Total HTG</p>
              <p className="font-bold">{formaterArgent(totalHTG)}</p>
            </div>
          </div>
          <div className="text-xs opacity-90 mt-2 pt-2 border-t border-white border-opacity-20">
            <p>Soustrait du total HTG pour l'équilibrage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USDManager;