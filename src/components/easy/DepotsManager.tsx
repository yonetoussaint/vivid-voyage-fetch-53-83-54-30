import React, { useState } from 'react';
import { DollarSign, User, Plus, Minus, Globe, ChevronDown } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132; // Fixed exchange rate: 1 USD = 132 HTG
  const depotsActuels = tousDepots[shift] || {};

  // State for each vendor's input
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [showPresetsForVendor, setShowPresetsForVendor] = useState(null);

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

    // Always return a number for HTG deposits
    return parseFloat(depot) || 0;
  };

  // Helper function to get the display value for input
  const getDisplayValue = (depot) => {
    if (!depot) return '';

    if (typeof depot === 'object' && depot.devise === 'USD') {
      return depot.montant !== undefined ? depot.montant.toString() : '';
    }

    return depot !== undefined ? depot.toString() : '';
  };

  // Check if deposit is in USD
  const isUSDDepot = (depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
  };

  // Helper to get original deposit amount (not converted)
  const getOriginalDepotAmount = (depot) => {
    if (!depot) return 0;

    if (typeof depot === 'object' && depot.devise === 'USD') {
      return parseFloat(depot.montant) || 0;
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

  // Handle adding a new deposit with preset system - FIXED VERSION
  const handleAddDepotWithPreset = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    const inputValue = vendorInputs[vendeur];
    
    if (!vendorState) {
      // Initialize if somehow not set
      initializeVendorState(vendeur, 'HTG');
      return;
    }

    let amount = 0;
    let currency = vendorState.currency;

    if (vendorState.preset === 'aucune') {
      // Direct amount entry mode
      amount = parseFloat(inputValue) || 0;
    } else {
      // Preset multiplier mode
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        // Calculate amount based on preset
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(vendorState.preset);
        amount = presetValue * multiplier;
      } else {
        // If no input value, just use the preset value
        amount = parseFloat(vendorState.preset);
      }
    }

    // Round to 2 decimal places for USD
    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      // Create the deposit object with the correct format
      let newDeposit;
      if (currency === 'USD') {
        newDeposit = {
          montant: amount.toString(),
          devise: 'USD'
        };
      } else {
        newDeposit = amount.toString();
      }
      
      // Add the deposit directly with the amount
      // First, get current deposits for this vendor
      const currentDepots = depotsActuels[vendeur] || [];
      
      // Create updated deposits array
      const updatedDepots = [...currentDepots, newDeposit];
      
      // We need to use mettreAJourDepot to update the entire array
      // Since we don't have direct access to set tousDepots, we'll simulate
      // by updating each existing deposit and then adding the new one
      
      // For existing deposits, keep them as they are
      currentDepots.forEach((depot, index) => {
        // These are already in the state, so we don't need to update them
      });
      
      // Add the new deposit - since mettreAJourDepot expects an index,
      // we need a different approach
      
      // Let's update the parent state by calling mettreAJourDepot for each existing deposit
      // and then for the new one
      
      // Actually, let's modify the ajouterDepot function to accept amount
      // But for now, let's work with what we have
      
      // Call ajouterDepot to add a new empty deposit first
      ajouterDepot(vendeur, currency);
      
      // Now get the updated depots array
      setTimeout(() => {
        const updatedDepotsAfterAdd = depotsActuels[vendeur] || [];
        const newIndex = updatedDepotsAfterAdd.length - 1;
        
        // Update the newly added deposit with the actual amount
        if (currency === 'USD') {
          mettreAJourDepot(vendeur, newIndex, {
            montant: amount.toString(),
            devise: 'USD'
          });
        } else {
          mettreAJourDepot(vendeur, newIndex, amount.toString());
        }
        
        // Reset input
        setVendorInputs(prev => ({
          ...prev,
          [vendeur]: ''
        }));
        
        // Reset to "aucune" after adding a sequence with multiplier
        if (vendorState.preset !== 'aucune' && inputValue) {
          setVendorPresets(prev => ({
            ...prev,
            [vendeur]: {
              ...prev[vendeur],
              preset: 'aucune'
            }
          }));
        }
      }, 10); // Small delay to ensure state is updated
    }
  };

  // NEW: Improved version that adds deposit with amount directly
  const handleAddDepotDirect = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    const inputValue = vendorInputs[vendeur];
    
    if (!vendorState) return;

    let amount = 0;
    let currency = vendorState.currency;

    if (vendorState.preset === 'aucune') {
      // Direct amount entry mode
      amount = parseFloat(inputValue) || 0;
    } else {
      // Preset multiplier mode
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        // Calculate amount based on preset
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(vendorState.preset);
        amount = presetValue * multiplier;
      } else {
        // If no input value, just use the preset value
        amount = parseFloat(vendorState.preset);
      }
    }

    // Round to 2 decimal places for USD
    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      // Create the deposit with amount
      const deposit = currency === 'USD' 
        ? { montant: amount.toString(), devise: 'USD' }
        : amount.toString();
      
      // Get current deposits
      const currentDepots = depotsActuels[vendeur] || [];
      
      // Find the next available index (should be current length)
      const newIndex = currentDepots.length;
      
      // Add the deposit at the new index
      if (currency === 'USD') {
        mettreAJourDepot(vendeur, newIndex, {
          montant: amount.toString(),
          devise: 'USD'
        });
      } else {
        mettreAJourDepot(vendeur, newIndex, amount.toString());
      }
      
      // Reset input
      setVendorInputs(prev => ({
        ...prev,
        [vendeur]: ''
      }));
      
      // Reset to "aucune" after adding a sequence with multiplier
      if (vendorState.preset !== 'aucune' && inputValue) {
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCurrencyButtonClick(vendeur, 'HTG')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition ${
                            (!vendorState || vendorState.currency === 'HTG')
                              ? 'bg-white text-indigo-600'
                              : 'bg-white bg-opacity-20 text-white'
                          }`}
                        >
                          <Plus size={14} />
                          HTG
                        </button>
                        <button
                          onClick={() => handleCurrencyButtonClick(vendeur, 'USD')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition ${
                            vendorState?.currency === 'USD'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-500 bg-opacity-20 text-white'
                          }`}
                        >
                          <Plus size={14} />
                          USD
                        </button>
                      </div>
                    </div>

                    {/* Preset selector and input - Only show if vendorState exists */}
                    {vendorState && (
                      <div className="space-y-2">
                        {/* Preset selector */}
                        <div className="relative">
                          <button
                            onClick={() => setShowPresetsForVendor(showPresetsForVendor === vendeur ? null : vendeur)}
                            className={`w-full px-3 py-2 text-left rounded-lg flex items-center justify-between transition-colors ${
                              vendorState.currency === 'HTG'
                                ? 'bg-blue-500 bg-opacity-20 hover:bg-opacity-30 border border-blue-400 border-opacity-30'
                                : 'bg-green-500 bg-opacity-20 hover:bg-opacity-30 border border-green-400 border-opacity-30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${
                                vendorState.currency === 'HTG' ? 'text-blue-300' : 'text-green-300'
                              }`}>
                                {getSelectedPresetText(vendeur)}
                              </span>
                              {!isDirectMode && vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) !== 1 && (
                                <span className="text-[10px] opacity-70">
                                  × {vendorInputs[vendeur]} = {formaterArgent(calculatePresetAmount(vendeur))} {vendorState.currency}
                                </span>
                              )}
                            </div>
                            <ChevronDown 
                              size={12} 
                              className={`transition-transform ${showPresetsForVendor === vendeur ? 'rotate-180' : ''} ${
                                vendorState.currency === 'HTG' ? 'text-blue-300' : 'text-green-300'
                              }`} 
                            />
                          </button>
                          
                          {/* Dropdown menu */}
                          {showPresetsForVendor === vendeur && (
                            <div className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg overflow-hidden border ${
                              vendorState.currency === 'HTG'
                                ? 'bg-blue-900 border-blue-700'
                                : 'bg-green-900 border-green-700'
                            }`}>
                              {/* "Aucune" option - full width */}
                              <button
                                onClick={() => handlePresetSelect(vendeur, 'aucune')}
                                className={`w-full px-3 py-3 text-left text-xs hover:bg-opacity-50 transition-colors flex items-center justify-between border-b ${
                                  vendorState.currency === 'HTG' ? 'border-blue-700' : 'border-green-700'
                                } ${
                                  vendorState.preset === 'aucune'
                                    ? vendorState.currency === 'HTG'
                                      ? 'bg-blue-700 text-white'
                                      : 'bg-green-700 text-white'
                                    : vendorState.currency === 'HTG'
                                      ? 'hover:bg-blue-800 text-blue-100'
                                      : 'hover:bg-green-800 text-green-100'
                                }`}
                              >
                                <span>Entrer montant libre</span>
                                {isDirectMode && (
                                  <span className="text-[10px] opacity-70">✓</span>
                                )}
                              </button>
                              
                              {/* Grid of presets - SAME STYLE AS QUICK ADD BUTTONS */}
                              <div className="p-2">
                                <div className="grid grid-cols-3 gap-1.5">
                                  {currentPresets.map((preset) => (
                                    <button
                                      key={preset.value}
                                      onClick={() => handlePresetSelect(vendeur, preset.value)}
                                      className={`px-2 py-2 text-xs font-medium rounded border transition-colors flex items-center justify-center ${
                                        vendorState.currency === 'HTG'
                                          ? 'bg-blue-500 bg-opacity-10 hover:bg-opacity-20 border-blue-400 border-opacity-30 text-blue-300'
                                          : 'bg-green-500 bg-opacity-10 hover:bg-opacity-20 border-green-400 border-opacity-30 text-green-300'
                                      } ${vendorState.preset === preset.value ? 'ring-1 ring-white ring-opacity-50' : ''}`}
                                      title={`${preset.label} ${vendorState.currency}`}
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
                        <p className="text-[10px] opacity-70 text-center">
                          {isDirectMode 
                            ? "Entrez directement le montant" 
                            : `Sélectionnez un montant et entrez un multiplicateur (ex: 33 × ${vendorState.preset})`}
                        </p>

                        {/* Input with Add button */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-white font-bold text-xs">
                              {isDirectMode ? (
                                vendorState.currency === 'HTG' ? 'HTG' : 'USD'
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
                                handleAddDepotDirect(vendeur);
                              }
                            }}
                            placeholder={
                              isDirectMode 
                                ? `Montant en ${vendorState.currency}...` 
                                : 'Multiplicateur (ex: 33)...'
                            }
                            className="w-full pl-10 pr-20 py-2.5 text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                            <button
                              onClick={() => handleAddDepotDirect(vendeur)}
                              disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                                vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                                  ? vendorState.currency === 'HTG' 
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
                        {!isDirectMode && vendorInputs[vendeur] && !isNaN(parseFloat(vendorInputs[vendeur])) && vendorState.preset && vendorState.preset !== 'aucune' && (
                          <div className="mt-2 bg-white bg-opacity-10 rounded p-2 text-center">
                            <p className="text-xs opacity-90">
                              {vendorInputs[vendeur]} × {vendorState.preset} {vendorState.currency} = {formaterArgent(calculatePresetAmount(vendeur))} {vendorState.currency}
                            </p>
                            {vendorState.currency === 'USD' && (
                              <p className="text-[10px] opacity-70">
                                ({formaterArgent(calculatePresetAmount(vendeur) * TAUX_DE_CHANGE)} HTG)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Existing deposits */}
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

                          return (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                                          devise: 'USD'
                                        });
                                      } else {
                                        mettreAJourDepot(vendeur, index, e.target.value);
                                      }
                                    }}
                                    placeholder="Montant"
                                    className="flex-1 w-0 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50 focus:outline-none"
                                  />
                                  <span className={`px-3 py-2 font-bold text-sm w-20 text-center ${
                                    isUSD ? 'bg-green-500 bg-opacity-50' : ''
                                  }`}>
                                    {isUSD ? 'USD' : 'HTG'}
                                  </span>
                                </div>
                                {isUSD && (
                                  <div className="text-xs text-right opacity-75 mt-1">
                                    = {formaterArgent(montantHTG)} HTG
                                  </div>
                                )}
                              </div>

                              {/* Delete button - always visible */}
                              <button
                                onClick={() => supprimerDepot(vendeur, index)}
                                className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition self-end sm:self-center"
                                aria-label={`Supprimer dépôt ${index + 1}`}
                              >
                                <Minus size={16} />
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
                        <div className="text-xs opacity-90">Dépôts individuels (en HTG):</div>
                        <div className="flex flex-wrap gap-1">
                          {depots.map((depot, idx) => {
                            const montantHTG = getMontantHTG(depot);
                            const isUSD = isUSDDepot(depot);
                            const montantOriginal = getOriginalDepotAmount(depot);

                            return (
                              <div 
                                key={idx} 
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                  isUSD 
                                    ? 'bg-green-500 bg-opacity-30 text-green-100' 
                                    : 'bg-white bg-opacity-20'
                                }`}
                              >
                                <span className="font-bold">{idx + 1}.</span>
                                <span>{formaterArgent(montantHTG)} HTG</span>
                                {isUSD && (
                                  <span className="text-xs opacity-75 ml-1">
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