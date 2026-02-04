import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { htgPresets, usdPresets } from './depositPresets';

import CurrencySelector from './CurrencySelector';
import MoneyCounterGrid from './MoneyCounterGrid';
import SequenceList from './SequenceList';
import MainInputSection from './MainInputSection';

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

  const handleAddSingleSequence = (presetValue, count) => {
    const value = count;
    const multiplier = parseFloat(value);

    if (!presetValue || !value || multiplier <= 0) return;

    // Add the sequence
    handleAddSequence(vendeur, presetValue, value);

    // Lock and clear the input for this denomination
    setLockedInputs(prev => ({
      ...prev,
      [presetValue]: true
    }));

    setGridInputs(prev => ({
      ...prev,
      [presetValue]: ''
    }));

    // Clear the focus
    setCurrentFocusedField(null);
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
  const gridTotal = calculateGridTotal();

  return (
    <div className="space-y-4">
      <CurrencySelector
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
      />

      <MoneyCounterGrid
        gridTotal={gridTotal}
        currency={currency}
        denominations={getDenominations()}
        gridInputs={gridInputs}
        lockedInputs={lockedInputs}
        onGridInputChange={handleGridInputChange}
        onGridInputFocus={handleGridInputFocus}
        onGridInputBlur={handleGridInputBlur}
        onGridInputKeyPress={handleGridInputKeyPress}
        onUnlockField={unlockField}
        onResetGrid={resetGridInputs}
        onAddAllGridSequences={handleAddAllGridSequences}
        onAddSingleSequence={handleAddSingleSequence}
      />

      <SequenceList 
        sequences={sequences}
        editingSequenceId={editingSequenceId}
        vendorInputs={vendorInputs}
        vendeur={vendeur}
        onEditSequence={handleEditSequence}
        onRemoveSequence={handleRemoveSequence}
        onSaveEditedSequence={handleSaveEditedSequence}
        onCancelSequenceEdit={handleCancelSequenceEdit}
        variant="card"
      />

      <MainInputSection
        vendeur={vendeur}
        vendorInputs={vendorInputs}
        vendorState={vendorState}
        currency={currency}
        isEditingSequence={isEditingSequence}
        sequences={sequences}
        sequencesTotalByCurrency={sequencesTotalByCurrency}
        editingMode={editingMode}
        onInputChange={handleInputChange}
        onSaveEditedSequence={handleSaveEditedSequence}
        onCancelSequenceEdit={handleCancelSequenceEdit}
        onAddSequence={handleAddSequence}
        onAddCompleteDeposit={handleAddCompleteDeposit}
        calculatePresetAmount={calculatePresetAmount}
      />
    </div>
  );
};

export default SequenceManager;