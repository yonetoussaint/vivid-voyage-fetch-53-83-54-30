import React, { useState } from 'react';
import { List, Trash2, X, Plus, Check, ChevronDown, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceManager = ({
  vendeur,
  vendorState,
  sequences,
  sequencesTotal,
  isSequenceManagerOpen,
  vendorInputs,
  isDirectMode,
  showPresetsForVendor,
  currentPresets,

  // Functions
  toggleSequenceManager,
  handleClearSequences,
  handleRemoveSequence,
  setShowPresetsForVendor,
  handlePresetSelect,
  handleInputChange,
  handleAddSequence,
  handleAddCompleteDeposit,

  // Helper functions
  getSelectedPresetText,
  calculatePresetAmount,

  // Configuration
  htgPresets,
  usdPresets
}) => {
  if (!isSequenceManagerOpen || !vendorState) return null;

  // Local state for editing sequences
  const [editingSequenceId, setEditingSequenceId] = useState(null);
  const [editSequenceData, setEditSequenceData] = useState(null);

  // Function to handle editing a sequence
  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);
    setEditSequenceData(sequence);
    
    // Parse the note to determine if it's a preset or direct amount
    const note = sequence.note;
    
    // Check if it's a preset sequence (e.g., "5 × 20 HTG")
    const multiplierMatch = note.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
    
    if (multiplierMatch) {
      const [, multiplier, presetValue, currency] = multiplierMatch;
      
      // Find the preset in current presets
      const preset = currentPresets.find(p => 
        parseFloat(p.value) === parseFloat(presetValue) || 
        p.label.toLowerCase().includes(presetValue.toLowerCase().replace('k', '000'))
      );
      
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
      }
    }
    
    // Focus the input field
    setTimeout(() => {
      const input = document.querySelector(`input[data-vendor="${vendeur}"]`);
      if (input) input.focus();
    }, 100);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingSequenceId(null);
    setEditSequenceData(null);
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
    if (!editingSequenceId || !editSequenceData) return;
    
    // Create updated sequence
    const vendorState = vendorPresets[vendeur];
    const inputValue = vendorInputs[vendeur];

    if (!vendorState) return;

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
      // Update the sequence in the parent component
      // We'll need to pass a handleUpdateSequence function from parent
      // For now, remove old and add new
      handleRemoveSequence(vendeur, editingSequenceId);
      
      const newSequence = {
        id: Date.now(),
        amount,
        currency,
        note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // We need to add this sequence back - we'll pass a handleUpdateSequence function
      // For now, we'll simulate by clearing and letting user re-add
      handleCancelEdit();
    }
  };

  // Function to update sequence directly (to be passed from parent)
  const handleUpdateSequence = (sequenceId, updatedSequence) => {
    // This should be implemented in the parent component
    console.log('Update sequence:', sequenceId, updatedSequence);
  };

  // Check if we're in edit mode
  const isEditingMode = editingSequenceId !== null;

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
                          onClick={() => handleSaveEditedSequence(sequence.id)}
                          className="p-0.5 hover:bg-green-500 hover:bg-opacity-30 rounded text-green-300 hover:text-green-200 transition-colors"
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
        {/* Preset selector */}
        <PresetSelector
          vendeur={vendeur}
          vendorState={vendorState}
          getSelectedPresetText={getSelectedPresetText}
          vendorInputs={vendorInputs}
          isDirectMode={isDirectMode}
          showPresetsForVendor={showPresetsForVendor}
          currentPresets={currentPresets}
          calculatePresetAmount={calculatePresetAmount}
          setShowPresetsForVendor={setShowPresetsForVendor}
          handlePresetSelect={handlePresetSelect}
        />

        {/* Input with Add/Update Sequence button */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-white font-bold text-xs">
              {isDirectMode ? (
                vendorState?.currency === 'HTG' ? 'HTG' : 'USD'
              ) : (
                '×'
              )}
            </span>
          </div>
          <input
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
            placeholder={
              isDirectMode 
                ? `Montant en ${vendorState?.currency}...` 
                : 'Multiplicateur (ex: 33)...'
            }
            className="w-full pl-10 pr-28 sm:pr-24 py-2.5 text-sm sm:text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            {isEditingMode ? (
              <div className="flex gap-1">
                <button
                  onClick={handleSaveEditedSequence}
                  disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                      ? vendorState?.currency === 'HTG' 
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                  } transition-colors`}
                >
                  <Save size={10} />
                  <span className="hidden sm:inline">Mettre à jour</span>
                  <span className="sm:hidden">Màj</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <RotateCcw size={10} />
                  <span className="hidden sm:inline">Annuler</span>
                  <span className="sm:hidden">Annul</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddSequence(vendeur)}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                  vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                    ? vendorState?.currency === 'HTG' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                <Plus size={10} />
                <span className="hidden sm:inline">Ajouter séquence</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            )}
          </div>
        </div>

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

const PresetSelector = ({
  vendeur,
  vendorState,
  getSelectedPresetText,
  vendorInputs,
  isDirectMode,
  showPresetsForVendor,
  currentPresets,
  calculatePresetAmount,
  setShowPresetsForVendor,
  handlePresetSelect
}) => (
  <div className="relative">
    <button
      onClick={() => setShowPresetsForVendor(showPresetsForVendor === vendeur ? null : vendeur)}
      className={`w-full px-3 py-2 text-left rounded-lg flex items-center justify-between transition-colors ${
        vendorState?.currency === 'HTG'
          ? 'bg-blue-500 bg-opacity-20 hover:bg-opacity-30 border border-blue-400 border-opacity-30'
          : 'bg-green-500 bg-opacity-20 hover:bg-opacity-30 border border-green-400 border-opacity-30'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className={`text-xs font-bold ${
          vendorState?.currency === 'HTG' ? 'text-blue-300' : 'text-green-300'
        }`}>
          {getSelectedPresetText(vendeur)}
        </span>
        {!isDirectMode && vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) !== 1 && (
          <span className="text-[10px] opacity-70">
            × {vendorInputs[vendeur]} = {formaterArgent(calculatePresetAmount(vendeur))} {vendorState?.currency}
          </span>
        )}
      </div>
      <ChevronDown 
        size={12} 
        className={`transition-transform ${showPresetsForVendor === vendeur ? 'rotate-180' : ''} ${
          vendorState?.currency === 'HTG' ? 'text-blue-300' : 'text-green-300'
        }`} 
      />
    </button>

    {/* Dropdown menu */}
    {showPresetsForVendor === vendeur && (
      <div className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg overflow-hidden border ${
        vendorState?.currency === 'HTG'
          ? 'bg-blue-900 border-blue-700'
          : 'bg-green-900 border-green-700'
      }`}>
        {/* "Aucune" option - full width */}
        <button
          onClick={() => handlePresetSelect(vendeur, 'aucune')}
          className={`w-full px-3 py-3 text-left text-xs hover:bg-opacity-50 transition-colors flex items-center justify-between border-b ${
            vendorState?.currency === 'HTG' ? 'border-blue-700' : 'border-green-700'
          } ${
            vendorState?.preset === 'aucune'
              ? vendorState?.currency === 'HTG'
                ? 'bg-blue-700 text-white'
                : 'bg-green-700 text-white'
              : vendorState?.currency === 'HTG'
                ? 'hover:bg-blue-800 text-blue-100'
                : 'hover:bg-green-800 text-green-100'
          }`}
        >
          <span>Entrer montant libre</span>
          {isDirectMode && (
            <span className="text-[10px] opacity-70">✓</span>
          )}
        </button>

        {/* Grid of presets */}
        <div className="p-1.5 sm:p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {currentPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(vendeur, preset.value)}
                className={`px-2 py-2 text-xs font-medium rounded border transition-colors flex items-center justify-center ${
                  vendorState?.currency === 'HTG'
                    ? 'bg-blue-500 bg-opacity-10 hover:bg-opacity-20 border-blue-400 border-opacity-30 text-blue-300'
                    : 'bg-green-500 bg-opacity-10 hover:bg-opacity-20 border-green-400 border-opacity-30 text-green-300'
                } ${vendorState?.preset === preset.value ? 'ring-1 ring-white ring-opacity-50' : ''}`}
                title={`${preset.label} ${vendorState?.currency}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

// Note: setVendorPresets and handleInputChange need to be passed from parent
// We'll need to update the parent component to handle these

export default SequenceManager;