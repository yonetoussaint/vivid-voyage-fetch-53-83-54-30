import React, { useState } from 'react';
import { RotateCcw, Unlock, ChevronDown, Plus } from 'lucide-react';
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
  onUnlock,
  onAdd // New prop for add button
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedDenom = presets.find(p => p.value === selectedPreset);

  return (
    <div 
      className={`bg-white rounded-lg p-3 border ${isLocked ? 'border-green-500 shadow-sm' : 'border-gray-300'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 w-full">
          {/* Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
              disabled={isLocked}
            >
              {selectedDenom && (
                <div className={`${selectedDenom.color} px-2 py-1 rounded-md flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">{selectedDenom.value}</span>
                </div>
              )}
              <span className="text-xs text-gray-600 font-medium">{currency}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        onPresetChange(preset.value);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <div className={`${preset.color} px-2 py-1 rounded-md flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{preset.value}</span>
                      </div>
                      <span className="text-sm text-gray-700">{currency} {preset.value}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Input Field with Lock Icon Inside */}
          <div className="flex-1 relative">
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => onInputChange(selectedPreset, e.target.value)}
              onFocus={() => onFocus(selectedPreset)}
              onBlur={() => onBlur(selectedPreset)}
              onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
              className={`w-full text-sm font-bold rounded px-3 py-2 border focus:outline-none focus:ring-2 text-center ${
                isLocked 
                  ? 'text-green-700 bg-green-50 border-green-200 pr-8' 
                  : 'text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="0"
              disabled={isLocked || !selectedPreset}
            />
            
            {/* Lock Icon Inside Input Field */}
            {isLocked && (
              <button
                onClick={onUnlock}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
                title="Déverrouiller"
              >
                <Unlock size={14} />
              </button>
            )}
          </div>

          {/* Add Button - Third Element */}
          <button
            onClick={() => onAdd(selectedPreset, value)}
            disabled={!value || parseFloat(value) <= 0 || isLocked}
            className={`px-3 py-1.5 text-sm text-white rounded-md font-medium flex items-center gap-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
              currency === 'HTG' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}
            title="Ajouter au total"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      <div className="text-sm font-bold text-gray-700 text-center mt-2">
        {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
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
  onAddAllGridSequences,
  onAddSingleValue // New prop for adding single value
}) => {
  const [selectedPreset, setSelectedPreset] = useState(denominations[0]?.value);

  const sortedDenominations = [...denominations].sort((a, b) => b.value - a.value);
  const presets = sortedDenominations;

  const handlePresetChange = (presetValue) => {
    setSelectedPreset(presetValue);
  };

  const handleAdd = (preset, value) => {
    if (onAddSingleValue && preset && value && parseFloat(value) > 0) {
      onAddSingleValue(preset, value);
    }
  };

  const currentValue = selectedPreset ? gridInputs[selectedPreset] || '' : '';
  const currentTotal = currentValue && parseFloat(currentValue) > 0 && selectedPreset 
    ? selectedPreset * parseFloat(currentValue) 
    : 0;

  return (
    <>
      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <div className="text-sm font-medium text-gray-600">Total compteur</div>
          <div className={`text-xl font-bold ${currency === 'HTG' ? 'text-blue-700' : 'text-green-700'}`}>
            {formaterArgent(gridTotal)} {currency}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onResetGrid}
            className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
            <span className="hidden xs:inline">Reset</span>
          </button>
          <button
            onClick={onAddAllGridSequences}
            disabled={gridTotal === 0}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-sm text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
              currency === 'HTG' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}
          >
            Tout ajouter
          </button>
        </div>
      </div>

      {/* Single Input with Dropdown and Add Button */}
      <div className="w-full max-w-lg mx-auto">
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
          onAdd={handleAdd}
        />

        {/* Display all entered values */}
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Valeurs saisies:</h3>
          <div className="space-y-1">
            {Object.entries(gridInputs)
              .filter(([_, value]) => value && parseFloat(value) > 0)
              .map(([denomValue, value]) => {
                const denom = denominations.find(d => d.value === parseFloat(denomValue));
                if (!denom) return null;

                return (
                  <div key={denomValue} className="flex items-center justify-between text-sm py-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`${denom.color} px-2 py-1 rounded-md flex-shrink-0`}>
                        <span className="text-white font-bold text-xs">{denom.value}</span>
                      </div>
                      <div className="text-gray-600">
                        {currency} × {value}
                      </div>
                    </div>
                    <span className="font-bold text-gray-700">
                      = {formaterArgent(denom.value * parseFloat(value))}
                    </span>
                  </div>
                );
              })}

            {Object.keys(gridInputs).filter(k => gridInputs[k] && parseFloat(gridInputs[k]) > 0).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-3">
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