import React from 'react';
import { Globe, Plus, Minus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const USDManager = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD, tauxUSD }) => {
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * tauxUSD;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <h3 className="text-lg font-bold">Ventes en USD - Shift {shift}</h3>
          </div>
          <button
            onClick={() => ajouterUSD()}
            className="bg-white text-amber-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
          >
            <Plus size={14} />
            Ajouter
          </button>
        </div>

        {/* Résumé USD */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90">Total USD</p>
              <p className="text-xl font-bold">${formaterArgent(totalUSD)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Équivalent HTG</p>
              <p className="text-xl font-bold">{formaterArgent(totalHTG)} HTG</p>
            </div>
          </div>
          <div className="text-xs opacity-90 mt-2 text-center">
            Taux: 1 USD = {tauxUSD} HTG
          </div>
        </div>

        {/* Entrées USD */}
        <div className="space-y-2">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="text-center py-3 text-white text-opacity-70 text-sm">
              Aucune vente en USD enregistrée
            </div>
          ) : (
            <div className="space-y-2">
              {usdVentes[shift].map((usd, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                    <span className="px-3 py-2 font-bold text-white">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={usd}
                      onChange={(e) => mettreAJourUSD(index, e.target.value)}
                      placeholder="Montant USD"
                      className="flex-1 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50"
                    />
                    <span className="px-2 py-2 font-bold text-sm text-white">=</span>
                    <span className="px-2 py-2 font-bold text-sm text-white">
                      {formaterArgent((parseFloat(usd) || 0) * tauxUSD)} HTG
                    </span>
                  </div>
                  <button
                    onClick={() => supprimerUSD(index)}
                    className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition"
                    aria-label={`Supprimer USD ${index + 1}`}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note d'information */}
        <div className="mt-4 p-2 bg-white bg-opacity-10 rounded-lg text-xs">
          <p className="font-bold mb-1">Note:</p>
          <p>Les ventes en USD sont soustraites du total HTG pour l'équilibrage de caisse.</p>
        </div>
      </div>
    </div>
  );
};

export default USDManager;