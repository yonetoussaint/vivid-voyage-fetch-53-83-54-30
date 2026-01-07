import React, { useMemo, useState } from 'react';
import { Sparkles, Coins, AlertCircle, Zap, BarChart, Target, Brain } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';

const ChangeCombinations = ({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
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

  const getTabColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-400';
      case 1: return 'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-400';
      case 2: return 'bg-purple-500 bg-opacity-20 text-purple-300 border-purple-400';
      case 3: return 'bg-amber-500 bg-opacity-20 text-amber-300 border-amber-400';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-400';
    }
  };

  const getCardBorderColor = (index) => {
    switch (index) {
      case 0: return 'border-yellow-400 border-opacity-40 bg-yellow-500 bg-opacity-15';
      case 1: return 'border-blue-400 border-opacity-40 bg-blue-500 bg-opacity-15';
      case 2: return 'border-purple-400 border-opacity-40 bg-purple-500 bg-opacity-15';
      case 3: return 'border-amber-400 border-opacity-40 bg-amber-500 bg-opacity-15';
      default: return 'border-gray-400 border-opacity-40 bg-gray-500 bg-opacity-15';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1 mb-2">
        <Sparkles size={10} className="text-green-300" />
        <p className="text-xs font-bold text-green-300">Combinaisons de monnaie:</p>
      </div>

      {/* Horizontal Tabs matching sequences style */}
      <div className="bg-white bg-opacity-5 rounded-lg p-1">
        <div className="grid grid-cols-4 gap-1 mb-2">
          {combinations.map((combo, index) => (
            <button
              key={combo.key}
              onClick={() => setActiveTab(index)}
              className={`px-2 py-1.5 rounded text-xs font-medium border transition-all duration-200 flex items-center justify-center gap-1 ${
                activeTab === index 
                  ? getTabColor(index)
                  : 'bg-white bg-opacity-5 hover:bg-opacity-10 border-white border-opacity-20 text-white'
              }`}
            >
              {getStrategyIcon(combo.strategyName, index)}
              <span>Option {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Denomination info inside tab container */}
        <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
          <p className="text-[9px] text-center text-blue-300">
            Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
            {remainder > 0 && ` • Reste abandonné: ${formaterArgent(remainder)} HTG`}
          </p>
        </div>

        {/* Active Tab Content */}
        {combinations.map((combo, index) => (
          <div 
            key={combo.key} 
            className={`rounded-lg p-2 border transition-all duration-200 ${getCardBorderColor(index)} ${
              activeTab === index ? 'block' : 'hidden'
            }`}
          >
            {/* Option header */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-blue-400' :
                    index === 2 ? 'bg-purple-400' : 'bg-amber-400'
                  }`}></div>
                  <p className="text-xs font-bold text-green-300">
                    {combo.strategyName}
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

        {/* Strategy comparison in same style */}
        <div className="mt-2 pt-2 border-t border-white border-opacity-20">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles size={9} className="text-green-300" />
            <p className="text-[10px] font-bold text-green-300">Comparaison des stratégies:</p>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="flex items-start gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-0.5"></div>
              <span className="opacity-80"><span className="font-bold">Option 1:</span> Moins de billets</span>
            </div>
            <div className="flex items-start gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5"></div>
              <span className="opacity-80"><span className="font-bold">Option 2:</span> Équilibrée</span>
            </div>
            <div className="flex items-start gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5"></div>
              <span className="opacity-80"><span className="font-bold">Option 3:</span> Petites coupures</span>
            </div>
            <div className="flex items-start gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></div>
              <span className="opacity-80"><span className="font-bold">Option 4:</span> Optimisée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCombinations;