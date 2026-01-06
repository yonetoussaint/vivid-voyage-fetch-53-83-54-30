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

  // Generate 4 different combination strategies
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
        isExact: false,
        strategyName: "Aucun billet possible"
      }];
    }
    
    const combinations = [];
    
    // Strategy 1: Classic greedy algorithm (fewest bills)
    const strategy1 = (amt) => {
      let remaining = amt;
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
      return { breakdown, strategyName: "Classique (moins de billets)" };
    };
    
    // Strategy 2: Prefer 500 HTG bills over 1000 HTG
    const strategy2 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // Convert 1000s to 500s when possible
      if (remaining >= 1000) {
        const thousandCount = Math.floor(remaining / 1000);
        // Convert as many 1000s to pairs of 500s as possible
        const convertableThousands = Math.floor(thousandCount);
        const remainingThousands = thousandCount - convertableThousands;
        
        if (convertableThousands > 0) {
          const fiveHundredCount = convertableThousands * 2;
          breakdown.push({ 
            denomination: 500, 
            count: fiveHundredCount, 
            total: convertableThousands * 1000 
          });
          remaining -= convertableThousands * 1000;
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
        if (denom === 500) continue; // Skip 500 as we already handled it
        if (remaining >= denom) {
          const count = Math.floor(remaining / denom);
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      
      return { breakdown, strategyName: "Préfère billets de 500" };
    };
    
    // Strategy 3: Avoid small coins, use larger bills when possible
    const strategy3 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // First pass: use only bills >= 100 HTG
      for (const denom of [1000, 500, 250, 100]) {
        if (remaining >= denom) {
          const count = Math.floor(remaining / denom);
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      
      // Second pass: if we have small remainder, try to adjust
      if (remaining > 0 && remaining < 100) {
        // Try to use one less large bill to accommodate smaller bills
        if (breakdown.length > 0) {
          const lastBill = breakdown[breakdown.length - 1];
          const newRemaining = remaining + lastBill.denomination;
          
          // Remove the last bill
          breakdown.pop();
          remaining = newRemaining;
          
          // Now try with all denominations
          for (const denom of [100, 50, 25, 10, 5]) {
            if (remaining >= denom) {
              const count = Math.floor(remaining / denom);
              remaining -= count * denom;
              if (count > 0) {
                breakdown.push({ denomination: denom, count, total: denom * count });
              }
            }
          }
        }
      } else {
        // Use smaller denominations for remaining
        for (const denom of [50, 25, 10, 5]) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
      }
      
      return { breakdown, strategyName: "Évite petite monnaie" };
    };
    
    // Strategy 4: Balanced approach (mix of large and medium bills)
    const strategy4 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // Use 1000s only if amount is large
      if (remaining >= 2000) {
        const thousandCount = Math.min(2, Math.floor(remaining / 1000));
        if (thousandCount > 0) {
          breakdown.push({ 
            denomination: 1000, 
            count: thousandCount, 
            total: thousandCount * 1000 
          });
          remaining -= thousandCount * 1000;
        }
      }
      
      // Prefer 250 and 500 bills for the rest
      for (const denom of [500, 250, 100, 50, 25, 10, 5]) {
        if (remaining >= denom) {
          // For medium bills, don't use too many
          let maxCount = Math.floor(remaining / denom);
          if (denom <= 100) {
            maxCount = Math.min(maxCount, 4); // Limit medium bills
          }
          
          if (maxCount > 0) {
            breakdown.push({ denomination: denom, count: maxCount, total: denom * maxCount });
            remaining -= denom * maxCount;
          }
        }
      }
      
      // If we still have remainder, use smaller denominations
      if (remaining > 0) {
        for (const denom of [10, 5]) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
      }
      
      return { breakdown, strategyName: "Approche équilibrée" };
    };
    
    // Apply all 4 strategies
    const strategies = [strategy1, strategy2, strategy3, strategy4];
    
    strategies.forEach((strategy, index) => {
      const result = strategy(givableAmount);
      const breakdown = result.breakdown;
      
      // Calculate totals
      const totalAmount = breakdown.reduce((sum, item) => sum + item.total, 0);
      const totalNotes = breakdown.reduce((sum, item) => sum + item.count, 0);
      
      // Create unique key
      const comboKey = breakdown.map(item => `${item.count}x${item.denomination}`).join('-') || `empty-${index}`;
      
      // Only add if unique
      if (!combinations.some(c => c.key === comboKey)) {
        combinations.push({
          key: comboKey,
          breakdown,
          totalNotes,
          totalAmount,
          remainder,
          isExact: remainder === 0,
          strategyName: result.strategyName,
          strategyIndex: index
        });
      }
    });
    
    // Ensure we have 4 combinations (duplicate if necessary)
    while (combinations.length < 4 && combinations.length > 0) {
      const lastCombo = combinations[combinations.length - 1];
      combinations.push({
        ...lastCombo,
        key: `${lastCombo.key}-copy-${combinations.length}`,
        strategyName: `${lastCombo.strategyName} (variante)`
      });
    }
    
    // Sort by: fewest notes first, then strategy order
    return combinations.sort((a, b) => {
      if (a.totalNotes !== b.totalNotes) {
        return a.totalNotes - b.totalNotes;
      }
      return a.strategyIndex - b.strategyIndex;
    }).slice(0, 4); // Always show exactly 4 combinations
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

          {/* Change combinations - ALWAYS 4 combinations */}
          {shouldGiveChange && generateChangeCombinations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">4 Combinaisons possibles:</p>
              </div>
              
              {/* Denomination info */}
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
                <p className="text-[9px] text-center text-blue-300">
                  Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
                </p>
              </div>
              
              {/* Single column of 4 combinations */}
              <div className="space-y-2">
                {generateChangeCombinations.map((combo, index) => (
                  <div 
                    key={combo.key} 
                    className={`rounded-lg p-2 border ${
                      index === 0 
                        ? 'border-green-400 border-opacity-40 bg-green-500 bg-opacity-15 shadow-sm' 
                        : index === 1
                        ? 'border-blue-400 border-opacity-40 bg-blue-500 bg-opacity-10'
                        : index === 2
                        ? 'border-purple-400 border-opacity-40 bg-purple-500 bg-opacity-10'
                        : 'border-amber-400 border-opacity-40 bg-amber-500 bg-opacity-10'
                    }`}
                  >
                    {/* Option header with strategy name */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-yellow-400' :
                          index === 1 ? 'bg-blue-400' :
                          index === 2 ? 'bg-purple-400' : 'bg-amber-400'
                        }`}></div>
                        <div>
                          <p className="text-xs font-bold text-green-300">
                            Option {index + 1}
                          </p>
                          <p className="text-[9px] opacity-80 mt-0.5">
                            {combo.strategyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins size={10} className={
                          index === 0 ? 'text-green-300' :
                          index === 1 ? 'text-blue-300' :
                          index === 2 ? 'text-purple-300' : 'text-amber-300'
                        } />
                        <span className="text-[10px] opacity-80">
                          {combo.totalNotes} pièce{combo.totalNotes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* Complete breakdown */}
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
                        <div className="pt-2 border-t border-white border-opacity-20">
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
                          </div>
                        </div>
                      </>
                    ) : (
                      // Show empty state
                      <div className="text-center py-3">
                        <p className="text-xs text-amber-300 font-bold mb-1">
                          Aucun billet/monnaie possible
                        </p>
                        <p className="text-[10px] opacity-80">
                          Le montant est inférieur à 5 HTG
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Practical tips */}
              <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-green-300" />
                  <p className="text-[10px] font-bold text-green-300">Guide des options:</p>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                    <span className="opacity-80">Option 1: Moins de billets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span className="opacity-80">Option 2: Plus de 500 HTG</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span className="opacity-80">Option 3: Moins de petite monnaie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <span className="opacity-80">Option 4: Mix équilibré</span>
                  </div>
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