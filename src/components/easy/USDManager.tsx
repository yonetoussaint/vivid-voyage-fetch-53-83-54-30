import React, { useState } from 'react';
import { Globe, Plus, Minus, DollarSign } from 'lucide-react';

const USDtoHTDConverter = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD }) => {
  // Taux de conversion fixe : 1 USD = 5 HTG = 1 HTD (Dola)
  const TAUX_USD_HTG = 5; // 1 USD = 5 HTG
  const TAUX_HTG_HTD = 0.2; // 5 HTG = 1 HTD (ou 1 HTD = 5 HTG)
  
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * TAUX_USD_HTG;
  const totalHTD = totalUSD; // Puisque 1 USD = 1 HTD (Dola)

  // Formatter pour afficher les montants
  const formaterMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div>
              <h3 className="font-bold">USD → HTD - Shift {shift}</h3>
              <p className="text-xs opacity-90">Conversion: 1 USD = 5 HTG = 1 HTD (Dola)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">Total USD</p>
            <p className="text-lg font-bold">${formaterMontant(totalUSD)}</p>
          </div>
        </div>

        {/* USD Entries */}
        <div className="space-y-2 mb-4">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-white text-opacity-70 text-sm">Aucune entrée USD</p>
              <p className="text-white text-opacity-50 text-xs mt-1">Ajoutez des séquences USD (ex: 50, 20, 10)</p>
            </div>
          ) : (
            usdVentes[shift].map((usd, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg overflow-hidden">
                {/* Entry Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-white bg-opacity-10">
                  <span className="text-sm font-medium">Séquence #{index + 1}</span>
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
                  <div className="flex items-center gap-2 mb-3">
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

                  {/* Conversion Display */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-lg text-center">
                      <div className="text-xs opacity-90 mb-1">HTG</div>
                      <div className="font-semibold">
                        {formaterMontant((parseFloat(usd) || 0) * TAUX_USD_HTG)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-15 px-3 py-1.5 rounded-lg text-center">
                      <div className="text-xs opacity-90 mb-1">HTD (Dola)</div>
                      <div className="font-semibold">
                        {formaterMontant(parseFloat(usd) || 0)}
                      </div>
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
          <span>Ajouter Séquence USD</span>
        </button>

        {/* Summary */}
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div>
              <p className="text-xs opacity-90 mb-1">Total USD</p>
              <p className="font-bold text-sm">${formaterMontant(totalUSD)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90 mb-1">Total HTG</p>
              <p className="font-bold text-sm">{formaterMontant(totalHTG)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90 mb-1">Total HTD</p>
              <p className="font-bold text-sm">{formaterMontant(totalHTD)}</p>
            </div>
          </div>
          
          <div className="text-xs opacity-90 pt-2 border-t border-white border-opacity-20">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="font-semibold">${formaterMontant(totalUSD)} USD</div>
              </div>
              <div className="text-center opacity-50">→</div>
              <div className="text-center">
                <div className="font-semibold">{formaterMontant(totalHTD)} HTD</div>
                <div className="text-[10px]">(Dola)</div>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px]">Conversion: 1 USD = 5 HTG = 1 HTD</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USDtoHTDConverter;