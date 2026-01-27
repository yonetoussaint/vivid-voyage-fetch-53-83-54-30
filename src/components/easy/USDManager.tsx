import React, { useState } from 'react';
import { Globe, Plus, Minus, DollarSign, Calculator, ChevronDown, ChevronUp, Info, Copy } from 'lucide-react';

const USDtoHTDConverter = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD }) => {
  // Taux de conversion (selon vos informations)
  const TAUX_USD_HTG = 132; // 1 USD = 132 HTG (taux réel)
  const TAUX_HTG_HTD = 5; // 1 HTD = 5 HTG (Dola)
  const TAUX_USD_HTD = TAUX_USD_HTG / TAUX_HTG_HTD; // 1 USD = 26.4 HTD (132/5)

  const [showDetails, setShowDetails] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState({});

  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * TAUX_USD_HTG;
  const totalHTD = totalUSD * TAUX_USD_HTD;

  const formaterMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  const toggleBreakdown = (index) => {
    setShowBreakdown(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const calculateIndividualBreakdown = (usdAmount) => {
    const usd = parseFloat(usdAmount) || 0;
    const htg = usd * TAUX_USD_HTG;
    const htd = usd * TAUX_USD_HTD;

    return { usd, htg, htd };
  };

  return (
    <div className="space-y-0">
      {/* Main Converter Card - Compact design */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-0 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header with Ultra Simple Rate Board - USD to HTG only */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-xl">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">USD → HTD Converter</h3>
                <div className="text-[10px] opacity-90">Shift {shift} • Convertisseur NPT</div>
              </div>
            </div>

            {/* Quick Actions - Compact */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/20 p-1.5 rounded-lg hover:bg-white/30 active:scale-95 transition-all duration-200"
              >
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              <button 
                onClick={() => ajouterUSD()}
                className="bg-white text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Ultra Simple Rate Board - USD to HTG only */}
          <div className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl px-4 py-3">
            <div className="text-center">
              <div className="text-xs opacity-90 mb-1">Taux de Change</div>
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <div className="bg-white/20 px-3 py-1.5 rounded-lg">1 USD</div>
                <ChevronRight className="h-5 w-5 opacity-80" />
                <div className="bg-white/20 px-3 py-1.5 rounded-lg">{TAUX_USD_HTG} HTG</div>
              </div>
              <div className="text-[10px] opacity-90 mt-2">
                Conversion: USD × 132 ÷ 5 = HTD • 1 USD = {TAUX_USD_HTD.toFixed(1)} HTD
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Conversion Summary - Compact */}
        {showDetails && (
          <div className="mb-3 bg-white/10 p-3 animate-fadeIn mx-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <Calculator className="h-3 w-3" />
              <h4 className="font-semibold text-sm">Détails de Conversion</h4>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-[10px] opacity-90 mb-0.5">Total USD</div>
                  <div className="font-bold text-sm">${formaterMontant(totalUSD)}</div>
                  <div className="text-[10px] mt-0.5 opacity-80">
                    {usdVentes[shift]?.length || 0} séquence{usdVentes[shift]?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="bg-white/15 rounded-lg p-2">
                  <div className="text-[10px] opacity-90 mb-0.5">Total HTD</div>
                  <div className="font-bold text-sm">{formaterMontant(totalHTD)} HTD</div>
                  <div className="text-[10px] mt-0.5 opacity-80">Dola Haïtien</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USD Entries List - Compact */}
        <div className="px-3 space-y-2 mb-3 max-h-[50vh] overflow-y-auto">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-4 w-4 opacity-70" />
              </div>
              <p className="text-white/80 text-xs font-medium mb-1">Aucun dépôt USD</p>
              <p className="text-white/50 text-[10px]">Tapez "Ajouter" pour commencer</p>
              <button
                onClick={() => ajouterUSD()}
                className="mt-3 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                <Plus className="h-3 w-3" />
                Premier Dépôt
              </button>
            </div>
          ) : (
            usdVentes[shift].map((usd, index) => {
              const breakdown = calculateIndividualBreakdown(usd);
              const isExpanded = showBreakdown[index];

              return (
                <div key={index} className="bg-white/15 rounded-xl overflow-hidden shadow-sm">
                  {/* Entry Header - Compact */}
                  <div 
                    className="flex items-center justify-between px-3 py-2 bg-white/20 active:bg-white/30 min-h-[52px] cursor-pointer"
                    onClick={() => toggleBreakdown(index)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="font-bold text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Dépôt #{index + 1}</div>
                        <div className="text-[10px] opacity-90 flex items-center gap-1">
                          <span>${formaterMontant(breakdown.usd)}</span>
                          <ChevronRight className="h-2.5 w-2.5" />
                          <span>{formaterMontant(breakdown.htd)} HTD</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          supprimerUSD(index);
                        }}
                        className="bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 p-1 rounded-lg active:scale-95 min-h-[32px] min-w-[32px] flex items-center justify-center shadow-sm transition-all duration-200"
                        aria-label="Supprimer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <div className={`transition-all duration-200 ${isExpanded ? 'rotate-180' : ''} min-h-[32px] min-w-[32px] flex items-center justify-center`}>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Compact */}
                  {isExpanded && (
                    <div className="px-3 py-2 bg-gradient-to-br from-white/5 to-white/10 animate-slideDown">
                      {/* Input for Editing */}
                      <div className="mb-2">
                        <label className="block text-[10px] opacity-90 mb-1">Modifier USD</label>
                        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1.5">
                          <span className="font-bold text-base">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={usd}
                            onChange={(e) => mettreAJourUSD(index, e.target.value)}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white text-base font-bold text-center placeholder-white/50 focus:outline-none rounded px-1"
                            inputMode="decimal"
                            min="0"
                          />
                          <button 
                            onClick={() => copyToClipboard(usd)}
                            className="p-1 bg-white/10 rounded-lg active:scale-95 min-h-[32px] min-w-[32px] flex items-center justify-center transition-all duration-200"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Detailed Conversion - Compact */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-2">
                            <div className="text-[10px] opacity-90 mb-0.5">En HTG</div>
                            <div className="font-bold text-sm">{formaterMontant(breakdown.htg)}</div>
                          </div>
                          <div className="bg-gradient-to-br from-white/15 to-white/10 rounded-lg p-2">
                            <div className="text-[10px] opacity-90 mb-0.5">En HTD</div>
                            <div className="font-bold text-sm">{formaterMontant(breakdown.htd)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Nouveau Dépôt USD Button - Ultra Simple with consistent padding */}
        <div className="px-3 mb-3">
          <button
            onClick={() => ajouterUSD()}
            className="w-full bg-emerald-600 text-white py-3 px-4 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 rounded-xl"
          >
            <Plus className="h-5 w-5" />
            <span className="text-base">Nouveau Dépôt USD</span>
          </button>
        </div>

        {/* Final Summary - Compact */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 px-3 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="h-3 w-3" />
            <h4 className="font-semibold text-sm">Résumé Final</h4>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-2">
                <div className="text-[10px] opacity-90 mb-0.5">USD Total</div>
                <div className="font-bold text-sm">${formaterMontant(totalUSD)}</div>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/10 rounded-lg p-2">
                <div className="text-[10px] opacity-90 mb-0.5">HTG Total</div>
                <div className="font-bold text-sm">{formaterMontant(totalHTG)}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-2 shadow-sm">
                <div className="text-[10px] opacity-90 mb-0.5">HTD Total</div>
                <div className="font-bold text-sm">{formaterMontant(totalHTD)}</div>
              </div>
            </div>

            {/* Conversion Summary Bar - Compact */}
            <div className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-xl p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">Conversion Totale</span>
                <button 
                  onClick={() => copyToClipboard(`${formaterMontant(totalUSD)} USD = ${formaterMontant(totalHTD)} HTD`)}
                  className="text-[10px] bg-white/10 px-2 py-0.5 rounded-lg active:scale-95 min-h-[24px] min-w-[50px] flex items-center justify-center transition-all duration-200"
                >
                  Copier
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
                <div className="bg-gradient-to-br from-white/20 to-white/10 px-2 py-1 rounded-lg">
                  ${formaterMontant(totalUSD)}
                </div>
                <ChevronRight className="h-3 w-3 opacity-70" />
                <div className="bg-gradient-to-br from-white/20 to-white/10 px-2 py-1 rounded-lg">
                  {formaterMontant(totalHTG)} HTG
                </div>
                <ChevronRight className="h-3 w-3 opacity-70" />
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-2 py-1 rounded-lg font-bold">
                  {formaterMontant(totalHTD)} HTD
                </div>
              </div>
              <div className="text-center text-[10px] opacity-90 mt-1">
                1 USD = {TAUX_USD_HTG} HTG • 1 HTD = {TAUX_HTG_HTD} HTG
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="bg-gradient-to-br from-white/10 to-white/5 py-2 rounded-lg flex items-center justify-center gap-1.5 active:scale-95 min-h-[36px] transition-all duration-200 text-xs"
              >
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                <span>{showDetails ? 'Moins' : 'Plus'}</span>
              </button>
              <button 
                onClick={() => copyToClipboard(`Dépôts NPT - Shift ${shift}: $${formaterMontant(totalUSD)} USD = ${formaterMontant(totalHTD)} HTD`)}
                className="bg-gradient-to-br from-white/20 to-white/10 py-2 rounded-lg flex items-center justify-center gap-1.5 active:scale-95 min-h-[36px] transition-all duration-200 text-xs"
              >
                <Copy className="h-3 w-3" />
                <span>Copier Résumé</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { 
            max-height: 0; 
            opacity: 0; 
            transform: scaleY(0.8);
          }
          to { 
            max-height: 300px; 
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Compact scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        input, button {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

// Helper component for arrow
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default USDtoHTDConverter;