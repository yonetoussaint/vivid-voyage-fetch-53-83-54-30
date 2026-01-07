import React, { useMemo, useState } from 'react';
import { Sparkles, Coins, AlertCircle, Zap, BarChart, Target, Brain, Info, ChevronRight, ChevronLeft } from 'lucide-react';
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
      case 0: return 'bg-yellow-400 border-yellow-500 text-gray-900';
      case 1: return 'bg-blue-400 border-blue-500 text-gray-900';
      case 2: return 'bg-purple-400 border-purple-500 text-gray-900';
      case 3: return 'bg-amber-400 border-amber-500 text-gray-900';
      default: return 'bg-gray-400 border-gray-500 text-gray-900';
    }
  };

  const getCardBorderColor = (index) => {
    switch (index) {
      case 0: return 'border-yellow-400 border-opacity-50 bg-yellow-500 bg-opacity-15';
      case 1: return 'border-blue-400 border-opacity-50 bg-blue-500 bg-opacity-15';
      case 2: return 'border-purple-400 border-opacity-50 bg-purple-500 bg-opacity-15';
      case 3: return 'border-amber-400 border-opacity-50 bg-amber-500 bg-opacity-15';
      default: return 'border-gray-400 border-opacity-50 bg-gray-500 bg-opacity-15';
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

  // Navigation functions
  const nextTab = () => {
    setActiveTab((prev) => (prev + 1) % combinations.length);
  };

  const prevTab = () => {
    setActiveTab((prev) => (prev - 1 + combinations.length) % combinations.length);
  };

  const activeCombination = combinations[activeTab];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Sparkles size={10} className="text-green-300" />
          <p className="text-xs font-bold text-green-300">Combinaisons de monnaie:</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={prevTab}
            className="p-0.5 rounded hover:bg-gray-800 disabled:opacity-30"
            disabled={combinations.length <= 1}
          >
            <ChevronLeft size={12} className="text-green-300" />
          </button>
          <button 
            onClick={nextTab}
            className="p-0.5 rounded hover:bg-gray-800 disabled:opacity-30"
            disabled={combinations.length <= 1}
          >
            <ChevronRight size={12} className="text-green-300" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation - Horizontal */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {combinations.map((combo, index) => (
          <button
            key={combo.key}
            onClick={() => setActiveTab(index)}
            className={`flex items-center justify-center p-1.5 rounded-md border transition-all ${
              activeTab === index 
                ? `${getTabColor(index)} border-opacity-100 font-bold` 
                : 'bg-gray-800 border-gray-700 border-opacity-50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(index)}`}></div>
              <span className="text-[10px] font-medium whitespace-nowrap">Option {index + 1}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Combination Card */}
      <div className={`rounded-lg p-3 border ${getCardBorderColor(activeTab)}`}>
        {/* Option header */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(activeTab)}`}></div>
              <div className="flex items-center gap-1.5">
                {getStrategyIcon(activeCombination.strategyName, activeTab)}
                <p className="text-sm font-bold text-green-300">
                  {activeCombination.strategyName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins size={12} className="text-green-300 opacity-70" />
              <span className="text-xs opacity-80">
                {activeCombination.totalNotes} pièce{activeCombination.totalNotes !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <p className="text-[10px] opacity-80 ml-5">
            {activeCombination.description}
          </p>
        </div>

        {/* Complete breakdown */}
        {activeCombination.breakdown.length > 0 ? (
          <>
            <div className="space-y-2 mb-3">
              {activeCombination.breakdown.map((item, idx) => (
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
            <div className="pt-3 border-t border-white border-opacity-20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-green-300">Total donné:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-green-300">
                      {formaterArgent(activeCombination.totalAmount)}
                    </span>
                    <span className="text-[10px] opacity-70">HTG</span>
                  </div>
                </div>

                {/* Show remainder if any */}
                {activeCombination.remainder > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-amber-400 border-opacity-20">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle size={10} className="text-amber-300" />
                      <span className="text-[10px] text-amber-300">Reste abandonné:</span>
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      {formaterArgent(activeCombination.remainder)} HTG
                    </span>
                  </div>
                )}

                {/* Efficiency score (if available) */}
                {activeCombination.efficiency && (
                  <div className="flex items-center justify-between pt-2 border-t border-green-400 border-opacity-20">
                    <div className="flex items-center gap-1.5">
                      <Info size={10} className="text-blue-300" />
                      <span className="text-[10px] text-blue-300">Score d'efficacité:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-white bg-opacity-10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-300 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (activeCombination.efficiency || 0) / 1.5)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-green-300">
                        {Math.round(activeCombination.efficiency)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Show empty state for amounts < 5 HTG
          <div className="text-center py-4">
            <p className="text-sm text-amber-300 font-bold mb-1">
              {activeCombination.strategyName}
            </p>
            <p className="text-xs opacity-80">
              Le montant est inférieur à 5 HTG
            </p>
            <div className="mt-3 pt-3 border-t border-amber-400 border-opacity-20">
              <p className="text-xs font-bold text-amber-300">
                Total abandonné: {formaterArgent(activeCombination.remainder)} HTG
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Denomination info */}
      <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20">
        <p className="text-[9px] text-center text-blue-300">
          Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
        </p>
      </div>

      {/* Note only (without the strategy guide) */}
      <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
        <div className="flex items-center gap-1">
          <Info size={9} className="text-blue-300" />
          <p className="text-[9px] text-blue-300">
            <span className="font-bold">Note:</span> Choisissez en fonction de vos disponibilités en caisse
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangeCombinations;