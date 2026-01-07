import React, { useMemo, useState } from 'react';
import { Sparkles, Coins, AlertCircle, Brain, Zap, Shield, Target, BarChart, Info } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount, calculateOptimalChange } from '@/utils/changeCalculator';

const ChangeCombinations = ({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  
  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

  // Generate combinations
  const combinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    return generateChangeCombinations(changeNeeded);
  }, [changeNeeded, shouldGiveChange]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (combinations.length === 0) return null;
    
    const allBills = combinations.flatMap(combo => combo.breakdown);
    const totalBills = allBills.reduce((sum, item) => sum + item.count, 0);
    const avgBills = totalBills / combinations.length;
    
    // Count denomination usage
    const denomUsage = {};
    allBills.forEach(item => {
      denomUsage[item.denomination] = (denomUsage[item.denomination] || 0) + item.count;
    });
    
    // Find most used denomination
    const mostUsed = Object.entries(denomUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([denom, count]) => ({ denom: parseInt(denom), count }));
    
    return {
      totalCombinations: combinations.length,
      avgBillsPerCombo: Math.round(avgBills * 10) / 10,
      mostUsedDenominations: mostUsed,
      bestEfficiency: Math.max(...combinations.map(c => c.efficiency || 0)),
      hasExactSolution: combinations.some(c => c.isExact)
    };
  }, [combinations]);

  if (!shouldGiveChange || combinations.length === 0) {
    return null;
  }

  const getStrategyIcon = (strategyName) => {
    switch (strategyName) {
      case 'Minimum de billets':
        return <Zap size={12} className="text-yellow-500" />;
      case 'Approche équilibrée':
        return <BarChart size={12} className="text-green-500" />;
      case 'Plus de petites coupures':
        return <Target size={12} className="text-blue-500" />;
      case 'Solution optimisée':
      case 'Solution mathématique':
        return <Brain size={12} className="text-purple-500" />;
      default:
        return <Shield size={12} className="text-amber-500" />;
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 120) return 'text-green-400';
    if (efficiency >= 90) return 'text-green-300';
    if (efficiency >= 60) return 'text-yellow-300';
    return 'text-orange-300';
  };

  const getEfficiencyLabel = (efficiency) => {
    if (efficiency >= 120) return 'Excellent';
    if (efficiency >= 90) return 'Très bon';
    if (efficiency >= 60) return 'Bon';
    if (efficiency >= 30) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="space-y-3">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-green-300" />
          <p className="text-xs font-bold text-green-300">Solutions Intelligentes:</p>
        </div>
        {stats && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Brain size={10} className="text-blue-300" />
              <span className="text-[10px] opacity-80">{stats.totalCombinations} options</span>
            </div>
            {stats.hasExactSolution && (
              <div className="px-1.5 py-0.5 bg-green-500 bg-opacity-20 rounded text-[10px] text-green-300">
                Exact
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats overview */}
      {stats && (
        <div className="bg-blue-500 bg-opacity-5 rounded-lg p-2 border border-blue-400 border-opacity-10 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-[10px] opacity-70">Efficacité max</p>
                <p className={`text-xs font-bold ${getEfficiencyColor(stats.bestEfficiency)}`}>
                  {getEfficiencyLabel(stats.bestEfficiency)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-[10px] opacity-70">Billets/combo</p>
                <p className="text-xs font-bold text-blue-300">{stats.avgBillsPerCombo}</p>
              </div>
            </div>
          </div>
          {stats.mostUsedDenominations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white border-opacity-10">
              <p className="text-[10px] opacity-70 mb-1">Coupures recommandées:</p>
              <div className="flex gap-1">
                {stats.mostUsedDenominations.map(({ denom, count }) => (
                  <div key={denom} className="px-2 py-1 bg-white bg-opacity-10 rounded text-[10px]">
                    {formaterArgent(denom)} HTG
                    <span className="opacity-60 ml-1">({count}x)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Denomination info */}
      <div className="bg-blue-500 bg-opacity-10 rounded-lg p-2 border border-blue-400 border-opacity-20 mb-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-blue-300">
            <span className="font-bold">Montant à rendre:</span> {formaterArgent(changeNeeded)} HTG
          </p>
          <p className="text-[10px] text-blue-300">
            <span className="font-bold">Utilisable:</span> {formaterArgent(givableAmount)} HTG
          </p>
        </div>
        {hasRemainder && (
          <div className="mt-1 pt-1 border-t border-amber-400 border-opacity-30">
            <div className="flex items-center gap-1">
              <AlertCircle size={10} className="text-amber-300" />
              <p className="text-[10px] text-amber-300">
                <span className="font-bold">À abandonner:</span> {formaterArgent(remainder)} HTG
                <span className="opacity-70 ml-1">(plus petit billet = 5 HTG)</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Strategy selection */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={10} className="text-green-300" />
          <p className="text-xs font-bold text-green-300">Sélectionnez une stratégie:</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {combinations.map((combo, index) => (
            <button
              key={combo.key}
              onClick={() => setSelectedStrategy(selectedStrategy === index ? null : index)}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                selectedStrategy === index
                  ? 'border-green-400 bg-green-500 bg-opacity-20 shadow-sm'
                  : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {getStrategyIcon(combo.strategyName)}
                <span className="text-xs font-bold truncate">{combo.strategyName}</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] opacity-80 truncate">{combo.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] opacity-70">{combo.totalNotes} billets</span>
                  <span className={`text-[10px] font-bold ${getEfficiencyColor(combo.efficiency || 0)}`}>
                    {Math.round(combo.efficiency || 0)}%
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed view for selected strategy */}
      {selectedStrategy !== null && (
        <div className="rounded-lg p-3 border border-green-400 border-opacity-30 bg-green-500 bg-opacity-10 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStrategyIcon(combinations[selectedStrategy].strategyName)}
              <div>
                <p className="text-xs font-bold text-green-300">
                  {combinations[selectedStrategy].strategyName}
                </p>
                <p className="text-[10px] opacity-80">
                  {combinations[selectedStrategy].description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStrategy(null)}
              className="text-[10px] opacity-70 hover:opacity-100"
            >
              Fermer
            </button>
          </div>

          {/* Efficiency rating */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] opacity-70">Score d'efficacité:</span>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-bold ${getEfficiencyColor(combinations[selectedStrategy].efficiency || 0)}`}>
                  {getEfficiencyLabel(combinations[selectedStrategy].efficiency || 0)}
                </span>
                <span className="text-[10px] opacity-70">
                  ({Math.round(combinations[selectedStrategy].efficiency || 0)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-10 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full"
                style={{ 
                  width: `${Math.min(100, (combinations[selectedStrategy].efficiency || 0) / 1.5)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Breakdown details */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 mb-2">
              <Coins size={10} className="text-green-300" />
              <p className="text-xs font-bold text-green-300">Détail de la composition:</p>
            </div>
            
            {combinations[selectedStrategy].breakdown.length > 0 ? (
              <>
                {/* Bills breakdown */}
                <div className="space-y-1.5">
                  {combinations[selectedStrategy].breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white bg-opacity-5 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          item.denomination >= 500 ? 'bg-green-600' : 
                          item.denomination >= 100 ? 'bg-green-500' : 
                          item.denomination >= 50 ? 'bg-green-400' : 'bg-green-300'
                        }`}>
                          <span className="text-[8px] font-bold">{item.count}</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium">{formaterArgent(item.denomination)} HTG</p>
                          <p className="text-[10px] opacity-70">× {item.count}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-300">{formaterArgent(item.total)} HTG</p>
                        <p className="text-[10px] opacity-70">
                          {(item.total / combinations[selectedStrategy].totalAmount * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-white border-opacity-20">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white bg-opacity-5 rounded p-2">
                      <p className="text-[10px] opacity-70 mb-1">Total billets</p>
                      <p className="text-sm font-bold text-green-300">
                        {combinations[selectedStrategy].totalNotes}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-5 rounded p-2">
                      <p className="text-[10px] opacity-70 mb-1">Montant total</p>
                      <p className="text-sm font-bold text-green-300">
                        {formaterArgent(combinations[selectedStrategy].totalAmount)} HTG
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-amber-300 font-bold mb-1">
                  Aucun billet possible
                </p>
                <p className="text-[10px] opacity-80">
                  Le montant est inférieur à la plus petite coupure disponible (5 HTG)
                </p>
              </div>
            )}

            {/* Remainder info */}
            {combinations[selectedStrategy].remainder > 0 && (
              <div className="bg-amber-500 bg-opacity-10 rounded-lg p-2 border border-amber-400 border-opacity-30 mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={12} className="text-amber-300" />
                  <div>
                    <p className="text-xs font-bold text-amber-300 mb-0.5">Monnaie non rendue</p>
                    <p className="text-[10px] opacity-90">
                      Avec les coupures disponibles, {formaterArgent(combinations[selectedStrategy].remainder)} HTG 
                      ne peuvent pas être rendus et doivent être abandonnés.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All combinations in compact view */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 mb-2">
          <Info size={10} className="text-green-300" />
          <p className="text-xs font-bold text-green-300">Toutes les options:</p>
        </div>
        
        <div className="space-y-2">
          {combinations.map((combo, index) => (
            <div 
              key={combo.key}
              className={`rounded-lg p-2 border transition-colors ${
                selectedStrategy === index
                  ? 'border-green-400 bg-green-500 bg-opacity-15'
                  : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10'
              }`}
              onClick={() => setSelectedStrategy(index)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getStrategyIcon(combo.strategyName)}
                  <span className="text-xs font-bold">{combo.strategyName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] opacity-70">{combo.totalNotes} billets</span>
                  <span className={`text-[10px] font-bold ${getEfficiencyColor(combo.efficiency || 0)}`}>
                    {Math.round(combo.efficiency || 0)}%
                  </span>
                </div>
              </div>
              
              {/* Quick breakdown preview */}
              {combo.breakdown.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {combo.breakdown.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="px-1.5 py-0.5 bg-white bg-opacity-10 rounded text-[10px]">
                      {item.count}×{formaterArgent(item.denomination)}
                    </div>
                  ))}
                  {combo.breakdown.length > 3 && (
                    <div className="px-1.5 py-0.5 bg-white bg-opacity-10 rounded text-[10px] opacity-70">
                      +{combo.breakdown.length - 3} plus
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-2 border border-blue-400 border-opacity-10">
        <div className="flex items-center gap-1 mb-1">
          <Brain size={10} className="text-blue-300" />
          <p className="text-[10px] font-bold text-blue-300">Algorithme intelligent</p>
        </div>
        <p className="text-[9px] opacity-80 leading-tight">
          Utilise 4 méthodes différentes : programmation dynamique, algorithme génétique, 
          greedy optimisé et recherche heuristique pour trouver les meilleures combinaisons.
        </p>
      </div>
    </div>
  );
};

export default ChangeCombinations;