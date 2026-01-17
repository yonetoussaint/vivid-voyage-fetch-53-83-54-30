import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X, Plus, ChevronDown, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceManager = ({
  vendeur,
  vendorState,
  sequences,
  sequencesTotal,
  vendorInputs,
  currentPresets,

  // Functions
  handleClearSequences,
  handleRemoveSequence,
  handleUpdateSequence,
  handlePresetSelect,
  handleInputChange,
  handleAddSequence,
  handleAddCompleteDeposit,
  setVendorPresets,

  // Helper functions
  calculatePresetAmount,

  // Configuration
  htgPresets,
  usdPresets
}) => {
  // Local state
  const [editingSequenceId, setEditingSequenceId] = useState(null);
  const [showPresetWheel, setShowPresetWheel] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  // Get current presets based on currency
  const getPresets = () => {
    if (!vendorState) return [];
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  // Get selected preset label
  const getSelectedPresetLabel = () => {
    if (!vendorState) return '';
    const presets = getPresets();
    const preset = presets.find(p => p.value === vendorState.preset);
    return preset ? preset.label : presets[0]?.label || '';
  };

  // Close wheel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown area
      if (!dropdownButtonRef.current?.contains(event.target)) {
        setShowPresetWheel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle editing a sequence
  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);
    
    const note = sequence.note;
    
    // Parse sequence note
    const multiplierMatch = note.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
    
    if (multiplierMatch) {
      const [, multiplier, presetValue, currency] = multiplierMatch;
      
      const preset = getPresets().find(p => {
        const presetNum = parseFloat(p.value);
        const valueNum = parseFloat(presetValue);
        return presetNum === valueNum;
      });
      
      if (preset) {
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: currency.toUpperCase(),
            preset: preset.value
          }
        }));
        handleInputChange(vendeur, multiplier);
      } else {
        const presets = getPresets();
        if (presets.length > 0) {
          setVendorPresets(prev => ({
            ...prev,
            [vendeur]: { 
              ...prev[vendeur], 
              currency: currency.toUpperCase(),
              preset: presets[0].value
            }
          }));
        }
        handleInputChange(vendeur, multiplier || '1');
      }
    } else {
      const amountMatch = note.match(/(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
      
      if (amountMatch) {
        const [, amount, currency] = amountMatch;
        const presets = currency.toUpperCase() === 'HTG' ? htgPresets : usdPresets;
        if (presets.length > 0) {
          setVendorPresets(prev => ({
            ...prev,
            [vendeur]: { 
              ...prev[vendeur], 
              currency: currency.toUpperCase(),
              preset: presets[0].value
            }
          }));
        }
        handleInputChange(vendeur, '1');
      }
    }
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSequenceId(null);
    const presets = getPresets();
    const smallestPreset = presets[0]?.value || '1';
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { 
        ...prev[vendeur], 
        preset: smallestPreset
      }
    }));
    handleInputChange(vendeur, '');
  };

  // Save edited sequence
  const handleSaveEditedSequence = () => {
    if (!editingSequenceId || !vendorState) return;
    
    const inputValue = vendorInputs[vendeur];
    
    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    const multiplier = parseFloat(inputValue) || 1;
    const presetValue = parseFloat(vendorState.preset);
    amount = presetValue * multiplier;
    note = multiplier === 1 
      ? `${presetValue} ${currency}`
      : `${multiplier} × ${presetValue} ${currency}`;

    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      const updatedSequence = {
        id: editingSequenceId,
        amount,
        currency,
        note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      handleUpdateSequence(editingSequenceId, updatedSequence);
      handleCancelEdit();
    }
  };

  // Handle preset selection
  const handleWheelPresetSelect = (presetValue) => {
    handlePresetSelect(vendeur, presetValue);
    setShowPresetWheel(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  };

  // Toggle preset wheel
  const togglePresetWheel = () => {
    setShowPresetWheel(!showPresetWheel);
  };

  // Check if we're in edit mode
  const isEditingMode = editingSequenceId !== null;
  const selectedPresetLabel = getSelectedPresetLabel();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${vendorState.currency === 'HTG' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
          <span className="text-sm font-semibold">Séquences</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs opacity-80">
            {formaterArgent(sequencesTotal)} {vendorState.currency}
          </div>
          {sequences.length > 0 && (
            <button
              onClick={() => handleClearSequences(vendeur)}
              className="p-1.5 rounded bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30"
              title="Effacer toutes les séquences"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Sequences List */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {sequences.length === 0 ? (
          <div className="text-center py-3 text-white text-opacity-50 text-xs">
            Aucune séquence ajoutée
          </div>
        ) : (
          sequences.map((sequence) => {
            const isEditing = sequence.id === editingSequenceId;
            
            return (
              <div 
                key={sequence.id} 
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  isEditing
                    ? 'bg-amber-500 bg-opacity-15 border border-amber-400 border-opacity-30'
                    : 'bg-white bg-opacity-5'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${sequence.currency === 'USD' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <div className="min-w-0">
                    <div className="text-xs truncate">{sequence.note}</div>
                    <div className="text-[10px] opacity-60">{sequence.timestamp}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="text-xs font-bold whitespace-nowrap">
                    {formaterArgent(sequence.amount)} {sequence.currency}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEditedSequence}
                          disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                          className={`p-1 rounded ${
                            vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                              ? 'text-green-400 hover:bg-green-500 hover:bg-opacity-20'
                              : 'text-gray-400'
                          }`}
                          title="Sauvegarder"
                        >
                          <Save size={10} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded"
                          title="Annuler"
                        >
                          <RotateCcw size={10} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSequence(sequence)}
                          className="p-1 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded"
                          title="Éditer"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={() => handleRemoveSequence(vendeur, sequence.id)}
                          className="p-1 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded"
                          title="Supprimer"
                        >
                          <X size={10} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Section - SIMPLIFIED FOR DEBUGGING */}
      <div className="space-y-2">
        <div className="relative">
          <div className="flex items-stretch bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 overflow-hidden">
            {/* Input Field */}
            <div className="flex-1">
              <input
                ref={inputRef}
                type="number"
                min="1"
                step="1"
                data-vendor={vendeur}
                value={vendorInputs[vendeur] || ''}
                onChange={(e) => handleInputChange(vendeur, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (isEditingMode) {
                      handleSaveEditedSequence();
                    } else {
                      handleAddSequence(vendeur);
                    }
                  }
                }}
                placeholder="Multiplicateur"
                className="w-full px-3 py-3 text-sm bg-transparent text-white placeholder-white placeholder-opacity-50 focus:outline-none"
              />
            </div>
            
            {/* Preset Selector Button - SIMPLE VERSION */}
            <div className="relative" ref={dropdownButtonRef}>
              <button
                onClick={togglePresetWheel}
                className={`h-full px-3 flex items-center justify-center border-l border-white border-opacity-20 ${
                  vendorState.currency === 'HTG'
                    ? 'bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-blue-500 hover:bg-opacity-30'
                    : 'bg-green-500 bg-opacity-20 text-green-300 hover:green-500 hover:bg-opacity-30'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">× {selectedPresetLabel}</span>
                  <ChevronDown size={12} className={`transition-transform ${showPresetWheel ? 'rotate-180' : ''}`} />
                </div>
              </button>
            </div>
            
            {/* Add/Update Button */}
            {isEditingMode ? (
              <div className="flex">
                <button
                  onClick={handleSaveEditedSequence}
                  disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                  className={`px-3 flex items-center justify-center border-l border-white border-opacity-20 ${
                    vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  title="Mettre à jour"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                  title="Annuler"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddSequence(vendeur)}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`px-3 flex items-center justify-center border-l border-white border-opacity-20 ${
                  vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                    ? vendorState.currency === 'HTG'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-600 text-gray-300'
                }`}
                title="Ajouter"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
          
          {/* DROPDOWN LIST - SEPARATE FROM BUTTON FOR DEBUGGING */}
          {showPresetWheel && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1">
              <div className="bg-gray-800 rounded-lg shadow-2xl border border-white border-opacity-20 overflow-hidden">
                {getPresets().map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleWheelPresetSelect(preset.value)}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-50 transition-colors flex items-center justify-between border-b border-white border-opacity-10 last:border-b-0 ${
                      vendorState.preset === preset.value
                        ? vendorState.currency === 'HTG'
                          ? 'bg-blue-700 text-white'
                          : 'bg-green-700 text-white'
                        : 'hover:bg-gray-700 text-gray-100'
                    }`}
                  >
                    <span>{preset.label} {vendorState.currency}</span>
                    {vendorState.preset === preset.value && (
                      <div className={`w-2 h-2 rounded-full ${vendorState.currency === 'HTG' ? 'bg-blue-300' : 'bg-green-300'}`}></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Preview */}
        {vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0 && (
          <div className="text-center">
            <div className="text-xs opacity-80">
              {vendorInputs[vendeur]} × {selectedPresetLabel} {vendorState.currency} = 
              <span className="font-bold ml-1">
                {formaterArgent(calculatePresetAmount(vendeur))} {vendorState.currency}
              </span>
            </div>
          </div>
        )}

        {/* Add Complete Deposit Button */}
        {sequences.length > 0 && !isEditingMode && (
          <button
            onClick={() => handleAddCompleteDeposit(vendeur)}
            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
          >
            <Plus size={14} />
            <span>Ajouter dépôt</span>
            <span className="text-xs">
              ({formaterArgent(sequencesTotal)} {vendorState.currency})
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SequenceManager;