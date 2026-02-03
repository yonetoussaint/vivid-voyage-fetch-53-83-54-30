import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Plus, Check, Undo2 } from 'lucide-react';

/* =========================
   Helper Functions
   ========================= */
const formatInput = (value) => {
  if (!value) return '';
  
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};

const parseValue = (val) => {
  if (!val || val.trim() === '') return 0;
  const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const getInputMode = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') return 'decimal';
  return parseInt(value) === parseFloat(value) ? 'numeric' : 'decimal';
};

/* =========================
   PresetInput Component
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
  const [isFocused, setIsFocused] = useState(false);
  
  // multi-step undo stack: { presetValue: [previousValues] }
  const [undoStacks, setUndoStacks] = useState({});
  
  const resetTimer = useRef(null);
  const dropdownRef = useRef(null);
  
  const selectedDenomIndex = presets.findIndex(p => p.value === selectedPreset);
  const selectedDenom = presets[selectedDenomIndex];
  const parsedValue = parseValue(value);

  /* =========================
     Dropdown Outside Click Handler
     ========================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* =========================
     Keyboard Navigation
     ========================= */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
    
    if (isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const currentIndex = presets.findIndex(p => p.value === selectedPreset);
      let newIndex;
      
      if (e.key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % presets.length;
      } else {
        newIndex = currentIndex - 1 < 0 ? presets.length - 1 : currentIndex - 1;
      }
      
      onPresetChange(presets[newIndex].value);
    }
  }, [isDropdownOpen, selectedPreset, presets, onPresetChange]);

  /* =========================
     Add Button Handler
     ========================= */
  const handleAddClick = useCallback(() => {
    if (!value || parsedValue <= 0) return;

    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    onAdd(selectedPreset, value);
    setAdded(true);

    // Auto clear input
    onInputChange(selectedPreset, '');

    // Clear undo stack for this preset when added
    setUndoStacks(prev => ({ ...prev, [selectedPreset]: [] }));

    // Auto advance to next denomination
    const nextPreset = presets[selectedDenomIndex + 1];
    if (nextPreset) {
      onPresetChange(nextPreset.value);
    }

    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAdded(false);
    }, 2500);
  }, [value, parsedValue, selectedPreset, presets, selectedDenomIndex, onAdd, onInputChange, onPresetChange]);

  /* =========================
     Multi-step Undo Handler
     ========================= */
  const handleUndo = useCallback(() => {
    if (!selectedPreset || !undoStacks[selectedPreset] || undoStacks[selectedPreset].length === 0) return;

    const stack = [...undoStacks[selectedPreset]];
    const lastValue = stack.pop();

    setUndoStacks(prev => ({
      ...prev,
      [selectedPreset]: stack
    }));

    onInputChange(selectedPreset, lastValue);
  }, [selectedPreset, undoStacks, onInputChange]);

  /* =========================
     Clear Input Handler
     ========================= */
  const handleClearAll = useCallback(() => {
    if (!selectedPreset) return;
    
    // Store current value before clearing
    if (value) {
      setUndoStacks(prev => ({
        ...prev,
        [selectedPreset]: [...(prev[selectedPreset] || []), value].slice(-5)
      }));
    }
    
    onInputChange(selectedPreset, '');
  }, [selectedPreset, value, onInputChange]);

  /* =========================
     Input Change Handler
     ========================= */
  const handleInputChange = useCallback((newValue) => {
    if (!selectedPreset) return;
    
    const formattedValue = formatInput(newValue);
    
    setUndoStacks(prev => {
      const stack = prev[selectedPreset] || [];
      const newStack = [...stack, value].slice(-5); // Limit to last 5 values
      return {
        ...prev,
        [selectedPreset]: newStack
      };
    });

    onInputChange(selectedPreset, formattedValue);
  }, [selectedPreset, value, onInputChange]);

  /* =========================
     Focus/Blur Handlers
     ========================= */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus(selectedPreset);
  }, [selectedPreset, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur(selectedPreset);
  }, [selectedPreset, onBlur]);

  /* =========================
     Render
     ========================= */
  return (
    <div 
      className="relative w-full"
      onKeyDown={handleKeyDown}
      ref={dropdownRef}
    >
      {/* FULL WIDTH INPUT */}
      <input
        type="text"
        inputMode={getInputMode(selectedPreset)}
        pattern={parseInt(selectedPreset) === parseFloat(selectedPreset) ? "[0-9]*" : "[0-9.,]*"}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
        placeholder="0"
        disabled={!selectedPreset}
        className={`w-full h-12 rounded-xl border text-center text-sm font-bold
          focus:outline-none bg-white border-gray-300 text-gray-900 
          ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'focus:border-blue-500'}
          pl-28 pr-28 transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
        aria-label={`Enter amount for ${selectedPreset || 'selected'} denomination`}
      />

      {/* LEFT: PRESET DROPDOWN */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Select denomination"
        aria-expanded={isDropdownOpen}
        aria-haspopup="listbox"
        className="absolute left-2 top-1/2 -translate-y-1/2
          h-8 px-2 rounded-lg flex items-center gap-1 text-xs font-bold
          bg-gray-100 hover:bg-gray-200 text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors"
      >
        {selectedDenom && (
          <div className={`${selectedDenom.color} px-2 py-0.5 rounded-md`}>
            <span className="text-white text-xs font-bold">
              {selectedDenom.value}
            </span>
          </div>
        )}
        <ChevronDown size={12} className="transition-transform duration-200" 
          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* DROPDOWN LIST */}
      {isDropdownOpen && (
        <div 
          className="absolute z-20 mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          role="listbox"
          aria-label="Denomination options"
        >
          {presets.map((preset) => (
            <button
              key={preset.value}
              role="option"
              aria-selected={preset.value === selectedPreset}
              onClick={() => {
                onPresetChange(preset.value);
                setIsDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50
                ${preset.value === selectedPreset ? 'bg-blue-50' : ''}
                focus:outline-none focus:bg-blue-50`}
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
      )}

      {/* ACTION BUTTONS CONTAINER */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* CLEAR BUTTON */}
        {selectedPreset && value && (
          <button
            onClick={handleClearAll}
            className="h-8 px-2 rounded-lg text-xs font-bold flex items-center gap-1
              bg-red-100 hover:bg-red-200 text-red-800
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              transition-colors"
            aria-label="Clear input"
            title="Clear input"
          >
            × <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* UNDO BUTTON */}
        {selectedPreset && undoStacks[selectedPreset]?.length > 0 && (
          <button
            onClick={handleUndo}
            className="h-8 px-2 rounded-lg text-xs font-bold flex items-center gap-1
              bg-yellow-100 hover:bg-yellow-200 text-yellow-800
              focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
              transition-colors"
            title={`Undo last input (${undoStacks[selectedPreset].length} available)`}
            aria-label={`Undo last input, ${undoStacks[selectedPreset].length} actions available`}
          >
            <Undo2 size={12} />
            <span className="hidden sm:inline">Undo</span>
          </button>
        )}

        {/* ADD BUTTON */}
        <button
          onClick={handleAddClick}
          disabled={!value || parsedValue <= 0}
          className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              added
                ? 'bg-green-600 text-white scale-105 focus:ring-green-500'
                : currency === 'HTG'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }`}
          aria-label={added ? "Amount added successfully" : "Add amount to total"}
          title={added ? "Added!" : "Add to total"}
        >
          {added ? <Check size={12} /> : <Plus size={12} />}
          <span>{added ? 'Added' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

/* =========================
   MoneyCounterGrid Component
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
  
  // Memoize sorted presets
  const presets = useMemo(() => 
    [...denominations].sort((a, b) => b.value - a.value)
  , [denominations]);

  // Memoize handlers
  const handleAdd = useCallback((preset, value) => {
    if (preset && value && parseValue(value) > 0) {
      onAddSingleSequence(preset, value);
    }
  }, [onAddSingleSequence]);

  const handlePresetChange = useCallback((preset) => {
    setSelectedPreset(preset);
  }, []);

  const currentValue = selectedPreset ? gridInputs[selectedPreset] || '' : '';

  return (
    <PresetInput
      currency={currency}
      presets={presets}
      selectedPreset={selectedPreset}
      value={currentValue}
      onPresetChange={handlePresetChange}
      onInputChange={onGridInputChange}
      onFocus={onGridInputFocus}
      onBlur={onGridInputBlur}
      onKeyPress={onGridInputKeyPress}
      onAdd={handleAdd}
    />
  );
};

export default MoneyCounterGrid;