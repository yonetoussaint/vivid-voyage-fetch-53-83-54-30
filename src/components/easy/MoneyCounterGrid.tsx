import React, { useState } from 'react';
import { Unlock, ChevronDown, Plus, Check } from 'lucide-react';

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
  const [added, setAdded] = useState(false);

  const selectedDenom = presets.find(p => p.value === selectedPreset);

  const handleAddClick = () => {
    if (!value || parseFloat(value) <= 0 || isLocked) return;

    onAdd(selectedPreset, value);

    // success feedback
    setAdded(true);

    // auto clear input
    onInputChange(selectedPreset, '');

    // reset button after animation
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-3 w-full">

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

      {/* Input with animated ADD */}
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
            focus:outline-none pr-24 transition
            ${
              isLocked
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            }`}
        />

        {/* Unlock */}
        {isLocked && (
          <button
            onClick={onUnlock}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
          >
            <Unlock size={16} />
          </button>
        )}

        {/* ADD / ADDED button */}
        <button
          onClick={handleAddClick}
          disabled={!value || parseFloat(value) <= 0 || isLocked}
          className={`absolute right-2 top-1/2 -translate-y-1/2
            h-7 px-3 rounded-md text-xs font-bold flex items-center gap-1
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              added
                ? 'bg-green-600 text-white scale-105'
                : currency === 'HTG'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
        >
          {added ? (
            <>
              <Check size={12} />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus size={12} />
              <span>Add</span>
            </>
          )}
        </button>
      </div>

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
  );
};

export default MoneyCounterGrid;