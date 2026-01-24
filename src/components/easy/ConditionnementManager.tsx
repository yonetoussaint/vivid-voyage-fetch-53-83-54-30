import React, { useState } from 'react';
import { Plus, Trash2, Package, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 250, 100, 50, 25, 10];

export default function LiasseCounter() {
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'progress', 'liasses', 'summary'
  const [sequences, setSequences] = useState([]);
  const [currentDenomination, setCurrentDenomination] = useState(1000);
  const [currentCount, setCurrentCount] = useState('');
  const [liasses, setLiasses] = useState([]);

  // Add a new sequence of bills
  const addSequence = () => {
    const count = parseInt(currentCount);
    if (isNaN(count) || count <= 0) return;

    const newSequence = {
      id: Date.now() + Math.random(),
      denomination: currentDenomination,
      count: count,
      timestamp: new Date(),
      remaining: count, // Bills from this sequence that haven't been used in liasses
      usedInLiasses: [] // Track which liasses used bills from this sequence
    };

    setSequences(prev => [...prev, newSequence]);
    setCurrentCount('');
    
    // Check if we can form any liasses
    autoFormLiasses();
  };

  // Remove a sequence
  const removeSequence = (id) => {
    const sequenceToRemove = sequences.find(s => s.id === id);
    if (!sequenceToRemove) return;

    // If sequence was used in liasses, need to remove those liasses too
    if (sequenceToRemove.usedInLiasses.length > 0) {
      // Remove all liasses that used bills from this sequence
      const updatedLiasses = liasses.filter(liasse => 
        !sequenceToRemove.usedInLiasses.includes(liasse.id)
      );
      setLiasses(updatedLiasses);

      // Update remaining counts for other sequences used in those liasses
      const sequencesToUpdate = sequences.filter(s => 
        s.id !== id && s.usedInLiasses.some(liasseId => 
          sequenceToRemove.usedInLiasses.includes(liasseId)
        )
      );

      const updatedSequences = sequences.map(seq => {
        if (seq.id === id) return null; // Will be removed
        if (sequencesToUpdate.some(s => s.id === seq.id)) {
          // Reset remaining count for affected sequences
          return {
            ...seq,
            remaining: seq.count,
            usedInLiasses: []
          };
        }
        return seq;
      }).filter(Boolean);

      setSequences(updatedSequences);
    } else {
      // Just remove the sequence
      setSequences(prev => prev.filter(s => s.id !== id));
    }
  };

  // Automatically form liasses when possible
  const autoFormLiasses = () => {
    const billsByDenom = {};
    
    // Group available bills by denomination
    sequences.forEach(seq => {
      if (seq.remaining > 0) {
        if (!billsByDenom[seq.denomination]) {
          billsByDenom[seq.denomination] = [];
        }
        billsByDenom[seq.denomination].push({
          id: seq.id,
          count: seq.remaining,
          sequence: seq
        });
      }
    });

    let newLiasses = [];

    // Try to form liasses for each denomination
    Object.entries(billsByDenom).forEach(([denom, bills]) => {
      let availableBills = [...bills].sort((a, b) => 
        a.sequence.timestamp - b.sequence.timestamp // Oldest first
      );
      
      let totalAvailable = availableBills.reduce((sum, b) => sum + b.count, 0);
      
      while (totalAvailable >= 100) {
        const liasseId = Date.now() + Math.random();
        const newLiasse = {
          id: liasseId,
          denomination: parseInt(denom),
          billsUsed: [],
          timestamp: new Date(),
          totalBills: 100,
          sequencesUsed: []
        };

        let needed = 100;
        const updatedAvailableBills = [];

        for (let bill of availableBills) {
          if (needed <= 0) {
            updatedAvailableBills.push(bill);
            continue;
          }

          const toUse = Math.min(bill.count, needed);
          newLiasse.billsUsed.push({
            sequenceId: bill.id,
            count: toUse,
            fromOriginal: bill.sequence.count
          });

          newLiasse.sequencesUsed.push(bill.id);

          needed -= toUse;
          bill.count -= toUse;

          if (bill.count > 0) {
            updatedAvailableBills.push(bill);
          }
        }

        if (newLiasse.billsUsed.length > 0) {
          newLiasses.push(newLiasse);
        }

        availableBills = updatedAvailableBills;
        totalAvailable = availableBills.reduce((sum, b) => sum + b.count, 0);
      }
    });

    if (newLiasses.length > 0) {
      // Update sequences with new remaining counts
      const updatedSequences = sequences.map(seq => {
        const liassesUsingThisSeq = newLiasses.filter(l => 
          l.sequencesUsed.includes(seq.id)
        );
        
        if (liassesUsingThisSeq.length === 0) return seq;

        const totalUsed = liassesUsingThisSeq.reduce((sum, liasse) => {
          const usage = liasse.billsUsed.find(b => b.sequenceId === seq.id);
          return sum + (usage ? usage.count : 0);
        }, 0);

        return {
          ...seq,
          remaining: seq.remaining - totalUsed,
          usedInLiasses: [...seq.usedInLiasses, ...liassesUsingThisSeq.map(l => l.id)]
        };
      });

      setSequences(updatedSequences);
      setLiasses(prev => [...prev, ...newLiasses]);
    }
  };

  // Manually form a liasse for specific denomination
  const manualFormLiasse = (denomination) => {
    const availableBills = sequences
      .filter(seq => seq.denomination === denomination && seq.remaining > 0)
      .sort((a, b) => a.timestamp - b.timestamp);

    const totalAvailable = availableBills.reduce((sum, seq) => sum + seq.remaining, 0);

    if (totalAvailable < 100) return;

    const liasseId = Date.now() + Math.random();
    const newLiasse = {
      id: liasseId,
      denomination: denomination,
      billsUsed: [],
      timestamp: new Date(),
      totalBills: 100,
      sequencesUsed: []
    };

    let needed = 100;
    const sequencesToUpdate = [];

    for (let seq of availableBills) {
      if (needed <= 0) break;

      const toUse = Math.min(seq.remaining, needed);
      newLiasse.billsUsed.push({
        sequenceId: seq.id,
        count: toUse,
        fromOriginal: seq.count
      });

      newLiasse.sequencesUsed.push(seq.id);
      sequencesToUpdate.push({ id: seq.id, used: toUse });
      needed -= toUse;
    }

    // Update sequences
    const updatedSequences = sequences.map(seq => {
      const update = sequencesToUpdate.find(s => s.id === seq.id);
      if (update) {
        return {
          ...seq,
          remaining: seq.remaining - update.used,
          usedInLiasses: [...seq.usedInLiasses, liasseId]
        };
      }
      return seq;
    });

    setSequences(updatedSequences);
    setLiasses(prev => [...prev, newLiasse]);
  };

  // Calculate progress for each denomination
  const getProgressForDenomination = (denomination) => {
    const availableBills = sequences
      .filter(seq => seq.denomination === denomination && seq.remaining > 0)
      .reduce((sum, seq) => sum + seq.remaining, 0);

    return {
      available: availableBills,
      needed: Math.max(0, 100 - availableBills),
      progress: Math.min(100, (availableBills / 100) * 100),
      canForm: availableBills >= 100
    };
  };

  // Get all progress stats
  const getAllProgress = () => {
    const progress = {};
    DENOMINATIONS.forEach(denom => {
      progress[denom] = getProgressForDenomination(denom);
    });
    return progress;
  };

  const progress = getAllProgress();

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      totalBills: sequences.reduce((sum, seq) => sum + seq.count, 0),
      totalValue: sequences.reduce((sum, seq) => sum + (seq.count * seq.denomination), 0),
      liassesCount: liasses.length,
      liassesValue: liasses.reduce((sum, liasse) => sum + (100 * liasse.denomination), 0),
      remainingBills: sequences.reduce((sum, seq) => sum + seq.remaining, 0),
      remainingValue: sequences.reduce((sum, seq) => sum + (seq.remaining * seq.denomination), 0)
    };

    return totals;
  };

  const totals = calculateTotals();

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Tab content components
  const InputTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Ajouter des séquences de billets</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sélectionnez la dénomination
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DENOMINATIONS.map(denom => (
                  <button
                    key={denom}
                    onClick={() => setCurrentDenomination(denom)}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      currentDenomination === denom
                        ? 'bg-slate-900 text-white shadow-sm'
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
                onKeyPress={(e) => e.key === 'Enter' && addSequence()}
                className="w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Ex: 45, 78, 120..."
                min="1"
              />
            </div>

            <button
              onClick={addSequence}
              disabled={!currentCount || parseInt(currentCount) <= 0}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                currentCount && parseInt(currentCount) > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              Ajouter la séquence
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">État actuel ({currentDenomination}G)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Billets disponibles:</span>
                <span className="font-bold text-lg">{progress[currentDenomination].available}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Reste pour liasse:</span>
                <span className={`font-bold text-lg ${
                  progress[currentDenomination].needed === 0 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
                }`}>
                  {progress[currentDenomination].needed}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progression:</span>
                  <span className="font-medium">{progress[currentDenomination].available}/100</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      progress[currentDenomination].progress === 100 
                        ? 'bg-emerald-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress[currentDenomination].progress}%` }}
                  />
                </div>
              </div>

              {progress[currentDenomination].canForm && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle size={18} />
                    <span className="font-medium">✓ Prêt à former une liasse!</span>
                  </div>
                </div>
              )}

              {!progress[currentDenomination].canForm && progress[currentDenomination].available > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock size={18} />
                    <span className="font-medium">
                      Encore {progress[currentDenomination].needed} billets pour former une liasse
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sequences */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Séquences récentes</h3>
        </div>
        <div className="overflow-y-auto max-h-[400px]">
          {sequences.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Aucune séquence ajoutée</p>
              <p className="text-sm mt-1">Commencez par ajouter des billets reçus</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...sequences].reverse().slice(0, 10).map(seq => (
                <div key={seq.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-lg font-bold ${
                        seq.remaining > 0 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {seq.denomination}G
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{seq.count} billets</div>
                        <div className="text-sm text-slate-500">
                          {formatTime(seq.timestamp)} • Restants: <span className="font-medium">{seq.remaining}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSequence(seq.id)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
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
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DENOMINATIONS.map(denom => {
          const prog = progress[denom];
          
          return (
            <div key={denom} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg font-bold">
                    {denom}G
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{prog.available} billets</div>
                    <div className="text-sm text-slate-500">disponibles</div>
                  </div>
                </div>
                
                {prog.canForm && (
                  <button
                    onClick={() => manualFormLiasse(denom)}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Former liasse
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progression vers liasse</span>
                    <span className="font-medium">{prog.available}/100</span>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prog.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${prog.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600 mb-1">Restants</div>
                    <div className={`text-xl font-bold ${
                      prog.needed === 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {prog.needed}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600 mb-1">Progression</div>
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round(prog.progress)}%
                    </div>
                  </div>
                </div>

                {prog.canForm ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle size={16} />
                      <span className="font-medium">✓ Prêt à former une liasse</span>
                    </div>
                  </div>
                ) : prog.available > 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock size={16} />
                      <span className="font-medium">Encore {prog.needed} billets nécessaires</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <XCircle size={16} />
                      <span className="font-medium">Aucun billet disponible</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Form All Button */}
      {Object.values(progress).some(p => p.canForm) && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Former toutes les liasses disponibles</h3>
              <p className="text-emerald-700">
                {Object.values(progress).filter(p => p.canForm).length} dénominations sont prêtes
              </p>
            </div>
            <button
              onClick={() => {
                DENOMINATIONS.forEach(denom => {
                  if (progress[denom].canForm) {
                    manualFormLiasse(denom);
                  }
                });
              }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Package size={20} />
              Former toutes les liasses
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const LiassesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Liasses formées</h3>
              <p className="text-slate-600">{liasses.length} liasses de 100 billets</p>
            </div>
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold">
              {totals.liassesValue.toLocaleString()} G
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {liasses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-700 mb-2">Aucune liasse formée</h4>
              <p className="text-slate-500">Les liasses apparaîtront ici lorsqu'elles seront formées</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...liasses].reverse().map(liasse => (
                <div key={liasse.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold">
                          {liasse.denomination}G
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          Liasse de 100 billets
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        Formée le {liasse.timestamp.toLocaleDateString()} à {formatTime(liasse.timestamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-slate-900">
                        {(100 * liasse.denomination).toLocaleString()} G
                      </div>
                      <div className="text-sm text-slate-500">Valeur totale</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-slate-700 mb-2">
                      Composition de la liasse:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {liasse.billsUsed.map((bill, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-slate-200">
                          <div className="font-medium text-slate-900">
                            {bill.count} billet{bill.count > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            De séquence #{bill.sequenceId.toString().slice(-6)}
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
  );

  const SummaryTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Total reçu</div>
              <div className="text-2xl font-bold text-slate-900">
                {totals.totalBills.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {totals.totalValue.toLocaleString()} G de valeur
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Liasses formées</div>
              <div className="text-2xl font-bold text-emerald-900">
                {totals.liassesCount}
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {totals.liassesValue.toLocaleString()} G de valeur
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Billets restants</div>
              <div className="text-2xl font-bold text-amber-900">
                {totals.remainingBills}
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {totals.remainingValue.toLocaleString()} G de valeur
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Détail par dénomination</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Dénomination</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Reçus</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Liasses</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Restants</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Prochaine liasse</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DENOMINATIONS.map(denom => {
                const prog = progress[denom];
                const liassesForDenom = liasses.filter(l => l.denomination === denom).length;
                const sequencesForDenom = sequences.filter(s => s.denomination === denom);
                const totalReceived = sequencesForDenom.reduce((sum, seq) => sum + seq.count, 0);
                
                return (
                  <tr key={denom} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{denom}G</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{totalReceived}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-emerald-600">{liassesForDenom}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-blue-600">{prog.available}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              prog.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                        <div className="text-sm font-medium">
                          {prog.needed === 0 ? '✓ Prêt' : `${prog.needed} restants`}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => manualFormLiasse(denom)}
                        disabled={!prog.canForm}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                          prog.canForm
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Former
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestionnaire de Liasses</h1>
          <p className="text-slate-600">
            Suivez vos billets et formez des liasses de 100 billets exactement
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl mb-6 overflow-hidden border border-slate-200 shadow-sm">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === 'input'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={18} />
                Ajouter
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={18} />
                Progression
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('liasses')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === 'liasses'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package size={18} />
                Liasses ({liasses.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <DollarSign size={18} />
                Résumé
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'input' && <InputTab />}
          {activeTab === 'progress' && <ProgressTab />}
          {activeTab === 'liasses' && <LiassesTab />}
          {activeTab === 'summary' && <SummaryTab />}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-600">Séquences</div>
              <div className="font-bold text-slate-900">{sequences.length}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-600">Liasses</div>
              <div className="font-bold text-emerald-600">{liasses.length}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-600">Billets restants</div>
              <div className="font-bold text-blue-600">{totals.remainingBills}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-600">Valeur totale</div>
              <div className="font-bold text-slate-900">{totals.totalValue.toLocaleString()} G</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}