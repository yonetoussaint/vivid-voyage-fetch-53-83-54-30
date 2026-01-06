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

  // Generate 4 truly different combination strategies
  const generateChangeCombinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    
    const amount = Math.round(changeNeeded);
    const givableAmount = getMaximumGivableAmount(amount);
    const remainder = amount - givableAmount;
    
    if (givableAmount === 0) {
      // If amount is less than 5, we can't give any change
      return [
        {
          key: 'no-change-1',
          breakdown: [],
          totalNotes: 0,
          totalAmount: 0,
          remainder: remainder,
          isExact: false,
          strategyName: "Aucun billet possible"
        },
        {
          key: 'no-change-2',
          breakdown: [],
          totalNotes: 0,
          totalAmount: 0,
          remainder: remainder,
          isExact: false,
          strategyName: "Montant < 5 HTG"
        },
        {
          key: 'no-change-3',
          breakdown: [],
          totalNotes: 0,
          totalAmount: 0,
          remainder: remainder,
          isExact: false,
          strategyName: "Trop petit"
        },
        {
          key: 'no-change-4',
          breakdown: [],
          totalNotes: 0,
          totalAmount: 0,
          remainder: remainder,
          isExact: false,
          strategyName: "Rien à donner"
        }
      ];
    }
    
    const combinations = [];
    
    // Helper: Standard greedy algorithm
    const greedyAlgorithm = (amt, denoms) => {
      let remaining = amt;
      const breakdown = [];
      for (const denom of denoms) {
        if (remaining >= denom) {
          const count = Math.floor(remaining / denom);
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      return breakdown;
    };
    
    // Strategy 1: Classic greedy (fewest bills, largest denominations first)
    const strategy1 = (amt) => {
      const breakdown = greedyAlgorithm(amt, denominations);
      return { 
        breakdown, 
        strategyName: "Classique (moins de billets)",
        description: "Utilise les plus gros billets d'abord"
      };
    };
    
    // Strategy 2: Prefer 500 HTG bills, avoid 1000 HTG when possible
    const strategy2 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // Avoid 1000 HTG bills - use 500 HTG instead
      if (remaining >= 1000) {
        const possible1000s = Math.floor(remaining / 1000);
        // Convert each 1000 to two 500s
        const fiveHundredCount = possible1000s * 2;
        if (fiveHundredCount > 0) {
          breakdown.push({ 
            denomination: 500, 
            count: fiveHundredCount, 
            total: possible1000s * 1000 
          });
          remaining -= possible1000s * 1000;
        }
      }
      
      // Use greedy for the rest with adjusted denominations
      const remainingDenoms = [500, 250, 100, 50, 25, 10, 5];
      for (const denom of remainingDenoms) {
        if (remaining >= denom) {
          const count = Math.floor(remaining / denom);
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      
      return { 
        breakdown, 
        strategyName: "Préfère billets de 500",
        description: "Évite les billets de 1000 HTG"
      };
    };
    
    // Strategy 3: Use more smaller bills, avoid large bills for small amounts
    const strategy3 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // For amounts < 500, don't use 1000 or 500 bills
      const adjustedDenoms = amt < 500 
        ? [250, 100, 50, 25, 10, 5]  // Skip 1000 and 500 for small amounts
        : [1000, 500, 250, 100, 50, 25, 10, 5];
      
      // Use greedy but with preference for smaller bills
      for (const denom of adjustedDenoms) {
        if (remaining >= denom) {
          // For smaller bills, use more of them
          let count = Math.floor(remaining / denom);
          if (denom <= 100) {
            // For bills <= 100, use more (up to 5) instead of larger bills
            count = Math.min(count, 5);
          }
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      
      // Fill any remaining with smallest denominations
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
      
      return { 
        breakdown, 
        strategyName: "Plus de petits billets",
        description: "Privilégie les billets moyens et petits"
      };
    };
    
    // Strategy 4: Balanced mix - use equal distribution of bill sizes
    const strategy4 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // Calculate target bill counts based on amount
      if (amt >= 1000) {
        // For large amounts, use 1-2 of each large denomination
        const largeBills = [1000, 500, 250];
        for (const denom of largeBills) {
          if (remaining >= denom) {
            const maxPossible = Math.floor(remaining / denom);
            const count = Math.min(maxPossible, 2); // Max 2 of each large bill
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
              remaining -= count * denom;
            }
          }
        }
      }
      
      // Use medium bills (100, 50)
      const mediumBills = [100, 50];
      for (const denom of mediumBills) {
        if (remaining >= denom) {
          const maxPossible = Math.floor(remaining / denom);
          const count = Math.min(maxPossible, 4); // Max 4 of each medium bill
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
            remaining -= count * denom;
          }
        }
      }
      
      // Use small bills for remainder
      if (remaining > 0) {
        const smallBills = [25, 10, 5];
        for (const denom of smallBills) {
          if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining -= count * denom;
            if (count > 0) {
              breakdown.push({ denomination: denom, count, total: denom * count });
            }
          }
        }
      }
      
      return { 
        breakdown, 
        strategyName: "Mix équilibré",
        description: "Répartit sur différentes tailles"
      };
    };
    
    // Strategy 5: Alternative - use only certain bill sizes
    const strategy5 = (amt) => {
      let remaining = amt;
      const breakdown = [];
      
      // Try to use only 250, 100, 50 bills when possible
      const preferredBills = [250, 100, 50, 25, 10, 5];
      
      for (const denom of preferredBills) {
        if (remaining >= denom) {
          const count = Math.floor(remaining / denom);
          remaining -= count * denom;
          if (count > 0) {
            breakdown.push({ denomination: denom, count, total: denom * count });
          }
        }
      }
      
      return { 
        breakdown, 
        strategyName: "Billets standards",
        description: "Utilise 250, 100, 50 HTG principalement"
      };
    };
    
    // Apply the 4 best strategies (we have 5, will pick the most different 4)
    const allStrategies = [strategy1, strategy2, strategy3, strategy4, strategy5];
    const results = allStrategies.map(strat => strat(givableAmount));
    
    // Pick the 4 most different combinations
    const selectedCombinations = [];
    const seenPatterns = new Set();
    
    for (const result of results) {
      const patternKey = result.breakdown.map(item => `${item.denomination}:${item.count}`).join('|');
      
      if (!seenPatterns.has(patternKey) && selectedCombinations.length < 4) {
        seenPatterns.add(patternKey);
        
        // Calculate totals
        const totalAmount = result.breakdown.reduce((sum, item) => sum + item.total, 0);
        const totalNotes = result.breakdown.reduce((sum, item) => sum + item.count, 0);
        
        selectedCombinations.push({
          key: `combo-${selectedCombinations.length + 1}`,
          breakdown: result.breakdown,
          totalNotes,
          totalAmount,
          remainder,
          isExact: remainder === 0,
          strategyName: result.strategyName,
          description: result.description,
          strategyIndex: selectedCombinations.length
        });
      }
    }
    
    // If we still don't have 4 unique combinations, create variations
    while (selectedCombinations.length < 4) {
      const baseCombo = selectedCombinations[selectedCombinations.length - 1] || selectedCombinations[0];
      const variationIndex = selectedCombinations.length;
      
      // Create a variation by adjusting one denomination
      let variationBreakdown = [...baseCombo.breakdown];
      if (variationBreakdown.length > 0) {
        // Try to adjust the first bill
        const firstBill = variationBreakdown[0];
        if (firstBill.count > 1) {
          // Reduce by 1 and add smaller bills
          variationBreakdown[0] = {
            ...firstBill,
            count: firstBill.count - 1,
            total: (firstBill.count - 1) * firstBill.denomination
          };
          
          // Add equivalent in smaller bills
          const remainingValue = firstBill.denomination;
          // Find smaller denominations to add
          const smallerDenoms = denominations.filter(d => d < firstBill.denomination);
          let tempRemaining = remainingValue;
          for (const denom of smallerDenoms) {
            if (tempRemaining >= denom) {
              const count = Math.floor(tempRemaining / denom);
              tempRemaining -= count * denom;
              if (count > 0) {
                variationBreakdown.push({
                  denomination: denom,
                  count,
                  total: denom * count
                });
              }
            }
          }
        }
      }
      
      const totalAmount = variationBreakdown.reduce((sum, item) => sum + item.total, 0);
      const totalNotes = variationBreakdown.reduce((sum, item) => sum + item.count, 0);
      
      selectedCombinations.push({
        key: `variation-${variationIndex}`,
        breakdown: variationBreakdown,
        totalNotes,
        totalAmount,
        remainder,
        isExact: remainder === 0,
        strategyName: `${baseCombo.strategyName} (variante)`,
        description: "Variation de la méthode principale",
        strategyIndex: variationIndex
      });
    }
    
    // Sort by: fewest notes first, then strategy order
    return selectedCombinations.sort((a, b) => {
      if (a.totalNotes !== b.totalNotes) {
        return a.totalNotes - b.totalNotes;
      }
      return a.strategyIndex - b.strategyIndex;
    });
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

          {/* Change combinations - 4 TRULY DIFFERENT combinations */}
          {shouldGiveChange && generateChangeCombinations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">4 Combinaisons différentes:</p>
              </div>
              
              {/* Denomination info */}
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
                <p className="text-[9px] text-center text-blue-300">
                  Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
                </p>
              </div>
              
              {/* Single column of 4 truly different combinations */}
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
                    {/* Option header with strategy name and description */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-yellow-400' :
                            index === 1 ? 'bg-blue-400' :
                            index === 2 ? 'bg-purple-400' : 'bg-amber-400'
                          }`}></div>
                          <p className="text-xs font-bold text-green-300">
                            Option {index + 1}: {combo.strategyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins size={10} className="text-green-300 opacity-70" />
                          <span className="text-[10px] opacity-80">
                            {combo.totalNotes} pièce{combo.totalNotes !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] opacity-80 ml-4">
                        {combo.description}
                      </p>
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
                      // Show empty state for amounts < 5 HTG
                      <div className="text-center py-3">
                        <p className="text-xs text-amber-300 font-bold mb-1">
                          {combo.strategyName}
                        </p>
                        <p className="text-[10px] opacity-80">
                          Le montant est inférieur à 5 HTG
                        </p>
                        <div className="mt-2 pt-2 border-t border-amber-400 border-opacity-20">
                          <p className="text-[10px] font-bold text-amber-300">
                            Total abandonné: {formaterArgent(combo.remainder)} HTG
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Strategy comparison */}
              <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-green-300" />
                  <p className="text-[10px] font-bold text-green-300">Comparaison des stratégies:</p>
                </div>
                <div className="space-y-1 text-[9px]">
                  <div className="flex items-start gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-0.5"></div>
                    <span className="opacity-80"><span className="font-bold">Option 1:</span> Moins de billets au total (recommandé)</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5"></div>
                    <span className="opacity-80"><span className="font-bold">Option 2:</span> Plus de billets de 500 HTG, moins de 1000 HTG</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5"></div>
                    <span className="opacity-80"><span className="font-bold">Option 3:</span> Plus de petits et moyens billets</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></div>
                    <span className="opacity-80"><span className="font-bold">Option 4:</span> Répartition équilibrée entre tailles</span>
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