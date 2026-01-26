import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, Edit2, Save, RotateCcw, DollarSign, Coins } from 'lucide-react';
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
  
  // Define bill denominations for each currency
  const htgDenominations = [
    { label: '1000 HTG', value: 1000, color: 'bg-purple-500' },
    { label: '500 HTG', value: 500, color: 'bg-blue-500' },
    { label: '250 HTG', value: 250, color: 'bg-red-500' },
    { label: '200 HTG', value: 200, color: 'bg-amber-500' },
    { label: '100 HTG', value: 100, color: 'bg-green-500' },
    { label: '50 HTG', value: 50, color: 'bg-orange-500' },
    { label: '25 HTG', value: 25, color: 'bg-pink-500' },
    { label: '10 HTG', value: 10, color: 'bg-yellow-500' },
    { label: '5 HTG', value: 5, color: 'bg-teal-500' }
  ];

  const usdDenominations = [
    { label: '100 USD', value: 100, color: 'bg-purple-500' },
    { label: '50 USD', value: 50, color: 'bg-blue-500' },
    { label: '20 USD', value: 20, color: 'bg-red-500' },
    { label: '10 USD', value: 10, color: 'bg-green-500' },
    { label: '5 USD', value: 5, color: 'bg-orange-500' },
    { label: '2 USD', value: 2, color: 'bg-pink-500' },
    { label: '1 USD', value: 1, color: 'bg-yellow-500' },
    { label: '0.50 USD', value: 0.5, color: 'bg-teal-500' },
    { label: '0.25 USD', value: 0.25, color: 'bg-indigo-500' }
  ];

  // State for grid inputs (multipliers for each denomination)
  const [gridInputs, setGridInputs] = useState({});
  const [lockedInputs, setLockedInputs] = useState({});
  const [currentFocusedField, setCurrentFocusedField] = useState(null);

  // Get current denominations based on currency
  const getDenominations = () => {
    if (!vendorState || !vendorState.currency) return htgDenominations;
    return vendorState.currency === 'HTG' ? htgDenominations : usdDenominations;
  };

  // Get currency - WITH NULL CHECK
  const getCurrency = () => {
    return vendorState?.currency || 'HTG'; // Default to HTG
  };

  // Initialize grid inputs based on denominations
  useEffect(() => {
    const denominations = getDenominations();
    const initialInputs = {};
    denominations.forEach(denom => {
      if (gridInputs[denom.value] === undefined) {
        initialInputs[denom.value] = '';
      }
    });
    
    // Only update if there are new denominations
    if (Object.keys(initialInputs).length > 0) {
      setGridInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [vendorState?.currency]);

  // Handle grid input change
  const handleGridInputChange = (denominationValue, value) => {
    if (lockedInputs[denominationValue]) return;
    
    // Only allow numbers
    if (value === '' || /^\d*$/.test(value)) {
      setGridInputs(prev => ({
        ...prev,
        [denominationValue]: value
      }));
    }
  };

  // Handle grid input focus
  const handleGridInputFocus = (denominationValue) => {
    if (lockedInputs[denominationValue]) {
      // Don't allow focus if locked
      return false;
    }
    
    // Lock previous field if it has a value
    if (currentFocusedField && currentFocusedField !== denominationValue) {
      const prevValue = gridInputs[currentFocusedField];
      if (prevValue && prevValue !== '' && parseFloat(prevValue) > 0) {
        setLockedInputs(prev => ({
          ...prev,
          [currentFocusedField]: true
        }));
      }
    }
    
    setCurrentFocusedField(denominationValue);
    return true;
  };

  // Handle grid input blur
  const handleGridInputBlur = (denominationValue) => {
    const value = gridInputs[denominationValue];
    if (value && value !== '' && parseFloat(value) > 0) {
      setLockedInputs(prev => ({
        ...prev,
        [denominationValue]: true
      }));
    }
  };

  // Unlock a specific input field
  const unlockField = (denominationValue) => {
    setLockedInputs(prev => ({
      ...prev,
      [denominationValue]: false
    }));
  };

  // Reset all grid inputs
  const resetGridInputs = () => {
    const denominations = getDenominations();
    const resetInputs = {};
    const resetLocks = {};
    
    denominations.forEach(denom => {
      resetInputs[denom.value] = '';
      resetLocks[denom.value] = false;
    });
    
    setGridInputs(resetInputs);
    setLockedInputs(resetLocks);
    setCurrentFocusedField(null);
  };

  // Calculate total from all grid inputs
  const calculateGridTotal = () => {
    const currency = getCurrency();
    const denominations = getDenominations();
    let total = 0;
    
    denominations.forEach(denom => {
      const multiplier = gridInputs[denom.value];
      if (multiplier && multiplier !== '' && parseFloat(multiplier) > 0) {
        total += denom.value * parseFloat(multiplier);
      }
    });
    
    return total;
  };

  // Add all grid inputs as sequences
  const handleAddAllGridSequences = () => {
    const currency = getCurrency();
    const denominations = getDenominations();
    
    let hasAddedAny = false;
    
    denominations.forEach(denom => {
      const multiplier = gridInputs[denom.value];
      if (multiplier && multiplier !== '' && parseFloat(multiplier) > 0) {
        // Save current state
        const currentInput = vendorInputs[vendeur] || '';
        const currentPresetValue = vendorState?.preset || '1';
        
        // Set the denomination as preset
        handlePresetSelect(vendeur, denom.value.toString());
        // Set the multiplier as input
        handleInputChange(vendeur, multiplier);
        
        // Add the sequence after a short delay
        setTimeout(() => {
          handleAddSequence(vendeur);
          
          // Restore original state
          setTimeout(() => {
            handlePresetSelect(vendeur, currentPresetValue);
            handleInputChange(vendeur, currentInput);
          }, 50);
        }, 50);
        
        hasAddedAny = true;
      }
    });
    
    // Reset grid inputs if we added any sequences
    if (hasAddedAny) {
      resetGridInputs();
    }
  };

  // Handle editing a sequence
  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);

    const note = sequence.note;

    const multiplierMatch = note.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);

    if (multiplierMatch) {
      const [, multiplier, presetValue, currency] = multiplierMatch;

      const presetValueNum = parseFloat(presetValue);
      
      // Try to find matching denomination
      const denominations = currency.toUpperCase() === 'HTG' ? htgDenominations : usdDenominations;
      const matchingDenom = denominations.find(d => d.value === presetValueNum);
      
      if (matchingDenom) {
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { 
            ...prev[vendeur], 
            currency: currency.toUpperCase(),
            preset: presetValueNum.toString()
          }
        }));
        handleInputChange(vendeur, multiplier);
      } else {
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
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSequenceId(null);
    const presets = getCurrency() === 'HTG' ? htgPresets : usdPresets;
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
    const presetValue = parseFloat(vendorState?.preset || '1');
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
    // Reset grid inputs when currency changes
    resetGridInputs();
  };

  // Check if we're in edit mode
  const isEditingMode = editingSequenceId !== null;
  const currency = getCurrency();
  const currentInputValue = vendorInputs[vendeur] || '';
  const denominations = getDenominations();

  // Sort denominations from highest to lowest
  const sortedDenominations = [...denominations].sort((a, b) => b.value - a.value);

  // Split denominations into two columns
  const firstColumnDenoms = sortedDenominations.slice(0, Math.ceil(sortedDenominations.length / 2));
  const secondColumnDenoms = sortedDenominations.slice(Math.ceil(sortedDenominations.length / 2));

  // Calculate grid total
  const gridTotal = calculateGridTotal();

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

      {/* TWO-COLUMN MONEY COUNTER GRID */}
      <div className="bg-white bg-opacity-5 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-white text-opacity-70">Total compteur</div>
            <div className={`text-lg font-bold ${currency === 'HTG' ? 'text-blue-300' : 'text-green-300'}`}>
              {formaterArgent(gridTotal)} {currency}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={resetGridInputs}
              className="px-2 py-1 text-xs bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 rounded flex items-center gap-1"
              title="Réinitialiser"
            >
              <RotateCcw size={10} />
              Reset
            </button>
            <button
              onClick={handleAddAllGridSequences}
              disabled={gridTotal === 0}
              className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded font-medium hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Tout ajouter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {/* First Column */}
          <div className="space-y-2">
            {firstColumnDenoms.map((denom) => {
              const value = gridInputs[denom.value] || '';
              const isLocked = lockedInputs[denom.value];
              const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;
              
              return (
                <div 
                  key={`grid-${denom.value}`} 
                  className={`bg-white bg-opacity-5 rounded p-2 border ${isLocked ? 'border-green-400' : 'border-white border-opacity-20'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className={`${denom.color} px-1.5 py-0.5 rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{denom.value}</span>
                      </div>
                      <span className="text-xs text-white text-opacity-70">{currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isLocked && (
                        <button
                          onClick={() => unlockField(denom.value)}
                          className="text-xs text-green-400 hover:text-green-300"
                          title="Déverrouiller"
                        >
                          🔒
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => handleGridInputChange(denom.value, e.target.value)}
                    onFocus={() => handleGridInputFocus(denom.value)}
                    onBlur={() => handleGridInputBlur(denom.value)}
                    className={`w-full text-sm font-bold ${
                      isLocked 
                        ? currency === 'HTG' 
                          ? 'text-green-400 bg-green-900 bg-opacity-20' 
                          : 'text-green-400 bg-green-900 bg-opacity-20'
                        : 'text-white bg-white bg-opacity-10'
                    } rounded px-2 py-1.5 border border-white border-opacity-20 focus:border-green-500 focus:outline-none text-center`}
                    placeholder="0"
                    disabled={isLocked}
                  />
                  
                  <div className="text-xs font-bold text-white text-opacity-70 text-center mt-1">
                    {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Second Column */}
          <div className="space-y-2">
            {secondColumnDenoms.map((denom) => {
              const value = gridInputs[denom.value] || '';
              const isLocked = lockedInputs[denom.value];
              const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;
              
              return (
                <div 
                  key={`grid-${denom.value}`} 
                  className={`bg-white bg-opacity-5 rounded p-2 border ${isLocked ? 'border-green-400' : 'border-white border-opacity-20'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className={`${denom.color} px-1.5 py-0.5 rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{denom.value}</span>
                      </div>
                      <span className="text-xs text-white text-opacity-70">{currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isLocked && (
                        <button
                          onClick={() => unlockField(denom.value)}
                          className="text-xs text-green-400 hover:text-green-300"
                          title="Déverrouiller"
                        >
                          🔒
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => handleGridInputChange(denom.value, e.target.value)}
                    onFocus={() => handleGridInputFocus(denom.value)}
                    onBlur={() => handleGridInputBlur(denom.value)}
                    className={`w-full text-sm font-bold ${
                      isLocked 
                        ? currency === 'HTG' 
                          ? 'text-green-400 bg-green-900 bg-opacity-20' 
                          : 'text-green-400 bg-green-900 bg-opacity-20'
                        : 'text-white bg-white bg-opacity-10'
                    } rounded px-2 py-1.5 border border-white border-opacity-20 focus:border-green-500 focus:outline-none text-center`}
                    placeholder="0"
                    disabled={isLocked}
                  />
                  
                  <div className="text-xs font-bold text-white text-opacity-70 text-center mt-1">
                    {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
                  </div>
                </div>
              );
            })}
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
              placeholder="Multiplicateur personnalisé"
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