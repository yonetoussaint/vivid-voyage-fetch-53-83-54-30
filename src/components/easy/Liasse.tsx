import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Minus, Users, Trash2, ChevronLeft, Eye, Check, SkipForward, Package, ListChecks, Calculator, Layers, Database, Filter, PieChart } from 'lucide-react';

const Liasse = ({ shift, date, vendeurs }) => {
  const denominations = [1000, 500, 250, 100, 50, 25, 10, 5];
  const BILLS_PER_LIASSE = 100;

  // Use vendeurs from props or fallback to defaults
  const availableVendors = vendeurs && vendeurs.length > 0 ? vendeurs : 
    ['Juny', 'Santho', 'Jamesly', 'Stanley', 'Taïcha', 'Nerlande', 'Darline', 'Florence'];

  const [selectedVendor, setSelectedVendor] = useState(availableVendors[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLiasseRecommendations, setShowLiasseRecommendations] = useState(false);
  const [entryMode, setEntryMode] = useState('quick');

  const [currentDenom, setCurrentDenom] = useState(denominations[0]);
  const [quickCount, setQuickCount] = useState('');
  const quickInputRef = useRef(null);

  const [currentDeposit, setCurrentDeposit] = useState(
    denominations.reduce((acc, denom) => {
      acc[denom] = { liasses: 0, loose: 0 };
      return acc;
    }, {})
  );

  const [vendorDeposits, setVendorDeposits] = useState(
    availableVendors.reduce((acc, vendor) => {
      acc[vendor] = [];
      return acc;
    }, {})
  );

  // Calculate total bills from ALL vendors for liasse analysis
  const totalPool = useMemo(() => {
    const pool = denominations.reduce((acc, denom) => {
      acc[denom] = { totalBills: 0, totalValue: 0, deposits: [] };
      return acc;
    }, {});

    // Add current deposit (not yet saved)
    denominations.forEach(denom => {
      const { liasses, loose } = currentDeposit[denom];
      const billsFromCurrent = liasses * BILLS_PER_LIASSE + loose;
      if (billsFromCurrent > 0) {
        pool[denom].totalBills += billsFromCurrent;
        pool[denom].totalValue += billsFromCurrent * denom;
        pool[denom].deposits.push({
          vendor: selectedVendor,
          type: 'current',
          bills: billsFromCurrent,
          value: billsFromCurrent * denom
        });
      }
    });

    // Add all saved deposits from all vendors
    availableVendors.forEach(vendor => {
      vendorDeposits[vendor]?.forEach((deposit, depositIndex) => {
        denominations.forEach(denom => {
          const { liasses, loose } = deposit.amounts[denom];
          const bills = liasses * BILLS_PER_LIASSE + loose;
          if (bills > 0) {
            pool[denom].totalBills += bills;
            pool[denom].totalValue += bills * denom;
            pool[denom].deposits.push({
              vendor: vendor,
              type: 'saved',
              depositIndex: depositIndex + 1,
              bills: bills,
              value: bills * denom,
              timestamp: deposit.timestamp
            });
          }
        });
      });
    });

    return pool;
  }, [vendorDeposits, currentDeposit, selectedVendor, availableVendors]);

  // Sync with localStorage for persistence
  useEffect(() => {
    const savedDeposits = localStorage.getItem(`liasseDeposits_${date}_${shift}`);
    if (savedDeposits) {
      setVendorDeposits(JSON.parse(savedDeposits));
    }
  }, [date, shift]);

  useEffect(() => {
    localStorage.setItem(`liasseDeposits_${date}_${shift}`, JSON.stringify(vendorDeposits));
  }, [vendorDeposits, date, shift]);

  // Update available vendors when vendeurs prop changes
  useEffect(() => {
    if (vendeurs && vendeurs.length > 0) {
      // Add new vendors to vendorDeposits if they don't exist
      const updatedVendorDeposits = { ...vendorDeposits };
      vendeurs.forEach(vendor => {
        if (!updatedVendorDeposits[vendor]) {
          updatedVendorDeposits[vendor] = [];
        }
      });

      // Remove vendors that no longer exist
      Object.keys(updatedVendorDeposits).forEach(vendor => {
        if (!vendeurs.includes(vendor)) {
          delete updatedVendorDeposits[vendor];
        }
      });

      setVendorDeposits(updatedVendorDeposits);

      // Update selected vendor if current one doesn't exist
      if (!vendeurs.includes(selectedVendor) && vendeurs.length > 0) {
        setSelectedVendor(vendeurs[0]);
      }
    }
  }, [vendeurs]);

  const updateDeposit = (denom, field, value) => {
    setCurrentDeposit(prev => ({
      ...prev,
      [denom]: {
        ...prev[denom],
        [field]: Math.max(0, value)
      }
    }));
  };

  const adjustValue = (denom, field, change) => {
    const current = currentDeposit[denom][field];
    updateDeposit(denom, field, current + change);
  };

  // Get next denomination that hasn't been completed yet
  const getNextDenomination = (currentDenom) => {
    const currentIndex = denominations.indexOf(currentDenom);
    
    // Start searching from the next denomination
    for (let i = currentIndex + 1; i < denominations.length; i++) {
      const nextDenom = denominations[i];
      const { liasses, loose } = currentDeposit[nextDenom];
      
      // If this denomination hasn't been touched yet (both are 0), it's available
      if (liasses === 0 && loose === 0) {
        return nextDenom;
      }
    }
    
    // If we've reached the end, return null to indicate we're done
    return null;
  };

  const handleQuickEntry = () => {
    const count = parseInt(quickCount);
    
    // If count is 0 or empty, just skip to next denomination
    if (!count || count <= 0) {
      skipToNextDenomination();
      return;
    }

    if (count >= 100) {
      const liasses = Math.floor(count / 100);
      const loose = count % 100;
      updateDeposit(currentDenom, 'liasses', currentDeposit[currentDenom].liasses + liasses);
      if (loose > 0) {
        updateDeposit(currentDenom, 'loose', currentDeposit[currentDenom].loose + loose);
      }
    } else {
      updateDeposit(currentDenom, 'loose', currentDeposit[currentDenom].loose + count);
    }

    setQuickCount('');
    advanceToNextDenomination();
  };

  const skipToNextDenomination = () => {
    const nextDenom = getNextDenomination(currentDenom);
    
    if (nextDenom) {
      setCurrentDenom(nextDenom);
      setQuickCount('');
      setTimeout(() => quickInputRef.current?.focus(), 100);
    } else {
      // We've gone through all denominations
      setQuickCount('');
      // Optionally, you could focus the "Enregistrer" button or show a message
      setTimeout(() => quickInputRef.current?.focus(), 100);
    }
  };

  const advanceToNextDenomination = () => {
    const nextDenom = getNextDenomination(currentDenom);
    
    if (nextDenom) {
      setCurrentDenom(nextDenom);
      setTimeout(() => quickInputRef.current?.focus(), 100);
    } else {
      // We've gone through all denominations
      // Optionally, you could focus the "Enregistrer" button or show a message
      setTimeout(() => quickInputRef.current?.focus(), 100);
    }
  };

  const handleQuickKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickEntry();
    }
  };

  const handleSkipKeyPress = (e) => {
    if (e.key === 'Tab' && e.shiftKey === false) {
      e.preventDefault();
      skipToNextDenomination();
    }
  };

  const getTotalBills = (deposit, denom) => {
    const { liasses, loose } = deposit[denom];
    return liasses * BILLS_PER_LIASSE + loose;
  };

  const getTotalValue = (deposit, denom) => {
    return getTotalBills(deposit, denom) * denom;
  };

  const getCurrentDepositTotal = () => {
    return denominations.reduce((sum, denom) => sum + getTotalValue(currentDeposit, denom), 0);
  };

  const getCurrentDepositBillsCount = () => {
    return denominations.reduce((sum, denom) => sum + getTotalBills(currentDeposit, denom), 0);
  };

  const getVendorTotal = (vendor) => {
    return vendorDeposits[vendor]?.reduce((sum, deposit) => {
      return sum + denominations.reduce((depSum, denom) => {
        return depSum + getTotalValue(deposit.amounts, denom);
      }, 0);
    }, 0) || 0;
  };

  const getVendorDepositCount = (vendor) => {
    return vendorDeposits[vendor]?.length || 0;
  };

  const getAllVendorsTotal = () => {
    return availableVendors.reduce((sum, vendor) => sum + getVendorTotal(vendor), 0);
  };

  // Calculate liasse recommendations from TOTAL POOL
  const liasseRecommendations = useMemo(() => {
    const byDenomination = [];
    const totalBillsAll = { total: 0, value: 0 };
    let totalPossibleLiasses = 0;
    
    // Analyze each denomination in the total pool
    denominations.forEach(denom => {
      const poolData = totalPool[denom];
      if (poolData.totalBills > 0) {
        const totalBills = poolData.totalBills;
        const totalValue = poolData.totalValue;
        const maxLiasses = Math.floor(totalBills / BILLS_PER_LIASSE);
        const remainingBills = totalBills % BILLS_PER_LIASSE;
        const liasseValue = BILLS_PER_LIASSE * denom;
        
        totalBillsAll.total += totalBills;
        totalBillsAll.value += totalValue;
        totalPossibleLiasses += maxLiasses;
        
        byDenomination.push({
          denomination: denom,
          totalBills,
          totalValue,
          maxLiasses,
          remainingBills,
          liasseValue,
          deposits: poolData.deposits,
          sources: {
            vendors: [...new Set(poolData.deposits.map(d => d.vendor))],
            depositCount: poolData.deposits.length
          }
        });
      }
    });

    // Analyze combinations across denominations
    const combinations = [];
    
    // Strategy 1: Pure denomination liasses (highest value first)
    const pureLiasses = byDenomination
      .filter(d => d.maxLiasses > 0)
      .sort((a, b) => b.denomination - a.denomination);
    
    pureLiasses.forEach(denom => {
      combinations.push({
        type: 'pure',
        denomination: denom.denomination,
        description: `Liasses pures de ${denom.denomination} HTG`,
        possibleLiasses: denom.maxLiasses,
        remainingBills: denom.remainingBills,
        totalValue: denom.maxLiasses * denom.liasseValue,
        sources: denom.sources,
        priority: denom.denomination >= 500 ? 'Haute' : 'Moyenne'
      });
    });

    // Strategy 2: Mixed liasses from small denominations
    const smallDenoms = byDenomination.filter(d => d.denomination <= 100);
    if (smallDenoms.length > 0) {
      const totalSmallBills = smallDenoms.reduce((sum, d) => sum + d.totalBills, 0);
      const totalSmallValue = smallDenoms.reduce((sum, d) => sum + d.totalValue, 0);
      
      if (totalSmallBills >= BILLS_PER_LIASSE) {
        const mixedLiasses = Math.floor(totalSmallBills / BILLS_PER_LIASSE);
        const remainingBills = totalSmallBills % BILLS_PER_LIASSE;
        const avgValue = totalSmallValue / totalSmallBills;
        const estimatedValue = Math.round(avgValue * BILLS_PER_LIASSE);
        
        combinations.push({
          type: 'mixed',
          description: 'Liasses mixtes (petites coupures ≤100 HTG)',
          denominations: smallDenoms.map(d => d.denomination),
          possibleLiasses: mixedLiasses,
          remainingBills: remainingBills,
          estimatedValue: estimatedValue,
          sources: {
            vendors: [...new Set(smallDenoms.flatMap(d => d.sources.vendors))],
            depositCount: smallDenoms.reduce((sum, d) => sum + d.sources.depositCount, 0)
          },
          priority: 'Moyenne'
        });
      }
    }

    // Strategy 3: Fill gaps by breaking higher denominations
    byDenomination.forEach(denom => {
      if (denom.remainingBills > 0 && denom.remainingBills < 20) {
        // Find higher denomination that could be broken to complete a liasse
        const higherDenoms = byDenomination.filter(d => 
          d.denomination > denom.denomination && 
          d.maxLiasses > 0
        );
        
        higherDenoms.forEach(higher => {
          const billsNeeded = BILLS_PER_LIASSE - denom.remainingBills;
          const valueNeeded = billsNeeded * denom.denomination;
          const higherBillsNeeded = Math.ceil(valueNeeded / higher.denomination);
          
          if (higher.totalBills >= higherBillsNeeded) {
            combinations.push({
              type: 'completion',
              description: `Compléter ${denom.remainingBills}×${denom.denomination} avec ${higherBillsNeeded}×${higher.denomination} pour une liasse`,
              fromDenomination: higher.denomination,
              toDenomination: denom.denomination,
              billsNeeded: billsNeeded,
              higherBillsNeeded: higherBillsNeeded,
              valueCreated: denom.liasseValue,
              efficiency: 'Modérée'
            });
          }
        });
      }
    });

    // Strategy 4: Optimal distribution for bank deposit
    const bankOptimal = [];
    const bankDenominations = [1000, 500, 250, 100];
    let remainingBillsAfterOptimal = { ...totalPool };
    
    bankDenominations.forEach(targetDenom => {
      if (remainingBillsAfterOptimal[targetDenom]?.totalBills >= BILLS_PER_LIASSE) {
        const liasses = Math.floor(remainingBillsAfterOptimal[targetDenom].totalBills / BILLS_PER_LIASSE);
        bankOptimal.push({
          denomination: targetDenom,
          liasses: liasses,
          value: liasses * targetDenom * BILLS_PER_LIASSE
        });
        // Remove used bills
        remainingBillsAfterOptimal[targetDenom].totalBills -= liasses * BILLS_PER_LIASSE;
      }
    });

    if (bankOptimal.length > 0) {
      combinations.push({
        type: 'bank',
        description: 'Distribution optimale pour dépôt bancaire',
        optimalDistribution: bankOptimal,
        totalValue: bankOptimal.reduce((sum, d) => sum + d.value, 0),
        priority: 'Très Haute'
      });
    }

    return {
      byDenomination: byDenomination.sort((a, b) => b.denomination - a.denomination),
      combinations: combinations,
      summary: {
        totalBills: totalBillsAll.total,
        totalValue: totalBillsAll.value,
        totalPossibleLiasses: totalPossibleLiasses,
        denominationsWithBills: byDenomination.length,
        vendorCount: [...new Set(byDenomination.flatMap(d => d.sources.vendors))].length,
        depositCount: byDenomination.reduce((sum, d) => sum + d.sources.depositCount, 0)
      },
      poolAnalysis: totalPool
    };
  }, [totalPool]);

  const saveDeposit = () => {
    const total = getCurrentDepositTotal();
    if (total === 0) {
      alert('Aucun montant à enregistrer');
      return;
    }

    const deposit = {
      timestamp: new Date().toISOString(),
      amounts: { ...currentDeposit },
      total: total,
      shift: shift,
      date: date
    };

    setVendorDeposits(prev => ({
      ...prev,
      [selectedVendor]: [...(prev[selectedVendor] || []), deposit]
    }));

    setCurrentDeposit(
      denominations.reduce((acc, denom) => {
        acc[denom] = { liasses: 0, loose: 0 };
        return acc;
      }, {})
    );

    // Reset to first denomination
    setCurrentDenom(denominations[0]);
    setQuickCount('');
    
    alert(`Dépôt #${getVendorDepositCount(selectedVendor)} enregistré pour ${selectedVendor}`);
  };

  const clearCurrentDeposit = () => {
    setCurrentDeposit(
      denominations.reduce((acc, denom) => {
        acc[denom] = { liasses: 0, loose: 0 };
        return acc;
      }, {})
    );
    setQuickCount('');
    setCurrentDenom(denominations[0]);
  };

  const deleteVendorDeposit = (vendor, index) => {
    if (confirm(`Supprimer le dépôt #${index + 1} de ${vendor}?`)) {
      setVendorDeposits(prev => ({
        ...prev,
        [vendor]: prev[vendor].filter((_, i) => i !== index)
      }));
    }
  };

  const resetAllVendors = () => {
    if (confirm('Supprimer TOUS les dépôts de TOUS les vendeurs?')) {
      setVendorDeposits(
        availableVendors.reduce((acc, vendor) => {
          acc[vendor] = [];
          return acc;
        }, {})
      );
      clearCurrentDeposit();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-HT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get list of remaining denominations
  const getRemainingDenominations = () => {
    const currentIndex = denominations.indexOf(currentDenom);
    return denominations.slice(currentIndex);
  };

  // Apply liasse recommendation to current deposit
  const applyLiasseToCurrentDeposit = (denomination, liassesCount) => {
    const totalBills = getTotalBills(currentDeposit, denomination);
    const maxPossible = Math.floor(totalBills / BILLS_PER_LIASSE);
    const liassesToSet = Math.min(liassesCount, maxPossible);
    const looseToSet = totalBills - (liassesToSet * BILLS_PER_LIASSE);
    
    updateDeposit(denomination, 'liasses', liassesToSet);
    updateDeposit(denomination, 'loose', looseToSet);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="bg-slate-800 text-white p-3 flex items-center justify-between">
            <button onClick={() => setShowHistory(false)} className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg">{selectedVendor} - Historique</h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900 p-3 space-y-2">
            {(vendorDeposits[selectedVendor] || []).length === 0 ? (
              <div className="text-center text-slate-400 mt-8">Aucun dépôt enregistré</div>
            ) : (
              (vendorDeposits[selectedVendor] || []).map((deposit, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-bold">Dépôt #{idx + 1}</div>
                      <div className="text-slate-400 text-xs">{formatTime(deposit.timestamp)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{formatCurrency(deposit.total)}</div>
                      <button
                        onClick={() => deleteVendorDeposit(selectedVendor, idx)}
                        className="text-red-400 text-xs underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {denominations.filter(d => {
                      const { liasses, loose } = deposit.amounts[d];
                      return liasses > 0 || loose > 0;
                    }).map(denom => {
                      const { liasses, loose } = deposit.amounts[denom];
                      const count = liasses * BILLS_PER_LIASSE + loose;
                      return (
                        <div key={denom} className="bg-slate-700 rounded p-1 text-center">
                          <div className="text-xs text-slate-300">{denom}</div>
                          <div className="text-white font-bold text-sm">×{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-800 p-3 text-center text-white border-t border-slate-700">
            <div className="text-sm text-slate-400">Total {selectedVendor}</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(getVendorTotal(selectedVendor))}</div>
            <div className="text-xs text-slate-400">{getVendorDepositCount(selectedVendor)} dépôt(s)</div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="bg-slate-800 text-white p-3 flex items-center justify-between">
            <button onClick={() => setShowSummary(false)} className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg">Tous les Vendeurs</h2>
            <button onClick={resetAllVendors} className="p-2 text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900 p-3 space-y-2">
            {availableVendors.map(vendor => {
              const total = getVendorTotal(vendor);
              const count = getVendorDepositCount(vendor);

              return (
                <div
                  key={vendor}
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setShowSummary(false);
                  }}
                  className="bg-slate-800 rounded-lg p-3 active:bg-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{vendor}</div>
                      <div className="text-slate-400 text-xs">{count} dépôt(s)</div>
                    </div>
                    <div className="text-green-400 font-bold text-xl">
                      {formatCurrency(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-center text-white">
            <div className="text-sm opacity-90">TOTAL GÉNÉRAL</div>
            <div className="text-3xl font-bold">{formatCurrency(getAllVendorsTotal())}</div>
          </div>
        </div>
      )}

      {/* Liasse Recommendations Modal - FROM TOTAL POOL */}
      {showLiasseRecommendations && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="bg-slate-800 text-white p-3 flex items-center justify-between">
            <button onClick={() => setShowLiasseRecommendations(false)} className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg">Analyse Liasses - Tous les Dépôts</h2>
            <div className="flex gap-2">
              <div className="text-xs bg-blue-600 px-2 py-1 rounded">
                {liasseRecommendations.summary.vendorCount} vendeurs
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900 p-3 space-y-4">
            {/* Global Summary */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-lg">Résumé Global</h3>
                </div>
                <div className="text-green-400 font-bold text-xl">
                  {formatCurrency(liasseRecommendations.summary.totalValue)}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-slate-800/50 rounded p-2">
                  <div className="text-slate-400">Total billets</div>
                  <div className="font-bold text-xl">{liasseRecommendations.summary.totalBills}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300">Liasses possibles</div>
                  <div className="font-bold text-xl text-green-400">{liasseRecommendations.summary.totalPossibleLiasses}</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2">
                  <div className="text-slate-400">Dépôts analysés</div>
                  <div className="font-bold text-xl">{liasseRecommendations.summary.depositCount}</div>
                </div>
                <div className="bg-blue-900/30 rounded p-2">
                  <div className="text-blue-300">Coupures utilisées</div>
                  <div className="font-bold text-xl text-blue-400">{liasseRecommendations.summary.denominationsWithBills}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Analyse basée sur tous les dépôts enregistrés + dépôt en cours
              </div>
            </div>

            {/* Pool Analysis by Denomination */}
            <div>
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Répartition par Coupure
              </h3>
              <div className="space-y-3">
                {liasseRecommendations.byDenomination.map(denom => (
                  <div key={denom.denomination} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold">
                          {denom.denomination} HTG
                        </div>
                        <div className="text-white font-bold">
                          {denom.totalBills} billets
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">
                        {formatCurrency(denom.totalValue)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-slate-700/30 rounded p-2">
                        <div className="text-xs text-slate-400">Liasses max</div>
                        <div className="font-bold text-green-400">{denom.maxLiasses}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded p-2">
                        <div className="text-xs text-slate-400">Billets restants</div>
                        <div className="font-bold">{denom.remainingBills}</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-400 mb-1">Provenance:</div>
                    <div className="flex flex-wrap gap-1">
                      {denom.sources.vendors.slice(0, 3).map(vendor => (
                        <span key={vendor} className="bg-slate-700 px-2 py-1 rounded text-xs">
                          {vendor}
                        </span>
                      ))}
                      {denom.sources.vendors.length > 3 && (
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                          +{denom.sources.vendors.length - 3}
                        </span>
                      )}
                      <span className="bg-blue-600 px-2 py-1 rounded text-xs ml-auto">
                        {denom.sources.depositCount} dépôt(s)
                      </span>
                    </div>
                    
                    {denom.maxLiasses > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-slate-400 mb-1">Recommandation:</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            Créer <span className="text-green-400 font-bold">{denom.maxLiasses} liasses</span> de {formatCurrency(denom.liasseValue)}
                          </div>
                          <button
                            onClick={() => {
                              applyLiasseToCurrentDeposit(denom.denomination, denom.maxLiasses);
                              alert(`${denom.maxLiasses} liasses configurées pour ${denom.denomination} HTG dans le dépôt en cours`);
                            }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded active:bg-blue-700"
                          >
                            Configurer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Liasse Strategies */}
            <div>
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Stratégies de Formation de Liasses
              </h3>
              <div className="space-y-3">
                {liasseRecommendations.combinations.map((strategy, idx) => (
                  <div key={idx} className={`bg-slate-800 rounded-lg p-3 border ${
                    strategy.priority === 'Très Haute' ? 'border-red-500/30' :
                    strategy.priority === 'Haute' ? 'border-orange-500/30' :
                    strategy.priority === 'Moyenne' ? 'border-blue-500/30' :
                    'border-slate-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white">{strategy.description}</div>
                      {strategy.priority && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          strategy.priority === 'Très Haute' ? 'bg-red-500/20 text-red-400' :
                          strategy.priority === 'Haute' ? 'bg-orange-500/20 text-orange-400' :
                          strategy.priority === 'Moyenne' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {strategy.priority}
                        </div>
                      )}
                    </div>
                    
                    {strategy.type === 'pure' && (
                      <>
                        <div className="text-sm text-slate-300 mb-2">
                          {strategy.possibleLiasses} liasses de {formatCurrency(strategy.possibleLiasses * (strategy.denomination * BILLS_PER_LIASSE) / strategy.possibleLiasses)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            Source: {strategy.sources.vendors.join(', ')}
                          </div>
                          <div className="text-green-400 font-bold">
                            {formatCurrency(strategy.totalValue)}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {strategy.type === 'mixed' && (
                      <>
                        <div className="text-sm text-slate-300 mb-2">
                          Combiner {strategy.denominations.map(d => `${d}`).join(', ')} HTG
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-700/30 rounded p-2">
                            <div className="text-xs text-slate-400">Liasses</div>
                            <div className="font-bold text-green-400">{strategy.possibleLiasses}</div>
                          </div>
                          <div className="bg-blue-500/20 rounded p-2">
                            <div className="text-xs text-blue-300">Valeur estimée</div>
                            <div className="font-bold">{formatCurrency(strategy.estimatedValue)}</div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {strategy.type === 'completion' && (
                      <>
                        <div className="text-sm text-slate-300 mb-2">
                          Utiliser {strategy.higherBillsNeeded}×{strategy.fromDenomination} pour compléter {strategy.billsNeeded}×{strategy.toDenomination}
                        </div>
                        <div className="text-xs text-blue-300">
                          Valeur créée: {formatCurrency(strategy.valueCreated)}
                        </div>
                      </>
                    )}
                    
                    {strategy.type === 'bank' && (
                      <>
                        <div className="text-sm text-slate-300 mb-2">
                          Distribution optimale pour le dépôt bancaire
                        </div>
                        <div className="space-y-1">
                          {strategy.optimalDistribution.map((dist, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span>{dist.liasses} liasses de {dist.denomination} HTG</span>
                              <span className="text-green-400">{formatCurrency(dist.value)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-right font-bold text-green-400">
                          Total: {formatCurrency(strategy.totalValue)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Plan d'Action Recommandé
              </h3>
              
              <div className="space-y-3">
                {/* Step 1: Create high-value liasses */}
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-bold text-white">1. Créer les liasses de haute valeur</div>
                  <div className="text-sm text-slate-300 mt-1">
                    {liasseRecommendations.byDenomination
                      .filter(d => d.denomination >= 500 && d.maxLiasses > 0)
                      .map(d => `${d.maxLiasses}×${d.denomination}`)
                      .join(' + ') || 'Aucune liasse haute valeur possible'}
                  </div>
                </div>
                
                {/* Step 2: Create medium-value liasses */}
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-bold text-white">2. Créer les liasses moyennes</div>
                  <div className="text-sm text-slate-300 mt-1">
                    {liasseRecommendations.byDenomination
                      .filter(d => d.denomination >= 100 && d.denomination < 500 && d.maxLiasses > 0)
                      .map(d => `${d.maxLiasses}×${d.denomination}`)
                      .join(' + ') || 'Aucune liasse moyenne valeur possible'}
                  </div>
                </div>
                
                {/* Step 3: Consider mixed liasses */}
                {liasseRecommendations.combinations.find(s => s.type === 'mixed' && s.possibleLiasses > 0) && (
                  <div className="border-l-4 border-purple-500 pl-3">
                    <div className="font-bold text-white">3. Combiner petites coupures</div>
                    <div className="text-sm text-slate-300 mt-1">
                      Former des liasses mixtes avec les petites coupures
                    </div>
                  </div>
                )}
                
                {/* Step 4: Handle remaining bills */}
                <div className="border-l-4 border-amber-500 pl-3">
                  <div className="font-bold text-white">4. Gérer les billets restants</div>
                  <div className="text-sm text-slate-300 mt-1">
                    {liasseRecommendations.byDenomination
                      .filter(d => d.remainingBills > 0)
                      .map(d => `${d.remainingBills}×${d.denomination}`)
                      .join(' + ') || 'Tous les billets sont en liasses'}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-slate-700/30 rounded">
                <div className="text-sm text-slate-400 mb-1">Résultat final:</div>
                <div className="font-bold text-green-400 text-lg">
                  {liasseRecommendations.summary.totalPossibleLiasses} liasses +{' '}
                  {liasseRecommendations.byDenomination.reduce((sum, d) => sum + d.remainingBills, 0)} billets lâches
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Valeur totale: {formatCurrency(liasseRecommendations.summary.totalValue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="flex flex-col h-screen">
        {/* Compact Header */}
        <div className="bg-slate-800 text-white p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSummary(true)}
                className="p-2 bg-purple-600 rounded-lg active:bg-purple-700"
              >
                <Users className="w-5 h-5" />
              </button>
              <div>
                <div className="text-xs text-slate-400">Vendeur</div>
                <div className="font-bold">{selectedVendor}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLiasseRecommendations(true)}
                className="px-3 py-2 bg-amber-600 rounded-lg active:bg-amber-700 font-bold text-sm flex items-center gap-1"
                disabled={getAllVendorsTotal() === 0 && getCurrentDepositTotal() === 0}
              >
                <Calculator className="w-4 h-4" />
                Liasse Globale
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-3 py-2 bg-blue-600 rounded-lg active:bg-blue-700 font-bold text-sm flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                {getVendorDepositCount(selectedVendor)}
              </button>
            </div>
          </div>

          {/* Vendor Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {availableVendors.map(vendor => (
              <button
                key={vendor}
                onClick={() => setSelectedVendor(vendor)}
                className={`px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap flex-shrink-0 ${
                  selectedVendor === vendor
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {vendor}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Entry Mode */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          <div className="p-3 space-y-4">
            {/* Denomination Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-400 font-semibold">COUPURE</div>
                <div className="text-xs text-blue-400 font-semibold">
                  {denominations.indexOf(currentDenom) + 1}/{denominations.length}
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={currentDenom}
                  onChange={(e) => setCurrentDenom(parseInt(e.target.value))}
                  className="flex-1 bg-slate-800 text-white border-2 border-blue-500 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-blue-400 appearance-none"
                  style={{ 
                    fontSize: 'clamp(16px, 4vw, 24px)',
                    height: '56px'
                  }}
                >
                  {denominations.map(denom => (
                    <option key={denom} value={denom}>
                      {denom} HTG
                    </option>
                  ))}
                </select>
                <button
                  onClick={skipToNextDenomination}
                  className="w-16 bg-blue-600 text-white rounded-xl font-bold active:bg-blue-700 flex items-center justify-center flex-shrink-0"
                  style={{ height: '56px' }}
                  title="Passer à la coupure suivante (Tab)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Count Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-400 font-semibold">NOMBRE DE BILLETS</div>
                <div className="text-xs text-slate-500">
                  {currentDeposit[currentDenom].liasses > 0 && (
                    <span className="text-green-400 mr-1">{currentDeposit[currentDenom].liasses}L</span>
                  )}
                  {currentDeposit[currentDenom].loose > 0 && (
                    <span>{currentDeposit[currentDenom].loose} billets</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  ref={quickInputRef}
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quickCount}
                  onChange={(e) => setQuickCount(e.target.value)}
                  onKeyPress={handleQuickKeyPress}
                  onKeyDown={handleSkipKeyPress}
                  placeholder="0"
                  className="flex-1 min-w-0 bg-slate-800 text-white border-2 border-slate-600 rounded-xl px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:border-green-500"
                  style={{ 
                    fontSize: 'clamp(20px, 6vw, 32px)',
                    height: '56px',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={handleQuickEntry}
                  className="w-16 bg-green-600 text-white rounded-xl font-bold active:bg-green-700 flex items-center justify-center flex-shrink-0"
                  style={{ height: '56px' }}
                >
                  <Check className="w-7 h-7" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-400 text-center flex-1">
                  <div>Enter ou ✓ pour ajouter</div>
                  <div className="text-blue-400 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <SkipForward className="w-3 h-3" />
                      Tab pour passer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="pt-2">
              <div className="text-xs text-slate-400 mb-1 font-semibold">PROGRESSION</div>
              <div className="flex flex-wrap gap-1">
                {getRemainingDenominations().map(denom => {
                  const { liasses, loose } = currentDeposit[denom];
                  const hasValue = liasses > 0 || loose > 0;
                  
                  return (
                    <button
                      key={denom}
                      onClick={() => setCurrentDenom(denom)}
                      className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                        currentDenom === denom
                          ? 'bg-blue-500 text-white'
                          : hasValue
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {denom}
                      {hasValue && <Check className="w-2 h-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Deposit Summary */}
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400 font-semibold">DÉPÔT EN COURS</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLiasseRecommendations(true)}
                  className="text-xs bg-amber-600 text-white px-3 py-1 rounded font-bold active:bg-amber-700 flex items-center gap-1"
                  disabled={getAllVendorsTotal() === 0 && getCurrentDepositTotal() === 0}
                  title="Analyse globale de tous les dépôts"
                >
                  <Calculator className="w-3 h-3" />
                  Globale
                </button>
                <button
                  onClick={clearCurrentDeposit}
                  className="text-xs text-red-400 font-semibold px-2 py-1"
                >
                  Effacer tout
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {denominations.map(denom => {
                const { liasses, loose } = currentDeposit[denom];
                const totalBills = getTotalBills(currentDeposit, denom);
                const totalValue = getTotalValue(currentDeposit, denom);

                if (totalBills === 0) return null;

                const maxLiasses = Math.floor(totalBills / BILLS_PER_LIASSE);
                const remainingBills = totalBills % BILLS_PER_LIASSE;
                const canMakeMoreLiasses = maxLiasses > liasses;

                return (
                  <div key={denom} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`px-3 py-1 rounded font-bold text-sm flex-shrink-0 ${
                        currentDenom === denom ? 'bg-blue-600' : 'bg-slate-700'
                      } text-white`}>
                        {denom}
                      </div>
                      <div className="text-slate-300 text-sm truncate">
                        {liasses > 0 && <span className="text-green-400">{liasses}L</span>}
                        {liasses > 0 && loose > 0 && <span className="text-slate-500"> + </span>}
                        {loose > 0 && <span>{loose}</span>}
                        <span className="text-slate-500 ml-1">= {totalBills}</span>
                        
                        {canMakeMoreLiasses && (
                          <span className="ml-2 text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                            +{maxLiasses - liasses}L possible
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-green-400 font-bold text-sm">
                        {formatCurrency(totalValue)}
                      </div>
                      <button
                        onClick={() => {
                          updateDeposit(denom, 'liasses', 0);
                          updateDeposit(denom, 'loose', 0);
                        }}
                        className="w-6 h-6 bg-red-600/20 text-red-400 rounded flex items-center justify-center active:bg-red-600/40 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}

              {getCurrentDepositBillsCount() === 0 && (
                <div className="text-center text-slate-500 py-4 text-sm">
                  Aucune coupure ajoutée • Utilisez Tab pour passer les coupures
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="bg-slate-800 border-t-2 border-slate-700">
          <div className="p-3 text-center bg-gradient-to-r from-green-900/50 to-emerald-900/50">
            <div className="text-xs text-green-300 font-semibold">DÉPÔT EN COURS - {selectedVendor}</div>
            <div className="text-2xl font-bold text-white mt-1">{formatCurrency(getCurrentDepositTotal())}</div>
            <div className="text-xs text-slate-300 mt-1">
              {getCurrentDepositBillsCount()} billets • {Object.values(currentDeposit).reduce((sum, d) => sum + d.liasses, 0)} liasses
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            <button
              onClick={clearCurrentDeposit}
              className="py-3 bg-red-600 text-white rounded-lg font-bold text-base active:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Annuler
            </button>
            <button
              onClick={saveDeposit}
              className="py-3 bg-green-600 text-white rounded-lg font-bold text-base active:bg-green-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liasse;