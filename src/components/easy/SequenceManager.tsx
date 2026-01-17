import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X, Plus, ChevronDown, Edit2, Save, RotateCcw, Check, ChevronUp, DollarSign, Coins } from 'lucide-react';
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
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [wheelScrollTop, setWheelScrollTop] = useState(0);

  const wheelRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownContainerRef = useRef(null);
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

  // Handle wheel dragging
  const handleWheelMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingWheel(true);
    setDragStartY(e.clientY);
    if (wheelRef.current) {
      setWheelScrollTop(wheelRef.current.scrollTop);
    }
  };

  const handleWheelMouseMove = (e) => {
    if (!isDraggingWheel || !wheelRef.current) return;

    const deltaY = e.clientY - dragStartY;
    wheelRef.current.scrollTop = wheelScrollTop - deltaY * 2;
  };

  const handleWheelMouseUp = () => {
    setIsDraggingWheel(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showPresetWheel) return;

      if (dropdownButtonRef.current && dropdownButtonRef.current.contains(event.target)) {
        return;
      }

      if (dropdownContainerRef.current && dropdownContainerRef.current.contains(event.target)) {
        return;
      }

      setShowPresetWheel(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showPresetWheel]);

  // Handle wheel dragging events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingWheel) {
        handleWheelMouseMove(e);
      }
    };

    const handleMouseUp = () => {
      handleWheelMouseUp();
    };

    if (isDraggingWheel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWheel, dragStartY, wheelScrollTop]);

  // Blur input when dropdown opens
  useEffect(() => {
    if (showPresetWheel && inputRef.current) {
      inputRef.current.blur();
    }
  }, [showPresetWheel]);

  // Handle editing a sequence
  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);

    const note = sequence.note;

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

  // Handle preset selection from wheel
  const handleWheelPresetSelect = (presetValue) => {
    handlePresetSelect(vendeur, presetValue);
    setShowPresetWheel(false);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 150);
  };

  // Toggle preset wheel
  const togglePresetWheel = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const newState = !showPresetWheel;
    setShowPresetWheel(newState);
    
    if (newState && inputRef.current) {
      inputRef.current.blur();
    } else if (!newState && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  };

  // Handle input field focus
  const handleInputFocus = () => {
    if (showPresetWheel) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Handle input field click
  const handleInputClick = (e) => {
    if (showPresetWheel) {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    if (vendorState) {
      const presets = currency === 'HTG' ? htgPresets : usdPresets;
      const smallestPreset = presets[0]?.value || '1';

      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { 
          ...prev[vendeur], 
          currency,
          preset: smallestPreset
        }
      }));
      handleInputChange(vendeur, '');
    }
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

      {/* TWO-COLUMN CURRENCY BUTTONS - COMPACT VERSION */}
      <div className="grid grid-cols-2 gap-2">
        {/* HTG Button - COMPACT */}
        <button
          onClick={() => handleCurrencyChange('HTG')}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all active:scale-95 ${
            vendorState.currency === 'HTG'
              ? 'bg-blue-500 border-blue-400 text-white shadow-md'
              : 'bg-white bg-opacity-10 border-white border-opacity-20 text-blue-200 hover:bg-opacity-20'
          }`}
        >
          <Coins size={16} className={vendorState.currency === 'HTG' ? 'text-white' : 'text-blue-300'} />
          <span className="font-bold text-sm">HTG</span>
        </button>

        {/* USD Button - COMPACT */}
        <button
          onClick={() => handleCurrencyChange('USD')}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all active:scale-95 ${
            vendorState.currency === 'USD'
              ? 'bg-green-500 border-green-400 text-white shadow-md'
              : 'bg-white bg-opacity-10 border-white border-opacity-20 text-green-200 hover:bg-opacity-20'
          }`}
        >
          <DollarSign size={16} className={vendorState.currency === 'USD' ? 'text-white' : 'text-green-300'} />
          <span className="font-bold text-sm">USD</span>
        </button>
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

      {/* Input Section */}
      <div className="space-y-2">
        <div className="relative" ref={dropdownContainerRef}>
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
                onFocus={handleInputFocus}
                onClick={handleInputClick}
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

            {/* Preset Selector Button */}
            <button
              ref={dropdownButtonRef}
              data-dropdown-button
              onClick={togglePresetWheel}
              className={`px-3 flex items-center justify-center border-l border-white border-opacity-20 ${
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

          {/* Dropdown Wheel */}
          {showPresetWheel && (
            <div 
              className="absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden border border-white border-opacity-30 bg-gray-800 top-full"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div 
                ref={wheelRef}
                className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                onMouseDown={handleWheelMouseDown}
                style={{ cursor: isDraggingWheel ? 'grabbing' : 'grab' }}
              >
                {getPresets().map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleWheelPresetSelect(preset.value)}
                    className={`w-full px-3 py-2.5 text-left text-xs font-medium hover:bg-opacity-50 transition-colors flex items-center justify-between border-b border-white border-opacity-10 last:border-b-0 ${
                      vendorState.preset === preset.value
                        ? vendorState.currency === 'HTG'
                          ? 'bg-blue-700 text-white'
                          : 'bg-green-700 text-white'
                        : vendorState.currency === 'HTG'
                          ? 'hover:bg-blue-800 text-blue-100'
                          : 'hover:bg-green-800 text-green-100'
                    }`}
                  >
                    <span>{preset.label} {vendorState.currency}</span>
                    {vendorState.preset === preset.value && (
                      <Check size={10} />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center py-1 bg-gray-900 bg-opacity-50">
                <ChevronUp size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400 mx-2">Glisser pour faire défiler</span>
                <ChevronDown size={10} className="text-gray-400" />
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
            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:opacity-80 transition-opacity text-sm"
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