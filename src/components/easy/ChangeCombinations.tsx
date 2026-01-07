import React, { useMemo } from 'react';
import { Sparkles, Coins, AlertCircle, Zap, BarChart, Target, Brain, Info } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';

const ChangeCombinations = ({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;

  // Generate combinations
  const combinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    return generateChangeCombinations(changeNeeded);
  }, [changeNeeded, shouldGiveChange]);

  if (!shouldGiveChange || combinations.length === 0) {
    return null;
  }

  const getStrategyIcon = (strategyName, index) => {
    switch (strategyName) {
      case 'Minimum de billets':
        return <Zap size={10} className="text-yellow-500" />;
      case 'Approche équilibrée':
        return <BarChart size={10} className="text-green-500" />;
      case 'Plus de petites coupures':
        return <Target size={10} className="text-blue-500" />;
      case 'Solution optimisée':
      case 'Solution mathématique':
        return <Brain size={10} className="text-purple-500" />;
      default:
        const colors = ['text-yellow-500', 'text-blue-500', 'text-purple-500', 'text-amber-500'];
        return <Sparkles size={10} className={colors[index % colors.length]} />;
    }
  };

  const getCardBorderColor = (index) => {
    switch (index) {
      case 0: return 'border-green-400 border-opacity-40 bg-green-500 bg-opacity-15 shadow-sm';
      case 1: return 'border-blue-400 border-opacity-40 bg-blue-500 bg-opacity-10';
      case 2: return 'border-purple-400 border-opacity-40 bg-purple-500 bg-opacity-10';
      case 3: return 'border-amber-400 border-opacity-40 bg-amber-500 bg-opacity-10';
      default: return 'border-gray-400 border-opacity-40 bg-gray-500 bg-opacity-10';
    }
  };

  const getDotColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-400';
      case 1: return 'bg-blue-400';
      case 2: return 'bg-purple-400';
      case 3: return 'bg-amber-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1 mb-2">
        <Sparkles size={10} className="text-green-300" />
        <p className="text-xs font-bold text-green-300">4 Combinaisons intelligentes:</p>
      </div>

      {/* Denomination info */}
      <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
        <p className="text-[9px] text-center text-blue-300">
          Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
        </p>
      </div>

      {/* All combinations displayed directly - no tabs */}
      <div className="space-y-2">
        {combinations.map((combo, index) => (
          <div 
            key={combo.key} 
            className={`rounded-lg p-2 border ${getCardBorderColor(index)}`}
          >
            {/* Option header with strategy name and description */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getDotColor(index)}`}></div>
                  <div className="flex items-center gap-1">
                    {getStrategyIcon(combo.strategyName, index)}
                    <p className="text-xs font-bold text-green-300">
                      Option {index + 1}: {combo.strategyName}
                    </p>
                  </div>
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

                    {/* Efficiency score (if available) */}
                    {combo.efficiency && (
                      <div className="flex items-center justify-between pt-1 border-t border-green-400 border-opacity-20">
                        <div className="flex items-center gap-1">
                          <Info size={10} className="text-blue-300" />
                          <span className="text-[10px] text-blue-300">Score d'efficacité:</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-white bg-opacity-10 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-300 h-1.5 rounded-full"
                              style={{ 
                                width: `${Math.min(100, (combo.efficiency || 0) / 1.5)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-green-300">
                            {Math.round(combo.efficiency)}%
                          </span>
                        </div>
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

      {/* Strategy comparison summary */}
      <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
        <div className="flex items-center gap-1 mb-1">
          <Sparkles size={9} className="text-green-300" />
          <p className="text-[10px] font-bold text-green-300">Guide des stratégies:</p>
        </div>
        <div className="space-y-1 text-[9px]">
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-0.5"></div>
            <span className="opacity-80">
              <span className="font-bold">Option 1 (Minimum de billets):</span> Utilise le moins de billets possible
            </span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5"></div>
            <span className="opacity-80">
              <span className="font-bold">Option 2 (Approche équilibrée):</span> Bon compromis entre toutes les coupures
            </span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5"></div>
            <span className="opacity-80">
              <span className="font-bold">Option 3 (Petites coupures):</span> Plus de billets de 250, 100, 50 HTG
            </span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></div>
            <span className="opacity-80">
              <span className="font-bold">Option 4 (Solution optimisée):</span> Algorithme intelligent pour la meilleure distribution
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-green-400 border-opacity-10">
          <div className="flex items-center gap-1">
            <Info size={9} className="text-blue-300" />
            <p className="text-[9px] text-blue-300">
              <span className="font-bold">Note:</span> Choisissez en fonction de vos disponibilités en caisse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCombinations;