import React, { useState } from 'react';
import { RotateCcw, Unlock, ChevronDown, Plus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

/* =========================
   PresetInput (NO WRAPPER)
   ========================= */
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
  onAdd
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedDenom = presets.find(p => p.value === selectedPreset);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 w-full">

          {/* Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
              disabled={isLocked}
            >
              {selectedDenom && (
                <div className={`${selectedDenom.color} px-2 py-1 rounded-md flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">
                    {selectedDenom.value}
                  </span>
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
                        <span className="text-white font-bold text-xs">
                          {preset.value}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {currency} {preset.value}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Input Field */}
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

            {isLocked && (
              <button
                onClick={onUnlock}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                title="Déverrouiller"
              >
                <Unlock size={14} />
              </button>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={() => onAdd(selectedPreset, value)}
            disabled={!value || parseFloat(value) <= 0 || isLocked}
            className={`px-4 py-2 text-sm text-white rounded-md font-medium flex items-center gap-1 min-w-[80px]
              ${
                currency === 'HTG'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                  : 'bg-gradient-to-r from-green-600 to-green-700'
              }`}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-sm font-bold text-gray-700 text-center mt-2">
        {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
      </div>
    </>
  );
};

/* =========================
   MoneyCounterGrid
   ========================= */
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
  onAddSingleSequence
}) => {
  const [selectedPreset, setSelectedPreset] = useState(denominations[0]?.value);

  const presets = [...denominations].sort((a, b) => b.value - a.value);

  const handleAdd = (preset, value) => {
    if (onAddSingleSequence && preset && value && parseFloat(value) > 0) {
      onAddSingleSequence(preset, value);
    }
  };

  const currentValue = selectedPreset ? gridInputs[selectedPreset] || '' : '';
  const currentTotal =
    currentValue && parseFloat(currentValue) > 0 && selectedPreset
      ? selectedPreset * parseFloat(currentValue)
      : 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <div className="text-sm font-medium text-gray-600">Total compteur</div>
          <div
            className={`text-xl font-bold ${
              currency === 'HTG' ? 'text-blue-700' : 'text-green-700'
            }`}
          >
            {formaterArgent(gridTotal)} {currency}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onResetGrid}
            className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={onAddAllGridSequences}
            disabled={gridTotal === 0}
            className={`px-3 py-1.5 text-sm text-white rounded-lg font-medium
              ${
                currency === 'HTG'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                  : 'bg-gradient-to-r from-green-600 to-green-700'
              }`}
          >
            Tout ajouter
          </button>
        </div>
      </div>

      {/* Single Input */}
      <PresetInput
        currency={currency}
        presets={presets}
        selectedPreset={selectedPreset}
        value={currentValue}
        isLocked={selectedPreset ? lockedInputs[selectedPreset] : false}
        totalForDenom={currentTotal}
        onPresetChange={setSelectedPreset}
        onInputChange={onGridInputChange}
        onFocus={onGridInputFocus}
        onBlur={onGridInputBlur}
        onKeyPress={onGridInputKeyPress}
        onUnlock={() => selectedPreset && onUnlockField(selectedPreset)}
        onAdd={handleAdd}
      />
    </>
  );
};

export default MoneyCounterGrid;