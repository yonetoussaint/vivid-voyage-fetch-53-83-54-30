// components/easy/CaisseRecuCard.js
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, 
  Layers, Target, AlertCircle, Plus, Trash2, Globe, ChevronDown, 
  RefreshCw, ArrowRightLeft, Loader2 
} from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';
import ChangeCombinations from './ChangeCombinations';

const CaisseRecuCard = React.memo(({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132
}) => {
  // State
  const [inputValue, setInputValue] = useState('');
  const [currencyType, setCurrencyType] = useState('HTG');
  const [cashSequences, setCashSequences] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('aucune');
  const [showPresets, setShowPresets] = useState(false);
  const [showRoundAmount, setShowRoundAmount] = useState(false);
  const [roundAmount, setRoundAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Refs for debouncing
  const inputDebounceRef = useRef(null);
  const calculationTimeoutRef = useRef(null);

  // Presets
  const htgPresets = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '250', label: '250' },
    { value: '500', label: '500' },
    { value: '1000', label: '1,000' },
    { value: '5000', label: '5,000' },
    { value: '10000', label: '10k' },
    { value: '25000', label: '25k' },
    { value: '50000', label: '50k' },
    { value: '100000', label: '100k' }
  ];

  const usdPresets = [
    { value: '1', label: '1' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  // Quick adds
  const htgQuickAdds = [100, 250, 500, 1000];
  const usdQuickAdds = [1, 5, 10, 20];
  const quickAddAmounts = currencyType === 'HTG' ? htgQuickAdds : usdQuickAdds;
  const currentPresets = currencyType === 'HTG' ? htgPresets : usdPresets;
  const isDirectAmount = selectedPreset === 'aucune';
  const commonRoundAmounts = [50, 100, 250, 500, 1000, 2000, 5000, 10000];

  // Format deposit display with caching
  const formatDepositDisplay = useCallback((depot) => {
    if (!depot) return '';
    
    try {
      if (typeof depot === 'object' && depot.devise === 'USD') {
        const montantUSD = parseFloat(depot.montant) || 0;
        const montantHTG = montantUSD * tauxUSD;
        return `${montantUSD.toFixed(2)} USD (${formaterArgent(montantHTG)} HTG)`;
      }

      if (typeof depot === 'object' && depot.value !== undefined) {
        const montantHTG = parseFloat(depot.value) || 0;
        return `${formaterArgent(montantHTG)} HTG`;
      }

      const montantHTG = parseFloat(depot) || 0;
      return `${formaterArgent(montantHTG)} HTG`;
    } catch (error) {
      return 'Erreur de formatage';
    }
  }, [tauxUSD]);

  // Memoized calculations
  const depositBreakdown = useMemo(() => {
    if (!Array.isArray(sellerDeposits)) return [];
    
    return sellerDeposits
      .filter(depot => depot != null)
      .map((depot, index) => {
        const isUSD = typeof depot === 'object' && depot.devise === 'USD';
        let amountInHTG = 0;
        
        if (isUSD) {
          const montantUSD = parseFloat(depot.montant) || 0;
          amountInHTG = montantUSD * tauxUSD;
        } else if (typeof depot === 'object' && depot.value !== undefined) {
          amountInHTG = parseFloat(depot.value) || 0;
        } else {
          amountInHTG = parseFloat(depot) || 0;
        }
        
        return {
          id: index + 1,
          display: formatDepositDisplay(depot),
          isUSD,
          amountInHTG
        };
      });
  }, [sellerDeposits, tauxUSD, formatDepositDisplay]);

  const calculatedTotalDepositsHTG = useMemo(() => {
    return depositBreakdown.reduce((sum, deposit) => sum + deposit.amountInHTG, 0);
  }, [depositBreakdown]);

  const calculatedEspecesAttendues = useMemo(() => {
    return totalAjustePourCaisse - calculatedTotalDepositsHTG;
  }, [totalAjustePourCaisse, calculatedTotalDepositsHTG]);

  const totalCashRecuHTG = useMemo(() => {
    return cashSequences.reduce((sum, seq) => {
      if (seq.currency === 'USD') {
        return sum + (parseFloat(seq.amount) * tauxUSD || 0);
      }
      return sum + (parseFloat(seq.amount) || 0);
    }, 0);
  }, [cashSequences, tauxUSD]);

  const totalHTG = useMemo(() => {
    return cashSequences
      .filter(seq => seq.currency === 'HTG')
      .reduce((sum, seq) => sum + (parseFloat(seq.amount) || 0), 0);
  }, [cashSequences]);

  const totalUSD = useMemo(() => {
    return cashSequences
      .filter(seq => seq.currency === 'USD')
      .reduce((sum, seq) => sum + (parseFloat(seq.amount) || 0), 0);
  }, [cashSequences]);

  const changeNeeded = totalCashRecuHTG - calculatedEspecesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Givable amount calculation
  const givableAmount = useMemo(() => {
    return getMaximumGivableAmount(changeNeeded);
  }, [changeNeeded]);

  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

  // Round amount details
  const roundAmountDetails = useMemo(() => {
    if (!roundAmount || !shouldGiveChange || changeNeeded <= 0) return null;
    
    const desiredAmount = parseFloat(roundAmount);
    const currentChange = changeNeeded;
    
    if (isNaN(desiredAmount) || desiredAmount <= 0) return null;
    
    const customerAdds = desiredAmount - currentChange;
    
    return {
      desiredAmount,
      currentChange,
      customerAdds,
      isValid: customerAdds >= 0,
      message: customerAdds >= 0 
        ? `Le client vous donne ${formaterArgent(customerAdds)} HTG de plus pour recevoir ${formaterArgent(desiredAmount)} HTG`
        : `Impossible: ${formaterArgent(desiredAmount)} HTG est moins que ${formaterArgent(currentChange)} HTG dû`
    };
  }, [roundAmount, changeNeeded, shouldGiveChange]);

  // Selected preset text
  const getSelectedPresetText = () => {
    if (selectedPreset === 'aucune') {
      return 'Entrer montant libre';
    }
    const preset = currentPresets.find(p => p.value === selectedPreset);
    return preset ? `× ${preset.label} ${currencyType}` : 'Sélectionner';
  };

  // Debounced input handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear existing debounce
    if (inputDebounceRef.current) {
      clearTimeout(inputDebounceRef.current);
    }
    
    // Only trigger heavy calculations after a delay
    if (parseFloat(value) > 1000) {
      inputDebounceRef.current = setTimeout(() => {
        // Re-trigger calculations if needed
      }, 500);
    }
  }, []);

  // Add sequence handler
  const handleAddSequence = useCallback(() => {
    let amount = 0;
    let displayAmount = '';
    let note = '';

    if (isDirectAmount) {
      amount = parseFloat(inputValue) || 0;
      displayAmount = amount.toString();
      note = `${amount} ${currencyType}`;
    } else {
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(selectedPreset);
        amount = presetValue * multiplier;
        displayAmount = amount.toString();
        note = `${multiplier} × ${selectedPreset} ${currencyType}`;
      } else {
        amount = parseFloat(selectedPreset);
        displayAmount = amount.toString();
        note = `${selectedPreset} ${currencyType}`;
      }
    }

    if (currencyType === 'USD') {
      amount = parseFloat(amount.toFixed(2));
      displayAmount = amount.toFixed(2);
    }

    if (amount > 0) {
      const newSequence = {
        id: Date.now(),
        amount: amount,
        currency: currencyType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
        note: note
      };
      
      setCashSequences(prev => [...prev, newSequence]);
      setInputValue('');
      
      if (!isDirectAmount && inputValue) {
        setSelectedPreset('aucune');
      }
    }
  }, [inputValue, currencyType, selectedPreset, isDirectAmount, tauxUSD]);

  // Remove sequence handler
  const handleRemoveSequence = useCallback((id) => {
    setCashSequences(prev => prev.filter(seq => seq.id !== id));
  }, []);

  // Clear all sequences
  const handleClearAll = useCallback(() => {
    setCashSequences([]);
  }, []);

  // Currency toggle
  const handleCurrencyToggle = useCallback(() => {
    setCurrencyType(prev => {
      const newCurrency = prev === 'HTG' ? 'USD' : 'HTG';
      setSelectedPreset('aucune');
      setInputValue('');
      return newCurrency;
    });
  }, []);

  // Key press handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAddSequence();
    }
  }, [handleAddSequence]);

  // Quick add handler
  const handleQuickAdd = useCallback((amount) => {
    const newSequence = {
      id: Date.now(),
      amount: amount,
      currency: currencyType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
      note: `${amount} ${currencyType}`
    };
    setCashSequences(prev => [...prev, newSequence]);
  }, [currencyType, tauxUSD]);

  // Preset selection handler
  const handlePresetSelect = useCallback((presetValue) => {
    setSelectedPreset(presetValue);
    setShowPresets(false);
    
    if (presetValue === 'aucune') {
      setInputValue('');
    } else {
      setTimeout(() => {
        const input = document.querySelector('input[type="number"]');
        if (input) input.focus();
      }, 100);
    }
  }, []);

  // Round amount handlers
  const handleRoundAmountSelect = useCallback((amount) => {
    setRoundAmount(amount.toString());
    setShowRoundAmount(true);
  }, []);

  const handleResetRoundAmount = useCallback(() => {
    setRoundAmount('');
  }, []);

  const handleApplyRoundAmount = useCallback(() => {
    if (!roundAmountDetails || !roundAmountDetails.isValid) return;
    
    const extraAmount = roundAmountDetails.customerAdds;
    if (extraAmount > 0) {
      const newSequence = {
        id: Date.now(),
        amount: extraAmount,
        currency: 'HTG',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: extraAmount,
        note: `Client ajoute pour arrondir à ${formaterArgent(roundAmountDetails.desiredAmount)} HTG`
      };
      setCashSequences(prev => [...prev, newSequence]);
    }
    
    setRoundAmount('');
  }, [roundAmountDetails]);

  // Set calculating state for large amounts
  useEffect(() => {
    if (shouldGiveChange && changeNeeded > 1000) {
      setIsCalculating(true);
      
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
      
      calculationTimeoutRef.current = setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    } else {
      setIsCalculating(false);
    }
    
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
      if (inputDebounceRef.current) {
        clearTimeout(inputDebounceRef.current);
      }
    };
  }, [changeNeeded, shouldGiveChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (inputDebounceRef.current) clearTimeout(inputDebounceRef.current);
      if (calculationTimeoutRef.current) clearTimeout(calculationTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`rounded-xl p-3 shadow-lg mb-3 ${
      isPropane 
        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
    } text-white`}>
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          {isPropane ? <Receipt size={14} /> : <Wallet size={14} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">CAISSE REÇU</p>
          <p className="text-[10px] opacity-80">
            {isPropane ? 'Argent reçu pour propane' : 'Argent donné par le vendeur'}
          </p>
        </div>
        {vendeurActuel && (
          <div className="text-right">
            <p className="text-[10px] opacity-80">Vendeur</p>
            <p className="text-xs font-bold truncate max-w-[80px]">{vendeurActuel}</p>
          </div>
        )}
      </div>

      {/* Total Deposits Row */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Layers size={12} className="text-white opacity-90" />
              <p className="text-xs opacity-90">Total Dépôts:</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{formaterArgent(calculatedTotalDepositsHTG)} HTG</p>
            </div>
          </div>
        </div>
      )}

      {/* Deposits Breakdown */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 space-y-1">
          <div className="flex items-center gap-1 mb-1">
            <Calculator size={12} className="text-white opacity-90" />
            <p className="text-xs opacity-90">Détail des dépôts:</p>
          </div>
          <div className="space-y-1">
            {depositBreakdown.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    deposit.isUSD ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="opacity-80">Dépôt {deposit.id}:</span>
                </div>
                <span className="font-medium opacity-90 text-right text-[11px]">
                  {deposit.display}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espèces Attendues */}
      <div className={`rounded-lg p-2 mb-2 ${
        calculatedEspecesAttendues > 0 
          ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30' 
          : calculatedEspecesAttendues < 0 
          ? 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30'
          : 'bg-white bg-opacity-10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Target size={12} className={
              calculatedEspecesAttendues > 0 
                ? 'text-green-300' 
                : calculatedEspecesAttendues < 0 
                ? 'text-red-300'
                : 'text-white opacity-90'
            } />
            <p className="text-xs opacity-90">Espèces attendues:</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${
              calculatedEspecesAttendues > 0 
                ? 'text-green-300' 
                : calculatedEspecesAttendues < 0 
                ? 'text-red-300'
                : 'text-white'
            }`}>
              {formaterArgent(calculatedEspecesAttendues)} HTG
            </p>
            <p className="text-[10px] opacity-60">
              {formaterArgent(totalAjustePourCaisse)} HTG - {formaterArgent(calculatedTotalDepositsHTG)} HTG
            </p>
          </div>
        </div>
      </div>

      {/* Cash Sequences Section */}
      <div className="mb-3">
        {/* Exchange Rate */}
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Globe size={12} className="text-blue-300" />
            <p className="text-xs opacity-90">Taux USD:</p>
          </div>
          <p className="text-sm font-bold text-blue-300">1 USD = {tauxUSD} HTG</p>
        </div>

        {/* Total Cash Received */}
        {cashSequences.length > 0 && (
          <div className="bg-green-500 bg-opacity-20 rounded-lg p-2 mb-2 border border-green-400 border-opacity-30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <DollarSign size={12} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Total reçu:</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-green-300">{formaterArgent(totalCashRecuHTG)} HTG</p>
                <button
                  onClick={handleClearAll}
                  className="p-1 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                  title="Effacer toutes les séquences"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5">
                <div className="flex items-center justify-between">
                  <span className="opacity-80">Total HTG:</span>
                  <span className="font-bold text-blue-300">{formaterArgent(totalHTG)} HTG</span>
                </div>
              </div>
              <div className="bg-green-500 bg-opacity-10 rounded p-1.5">
                <div className="flex items-center justify-between">
                  <span className="opacity-80">Total USD:</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-green-300">
                      {totalUSD.toFixed(2)} USD
                    </span>
                    <span className="text-[9px] opacity-70 mt-0.5">
                      ({formaterArgent(totalUSD * tauxUSD)} HTG)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] opacity-80 mt-2 text-green-300">
              {cashSequences.length} séquence{cashSequences.length !== 1 ? 's' : ''} ajoutée{cashSequences.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Cash Sequences List */}
        {cashSequences.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 max-h-32 overflow-y-auto">
            <div className="space-y-1">
              {cashSequences.map((sequence, index) => (
                <div key={sequence.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      sequence.currency === 'USD' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="opacity-80">Séquence {index + 1}:</span>
                    <span className="text-[10px] opacity-60">{sequence.timestamp}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      sequence.currency === 'USD' 
                        ? 'bg-green-500 bg-opacity-20 text-green-300' 
                        : 'bg-blue-500 bg-opacity-20 text-blue-300'
                    }`}>
                      {sequence.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className={`font-medium ${
                        sequence.currency === 'USD' ? 'text-green-300' : 'text-blue-300'
                      }`}>
                        {sequence.currency === 'USD' ? '$' : ''}{formaterArgent(sequence.amount)} {sequence.currency}
                      </span>
                      {sequence.currency === 'USD' && (
                        <p className="text-[10px] opacity-60">
                          = {formaterArgent(sequence.convertedToHTG)} HTG
                        </p>
                      )}
                      {sequence.note && (
                        <p className="text-[9px] opacity-50 mt-0.5">
                          {sequence.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveSequence(sequence.id)}
                      className="p-0.5 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                      title="Retirer cette séquence"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="relative mb-2">
          {/* Currency selector */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCurrencyToggle}
                className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                  currencyType === 'HTG' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {currencyType === 'HTG' ? (
                  <>
                    <DollarSign size={10} />
                    HTG
                  </>
                ) : (
                  <>
                    <Globe size={10} />
                    USD
                  </>
                )}
              </button>
              <span className="text-xs opacity-80">
                {currencyType === 'HTG' ? 'Gourdes Haïtiennes' : 'Dollars US'}
              </span>
            </div>
            <span className="text-xs opacity-70">
              Taux: 1 USD = {tauxUSD} HTG
            </span>
          </div>

          {/* Preset selector */}
          <div className="mb-2">
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className={`w-full px-3 py-2 text-left rounded-lg flex items-center justify-between transition-colors ${
                  currencyType === 'HTG'
                    ? 'bg-blue-500 bg-opacity-20 hover:bg-opacity-30 border border-blue-400 border-opacity-30'
                    : 'bg-green-500 bg-opacity-20 hover:bg-opacity-30 border border-green-400 border-opacity-30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    currencyType === 'HTG' ? 'text-blue-300' : 'text-green-300'
                  }`}>
                    {getSelectedPresetText()}
                  </span>
                </div>
                <ChevronDown 
                  size={12} 
                  className={`transition-transform ${showPresets ? 'rotate-180' : ''} ${
                    currencyType === 'HTG' ? 'text-blue-300' : 'text-green-300'
                  }`} 
                />
              </button>

              {/* Preset dropdown */}
              {showPresets && (
                <div className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg overflow-hidden border ${
                  currencyType === 'HTG'
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-green-900 border-green-700'
                }`}>
                  <button
                    onClick={() => handlePresetSelect('aucune')}
                    className={`w-full px-3 py-3 text-left text-xs hover:bg-opacity-50 transition-colors flex items-center justify-between border-b ${
                      currencyType === 'HTG' ? 'border-blue-700' : 'border-green-700'
                    } ${
                      selectedPreset === 'aucune'
                        ? currencyType === 'HTG'
                          ? 'bg-blue-700 text-white'
                          : 'bg-green-700 text-white'
                        : currencyType === 'HTG'
                          ? 'hover:bg-blue-800 text-blue-100'
                          : 'hover:bg-green-800 text-green-100'
                    }`}
                  >
                    <span>Entrer montant libre</span>
                    {isDirectAmount && (
                      <span className="text-[10px] opacity-70">✓</span>
                    )}
                  </button>

                  <div className="p-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      {currentPresets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => handlePresetSelect(preset.value)}
                          className={`px-2 py-2 text-xs font-medium rounded border transition-colors flex items-center justify-center ${
                            currencyType === 'HTG'
                              ? 'bg-blue-500 bg-opacity-10 hover:bg-opacity-20 border-blue-400 border-opacity-30 text-blue-300'
                              : 'bg-green-500 bg-opacity-10 hover:bg-opacity-20 border-green-400 border-opacity-30 text-green-300'
                          } ${selectedPreset === preset.value ? 'ring-1 ring-white ring-opacity-50' : ''}`}
                          title={`${preset.label} ${currencyType}`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] opacity-70 mt-1 text-center">
              {isDirectAmount 
                ? "Entrez directement le montant" 
                : `Sélectionnez un montant et entrez un multiplicateur (ex: 33 × ${selectedPreset})`}
            </p>
          </div>

          {/* Input with Add button */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white font-bold text-xs">
                {isDirectAmount ? (
                  currencyType === 'HTG' ? 'HTG' : 'USD'
                ) : (
                  '×'
                )}
              </span>
            </div>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                isDirectAmount 
                  ? `Montant en ${currencyType}...` 
                  : 'Multiplicateur (ex: 33)...'
              }
              className="w-full pl-10 pr-20 py-2.5 text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
              <button
                onClick={handleAddSequence}
                disabled={!inputValue || parseFloat(inputValue) <= 0}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                  inputValue && parseFloat(inputValue) > 0
                    ? currencyType === 'HTG' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                <Plus size={12} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Preview */}
          {!isDirectAmount && inputValue && !isNaN(parseFloat(inputValue)) && selectedPreset && selectedPreset !== 'aucune' && (
            <div className="mt-2 bg-white bg-opacity-10 rounded p-2 text-center">
              <p className="text-xs opacity-90">
                {inputValue} × {selectedPreset} {currencyType} = {formaterArgent(parseFloat(selectedPreset) * parseFloat(inputValue))} {currencyType}
              </p>
              {currencyType === 'USD' && (
                <p className="text-[10px] opacity-70">
                  ({formaterArgent(parseFloat(selectedPreset) * parseFloat(inputValue) * tauxUSD)} HTG)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick add buttons */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {quickAddAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAdd(amount)}
              className={`px-2 py-1.5 text-xs font-medium rounded border transition-colors ${
                currencyType === 'USD'
                  ? 'bg-green-500 bg-opacity-10 hover:bg-opacity-20 border-green-400 border-opacity-30 text-green-300'
                  : 'bg-blue-500 bg-opacity-10 hover:bg-opacity-20 border-blue-400 border-opacity-30 text-blue-300'
              }`}
              title={`Ajouter ${amount} ${currencyType}`}
            >
              +{currencyType === 'USD' ? '$' : ''}{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Change calculation */}
      {cashSequences.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-3">
          {/* Change summary */}
          <div className={`flex items-center justify-between pb-2 border-b border-white border-opacity-20 ${
            shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
          }`}>
            <div className="flex items-center gap-1">
              {shouldGiveChange ? (
                <TrendingUp size={12} />
              ) : isShort ? (
                <TrendingDown size={12} />
              ) : (
                <DollarSign size={12} />
              )}
              <p className="text-xs font-bold">
                {shouldGiveChange ? 'À rendre:' : isShort ? 'Manquant:' : 'Exact'}
              </p>
            </div>
            <p className={`text-sm font-bold ${
              shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
            }`}>
              {formaterArgent(Math.abs(changeNeeded))} HTG
            </p>
          </div>

          {/* Warning for remainder */}
          {shouldGiveChange && hasRemainder && (
            <div className="bg-amber-500 bg-opacity-20 rounded-lg p-2 border border-amber-400 border-opacity-30">
              <div className="flex items-start gap-1.5">
                <AlertCircle size={12} className="text-amber-300 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300 mb-0.5">
                    Note: Reste à abandonner
                  </p>
                  <p className="text-[10px] opacity-90 leading-tight">
                    Avec des billets/monnaie de 5 HTG minimum, on ne peut rendre que {formaterArgent(givableAmount)} HTG.
                    <span className="block mt-0.5 font-bold text-amber-200">
                      Le vendeur doit abandonner: {formaterArgent(remainder)} HTG
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Change Combinations - with loading state */}
          {shouldGiveChange && (
            <>
              {isCalculating ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span className="ml-2 text-xs opacity-70">Calcul des combinaisons...</span>
                  </div>
                </div>
              ) : (
                <ChangeCombinations 
                  changeNeeded={changeNeeded}
                  shouldGiveChange={shouldGiveChange}
                />
              )}

              {/* Round Amount Preference */}
              <div className="border-t border-white border-opacity-20 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <ArrowRightLeft size={12} className="text-purple-300" />
                    <p className="text-xs font-bold text-purple-300">Arrondir le montant</p>
                  </div>
                  {roundAmount ? (
                    <button
                      onClick={handleResetRoundAmount}
                      className="p-1 hover:bg-gray-500 hover:bg-opacity-30 rounded text-gray-300 hover:text-gray-200 transition-colors"
                      title="Réinitialiser"
                    >
                      <RefreshCw size={10} />
                    </button>
                  ) : null}
                </div>

                <p className="text-[10px] opacity-80 mb-2 text-center">
                  Le client veut recevoir un montant rond (ex: 50 au lieu de 45 HTG)
                </p>

                {/* Round amount input */}
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={12} className="text-purple-300" />
                  </div>
                  <input
                    type="number"
                    value={roundAmount}
                    onChange={(e) => setRoundAmount(e.target.value)}
                    placeholder="Montant désiré par le client (ex: 50, 100, 500)..."
                    className="w-full pl-10 pr-20 py-2 text-sm font-bold bg-white bg-opacity-15 border border-purple-400 border-opacity-50 rounded-lg text-white placeholder-purple-200 placeholder-opacity-70 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
                  />
                  {roundAmountDetails && roundAmountDetails.isValid && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                      <button
                        onClick={handleApplyRoundAmount}
                        className="px-2 py-1.5 rounded-md text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1 transition-colors"
                        title="Appliquer cet arrangement"
                      >
                        <Plus size={10} />
                        Appliquer
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick round amount buttons */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {commonRoundAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleRoundAmountSelect(amount)}
                      className="px-1 py-1.5 text-xs font-medium rounded bg-purple-500 bg-opacity-10 hover:bg-opacity-20 border border-purple-400 border-opacity-30 text-purple-300 transition-colors"
                      title={`Arrondir à ${amount} HTG`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Round amount calculation result */}
                {roundAmountDetails && (
                  <div className={`rounded-lg p-2 ${
                    roundAmountDetails.isValid
                      ? 'bg-purple-500 bg-opacity-20 border border-purple-400 border-opacity-30'
                      : 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30'
                  }`}>
                    <div className="flex items-start gap-1.5">
                      {roundAmountDetails.isValid ? (
                        <ArrowRightLeft size={12} className="text-purple-300 mt-0.5" />
                      ) : (
                        <AlertCircle size={12} className="text-red-300 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-xs font-bold mb-0.5 ${
                          roundAmountDetails.isValid ? 'text-purple-300' : 'text-red-300'
                        }`}>
                          {roundAmountDetails.isValid ? 'Échange proposé:' : 'Impossible:'}
                        </p>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex justify-between items-center">
                            <span className="opacity-80">Actuellement dû:</span>
                            <span className="font-bold">{formaterArgent(roundAmountDetails.currentChange)} HTG</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="opacity-80">Le client veut recevoir:</span>
                            <span className="font-bold text-purple-300">{formaterArgent(roundAmountDetails.desiredAmount)} HTG</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-white border-opacity-10">
                            <span className="opacity-80">Le client doit vous donner:</span>
                            <span className={`font-bold ${
                              roundAmountDetails.isValid ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {roundAmountDetails.isValid ? '+' : ''}{formaterArgent(Math.abs(roundAmountDetails.customerAdds))} HTG
                            </span>
                          </div>
                          <p className={`text-[10px] mt-1 pt-1 border-t border-white border-opacity-10 ${
                            roundAmountDetails.isValid ? 'text-purple-200' : 'text-red-300'
                          }`}>
                            {roundAmountDetails.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* No change needed */}
          {!shouldGiveChange && (
            <div className="text-center pt-1">
              {isShort ? (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-red-300">Doit donner plus d'argent</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Manque {formaterArgent(Math.abs(changeNeeded))} HTG
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-emerald-300">Montant exact</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Aucune monnaie à rendre
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {cashSequences.length === 0 && (
        <div className="bg-white bg-opacity-5 rounded-lg p-2 text-center">
          <p className="text-[10px] opacity-70">
            {selectedPreset === 'aucune' 
              ? 'Entrez directement le montant ou utilisez les boutons rapides' 
              : 'Sélectionnez un montant, entrez un multiplicateur ou utilisez les boutons rapides'}
          </p>
          <p className="text-[9px] opacity-50 mt-0.5">
            {selectedPreset === 'aucune'
              ? 'Ex: Entrez "1250" pour ajouter 1,250 HTG'
              : `Ex: Sélectionnez "1,000", entrez "33" → 33,000 ${currencyType}`}
          </p>
        </div>
      )}
    </div>
  );
});

CaisseRecuCard.displayName = 'CaisseRecuCard';

export default CaisseRecuCard;