import React, { useState, useEffect } from 'react';
import { DollarSign, User, Plus, Minus, Globe, ChevronDown, List, X, Trash2, Check } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132; // Fixed exchange rate: 1 USD = 132 HTG
  const depotsActuels = tousDepots[shift] || {};

  // State for each vendor's input
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [showPresetsForVendor, setShowPresetsForVendor] = useState(null);
  const [depositSequences, setDepositSequences] = useState({});
  const [showSequenceManager, setShowSequenceManager] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState({});

  // Preset options for HTG (Gourdes)
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

  // Function to convert USD to HTG
  const convertirUSDversHTG = (montantUSD) => {
    return (parseFloat(montantUSD) || 0) * TAUX_DE_CHANGE;
  };

  // Helper function to get deposit amount in HTG
  const getMontantHTG = (depot) => {
    if (!depot) return 0;

    if (typeof depot === 'object' && depot.devise === 'USD') {
      return convertirUSDversHTG(depot.montant);
    }

    // For HTG deposits with breakdown
    if (typeof depot === 'object' && depot.value) {
      return parseFloat(depot.value) || 0;
    }

    // Always return a number for HTG deposits
    return parseFloat(depot) || 0;
  };

  // Helper function to get the display value for input
  const getDisplayValue = (depot) => {
    if (!depot) return '';

    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return depot.montant !== undefined ? depot.montant.toString() : '';
      } else if (depot.value) {
        return depot.value.toString();
      }
    }

    return depot !== undefined ? depot.toString() : '';
  };

  // Check if deposit is in USD
  const isUSDDepot = (depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
  };

  // Check if deposit has breakdown
  const hasBreakdown = (depot) => {
    return typeof depot === 'object' && (depot.breakdown || depot.sequences);
  };

  // Helper to get original deposit amount (not converted)
  const getOriginalDepotAmount = (depot) => {
    if (!depot) return 0;

    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return parseFloat(depot.montant) || 0;
      } else if (depot.value) {
        return parseFloat(depot.value) || 0;
      }
    }

    return parseFloat(depot) || 0;
  };

  // Initialize vendor state
  const initializeVendorState = (vendeur, currency) => {
    if (!vendorInputs[vendeur]) {
      setVendorInputs(prev => ({
        ...prev,
        [vendeur]: ''
      }));
    }
    if (!vendorPresets[vendeur]) {
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: {
          currency: currency,
          preset: 'aucune'
        }
      }));
    }
  };

  // Initialize sequences for a vendor
  const initializeSequences = (vendeur) => {
    if (!depositSequences[vendeur]) {
      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: []
      }));
    }
  };

  // Mark deposit as recently added
  const markAsRecentlyAdded = (vendeur, index) => {
    const key = `${vendeur}-${index}`;
    setRecentlyAdded(prev => ({ ...prev, [key]: true }));
    
    // Remove highlight after 2 seconds
    setTimeout(() => {
      setRecentlyAdded(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }, 2000);
  };

  // Handle currency selection for a vendor
  const handleCurrencySelect = (vendeur, currency) => {
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: {
        currency: currency,
        preset: 'aucune'
      }
    }));
    setVendorInputs(prev => ({
      ...prev,
      [vendeur]: ''
    }));
    // Close any open dropdowns
    setShowPresetsForVendor(null);
  };

  // Handle preset selection for a vendor
  const handlePresetSelect = (vendeur, presetValue) => {
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: {
        ...prev[vendeur],
        preset: presetValue
      }
    }));
    setShowPresetsForVendor(null);
    
    // Auto-focus input when selecting a preset
    setTimeout(() => {
      const input = document.querySelector(`input[data-vendor="${vendeur}"]`);
      if (input) input.focus();
    }, 100);
  };

  // Calculate amount based on preset multiplier
  const calculatePresetAmount = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState || vendorState.preset === 'aucune') {
      return parseFloat(vendorInputs[vendeur] || 0);
    }
    
    const multiplier = parseFloat(vendorInputs[vendeur] || 1);
    const presetValue = parseFloat(vendorState.preset);
    return presetValue * multiplier;
  };

  // Add sequence to current deposit
  const handleAddSequence = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    const inputValue = vendorInputs[vendeur];
    
    if (!vendorState) {
      initializeVendorState(vendeur, 'HTG');
      return;
    }

    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    if (vendorState.preset === 'aucune') {
      // Direct amount entry mode
      amount = parseFloat(inputValue) || 0;
      note = `${amount} ${currency}`;
    } else {
      // Preset multiplier mode
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        // Calculate amount based on preset
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(vendorState.preset);
        amount = presetValue * multiplier;
        note = `${multiplier} × ${presetValue} ${currency}`;
      } else {
        // If no input value, just use the preset value
        amount = parseFloat(vendorState.preset);
        note = `${vendorState.preset} ${currency}`;
      }
    }

    // Round to 2 decimal places for USD
    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      // Initialize sequences if not exists
      initializeSequences(vendeur);
      
      // Add the sequence
      const newSequence = {
        id: Date.now(),
        amount: amount,
        currency: currency,
        note: note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: [...(prev[vendeur] || []), newSequence]
      }));
      
      // Reset input
      setVendorInputs(prev => ({
        ...prev,
        [vendeur]: ''
      }));
      
      // Reset preset to "aucune" after adding a sequence
      if (vendorState.preset !== 'aucune') {
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: {
            ...prev[vendeur],
            preset: 'aucune'
          }
        }));
      }
    }
  };

  // Remove sequence from current deposit
  const handleRemoveSequence = (vendeur, sequenceId) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: (prev[vendeur] || []).filter(seq => seq.id !== sequenceId)
    }));
  };

  // Clear all sequences for a vendor
  const handleClearSequences = (vendeur) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: []
    }));
  };

  // Calculate total from sequences
  const calculateSequencesTotal = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => total + seq.amount, 0);
  };

  // Handle adding the complete deposit with all sequences
  const handleAddCompleteDeposit = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    const vendorState = vendorPresets[vendeur];
    
    if (sequences.length === 0) {
      console.log("No sequences to add");
      return;
    }
    
    const totalAmount = calculateSequencesTotal(vendeur);
    const currency = vendorState?.currency || 'HTG';
    
    console.log(`Adding deposit: ${totalAmount} ${currency} with ${sequences.length} sequences`);
    
    // Create breakdown description
    const breakdown = sequences.map(seq => seq.note).join(', ');
    
    // Get current deposits to find the next index
    const currentDepots = depotsActuels[vendeur] || [];
    const newIndex = currentDepots.length;
    
    if (currency === 'USD') {
      // Create USD deposit object
      const deposit = {
        montant: totalAmount.toFixed(2),
        devise: 'USD',
        breakdown: breakdown,
        sequences: sequences
      };
      
      console.log(`Creating USD deposit at index ${newIndex}:`, deposit);
      mettreAJourDepot(vendeur, newIndex, deposit);
    } else {
      // Create HTG deposit object
      const deposit = {
        value: totalAmount.toString(),
        breakdown: breakdown,
        sequences: sequences
      };
      
      console.log(`Creating HTG deposit at index ${newIndex}:`, deposit);
      mettreAJourDepot(vendeur, newIndex, deposit);
    }
    
    // Mark as recently added for highlighting
    markAsRecentlyAdded(vendeur, newIndex);
    
    // Clear sequences after adding deposit
    handleClearSequences(vendeur);
    setShowSequenceManager(null);
    
    console.log("Deposit added successfully");
  };

  // Get deposit display with breakdown
  const getDepositDisplay = (depot) => {
    if (!depot) return '';
    
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        const amount = parseFloat(depot.montant) || 0;
        const breakdown = depot.breakdown ? ` (${depot.breakdown})` : '';
        return `${amount} USD${breakdown}`;
      } else if (depot.value) {
        // HTG deposit with breakdown
        const amount = parseFloat(depot.value) || 0;
        const breakdown = depot.breakdown ? ` (${depot.breakdown})` : '';
        return `${formaterArgent(amount)} HTG${breakdown}`;
      }
    }
    
    // Regular HTG deposit (string)
    const amount = parseFloat(depot) || 0;
    return `${formaterArgent(amount)} HTG`;
  };

  // Handle input change for a vendor
  const handleInputChange = (vendeur, value) => {
    setVendorInputs(prev => ({
      ...prev,
      [vendeur]: value
    }));
  };

  // Get current presets based on currency
  const getCurrentPresets = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return htgPresets;
    
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  // Get selected preset text
  const getSelectedPresetText = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState || vendorState.preset === 'aucune') {
      return 'Entrer montant libre';
    }
    
    const currentPresets = getCurrentPresets(vendeur);
    const preset = currentPresets.find(p => p.value === vendorState.preset);
    return preset ? `× ${preset.label} ${vendorState.currency}` : 'Sélectionner';
  };

  // Check if vendor is in direct amount mode
  const isDirectAmount = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    return !vendorState || vendorState.preset === 'aucune';
  };

  // Handle the currency button click
  const handleCurrencyButtonClick = (vendeur, currency) => {
    // Initialize or update the vendor state
    if (!vendorPresets[vendeur]) {
      initializeVendorState(vendeur, currency);
    } else {
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: {
          ...prev[vendeur],
          currency: currency
        }
      }));
    }
    
    // Toggle the dropdown visibility
    setShowPresetsForVendor(showPresetsForVendor === vendeur ? null : vendeur);
  };

  // Toggle sequence manager
  const toggleSequenceManager = (vendeur) => {
    setShowSequenceManager(showSequenceManager === vendeur ? null : vendeur);
    // Close preset dropdown if open
    if (showPresetsForVendor === vendeur) {
      setShowPresetsForVendor(null);
    }
  };

  // Handle simple deposit addition
  const handleSimpleDeposit = (vendeur) => {
    const input = document.querySelector(`input[data-simple="${vendeur}"]`);
    if (!input) return;
    
    const amount = parseFloat(input.value);
    if (amount > 0) {
      const currentDepots = depotsActuels[vendeur] || [];
      const newIndex = currentDepots.length;
      
      // Add the deposit directly
      mettreAJourDepot(vendeur, newIndex, amount.toString());
      
      // Mark as recently added for highlighting
      markAsRecentlyAdded(vendeur, newIndex);
      
      input.value = '';
    }
  };

  // Check if a deposit is recently added
  const isRecentlyAdded = (vendeur, index) => {
    return recentlyAdded[`${vendeur}-${index}`] || false;
  };

  return (
    <div className="space-y-4">
      {/* Exchange Rate Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <Globe size={18} />
          <div className="text-center">
            <div className="font-bold">Taux de Change</div>
            <div className="text-sm opacity-90">1 USD = {TAUX_DE_CHANGE} HTG</div>
          </div>
          <Globe size={18} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold">Dépôts - Shift {shift}</h3>
          </div>
        </div>

        <div className="space-y-4">
          {vendeurs.length === 0 ? (
            <div className="text-center py-6 text-white text-opacity-70">
              Aucun vendeur ajouté
            </div>
          ) : (
            vendeurs.map(vendeur => {
              // Get vendor data from totauxVendeurs which now includes proper deposit calculations
              const donneesVendeur = totauxVendeurs[vendeur];
              const totalDepotHTG = donneesVendeur?.depot || 0;
              const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;

              // Get actual deposits array for editing
              const depots = depotsActuels[vendeur] || [];

              // Initialize vendor state if needed
              if (!vendorPresets[vendeur]) {
                initializeVendorState(vendeur, 'HTG');
              }

              const vendorState = vendorPresets[vendeur];
              const currentPresets = getCurrentPresets(vendeur);
              const isDirectMode = isDirectAmount(vendeur);
              const sequences = depositSequences[vendeur] || [];
              const sequencesTotal = calculateSequencesTotal(vendeur);
              const isSequenceManagerOpen = showSequenceManager === vendeur;

              return (
                <div key={vendeur} className="bg-white bg-opacity-15 rounded-lg p-3 space-y-3">
                  {/* En-tête Vendeur */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-bold">{vendeur}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold text-center ${
                      especesAttendues > 0 
                        ? 'bg-green-500' 
                        : especesAttendues < 0 
                        ? 'bg-red-500' 
                        : 'bg-gray-500'
                    }`}>
                      Espèces: {formaterArgent(especesAttendues)} HTG
                    </div>
                  </div>

                  {/* Info Ventes */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Ventes Total</span>
                      <span className="font-bold">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Dépôts</span>
                      <span className="font-bold">{formaterArgent(totalDepotHTG)} HTG</span>
                    </div>
                  </div>

                  {/* Entrées Dépôts */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Entrées Dépôts</span>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleCurrencyButtonClick(vendeur, 'HTG')}
                          className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
                            (!vendorState || vendorState.currency === 'HTG')
                              ? 'bg-white text-indigo-600'
                              : 'bg-white bg-opacity-20 text-white'
                          }`}
                        >
                          <Plus size={12} />
                          HTG
                        </button>
                        <button
                          onClick={() => handleCurrencyButtonClick(vendeur, 'USD')}
                          className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
                            vendorState?.currency === 'USD'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-500 bg-opacity-20 text-white'
                          }`}
                        >
                          <Plus size={12} />
                          USD
                        </button>
                        <button
                          onClick={() => toggleSequenceManager(vendeur)}
                          className={`px-2 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition ${
                            isSequenceManagerOpen
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-500 bg-opacity-20 text-white'
                          }`}
                          title="Gérer les séquences de dépôt"
                        >
                          <List size={12} />
                          Séq.
                        </button>
                      </div>
                    </div>

                    {/* Sequence Manager */}
                    {isSequenceManagerOpen && (
                      <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <List size={14} className="text-amber-300" />
                            <span className="text-sm font-bold text-amber-300">Séquences de Dépôt</span>
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
                            sequences.map((sequence) => (
                              <div key={sequence.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white bg-opacity-5 rounded p-1.5 sm:p-2 gap-1 sm:gap-2">
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
                                  <button
                                    onClick={() => handleRemoveSequence(vendeur, sequence.id)}
                                    className="p-0.5 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                                    title="Retirer cette séquence"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add sequence section */}
                        <div className="space-y-2">
                          {/* Preset selector */}
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

                          {/* Input with Add Sequence button */}
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
                                  handleAddSequence(vendeur);
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
                            </div>
                          </div>

                          {/* Add Complete Deposit Button */}
                          {sequences.length > 0 && (
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
                    )}

                    {/* Simple deposit addition (when sequence manager is not open) */}
                    {!isSequenceManagerOpen && (
                      <div className="space-y-2">
                        <p className="text-[10px] opacity-70 text-center">
                          Cliquez sur "Séq." pour ajouter plusieurs séquences à un dépôt
                        </p>
                        
                        {/* Quick add section - simple deposits */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-white font-bold text-xs">
                              HTG
                            </span>
                          </div>
                          <input
                            type="number"
                            data-simple={vendeur}
                            placeholder="Montant simple..."
                            className="w-full pl-10 pr-20 py-2.5 text-sm sm:text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSimpleDeposit(vendeur);
                              }
                            }}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                            <button
                              onClick={() => handleSimpleDeposit(vendeur)}
                              className="px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            >
                              <Plus size={12} />
                              Simple
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Existing deposits with highlight effect */}
                    {depots.length === 0 ? (
                      <div className="text-center py-3 text-white text-opacity-70 text-sm">
                        Aucun dépôt ajouté
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {depots.map((depot, index) => {
                          const isUSD = isUSDDepot(depot);
                          const displayValue = getDisplayValue(depot);
                          const montantHTG = getMontantHTG(depot);
                          const montantOriginal = getOriginalDepotAmount(depot);
                          const displayText = getDepositDisplay(depot);
                          const hasBd = hasBreakdown(depot);
                          const isRecent = isRecentlyAdded(vendeur, index);

                          return (
                            <div 
                              key={index} 
                              className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-300 ${
                                isRecent 
                                  ? 'bg-green-500 bg-opacity-20 rounded-lg p-2 border border-green-400 border-opacity-30' 
                                  : ''
                              }`}
                            >
                              {/* Highlight indicator */}
                              {isRecent && (
                                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                  <div className="w-2 h-2 bg-green-400 rounded-full absolute top-0"></div>
                                </div>
                              )}

                              {/* Input container */}
                              <div className="flex-1 w-full">
                                <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={displayValue}
                                    onChange={(e) => {
                                      if (isUSD) {
                                        mettreAJourDepot(vendeur, index, {
                                          montant: e.target.value,
                                          devise: 'USD',
                                          ...(depot.breakdown && { breakdown: depot.breakdown }),
                                          ...(depot.sequences && { sequences: depot.sequences })
                                        });
                                      } else if (typeof depot === 'object' && depot.value) {
                                        // HTG deposit with breakdown
                                        mettreAJourDepot(vendeur, index, {
                                          ...depot,
                                          value: e.target.value
                                        });
                                      } else {
                                        mettreAJourDepot(vendeur, index, e.target.value);
                                      }
                                    }}
                                    placeholder="Montant"
                                    className="flex-1 w-0 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none text-sm sm:text-base"
                                  />
                                  <span className={`px-3 py-2 font-bold text-xs sm:text-sm w-16 sm:w-20 text-center ${
                                    isUSD ? 'bg-green-500 bg-opacity-50' : ''
                                  }`}>
                                    {isUSD ? 'USD' : 'HTG'}
                                  </span>
                                </div>
                                <div className="text-xs text-right opacity-75 mt-1">
                                  <div className="truncate flex items-center justify-end gap-1">
                                    {displayText}
                                    {isRecent && (
                                      <Check size={10} className="text-green-300" />
                                    )}
                                  </div>
                                  {isUSD && (
                                    <div className="text-[10px] sm:text-xs">
                                      = {formaterArgent(montantHTG)} HTG
                                    </div>
                                  )}
                                  {hasBd && !isUSD && (
                                    <div className="text-[10px] opacity-60 mt-0.5">
                                      {depot.breakdown}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Delete button - always visible */}
                              <button
                                onClick={() => supprimerDepot(vendeur, index)}
                                className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition self-end sm:self-center"
                                aria-label={`Supprimer dépôt ${index + 1}`}
                              >
                                <Minus size={14} className="sm:size-[16px]" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Résumé Dépôts */}
                  {depots.length > 0 && (
                    <div className="pt-3 border-t border-white border-opacity-30">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs opacity-90">Dépôts individuels:</div>
                        <div className="flex flex-wrap gap-1">
                          {depots.map((depot, idx) => {
                            const montantHTG = getMontantHTG(depot);
                            const isUSD = isUSDDepot(depot);
                            const montantOriginal = getOriginalDepotAmount(depot);
                            const displayText = getDepositDisplay(depot);
                            const isRecent = isRecentlyAdded(vendeur, idx);

                            return (
                              <div 
                                key={idx} 
                                className={`px-2 py-1 rounded text-xs flex flex-col sm:flex-row sm:items-center gap-1 ${
                                  isUSD 
                                    ? 'bg-green-500 bg-opacity-30 text-green-100' 
                                    : 'bg-white bg-opacity-20'
                                } ${isRecent ? 'ring-1 ring-green-400 ring-opacity-50' : ''}`}
                              >
                                <span className="font-bold">{idx + 1}.</span>
                                <span className="truncate max-w-[150px] sm:max-w-none flex items-center gap-1">
                                  {displayText}
                                  {isRecent && (
                                    <Check size={8} className="text-green-300" />
                                  )}
                                </span>
                                {isUSD && (
                                  <span className="text-[10px] opacity-75 sm:ml-1">
                                    ({formaterArgent(montantOriginal)} USD)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DepotsManager;