import React, { useMemo } from 'react';
import { Sparkles, Coins, AlertCircle, Zap, BarChart, Target, Brain, CheckCircle } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';

const ChangeCombinations = ({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

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
        return <Zap size={12} className="text-yellow-400" />;
      case 'Approche équilibrée':
        return <BarChart size={12} className="text-green-400" />;
      case 'Plus de petites coupures':
        return <Target size={12} className="text-blue-400" />;
      case 'Solution optimisée':
      case 'Solution mathématique':
      case 'Variante 1':
      case 'Variante 2':
      case 'Variante 3':
      case 'Variante 4':
        return <Brain size={12} className="text-purple-400" />;
      default:
        const colors = ['text-yellow-400', 'text-blue-400', 'text-green-400', 'text-purple-400'];
        return <Sparkles size={12} className={colors[index % colors.length]} />;
    }
  };

  const getCardColor = (index) => {
    switch (index % 4) {
      case 0: return {
        bg: 'bg-gradient-to-br from-yellow-500/15 to-amber-500/10',
        border: 'border-yellow-400/40',
        accent: 'bg-yellow-500',
        text: 'text-yellow-300'
      };
      case 1: return {
        bg: 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10',
        border: 'border-blue-400/40',
        accent: 'bg-blue-500',
        text: 'text-blue-300'
      };
      case 2: return {
        bg: 'bg-gradient-to-br from-green-500/15 to-emerald-500/10',
        border: 'border-green-400/40',
        accent: 'bg-green-500',
        text: 'text-green-300'
      };
      case 3: return {
        bg: 'bg-gradient-to-br from-purple-500/15 to-violet-500/10',
        border: 'border-purple-400/40',
        accent: 'bg-purple-500',
        text: 'text-purple-300'
      };
    }
  };

  const getEfficiencyLabel = (efficiency) => {
    if (efficiency >= 120) return { text: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (efficiency >= 90) return { text: 'Très bon', color: 'text-green-300', bg: 'bg-green-500/15' };
    if (efficiency >= 60) return { text: 'Bon', color: 'text-yellow-300', bg: 'bg-yellow-500/15' };
    if (efficiency >= 30) return { text: 'Moyen', color: 'text-orange-300', bg: 'bg-orange-500/15' };
    return { text: 'Faible', color: 'text-orange-300', bg: 'bg-orange-500/10' };
  };

  const getDenominationColor = (denomination) => {
    if (denomination >= 500) return 'bg-green-600';
    if (denomination >= 100) return 'bg-green-500';
    if (denomination >= 50) return 'bg-green-400';
    return 'bg-green-300';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={12} className="text-green-300" />
        <p className="text-xs font-bold text-green-300">Options disponibles:</p>
        <span className="text-[10px] opacity-70 ml-auto">
          {combinations.length} combinaisons
        </span>
      </div>

      {/* Denomination info */}
      <div className="bg-white/5 rounded-lg p-2 border border-white/10 mb-3">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="opacity-80">Montant à rendre:</span>
            <span className="font-bold text-blue-300">{formaterArgent(changeNeeded)} HTG</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="opacity-80">Utilisable:</span>
            <span className="font-bold text-green-300">{formaterArgent(givableAmount)} HTG</span>
          </div>
        </div>
        {hasRemainder && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-400/20">
            <AlertCircle size={10} className="text-amber-300" />
            <span className="text-[10px] text-amber-300">
              <span className="font-bold">À abandonner:</span> {formaterArgent(remainder)} HTG
              <span className="opacity-70 ml-1">(plus petit billet = 5 HTG)</span>
            </span>
          </div>
        )}
      </div>

      {/* All combinations displayed directly */}
      <div className="space-y-3">
        {combinations.map((combo, index) => {
          const colors = getCardColor(index);
          const efficiency = getEfficiencyLabel(combo.efficiency || 0);
          
          return (
            <div 
              key={combo.key}
              className={`rounded-lg p-3 border ${colors.border} ${colors.bg} shadow-sm`}
            >
              {/* Strategy header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.accent} flex items-center justify-center`}>
                    {getStrategyIcon(combo.strategyName, index)}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${colors.text}`}>
                      Option {index + 1}: {combo.strategyName}
                    </p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      {combo.description}
                    </p>
                  </div>
                </div>
                
                {/* Efficiency badge */}
                <div className={`px-2 py-1 rounded ${efficiency.bg}`}>
                  <p className={`text-[10px] font-bold ${efficiency.color}`}>
                    {efficiency.text}
                  </p>
                </div>
              </div>

              {/* Bills summary */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Coins size={10} className="opacity-70" />
                    <span className="text-[10px] opacity-80">Composition:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] opacity-70">
                      {combo.totalNotes} billets
                    </span>
                    <span className="text-[10px] opacity-70">
                      {formaterArgent(combo.totalAmount)} HTG
                    </span>
                  </div>
                </div>

                {/* Bills visualization */}
                {combo.breakdown.length > 0 ? (
                  <div className="space-y-2">
                    {/* Stack visualization */}
                    <div className="flex items-end gap-1 h-8">
                      {combo.breakdown.slice(0, 6).map((item, idx) => (
                        <div 
                          key={idx}
                          className={`${getDenominationColor(item.denomination)} rounded-t-sm transition-all duration-300`}
                          style={{
                            width: `${Math.max(20, Math.min(40, 20 + item.count * 2))}px`,
                            height: `${Math.max(12, Math.min(30, 12 + item.denomination / 100))}px`,
                            opacity: 0.8 + (item.count * 0.1)
                          }}
                          title={`${item.count} × ${formaterArgent(item.denomination)} HTG`}
                        >
                          <div className="text-[8px] text-center text-white font-bold mt-1">
                            {item.count}
                          </div>
                        </div>
                      ))}
                      {combo.breakdown.length > 6 && (
                        <div className="text-[10px] opacity-60 pl-2">
                          +{combo.breakdown.length - 6} autres
                        </div>
                      )}
                    </div>

                    {/* Detailed breakdown */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {combo.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-white/5 rounded">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDenominationColor(item.denomination)}`}></div>
                            <span className="text-[10px]">
                              {item.count} × <span className="font-medium">{formaterArgent(item.denomination)}</span>
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-green-300">
                            {formaterArgent(item.total)} HTG
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 bg-white/5 rounded">
                    <p className="text-xs text-amber-300 font-bold">
                      Aucun billet possible
                    </p>
                    <p className="text-[10px] opacity-80 mt-1">
                      Le montant est inférieur à 5 HTG
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with totals */}
              <div className="pt-3 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] opacity-70">Total billets</p>
                    <p className="text-sm font-bold text-green-300">{combo.totalNotes}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-70">Montant rendu</p>
                    <p className="text-sm font-bold text-green-300">{formaterArgent(combo.totalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-70">Efficacité</p>
                    <p className="text-sm font-bold text-green-300">
                      {Math.round(combo.efficiency || 0)}%
                    </p>
                  </div>
                </div>

                {/* Remainder warning */}
                {combo.remainder > 0 && (
                  <div className="mt-2 pt-2 border-t border-amber-400/20">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle size={10} className="text-amber-300" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-300">
                          Monnaie non rendue: {formaterArgent(combo.remainder)} HTG
                        </p>
                        <p className="text-[9px] opacity-80">
                          Doit être abandonné (plus petit billet = 5 HTG)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exact match indicator */}
                {combo.isExact && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <CheckCircle size={10} className="text-green-400" />
                    <span className="text-[10px] text-green-400 font-bold">
                      Montant exact - Aucun abandon nécessaire
                    </span>
                  </div>
                )}
              </div>

              {/* Quick comparison tip */}
              {index === 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-[9px] text-center opacity-70">
                    💡 <span className="font-medium">Recommandé</span> : Moins de billets, plus pratique
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison guide */}
      <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={12} className="text-blue-400" />
          <p className="text-xs font-bold text-blue-300">Guide de sélection:</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1"></div>
            <div>
              <p className="font-bold">Option 1 (Jaune):</p>
              <p className="opacity-80">Minimum de billets</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
            <div>
              <p className="font-bold">Option 2 (Bleu):</p>
              <p className="opacity-80">Équilibre coupures</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
            <div>
              <p className="font-bold">Option 3 (Vert):</p>
              <p className="opacity-80">Plus petites coupures</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1"></div>
            <div>
              <p className="font-bold">Option 4 (Violet):</p>
              <p className="opacity-80">Solution optimisée</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[9px] text-center opacity-80">
            Toutes les solutions sont calculées en temps réel avec 4 algorithmes différents
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangeCombinations;