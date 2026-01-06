import React, { useState, useMemo } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, Layers, Target, Coins, Sparkles } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const CaisseRecuCard = ({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132
}) => {
  const [cashRecu, setCashRecu] = useState('');
  const cashRecuValue = parseFloat(cashRecu) || 0;
  const changeNeeded = cashRecuValue - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Haitian Gourde denominations
  const denominations = [1000, 500, 250, 100, 50, 25, 10, 5, 1];
  
  // AI-like function to generate all optimal change combinations
  const generateChangeCombinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    
    const amount = Math.round(changeNeeded);
    const combinations = [];
    
    // Helper function to generate combinations recursively
    const findCombinations = (remaining, currentCombo, startIndex, maxCombinations = 10) => {
      if (remaining === 0) {
        // Format and add the combination
        const formattedCombo = currentCombo
          .filter(item => item.count > 0)
          .map(item => ({
            denomination: item.denomination,
            count: item.count,
            total: item.denomination * item.count
          }))
          .sort((a, b) => b.denomination - a.denomination);
        
        // Only add if not duplicate
        const comboKey = formattedCombo.map(c => `${c.count}x${c.denomination}`).join('-');
        if (!combinations.some(c => c.key === comboKey)) {
          combinations.push({
            key: comboKey,
            breakdown: formattedCombo,
            totalNotes: formattedCombo.reduce((sum, item) => sum + item.count, 0),
            hasLargeNotes: formattedCombo.some(item => item.denomination >= 500)
          });
          
          // Stop if we have enough combinations
          if (combinations.length >= maxCombinations) {
            return true;
          }
        }
        return false;
      }
      
      if (remaining < 0 || startIndex >= denominations.length) {
        return false;
      }
      
      const denom = denominations[startIndex];
      const maxCount = Math.floor(remaining / denom);
      
      // Try different counts for this denomination (from max down to 0)
      for (let count = maxCount; count >= 0; count--) {
        const newRemaining = remaining - (count * denom);
        const newCombo = [...currentCombo, { denomination: denom, count }];
        
        // Limit recursion depth for performance
        if (findCombinations(newRemaining, newCombo, startIndex + 1, maxCombinations)) {
          return true;
        }
      }
      
      return false;
    };
    
    // Generate combinations
    findCombinations(amount, [], 0, 6); // Limit to 6 combinations
    
    // Sort combinations: prefer fewer notes, then larger denominations
    return combinations.sort((a, b) => {
      if (a.totalNotes !== b.totalNotes) {
        return a.totalNotes - b.totalNotes; // Fewer notes first
      }
      // If same number of notes, prefer larger denominations
      const aMaxDenom = Math.max(...a.breakdown.map(d => d.denomination));
      const bMaxDenom = Math.max(...b.breakdown.map(d => d.denomination));
      return bMaxDenom - aMaxDenom;
    }).slice(0, 4); // Show top 4 combinations
  }, [changeNeeded, shouldGiveChange]);

  const formatDepositDisplay = (depot) => {
    if (!depot) return '';

    if (typeof depot === 'object' && depot.devise === 'USD') {
      const montantUSD = parseFloat(depot.montant) || 0;
      const montantHTG = montantUSD * tauxUSD;
      return `${montantUSD} USD (${formaterArgent(montantHTG)} HTG)`;
    } else {
      const montantHTG = parseFloat(depot) || 0;
      return `${formaterArgent(montantHTG)} HTG`;
    }
  };

  const depositBreakdown = sellerDeposits.map((depot, index) => ({
    id: index + 1,
    display: formatDepositDisplay(depot),
    isUSD: typeof depot === 'object' && depot.devise === 'USD'
  }));

  return (
    <div className={`rounded-xl p-3 shadow-lg mb-3 ${
      isPropane 
        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
    } text-white`}>
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          {isPropane ? <Receipt size={14} /> : <Wallet size={14} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">CAISSE REÇUE</p>
          <p className="text-[10px] opacity-80">
            {isPropane ? 'Argent reçu pour propane' : 'Argent donné par le vendeur'}
          </p>
        </div>
        {vendeurActuel && (
          <div className="text-right">
            <p className="text-[10px] opacity-80">Vendeur</p>
            <p className="text-xs font-bold truncate max-w-[80px]">{vendeurActuel}</p>
          </div>
        )}
      </div>

      {/* Total Deposits Row - Standalone above deposits */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Layers size={12} className="text-white opacity-90" />
              <p className="text-xs opacity-90">Total Dépôts:</p>
            </div>
            <p className="text-sm font-bold">{formaterArgent(totalDeposits)} HTG</p>
          </div>
        </div>
      )}

      {/* Deposits Breakdown Card */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 space-y-1">
          <div className="flex items-center gap-1 mb-1">
            <Calculator size={12} className="text-white opacity-90" />
            <p className="text-xs opacity-90">Détail des dépôts:</p>
          </div>

          {/* Deposit breakdown */}
          <div className="space-y-1">
            {depositBreakdown.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    deposit.isUSD ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="opacity-80">Dépôt {deposit.id}:</span>
                </div>
                <span className="font-medium opacity-90 text-right text-[11px]">{deposit.display}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espèces Attendues Row - Standalone below deposits */}
      <div className={`rounded-lg p-2 mb-2 ${
        especesAttendues > 0 
          ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30' 
          : especesAttendues < 0 
          ? 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30'
          : 'bg-white bg-opacity-10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Target size={12} className={
              especesAttendues > 0 
                ? 'text-green-300' 
                : especesAttendues < 0 
                ? 'text-red-300'
                : 'text-white opacity-90'
            } />
            <p className="text-xs opacity-90">Espèces attendues:</p>
          </div>
          <p className={`text-sm font-bold ${
            especesAttendues > 0 
              ? 'text-green-300' 
              : especesAttendues < 0 
              ? 'text-red-300'
              : 'text-white'
          }`}>
            {formaterArgent(especesAttendues)} HTG
          </p>
        </div>
      </div>

      {/* Input field for cash received */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-white font-bold text-xs">HTG</span>
        </div>
        <input
          type="number"
          value={cashRecu}
          onChange={(e) => setCashRecu(e.target.value)}
          placeholder="0.00"
          className="w-full pl-12 pr-3 py-2.5 text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
        />
      </div>

      {/* Change calculation with AI-powered breakdown */}
      {cashRecu && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-3">
          {/* Change summary */}
          <div className={`flex items-center justify-between pb-2 border-b border-white border-opacity-20 ${
            shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
          }`}>
            <div className="flex items-center gap-1">
              {shouldGiveChange ? (
                <TrendingUp size={12} />
              ) : isShort ? (
                <TrendingDown size={12} />
              ) : (
                <DollarSign size={12} />
              )}
              <p className="text-xs font-bold">
                {shouldGiveChange ? 'À rendre:' : isShort ? 'Manquant:' : 'Exact'}
              </p>
            </div>
            <p className={`text-sm font-bold ${
              shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
            }`}>
              {formaterArgent(Math.abs(changeNeeded))} HTG
            </p>
          </div>

          {/* AI-powered change breakdown - Single Column */}
          {shouldGiveChange && generateChangeCombinations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Combinaisons de monnaie:</p>
              </div>
              
              {/* Single column of options - each showing complete breakdown */}
              <div className="space-y-2">
                {generateChangeCombinations.map((combo, index) => (
                  <div 
                    key={combo.key} 
                    className={`bg-green-500 bg-opacity-10 rounded-lg p-2 border ${
                      index === 0 
                        ? 'border-green-400 border-opacity-40 bg-green-500 bg-opacity-15 shadow-sm' 
                        : 'border-green-400 border-opacity-20'
                    }`}
                  >
                    {/* Option header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <div className="flex items-center gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                            <span className="text-xs font-bold text-green-300">
                              Option {index + 1} - Recommandée
                            </span>
                          </div>
                        )}
                        {index !== 0 && (
                          <span className="text-xs font-medium text-green-300 opacity-90">
                            Option {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins size={10} className="text-green-300 opacity-70" />
                        <span className="text-[10px] opacity-80">
                          {combo.totalNotes} {combo.totalNotes === 1 ? 'billet' : 'billets'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Complete breakdown - All items shown */}
                    <div className="space-y-1.5 mb-2">
                      {combo.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 opacity-80"></div>
                            <span className="text-xs opacity-90">
                              {item.count} × {formaterArgent(item.denomination)} HTG
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium opacity-70">=</span>
                            <span className="text-xs font-bold text-green-300">
                              {formaterArgent(item.total)} HTG
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total with separator */}
                    <div className="pt-2 border-t border-green-400 border-opacity-20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-bold text-green-300">Total:</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-green-300">
                            {formaterArgent(combo.breakdown.reduce((sum, item) => sum + item.total, 0))}
                          </span>
                          <span className="text-[10px] opacity-70">HTG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tips */}
              <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-green-300" />
                  <p className="text-[10px] font-bold text-green-300">Conseil:</p>
                </div>
                <p className="text-[9px] opacity-80 leading-tight">
                  L'<span className="text-green-300 font-bold">Option 1</span> utilise le moins de billets. 
                  Choisissez l'option selon les billets disponibles dans votre caisse.
                </p>
              </div>
            </div>
          )}

          {/* Messages for other cases */}
          {!shouldGiveChange && (
            <div className="text-center pt-1">
              {isShort ? (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-red-300">Doit donner plus d'argent</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Manque {formaterArgent(Math.abs(changeNeeded))} HTG
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-emerald-300">Montant exact</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Aucune monnaie à rendre
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add some custom styles for better mobile experience */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default CaisseRecuCard;