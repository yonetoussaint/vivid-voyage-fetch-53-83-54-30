import React, { useState } from 'react';
import { Plus, Trash2, Package, TrendingUp, Clock } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 250, 100, 50, 25, 10];

export default function LiasseCounter() {
  // Store received bills with denomination, count, and timestamp
  const [receivedBills, setReceivedBills] = useState([]);
  const [liasses, setLiasses] = useState([]);
  const [currentDenomination, setCurrentDenomination] = useState(1000);
  const [currentCount, setCurrentCount] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time' or 'denomination'

  // Add new received bills
  const addReceivedBills = () => {
    const count = parseInt(currentCount);
    if (isNaN(count) || count <= 0) return;

    const newEntry = {
      id: Date.now() + Math.random(),
      denomination: currentDenomination,
      count: count,
      timestamp: new Date(),
      usedInLiasses: 0, // How many from this entry have been used in liasses
      remaining: count // How many are still available
    };

    setReceivedBills(prev => [...prev, newEntry]);
    setCurrentCount('');
    autoFormLiasses();
  };

  // Auto-form liasses when we have enough bills
  const autoFormLiasses = () => {
    // Group bills by denomination
    const billsByDenom = {};
    receivedBills.forEach(bill => {
      if (!billsByDenom[bill.denomination]) {
        billsByDenom[bill.denomination] = [];
      }
      billsByDenom[bill.denomination].push({...bill});
    });

    let formedLiasses = [];
    
    // Try to form liasses for each denomination
    Object.keys(billsByDenom).forEach(denom => {
      const denomBills = billsByDenom[denom];
      let availableBills = denomBills
        .filter(bill => bill.remaining > 0)
        .sort((a, b) => a.timestamp - b.timestamp); // Use oldest first
      
      while (availableBills.reduce((sum, bill) => sum + bill.remaining, 0) >= 100) {
        // Form a liasse
        const liasseId = Date.now() + Math.random();
        const newLiasse = {
          id: liasseId,
          denomination: parseInt(denom),
          billsUsed: [],
          timestamp: new Date(),
          totalBills: 100
        };
        
        let needed = 100;
        
        // Use bills to form the liasse
        for (let i = 0; i < availableBills.length && needed > 0; i++) {
          const bill = availableBills[i];
          const toUse = Math.min(bill.remaining, needed);
          
          newLiasse.billsUsed.push({
            billId: bill.id,
            count: toUse,
            fromOriginalCount: bill.count,
            remainingAfter: bill.remaining - toUse
          });
          
          needed -= toUse;
          bill.remaining -= toUse;
        }
        
        formedLiasses.push(newLiasse);
        
        // Update available bills for next iteration
        availableBills = availableBills.filter(bill => bill.remaining > 0);
      }
    });
    
    if (formedLiasses.length > 0) {
      // Update received bills with new remaining counts
      const updatedReceivedBills = receivedBills.map(bill => {
        const allUsed = formedLiasses.flatMap(l => l.billsUsed);
        const usedForThisBill = allUsed.filter(u => u.billId === bill.id);
        const totalUsed = usedForThisBill.reduce((sum, u) => sum + u.count, 0);
        
        return {
          ...bill,
          usedInLiasses: bill.usedInLiasses + totalUsed,
          remaining: bill.count - (bill.usedInLiasses + totalUsed)
        };
      });
      
      setReceivedBills(updatedReceivedBills);
      setLiasses(prev => [...prev, ...formedLiasses]);
    }
  };

  // Manually form a liasse for a specific denomination
  const manualFormLiasse = (denomination) => {
    const availableBills = receivedBills
      .filter(bill => bill.denomination === denomination && bill.remaining > 0)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    const totalAvailable = availableBills.reduce((sum, bill) => sum + bill.remaining, 0);
    
    if (totalAvailable < 100) {
      alert(`Pas assez de billets ${denomination}G pour former une liasse. Disponible: ${totalAvailable}/100`);
      return;
    }
    
    const liasseId = Date.now() + Math.random();
    const newLiasse = {
      id: liasseId,
      denomination: denomination,
      billsUsed: [],
      timestamp: new Date(),
      totalBills: 100
    };
    
    let needed = 100;
    const billsToUpdate = [];
    
    // Use bills to form the liasse
    for (let i = 0; i < availableBills.length && needed > 0; i++) {
      const bill = availableBills[i];
      const toUse = Math.min(bill.remaining, needed);
      
      newLiasse.billsUsed.push({
        billId: bill.id,
        count: toUse,
        fromOriginalCount: bill.count,
        remainingAfter: bill.remaining - toUse
      });
      
      billsToUpdate.push({
        id: bill.id,
        used: toUse
      });
      
      needed -= toUse;
    }
    
    // Update received bills
    const updatedReceivedBills = receivedBills.map(bill => {
      const update = billsToUpdate.find(b => b.id === bill.id);
      if (update) {
        return {
          ...bill,
          usedInLiasses: bill.usedInLiasses + update.used,
          remaining: bill.remaining - update.used
        };
      }
      return bill;
    });
    
    setReceivedBills(updatedReceivedBills);
    setLiasses(prev => [...prev, newLiasse]);
  };

  // Remove a received bill entry
  const removeReceivedBill = (id) => {
    setReceivedBills(prev => prev.filter(bill => bill.id !== id));
  };

  // Undo a liasse (return bills to available pool)
  const undoLiasse = (liasseId) => {
    const liasseToUndo = liasses.find(l => l.id === liasseId);
    if (!liasseToUndo) return;
    
    // Update received bills
    const updatedReceivedBills = receivedBills.map(bill => {
      const usedInThisLiasse = liasseToUndo.billsUsed.find(u => u.billId === bill.id);
      if (usedInThisLiasse) {
        return {
          ...bill,
          usedInLiasses: bill.usedInLiasses - usedInThisLiasse.count,
          remaining: bill.remaining + usedInThisLiasse.count
        };
      }
      return bill;
    });
    
    setReceivedBills(updatedReceivedBills);
    setLiasses(prev => prev.filter(l => l.id !== liasseId));
  };

  // Calculate statistics
  const getStats = () => {
    const stats = {};
    
    DENOMINATIONS.forEach(denom => {
      const denomBills = receivedBills.filter(b => b.denomination === denom);
      const totalReceived = denomBills.reduce((sum, b) => sum + b.count, 0);
      const totalUsed = denomBills.reduce((sum, b) => sum + b.usedInLiasses, 0);
      const totalAvailable = denomBills.reduce((sum, b) => sum + b.remaining, 0);
      const liassesForDenom = liasses.filter(l => l.denomination === denom).length;
      const canFormLiasse = totalAvailable >= 100;
      
      stats[denom] = {
        totalReceived,
        totalUsed,
        totalAvailable,
        liasses: liassesForDenom,
        canFormLiasse,
        progress: Math.min(100, (totalAvailable / 100) * 100)
      };
    });
    
    return stats;
  };

  const stats = getStats();
  const sortedReceivedBills = [...receivedBills].sort((a, b) => {
    if (sortBy === 'time') return b.timestamp - a.timestamp;
    if (sortBy === 'denomination') return b.denomination - a.denomination;
    return 0;
  });

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compteur de Liasses</h1>
          <p className="text-slate-600">
            Suivez vos billets reçus et formez des liasses de 100 billets
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Total reçu</div>
                <div className="text-2xl font-bold text-slate-900">
                  {receivedBills.reduce((sum, b) => sum + b.count, 0)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Liasses formées</div>
                <div className="text-2xl font-bold text-emerald-900">
                  {liasses.length}
                </div>
              </div>
              <Package className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Total disponible</div>
                <div className="text-2xl font-bold text-amber-900">
                  {receivedBills.reduce((sum, b) => sum + b.remaining, 0)}
                </div>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Valeur totale</div>
                <div className="text-2xl font-bold text-purple-900">
                  {receivedBills.reduce((sum, b) => sum + (b.count * b.denomination), 0).toLocaleString()} G
                </div>
              </div>
              <div className="text-purple-500 font-bold">G</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Form */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Ajouter des billets reçus</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dénomination
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DENOMINATIONS.map(denom => (
                      <button
                        key={denom}
                        onClick={() => setCurrentDenomination(denom)}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          currentDenomination === denom
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {denom}G
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de billets
                  </label>
                  <input
                    type="number"
                    value={currentCount}
                    onChange={(e) => setCurrentCount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addReceivedBills()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ex: 45, 120, 200..."
                  />
                </div>
                
                <button
                  onClick={addReceivedBills}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Ajouter les billets reçus
                </button>
              </div>
            </div>

            {/* Quick Liasse Formation */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Former des liasses</h2>
              <div className="space-y-3">
                {DENOMINATIONS.map(denom => (
                  <div key={denom} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{denom}G</div>
                      <div className="text-sm text-slate-600">
                        {stats[denom]?.totalAvailable || 0} disponibles / 100
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${stats[denom]?.progress || 0}%` }}
                        />
                      </div>
                      <button
                        onClick={() => manualFormLiasse(denom)}
                        disabled={!stats[denom]?.canFormLiasse}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          stats[denom]?.canFormLiasse
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Former
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Received Bills List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900">Billets reçus</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Trier par:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-slate-300 rounded-lg px-3 py-1 outline-none"
                    >
                      <option value="time">Heure</option>
                      <option value="denomination">Dénomination</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[400px]">
                {sortedReceivedBills.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Aucun billet reçu aujourd'hui
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {sortedReceivedBills.map(bill => (
                      <div key={bill.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg text-slate-900">
                                {bill.denomination}G
                              </span>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-slate-600">Reçu:</span>
                                <span className="font-bold">{bill.count}</span>
                                <span className="text-slate-500 mx-1">•</span>
                                <span className="text-slate-600">Utilisés:</span>
                                <span className="font-bold text-emerald-600">{bill.usedInLiasses}</span>
                                <span className="text-slate-500 mx-1">•</span>
                                <span className="text-slate-600">Restants:</span>
                                <span className="font-bold text-blue-600">{bill.remaining}</span>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {formatDate(bill.timestamp)} à {formatTime(bill.timestamp)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeReceivedBill(bill.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Liasses Formed List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Liasses formées ({liasses.length})</h2>
              </div>
              
              <div className="overflow-y-auto max-h-[400px]">
                {liasses.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Aucune liasse formée
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {liasses.sort((a, b) => b.timestamp - a.timestamp).map(liasse => (
                      <div key={liasse.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                              {liasse.denomination}G
                            </div>
                            <span className="font-bold text-slate-900">
                              Liasse de 100 billets
                            </span>
                          </div>
                          <button
                            onClick={() => undoLiasse(liasse.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Annuler
                          </button>
                        </div>
                        
                        <div className="text-sm text-slate-600 mb-2">
                          Formée {formatDate(liasse.timestamp)} à {formatTime(liasse.timestamp)}
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-slate-700 mb-2">
                            Composition:
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {liasse.billsUsed.map((bill, idx) => (
                              <div key={idx} className="text-xs bg-white p-2 rounded border border-slate-200">
                                <div className="font-medium">
                                  {bill.count} billet{bill.count > 1 ? 's' : ''}
                                </div>
                                <div className="text-slate-500">
                                  Reste: {bill.remainingAfter}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats by Denomination */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Statistiques par dénomination</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Dénomination</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Total reçu</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Utilisés</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Disponibles</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Liasses</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Prochaine liasse</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {DENOMINATIONS.map(denom => (
                  <tr key={denom} className="border-b border-slate-100 last:border-0">
                    <td className="py-4">
                      <span className="font-bold text-slate-900">{denom}G</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold">{stats[denom]?.totalReceived || 0}</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-emerald-600">{stats[denom]?.totalUsed || 0}</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-blue-600">{stats[denom]?.totalAvailable || 0}</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold">{stats[denom]?.liasses || 0}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${stats[denom]?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {stats[denom]?.totalAvailable || 0}/100
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => manualFormLiasse(denom)}
                        disabled={!stats[denom]?.canFormLiasse}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                          stats[denom]?.canFormLiasse
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Former liasse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}