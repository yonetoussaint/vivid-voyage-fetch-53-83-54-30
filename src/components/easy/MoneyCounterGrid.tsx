import React, { useState, useRef, useEffect } from 'react';
import { Unlock, ChevronDown, Plus, Check, Undo2 } from 'lucide-react';

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
  const [lastAdd, setLastAdd] = useState(null);
  const [flashPreset, setFlashPreset] = useState(false);

  const inputRef = useRef(null);

  const currentIndex = presets.findIndex(p => p.value === selectedPreset);
  const selectedDenom = presets[currentIndex];

  const handleAddClick = () => {
    if (!value || parseFloat(value) <= 0 || isLocked) return;

    // Save undo info
    setLastAdd({
      preset: selectedPreset,
      value
    });

    onAdd(selectedPreset, value);
    setAdded(true);
    onInputChange(selectedPreset, '');

    // 🔁 AUTO-ADVANCE (VISIBLE)
    const next = presets[currentIndex + 1];
    if (next) {
      onPresetChange(next.value);
      setFlashPreset(true);
      setTimeout(() => setFlashPreset(false), 400);
    }

    // Refocus input
    setTimeout(() => inputRef.current?.focus(), 50);

    setTimeout(() => setAdded(false), 800);
  };

  const handleUndo = () => {
    if (!lastAdd) return;

    onPresetChange(lastAdd.preset);
    onInputChange(lastAdd.preset, lastAdd.value);
    setLastAdd(null);

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Auto-hide undo after 5s
  useEffect(() => {
    if (!lastAdd) return;
    const t = setTimeout(() => setLastAdd(null), 5000);
    return () => clearTimeout(t);
  }, [lastAdd]);

  return (
    <div className="relative w-full space-y-2">

      {/* INPUT */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onInputChange(selectedPreset, e.target.value)}
          onFocus={() => onFocus(selectedPreset)}
          onBlur={() => onBlur(selectedPreset)}
          onKeyPress={(e) => onKeyPress(selectedPreset, value, e)}
          placeholder="0"
          disabled={isLocked || !selectedPreset}
          className="w-full h-12 rounded-xl border text-center text-sm font-bold
            pl-28 pr-32 focus:outline-none
            border-gray-300 focus:border-blue-500"
        />

        {/* PRESET (FLASHES ON AUTO-ADVANCE) */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`absolute left-2 top-1/2 -translate-y-1/2
            h-8 px-2 rounded-lg flex items-center gap-1 text-xs font-bold
            transition
            ${flashPreset ? 'ring-2 ring-blue-400' : 'bg-gray-100'}
          `}
        >
          <div className={`${selectedDenom.color} px-2 py-0.5 rounded-md`}>
            <span className="text-white text-xs font-bold">
              {selectedDenom.value}
            </span>
          </div>
          <ChevronDown size={12} />
        </button>

        {/* ADD */}
        <button
          onClick={handleAddClick}
          disabled={!value || isLocked}
          className={`absolute right-2 top-1/2 -translate-y-1/2
            h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1
            ${added ? 'bg-green-600' : 'bg-blue-600'}
            text-white`}
        >
          {added ? <Check size={12} /> : <Plus size={12} />}
          {added ? 'Added' : 'Add'}
        </button>
      </div>

      {/* 🔙 UNDO — CLEAR & OBVIOUS */}
      {lastAdd && (
        <div className="flex justify-center">
          <button
            onClick={handleUndo}
            className="flex items-center gap-2 px-3 py-1.5
              rounded-full text-xs font-semibold
              bg-yellow-100 text-yellow-900 hover:bg-yellow-200"
          >
            <Undo2 size={12} />
            Undo {lastAdd.value} × {lastAdd.preset}
          </button>
        </div>
      )}
    </div>
  );
};

export default PresetInput;