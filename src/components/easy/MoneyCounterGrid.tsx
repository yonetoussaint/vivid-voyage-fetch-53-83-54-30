import React, { useState } from 'react';
import { Unlock, ChevronDown, Plus } from 'lucide-react';

/* =========================
   PresetInput
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
    <div className="grid grid-cols-[1fr_1fr_auto] gap-3 w-full">

      {/* Preset Dropdown */}
      <div className="relative">
        <button
          type="button"
          disabled={isLocked}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full h-11 flex items-center justify-between px-3 rounded-lg border text-sm font-medium
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
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
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
      <div className="relative">
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
          className={`w-full h-11 text-center text-sm font-bold rounded-lg border
            focus:outline-none
            ${
              isLocked
                ? 'bg-green-50 border-green-300 text-green-700 pr-10'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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

      {/* Add Button - Icon Only */}
      <button
        onClick={() => onAdd(selectedPreset, value)}
        disabled={!value || parseFloat(value) <= 0 || isLocked}
        className={`h-11 w-11 rounded-lg text-white flex items-center justify-center
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            currency === 'HTG'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:brightness-110'
          }`}
        title="Add"
      >
        <Plus size={16} />
      </button>

    </div>
  );
};

/* =========================
   MoneyCounterGrid
   ========================= */
const MoneyCounterGrid = ({ 
  currency,
  denominations,
  gridInputs,
  lockedInputs,
  onGridInputChange,
  onGridInputFocus,
  onGridInputBlur,
  onGridInputKeyPress,
  onUnlockField,
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
      {/* Only Input Row */}
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