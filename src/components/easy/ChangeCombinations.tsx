// components/easy/ChangeCombinations.js
import React, { memo } from 'react';
import { generateChangeCombinations } from '@/utils/changeCalculator';
import { formaterArgent } from '@/utils/formatters';
import { Calculator, Coins, Layers, Target, CheckCircle, XCircle } from 'lucide-react';

// Memoized inner component for each combination
const CombinationCard = memo(({ combo, index }) => {
  const { 
    breakdown, 
    totalNotes, 
    totalAmount, 
    remainder, 
    isExact, 
    strategyName, 
    description 
  } = combo;

  return (
    <div className={`rounded-lg p-3 border-2 ${
      isExact 
        ? 'bg-green-50 border-green-200' 
        : remainder > 0 
          ? 'bg-amber-50 border-amber-200' 
          : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isExact ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {isExact ? <CheckCircle size={16} /> : <Target size={16} />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{strategyName}</h4>
            <p className="text-[10px] text-gray-600">{description}</p>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full font-bold ${
          isExact 
            ? 'bg-green-100 text-green-700' 
            : remainder > 0 
              ? 'bg-amber-100 text-amber-700' 
              : 'bg-blue-100 text-blue-700'
        }`}>
          Option {index + 1}
        </div>
      </div>

      {/* Breakdown */}
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <Coins size={12} className="text-gray-500" />
          <p className="text-xs font-medium text-gray-700">Détail:</p>
        </div>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {breakdown.map((item, idx) => (
            <div key={idx} className="bg-white rounded p-1.5 border border-gray-200 text-center">
              <div className="text-xs font-bold text-gray-900">{item.count}×</div>
              <div className="text-[10px] font-bold text-blue-600">{item.denomination}</div>
              <div className="text-[9px] text-gray-500">HTG</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex items-center justify-between text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-gray-500" />
            <span className="text-gray-600">Total billets:</span>
            <span className="font-bold text-gray-900">{totalNotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calculator size={10} className="text-gray-500" />
            <span className="text-gray-600">Montant rendu:</span>
            <span className="font-bold text-green-600">{formaterArgent(totalAmount)} HTG</span>
          </div>
        </div>
        
        {remainder > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <XCircle size={10} className="text-amber-500" />
              <span className="text-[10px] font-medium text-amber-700">À abandonner:</span>
            </div>
            <div className="text-sm font-bold text-amber-600">{formaterArgent(remainder)} HTG</div>
          </div>
        )}
      </div>
    </div>
  );
});

CombinationCard.displayName = 'CombinationCard';

// Main component
const ChangeCombinations = memo(({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  // Generate combinations with memoization
  const combinations = React.useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    return generateChangeCombinations(changeNeeded);
  }, [changeNeeded, shouldGiveChange]);

  if (!shouldGiveChange || !combinations || combinations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
            <Calculator size={12} className="text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">Combinaisons possibles:</h4>
        </div>
        <span className="text-xs text-gray-500">{combinations.length} options</span>
      </div>
      
      <div className="space-y-2">
        {combinations.map((combo, index) => (
          <CombinationCard 
            key={combo.key} 
            combo={combo} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
});

ChangeCombinations.displayName = 'ChangeCombinations';

export default ChangeCombinations;