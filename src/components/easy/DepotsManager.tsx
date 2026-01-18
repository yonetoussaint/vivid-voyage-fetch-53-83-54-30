import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Package, Filter, Grid, Layers } from 'lucide-react';
import VendorDepositCard from './VendorDepositCard';
import SequenceManager from './SequenceManager';
import DepositsSummary from './DepositsSummary';
import ExchangeRateBanner from './ExchangeRateBanner';
import { formaterArgent } from '@/utils/formatters';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
  const TAUX_DE_CHANGE = 132;
  const depotsActuels = tousDepots[shift] || {};

  // Haitian Gourde denominations (1000, 500, 250, 100, 50, 25, 10)
  const DENOMINATIONS = [
    { value: 1000, label: '1000', color: 'bg-purple-100 text-purple-800' },
    { value: 500, label: '500', color: 'bg-blue-100 text-blue-800' },
    { value: 250, label: '250', color: 'bg-green-100 text-green-800' },
    { value: 100, label: '100', color: 'bg-yellow-100 text-yellow-800' },
    { value: 50, label: '50', color: 'bg-orange-100 text-orange-800' },
    { value: 25, label: '25', color: 'bg-red-100 text-red-800' },
    { value: 10, label: '10', color: 'bg-gray-100 text-gray-800' }
  ];

  const BILLS_PER_LIAS = 100; // Each lias contains 100 bills

  // State
  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorPresets, setVendorPresets] = useState({});
  const [depositSequences, setDepositSequences] = useState({});
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [editingDeposit, setEditingDeposit] = useState(null);
  
  // NEW: State for denomination tracking per vendor
  const [denominationsByVendor, setDenominationsByVendor] = useState({});
  const [showDenominationView, setShowDenominationView] = useState(false);

  // Presets
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

  // Calculate total deposits for a vendor
  const calculateTotalDepotsHTG = (vendeur) => {
    const depots = depotsActuels[vendeur] || [];
    return depots.reduce((total, depot) => total + getMontantHTG(depot), 0);
  };

  const isUSDDepot = (depot) => {
    return typeof depot === 'object' && depot.devise === 'USD';
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

  // NEW: Parse deposit breakdown to extract denominations
  const parseDepositForDenominations = (depot) => {
    const bills = {};
    
    // Initialize all denominations to 0
    DENOMINATIONS.forEach(denom => {
      bills[denom.value] = 0;
    });
    
    if (!depot) return bills;
    
    // If deposit has a breakdown string
    if (typeof depot === 'object' && depot.breakdown) {
      const breakdown = depot.breakdown;
      // Parse patterns like "5 × 1000 HTG, 10 × 500 HTG"
      const parts = breakdown.split(',');
      
      parts.forEach(part => {
        const trimmed = part.trim();
        const match = trimmed.match(/(?:(\d+)\s*[×x]\s*)?(\d+)/i);
        
        if (match) {
          const quantity = match[1] ? parseInt(match[1]) : 1;
          const denomination = parseInt(match[2]);
          
          // Check if this is a valid denomination
          const validDenom = DENOMINATIONS.find(d => d.value === denomination);
          if (validDenom && quantity > 0) {
            bills[denomination] += quantity;
          }
        }
      });
    }
    
    return bills;
  };

  // NEW: Update denominations for all vendors based on deposits
  useEffect(() => {
    const newDenominations = {};
    
    Object.entries(depotsActuels).forEach(([vendeurId, deposits]) => {
      if (!Array.isArray(deposits)) return;
      
      // Initialize vendor
      if (!newDenominations[vendeurId]) {
        newDenominations[vendeurId] = {
          bills: DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}),
          totalBills: 0,
          totalValue: 0
        };
      }
      
      // Process each deposit
      deposits.forEach(depot => {
        const depositBills = parseDepositForDenominations(depot);
        
        // Add to vendor totals
        Object.entries(depositBills).forEach(([denom, count]) => {
          const denomination = parseInt(denom);
          newDenominations[vendeurId].bills[denomination] += count;
          newDenominations[vendeurId].totalBills += count;
          newDenominations[vendeurId].totalValue += count * denomination;
        });
      });
    });
    
    setDenominationsByVendor(newDenominations);
  }, [depotsActuels]);

  // NEW: Calculate total denominations across all vendors
  const calculateTotalDenominations = () => {
    const totals = {
      bills: DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}),
      totalBills: 0,
      totalValue: 0
    };
    
    Object.values(denominationsByVendor).forEach(vendor => {
      DENOMINATIONS.forEach(denom => {
        totals.bills[denom.value] += vendor.bills[denom.value] || 0;
      });
      totals.totalBills += vendor.totalBills;
      totals.totalValue += vendor.totalValue;
    });
    
    return totals;
  };

  // NEW: Calculate how many liasses (100-bill bundles) we can make
  const calculateLiasses = () => {
    const totals = calculateTotalDenominations();
    const totalBills = totals.totalBills;
    
    // Each lias has 100 bills
    const possibleLiasses = Math.floor(totalBills / BILLS_PER_LIAS);
    const remainingBills = totalBills % BILLS_PER_LIAS;
    
    return {
      possibleLiasses,
      remainingBills,
      totalBills,
      billsUsed: possibleLiasses * BILLS_PER_LIAS,
      percentageUsed: totalBills > 0 ? Math.round((possibleLiasses * BILLS_PER_LIAS / totalBills) * 100) : 0
    };
  };

  // NEW: Manually adjust denominations for a vendor
  const handleDenominationAdjustment = (vendeurId, denomination, delta) => {
    setDenominationsByVendor(prev => {
      const newData = { ...prev };
      
      if (!newData[vendeurId]) {
        newData[vendeurId] = {
          bills: DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}),
          totalBills: 0,
          totalValue: 0
        };
      }
      
      const current = newData[vendeurId].bills[denomination] || 0;
      const newValue = Math.max(0, current + delta);
      
      // Update the count
      newData[vendeurId].bills[denomination] = newValue;
      
      // Recalculate totals
      let totalBills = 0;
      let totalValue = 0;
      
      DENOMINATIONS.forEach(denom => {
        const count = newData[vendeurId].bills[denom.value] || 0;
        totalBills += count;
        totalValue += count * denom.value;
      });
      
      newData[vendeurId].totalBills = totalBills;
      newData[vendeurId].totalValue = totalValue;
      
      return newData;
    });
  };

  // Rest of your existing functions (truncated for brevity)...
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

  const calculateTotalSequencesHTG = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];
    return sequences.reduce((total, seq) => {
      if (seq.currency === 'USD') {
        return total + (seq.amount * TAUX_DE_CHANGE);
      }
      return total + seq.amount;
    }, 0);
  };

  const initializeVendorState = (vendeur, currency = 'HTG') => {
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

  const handleEditDeposit = (vendeur, index) => {
    const depot = depotsActuels[vendeur]?.[index];
    if (!depot) return;

    setEditingDeposit({ vendeur, index });
    // ... rest of edit logic
  };

  const cancelEdit = (vendeur) => {
    setEditingDeposit(null);
    setDepositSequences(prev => ({ ...prev, [vendeur]: [] }));
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
          preset: smallestPreset
        }
      }));
    }
    handleInputChange(vendeur, '');
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

  // NEW: Create breakdown string for deposit
  const createBreakdownString = (sequences) => {
    // Group HTG sequences by denomination
    const htgSequences = sequences.filter(seq => seq.currency === 'HTG');
    const bills = {};
    
    htgSequences.forEach(seq => {
      const match = seq.note.match(/(?:(\d+)\s*[×x]\s*)?(\d+)/i);
      if (match) {
        const quantity = match[1] ? parseInt(match[1]) : 1;
        const denomination = parseInt(match[2]);
        
        if (!bills[denomination]) {
          bills[denomination] = 0;
        }
        bills[denomination] += quantity;
      }
    });
    
    // Format as "5 × 1000, 10 × 500"
    return Object.entries(bills)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .map(([denom, qty]) => `${qty} × ${denom}`)
      .join(', ');
  };

  const handleAddCompleteDeposit = (vendeur) => {
    const sequences = depositSequences[vendeur] || [];

    if (sequences.length === 0) return;

    const sequencesByCurrency = sequences.reduce((acc, seq) => {
      const currency = seq.currency || 'HTG';
      if (!acc[currency]) {
        acc[currency] = [];
      }
      acc[currency].push(seq);
      return acc;
    }, {});

    const currentDepots = depotsActuels[vendeur] || [];
    let nextIndex = currentDepots.length;

    Object.entries(sequencesByCurrency).forEach(([currency, currencySequences], i) => {
      const totalAmount = currencySequences.reduce((total, seq) => total + seq.amount, 0);
      
      // Create breakdown string
      const breakdown = createBreakdownString(currencySequences);

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
      }, i * 50);
    });

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

  // Calculate liasses stats
  const liasseStats = calculateLiasses();

  return (
    <div className="space-y-4">
      <ExchangeRateBanner tauxDeChange={TAUX_DE_CHANGE} />

      {/* NEW: Denomination Summary Toggle */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Conditionnement des Billets</h3>
          </div>
          <button
            onClick={() => setShowDenominationView(!showDenominationView)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Layers size={18} />
            {showDenominationView ? 'Masquer' : 'Afficher'} Détail
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Total Billets</p>
            <p className="text-2xl font-bold text-blue-900">{liasseStats.totalBills}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Liasses Possibles</p>
            <p className="text-2xl font-bold text-green-900">{liasseStats.possibleLiasses}</p>
            <p className="text-xs text-green-700">(100 billets/lias)</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-600">Billets Restants</p>
            <p className="text-2xl font-bold text-yellow-900">{liasseStats.remainingBills}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600">Valeur Totale</p>
            <p className="text-2xl font-bold text-purple-900">
              {calculateTotalDenominations().totalValue.toLocaleString()} HTG
            </p>
          </div>
        </div>

        {/* Detailed Denomination View */}
        {showDenominationView && (
          <div className="border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calculator size={18} />
              Détail par Dénomination
            </h4>
            
            {/* Global Summary */}
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-4">
                {DENOMINATIONS.map(denom => {
                  const total = calculateTotalDenominations().bills[denom.value];
                  return (
                    <div key={denom.value} className={`${denom.color} p-3 rounded-lg text-center`}>
                      <p className="text-sm font-medium">{denom.label} HTG</p>
                      <p className="text-2xl font-bold mt-1">{total}</p>
                      <p className="text-xs mt-1">{(total * denom.value).toLocaleString()} HTG</p>
                    </div>
                  );
                })}
              </div>
              
              {/* Liasses Calculation */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Calcul des Liasses:</p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">{liasseStats.totalBills} billets</span> ÷ 
                  <span className="font-bold"> 100 billets/lias</span> = 
                  <span className="font-bold text-green-600"> {liasseStats.possibleLiasses} liasses</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Avec <span className="font-bold">{liasseStats.remainingBills} billets</span> restants
                </p>
              </div>
            </div>

            {/* Per Vendor Breakdown */}
            <h5 className="font-medium text-gray-900 mb-3">Par Vendeur:</h5>
            <div className="space-y-4">
              {vendeurs.map(vendeur => {
                const vendorDenoms = denominationsByVendor[vendeur.id];
                if (!vendorDenoms || vendorDenoms.totalBills === 0) return null;
                
                return (
                  <div key={vendeur.id} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium text-gray-900">{vendeur.nom}</h6>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {vendorDenoms.totalBills} billets
                        </p>
                        <p className="text-sm font-bold">
                          {vendorDenoms.totalValue.toLocaleString()} HTG
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-1">
                      {DENOMINATIONS.map(denom => {
                        const count = vendorDenoms.bills[denom.value] || 0;
                        if (count === 0) return null;
                        
                        return (
                          <div key={denom.value} className={`${denom.color} p-2 rounded text-center`}>
                            <p className="text-xs font-medium">{denom.label}</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <span className="text-sm font-bold">{count}</span>
                              <div className="flex flex-col">
                                <button
                                  onClick={() => handleDenominationAdjustment(vendeur.id, denom.value, 1)}
                                  className="text-xs hover:bg-white/50 rounded px-1"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => handleDenominationAdjustment(vendeur.id, denom.value, -1)}
                                  className="text-xs hover:bg-white/50 rounded px-1"
                                >
                                  -
                                </button>
                              </div>
                            </div>
                            <p className="text-xs mt-1">{(count * denom.value).toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {Object.keys(denominationsByVendor).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Aucun dépôt avec décomposition de billets</p>
                  <p className="text-sm mt-1">Ajoutez des dépôts avec des séquences HTG</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Original Deposits Section */}
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
              const donneesVendeur = totauxVendeurs[vendeur.id];
              const totalDepotHTG = calculateTotalDepotsHTG(vendeur.id);
              const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
              const depots = depotsActuels[vendeur.id] || [];

              // Initialize vendor state if not exists
              if (!vendorPresets[vendeur.id]) {
                initializeVendorState(vendeur.id, 'HTG');
              }

              const vendorState = vendorPresets[vendeur.id];
              const currentPresets = getCurrentPresets(vendeur.id);
              const sequences = depositSequences[vendeur.id] || [];
              const sequencesTotal = calculateSequencesTotal(vendeur.id);
              const sequencesTotalByCurrency = calculateSequencesTotalByCurrency(vendeur.id);
              const totalSequencesHTG = calculateTotalSequencesHTG(vendeur.id);
              const isEditingMode = editingDeposit?.vendeur === vendeur.id;

              return (
                <VendorDepositCard
                  key={vendeur.id}
                  vendeur={vendeur.nom}
                  donneesVendeur={donneesVendeur}
                  especesAttendues={especesAttendues}
                  totalDepotHTG={totalDepotHTG}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">
                        {isEditingMode ? 
                          `Éditer Dépôt #${editingDeposit.index + 1}` : 
                          'Ajouter Nouveau Dépôt'}
                      </span>
                      {isEditingMode && (
                        <button
                          onClick={() => cancelEdit(vendeur.id)}
                          className="px-2 py-1.5 rounded-lg font-bold text-xs bg-red-500 text-white"
                        >
                          Annuler
                        </button>
                      )}
                    </div>

                    <SequenceManager
                      vendeur={vendeur.id}
                      vendorState={vendorState}
                      sequences={sequences}
                      sequencesTotal={sequencesTotal}
                      sequencesTotalByCurrency={sequencesTotalByCurrency}
                      totalSequencesHTG={totalSequencesHTG}
                      vendorInputs={vendorInputs}
                      currentPresets={currentPresets}
                      handleClearSequences={handleClearSequences}
                      handleRemoveSequence={handleRemoveSequence}
                      handlePresetSelect={handlePresetSelect}
                      handleInputChange={handleInputChange}
                      handleAddSequence={handleAddSequence}
                      handleAddCompleteDeposit={isEditingMode ? 
                        () => {} : // Save edit function would go here
                        () => handleAddCompleteDeposit(vendeur.id)}
                      calculatePresetAmount={calculatePresetAmount}
                      htgPresets={htgPresets}
                      usdPresets={usdPresets}
                      setVendorPresets={setVendorPresets}
                      TAUX_DE_CHANGE={TAUX_DE_CHANGE}
                    />
                  </div>

                  <DepositsSummary
                    vendeur={vendeur.id}
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
                    exchangeRate={TAUX_DE_CHANGE}
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