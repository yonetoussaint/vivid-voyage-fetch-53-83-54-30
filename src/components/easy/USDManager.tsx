import React from 'react';
import { Globe, Plus, Minus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const USDManager = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD, tauxUSD }) => {
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * tauxUSD;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-3 sm:p-4 shadow-xl">
        {/* Header with shift info */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Globe size={18} className="sm:size-5" />
            <h3 className="text-sm sm:text-base font-bold">USD - Shift {shift}</h3>
          </div>
          <button
            onClick={() => ajouterUSD()}
            className="bg-white text-amber-600 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1 active:scale-95 transition min-h-[36px] sm:min-h-[40px]"
          >
            <Plus size={12} className="sm:size-14" />
            <span className="hidden sm:inline">Ajouter</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* USD Summary */}
        <div className="bg-white bg-opacity-20 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90">Total USD</p>
              <p className="text-base sm:text-xl font-bold">${formaterArgent(totalUSD)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs opacity-90">Équivalent HTG</p>
              <p className="text-base sm:text-xl font-bold">{formaterArgent(totalHTG)} HTG</p>
            </div>
          </div>
          <div className="text-[10px] sm:text-xs opacity-90 mt-1.5 sm:mt-2 text-center">
            Taux: 1 USD = {tauxUSD} HTG
          </div>
        </div>

        {/* USD Entries */}
        <div className="space-y-1.5 sm:space-y-2">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="text-center py-2 sm:py-3 text-white text-opacity-70 text-xs sm:text-sm">
              Aucune vente en USD enregistrée
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {usdVentes[shift].map((usd, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden min-h-[44px] sm:min-h-[48px]">
                    <span className="px-2 sm:px-3 py-1.5 sm:py-2 font-bold text-white text-sm sm:text-base">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={usd}
                      onChange={(e) => mettreAJourUSD(index, e.target.value)}
                      placeholder="Montant"
                      className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 text-sm sm:text-base w-full min-w-0"
                      inputMode="decimal"
                    />
                    <span className="px-1 sm:px-2 py-1.5 sm:py-2 font-bold text-xs sm:text-sm text-white">=</span>
                    <span className="px-1 sm:px-2 py-1.5 sm:py-2 font-bold text-xs sm:text-sm text-white whitespace-nowrap">
                      {formaterArgent((parseFloat(usd) || 0) * tauxUSD)} HTG
                    </span>
                  </div>
                  <button
                    onClick={() => supprimerUSD(index)}
                    className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg font-bold active:scale-95 transition min-h-[44px] sm:min-h-[48px] min-w-[44px] sm:min-w-[48px] flex items-center justify-center"
                    aria-label={`Supprimer USD ${index + 1}`}
                  >
                    <Minus size={14} className="sm:size-16" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information Note */}
        <div className="mt-3 sm:mt-4 p-1.5 sm:p-2 bg-white bg-opacity-10 rounded-lg text-[10px] sm:text-xs">
          <p className="font-bold mb-0.5 sm:mb-1">Note:</p>
          <p className="leading-tight">Les ventes en USD sont soustraites du total HTG pour l'équilibrage de caisse.</p>
        </div>
      </div>
    </div>
  );
};

export default USDManager;