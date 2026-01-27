import React, { useState } from 'react';
import { Globe, Plus, Minus, DollarSign, Calculator, ChevronDown, ChevronUp, Info, Copy, RefreshCw } from 'lucide-react';

const USDtoHTDConverter = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD }) => {
  // Taux de conversion (selon vos informations)
  const TAUX_USD_HTG = 132; // 1 USD = 132 HTG (taux réel)
  const TAUX_HTG_HTD = 5; // 1 HTD = 5 HTG (Dola)
  const TAUX_USD_HTD = TAUX_USD_HTG / TAUX_HTG_HTD; // 1 USD = 26.4 HTD (132/5)
  
  const [showDetails, setShowDetails] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState({});
  const [exchangeRateNote, setExchangeRateNote] = useState("Taux officiel du jour");

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
    // Vous pouvez ajouter un toast ici si nécessaire
  };

  const calculateIndividualBreakdown = (usdAmount) => {
    const usd = parseFloat(usdAmount) || 0;
    const htg = usd * TAUX_USD_HTG;
    const htd = usd * TAUX_USD_HTD;
    
    return { usd, htg, htd };
  };

  return (
    <div className="space-y-3">
      {/* Main Converter Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-2 shadow-2xl">
        
        {/* Header with Conversion Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Globe className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">USD → HTD Converter</h3>
                <div className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  Shift {shift}
                </div>
              </div>
              <p className="text-xs opacity-90 mt-1">Convertisseur Dépôts NPT</p>
              
              {/* Exchange Rate Banner */}
              <div className="mt-3 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 rounded p-2">
                    <div className="text-xs opacity-90">1 USD</div>
                    <div className="font-bold text-sm">= {TAUX_USD_HTG} HTG</div>
                  </div>
                  <div className="flex items-center justify-center opacity-60">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="bg-white/15 rounded p-2">
                    <div className="text-xs opacity-90">1 HTD</div>
                    <div className="font-bold text-sm">= 5 HTG</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/20 text-center">
                  <div className="font-bold text-sm">1 USD = {TAUX_USD_HTD.toFixed(2)} HTD</div>
                  <div className="text-xs opacity-90 mt-1">(Dola Haïtien)</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/20 p-2 rounded-lg hover:bg-white/30 active:scale-95"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => ajouterUSD()}
              className="bg-white text-blue-700 p-2 rounded-lg hover:bg-blue-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Detailed Conversion Summary */}
        {showDetails && (
          <div className="mb-4 bg-white/10 rounded-xl p-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4" />
              <h4 className="font-semibold">Détails de Conversion</h4>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-90 mb-1">Total USD Dépôts</div>
                  <div className="font-bold text-lg">${formaterMontant(totalUSD)}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {usdVentes[shift]?.length || 0} séquence{usdVentes[shift]?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="bg-white/15 rounded-lg p-3">
                  <div className="text-xs opacity-90 mb-1">Total HTD (Dola)</div>
                  <div className="font-bold text-lg">{formaterMontant(totalHTD)} HTD</div>
                  <div className="text-xs mt-1 opacity-80">Valeur finale</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-lg p-3">
                <div className="text-center text-sm font-semibold mb-2">Récapitulatif de Conversion</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="text-xs opacity-90">USD</div>
                  <div className="text-xs opacity-90">× {TAUX_USD_HTG}</div>
                  <div className="text-xs opacity-90">÷ 5</div>
                  <div className="font-bold">${formaterMontant(totalUSD)}</div>
                  <div className="font-bold">{formaterMontant(totalHTG)} HTG</div>
                  <div className="font-bold">{formaterMontant(totalHTD)} HTD</div>
                  <div className="col-span-3 mt-2 pt-2 border-t border-white/20">
                    <div className="text-xs opacity-90">Formule: USD × 132 ÷ 5 = HTD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USD Entries List - Mobile Optimized */}
        <div className="space-y-3 mb-4 max-h-[60vh] overflow-y-auto pr-1">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 opacity-70" />
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Aucun dépôt USD</p>
              <p className="text-white/50 text-xs">Tapez "Ajouter" pour commencer</p>
              <button
                onClick={() => ajouterUSD()}
                className="mt-4 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm active:scale-95"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Premier Dépôt
              </button>
            </div>
          ) : (
            usdVentes[shift].map((usd, index) => {
              const breakdown = calculateIndividualBreakdown(usd);
              const isExpanded = showBreakdown[index];
              
              return (
                <div key={index} className="bg-white/15 rounded-xl overflow-hidden">
                  {/* Entry Header - Touch Friendly */}
                  <div 
                    className="flex items-center justify-between px-4 py-3 bg-white/20 active:bg-white/30"
                    onClick={() => toggleBreakdown(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">Dépôt #{index + 1}</div>
                        <div className="text-xs opacity-90 flex items-center gap-1">
                          <span>${formaterMontant(breakdown.usd)} USD</span>
                          <ChevronRight className="h-3 w-3" />
                          <span>{formaterMontant(breakdown.htd)} HTD</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          supprimerUSD(index);
                        }}
                        className="bg-red-500/20 text-red-300 p-1.5 rounded-lg active:scale-95"
                        aria-label="Supprimer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 py-3 bg-white/10 animate-slideDown">
                      {/* Input for Editing */}
                      <div className="mb-4">
                        <label className="block text-xs opacity-90 mb-2">Modifier le montant USD</label>
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                          <span className="font-bold text-lg">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={usd}
                            onChange={(e) => mettreAJourUSD(index, e.target.value)}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white text-xl font-bold text-center placeholder-white/50 focus:outline-none"
                            inputMode="decimal"
                            min="0"
                          />
                          <button 
                            onClick={() => copyToClipboard(usd)}
                            className="p-1.5 bg-white/10 rounded-lg active:scale-95"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Detailed Conversion */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-xs opacity-90 mb-1">Valeur en HTG</div>
                            <div className="font-bold text-lg">{formaterMontant(breakdown.htg)}</div>
                            <div className="text-xs mt-1 opacity-80">Gourdes</div>
                          </div>
                          <div className="bg-white/15 rounded-lg p-3">
                            <div className="text-xs opacity-90 mb-1">Valeur en HTD</div>
                            <div className="font-bold text-lg">{formaterMontant(breakdown.htd)}</div>
                            <div className="text-xs mt-1 opacity-80">Dola</div>
                          </div>
                        </div>

                        {/* Conversion Steps */}
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-xs opacity-90 mb-2">Calcul détaillé:</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>${formaterMontant(breakdown.usd)} USD</span>
                              <span className="opacity-70">× {TAUX_USD_HTG}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/20 pt-2">
                              <span>= {formaterMontant(breakdown.htg)} HTG</span>
                              <span className="opacity-70">÷ {TAUX_HTG_HTD}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/20 pt-2 font-bold">
                              <span>= {formaterMontant(breakdown.htd)} HTD</span>
                              <span className="text-emerald-300">✓</span>
                            </div>
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

        {/* Quick Add Button - Sticky on Mobile */}
        <button
          onClick={() => ajouterUSD()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg mb-4"
        >
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-lg">Nouveau Dépôt USD</span>
        </button>

        {/* Final Summary - Always Visible */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4" />
            <h4 className="font-semibold">Résumé Final</h4>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs opacity-90 mb-1">USD Total</div>
                <div className="font-bold text-lg">${formaterMontant(totalUSD)}</div>
              </div>
              <div className="bg-white/15 rounded-lg p-3">
                <div className="text-xs opacity-90 mb-1">HTG Total</div>
                <div className="font-bold text-lg">{formaterMontant(totalHTG)}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3">
                <div className="text-xs opacity-90 mb-1">HTD Total</div>
                <div className="font-bold text-lg">{formaterMontant(totalHTD)}</div>
                <div className="text-xs opacity-90">Dola</div>
              </div>
            </div>
            
            {/* Conversion Summary Bar */}
            <div className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Conversion Totale</span>
                <button 
                  onClick={() => copyToClipboard(`${formaterMontant(totalUSD)} USD = ${formaterMontant(totalHTD)} HTD`)}
                  className="text-xs bg-white/10 px-2 py-1 rounded active:scale-95"
                >
                  Copier
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="bg-white/20 px-3 py-1.5 rounded-lg">
                  ${formaterMontant(totalUSD)}
                </div>
                <div className="opacity-70">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-lg">
                  {formaterMontant(totalHTG)} HTG
                </div>
                <div className="opacity-70">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 rounded-lg font-bold">
                  {formaterMontant(totalHTD)} HTD
                </div>
              </div>
              <div className="text-center text-xs opacity-90 mt-2">
                Basé sur: 1 USD = {TAUX_USD_HTG} HTG, 1 HTD = {TAUX_HTG_HTD} HTG
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/10 py-2 rounded-lg flex items-center justify-center gap-2 active:scale-95"
              >
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="text-sm">{showDetails ? 'Moins' : 'Plus'}</span>
              </button>
              <button 
                onClick={() => copyToClipboard(`Dépôts NPT - Shift ${shift}: $${formaterMontant(totalUSD)} USD = ${formaterMontant(totalHTD)} HTD`)}
                className="bg-white/20 py-2 rounded-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <Copy className="h-4 w-4" />
                <span className="text-sm">Copier Résumé</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom styles for mobile optimization */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Touch-friendly tap targets */
        @media (max-width: 640px) {
          input, button {
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          .min-tap-target {
            min-height: 44px;
            min-width: 44px;
          }
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