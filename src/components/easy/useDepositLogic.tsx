import { useState, useCallback } from 'react';
import { formaterArgent } from '@/utils/formatters';

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

export const useDepositLogic = ({ TAUX_DE_CHANGE, depotsActuels, vendeurs, mettreAJourDepot, supprimerDepot }) => {
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [depositSequences, setDepositSequences] = useState({});
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [editingDeposit, setEditingDeposit] = useState(null);
  const [expandedVendor, setExpandedVendor] = useState(null);

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

  const handleToggleVendor = useCallback((vendeur) => {
    setExpandedVendor(prev => prev === vendeur ? null : vendeur);
  }, []);

  const initializeVendorState = useCallback((vendeur, currency = 'HTG') => {
    if (!vendorInputs[vendeur]) {
      setVendorInputs(prev => ({ ...prev, [vendeur]: '' }));
    }
    if (!vendorPresets[vendeur]) {
      const presets = currency === 'HTG' ? htgPresets : usdPresets;
      const smallestPreset = presets[0]?.value || '1';

      setVendorPresets(prev => ({
        ...prev,
        [vendeur]: { currency, preset: smallestPreset }
      }));
    }
  }, [vendorInputs, vendorPresets]);

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

  const isRecentlyAdded = useCallback((vendeur, index) => {
    return recentlyAdded[`${vendeur}-${index}`] || false;
  }, [recentlyAdded]);

  const isEditingThisDeposit = useCallback((vendeur, index) => {
    return editingDeposit?.vendeur === vendeur && editingDeposit?.index === index;
  }, [editingDeposit]);

  // Rest of the logic functions (handleEditDeposit, cancelEdit, saveEditedDeposit, etc.)
  // ... would be moved here with useCallback wrappers

  return {
    vendorInputs,
    vendorPresets,
    depositSequences,
    recentlyAdded,
    editingDeposit,
    expandedVendor,
    handleToggleVendor,
    initializeVendorState,
    calculateTotalDepotsHTG,
    isRecentlyAdded,
    isEditingThisDeposit,
    getMontantHTG,
    isUSDDepot,
    getOriginalDepotAmount,
    getDepositDisplay,
    // Include all other functions...
  };
};