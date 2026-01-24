import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, Edit2, Save, RotateCcw, Check, DollarSign, Coins } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceManager = ({
  vendeur,
  vendorState,
  sequences,
  sequencesTotal,
  sequencesTotalByCurrency,
  totalSequencesHTG,
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
  usdPresets,
  TAUX_DE_CHANGE = 132
}) => {
  // Local state
  const [editingSequenceId, setEditingSequenceId] = useState(null);
  
  // Define 9 fixed multipliers for the input grid
  const multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Split into two columns (5 in first, 4 in second)
  const column1Multipliers = [1, 2, 3, 4, 5];
  const column2Multipliers = [6, 7, 8, 9];

  // Get current presets based on currency - WITH NULL CHECK
  const getPresets = () => {
    if (!vendorState || !vendorState.currency) return htgPresets; // Default to HTG
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  // Get selected preset label - WITH NULL CHECK
  const getSelectedPresetLabel = () => {
    if (!vendorState || !vendorState.preset) {
      const presets = getPresets();
      return presets[0]?.label || '';
    }
    const presets = getPresets();
    const preset = presets.find(p => p.value === vendorState.preset);
    return preset ? preset.label : presets[0]?.label || '';
  };

  // Get currency - WITH NULL CHECK
  const getCurrency = () => {
    return vendorState?.currency || 'HTG'; // Default to HTG
  };

  // Get preset value - WITH NULL CHECK
  const getPresetValue = () => {
    return vendorState?.preset || '1'; // Default to 1
  };

  // Handle multiplier input click - sets the input value
  const handleMultiplierClick = (multiplier) => {
    handleInputChange(vendeur, multiplier.toString());
    
    // Focus the main input field
    setTimeout(() => {
      const input = document.querySelector(`[data-vendor="${vendeur}"]`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  };

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
      const input = document.querySelector(`[data-vendor="${vendeur}"]`);
      if (input) {
        input.focus();
        input.select();
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
    let currency = getCurrency();
    let note = '';

    const multiplier = parseFloat(inputValue) || 1;
    const presetValue = parseFloat(getPresetValue());
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

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    const presets = currency === 'HTG' ? htgPresets : usdPresets;
    const smallestPreset = presets[0]?.value || '1';

    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { 
        ...(prev[vendeur] || {}), 
        currency,
        preset: smallestPreset
      }
    }));
    handleInputChange(vendeur, '');
  };

  // Check if we're in edit mode
  const isEditingMode = editingSequenceId !== null;
  const selectedPresetLabel = getSelectedPresetLabel();
  const currency = getCurrency();
  const presetValue = getPresetValue();
  const currentInputValue = vendorInputs[vendeur] || '';

  return (
    <div className="space-y-3">
      {/* Header - WITH CURRENCY TOTALS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currency === 'HTG' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
          <span className="text-sm font-semibold">Séquences</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs opacity-80 flex flex-col items-end gap-0.5">
            {/* Show totals by currency */}
            {sequencesTotalByCurrency?.HTG > 0 && (
              <div className="text-blue-300">
                {formaterArgent(sequencesTotalByCurrency.HTG)} HTG
              </div>
            )}
            {sequencesTotalByCurrency?.USD > 0 && (
              <div className="text-green-300">
                {formaterArgent(sequencesTotalByCurrency.USD)} USD
              </div>
            )}
            {/* Show total in HTG if there are USD sequences */}
            {sequencesTotalByCurrency?.USD > 0 && totalSequencesHTG > 0 && (
              <div className="text-white opacity-70 text-[10px]">
                ≈ {formaterArgent(totalSequencesHTG)} HTG total
              </div>
            )}
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

      {/* TWO-COLUMN CURRENCY BUTTONS */}
      <div className="grid grid-cols-2 gap-2">
        {/* HTG Button */}
        <button
          onClick={() => handleCurrencyChange('HTG')}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all active:scale-95 ${
            currency === 'HTG'
              ? 'bg-blue-500 border-blue-400 text-white shadow-md'
              : 'bg-white bg-opacity-10 border-white border-opacity-20 text-blue-200 hover:bg-opacity-20'
          }`}
        >
          <Coins size={16} className={currency === 'HTG' ? 'text-white' : 'text-blue-300'} />
          <span className="font-bold text-sm">HTG</span>
        </button>

        {/* USD Button */}
        <button
          onClick={() => handleCurrencyChange('USD')}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all active:scale-95 ${
            currency === 'USD'
              ? 'bg-green-500 border-green-400 text-white shadow-md'
              : 'bg-white bg-opacity-10 border-white border-opacity-20 text-green-200 hover:bg-opacity-20'
          }`}
        >
          <DollarSign size={16} className={currency === 'USD' ? 'text-white' : 'text-green-300'} />
          <span className="font-bold text-sm">USD</span>
        </button>
      </div>

      {/* TWO-COLUMN MULTIPLIER INPUT GRID */}
      <div className="bg-white bg-opacity-5 rounded-lg p-2">
        <div className="text-xs text-white text-opacity-70 mb-1.5 text-center">
          Multiplicateurs rapides:
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {/* First Column - 5 inputs */}
          <div className="space-y-1">
            {column1Multipliers.map((multiplier) => (
              <button
                key={`mult-${multiplier}`}
                onClick={() => handleMultiplierClick(multiplier)}
                className={`w-full px-2 py-2 rounded text-xs font-medium transition-all active:scale-95 ${
                  currentInputValue === multiplier.toString()
                    ? currency === 'HTG'
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-green-700 text-white shadow-sm'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                × {multiplier}
              </button>
            ))}
          </div>
          
          {/* Second Column - 4 inputs */}
          <div className="space-y-1">
            {column2Multipliers.map((multiplier) => (
              <button
                key={`mult-${multiplier}`}
                onClick={() => handleMultiplierClick(multiplier)}
                className={`w-full px-2 py-2 rounded text-xs font-medium transition-all active:scale-95 ${
                  currentInputValue === multiplier.toString()
                    ? currency === 'HTG'
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-green-700 text-white shadow-sm'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                × {multiplier}
              </button>
            ))}
          </div>
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

      {/* Current Selection Display */}
      <div className="text-center py-1.5 bg-white bg-opacity-5 rounded">
        <div className="text-xs">
          <span className="opacity-70">Valeur de base:</span>
          <span className={`font-bold ml-1 ${currency === 'HTG' ? 'text-blue-300' : 'text-green-300'}`}>
            {selectedPresetLabel} {currency}
          </span>
        </div>
      </div>

      {/* Main Input Section */}
      <div className="space-y-2">
        {/* Input Row */}
        <div className="flex items-stretch bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 overflow-hidden">
          {/* Input Field */}
          <div className="flex-1">
            <input
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
              placeholder="Multiplicateur (ou tapez un nombre)"
              className="w-full px-3 py-3 text-sm bg-transparent text-white placeholder-white placeholder-opacity-50 focus:outline-none"
            />
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
                  ? currency === 'HTG'
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

        {/* Quick Preview */}
        {vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0 && (
          <div className="text-center">
            <div className="text-xs opacity-80">
              {vendorInputs[vendeur]} × {selectedPresetLabel} {currency} = 
              <span className="font-bold ml-1">
                {formaterArgent(calculatePresetAmount(vendeur))} {currency}
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
              {/* Show summary of what will be added */}
              {sequencesTotalByCurrency?.HTG > 0 && (
                <span>{formaterArgent(sequencesTotalByCurrency.HTG)} HTG</span>
              )}
              {sequencesTotalByCurrency?.HTG > 0 && sequencesTotalByCurrency?.USD > 0 && (
                <span> + </span>
              )}
              {sequencesTotalByCurrency?.USD > 0 && (
                <span>{formaterArgent(sequencesTotalByCurrency.USD)} USD</span>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SequenceManager;