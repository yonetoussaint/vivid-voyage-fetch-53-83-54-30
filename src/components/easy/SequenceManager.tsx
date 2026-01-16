import React, { useState, useRef, useEffect } from 'react';
import { List, Trash2, X, Plus, Check, ChevronDown, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceManager = ({
  vendeur,
  vendorState,
  sequences,
  sequencesTotal,
  isSequenceManagerOpen,
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
  if (!isSequenceManagerOpen || !vendorState) return null;

  // Local state for editing sequences
  const [editingSequenceId, setEditingSequenceId] = useState(null);
  const [showPresetWheel, setShowPresetWheel] = useState(false);
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [wheelScrollTop, setWheelScrollTop] = useState(0);
  
  const wheelRef = useRef(null);
  const inputRef = useRef(null);

  // Get current presets based on currency
  const getPresets = () => {
    if (!vendorState) return [];
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  // Get selected preset label
  const getSelectedPresetLabel = () => {
    if (!vendorState || vendorState.preset === 'aucune') return 'Montant libre';
    const presets = getPresets();
    const preset = presets.find(p => p.value === vendorState.preset);
    return preset ? preset.label : 'Montant libre';
  };

  // Handle wheel dragging
  const handleWheelMouseDown = (e) => {
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

  // Close wheel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wheelRef.current && !wheelRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowPresetWheel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleWheelMouseUp);
    document.addEventListener('mousemove', handleWheelMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleWheelMouseUp);
      document.removeEventListener('mousemove', handleWheelMouseMove);
    };
  }, [isDraggingWheel]);

  // Function to handle editing a sequence
  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);
    
    const note = sequence.note;
    
    // Check if it's a preset sequence (e.g., "5 × 20 HTG")
    const multiplierMatch = note.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
    
    if (multiplierMatch) {
      const [, multiplier, presetValue, currency] = multiplierMatch;
      
      // Find the preset in current presets
      const preset = getPresets().find(p => {
        const presetNum = parseFloat(p.value);
        const valueNum = parseFloat(presetValue);
        return presetNum === valueNum;
      });
      
      if (preset) {
        // It's a preset sequence
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: currency.toUpperCase(),
            preset: preset.value
          }
        }));
        
        // Set the multiplier in the input
        handleInputChange(vendeur, multiplier);
      } else {
        // Fallback to direct mode
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: currency.toUpperCase(),
            preset: 'aucune'
          }
        }));
        
        // Set the amount in the input
        handleInputChange(vendeur, sequence.amount.toString());
      }
    } else {
      // It's a direct amount sequence (e.g., "100 HTG")
      const amountMatch = note.match(/(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
      
      if (amountMatch) {
        const [, amount, currency] = amountMatch;
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: currency.toUpperCase(),
            preset: 'aucune'
          }
        }));
        
        // Set the amount in the input
        handleInputChange(vendeur, amount);
      } else {
        // Fallback - just set the amount
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: sequence.currency,
            preset: 'aucune'
          }
        }));
        handleInputChange(vendeur, sequence.amount.toString());
      }
    }
    
    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingSequenceId(null);
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { 
        ...prev[vendeur], 
        preset: 'aucune'
      }
    }));
    handleInputChange(vendeur, '');
  };

  // Function to save edited sequence
  const handleSaveEditedSequence = () => {
    if (!editingSequenceId || !vendorState) return;
    
    const inputValue = vendorInputs[vendeur];
    
    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    if (vendorState.preset === 'aucune') {
      amount = parseFloat(inputValue) || 0;
      note = `${amount} ${currency}`;
    } else {
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(vendorState.preset);
        amount = presetValue * multiplier;
        note = `${multiplier} × ${presetValue} ${currency}`;
      } else {
        amount = parseFloat(vendorState.preset);
        note = `${vendorState.preset} ${currency}`;
      }
    }

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

      // Update the sequence
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
    }, 50);
  };

  // Toggle preset wheel
  const togglePresetWheel = () => {
    setShowPresetWheel(!showPresetWheel);
  };

  // Check if we're in edit mode
  const isEditingMode = editingSequenceId !== null;
  const selectedPresetLabel = getSelectedPresetLabel();
  const isDirectMode = vendorState?.preset === 'aucune';

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <List size={14} className="text-amber-300" />
          <span className="text-sm font-bold text-amber-300">Séquences de Dépôt</span>
          {isEditingMode && (
            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Édition
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-80">
            Total: {formaterArgent(sequencesTotal)} {vendorState?.currency || 'HTG'}
          </span>
          <button
            onClick={() => handleClearSequences(vendeur)}
            disabled={sequences.length === 0}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              sequences.length === 0
                ? 'bg-gray-500 bg-opacity-30 text-gray-300 cursor-not-allowed'
                : 'bg-red-500 bg-opacity-30 hover:bg-opacity-40 text-red-300'
            }`}
          >
            <Trash2 size={10} />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        </div>
      </div>

      {/* Current sequences list */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {sequences.length === 0 ? (
          <div className="text-center py-2 text-white text-opacity-50 text-xs sm:text-sm">
            Aucune séquence ajoutée
          </div>
        ) : (
          sequences.map((sequence) => {
            const isEditing = sequence.id === editingSequenceId;
            
            return (
              <div 
                key={sequence.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded p-1.5 sm:p-2 gap-1 sm:gap-2 transition-all ${
                  isEditing
                    ? 'bg-amber-500 bg-opacity-20 border border-amber-400 border-opacity-30'
                    : 'bg-white bg-opacity-5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    sequence.currency === 'USD' ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs truncate max-w-[120px] sm:max-w-none">{sequence.note}</span>
                    <span className="text-[10px] opacity-60">{sequence.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <span className="text-xs font-bold">
                    {formaterArgent(sequence.amount)} {sequence.currency}
                  </span>
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEditedSequence}
                          disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                          className={`p-0.5 rounded transition-colors ${
                            vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                              ? 'hover:bg-green-500 hover:bg-opacity-30 text-green-300 hover:text-green-200'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title="Sauvegarder les modifications"
                        >
                          <Save size={10} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-0.5 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                          title="Annuler l'édition"
                        >
                          <RotateCcw size={10} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSequence(sequence)}
                          className="p-0.5 hover:bg-blue-500 hover:bg-opacity-30 rounded text-blue-300 hover:text-blue-200 transition-colors"
                          title="Éditer cette séquence"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={() => handleRemoveSequence(vendeur, sequence.id)}
                          className="p-0.5 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                          title="Retirer cette séquence"
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

      {/* Add/Edit sequence section */}
      <div className="space-y-2">
        {/* Compact input with integrated preset selector */}
        <div className="relative">
          <div className="flex">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="number"
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
                onClick={() => setShowPresetWheel(false)}
                placeholder={
                  isDirectMode
                    ? `Montant en ${vendorState?.currency}...`
                    : `Multiplicateur...`
                }
                className="w-full pl-4 pr-32 py-2.5 text-sm sm:text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-l-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              />
              
              {/* Selected preset and dropdown arrow inside input */}
              <div className="absolute inset-y-0 right-0 flex items-center">
                {/* Selected preset label */}
                <div className={`px-2 text-xs font-medium ${
                  vendorState?.currency === 'HTG' ? 'text-blue-300' : 'text-green-300'
                }`}>
                  {isDirectMode ? vendorState?.currency : `× ${selectedPresetLabel}`}
                </div>
                
                {/* Dropdown arrow */}
                <button
                  onClick={togglePresetWheel}
                  className={`h-full px-2 flex items-center justify-center border-l border-white border-opacity-30 ${
                    vendorState?.currency === 'HTG'
                      ? 'hover:bg-blue-500 hover:bg-opacity-20 text-blue-300'
                      : 'hover:bg-green-500 hover:bg-opacity-20 text-green-300'
                  }`}
                >
                  <ChevronDown size={12} className={`transition-transform ${showPresetWheel ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Minimal add/update button */}
            {isEditingMode ? (
              <div className="flex">
                <button
                  onClick={handleSaveEditedSequence}
                  disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                  className={`px-3 py-2.5 rounded-r-lg flex items-center justify-center ${
                    vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                  } transition-colors`}
                  title="Mettre à jour"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="ml-1 px-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  title="Annuler"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddSequence(vendeur)}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`px-3 py-2.5 rounded-r-lg flex items-center justify-center ${
                  vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                    ? vendorState?.currency === 'HTG'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                } transition-colors`}
                title="Ajouter séquence"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          {/* Preset wheel dropdown */}
          {showPresetWheel && (
            <div className="absolute z-20 w-full mt-1 rounded-lg shadow-lg overflow-hidden border border-white border-opacity-30 bg-gray-800">
              {/* "Montant libre" option */}
              <button
                onClick={() => handleWheelPresetSelect('aucune')}
                className={`w-full px-3 py-3 text-left text-xs hover:bg-opacity-50 transition-colors flex items-center justify-between border-b border-white border-opacity-20 ${
                  vendorState?.preset === 'aucune'
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-gray-700 text-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Montant libre</span>
                  <span className="text-[10px] opacity-70">
                    ({vendorState?.currency})
                  </span>
                </div>
                {vendorState?.preset === 'aucune' && (
                  <Check size={10} />
                )}
              </button>

              {/* Scrollable wheel list */}
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
                      vendorState?.preset === preset.value
                        ? vendorState?.currency === 'HTG'
                          ? 'bg-blue-700 text-white'
                          : 'bg-green-700 text-white'
                        : vendorState?.currency === 'HTG'
                          ? 'hover:bg-blue-800 text-blue-100'
                          : 'hover:bg-green-800 text-green-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{preset.label}</span>
                      <span className="text-[10px] opacity-70">
                        ({vendorState?.currency})
                      </span>
                    </div>
                    {vendorState?.preset === preset.value && (
                      <Check size={10} />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Wheel scroll indicator */}
              <div className="py-1.5 bg-gray-900 bg-opacity-50 text-center">
                <span className="text-[10px] text-gray-400">Glisser pour faire défiler</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick calculation preview */}
        {!isDirectMode && vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0 && (
          <div className="text-center">
            <div className="text-xs opacity-70">
              {vendorInputs[vendeur]} × {selectedPresetLabel} {vendorState?.currency} = 
              <span className="font-bold ml-1">
                {formaterArgent(calculatePresetAmount(vendeur))} {vendorState?.currency}
              </span>
            </div>
          </div>
        )}

        {/* Add Complete Deposit Button */}
        {sequences.length > 0 && !isEditingMode && (
          <div className="pt-1">
            <button
              onClick={() => handleAddCompleteDeposit(vendeur)}
              className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Ajouter dépôt complet</span>
              <span className="sm:hidden">Ajouter dépôt</span>
              <span className="text-xs sm:text-sm">
                ({formaterArgent(sequencesTotal)} {vendorState?.currency})
              </span>
            </button>
            <p className="text-[10px] text-center opacity-70 mt-1 truncate">
              {sequences.length} séquence{sequences.length !== 1 ? 's' : ''} • {sequences.map(seq => seq.note).join(' + ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceManager;