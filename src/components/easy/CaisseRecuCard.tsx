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
  
  // Function to check if amount can be exactly made with denominations
  const canMakeExactChange = (amount) => {
    const roundedAmount = Math.round(amount);
    return roundedAmount % 5 === 0; // Must be multiple of 5
  };

  // Smart change combination algorithm - only exact matches
  const generateChangeCombinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    
    const amount = Math.round(changeNeeded);
    const combinations = [];
    
    // Check if exact change is possible
    if (!canMakeExactChange(amount)) {
      return []; // Cannot make exact change
    }
    
    // Helper function to generate exact combinations recursively
    const findExactCombinations = (remaining, currentCombo, startIndex, maxDepth = 4) => {
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
            isExact: true
          });
        }
        return;
      }
      
      if (remaining < 0 || startIndex >= denominations.length || maxDepth === 0) {
        return;
      }
      
      const denom = denominations[startIndex];
      if (denom > remaining) {
        // Skip this denomination, try smaller ones
        findExactCombinations(remaining, currentCombo, startIndex + 1, maxDepth - 1);
        return;
      }
      
      const maxCount = Math.floor(remaining / denom);
      
      // Limit to reasonable number of coins/bills of same denomination (max 10)
      const actualMaxCount = Math.min(maxCount, 10);
      
      for (let count = actualMaxCount; count >= 0; count--) {
        const newRemaining = remaining - (count * denom);
        const newCombo = [...currentCombo, { denomination: denom, count }];
        
        findExactCombinations(newRemaining, newCombo, startIndex + 1, maxDepth - 1);
        
        // Limit total combinations for performance
        if (combinations.length >= 15) return;
      }
    };
    
    // Generate only exact combinations
    findExactCombinations(amount, [], 0, 4);
    
    // Remove duplicates and sort
    const uniqueCombinations = [];
    const seen = new Set();
    
    combinations.forEach(combo => {
      if (!seen.has(combo.key)) {
        seen.add(combo.key);
        uniqueCombinations.push(combo);
      }
    });
    
    // Sort by: fewest notes, then larger denominations
    return uniqueCombinations
      .sort((a, b) => {
        // First by total notes
        if (a.totalNotes !== b.totalNotes) {
          return a.totalNotes - b.totalNotes;
        }
        // Then by largest denomination
        const aMax = Math.max(...a.breakdown.map(d => d.denomination));
        const bMax = Math.max(...b.breakdown.map(d => d.denomination));
        return bMax - aMax;
      })
      .slice(0, 4); // Show top 4 combinations
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

  // Check if exact change is possible
  const exactChangePossible = canMakeExactChange(changeNeeded);
  const remainder = changeNeeded % 5;
  const mustAcceptRemainder = shouldGiveChange && remainder !== 0;

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

      {/* Change calculation with realistic denominations */}
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

          {/* Warning if cannot give exact change */}
          {mustAcceptRemainder && (
            <div className="bg-amber-500 bg-opacity-20 rounded-lg p-2 border border-amber-400 border-opacity-30">
              <div className="flex items-start gap-1.5">
                <AlertCircle size={12} className="text-amber-300 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300 mb-0.5">
                    Attention: Monnaie exacte impossible
                  </p>
                  <p className="text-[10px] opacity-90 leading-tight">
                    Le vendeur doit accepter de recevoir {formaterArgent(changeNeeded - remainder)} HTG 
                    au lieu de {formaterArgent(changeNeeded)} HTG.
                    <span className="block mt-0.5 font-bold">
                      Reste à abandonner: {formaterArgent(remainder)} HTG
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Exact change combinations - only shown if possible */}
          {shouldGiveChange && exactChangePossible && generateChangeCombinations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Combinaisons exactes:</p>
              </div>
              
              {/* Denomination info */}
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
                <p className="text-[9px] text-center text-blue-300">
                  Plus petit billet/monnaie = 5 HTG
                </p>
              </div>
              
              {/* Single column of exact combinations */}
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
                    
                    {/* Complete breakdown */}
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
                    
                    {/* Total */}
                    <div className="pt-2 border-t border-green-400 border-opacity-20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-bold text-green-300">Total exact:</span>
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
              
              {/* Practical tips */}
              <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-green-300" />
                  <p className="text-[10px] font-bold text-green-300">Conseils pratiques:</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] opacity-80 leading-tight">
                    • L'<span className="text-green-300 font-bold">Option 1</span> utilise le moins de billets/monnaie
                  </p>
                  <p className="text-[9px] opacity-80 leading-tight">
                    • Seules les combinaisons exactes sont affichées
                  </p>
                  <p className="text-[9px] opacity-80 leading-tight">
                    • Le vendeur doit accepter les restes non-divisibles par 5 HTG
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No exact change possible */}
          {shouldGiveChange && !exactChangePossible && generateChangeCombinations.length === 0 && (
            <div className="space-y-2">
              <div className="bg-amber-500 bg-opacity-20 rounded-lg p-3 border border-amber-400 border-opacity-30">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-300 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-300 mb-1">
                      Aucune combinaison exacte possible
                    </p>
                    <p className="text-[10px] opacity-90 leading-tight mb-2">
                      Le montant {formaterArgent(changeNeeded)} HTG n'est pas divisible par 5 HTG.
                    </p>
                    <div className="bg-amber-500 bg-opacity-30 rounded p-1.5">
                      <p className="text-[10px] font-bold text-amber-200 text-center">
                        Le vendeur doit accepter: {formaterArgent(changeNeeded - remainder)} HTG
                      </p>
                      <p className="text-[9px] opacity-80 text-center mt-0.5">
                        Reste abandonné: {formaterArgent(remainder)} HTG
                      </p>
                    </div>
                  </div>
                </div>
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