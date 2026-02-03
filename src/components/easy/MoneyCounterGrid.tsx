import React, { useState, useRef } from 'react';
import { Unlock, ChevronDown, Plus, Check, Undo2 } from 'lucide-react';

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
  const [lastValue, setLastValue] = useState(null); // store previous input value
  const resetTimer = useRef(null);

  const selectedDenomIndex = presets.findIndex(p => p.value === selectedPreset);
  const selectedDenom = presets[selectedDenomIndex];

  /* =========================
     Add button
     ========================= */
  const handleAddClick = () => {
    if (!value || parseFloat(value) <= 0 || isLocked) return;

    onAdd(selectedPreset, value);
    setAdded(true);

    // Auto clear input
    onInputChange(selectedPreset, '');
    setLastValue(null); // reset undo after add

    // Auto advance to next denomination
    const nextPreset = presets[selectedDenomIndex + 1];
    if (nextPreset) {
      onPresetChange(nextPreset.value);
    }

    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  /* =========================
     Undo button (reverts last typed input)
     ========================= */
  const handleUndo = () => {
    if (lastValue === null) return;

    onInputChange(selectedPreset, lastValue);
    setLastValue(null);
  };

  return (
    <div className="relative w-full">

      {/* FULL WIDTH INPUT */}
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          setLastValue(value); // store previous input for undo
          onInputChange(selectedPreset, e.target.value);
        }}
        onFocus={() => onFocus(selectedPreset)}
        onBlur={() => onBlur(selectedPreset)}
        onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
        placeholder="0"
        disabled={isLocked || !selectedPreset}
        className={`w-full h-12 rounded-xl border text-center text-sm font-bold
          focus:outline-none
          pl-28 pr-36 transition
          ${
            isLocked
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
          }`}
      />

      {/* LEFT: PRESET DROPDOWN */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`absolute left-2 top-1/2 -translate-y-1/2
          h-8 px-2 rounded-lg flex items-center gap-1 text-xs font-bold
          ${
            isLocked
              ? 'bg-green-200 text-green-800'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
      >
        {selectedDenom && (
          <div className={`${selectedDenom.color} px-2 py-0.5 rounded-md`}>
            <span className="text-white text-xs font-bold">
              {selectedDenom.value}
            </span>
          </div>
        )}
        <ChevronDown size={12} />
      </button>

      {/* DROPDOWN LIST */}
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute z-20 mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
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

      {/* RIGHT: ADD BUTTON */}
      <button
        onClick={handleAddClick}
        disabled={!value || parseFloat(value) <= 0 || isLocked}
        className={`absolute right-2 top-1/2 -translate-y-1/2
          h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1
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
        {added ? <Check size={12} /> : <Plus size={12} />}
        <span>{added ? 'Added' : 'Add'}</span>
      </button>

      {/* UNDO */}
      {lastValue !== null && value !== lastValue && (
        <button
          onClick={handleUndo}
          className="absolute right-24 top-1/2 -translate-y-1/2
            h-8 px-2 rounded-lg text-xs font-bold flex items-center gap-1
            bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
        >
          <Undo2 size={12} />
          Undo
        </button>
      )}

      {/* UNLOCK */}
      {isLocked && (
        <button
          onClick={onUnlock}
          className="absolute right-36 top-1/2 -translate-y-1/2 text-green-600"
        >
          <Unlock size={16} />
        </button>
      )}
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