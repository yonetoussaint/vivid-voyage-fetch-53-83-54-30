import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, Edit2, Save, RotateCcw, DollarSign, Coins, Lock, Unlock } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { htgPresets, usdPresets } from './depositPresets';

const SequenceManager = ({
  vendeur,
  vendorState,
  sequences,
  sequencesTotal,
  sequencesTotalByCurrency,
  totalSequencesHTG,
  vendorInputs,
  currentPresets,
  handleClearSequences,
  handleRemoveSequence,
  handleUpdateSequence,
  handlePresetSelect,
  handleInputChange,
  handleAddSequence,
  handleAddCompleteDeposit,
  setVendorPresets,
  calculatePresetAmount,
  TAUX_DE_CHANGE = 132,
  editingMode = false,
  onCancelEdit
}) => {
  const [editingSequenceId, setEditingSequenceId] = useState(null);
  const [gridInputs, setGridInputs] = useState({});
  const [lockedInputs, setLockedInputs] = useState({});
  const [currentFocusedField, setCurrentFocusedField] = useState(null);

  const htgDenominations = [
    { label: '1000 HTG', value: 1000, color: 'bg-purple-600' },
    { label: '500 HTG', value: 500, color: 'bg-blue-600' },
    { label: '250 HTG', value: 250, color: 'bg-red-600' },
    { label: '200 HTG', value: 200, color: 'bg-amber-600' },
    { label: '100 HTG', value: 100, color: 'bg-green-600' },
    { label: '50 HTG', value: 50, color: 'bg-orange-600' },
    { label: '25 HTG', value: 25, color: 'bg-pink-600' },
    { label: '10 HTG', value: 10, color: 'bg-yellow-600' },
    { label: '5 HTG', value: 5, color: 'bg-teal-600' }
  ];

  const usdDenominations = [
    { label: '100 USD', value: 100, color: 'bg-purple-600' },
    { label: '50 USD', value: 50, color: 'bg-blue-600' },
    { label: '20 USD', value: 20, color: 'bg-red-600' },
    { label: '10 USD', value: 10, color: 'bg-green-600' },
    { label: '5 USD', value: 5, color: 'bg-orange-600' },
    { label: '2 USD', value: 2, color: 'bg-pink-600' },
    { label: '1 USD', value: 1, color: 'bg-yellow-600' },
    { label: '0.50 USD', value: 0.5, color: 'bg-teal-600' },
    { label: '0.25 USD', value: 0.25, color: 'bg-indigo-600' }
  ];

  const getDenominations = () => {
    if (!vendorState || !vendorState.currency) return htgDenominations;
    return vendorState.currency === 'HTG' ? htgDenominations : usdDenominations;
  };

  const getCurrency = () => {
    return vendorState?.currency || 'HTG';
  };

  useEffect(() => {
    const denominations = getDenominations();
    const initialInputs = {};
    denominations.forEach(denom => {
      if (gridInputs[denom.value] === undefined) {
        initialInputs[denom.value] = '';
      }
    });

    if (Object.keys(initialInputs).length > 0) {
      setGridInputs(prev => ({ ...prev, ...initialInputs }));
      setLockedInputs({});
    }
  }, [vendorState?.currency]);

  const handleGridInputChange = (denominationValue, value) => {
    if (lockedInputs[denominationValue]) return;
    if (value === '' || /^\d*$/.test(value)) {
      setGridInputs(prev => ({
        ...prev,
        [denominationValue]: value
      }));
    }
  };

  const handleGridInputFocus = (denominationValue) => {
    if (lockedInputs[denominationValue]) return false;
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

  const handleGridInputBlur = (denominationValue) => {
    const value = gridInputs[denominationValue];
    if (value && value !== '' && parseFloat(value) > 0) {
      setLockedInputs(prev => ({
        ...prev,
        [denominationValue]: true
      }));
    }
  };

  const unlockField = (denominationValue) => {
    setLockedInputs(prev => ({
      ...prev,
      [denominationValue]: false
    }));
  };

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

  const handleGridInputKeyPress = (denominationValue, multiplier, e) => {
    if (e.key === 'Enter' && multiplier && multiplier !== '' && parseFloat(multiplier) > 0) {
      handleAddSequence(vendeur, denominationValue, multiplier);
      const newInputs = { ...gridInputs };
      delete newInputs[denominationValue];
      setGridInputs(newInputs);
      const newLocks = { ...lockedInputs };
      delete newLocks[denominationValue];
      setLockedInputs(newLocks);
    }
  };

  const handleAddAllGridSequences = () => {
    const denominations = getDenominations();
    const entries = denominations
      .map(denom => ({
        denom,
        multiplier: gridInputs[denom.value]
      }))
      .filter(entry => entry.multiplier && entry.multiplier !== '' && parseFloat(entry.multiplier) > 0);

    if (entries.length === 0) return;
    entries.forEach(({ denom, multiplier }, index) => {
      setTimeout(() => {
        handleAddSequence(vendeur, denom.value, multiplier);
        if (index === entries.length - 1) {
          setTimeout(() => resetGridInputs(), 100);
        }
      }, index * 100);
    });
  };

  const handleEditSequence = (sequence) => {
    setEditingSequenceId(sequence.id);
    const note = sequence.note;
    const multiplierMatch = note.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
    if (multiplierMatch) {
      const [, multiplier, presetValue, currency] = multiplierMatch;
      const presetValueNum = parseFloat(presetValue);
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

  const handleCancelSequenceEdit = () => {
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
      handleCancelSequenceEdit();
    }
  };

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
    resetGridInputs();
  };

  const isEditingSequence = editingSequenceId !== null;
  const currency = getCurrency();
  const currentInputValue = vendorInputs[vendeur] || '';
  const denominations = getDenominations();
  const sortedDenominations = [...denominations].sort((a, b) => b.value - a.value);

  const firstColumnDenoms = [];
  const secondColumnDenoms = [];
  sortedDenominations.forEach((denom, index) => {
    if (index % 2 === 0) {
      firstColumnDenoms.push(denom);
    } else {
      secondColumnDenoms.push(denom);
    }
  });

  const gridTotal = calculateGridTotal();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currency === 'HTG' ? 'bg-blue-600' : 'bg-green-600'}`}></div>
          <span className="text-sm font-bold text-gray-900">Séquences</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600 flex flex-col items-end gap-0.5">
            {sequencesTotalByCurrency?.HTG > 0 && (
              <div className="text-blue-700 font-medium">
                {formaterArgent(sequencesTotalByCurrency.HTG)} HTG
              </div>
            )}
            {sequencesTotalByCurrency?.USD > 0 && (
              <div className="text-green-700 font-medium">
                {formaterArgent(sequencesTotalByCurrency.USD)} USD
              </div>
            )}
            {sequencesTotalByCurrency?.USD > 0 && totalSequencesHTG > 0 && (
              <div className="text-gray-500 text-[10px]">
                ≈ {formaterArgent(totalSequencesHTG)} HTG total
              </div>
            )}
          </div>
          {sequences.length > 0 && (
            <button
              onClick={() => handleClearSequences(vendeur)}
              className="p-1.5 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
              title="Effacer toutes les séquences"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Currency Selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleCurrencyChange('HTG')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
            currency === 'HTG'
              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Coins size={18} className={currency === 'HTG' ? 'text-blue-600' : 'text-gray-500'} />
          <span className="font-bold">HTG</span>
        </button>
        <button
          onClick={() => handleCurrencyChange('USD')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
            currency === 'USD'
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <DollarSign size={18} className={currency === 'USD' ? 'text-green-600' : 'text-gray-500'} />
          <span className="font-bold">USD</span>
        </button>
      </div>

      {/* Money Counter Grid */}
<div>
  <div className="flex items-center justify-between mb-4">
    <div>
      <div className="text-sm font-medium text-gray-600">Total compteur</div>
      <div className={`text-xl font-bold ${currency === 'HTG' ? 'text-blue-700' : 'text-green-700'}`}>
        {formaterArgent(gridTotal)} {currency}
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={resetGridInputs}
        className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2"
        title="Réinitialiser"
      >
        <RotateCcw size={14} />
        Reset
      </button>
      <button
        onClick={handleAddAllGridSequences}
        disabled={gridTotal === 0}
        className={`px-3 py-1.5 text-sm text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
          currency === 'HTG' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
        }`}
      >
        Tout ajouter
      </button>
    </div>
  </div>
</div>

        <div className="grid grid-cols-2 gap-3">
          {/* First Column */}
          <div className="space-y-3">
            {firstColumnDenoms.map((denom) => {
              const value = gridInputs[denom.value] || '';
              const isLocked = lockedInputs[denom.value];
              const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;

              return (
                <div 
                  key={`grid-${denom.value}`} 
                  className={`bg-white rounded-lg p-3 border ${isLocked ? 'border-green-500 shadow-sm' : 'border-gray-300'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`${denom.color} px-2 py-1 rounded-md flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{denom.value}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isLocked && (
                        <button
                          onClick={() => unlockField(denom.value)}
                          className="text-gray-500 hover:text-green-600"
                          title="Déverrouiller"
                        >
                          <Unlock size={14} />
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
                    onKeyPress={(e) => handleGridInputKeyPress(denom.value, value, e)}
                    className={`w-full text-sm font-bold rounded px-3 py-2 border focus:outline-none focus:ring-2 text-center ${
                      isLocked 
                        ? 'text-green-700 bg-green-50 border-green-200' 
                        : 'text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    placeholder="0"
                    disabled={isLocked}
                  />

                  <div className="text-sm font-bold text-gray-700 text-center mt-2">
                    {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Second Column */}
          <div className="space-y-3">
            {secondColumnDenoms.map((denom) => {
              const value = gridInputs[denom.value] || '';
              const isLocked = lockedInputs[denom.value];
              const totalForDenom = value && parseFloat(value) > 0 ? denom.value * parseFloat(value) : 0;

              return (
                <div 
                  key={`grid-${denom.value}`} 
                  className={`bg-white rounded-lg p-3 border ${isLocked ? 'border-green-500 shadow-sm' : 'border-gray-300'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`${denom.color} px-2 py-1 rounded-md flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{denom.value}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isLocked && (
                        <button
                          onClick={() => unlockField(denom.value)}
                          className="text-gray-500 hover:text-green-600"
                          title="Déverrouiller"
                        >
                          <Unlock size={14} />
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
                    onKeyPress={(e) => handleGridInputKeyPress(denom.value, value, e)}
                    className={`w-full text-sm font-bold rounded px-3 py-2 border focus:outline-none focus:ring-2 text-center ${
                      isLocked 
                        ? 'text-green-700 bg-green-50 border-green-200' 
                        : 'text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    placeholder="0"
                    disabled={isLocked}
                  />

                  <div className="text-sm font-bold text-gray-700 text-center mt-2">
                    {totalForDenom > 0 ? formaterArgent(totalForDenom) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sequences List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {sequences.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
            Aucune séquence ajoutée
          </div>
        ) : (
          sequences.map((sequence) => {
            const isEditing = sequence.id === editingSequenceId;

            return (
              <div 
                key={sequence.id} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isEditing
                    ? 'bg-amber-50 border border-amber-300'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full ${sequence.currency === 'USD' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{sequence.note}</div>
                    <div className="text-xs text-gray-500">{sequence.timestamp}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formaterArgent(sequence.amount)} {sequence.currency}
                  </div>
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEditedSequence}
                          disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                          className={`p-1.5 rounded ${
                            vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title="Sauvegarder"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={handleCancelSequenceEdit}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Annuler"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSequence(sequence)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Éditer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveSequence(vendeur, sequence.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <X size={14} />
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
      <div className="space-y-3">
        {/* Input Row */}
        <div className="flex items-stretch bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
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
                  if (isEditingSequence) {
                    handleSaveEditedSequence();
                  } else {
                    handleAddSequence(vendeur);
                  }
                }
              }}
              placeholder="Multiplicateur personnalisé"
              className="w-full px-4 py-3 text-sm bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Add/Update Button */}
          {isEditingSequence ? (
            <div className="flex border-l border-gray-300">
              <button
                onClick={handleSaveEditedSequence}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`px-4 flex items-center justify-center ${
                  vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Mettre à jour"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancelSequenceEdit}
                className="px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center border-l border-gray-300"
                title="Annuler"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddSequence(vendeur)}
              disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
              className={`px-4 flex items-center justify-center border-l border-gray-300 ${
                vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                  ? currency === 'HTG'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Ajouter"
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {/* Quick Preview */}
        {vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0 && (
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {vendorInputs[vendeur]} × {vendorState?.preset || '1'} {currency} = 
              <span className="font-bold text-gray-900 ml-1">
                {formaterArgent(calculatePresetAmount(vendeur))} {currency}
              </span>
            </div>
          </div>
        )}

        {/* Add Complete Deposit Button */}
        {sequences.length > 0 && !isEditingSequence && (
          <button
            onClick={() => handleAddCompleteDeposit(vendeur)}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm ${
              editingMode
                ? 'bg-gradient-to-r from-green-600 to-emerald-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-700'
            } text-white shadow-sm`}
          >
            <Plus size={16} />
            <span>{editingMode ? 'Mettre à jour dépôt' : 'Ajouter dépôt'}</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
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