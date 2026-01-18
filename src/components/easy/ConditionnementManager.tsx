import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Package, Calculator, Filter, SortAsc, SortDesc } from 'lucide-react';

const ConditionnementManager = ({ 
  shift, 
  date,
  vendeurs,
  tousDepots, // Access all deposits data
  onConditionnementUpdate 
}) => {
  // Denominations in Haitian Gourdes
  const DENOMINATIONS = [
    { value: 1000, label: '1000 HTG', color: 'bg-purple-100 text-purple-800' },
    { value: 500, label: '500 HTG', color: 'bg-blue-100 text-blue-800' },
    { value: 250, label: '250 HTG', color: 'bg-green-100 text-green-800' },
    { value: 100, label: '100 HTG', color: 'bg-yellow-100 text-yellow-800' },
    { value: 50, label: '50 HTG', color: 'bg-orange-100 text-orange-800' },
    { value: 25, label: '25 HTG', color: 'bg-red-100 text-red-800' },
    { value: 10, label: '10 HTG', color: 'bg-gray-100 text-gray-800' }
  ];

  // Standard liasse sizes
  const LIASSE_SIZES = [
    { value: 10000, label: 'Liasse 10,000 HTG' },
    { value: 5000, label: 'Liasse 5,000 HTG' },
    { value: 2500, label: 'Liasse 2,500 HTG' },
    { value: 1000, label: 'Liasse 1,000 HTG' }
  ];

  // State
  const [billetsParVendeur, setBilletsParVendeur] = useState({});
  const [liassesFormees, setLiassesFormees] = useState([]);
  const [selectedLiasseSize, setSelectedLiasseSize] = useState(5000);
  const [sortBy, setSortBy] = useState('total'); // 'total', 'name', 'denomination'
  const [sortOrder, setSortOrder] = useState('desc');
  const [filtreDenomination, setFiltreDenomination] = useState('all');

  // Process deposits to extract bills
  const processDeposits = useMemo(() => {
    const result = {};
    
    if (!tousDepots || !vendeurs) return result;

    // Process each shift (AM and PM)
    Object.entries(tousDepots).forEach(([currentShift, shiftDeposits]) => {
      Object.entries(shiftDeposits).forEach(([vendeurId, deposits]) => {
        if (!Array.isArray(deposits)) return;
        
        // Initialize vendeur data if not exists
        if (!result[vendeurId]) {
          result[vendeurId] = {
            nom: vendeurs.find(v => v.id === vendeurId)?.nom || vendeurId,
            billets: DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}),
            totalHTG: 0,
            shift: currentShift
          };
        }

        // Process each deposit
        deposits.forEach(depot => {
          if (typeof depot === 'object' && depot.breakdown) {
            // Parse breakdown string like "10 × 1000 HTG, 5 × 500 HTG"
            parseBreakdown(depot.breakdown, result[vendeurId]);
          } else if (typeof depot === 'object' && depot.sequences) {
            // Process sequences
            depot.sequences.forEach(seq => {
              if (seq.note && seq.currency === 'HTG') {
                parseBreakdown(seq.note, result[vendeurId]);
              }
            });
          }
        });
      });
    });

    return result;
  }, [tousDepots, vendeurs]);

  // Parse breakdown string
  const parseBreakdown = (breakdown, vendeurData) => {
    if (!breakdown) return;
    
    // Split by commas and process each part
    const parts = breakdown.split(',');
    
    parts.forEach(part => {
      const trimmed = part.trim();
      
      // Match patterns like "10 × 1000 HTG" or "1000 HTG" or "10x1000 HTG"
      const match = trimmed.match(/(?:(\d+)\s*[×x]\s*)?(\d+)\s*HTG/i);
      
      if (match) {
        const quantity = match[1] ? parseInt(match[1]) : 1;
        const denomination = parseInt(match[2]);
        
        // Check if denomination exists in our list
        const validDenom = DENOMINATIONS.find(d => d.value === denomination);
        if (validDenom && quantity > 0) {
          vendeurData.billets[denomination] += quantity;
          vendeurData.totalHTG += quantity * denomination;
        }
      }
    });
  };

  // Calculate liasses for each vendeur
  const calculateLiasses = () => {
    const allLiasses = [];
    
    Object.entries(billetsParVendeur).forEach(([vendeurId, data]) => {
      const { nom, billets, totalHTG } = data;
      
      if (totalHTG === 0) return;
      
      // Create a copy of bills to work with
      let remainingBills = { ...billets };
      const liassesVendeur = [];
      
      // Try to form liasses until we can't make more
      while (true) {
        const liasse = tryFormLiasse(remainingBills, selectedLiasseSize);
        if (!liasse || liasse.count === 0) break;
        
        liassesVendeur.push({
          ...liasse,
          vendeurId,
          vendeurNom: nom
        });
        
        // Update remaining bills
        Object.keys(liasse.billsUsed).forEach(denomStr => {
          const denom = parseInt(denomStr);
          remainingBills[denom] -= liasse.billsUsed[denomStr];
          if (remainingBills[denom] < 0) remainingBills[denom] = 0;
        });
      }
      
      // Calculate remaining bills after liasses
      const remainingTotal = Object.entries(remainingBills).reduce(
        (sum, [denom, qty]) => sum + (parseInt(denom) * qty), 0
      );
      
      allLiasses.push({
        vendeurId,
        vendeurNom: nom,
        liasses: liassesVendeur,
        totalLiasses: liassesVendeur.length,
        totalLiasseValue: liassesVendeur.reduce((sum, l) => sum + l.total, 0),
        remainingBills,
        remainingTotal,
        originalTotal: totalHTG
      });
    });
    
    setLiassesFormees(allLiasses);
  };

  // Try to form a liasse of given size
  const tryFormLiasse = (bills, targetAmount) => {
    const denominations = DENOMINATIONS.map(d => d.value).sort((a, b) => b - a);
    let remaining = targetAmount;
    const billsUsed = {};
    const billDetails = [];
    
    denominations.forEach(denom => {
      const available = bills[denom] || 0;
      if (available > 0 && denom <= remaining) {
        const needed = Math.min(Math.floor(remaining / denom), available);
        if (needed > 0) {
          billsUsed[denom] = needed;
          billDetails.push(`${needed} × ${denom} HTG`);
          remaining -= needed * denom;
        }
      }
    });
    
    if (remaining === 0 && Object.keys(billsUsed).length > 0) {
      return {
        size: targetAmount,
        count: 1,
        total: targetAmount,
        billsUsed,
        composition: billDetails.join(', ')
      };
    }
    
    return null;
  };

  // Initialize with processed data
  useEffect(() => {
    setBilletsParVendeur(processDeposits);
  }, [processDeposits]);

  // Recalculate liasses when data changes
  useEffect(() => {
    calculateLiasses();
  }, [billetsParVendeur, selectedLiasseSize]);

  // Handle manual bill adjustment
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

  // Sort functions
  const sortedData = useMemo(() => {
    const dataArray = Object.entries(billetsParVendeur)
      .map(([id, data]) => ({ id, ...data }));
    
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    return dataArray.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return multiplier * a.nom.localeCompare(b.nom);
        case 'total':
          return multiplier * (b.totalHTG - a.totalHTG);
        default:
          return multiplier * (b.totalHTG - a.totalHTG);
      }
    });
  }, [billetsParVendeur, sortBy, sortOrder]);

  // Filter by denomination
  const filteredData = useMemo(() => {
    if (filtreDenomination === 'all') return sortedData;
    
    const denomination = parseInt(filtreDenomination);
    return sortedData.filter(vendeur => 
      vendeur.billets[denomination] > 0
    );
  }, [sortedData, filtreDenomination]);

  // Totals
  const totals = useMemo(() => {
    const totalBills = DENOMINATIONS.reduce((acc, denom) => {
      acc[denom.value] = 0;
      return acc;
    }, {});
    
    let totalHTG = 0;
    
    Object.values(billetsParVendeur).forEach(vendeur => {
      DENOMINATIONS.forEach(denom => {
        totalBills[denom.value] += vendeur.billets[denom.value] || 0;
      });
      totalHTG += vendeur.totalHTG;
    });
    
    return { totalBills, totalHTG };
  }, [billetsParVendeur]);

  // Total liasses formed
  const totalLiasses = liassesFormees.reduce((sum, v) => sum + v.totalLiasses, 0);
  const totalLiasseValue = liassesFormees.reduce((sum, v) => sum + v.totalLiasseValue, 0);

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
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {date}
          </span>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Shift {shift}
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
                {size.label}
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
            Filtre Dénomination
          </label>
          <select
            value={filtreDenomination}
            onChange={(e) => setFiltreDenomination(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Toutes les dénominations</option>
            {DENOMINATIONS.map(denom => (
              <option key={denom.value} value={denom.value}>
                {denom.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Total Général</p>
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
          <p className="text-sm text-purple-600 font-medium mb-1">Vendeurs</p>
          <p className="text-3xl font-bold text-purple-900">
            {Object.keys(billetsParVendeur).length}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600 font-medium mb-1">Efficacité</p>
          <p className="text-3xl font-bold text-yellow-900">
            {totals.totalHTG > 0 ? Math.round((totalLiasseValue / totals.totalHTG) * 100) : 0}%
          </p>
          <p className="text-sm text-yellow-700 mt-1">de billets liassés</p>
        </div>
      </div>

      {/* Denomination Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Résumé par Dénomination
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {DENOMINATIONS.map(denom => (
            <div key={denom.value} className={`${denom.color} p-3 rounded-lg text-center`}>
              <p className="text-sm font-medium">{denom.label}</p>
              <p className="text-2xl font-bold mt-1">
                {totals.totalBills[denom.value]}
              </p>
              <p className="text-xs mt-1">
                {totals.totalBills[denom.value] * denom.value} HTG
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vendeur Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détail par Vendeur ({filteredData.length})
        </h3>
        
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto mb-2" size={32} />
            <p>Aucune donnée de billets disponible</p>
            <p className="text-sm mt-1">Les dépôts doivent inclure une décomposition en billets</p>
          </div>
        ) : (
          filteredData.map(vendeur => {
            const vendeurLiasses = liassesFormees.find(l => l.vendeurId === vendeur.id);
            
            return (
              <div key={vendeur.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                {/* Vendeur Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{vendeur.nom}</h4>
                    <p className="text-sm text-gray-600">
                      Total: <span className="font-bold">{vendeur.totalHTG.toLocaleString()} HTG</span>
                    </p>
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
                      if (count === 0 && filtreDenomination !== 'all') return null;
                      
                      return (
                        <div key={denom.value} className={`${denom.color} p-2 rounded text-center`}>
                          <p className="text-xs font-medium">{denom.label}</p>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-lg font-bold">{count}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleBillAdjustment(vendeur.id, denom.value, 1)}
                                className="text-xs hover:bg-white/50 rounded"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleBillAdjustment(vendeur.id, denom.value, -1)}
                                className="text-xs hover:bg-white/50 rounded"
                              >
                                -
                              </button>
                            </div>
                          </div>
                          <p className="text-xs mt-1">{count * denom.value} HTG</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Liasses Formed */}
                {vendeurLiasses && vendeurLiasses.liasses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      Liasses formées ({selectedLiasseSize} HTG):
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
                            Composition: {liasse.composition}
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
                        <p className="text-xs text-yellow-600 mt-1">
                          Ne peut pas former une liasse complète de {selectedLiasseSize} HTG
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(!vendeurLiasses || vendeurLiasses.liasses.length === 0) && vendeur.totalHTG > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        Aucune liasse de {selectedLiasseSize} HTG ne peut être formée avec les billets disponibles
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Print/Export Options */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Imprimer Rapport
        </button>
        <button
          onClick={() => {
            const data = {
              date,
              shift,
              totals,
              liassesFormees,
              billetsParVendeur: sortedData
            };
            console.log('Export data:', data);
            alert('Données prêtes pour export (voir console)');
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Exporter Données
        </button>
      </div>
    </div>
  );
};

export default ConditionnementManager;