import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Users, Trash2, ChevronLeft, Eye, Check, SkipForward, ArrowRight } from 'lucide-react';

const Liasse = ({ shift, date, vendeurs }) => {
  const denominations = [1000, 500, 250, 100, 50, 25, 10, 5];
  const BILLS_PER_LIASSE = 100;

  // Use vendeurs from props or fallback to defaults
  const availableVendors = vendeurs && vendeurs.length > 0 ? vendeurs : 
    ['Juny', 'Santho', 'Jamesly', 'Stanley', 'Taïcha', 'Nerlande', 'Darline', 'Florence'];

  const [selectedVendor, setSelectedVendor] = useState(availableVendors[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    const count = parseInt(quickCount || '0') + num;
                    setQuickCount(count.toString());
                  }}
                  className="py-3 bg-slate-700 text-white rounded-lg font-bold active:bg-slate-600 text-sm"
                >
                  +{num}
                </button>
              ))}
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
              <button
                onClick={clearCurrentDeposit}
                className="text-xs text-red-400 font-semibold px-2 py-1"
              >
                Effacer tout
              </button>
            </div>

            <div className="space-y-1">
              {denominations.map(denom => {
                const { liasses, loose } = currentDeposit[denom];
                const totalBills = getTotalBills(currentDeposit, denom);
                const totalValue = getTotalValue(currentDeposit, denom);

                if (totalBills === 0) return null;

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