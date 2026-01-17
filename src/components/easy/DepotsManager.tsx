import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import VendorDepositCard from './VendorDepositCard';
import SequenceManager from './SequenceManager';
import DepositsSummary from './DepositsSummary';
import ExchangeRateBanner from './ExchangeRateBanner';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132;
  const depotsActuels = tousDepots[shift] || {};

  // State
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [depositSequences, setDepositSequences] = useState({});
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [editingDeposit, setEditingDeposit] = useState(null); // { vendeur: string, index: number }

  // Presets - HTG from 1 to 1000, USD from 1 to 100
  const htgPresets = [
    { value: '1', label: '1' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '250', label: '250' },
    { value: '500', label: '500' },
    { value: '1000', label: '1,000' }
  ];

  const usdPresets = [
    { value: '1', label: '1' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  // Helper Functions
  const convertirUSDversHTG = (montantUSD) => {
    return (parseFloat(montantUSD) || 0) * TAUX_DE_CHANGE;
  };

  const getMontantHTG = (depot) => {
    if (!depot) return 0;
    if (typeof depot === 'object' && depot.devise === 'USD') {
      return convertirUSDversHTG(depot.montant);
    }
    if (typeof depot === 'object' && depot.value) {
      return parseFloat(depot.value) || 0;
    }
    return parseFloat(depot) || 0;
  };

  // NEW: Calculate total deposits for a vendor from the actual deposits array
  const calculateTotalDepotsHTG = (vendeur) => {
    const depots = depotsActuels[vendeur] || [];
    return depots.reduce((total, depot) => total + getMontantHTG(depot), 0);
  };

  const isUSDDepot = (depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
  };

  const hasBreakdown = (depot) => {
    return typeof depot === 'object' && (depot.breakdown || depot.sequences);
  };

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

  const getDepositDisplay = (depot) => {
    if (!depot) return '';
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        const amount = parseFloat(depot.montant) || 0;
        const breakdown = depot.breakdown ? ` (${depot.breakdown})` : '';
        return `${amount} USD${breakdown}`;
      } else if (depot.value) {
        const amount = parseFloat(depot.value) || 0;
        const breakdown = depot.breakdown ? ` (${depot.breakdown})` : '';
        return `${formaterArgent(amount)} HTG${breakdown}`;
      }
    }
    const amount = parseFloat(depot) || 0;
    return `${formaterArgent(amount)} HTG`;
  };

  // Calculate sequences total by currency
  const calculateSequencesTotalByCurrency = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    const totals = {
      HTG: 0,
      USD: 0
    };
    
    sequences.forEach(seq => {
      const currency = seq.currency || 'HTG';
      if (currency === 'USD') {
        totals.USD += seq.amount;
      } else {
        totals.HTG += seq.amount;
      }
    });
    
    return totals;
  };

  // Calculate total HTG value of all sequences
  const calculateTotalSequencesHTG = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => {
      if (seq.currency === 'USD') {
        return total + (seq.amount * TAUX_DE_CHANGE);
      }
      return total + seq.amount;
    }, 0);
  };

  // State Management Functions
  const initializeVendorState = (vendeur, currency = 'HTG') => {
    if (!vendorInputs[vendeur]) {
      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    }
    if (!vendorPresets[vendeur]) {
      // Auto-select smallest preset (1 HTG or 1 USD)
      const presets = currency === 'HTG' ? htgPresets : usdPresets;
      const smallestPreset = presets[0]?.value || '1';

      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { currency, preset: smallestPreset }
      }));
    }
  };

  const initializeSequences = (vendeur) => {
    if (!depositSequences[vendeur]) {
      setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
    }
  };

  const markAsRecentlyAdded = (vendeur, index) => {
    const key = `${vendeur}-${index}`;
    setRecentlyAdded(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setRecentlyAdded(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }, 2000);
  };

  // Edit deposit functionality
  const handleEditDeposit = (vendeur, index) => {
    const depot = depotsActuels[vendeur]?.[index];

    if (!depot) return;

    // Set editing state
    setEditingDeposit({ vendeur, index });

    // Load sequences from deposit if they exist
    if (depot.sequences && Array.isArray(depot.sequences)) {
      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: depot.sequences.map(seq => ({
          id: Date.now() + Math.random(), // New IDs for editing
          amount: seq.amount,
          currency: seq.currency || (isUSDDepot(depot) ? 'USD' : 'HTG'),
          note: seq.note || seq.text || `${seq.amount} ${seq.currency || (isUSDDepot(depot) ? 'USD' : 'HTG')}`,
          timestamp: seq.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      }));
    } else {
      // Convert simple deposit to sequence
      const currency = isUSDDepot(depot) ? 'USD' : 'HTG';
      const amount = getOriginalDepotAmount(depot);

      // Find best matching preset
      const presets = currency === 'HTG' ? htgPresets : usdPresets;
      let bestPreset = presets[0]; // Default to smallest
      let bestMultiplier = 1;

      // Try to find a preset that divides evenly into the amount
      for (const preset of presets) {
        const presetValue = parseFloat(preset.value);
        if (presetValue > 0 && amount % presetValue === 0) {
          const multiplier = amount / presetValue;
          if (multiplier >= 1 && multiplier === Math.floor(multiplier)) {
            bestPreset = preset;
            bestMultiplier = multiplier;
            break;
          }
        }
      }

      // Create sequence with preset notation
      const note = bestMultiplier === 1 
        ? `${bestPreset.value} ${currency}`
        : `${bestMultiplier} × ${bestPreset.value} ${currency}`;

      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: [{
          id: Date.now(),
          amount,
          currency,
          note,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));

      // Set preset and multiplier in vendor state
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { 
          ...prev[vendeur], 
          currency,
          preset: bestPreset.value
        }
      }));

      // Set the multiplier in the input
      handleInputChange(vendeur, bestMultiplier.toString());
    }
  };

  const cancelEdit = (vendeur) => {
    setEditingDeposit(null);
    setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
    // Reset to smallest preset
    const vendorState = vendorPresets[vendeur];
    if (vendorState) {
      const presets = vendorState.currency === 'HTG' ? htgPresets : usdPresets;
      const smallestPreset = presets[0]?.value || '1';
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { 
          ...prev[vendeur], 
          preset: smallestPreset
        }
      }));
    }
    handleInputChange(vendeur, '');
  };

  // FIXED: Save edited deposit with mixed currencies
  const saveEditedDeposit = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    const { index } = editingDeposit;

    if (sequences.length === 0) {
      // If no sequences, delete the deposit
      supprimerDepot(vendeur, index);
      cancelEdit(vendeur);
      return;
    }

    // Get original deposit to know its currency
    const originalDepot = depotsActuels[vendeur]?.[index];
    const originalCurrency = isUSDDepot(originalDepot) ? 'USD' : 'HTG';

    if (originalCurrency === 'USD') {
      // Convert all to USD
      const totalAmountUSD = sequences.reduce((total, seq) => {
        if (seq.currency === 'USD') {
          return total + seq.amount;
        } else {
          // Convert HTG to USD
          return total + (seq.amount / TAUX_DE_CHANGE);
        }
      }, 0);
      
      const breakdown = sequences.map(seq => seq.note).join(', ');
      const deposit = {
        montant: totalAmountUSD.toFixed(2),
        devise: 'USD',
        breakdown: breakdown,
        sequences: sequences
      };
      mettreAJourDepot(vendeur, index, deposit);
    } else {
      // Convert all to HTG
      const totalAmountHTG = sequences.reduce((total, seq) => {
        if (seq.currency === 'USD') {
          return total + (seq.amount * TAUX_DE_CHANGE);
        } else {
          return total + seq.amount;
        }
      }, 0);
      
      const breakdown = sequences.map(seq => seq.note).join(', ');
      const deposit = {
        value: totalAmountHTG.toString(),
        breakdown: breakdown,
        sequences: sequences
      };
      mettreAJourDepot(vendeur, index, deposit);
    }

    markAsRecentlyAdded(vendeur, index);
    cancelEdit(vendeur);
  };

  // Sequence editing functionality
  const handleUpdateSequence = (vendeur, sequenceId, updatedSequence) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: (prev[vendeur] || []).map(seq => 
        seq.id === sequenceId ? { ...updatedSequence, id: sequenceId } : seq
      )
    }));
  };

  // Event Handlers
  const handleCurrencyButtonClick = (vendeur, currency) => {
    if (!vendorPresets[vendeur]) {
      initializeVendorState(vendeur, currency);
    } else {
      const presets = currency === 'HTG' ? htgPresets : usdPresets;
      const smallestPreset = presets[0]?.value || '1';

      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { 
          ...prev[vendeur], 
          currency,
          preset: smallestPreset // Auto-select smallest preset when switching currency
        }
      }));
    }
    handleInputChange(vendeur, ''); // Clear input when switching currency
  };

  const handlePresetSelect = (vendeur, presetValue) => {
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { ...prev[vendeur], preset: presetValue }
    }));
    setTimeout(() => {
      const input = document.querySelector(`input[data-vendor="${vendeur}"]`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  };

  const calculatePresetAmount = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return 0;

    const multiplier = parseFloat(vendorInputs[vendeur] || 1);
    const presetValue = parseFloat(vendorState.preset);
    return presetValue * multiplier;
  };

  const getCurrentPresets = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return htgPresets;
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  const isDirectAmount = (vendeur) => {
    // Always false now - only presets are allowed
    return false;
  };

  const handleInputChange = (vendeur, value) => {
    setVendorInputs(prev => ({ ...prev, [vendeur]: value }));
  };

  const handleAddSequence = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    const inputValue = vendorInputs[vendeur];

    if (!vendorState) {
      initializeVendorState(vendeur, 'HTG');
      return;
    }

    // Always use preset mode (no direct amounts)
    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const multiplier = parseFloat(inputValue);
      const presetValue = parseFloat(vendorState.preset);
      amount = presetValue * multiplier;
      note = multiplier === 1 
        ? `${presetValue} ${currency}`
        : `${multiplier} × ${presetValue} ${currency}`;
    } else {
      // Default to 1 × preset
      const presetValue = parseFloat(vendorState.preset);
      amount = presetValue;
      note = `${presetValue} ${currency}`;
    }

    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      initializeSequences(vendeur);
      const newSequence = {
        id: Date.now() + Math.random(),
        amount,
        currency,
        note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: [...(prev[vendeur] || []), newSequence]
      }));

      // Clear input but keep same preset selected
      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    }
  };

  const handleRemoveSequence = (vendeur, sequenceId) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: (prev[vendeur] || []).filter(seq => seq.id !== sequenceId)
    }));
  };

  const handleClearSequences = (vendeur) => {
    setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
  };

  const calculateSequencesTotal = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => total + seq.amount, 0);
  };

  // FIXED: Handle mixed currencies by creating separate deposits
  const handleAddCompleteDeposit = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];

    if (sequences.length === 0) {
      console.log("No sequences to add");
      return;
    }

    // Group sequences by currency
    const sequencesByCurrency = sequences.reduce((acc, seq) => {
      const currency = seq.currency || 'HTG';
      if (!acc[currency]) {
        acc[currency] = [];
      }
      acc[currency].push(seq);
      return acc;
    }, {});

    // Get current deposits count
    const currentDepots = depotsActuels[vendeur] || [];
    let nextIndex = currentDepots.length;

    // Create deposits with sequential indices
    Object.entries(sequencesByCurrency).forEach(([currency, currencySequences], i) => {
      const totalAmount = currencySequences.reduce((total, seq) => total + seq.amount, 0);
      const breakdown = currencySequences.map(seq => seq.note).join(', ');
      
      // Use setTimeout to ensure state updates sequentially
      setTimeout(() => {
        if (currency === 'USD') {
          const deposit = {
            montant: totalAmount.toFixed(2),
            devise: 'USD',
            breakdown: breakdown,
            sequences: currencySequences
          };
          mettreAJourDepot(vendeur, nextIndex + i, deposit);
        } else {
          const deposit = {
            value: totalAmount.toString(),
            breakdown: breakdown,
            sequences: currencySequences
          };
          mettreAJourDepot(vendeur, nextIndex + i, deposit);
        }
        
        markAsRecentlyAdded(vendeur, nextIndex + i);
      }, i * 50); // Small delay between each deposit
    });

    // Clear sequences after a delay to ensure all deposits are added
    setTimeout(() => {
      handleClearSequences(vendeur);
    }, Object.keys(sequencesByCurrency).length * 50 + 50);
  };

  const isRecentlyAdded = (vendeur, index) => {
    return recentlyAdded[`${vendeur}-${index}`] || false;
  };

  const isEditingThisDeposit = (vendeur, index) => {
    return editingDeposit?.vendeur === vendeur && editingDeposit?.index === index;
  };

  return (
    <div className="space-y-4">
      <ExchangeRateBanner tauxDeChange={TAUX_DE_CHANGE} />

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-2 shadow-xl">
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
              const donneesVendeur = totauxVendeurs[vendeur];
              // FIXED: Calculate total from actual deposits array instead of totauxVendeurs
              const totalDepotHTG = calculateTotalDepotsHTG(vendeur);
              const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
              const depots = depotsActuels[vendeur] || [];

              // Initialize vendor state if not exists
              if (!vendorPresets[vendeur]) {
                initializeVendorState(vendeur, 'HTG');
              }

              const vendorState = vendorPresets[vendeur];
              const currentPresets = getCurrentPresets(vendeur);
              const isDirectMode = isDirectAmount(vendeur);
              const sequences = depositSequences[vendeur] || [];
              const sequencesTotal = calculateSequencesTotal(vendeur);
              const sequencesTotalByCurrency = calculateSequencesTotalByCurrency(vendeur);
              const totalSequencesHTG = calculateTotalSequencesHTG(vendeur);
              const isEditingMode = editingDeposit?.vendeur === vendeur;

              return (
                <VendorDepositCard
                  key={vendeur}
                  vendeur={vendeur}
                  donneesVendeur={donneesVendeur}
                  especesAttendues={especesAttendues}
                  totalDepotHTG={totalDepotHTG}
                >
                  {/* SEQUENTIAL DEPOSITS ONLY - Always Visible */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">
                        {isEditingMode ? 
                          `Éditer Dépôt #${editingDeposit.index + 1}` : 
                          'Ajouter Nouveau Dépôt (Séquentiel)'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {isEditingMode && (
                          <button
                            onClick={() => cancelEdit(vendeur)}
                            className="px-2 py-1.5 rounded-lg font-bold text-xs bg-red-500 text-white active:scale-95 transition"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ALWAYS VISIBLE Sequence Manager - UPDATED PROPS */}
                    <SequenceManager
                      vendeur={vendeur}
                      vendorState={vendorState}
                      sequences={sequences}
                      sequencesTotal={sequencesTotal}
                      sequencesTotalByCurrency={sequencesTotalByCurrency}
                      totalSequencesHTG={totalSequencesHTG}
                      vendorInputs={vendorInputs}
                      currentPresets={currentPresets}
                      handleClearSequences={handleClearSequences}
                      handleRemoveSequence={handleRemoveSequence}
                      handleUpdateSequence={(sequenceId, updatedSequence) => 
                        handleUpdateSequence(vendeur, sequenceId, updatedSequence)
                      }
                      handlePresetSelect={handlePresetSelect}
                      handleInputChange={handleInputChange}
                      handleAddSequence={handleAddSequence}
                      handleAddCompleteDeposit={isEditingMode ? 
                        () => saveEditedDeposit(vendeur) : 
                        () => handleAddCompleteDeposit(vendeur)}
                      calculatePresetAmount={calculatePresetAmount}
                      htgPresets={htgPresets}
                      usdPresets={usdPresets}
                      setVendorPresets={setVendorPresets}
                      TAUX_DE_CHANGE={TAUX_DE_CHANGE}
                    />
                  </div>

                  {/* Use DepositsSummary with edit/delete actions */}
                  <DepositsSummary
  vendeur={vendeur}
  depots={depots}
  isRecentlyAdded={isRecentlyAdded}
  getMontantHTG={getMontantHTG}
  isUSDDepot={isUSDDepot}
  getOriginalDepotAmount={getOriginalDepotAmount}
  getDepositDisplay={getDepositDisplay}
  onEditDeposit={handleEditDeposit}
  onDeleteDeposit={supprimerDepot}
  editingDeposit={editingDeposit}
  isEditingThisDeposit={isEditingThisDeposit}
  exchangeRate={TAUX_DE_CHANGE} // ADDED THIS LINE
/>
                </VendorDepositCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DepotsManager;