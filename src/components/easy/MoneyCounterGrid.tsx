import { useState } from "react";
import { ChevronDown, Plus, Lock } from "lucide-react";

export default function PresetInput({
  presets = [],
  currency = "HTG",
  onAdd
}) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [value, setValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-2 w-full">

      {/* Preset Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLocked}
          className={`w-full h-8 px-2 rounded-md border text-xs font-medium
            flex items-center justify-between
            ${
              isLocked
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
        >
          <span className="truncate">
            {selectedPreset?.label || currency}
          </span>
          <ChevronDown size={12} />
        </button>

        {isDropdownOpen && !isLocked && (
          <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setSelectedPreset(preset);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-2 py-1 text-xs text-left hover:bg-gray-100"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amount Input */}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          disabled={isLocked || !selectedPreset}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full h-8 text-center text-xs font-semibold rounded-md border
            ${
              isLocked
                ? "bg-green-50 border-green-300 text-green-700 pr-7"
                : "bg-white border-gray-300"
            }`}
        />

        {isLocked && (
          <Lock
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600"
          />
        )}
      </div>

      {/* Icon-Only Add Button */}
      <button
        disabled={!value || isLocked}
        onClick={() => {
          onAdd?.({
            preset: selectedPreset,
            amount: Number(value)
          });
          setValue("");
          setIsLocked(true);
        }}
        className={`w-full h-8 rounded-md flex items-center justify-center
          disabled:opacity-40
          ${
            currency === "HTG"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
      >
        <Plus size={14} className="text-white" />
      </button>

    </div>
  );
}