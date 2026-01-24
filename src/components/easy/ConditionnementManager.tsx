import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, CheckCircle } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 250, 100, 50, 25, 10];

export default function LiasseCounter() {
  // Store bills with timestamp for tracking
  const [bills, setBills] = useState(
    DENOMINATIONS.reduce((acc, denom) => ({ 
      ...acc, 
      [denom]: [] // Each entry will be { id, count, timestamp }
    }), {})
  );
  
  const [currentInput, setCurrentInput] = useState(
    DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom]: '' }), {})
  );
  
  const [activeTab, setActiveTab] = useState(1000);
  const [liassesFormed, setLiassesFormed] = useState(
    DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom]: [] }), {})
  );

  // Add new bill sequence
  const addSequence = (denom) => {
    const value = parseInt(currentInput[denom]);
    if (!isNaN(value) && value > 0) {
      const newBill = {
        id: Date.now(),
        count: value,
        timestamp: new Date(),
        isAllocated: false
      };
      
      setBills(prev => ({
        ...prev,
        [denom]: [...prev[denom], newBill]
      }));
      setCurrentInput(prev => ({ ...prev, [denom]: '' }));
      
      // Check if we can form a new liasse
      checkAndFormLiasse(denom);
    }
  };

  // Remove a bill sequence
  const removeSequence = (denom, id) => {
    setBills(prev => ({
      ...prev,
      [denom]: prev[denom].filter(bill => bill.id !== id)
    }));
  };

  // Get total bills for a denomination
  const getTotalBills = (denom) => {
    return bills[denom].reduce((sum, bill) => sum + bill.count, 0);
  };

  // Get allocated bills (those used in liasses)
  const getAllocatedBills = (denom) => {
    return bills[denom].reduce((sum, bill) => bill.isAllocated ? sum + bill.count : sum, 0);
  };

  // Get available bills (not yet allocated)
  const getAvailableBills = (denom) => {
    return bills[denom].reduce((sum, bill) => !bill.isAllocated ? sum + bill.count : sum, 0);
  };

  // Check if we can form a new liasse and form it
  const checkAndFormLiasse = (denom) => {
    const availableBills = bills[denom].filter(bill => !bill.isAllocated);
    let remaining = 100;
    let formedLiasse = [];
    let updatedBills = [...bills[denom]];
    
    for (let i = 0; i < availableBills.length && remaining > 0; i++) {
      const bill = availableBills[i];
      const billIndex = updatedBills.findIndex(b => b.id === bill.id);
      
      if (bill.count <= remaining) {
        // Use entire bill
        formedLiasse.push({
          billId: bill.id,
          used: bill.count
        });
        remaining -= bill.count;
        updatedBills[billIndex].isAllocated = true;
      } else {
        // Use part of bill (split)
        formedLiasse.push({
          billId: bill.id,
          used: remaining
        });
        // Update the bill with remaining count
        updatedBills[billIndex] = {
          ...updatedBills[billIndex],
          count: updatedBills[billIndex].count - remaining,
          // Create a new entry for the remaining part if there's any left
        };
        remaining = 0;
        
        // If there's remaining in the bill, we need to create a new entry
        const originalCount = updatedBills[billIndex].count + remaining;
        if (originalCount - remaining > 0) {
          updatedBills.push({
            id: Date.now() + i, // Unique ID
            count: originalCount - remaining,
            timestamp: new Date(),
            isAllocated: false
          });
        }
      }
    }
    
    if (formedLiasse.length > 0) {
      const liasseId = Date.now();
      const newLiasse = {
        id: liasseId,
        denomination: denom,
        bills: formedLiasse,
        total: 100 - remaining,
        isComplete: remaining === 0,
        timestamp: new Date()
      };
      
      setLiassesFormed(prev => ({
        ...prev,
        [denom]: [...prev[denom], newLiasse]
      }));
      
      setBills(prev => ({
        ...prev,
        [denom]: updatedBills
      }));
    }
  };

  // Manually form a liasse
  const formLiasseManually = (denom) => {
    checkAndFormLiasse(denom);
  };

  // Get progress toward next liasse
  const getNextLiasseProgress = (denom) => {
    const available = getAvailableBills(denom);
    return {
      available,
      needed: Math.max(0, 100 - available),
      progress: Math.min(100, (available / 100) * 100)
    };
  };

  // Reset a liasse (un-allocate bills)
  const resetLiasse = (denom, liasseId) => {
    setLiassesFormed(prev => {
      const liasse = prev[denom].find(l => l.id === liasseId);
      if (!liasse) return prev;
      
      // Mark bills as not allocated
      const updatedBills = bills[denom].map(bill => {
        const usedInLiasse = liasse.bills.find(b => b.billId === bill.id);
        if (usedInLiasse) {
          return {
            ...bill,
            isAllocated: false
          };
        }
        return bill;
      });
      
      setBills(prevBills => ({
        ...prevBills,
        [denom]: updatedBills
      }));
      
      return {
        ...prev,
        [denom]: prev[denom].filter(l => l.id !== liasseId)
      };
    });
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderDenomination = (denom) => {
    const total = getTotalBills(denom);
    const allocated = getAllocatedBills(denom);
    const available = getAvailableBills(denom);
    const progress = getNextLiasseProgress(denom);
    const liasses = liassesFormed[denom];

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
            <div className="text-[10px] sm:text-xs text-slate-600 font-medium mb-1">Total Reçu</div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900">{total}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="text-[10px] sm:text-xs text-blue-700 font-medium mb-1">Disponible</div>
            <div className="text-lg sm:text-2xl font-bold text-blue-900">{available}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-200">
            <div className="text-[10px] sm:text-xs text-emerald-700 font-medium mb-1">Liasses</div>
            <div className="text-lg sm:text-2xl font-bold text-emerald-900">{liasses.length}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200">
            <div className="text-[10px] sm:text-xs text-amber-700 font-medium mb-1">Reste pour prochaine</div>
            <div className="text-lg sm:text-2xl font-bold text-amber-900">{progress.needed}</div>
          </div>
        </div>

        {/* Progress bar for next liasse */}
        <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex justify-between text-xs sm:text-sm mb-2">
            <span className="font-medium text-slate-700">Prochaine liasse</span>
            <span className="font-bold text-slate-900">{available}/100</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                progress.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-slate-500">
            {progress.progress === 100 ? (
              <span className="text-emerald-600 font-medium">✓ Prêt à former une liasse</span>
            ) : (
              <span>Besoin de {progress.needed} billets de plus</span>
            )}
          </div>
          {progress.progress === 100 && (
            <button
              onClick={() => formLiasseManually(denom)}
              className="mt-3 w-full bg-emerald-500 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <CheckCircle size={16} />
              Former une liasse ({available} billets)
            </button>
          )}
        </div>

        {/* Input area */}
        <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Ajouter une réception</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={currentInput[denom]}
              onChange={(e) => setCurrentInput(prev => ({
                ...prev,
                [denom]: e.target.value
              }))}
              onKeyPress={(e) => e.key === 'Enter' && addSequence(denom)}
              placeholder="Nombre de billets reçus..."
              className="flex-1 px-3 sm:px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
            <button
              onClick={() => addSequence(denom)}
              className="bg-blue-500 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Bills List */}
        {bills[denom].length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-slate-700 mb-3">Billets reçus</div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {bills[denom].map((bill) => (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    bill.isAllocated 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{bill.count} billets</span>
                      {bill.isAllocated && (
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          Utilisé
                        </span>
                      )}
                      {!bill.isAllocated && (
                        <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          Disponible
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Reçu à {formatTime(bill.timestamp)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSequence(denom, bill.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liasses Formed */}
        {liasses.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-slate-700 mb-3">
              Liasses formées ({liasses.length})
            </div>
            <div className="space-y-3">
              {liasses.map((liasse) => (
                <div
                  key={liasse.id}
                  className={`p-4 rounded-lg border-2 ${
                    liasse.isComplete
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-amber-50 border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Liasse de {liasse.total}/100
                      </span>
                      {liasse.isComplete ? (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          Complète
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                          Partielle
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => resetLiasse(denom, liasse.id)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600 mb-2">
                    Formée à {formatTime(liasse.timestamp)}
                  </div>
                  
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    Composition:
                  </div>
                  <div className="space-y-1">
                    {liasse.bills.map((bill, idx) => (
                      <div key={idx} className="text-xs bg-white/70 p-2 rounded border border-slate-200">
                        Séquence #{bill.billId.toString().slice(-4)}: {bill.used} billets
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Gestionnaire de Liasses en Continu
          </h1>
          <p className="text-sm text-slate-600">
            Suivez vos billets au fur et à mesure qu'ils arrivent et formez des liasses automatiquement
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-slate-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {DENOMINATIONS.map((denom) => (
              <button
                key={denom}
                onClick={() => setActiveTab(denom)}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 font-medium transition-all ${
                  activeTab === denom
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {denom} G
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200">
          {renderDenomination(activeTab)}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Résumé du jour</h3>
            <div className="space-y-2">
              {DENOMINATIONS.map(denom => (
                <div key={denom} className="flex justify-between text-sm">
                  <span className="text-slate-600">{denom}G:</span>
                  <span className="font-bold">
                    {liassesFormed[denom].length} liasses formées
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Total général</h3>
            <div className="space-y-2">
              {DENOMINATIONS.map(denom => (
                <div key={denom} className="flex justify-between text-sm">
                  <span className="text-slate-600">{denom}G:</span>
                  <span className="font-bold">{getTotalBills(denom)} billets</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}