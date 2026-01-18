import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Package, Calculator, Filter, SortAsc, SortDesc, FileText } from 'lucide-react';

const ConditionnementManager = ({ 
  shift, 
  date,
  vendeurs,
  tousDepots,
  onConditionnementUpdate 
}) => {
  // Haitian Gourde denominations
  const DENOMINATIONS = [
    { value: 1000, label: '1000 HTG', color: 'bg-purple-100 text-purple-800' },
    { value: 500, label: '500 HTG', color: 'bg-blue-100 text-blue-800' },
    { value: 250, label: '250 HTG', color: 'bg-green-100 text-green-800' },
    { value: 100, label: '100 HTG', color: 'bg-yellow-100 text-yellow-800' },
    { value: 50, label: '50 HTG', color: 'bg-orange-100 text-orange-800' },
    { value: 25, label: '25 HTG', color: 'bg-red-100 text-red-800' },
    { value: 10, label: '10 HTG', color: 'bg-gray-100 text-gray-800' }
  ];

  // Standard liasse (cash bundle) sizes
  const LIASSE_SIZES = [
    { value: 10000, label: '10,000 HTG' },
    { value: 5000, label: '5,000 HTG' },
    { value: 2500, label: '2,500 HTG' },
    { value: 1000, label: '1,000 HTG' }
  ];

  // State
  const [billetsParVendeur, setBilletsParVendeur] = useState({});
  const [liassesFormees, setLiassesFormees] = useState([]);
  const [selectedLiasseSize, setSelectedLiasseSize] = useState(5000);
  const [sortBy, setSortBy] = useState('total');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAllShifts, setShowAllShifts] = useState(true);

  // Parse a deposit breakdown string like "5 × 1000 HTG, 10 × 500 HTG"
  const parseBreakdownString = (breakdown) => {
    const bills = {};
    
    // Initialize all denominations to 0
    DENOMINATIONS.forEach(denom => {
      bills[denom.value] = 0;
    });
    
    if (!breakdown) return bills;
    
    // Split by commas and process each part
    const parts = breakdown.split(',');
    
    parts.forEach(part => {
      const trimmed = part.trim();
      
      // Match patterns like "5 × 1000 HTG" or "10x500 HTG" or "1000 HTG"
      const match = trimmed.match(/(?:(\d+)\s*[×x]\s*)?(\d+)\s*HTG/i);
      
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
    
    return bills;
  };

  // Process sequences from deposits
  const processSequences = (sequences) => {
    const bills = {};
    
    // Initialize all denominations to 0
    DENOMINATIONS.forEach(denom => {
      bills[denom.value] = 0;
    });
    
    if (!sequences || !Array.isArray(sequences)) return bills;
    
    sequences.forEach(seq => {
      if (seq.currency === 'HTG' && seq.note) {
        // Parse the note which contains the breakdown
        const parsed = parseBreakdownString(seq.note);
        Object.keys(parsed).forEach(denom => {
          bills[parseInt(denom)] += parsed[denom];
        });
      }
    });
    
    return bills;
  };

  // Analyze all deposits to extract bills
  const analyzeDeposits = useMemo(() => {
    const result = {};
    
    if (!tousDepots || !vendeurs || vendeurs.length === 0) return result;
    
    // Process all shifts or just current shift
    const shiftsToProcess = showAllShifts ? Object.keys(tousDepots) : [shift];
    
    shiftsToProcess.forEach(currentShift => {
      const shiftDeposits = tousDepots[currentShift] || {};
      
      Object.entries(shiftDeposits).forEach(([vendeurId, deposits]) => {
        if (!Array.isArray(deposits) || deposits.length === 0) return;
        
        // Find vendeur name
        const vendeur = vendeurs.find(v => v.id === vendeurId);
        if (!vendeur) return;
        
        // Initialize vendeur data if not exists
        if (!result[vendeurId]) {
          result[vendeurId] = {
            id: vendeurId,
            nom: vendeur.nom,
            billets: DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}),
            totalHTG: 0,
            shift: currentShift,
            depositsCount: 0
          };
        }
        
        // Process each deposit
        deposits.forEach(depot => {
          let bills = {};
          
          if (depot.sequences && Array.isArray(depot.sequences)) {
            // Use sequences if available
            bills = processSequences(depot.sequences);
          } else if (depot.breakdown) {
            // Use breakdown string
            bills = parseBreakdownString(depot.breakdown);
          } else if (depot.value && typeof depot === 'object' && !depot.devise) {
            // Simple HTG deposit - try to break it down
            const amount = parseFloat(depot.value) || 0;
            if (amount > 0) {
              // Try to break down into largest denominations
              let remaining = amount;
              bills = {};
              
              DENOMINATIONS.sort((a, b) => b.value - a.value).forEach(denom => {
                if (remaining >= denom.value) {
                  const count = Math.floor(remaining / denom.value);
                  bills[denom.value] = count;
                  remaining -= count * denom.value;
                } else {
                  bills[denom.value] = 0;
                }
              });
            }
          }
          
          // Add bills to vendeur total
          Object.entries(bills).forEach(([denom, count]) => {
            const denomination = parseInt(denom);
            result[vendeurId].billets[denomination] += count;
            result[vendeurId].totalHTG += count * denomination;
          });
          
          result[vendeurId].depositsCount++;
        });
      });
    });
    
    return result;
  }, [tousDepots, vendeurs, shift, showAllShifts]);

  // Calculate how many liasses can be formed
  const calculateLiasses = (bills, targetAmount) => {
    const denominations = [...DENOMINATIONS].sort((a, b) => b.value - a.value);
    const billsCopy = { ...bills };
    const liasses = [];
    
    // Try to form as many liasses as possible
    while (true) {
      let remaining = targetAmount;
      const billsUsed = {};
      const billDetails = [];
      let liasseFormed = false;
      
      // Try to use largest denominations first
      denominations.forEach(denom => {
        const available = billsCopy[denom.value] || 0;
        if (available > 0 && denom.value <= remaining) {
          const needed = Math.min(Math.floor(remaining / denom.value), available);
          if (needed > 0) {
            billsUsed[denom.value] = needed;
            billDetails.push(`${needed} × ${denom.value} HTG`);
            remaining -= needed * denom.value;
          }
        }
      });
      
      // Check if we formed a complete liasse
      if (remaining === 0 && Object.keys(billsUsed).length > 0) {
        // Remove used bills from available pool
        Object.keys(billsUsed).forEach(denom => {
          billsCopy[denom] -= billsUsed[denom];
        });
        
        liasses.push({
          size: targetAmount,
          billsUsed,
          composition: billDetails.join(', '),
          total: targetAmount
        });
        liasseFormed = true;
      }
      
      // If we couldn't form a liasse, break the loop
      if (!liasseFormed) break;
    }
    
    return {
      liasses,
      remainingBills: billsCopy,
      totalLiasses: liasses.length,
      totalLiasseValue: liasses.reduce((sum, l) => sum + l.total, 0),
      remainingTotal: Object.entries(billsCopy).reduce(
        (sum, [denom, qty]) => sum + (parseInt(denom) * qty), 0
      )
    };
  };

  // Initialize and update data
  useEffect(() => {
    setBilletsParVendeur(analyzeDeposits);
  }, [analyzeDeposits]);

  // Calculate liasses whenever data changes
  useEffect(() => {
    const calculatedLiasses = {};
    
    Object.entries(billetsParVendeur).forEach(([vendeurId, data]) => {
      calculatedLiasses[vendeurId] = calculateLiasses(data.billets, selectedLiasseSize);
    });
    
    // Convert to array format for display
    const liassesArray = Object.entries(calculatedLiasses).map(([vendeurId, data]) => {
      const vendeurData = billetsParVendeur[vendeurId];
      return {
        vendeurId,
        vendeurNom: vendeurData?.nom || vendeurId,
        ...data
      };
    });
    
    setLiassesFormees(liassesArray);
    
    // Notify parent component if needed
    if (onConditionnementUpdate) {
      onConditionnementUpdate(liassesArray);
    }
  }, [billetsParVendeur, selectedLiasseSize]);

  // Handle manual adjustment of bills
  const handleBillAdjustment = (vendeurId, denomination, delta) => {
    setBilletsParVendeur(prev => {
      const newData = { ...prev };
      if (newData[vendeurId]) {
        const current = newData[vendeurId].billets[denomination] || 0;
        const newValue = Math.max(0, current + delta);
        
        newData[vendeurId].billets[denomination] = newValue;
        
        // Recalculate total
        newData[vendeurId].totalHTG = DENOMINATIONS.reduce((sum, denom) => {
          return sum + (newData[vendeurId].billets[denom.value] || 0) * denom.value;
        }, 0);
      }
      
      return newData;
    });
  };

  // Sort data
  const sortedVendeurs = useMemo(() => {
    const vendeursArray = Object.values(billetsParVendeur);
    
    return vendeursArray.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'name':
          return multiplier * a.nom.localeCompare(b.nom);
        case 'total':
        default:
          return multiplier * (b.totalHTG - a.totalHTG);
      }
    });
  }, [billetsParVendeur, sortBy, sortOrder]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalBills = {};
    let totalHTG = 0;
    let totalVendeurs = 0;
    
    // Initialize totals
    DENOMINATIONS.forEach(denom => {
      totalBills[denom.value] = 0;
    });
    
    // Sum up all bills
    Object.values(billetsParVendeur).forEach(vendeur => {
      DENOMINATIONS.forEach(denom => {
        totalBills[denom.value] += vendeur.billets[denom.value] || 0;
      });
      totalHTG += vendeur.totalHTG;
      totalVendeurs++;
    });
    
    return { totalBills, totalHTG, totalVendeurs };
  }, [billetsParVendeur]);

  // Calculate total liasses formed
  const totalLiasses = liassesFormees.reduce((sum, v) => sum + v.totalLiasses, 0);
  const totalLiasseValue = liassesFormees.reduce((sum, v) => sum + v.totalLiasseValue, 0);
  const efficiency = totals.totalHTG > 0 ? Math.round((totalLiasseValue / totals.totalHTG) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-green-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conditionnement des Espèces</h2>
            <p className="text-gray-600">
              Analyse des billets et formation des liasses
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllShifts(!showAllShifts)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              showAllShifts 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {showAllShifts ? 'Tous Shifts' : `Shift ${shift}`}
          </button>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {date}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille de Liasse
          </label>
          <select
            value={selectedLiasseSize}
            onChange={(e) => setSelectedLiasseSize(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {LIASSE_SIZES.map(size => (
              <option key={size.value} value={size.value}>
                Liasse {size.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="total">Total HTG</option>
              <option value="name">Nom Vendeur</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Résumé
          </label>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText size={18} />
            <span>
              {sortedVendeurs.length} vendeur{sortedVendeurs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Total Billets</p>
          <p className="text-3xl font-bold text-green-900">
            {totals.totalHTG.toLocaleString()} HTG
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">Liasses Formées</p>
          <p className="text-3xl font-bold text-blue-900">{totalLiasses}</p>
          <p className="text-sm text-blue-700 mt-1">
            {totalLiasseValue.toLocaleString()} HTG
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium mb-1">Efficacité</p>
          <p className="text-3xl font-bold text-purple-900">{efficiency}%</p>
          <p className="text-sm text-purple-700 mt-1">de billets liassés</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600 font-medium mb-1">Reste</p>
          <p className="text-3xl font-bold text-yellow-900">
            {(totals.totalHTG - totalLiasseValue).toLocaleString()} HTG
          </p>
          <p className="text-sm text-yellow-700 mt-1">non liassé</p>
        </div>
      </div>

      {/* Denomination Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Répartition par Dénomination
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {DENOMINATIONS.map(denom => (
            <div key={denom.value} className={`${denom.color} p-3 rounded-lg text-center`}>
              <p className="text-sm font-medium">{denom.label}</p>
              <p className="text-2xl font-bold mt-1">
                {totals.totalBills[denom.value]}
              </p>
              <p className="text-xs mt-1">
                {(totals.totalBills[denom.value] * denom.value).toLocaleString()} HTG
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vendeur Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détail par Vendeur
        </h3>
        
        {sortedVendeurs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto mb-2" size={32} />
            <p>Aucune donnée de dépôts disponible</p>
            <p className="text-sm mt-1">
              Les vendeurs doivent avoir des dépôts avec décomposition en billets
            </p>
          </div>
        ) : (
          sortedVendeurs.map(vendeur => {
            const vendeurLiasses = liassesFormees.find(l => l.vendeurId === vendeur.id);
            
            return (
              <div key={vendeur.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                {/* Vendeur Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{vendeur.nom}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        Total: <span className="font-bold">{vendeur.totalHTG.toLocaleString()} HTG</span>
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {vendeur.depositsCount} dépôt{vendeur.depositsCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        {vendeur.shift}
                      </span>
                    </div>
                  </div>
                  
                  {vendeurLiasses && vendeurLiasses.totalLiasses > 0 && (
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {vendeurLiasses.totalLiasses} liasses
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {vendeurLiasses.totalLiasseValue.toLocaleString()} HTG liassés
                      </p>
                    </div>
                  )}
                </div>

                {/* Bills Breakdown */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Détail des billets:</p>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    {DENOMINATIONS.map(denom => {
                      const count = vendeur.billets[denom.value] || 0;
                      
                      return (
                        <div key={denom.value} className={`${denom.color} p-2 rounded text-center`}>
                          <p className="text-xs font-medium">{denom.label}</p>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-lg font-bold">{count}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleBillAdjustment(vendeur.id, denom.value, 1)}
                                className="text-xs hover:bg-white/50 rounded"
                                title="Ajouter un billet"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleBillAdjustment(vendeur.id, denom.value, -1)}
                                className="text-xs hover:bg-white/50 rounded"
                                title="Retirer un billet"
                              >
                                -
                              </button>
                            </div>
                          </div>
                          <p className="text-xs mt-1">{(count * denom.value).toLocaleString()} HTG</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Liasses Formed */}
                {vendeurLiasses && vendeurLiasses.liasses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      Liasses formées ({selectedLiasseSize.toLocaleString()} HTG):
                    </p>
                    <div className="space-y-2">
                      {vendeurLiasses.liasses.map((liasse, idx) => (
                        <div key={idx} className="bg-green-50 p-3 rounded border border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-green-800">
                              Liasse #{idx + 1}
                            </span>
                            <span className="font-bold text-green-900">
                              {liasse.total.toLocaleString()} HTG
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            {liasse.composition}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {vendeurLiasses.remainingTotal > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Reste non liassé:</span>{' '}
                          {vendeurLiasses.remainingTotal.toLocaleString()} HTG
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(!vendeurLiasses || vendeurLiasses.liasses.length === 0) && vendeur.totalHTG > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        Impossible de former des liasses de {selectedLiasseSize.toLocaleString()} HTG
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Total disponible: {vendeur.totalHTG.toLocaleString()} HTG
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>Note: Les ajustements manuels sont sauvegardés localement</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Imprimer Rapport
          </button>
          <button
            onClick={() => {
              const report = {
                date,
                shift: showAllShifts ? 'all' : shift,
                totals,
                liassesFormees,
                selectedLiasseSize,
                vendeurs: sortedVendeurs
              };
              console.log('Rapport de conditionnement:', report);
              alert('Rapport généré dans la console');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Générer Rapport
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionnementManager;