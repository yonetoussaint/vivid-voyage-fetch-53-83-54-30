import React from 'react';
import { RotateCcw, Unlock } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DenominationInput = ({ 
  denom, 
  currency,
  value, 
  isLocked, 
  totalForDenom,
  onInputChange,
  onFocus,
  onBlur,
  onKeyPress,
  onUnlock 
}) => (
  <div 
    className={`bg-white rounded-lg p-3 border ${isLocked ? 'border-green-500 shadow-sm' : 'border-gray-300'}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={`${denom.color} px-2 py-1 rounded-md flex items-center justify-center`}>
          <span className="text-white font-bold text-xs">{denom.value}</span>
        </div>
        <span className="text-xs text-gray-600 font-medium">{currency}</span>
      </div>
      <div className="flex items-center gap-1">
        {isLocked && (
          <button
            onClick={onUnlock}
            className="text-gray-500 hover:text-green-600"
            title="Déverrouiller"
          >
            <Unlock size={14} />
          </button>
        )}
      </div>
    </div>

    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onInputChange(denom.value, e.target.value)}
      onFocus={() => onFocus(denom.value)}
      onBlur={() => onBlur(denom.value)}
      onKeyPress={(e) => onKeyPress(denom.value, value, e)}
      className={`w-full text-sm font-bold rounded px-3 py-2 border focus:outline-none focus:ring-2 text-center ${
        isLocked 
          ? 'text-green-700 bg-green-50 border-green-200' 
          : 'text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200'
      }`}
      placeholder="0"
      disabled={isLocked}
    />

    <div className="text-sm font-bold text-gray-700 text-center mt-2">
      {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
    </div>
  </div>
);

const MoneyCounterGrid = ({ 
  gridTotal,
  currency,
  denominations,
  gridInputs,
  lockedInputs,
  onGridInputChange,
  onGridInputFocus,
  onGridInputBlur,
  onGridInputKeyPress,
  onUnlockField,
  onResetGrid,
  onAddAllGridSequences 
}) => {
  const sortedDenominations = [...denominations].sort((a, b) => b.value - a.value);
  
  const firstColumnDenoms = [];
  const secondColumnDenoms = [];
  sortedDenominations.forEach((denom, index) => {
    if (index % 2 === 0) {
      firstColumnDenoms.push(denom);
    } else {
      secondColumnDenoms.push(denom);
    }
  });

  return (
    <>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-gray-600">Total compteur</div>
          <div className={`text-xl font-bold ${currency === 'HTG' ? 'text-blue-700' : 'text-green-700'}`}>
            {formaterArgent(gridTotal)} {currency}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onResetGrid}
            className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={onAddAllGridSequences}
            disabled={gridTotal === 0}
            className={`px-3 py-1.5 text-sm text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
              currency === 'HTG' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}
          >
            Tout ajouter
          </button>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* First Column */}
        <div className="space-y-3">
          {firstColumnDenoms.map((denom) => {
            const value = gridInputs[denom.value] || '';
            const isLocked = lockedInputs[denom.value];
            const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;

            return (
              <DenominationInput
                key={`grid-${denom.value}`}
                denom={denom}
                currency={currency}
                value={value}
                isLocked={isLocked}
                totalForDenom={totalForDenom}
                onInputChange={onGridInputChange}
                onFocus={onGridInputFocus}
                onBlur={onGridInputBlur}
                onKeyPress={onGridInputKeyPress}
                onUnlock={() => onUnlockField(denom.value)}
              />
            );
          })}
        </div>

        {/* Second Column */}
        <div className="space-y-3">
          {secondColumnDenoms.map((denom) => {
            const value = gridInputs[denom.value] || '';
            const isLocked = lockedInputs[denom.value];
            const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;

            return (
              <DenominationInput
                key={`grid-${denom.value}`}
                denom={denom}
                currency={currency}
                value={value}
                isLocked={isLocked}
                totalForDenom={totalForDenom}
                onInputChange={onGridInputChange}
                onFocus={onGridInputFocus}
                onBlur={onGridInputBlur}
                onKeyPress={onGridInputKeyPress}
                onUnlock={() => onUnlockField(denom.value)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MoneyCounterGrid;