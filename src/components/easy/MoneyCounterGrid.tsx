import React, { useState, useRef } from 'react';
import { ChevronDown, Plus, Check, Undo2 } from 'lucide-react';

/* =========================
   PresetInput
   ========================= */
const PresetInput = ({
  currency,
  presets,
  selectedPreset,
  value,
  onPresetChange,
  onInputChange,
  onFocus,
  onBlur,
  onKeyPress,
  onAdd
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // multi-step undo stack: { presetValue: [previousValues] }
  const [undoStacks, setUndoStacks] = useState({});

  const resetTimer = useRef(null);

  const selectedDenomIndex = presets.findIndex(p => p.value === selectedPreset);
  const selectedDenom = presets[selectedDenomIndex];

  /* =========================
     Handle preset change
     ========================= */
  const handlePresetChange = (presetValue) => {
    // Initialize undo stack for new preset if it doesn't exist
    setUndoStacks(prev => ({ ...prev, [presetValue]: prev[presetValue] || [] }));
    onPresetChange(presetValue);
  };

  /* =========================
     Add button
     ========================= */
  const handleAddClick = () => {
    if (!value || parseFloat(value) <= 0) return;

    onAdd(selectedPreset, value);
    setAdded(true);

    // Auto clear input
    onInputChange(selectedPreset, '');

    // Clear undo stack for this preset when added
    setUndoStacks(prev => ({ ...prev, [selectedPreset]: [] }));

    // Auto advance to next denomination
    const nextPreset = presets[selectedDenomIndex + 1];
    if (nextPreset) {
      handlePresetChange(nextPreset.value);
    }

    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  /* =========================
     Multi-step Undo
     ========================= */
  const handleUndo = () => {
    if (!selectedPreset || !undoStacks[selectedPreset] || undoStacks[selectedPreset].length === 0) return;

    const stack = [...undoStacks[selectedPreset]];
    const lastValue = stack.pop();

    setUndoStacks(prev => ({
      ...prev,
      [selectedPreset]: stack
    }));

    onInputChange(selectedPreset, lastValue);
  };

  /* =========================
     On input change: push previous value to undo stack
     ========================= */
  const handleInputChange = (newValue) => {
    if (!selectedPreset) return;

    setUndoStacks(prev => {
      const stack = prev[selectedPreset] || [];
      const last = stack[stack.length - 1];

      // Only push if different from last value
      if (last !== value) {
        return {
          ...prev,
          [selectedPreset]: [...stack, value]
        };
      }
      return prev;
    });

    onInputChange(selectedPreset, newValue);
  };

  return (
    <div className="relative w-full">

      {/* FULL WIDTH INPUT */}
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => onFocus(selectedPreset)}
        onBlur={() => onBlur(selectedPreset)}
        onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
        placeholder="0"
        className="w-full h-12 rounded-xl border text-center text-sm font-bold
          focus:outline-none
          pl-28 pr-36 transition
          bg-white border-gray-300 text-gray-900 focus:border-blue-500"
      />

      {/* LEFT: PRESET DROPDOWN */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="absolute left-2 top-1/2 -translate-y-1/2
          h-8 px-2 rounded-lg flex items-center gap-1 text-xs font-bold
          bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                  handlePresetChange(preset.value);
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
        disabled={!value || parseFloat(value) <= 0}
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

      {/* UNDO: closer to Add button */}
      {selectedPreset && undoStacks[selectedPreset]?.length > 0 && (
        <button
          onClick={handleUndo}
          className="absolute right-16 top-1/2 -translate-y-1/2
            h-8 px-2 rounded-lg text-xs font-bold flex items-center gap-1
            bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
        >
          <Undo2 size={12} />
          Undo
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
  onGridInputChange,
  onGridInputFocus,
  onGridInputBlur,
  onGridInputKeyPress,
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
      onPresetChange={setSelectedPreset}
      onInputChange={onGridInputChange}
      onFocus={onGridInputFocus}
      onBlur={onGridInputBlur}
      onKeyPress={onGridInputKeyPress}
      onAdd={handleAdd}
    />
  );
};

export default MoneyCounterGrid;