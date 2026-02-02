import React, { useState } from 'react';
import { RotateCcw, Unlock, ChevronDown } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const PresetInput = ({ 
  currency,
  presets,
  selectedPreset,
  value,
  isLocked,
  totalForDenom,
  onPresetChange,
  onInputChange,
  onFocus,
  onBlur,
  onKeyPress,
  onUnlock
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedDenom = presets.find(p => p.value === selectedPreset);

  return (
    <div 
      className={`bg-white rounded-lg p-4 border ${isLocked ? 'border-green-500 shadow-sm' : 'border-gray-300'}`}
    >
      <div className="flex flex-col md:flex-row items-stretch gap-3">
        {/* Preset Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 h-full"
            disabled={isLocked}
          >
            {selectedDenom && (
              <div className={`${selectedDenom.color} px-3 py-2 rounded-md flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{selectedDenom.value}</span>
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{currency}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      onPresetChange(preset.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className={`${preset.color} px-3 py-2 rounded-md flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{preset.value}</span>
                    </div>
                    <span className="text-sm text-gray-700">{currency} {preset.value}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Input and unlock button container */}
        <div className="flex-1 flex items-stretch gap-2">
          {/* Input field */}
          <div className="flex-1 relative">
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => onInputChange(selectedPreset, e.target.value)}
              onFocus={() => onFocus(selectedPreset)}
              onBlur={() => onBlur(selectedPreset)}
              onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
              className={`w-full h-full text-base font-bold rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 text-center ${
                isLocked 
                  ? 'text-green-700 bg-green-50 border-green-200' 
                  : 'text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="0"
              disabled={isLocked || !selectedPreset}
            />
            
            {/* Total display below input */}
            <div className="text-sm font-semibold text-gray-700 text-center mt-2 absolute left-0 right-0">
              {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
            </div>
          </div>

          {/* Unlock button */}
          {isLocked && (
            <button
              onClick={onUnlock}
              className="flex-shrink-0 px-4 bg-gray-50 border border-gray-300 text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50 rounded-lg transition-colors"
              title="Déverrouiller"
            >
              <Unlock size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [selectedPreset, setSelectedPreset] = useState(denominations[0]?.value);

  const sortedDenominations = [...denominations].sort((a, b) => b.value - a.value);
  const presets = sortedDenominations;

  const handlePresetChange = (presetValue) => {
    setSelectedPreset(presetValue);
  };

  const currentValue = selectedPreset ? gridInputs[selectedPreset] || '' : '';
  const currentTotal = currentValue && parseFloat(currentValue) > 0 && selectedPreset 
    ? selectedPreset * parseFloat(currentValue) 
    : 0;

  return (
    <>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-gray-600">Total compteur</div>
          <div className={`text-2xl font-bold ${currency === 'HTG' ? 'text-blue-700' : 'text-green-700'}`}>
            {formaterArgent(gridTotal)} {currency}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onResetGrid}
            className="px-4 py-2.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2"
            title="Réinitialiser"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={onAddAllGridSequences}
            disabled={gridTotal === 0}
            className={`px-5 py-2.5 text-sm text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
              currency === 'HTG' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}
          >
            Tout ajouter
          </button>
        </div>
      </div>

      {/* Single Input with Dropdown */}
      <div className="max-w-3xl mx-auto">
        <PresetInput
          currency={currency}
          presets={presets}
          selectedPreset={selectedPreset}
          value={currentValue}
          isLocked={selectedPreset ? lockedInputs[selectedPreset] : false}
          totalForDenom={currentTotal}
          onPresetChange={handlePresetChange}
          onInputChange={onGridInputChange}
          onFocus={onGridInputFocus}
          onBlur={onGridInputBlur}
          onKeyPress={onGridInputKeyPress}
          onUnlock={() => selectedPreset && onUnlockField(selectedPreset)}
        />

        {/* Display all entered values */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Valeurs saisies:</h3>
          <div className="space-y-2">
            {Object.entries(gridInputs)
              .filter(([_, value]) => value && parseFloat(value) > 0)
              .map(([denomValue, value]) => {
                const denom = denominations.find(d => d.value === parseFloat(denomValue));
                if (!denom) return null;

                return (
                  <div key={denomValue} className="flex items-center justify-between text-sm bg-white p-3 rounded-md border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`${denom.color} px-3 py-2 rounded-md`}>
                        <span className="text-white font-bold text-sm">{denom.value}</span>
                      </div>
                      <span className="text-gray-600">{currency}</span>
                      <span className="text-gray-800 font-medium">× {value}</span>
                    </div>
                    <span className="font-bold text-gray-800">
                      = {formaterArgent(denom.value * parseFloat(value))}
                    </span>
                  </div>
                );
              })}

            {Object.keys(gridInputs).filter(k => gridInputs[k] && parseFloat(gridInputs[k]) > 0).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4 bg-white rounded-md border border-gray-200">
                Aucune valeur saisie
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoneyCounterGrid;