import React, { useState, useMemo } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, Layers, Target, AlertCircle, Plus, Trash2, Globe, ChevronDown } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';
import ChangeCombinations from './ChangeCombinations';

const CaisseRecuCard = ({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currencyType, setCurrencyType] = useState('HTG'); // 'HTG' or 'USD'
  const [cashSequences, setCashSequences] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('aucune'); // 'aucune' or preset value
  const [showPresets, setShowPresets] = useState(false);
  
  // Preset options for HTG (Gourdes) - including coin values
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

  // Preset options for USD
  const usdPresets = [
    { value: '1', label: '1' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  // Quick add amounts (original functionality - adds directly)
  const htgQuickAdds = [100, 250, 500, 1000];
  const usdQuickAdds = [1, 5, 10, 20];
  const quickAddAmounts = currencyType === 'HTG' ? htgQuickAdds : usdQuickAdds;

  // Get current presets based on currency
  const currentPresets = currencyType === 'HTG' ? htgPresets : usdPresets;

  // Check if "Aucune" is selected (direct amount entry)
  const isDirectAmount = selectedPreset === 'aucune';

  // Calculate total cash received from all sequences (converted to HTG)
  const totalCashRecuHTG = useMemo(() => {
    return cashSequences.reduce((sum, seq) => {
      if (seq.currency === 'USD') {
        return sum + (parseFloat(seq.amount) * tauxUSD || 0);
      }
      return sum + (parseFloat(seq.amount) || 0);
    }, 0);
  }, [cashSequences, tauxUSD]);

  // Calculate total in original currencies for display
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

  const changeNeeded = totalCashRecuHTG - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Handle adding a new cash sequence
  const handleAddSequence = () => {
    let amount = 0;
    let displayAmount = '';
    let note = '';

    if (isDirectAmount) {
      // Direct amount entry mode
      amount = parseFloat(inputValue) || 0;
      displayAmount = amount.toString();
      note = `${amount} ${currencyType}`;
    } else {
      // Preset multiplier mode
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        // Calculate amount based on preset
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(selectedPreset);
        amount = presetValue * multiplier;
        displayAmount = amount.toString();
        note = `${multiplier} × ${selectedPreset} ${currencyType}`;
      } else {
        // If no input value, just use the preset value (as single item)
        amount = parseFloat(selectedPreset);
        displayAmount = amount.toString();
        note = `${selectedPreset} ${currencyType}`;
      }
    }

    // Round to 2 decimal places for USD
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
      
      // RESET to "aucune" after adding a sequence with multiplier
      if (!isDirectAmount && inputValue) {
        setSelectedPreset('aucune');
      }
    }
  };

  // Handle removing a sequence
  const handleRemoveSequence = (id) => {
    setCashSequences(prev => prev.filter(seq => seq.id !== id));
  };

  // Handle clearing all sequences
  const handleClearAll = () => {
    setCashSequences([]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle currency toggle
  const handleCurrencyToggle = () => {
    setCurrencyType(prev => {
      const newCurrency = prev === 'HTG' ? 'USD' : 'HTG';
      // Reset to "aucune" when changing currency
      setSelectedPreset('aucune');
      setInputValue('');
      return newCurrency;
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSequence();
    }
  };

  // Handle quick add button click (ORIGINAL FUNCTIONALITY - adds directly)
  const handleQuickAdd = (amount) => {
    const newSequence = {
      id: Date.now(),
      amount: amount,
      currency: currencyType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
      note: `${amount} ${currencyType}`
    };
    setCashSequences(prev => [...prev, newSequence]);
  };

  // Handle preset selection
  const handlePresetSelect = (presetValue) => {
    setSelectedPreset(presetValue);
    setShowPresets(false);
    // Clear input when switching to direct amount mode
    if (presetValue === 'aucune') {
      setInputValue('');
    } else {
      // Auto-focus input when selecting a preset
      setTimeout(() => {
        const input = document.querySelector('input[type="number"]');
        if (input) input.focus();
      }, 100);
    }
  };

  const formatDepositDisplay = (depot) => {
    if (!depot) return '';

    if (typeof depot === 'object' && depot.devise === 'USD') {
      const montantUSD = parseFloat(depot.montant) || 0;
      const montantHTG = montantUSD * tauxUSD;
      return `${montantUSD} USD (${formaterArgent(montantHTG)} HTG)`;
    } else {
      const montantHTG = parseFloat(depot) || 0;
      return `${formaterArgent(montantHTG)} HTG`;
    }
  };

  const depositBreakdown = sellerDeposits.map((depot, index) => ({
    id: index + 1,
    display: formatDepositDisplay(depot),
    isUSD: typeof depot === 'object' && depot.devise === 'USD'
  }));

  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

  // Get selected preset display text
  const getSelectedPresetText = () => {
    if (selectedPreset === 'aucune') {
      return 'Entrer montant libre';
    }
    const preset = currentPresets.find(p => p.value === selectedPreset);
    return preset ? `× ${preset.label} ${currencyType}` : 'Sélectionner';
  };

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

      {/* Total Deposits Row - Standalone above deposits */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Layers size={12} className="text-white opacity-90" />
              <p className="text-xs opacity-90">Total Dépôts:</p>
            </div>
            <p className="text-sm font-bold">{formaterArgent(totalDeposits)} HTG</p>
          </div>
        </div>
      )}

      {/* Deposits Breakdown Card */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 space-y-1">
          <div className="flex items-center gap-1 mb-1">
            <Calculator size={12} className="text-white opacity-90" />
            <p className="text-xs opacity-90">Détail des dépôts:</p>
          </div>

          {/* Deposit breakdown */}
          <div className="space-y-1">
            {depositBreakdown.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    deposit.isUSD ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="opacity-80">Dépôt {deposit.id}:</span>
                </div>
                <span className="font-medium opacity-90 text-right text-[11px]">{deposit.display}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espèces Attendues Row - Standalone below deposits */}
      <div className={`rounded-lg p-2 mb-2 ${
        especesAttendues > 0 
          ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30' 
          : especesAttendues < 0 
          ? 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30'
          : 'bg-white bg-opacity-10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Target size={12} className={
              especesAttendues > 0 
                ? 'text-green-300' 
                : especesAttendues < 0 
                ? 'text-red-300'
                : 'text-white opacity-90'
            } />
            <p className="text-xs opacity-90">Espèces attendues:</p>
          </div>
          <p className={`text-sm font-bold ${
            especesAttendues > 0 
              ? 'text-green-300' 
              : especesAttendues < 0 
              ? 'text-red-300'
              : 'text-white'
          }`}>
            {formaterArgent(especesAttendues)} HTG
          </p>
        </div>
      </div>

      {/* Cash Sequences Section */}
      <div className="mb-3">
        {/* Exchange Rate Info */}
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Globe size={12} className="text-blue-300" />
            <p className="text-xs opacity-90">Taux USD:</p>
          </div>
          <p className="text-sm font-bold text-blue-300">1 USD = {tauxUSD} HTG</p>
        </div>

        {/* Total Cash Received Summary */}
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

            {/* Breakdown by currency - VERTICAL LAYOUT */}
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

        {/* Input field for adding cash sequences with preset selector */}
        <div className="relative mb-2">
          {/* Currency selector and label */}
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
              
              {/* Dropdown menu with grid layout - SIMILAR STYLE TO QUICK ADD BUTTONS */}
              {showPresets && (
                <div className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg overflow-hidden border ${
                  currencyType === 'HTG'
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-green-900 border-green-700'
                }`}>
                  {/* "Aucune" option - full width */}
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
                  
                  {/* Grid of presets - SAME STYLE AS QUICK ADD BUTTONS */}
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
            
            {/* Helper text */}
            <p className="text-[10px] opacity-70 mt-1 text-center">
              {isDirectAmount 
                ? "Entrez directement le montant" 
                : `Sélectionnez un montant et entrez un multiplicateur (ex: 33 × ${selectedPreset})`}
            </p>
          </div>

          {/* Input with Add button - Different layout based on mode */}
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
          
          {/* Preview of calculation */}
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
        
        {/* Quick add buttons (ORIGINAL FUNCTIONALITY - adds directly) */}
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

          {/* Warning if has remainder */}
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

          {/* Use the refactored ChangeCombinations component */}
          {shouldGiveChange && (
            <ChangeCombinations 
              changeNeeded={changeNeeded}
              shouldGiveChange={shouldGiveChange}
            />
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

      {/* Add some custom styles for better mobile experience */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default CaisseRecuCard;