import React, { useState } from 'react';
import { Plus, Minus, DollarSign, ChevronDown, ChevronUp, Copy, X, Calculator, Banknote, Phone, Smartphone } from 'lucide-react';

const USDtoHTDConverter = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD }) => {
  const TAUX_USD_HTG = 132; // 1 USD = 132 HTG
  const TAUX_HTG_HTD = 5; // 1 HTD = 5 HTG
  const TAUX_USD_HTD = TAUX_USD_HTG / TAUX_HTG_HTD; // 1 USD = 26.4 HTD
  
  const [activeEntry, setActiveEntry] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [quickAddAmount, setQuickAddAmount] = useState('');

  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * TAUX_USD_HTG;
  const totalHTD = totalUSD * TAUX_USD_HTD;

  const formaterMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  const handleQuickAdd = () => {
    if (quickAddAmount && !isNaN(parseFloat(quickAddAmount))) {
      ajouterUSD(parseFloat(quickAddAmount));
      setQuickAddAmount('');
      setShowCalculator(false);
    }
  };

  const presetAmounts = [1, 5, 10, 20, 50, 100];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2">
      {/* Header - Fixed Top */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-b-2xl mb-3">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Banknote className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">USD → HTD Converter</h1>
                <p className="text-xs opacity-90 mt-1">Shift {shift} • Dépôts NPT</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-90">Total</div>
              <div className="text-lg font-bold">${formaterMontant(totalUSD)}</div>
            </div>
          </div>
          
          {/* Exchange Rate Bar */}
          <div className="bg-white/10 rounded-lg p-3 mt-2">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-xs opacity-90">1 USD</div>
                <div className="font-bold">= 132 HTG</div>
              </div>
              <div className="flex items-center justify-center">
                <ChevronDown className="h-4 w-4 opacity-70" />
              </div>
              <div>
                <div className="text-xs opacity-90">1 HTD</div>
                <div className="font-bold">= 5 HTG</div>
              </div>
            </div>
            <div className="text-center mt-2 pt-2 border-t border-white/20">
              <div className="font-bold text-sm">1 USD = {TAUX_USD_HTD.toFixed(1)} HTD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons - Large Touch Targets */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center justify-center active:scale-95 active:shadow-inner"
        >
          <Calculator className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium">Calculatrice</span>
        </button>
        
        <button
          onClick={() => {
            ajouterUSD();
            setActiveEntry(usdVentes[shift]?.length || 0);
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg rounded-xl p-4 flex flex-col items-center justify-center active:scale-95"
        >
          <Plus className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Nouveau</span>
        </button>
        
        <button
          onClick={() => navigator.vibrate?.(50)}
          className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center justify-center active:scale-95 active:shadow-inner"
        >
          <Smartphone className="h-6 w-6 text-purple-600 mb-2" />
          <span className="text-sm font-medium">Vibrer</span>
        </button>
      </div>

      {/* Quick Calculator */}
      {showCalculator && (
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Ajout Rapide</h3>
            <button
              onClick={() => setShowCalculator(false)}
              className="p-2 bg-gray-100 rounded-lg active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="number"
              value={quickAddAmount}
              onChange={(e) => setQuickAddAmount(e.target.value)}
              placeholder="Montant USD"
              className="w-full text-3xl font-bold text-center p-4 bg-gray-50 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
              inputMode="decimal"
            />
          </div>
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => setQuickAddAmount(amount.toString())}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-bold active:scale-95 active:bg-blue-200"
              >
                ${amount}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleQuickAdd}
            disabled={!quickAddAmount}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 active:scale-95"
          >
            AJOUTER DÉPÔT
          </button>
        </div>
      )}

      {/* USD Entries List - Touch Optimized */}
      <div className="space-y-3 mb-4">
        {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-10 w-10 text-blue-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucun dépôt USD</h3>
            <p className="text-gray-500 text-sm mb-6">Commencez par ajouter un premier dépôt</p>
            <button
              onClick={() => ajouterUSD()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-bold text-lg active:scale-95 w-full"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Premier Dépôt
            </button>
          </div>
        ) : (
          usdVentes[shift].map((usd, index) => {
            const usdAmount = parseFloat(usd) || 0;
            const htg = usdAmount * TAUX_USD_HTG;
            const htd = usdAmount * TAUX_USD_HTD;
            const isActive = activeEntry === index;

            return (
              <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
                
                {/* Entry Header - Extra Large Touch Area */}
                <div 
                  className="p-4 active:bg-gray-50"
                  onClick={() => setActiveEntry(isActive ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">${formaterMontant(usdAmount)} USD</div>
                        <div className="text-sm text-gray-600">
                          = {formaterMontant(htd)} HTD
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          supprimerUSD(index);
                        }}
                        className="p-3 bg-red-50 text-red-600 rounded-lg active:scale-95 active:bg-red-100"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Extra Large Inputs */}
                {isActive && (
                  <div className="border-t border-gray-100 p-4 bg-blue-50/30">
                    {/* Large Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Montant USD
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-blue-600">
                          $
                        </div>
                        <input
                          type="number"
                          value={usd}
                          onChange={(e) => mettreAJourUSD(index, e.target.value)}
                          className="w-full text-3xl font-bold text-center p-4 pl-12 bg-white rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                          placeholder="0.00"
                          inputMode="decimal"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Conversion Results - Large Display */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-xs text-gray-500 mb-2">VALEUR HTG</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {formaterMontant(htg)}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Gourdes</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-xs opacity-90 mb-2">VALEUR HTD</div>
                        <div className="text-2xl font-bold">
                          {formaterMontant(htd)}
                        </div>
                        <div className="text-xs opacity-90 mt-2">Dola</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => copyToClipboard(`$${usd} USD = ${formaterMontant(htd)} HTD`)}
                        className="bg-blue-100 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Copy className="h-4 w-4" />
                        Copier
                      </button>
                      <button
                        onClick={() => setActiveEntry(null)}
                        className="bg-gray-100 text-gray-700 py-3 rounded-lg font-medium active:scale-95"
                      >
                        Terminer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Bottom Summary - Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl p-4 border-t border-gray-200">
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">USD TOTAL</div>
              <div className="text-xl font-bold text-blue-600">${formaterMontant(totalUSD)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">HTG TOTAL</div>
              <div className="text-xl font-bold text-gray-800">{formaterMontant(totalHTG)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">HTD TOTAL</div>
              <div className="text-xl font-bold text-green-600">{formaterMontant(totalHTD)}</div>
            </div>
          </div>
        </div>
        
        {/* Main Action Button - Extra Large */}
        <button
          onClick={() => {
            ajouterUSD();
            setActiveEntry(usdVentes[shift]?.length || 0);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl font-bold text-lg shadow-lg active:scale-95 active:shadow-inner flex items-center justify-center gap-3"
        >
          <Plus className="h-6 w-6" />
          <span>AJOUTER UN DÉPÔT USD</span>
        </button>
        
        {/* Quick Stats */}
        <div className="text-center mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {usdVentes[shift]?.length || 0} dépôt(s) • {formaterMontant(totalHTD)} HTD total
          </div>
        </div>
      </div>

      {/* Add padding for fixed bottom bar */}
      <div className="h-28"></div>

      {/* Mobile Optimized Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Ensure proper touch targets */
        button, input, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Prevent text zoom on iOS */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        /* Smooth scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Better tap feedback */
        .active\:scale-95:active {
          transform: scale(0.95);
        }
        
        /* Remove touch highlight */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default USDtoHTDConverter;