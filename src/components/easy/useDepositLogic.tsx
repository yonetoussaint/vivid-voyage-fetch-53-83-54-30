import { useState, useCallback } from 'react';
import { formaterArgent } from '@/utils/formatters';
import { htgPresets, usdPresets } from './depositPresets';

export const useDepositLogic = ({ 
  TAUX_DE_CHANGE, 
  depotsActuels, 
  mettreAJourDepot, 
  supprimerDepot 
}) => {
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [depositSequences, setDepositSequences] = useState({});
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [editingDeposit, setEditingDeposit] = useState(null);
  const [expandedVendor, setExpandedVendor] = useState(null);

  // Export presets for use in other components
  const exportedHtgPresets = htgPresets;
  const exportedUsdPresets = usdPresets;

  // Helper Functions
  const convertirUSDversHTG = useCallback((montantUSD) => {
    return (parseFloat(montantUSD) || 0) * TAUX_DE_CHANGE;
  }, [TAUX_DE_CHANGE]);

  const getMontantHTG = useCallback((depot) => {
    if (!depot) return 0;
    if (typeof depot === 'object' && depot.devise === 'USD') {
      return convertirUSDversHTG(depot.montant);
    }
    if (typeof depot === 'object' && depot.value) {
      return parseFloat(depot.value) || 0;
    }
    return parseFloat(depot) || 0;
  }, [convertirUSDversHTG]);

  const calculateTotalDepotsHTG = useCallback((vendeur) => {
    const depots = depotsActuels[vendeur] || [];
    return depots.reduce((total, depot) => total + getMontantHTG(depot), 0);
  }, [depotsActuels, getMontantHTG]);

  const isUSDDepot = useCallback((depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
  }, []);

  const hasBreakdown = useCallback((depot) => {
    return typeof depot === 'object' && (depot.breakdown || depot.sequences);
  }, []);

  const getOriginalDepotAmount = useCallback((depot) => {
    if (!depot) return 0;
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return parseFloat(depot.montant) || 0;
      } else if (depot.value) {
        return parseFloat(depot.value) || 0;
      }
    }
    return parseFloat(depot) || 0;
  }, []);

  const getDepositDisplay = useCallback((depot) => {
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
  }, []);

  // Calculate sequences total by currency
  const calculateSequencesTotalByCurrency = useCallback((vendeur) => {
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
  }, [depositSequences]);

  // Calculate total HTG value of all sequences
  const calculateTotalSequencesHTG = useCallback((vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => {
      if (seq.currency === 'USD') {
        return total + (seq.amount * TAUX_DE_CHANGE);
      }
      return total + seq.amount;
    }, 0);
  }, [depositSequences, TAUX_DE_CHANGE]);

  // State Management Functions
  const handleToggleVendor = useCallback((vendeur) => {
    setExpandedVendor(prev => prev === vendeur ? null : vendeur);
  }, []);

  const initializeVendorState = useCallback((vendeur, currency = 'HTG') => {
    if (!vendorInputs[vendeur]) {
      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    }
    if (!vendorPresets[vendeur]) {
      const presets = currency === 'HTG' ? exportedHtgPresets : exportedUsdPresets;
      const smallestPreset = presets[0]?.value || '1';

      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { currency, preset: smallestPreset }
      }));
    }
  }, [vendorInputs, vendorPresets, exportedHtgPresets, exportedUsdPresets]);

  const initializeSequences = useCallback((vendeur) => {
    if (!depositSequences[vendeur]) {
      setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
    }
  }, [depositSequences]);

  const markAsRecentlyAdded = useCallback((vendeur, index) => {
    const key = `${vendeur}-${index}`;
    setRecentlyAdded(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setRecentlyAdded(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }, 2000);
  }, []);

  // Edit deposit functionality
  const handleEditDeposit = useCallback((vendeur, index) => {
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
      const presets = currency === 'HTG' ? exportedHtgPresets : exportedUsdPresets;
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
  }, [depotsActuels, getOriginalDepotAmount, isUSDDepot, exportedHtgPresets, exportedUsdPresets]);

  const cancelEdit = useCallback((vendeur) => {
    setEditingDeposit(null);
    setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
    // Reset to smallest preset
    const vendorState = vendorPresets[vendeur];
    if (vendorState) {
      const presets = vendorState.currency === 'HTG' ? exportedHtgPresets : exportedUsdPresets;
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
  }, [vendorPresets, exportedHtgPresets, exportedUsdPresets]);

  // Save edited deposit with mixed currencies
  const saveEditedDeposit = useCallback((vendeur) => {
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
        sequences: sequences,
        timestamp: Date.now() // Add timestamp for unique ID generation
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
        sequences: sequences,
        timestamp: Date.now() // Add timestamp for unique ID generation
      };
      mettreAJourDepot(vendeur, index, deposit);
    }

    markAsRecentlyAdded(vendeur, index);
    cancelEdit(vendeur);
  }, [depositSequences, editingDeposit, supprimerDepot, depotsActuels, isUSDDepot, TAUX_DE_CHANGE, mettreAJourDepot, cancelEdit, markAsRecentlyAdded]);

  // Sequence editing functionality
  const handleUpdateSequence = useCallback((vendeur, sequenceId, updatedSequence) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: (prev[vendeur] || []).map(seq => 
        seq.id === sequenceId ? { ...updatedSequence, id: sequenceId } : seq
      )
    }));
  }, []);

  // Event Handlers
  const handleCurrencyButtonClick = useCallback((vendeur, currency) => {
    if (!vendorPresets[vendeur]) {
      initializeVendorState(vendeur, currency);
    } else {
      const presets = currency === 'HTG' ? exportedHtgPresets : exportedUsdPresets;
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
  }, [vendorPresets, initializeVendorState, exportedHtgPresets, exportedUsdPresets]);

  const handlePresetSelect = useCallback((vendeur, presetValue) => {
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
  }, []);

  const calculatePresetAmount = useCallback((vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return 0;

    const multiplier = parseFloat(vendorInputs[vendeur] || 1);
    const presetValue = parseFloat(vendorState.preset);
    return presetValue * multiplier;
  }, [vendorPresets, vendorInputs]);

  const getCurrentPresets = useCallback((vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return exportedHtgPresets;
    return vendorState.currency === 'HTG' ? exportedHtgPresets : exportedUsdPresets;
  }, [vendorPresets, exportedHtgPresets, exportedUsdPresets]);

  const isDirectAmount = useCallback(() => {
    // Always false now - only presets are allowed
    return false;
  }, []);

  const handleInputChange = useCallback((vendeur, value) => {
    setVendorInputs(prev => ({ ...prev, [vendeur]: value }));
  }, []);

  // UPDATED: handleAddSequence now accepts custom preset and multiplier
  const handleAddSequence = useCallback((vendeur, customPreset = null, customMultiplier = null) => {
    let vendorState = vendorPresets[vendeur];
    let inputValue = vendorInputs[vendeur];

    // Use custom values if provided (from grid)
    if (customPreset !== null) {
      vendorState = { ...vendorState, preset: customPreset.toString() };
    }
    if (customMultiplier !== null) {
      inputValue = customMultiplier.toString();
    }

    if (!vendorState) {
      initializeVendorState(vendeur, 'HTG');
      return;
    }

    // Always use preset mode (no direct amounts)
    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    const multiplier = parseFloat(inputValue || 1);
    const presetValue = parseFloat(vendorState.preset);
    amount = presetValue * multiplier;
    note = multiplier === 1 
      ? `${presetValue} ${currency}`
      : `${multiplier} × ${presetValue} ${currency}`;

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
      if (customMultiplier === null) {
        // Only clear if not from grid (grid handles its own clearing)
        setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
      }
    }
  }, [vendorPresets, vendorInputs, initializeVendorState, initializeSequences]);

  const handleRemoveSequence = useCallback((vendeur, sequenceId) => {
    setDepositSequences(prev => ({
      ...prev,
      [vendeur]: (prev[vendeur] || []).filter(seq => seq.id !== sequenceId)
    }));
  }, []);

  const handleClearSequences = useCallback((vendeur) => {
    setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
  }, []);

  const calculateSequencesTotal = useCallback((vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => total + seq.amount, 0);
  }, [depositSequences]);

  // FIXED: Handle mixed currencies by creating separate deposits with unique timestamps
  const handleAddCompleteDeposit = useCallback((vendeur) => {
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

    // Create deposits with sequential indices and unique timestamps
    Object.entries(sequencesByCurrency).forEach(([currency, currencySequences], i) => {
      const totalAmount = currencySequences.reduce((total, seq) => total + seq.amount, 0);
      const breakdown = currencySequences.map(seq => seq.note).join(', ');
      
      // Create a unique timestamp for each deposit
      const timestamp = Date.now() + i;

      // Use setTimeout to ensure state updates sequentially
      setTimeout(() => {
        if (currency === 'USD') {
          const deposit = {
            montant: totalAmount.toFixed(2),
            devise: 'USD',
            breakdown: breakdown,
            sequences: currencySequences,
            timestamp: timestamp, // Add unique timestamp
            vendor: vendeur,
            shift: 'current'
          };
          mettreAJourDepot(vendeur, nextIndex + i, deposit);
        } else {
          const deposit = {
            value: totalAmount.toString(),
            breakdown: breakdown,
            sequences: currencySequences,
            timestamp: timestamp, // Add unique timestamp
            vendor: vendeur,
            shift: 'current'
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
  }, [depositSequences, depotsActuels, mettreAJourDepot, markAsRecentlyAdded, handleClearSequences]);

  const isRecentlyAdded = useCallback((vendeur, index) => {
    return recentlyAdded[`${vendeur}-${index}`] || false;
  }, [recentlyAdded]);

  const isEditingThisDeposit = useCallback((vendeur, index) => {
    return editingDeposit?.vendeur === vendeur && editingDeposit?.index === index;
  }, [editingDeposit]);

  return {
    // State
    vendorInputs,
    vendorPresets,
    depositSequences,
    recentlyAdded,
    editingDeposit,
    expandedVendor,

    // Setters
    setVendorInputs,
    setVendorPresets,
    setDepositSequences,
    setEditingDeposit,
    setExpandedVendor,

    // Presets for use in other components
    htgPresets: exportedHtgPresets,
    usdPresets: exportedUsdPresets,

    // Helper Functions
    convertirUSDversHTG,
    getMontantHTG,
    calculateTotalDepotsHTG,
    isUSDDepot,
    hasBreakdown,
    getOriginalDepotAmount,
    getDepositDisplay,
    calculateSequencesTotalByCurrency,
    calculateTotalSequencesHTG,

    // State Management Functions
    handleToggleVendor,
    initializeVendorState,
    initializeSequences,
    markAsRecentlyAdded,

    // Edit Functions
    handleEditDeposit,
    cancelEdit,
    saveEditedDeposit,
    handleUpdateSequence,

    // Event Handlers
    handleCurrencyButtonClick,
    handlePresetSelect,
    calculatePresetAmount,
    getCurrentPresets,
    isDirectAmount,
    handleInputChange,
    handleAddSequence,
    handleRemoveSequence,
    handleClearSequences,
    calculateSequencesTotal,
    handleAddCompleteDeposit,

    // Check Functions
    isRecentlyAdded,
    isEditingThisDeposit
  };
};