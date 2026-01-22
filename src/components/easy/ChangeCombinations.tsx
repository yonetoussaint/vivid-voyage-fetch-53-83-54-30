import React, { useMemo, useState, useEffect, memo, useCallback } from 'react';
import { Sparkles, Coins, AlertCircle, Zap, BarChart, Target, Brain, Info, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';

// Memoized inner components for better performance
const CombinationCard = memo(({ 
  combo, 
  isActive, 
  index,
  getCardBorderColor,
  getDotColor,
  getStrategyIcon
}) => {
  if (!combo) return null;

  const { 
    breakdown, 
    totalNotes, 
    totalAmount, 
    remainder, 
    strategyName, 
    description 
  } = combo;

  return (
    <div className={`rounded-lg p-3 border transition-all duration-300 ${
      isActive 
        ? `${getCardBorderColor(index)} opacity-100 scale-[1.02]` 
        : 'opacity-0 absolute inset-0 pointer-events-none'
    }`}>
      {/* Option header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(index)}`}></div>
            <div className="flex items-center gap-1.5">
              {getStrategyIcon(strategyName, index)}
              <p className="text-sm font-bold text-green-300">
                {strategyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins size={12} className="text-green-300 opacity-70" />
            <span className="text-xs opacity-80">
              {totalNotes} pièce{totalNotes !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <p className="text-[10px] opacity-80 ml-5">
          {description}
        </p>
      </div>

      {/* Complete breakdown */}
      {breakdown.length > 0 ? (
        <>
          <div className="space-y-2 mb-3">
            {breakdown.map((item, idx) => (
              <div key={`${item.denomination}-${idx}`} className="flex items-center justify-between">
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
                    {formaterArgent(totalAmount)}
                  </span>
                  <span className="text-[10px] opacity-70">HTG</span>
                </div>
              </div>

              {/* Show remainder if any */}
              {remainder > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-amber-400 border-opacity-20">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={10} className="text-amber-300" />
                    <span className="text-[10px] text-amber-300">Reste abandonné:</span>
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    {formaterArgent(remainder)} HTG
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // Show empty state for amounts < 5 HTG
        <div className="text-center py-4">
          <p className="text-sm text-amber-300 font-bold mb-1">
            {strategyName}
          </p>
          <p className="text-xs opacity-80">
            Le montant est inférieur à 5 HTG
          </p>
          <div className="mt-3 pt-3 border-t border-amber-400 border-opacity-20">
            <p className="text-xs font-bold text-amber-300">
              Total abandonné: {formaterArgent(remainder)} HTG
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

CombinationCard.displayName = 'CombinationCard';

const TabButton = memo(({ 
  combo, 
  index, 
  isActive, 
  onClick,
  getTabColor,
  getDotColor 
}) => (
  <button
    onClick={() => onClick(index)}
    className={`flex items-center justify-center p-1.5 rounded-md border transition-all duration-200 ${
      isActive 
        ? `${getTabColor(index)} border-opacity-100 font-bold shadow-sm` 
        : 'bg-gray-800 border-gray-700 border-opacity-50 text-gray-400 hover:bg-gray-700 hover:border-gray-600'
    }`}
  >
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(index)}`}></div>
      <span className="text-[10px] font-medium whitespace-nowrap">
        Option {index + 1}
      </span>
    </div>
  </button>
));

TabButton.displayName = 'TabButton';

const ChangeCombinations = memo(({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previousChangeNeeded, setPreviousChangeNeeded] = useState(0);

  // Calculate givable amount and remainder
  const givableAmount = useMemo(() => 
    getMaximumGivableAmount(changeNeeded), 
    [changeNeeded]
  );
  
  const remainder = useMemo(() => 
    changeNeeded - givableAmount, 
    [changeNeeded, givableAmount]
  );

  // Generate combinations with memoization and loading state
  const combinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    
    // Check if the amount has changed significantly
    const amountChanged = Math.abs(changeNeeded - previousChangeNeeded) > 5;
    
    if (amountChanged && changeNeeded > 1000) {
      setIsLoading(true);
    }
    
    return generateChangeCombinations(changeNeeded);
  }, [changeNeeded, shouldGiveChange, previousChangeNeeded]);

  // Update previous change needed and clear loading
  useEffect(() => {
    if (combinations.length > 0) {
      setIsLoading(false);
      setPreviousChangeNeeded(changeNeeded);
    }
  }, [combinations, changeNeeded]);

  // Reset active tab when combinations change
  useEffect(() => {
    if (combinations.length > 0 && activeTab >= combinations.length) {
      setActiveTab(0);
    }
  }, [combinations, activeTab]);

  const getStrategyIcon = useCallback((strategyName, index) => {
    switch (strategyName) {
      case 'Priorité aux gros billets':
      case 'Minimum de billets':
        return <Zap size={10} className="text-yellow-500" />;
      case 'Approche différente':
      case 'Approche équilibrée':
        return <BarChart size={10} className="text-green-500" />;
      case 'Billets moyens':
      case 'Plus de petites coupures':
        return <Target size={10} className="text-blue-500" />;
      case 'Solution optimisée':
      case 'Solution mathématique':
      case 'Évite petite monnaie':
        return <Brain size={10} className="text-purple-500" />;
      default:
        const colors = ['text-yellow-500', 'text-blue-500', 'text-purple-500', 'text-amber-500'];
        return <Sparkles size={10} className={colors[index % colors.length]} />;
    }
  }, []);

  const getTabColor = useCallback((index) => {
    switch (index) {
      case 0: return 'bg-yellow-400 border-yellow-500 text-gray-900';
      case 1: return 'bg-blue-400 border-blue-500 text-gray-900';
      case 2: return 'bg-purple-400 border-purple-500 text-gray-900';
      case 3: return 'bg-amber-400 border-amber-500 text-gray-900';
      default: return 'bg-gray-400 border-gray-500 text-gray-900';
    }
  }, []);

  const getCardBorderColor = useCallback((index) => {
    switch (index) {
      case 0: return 'border-yellow-400 border-opacity-50 bg-yellow-500 bg-opacity-15';
      case 1: return 'border-blue-400 border-opacity-50 bg-blue-500 bg-opacity-15';
      case 2: return 'border-purple-400 border-opacity-50 bg-purple-500 bg-opacity-15';
      case 3: return 'border-amber-400 border-opacity-50 bg-amber-500 bg-opacity-15';
      default: return 'border-gray-400 border-opacity-50 bg-gray-500 bg-opacity-15';
    }
  }, []);

  const getDotColor = useCallback((index) => {
    switch (index) {
      case 0: return 'bg-yellow-400';
      case 1: return 'bg-blue-400';
      case 2: return 'bg-purple-400';
      case 3: return 'bg-amber-400';
      default: return 'bg-gray-400';
    }
  }, []);

  // Navigation functions
  const nextTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % combinations.length);
  }, [combinations.length]);

  const prevTab = useCallback(() => {
    setActiveTab((prev) => (prev - 1 + combinations.length) % combinations.length);
  }, [combinations.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevTab();
      } else if (e.key === 'ArrowRight') {
        nextTab();
      }
    };

    if (combinations.length > 1) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [prevTab, nextTab, combinations.length]);

  if (!shouldGiveChange || combinations.length === 0) {
    return null;
  }

  const activeCombination = combinations[activeTab];

  return (
    <div className="space-y-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles size={10} className="text-green-300" />
            {isLoading && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 border-t border-green-300 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-green-300">Combinaisons de monnaie:</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={prevTab}
            className="p-0.5 rounded hover:bg-gray-800 disabled:opacity-30 transition-colors"
            disabled={combinations.length <= 1}
            aria-label="Option précédente"
          >
            <ChevronLeft size={12} className="text-green-300" />
          </button>
          <span className="text-[10px] text-green-300 opacity-70 mx-1">
            {activeTab + 1}/{combinations.length}
          </span>
          <button 
            onClick={nextTab}
            className="p-0.5 rounded hover:bg-gray-800 disabled:opacity-30 transition-colors"
            disabled={combinations.length <= 1}
            aria-label="Option suivante"
          >
            <ChevronRight size={12} className="text-green-300" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {combinations.map((combo, index) => (
          <TabButton
            key={combo.key}
            combo={combo}
            index={index}
            isActive={activeTab === index}
            onClick={setActiveTab}
            getTabColor={getTabColor}
            getDotColor={getDotColor}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-lg p-4 border border-gray-700 bg-gray-800 bg-opacity-50 text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-green-300" />
            <span className="text-xs text-green-300">
              Calcul des combinaisons...
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Pour {formaterArgent(changeNeeded)} HTG
          </p>
        </div>
      ) : (
        <>
          {/* Active Combination Card */}
          <div className="relative min-h-[200px]">
            {combinations.map((combo, index) => (
              <CombinationCard
                key={combo.key}
                combo={combo}
                isActive={activeTab === index}
                index={index}
                getCardBorderColor={getCardBorderColor}
                getDotColor={getDotColor}
                getStrategyIcon={getStrategyIcon}
              />
            ))}
          </div>

          {/* Remainder info if applicable */}
          {remainder > 0 && (
            <div className="bg-amber-500 bg-opacity-10 rounded-lg p-2 border border-amber-400 border-opacity-30">
              <div className="flex items-start gap-2">
                <AlertCircle size={12} className="text-amber-300 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300 mb-1">
                    Note sur le montant total
                  </p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="opacity-80">Montant à rendre:</span>
                      <span className="font-bold text-amber-300">{formaterArgent(changeNeeded)} HTG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Maximum réalisable:</span>
                      <span className="font-bold text-green-300">{formaterArgent(givableAmount)} HTG</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-amber-400 border-opacity-20">
                      <span className="opacity-80">Reste à abandonner:</span>
                      <span className="font-bold text-amber-300">{formaterArgent(remainder)} HTG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
            <div className="flex items-start gap-1">
              <Info size={9} className="text-blue-300 mt-0.5 flex-shrink-0" />
              <p className="text-[9px] text-blue-300 leading-tight">
                <span className="font-bold">Note:</span> Choisissez en fonction de vos disponibilités en caisse. 
                Utilisez les flèches ← → du clavier pour naviguer rapidement entre les options.
              </p>
            </div>
          </div>

          {/* Quick summary */}
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <div className="bg-gray-800 rounded p-1.5 text-center">
              <div className="font-bold text-green-300">{combinations.length}</div>
              <div className="opacity-70">Options</div>
            </div>
            <div className="bg-gray-800 rounded p-1.5 text-center">
              <div className="font-bold text-blue-300">
                {activeCombination.totalNotes}
              </div>
              <div className="opacity-70">Billets</div>
            </div>
            <div className="bg-gray-800 rounded p-1.5 text-center">
              <div className="font-bold text-purple-300">
                {formaterArgent(activeCombination.totalAmount)}
              </div>
              <div className="opacity-70">HTG rendus</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ChangeCombinations.displayName = 'ChangeCombinations';

export default ChangeCombinations;