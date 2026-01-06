import React, { useState, useMemo } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, Layers, Target, Coins, Sparkles, AlertCircle } from 'lucide-react';
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

  // Realistic Haitian Gourde denominations (no 1 gourde - smallest is 5 gourdes)
  const denominations = [1000, 500, 250, 100, 50, 25, 10, 5];
  
  // Function to get the maximum amount we can give with denominations (round down to nearest 5)
  const getMaximumGivableAmount = (amount) => {
    const remainder = amount % 5;
    return amount - remainder; // Round down to nearest multiple of 5
  };

  // Simple greedy algorithm that always works
  const generateChangeCombinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    
    const amount = Math.round(changeNeeded);
    const givableAmount = getMaximumGivableAmount(amount);
    const remainder = amount - givableAmount;
    
    if (givableAmount === 0) {
      // If amount is less than 5, we can't give any change
      return [{
        key: 'no-change',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false
      }];
    }
    
    const combinations = [];
    
    // Generate 3 different combination strategies
    const strategies = [
      // Strategy 1: Greedy algorithm (most common approach)
      (amount) => {
        let remaining = amount;
        const breakdown = [];
        for (const denom of denominations) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
        return breakdown;
      },
      
      // Strategy 2: Prefer larger bills but try to use fewer total pieces
      (amount) => {
        let remaining = amount;
        const breakdown = [];
        
        // First try with 1000 and 500 notes
        for (const denom of [1000, 500, 250, 100]) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            // If using this denomination would leave a small remainder, adjust
            const remainderAfter = remaining - (count * denom);
            if (remainderAfter > 0 && remainderAfter < 25) {
              // Try with one less of this denomination
              const adjustedCount = Math.max(0, count - 1);
              remaining -= adjustedCount * denom;
              if (adjustedCount > 0) {
                breakdown.push({ denomination: denom, count: adjustedCount, total: denom * adjustedCount });
              }
            } else {
              remaining -= count * denom;
              if (count > 0) {
                breakdown.push({ denomination: denom, count, total: denom * count });
              }
            }
          }
        }
        
        // Fill remaining with smaller denominations
        for (const denom of [50, 25, 10, 5]) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
        
        return breakdown;
      },
      
      // Strategy 3: Prefer more smaller bills for flexibility
      (amount) => {
        let remaining = amount;
        const breakdown = [];
        
        // Avoid 1000 notes if possible, use 500s instead
        if (remaining >= 1000) {
          const thousandCount = Math.floor(remaining / 1000);
          // Convert half of 1000s to 500s if possible
          const thousandsToConvert = Math.floor(thousandCount / 2);
          const remainingThousands = thousandCount - thousandsToConvert;
          
          if (thousandsToConvert > 0) {
            breakdown.push({ 
              denomination: 500, 
              count: thousandsToConvert * 2, 
              total: thousandsToConvert * 1000 
            });
            remaining -= thousandsToConvert * 1000;
          }
          
          if (remainingThousands > 0) {
            breakdown.push({ 
              denomination: 1000, 
              count: remainingThousands, 
              total: remainingThousands * 1000 
            });
            remaining -= remainingThousands * 1000;
          }
        }
        
        // Use greedy for the rest
        for (const denom of [500, 250, 100, 50, 25, 10, 5]) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
        
        return breakdown;
      }
    ];
    
    // Generate combinations using different strategies
    strategies.forEach((strategy, index) => {
      const breakdown = strategy(givableAmount);
      
      // Calculate total from breakdown
      const totalAmount = breakdown.reduce((sum, item) => sum + item.total, 0);
      const totalNotes = breakdown.reduce((sum, item) => sum + item.count, 0);
      
      // Create a unique key for this combination
      const comboKey = breakdown.map(item => `${item.count}x${item.denomination}`).join('-') || `empty-${index}`;
      
      // Only add if we haven't seen this exact combination
      if (!combinations.some(c => c.key === comboKey)) {
        combinations.push({
          key: comboKey,
          breakdown,
          totalNotes,
          totalAmount,
          remainder,
          isExact: remainder === 0,
          strategyIndex: index
        });
      }
    });
    
    // Ensure we have at least one combination (even if empty)
    if (combinations.length === 0) {
      combinations.push({
        key: 'fallback',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder,
        isExact: false,
        strategyIndex: 0
      });
    }
    
    // Sort by: fewest notes first, then by strategy order
    return combinations.sort((a, b) => {
      if (a.totalNotes !== b.totalNotes) {
        return a.totalNotes - b.totalNotes;
      }
      return a.strategyIndex - b.strategyIndex;
    }).slice(0, 3); // Show top 3 combinations
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

  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

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

      {/* Change calculation */}
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

          {/* Warning if has remainder */}
          {shouldGiveChange && hasRemainder && (
            <div className="bg-amber-500 bg-opacity-20 rounded-lg p-2 border border-amber-400 border-opacity-30">
              <div className="flex items-start gap-1.5">
                <AlertCircle size={12} className="text-amber-300 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300 mb-0.5">
                    Note: Reste à abandonner
                  </p>
                  <p className="text-[10px] opacity-90 leading-tight">
                    Avec des billets/monnaie de 5 HTG minimum, on ne peut rendre que {formaterArgent(givableAmount)} HTG.
                    <span className="block mt-0.5 font-bold text-amber-200">
                      Le vendeur doit abandonner: {formaterArgent(remainder)} HTG
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Change combinations - ALWAYS shown when change is needed */}
          {shouldGiveChange && generateChangeCombinations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Combinaisons possibles:</p>
              </div>
              
              {/* Denomination info */}
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
                <p className="text-[9px] text-center text-blue-300">
                  Plus petit billet/monnaie = 5 HTG
                </p>
              </div>
              
              {/* Single column of combinations */}
              <div className="space-y-2">
                {generateChangeCombinations.map((combo, index) => (
                  <div 
                    key={combo.key} 
                    className={`rounded-lg p-2 border ${
                      index === 0 
                        ? 'border-green-400 border-opacity-40 bg-green-500 bg-opacity-15 shadow-sm' 
                        : 'border-green-400 border-opacity-20 bg-green-500 bg-opacity-10'
                    }`}
                  >
                    {/* Option header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                            <span className="text-xs font-bold text-green-300">
                              Option {index + 1} - Optimale
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
                          {combo.totalNotes} pièce{combo.totalNotes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* Complete breakdown - show even if empty */}
                    {combo.breakdown.length > 0 ? (
                      <>
                        <div className="space-y-1.5 mb-2">
                          {combo.breakdown.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  item.denomination >= 500 ? 'bg-green-500' : 
                                  item.denomination >= 100 ? 'bg-green-400' : 
                                  'bg-green-300'
                                }`}></div>
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
                        
                        {/* Total and remainder info */}
                        <div className="pt-2 border-t border-green-400 border-opacity-20">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs font-bold text-green-300">Total donné:</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-green-300">
                                  {formaterArgent(combo.totalAmount)}
                                </span>
                                <span className="text-[10px] opacity-70">HTG</span>
                              </div>
                            </div>
                            
                            {/* Show remainder if any */}
                            {combo.remainder > 0 && (
                              <div className="flex items-center justify-between pt-1 border-t border-amber-400 border-opacity-20">
                                <div className="flex items-center gap-1">
                                  <AlertCircle size={10} className="text-amber-300" />
                                  <span className="text-[10px] text-amber-300">Reste abandonné:</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-300">
                                  {formaterArgent(combo.remainder)} HTG
                                </span>
                              </div>
                            )}
                            
                            {/* Original total for context */}
                            {combo.remainder > 0 && (
                              <div className="text-[9px] opacity-70 text-center pt-0.5">
                                Sur {formaterArgent(combo.totalAmount + combo.remainder)} HTG demandés
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Show empty state if no breakdown (amount < 5)
                      <div className="text-center py-3">
                        <p className="text-xs text-amber-300 font-bold mb-1">
                          Aucun billet/monnaie possible
                        </p>
                        <p className="text-[10px] opacity-80">
                          Le montant est inférieur à 5 HTG
                        </p>
                        {combo.remainder > 0 && (
                          <div className="mt-2 pt-2 border-t border-amber-400 border-opacity-20">
                            <p className="text-[10px] text-amber-300 font-bold">
                              Total abandonné: {formaterArgent(combo.remainder)} HTG
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Practical tips */}
              <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-green-300" />
                  <p className="text-[10px] font-bold text-green-300">Conseils pratiques:</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] opacity-80 leading-tight">
                    • L'<span className="text-green-300 font-bold">Option 1</span> est généralement la plus efficace
                  </p>
                  <p className="text-[9px] opacity-80 leading-tight">
                    • Les options 2 et 3 offrent des alternatives selon vos billets disponibles
                  </p>
                  <p className="text-[9px] opacity-80 leading-tight">
                    • Les montants inférieurs à 5 HTG sont entièrement abandonnés
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No change needed */}
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