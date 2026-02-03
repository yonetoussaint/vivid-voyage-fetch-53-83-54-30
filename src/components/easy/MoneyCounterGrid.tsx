import React, { useState } from 'react';
import { RotateCcw, Unlock, ChevronDown, Plus } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

/* =========================
   PresetInput (Improved UI)
   ========================= */
const PresetInput = ({ 
  currency,
  presets,
  selectedPreset,
  value,
  isLocked,
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
    <div className="flex items-center gap-3 w-full">

      {/* Preset Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLocked}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
            transition-all
            ${
              isLocked
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {selectedDenom && (
            <div className={`${selectedDenom.color} px-2 py-1 rounded-md`}>
              <span className="text-white text-xs font-bold">
                {selectedDenom.value}
              </span>
            </div>
          )}
          <span className="text-gray-600">{currency}</span>
          <ChevronDown size={14} />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute z-20 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    onPresetChange(preset.value);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50"
                >
                  <div className={`${preset.color} px-2 py-1 rounded-md`}>
                    <span className="text-white text-xs font-bold">
                      {preset.value}
                    </span>
                  </div>
                  <span className="text-gray-700">
                    {currency} {preset.value}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Input */}
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onInputChange(selectedPreset, e.target.value)}
          onFocus={() => onFocus(selectedPreset)}
          onBlur={() => onBlur(selectedPreset)}
          onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
          placeholder="0"
          disabled={isLocked || !selectedPreset}
          className={`w-full px-4 py-2 text-center text-sm font-bold rounded-lg border
            focus:outline-none focus:ring-2 transition-all
            ${
              isLocked
                ? 'bg-green-50 border-green-300 text-green-700 pr-10'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-200'
            }`}
        />

        {isLocked && (
          <button
            onClick={onUnlock}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
            title="Déverrouiller"
          >
            <Unlock size={16} />
          </button>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => onAdd(selectedPreset, value)}
        disabled={!value || parseFloat(value) <= 0 || isLocked}
        className={`px-5 py-2 rounded-lg text-sm font-semibold text-white
          flex items-center gap-1 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            currency === 'HTG'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:brightness-110'
          }`}
      >
        <Plus size={16} />
        Add
      </button>
    </div>
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
    if (preset && value && parseFloat(value) > 0) {
      onAddSingleSequence(preset, value);
    }
  };

  const currentValue = selectedPreset ? gridInputs[selectedPreset] || '' : '';

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
        <div>
          <div className="text-sm text-gray-500">Total compteur</div>
          <div className={`text-2xl font-bold ${
            currency === 'HTG' ? 'text-blue-700' : 'text-green-700'
          }`}>
            {formaterArgent(gridTotal)} {currency}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onResetGrid}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 flex items-center gap-2 text-sm"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={onAddAllGridSequences}
            disabled={gridTotal === 0}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white
              disabled:opacity-50
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

      {/* Input Row */}
      <PresetInput
        currency={currency}
        presets={presets}
        selectedPreset={selectedPreset}
        value={currentValue}
        isLocked={selectedPreset ? lockedInputs[selectedPreset] : false}
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