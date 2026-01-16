import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import VendorDepositCard from './VendorDepositCard';
import SequenceManager from './SequenceManager';
import DepositInputsSection from './DepositInputsSection';
import ExistingDepositsList from './ExistingDepositsList';
import DepositsSummary from './DepositsSummary';
import ExchangeRateBanner from './ExchangeRateBanner';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132;
  const depotsActuels = tousDepots[shift] || {};

  // State
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [showPresetsForVendor, setShowPresetsForVendor] = useState(null);
  const [depositSequences, setDepositSequences] = useState({});
  const [recentlyAdded, setRecentlyAdded] = useState({});

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

  // State Management Functions
  const initializeVendorState = (vendeur, currency = 'HTG') => {
    if (!vendorInputs[vendeur]) {
      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    }
    if (!vendorPresets[vendeur]) {
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { currency, preset: 'aucune' }
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

  // Event Handlers
  const handleCurrencySelect = (vendeur, currency) => {
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { currency, preset: 'aucune' }
    }));
    setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    setShowPresetsForVendor(null);
  };

  const handleCurrencyButtonClick = (vendeur, currency) => {
    if (!vendorPresets[vendeur]) {
      initializeVendorState(vendeur, currency);
    } else {
      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { ...prev[vendeur], currency }
      }));
    }
    setShowPresetsForVendor(showPresetsForVendor === vendeur ? null : vendeur);
  };

  const handlePresetSelect = (vendeur, presetValue) => {
    setVendorPresets(prev => ({
      ...prev,
      [vendeur]: { ...prev[vendeur], preset: presetValue }
    }));
    setShowPresetsForVendor(null);
    setTimeout(() => {
      const input = document.querySelector(`input[data-vendor="${vendeur}"]`);
      if (input) input.focus();
    }, 100);
  };

  const calculatePresetAmount = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState || vendorState.preset === 'aucune') {
      return parseFloat(vendorInputs[vendeur] || 0);
    }
    const multiplier = parseFloat(vendorInputs[vendeur] || 1);
    const presetValue = parseFloat(vendorState.preset);
    return presetValue * multiplier;
  };

  const getCurrentPresets = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState) return htgPresets;
    return vendorState.currency === 'HTG' ? htgPresets : usdPresets;
  };

  const getSelectedPresetText = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    if (!vendorState || vendorState.preset === 'aucune') {
      return 'Entrer montant libre';
    }
    const currentPresets = getCurrentPresets(vendeur);
    const preset = currentPresets.find(p => p.value === vendorState.preset);
    return preset ? `× ${preset.label} ${vendorState.currency}` : 'Sélectionner';
  };

  const isDirectAmount = (vendeur) => {
    const vendorState = vendorPresets[vendeur];
    return !vendorState || vendorState.preset === 'aucune';
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

    let amount = 0;
    let currency = vendorState.currency;
    let note = '';

    if (vendorState.preset === 'aucune') {
      amount = parseFloat(inputValue) || 0;
      note = `${amount} ${currency}`;
    } else {
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const multiplier = parseFloat(inputValue);
        const presetValue = parseFloat(vendorState.preset);
        amount = presetValue * multiplier;
        note = `${multiplier} × ${presetValue} ${currency}`;
      } else {
        amount = parseFloat(vendorState.preset);
        note = `${vendorState.preset} ${currency}`;
      }
    }

    if (currency === 'USD') {
      amount = parseFloat(amount.toFixed(2));
    }

    if (amount > 0) {
      initializeSequences(vendeur);
      const newSequence = {
        id: Date.now(),
        amount,
        currency,
        note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDepositSequences(prev => ({
        ...prev,
        [vendeur]: [...(prev[vendeur] || []), newSequence]
      }));

      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));

      if (vendorState.preset !== 'aucune') {
        setVendorPresets(prev => ({
          ...prev,
          [vendeur]: { ...prev[vendeur], preset: 'aucune' }
        }));
      }
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

  const handleAddCompleteDeposit = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    const vendorState = vendorPresets[vendeur];

    if (sequences.length === 0) {
      console.log("No sequences to add");
      return;
    }

    const totalAmount = calculateSequencesTotal(vendeur);
    const currency = vendorState?.currency || 'HTG';

    console.log(`DEBUG: Adding deposit for ${vendeur}: ${totalAmount} ${currency}`);

    // Create breakdown description
    const breakdown = sequences.map(seq => seq.note).join(', ');

    // Get current deposits
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

      console.log(`DEBUG: Creating USD deposit:`, deposit);

      // Add deposit at the new index
      mettreAJourDepot(vendeur, newIndex, deposit);
    } else {
      // Create HTG deposit object
      const deposit = {
        value: totalAmount.toString(),
        breakdown: breakdown,
        sequences: sequences
      };

      console.log(`DEBUG: Creating HTG deposit:`, deposit);

      // Add deposit at the new index
      mettreAJourDepot(vendeur, newIndex, deposit);
    }

    // Mark as recently added for highlighting
    markAsRecentlyAdded(vendeur, newIndex);

    // Clear sequences after adding deposit
    handleClearSequences(vendeur);

    console.log(`DEBUG: Deposit added successfully`);
  };

  return (
    <div className="space-y-4">
      <ExchangeRateBanner tauxDeChange={TAUX_DE_CHANGE} />

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
              const donneesVendeur = totauxVendeurs[vendeur];
              const totalDepotHTG = donneesVendeur?.depot || 0;
              const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
              const depots = depotsActuels[vendeur] || [];

              if (!vendorPresets[vendeur]) {
                initializeVendorState(vendeur, 'HTG');
              }

              const vendorState = vendorPresets[vendeur];
              const currentPresets = getCurrentPresets(vendeur);
              const isDirectMode = isDirectAmount(vendeur);
              const sequences = depositSequences[vendeur] || [];
              const sequencesTotal = calculateSequencesTotal(vendeur);

              return (
                <VendorDepositCard
                  key={vendeur}
                  vendeur={vendeur}
                  donneesVendeur={donneesVendeur}
                  especesAttendues={especesAttendues}
                  totalDepotHTG={totalDepotHTG}
                >
                  <DepositInputsSection
                    vendeur={vendeur}
                    vendorState={vendorState}
                    handleCurrencyButtonClick={handleCurrencyButtonClick}
                  >
                    <SequenceManager
                      vendeur={vendeur}
                      vendorState={vendorState}
                      sequences={sequences}
                      sequencesTotal={sequencesTotal}
                      vendorInputs={vendorInputs}
                      isDirectMode={isDirectMode}
                      showPresetsForVendor={showPresetsForVendor}
                      currentPresets={currentPresets}
                      handleClearSequences={handleClearSequences}
                      handleRemoveSequence={handleRemoveSequence}
                      setShowPresetsForVendor={setShowPresetsForVendor}
                      handlePresetSelect={handlePresetSelect}
                      handleInputChange={handleInputChange}
                      handleAddSequence={handleAddSequence}
                      handleAddCompleteDeposit={handleAddCompleteDeposit}
                      getSelectedPresetText={getSelectedPresetText}
                      calculatePresetAmount={calculatePresetAmount}
                      htgPresets={htgPresets}
                      usdPresets={usdPresets}
                    />
                  </DepositInputsSection>

                  <ExistingDepositsList
                    vendeur={vendeur}
                    depots={depots}
                    mettreAJourDepot={mettreAJourDepot}
                    supprimerDepot={supprimerDepot}
                    isRecentlyAdded={isRecentlyAdded}
                    getDisplayValue={getDisplayValue}
                    isUSDDepot={isUSDDepot}
                    getMontantHTG={getMontantHTG}
                    getDepositDisplay={getDepositDisplay}
                    hasBreakdown={hasBreakdown}
                    getOriginalDepotAmount={getOriginalDepotAmount}
                  />

                  <DepositsSummary
                    vendeur={vendeur}
                    depots={depots}
                    isRecentlyAdded={isRecentlyAdded}
                    getMontantHTG={getMontantHTG}
                    isUSDDepot={isUSDDepot}
                    getOriginalDepotAmount={getOriginalDepotAmount}
                    getDepositDisplay={getDepositDisplay}
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