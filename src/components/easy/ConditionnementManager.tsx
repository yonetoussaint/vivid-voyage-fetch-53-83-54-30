import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 250, 100, 50, 25, 10];

export default function LiasseCounter() {
  // Load from localStorage on component mount
  const [sequences, setSequences] = useState(() => {
    const saved = localStorage.getItem('liasseSequences');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [liasses, setLiasses] = useState(() => {
    const saved = localStorage.getItem('liasses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentDenomination, setCurrentDenomination] = useState(1000);
  const [currentCount, setCurrentCount] = useState('');

  // Save to localStorage whenever sequences or liasses change
  useEffect(() => {
    localStorage.setItem('liasseSequences', JSON.stringify(sequences));
    localStorage.setItem('liasses', JSON.stringify(liasses));
  }, [sequences, liasses]);

  // Add a new sequence of bills
  const addSequence = () => {
    const count = parseInt(currentCount);
    if (isNaN(count) || count <= 0) return;

    const newSequence = {
      id: Date.now() + Math.random(),
      denomination: currentDenomination,
      count: count,
      timestamp: new Date().toISOString(),
      remaining: count
    };

    const updatedSequences = [...sequences, newSequence];
    setSequences(updatedSequences);
    setCurrentCount('');
    
    // Check and form liasses automatically
    autoFormLiasses(updatedSequences);
  };

  // Remove a sequence
  const removeSequence = (id) => {
    const sequenceToRemove = sequences.find(s => s.id === id);
    if (!sequenceToRemove) return;

    // Remove all liasses that used bills from this sequence
    const updatedLiasses = liasses.filter(liasse => 
      !liasse.sequencesUsed?.includes(id)
    );
    
    // Reset remaining counts for other sequences
    const updatedSequences = sequences.map(seq => {
      if (seq.id === id) return null;
      
      // If this sequence was in removed liasses, reset its remaining count
      const wasInRemovedLiasses = liasses.some(l => 
        l.sequencesUsed?.includes(seq.id) && 
        updatedLiasses.every(ul => ul.id !== l.id)
      );
      
      if (wasInRemovedLiasses) {
        return {
          ...seq,
          remaining: seq.count
        };
      }
      
      return seq;
    }).filter(Boolean);

    setSequences(updatedSequences);
    setLiasses(updatedLiasses);
  };

  // Automatically form liasses
  const autoFormLiasses = (currentSequences) => {
    const billsByDenom = {};
    
    // Group available bills by denomination
    currentSequences.forEach(seq => {
      if (seq.remaining > 0) {
        if (!billsByDenom[seq.denomination]) {
          billsByDenom[seq.denomination] = [];
        }
        billsByDenom[seq.denomination].push({
          id: seq.id,
          count: seq.remaining
        });
      }
    });

    let newLiasses = [];

    // Form liasses for each denomination
    Object.entries(billsByDenom).forEach(([denom, bills]) => {
      const denomination = parseInt(denom);
      let availableBills = [...bills];
      
      while (availableBills.reduce((sum, b) => sum + b.count, 0) >= 100) {
        const liasseId = Date.now() + Math.random();
        const newLiasse = {
          id: liasseId,
          denomination: denomination,
          timestamp: new Date().toISOString(),
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
          newLiasse.sequencesUsed.push(bill.id);
          
          needed -= toUse;
          bill.count -= toUse;

          if (bill.count > 0) {
            updatedAvailableBills.push(bill);
          }
        }

        if (newLiasse.sequencesUsed.length > 0) {
          newLiasses.push(newLiasse);
        }

        availableBills = updatedAvailableBills;
      }
    });

    if (newLiasses.length > 0) {
      // Update sequences with new remaining counts
      const updatedSequences = currentSequences.map(seq => {
        const liassesUsingThisSeq = newLiasses.filter(l => 
          l.sequencesUsed.includes(seq.id)
        );
        
        if (liassesUsingThisSeq.length === 0) return seq;

        return {
          ...seq,
          remaining: seq.remaining - 100 // Each liasse uses 100 bills total
        };
      });

      setSequences(updatedSequences);
      setLiasses(prev => [...prev, ...newLiasses]);
    }
  };

  // Calculate progress for current denomination
  const getCurrentProgress = () => {
    const availableBills = sequences
      .filter(seq => seq.denomination === currentDenomination && seq.remaining > 0)
      .reduce((sum, seq) => sum + seq.remaining, 0);

    return {
      available: availableBills,
      needed: Math.max(0, 100 - availableBills),
      progress: Math.min(100, (availableBills / 100) * 100),
      canForm: availableBills >= 100
    };
  };

  const progress = getCurrentProgress();
  
  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate totals
  const totals = {
    totalBills: sequences.reduce((sum, seq) => sum + seq.count, 0),
    totalLiasses: liasses.length,
    remainingBills: sequences.reduce((sum, seq) => sum + seq.remaining, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <h1 className="text-xl font-bold text-slate-900">Compteur de Liasses</h1>
          <p className="text-sm text-slate-600">Ajoutez des billets - les liasses se forment automatiquement à 100</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="grid grid-cols-4 gap-2 mb-4">
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

              <div className="flex gap-2">
                <input
                  type="number"
                  value={currentCount}
                  onChange={(e) => setCurrentCount(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSequence()}
                  placeholder="Nombre de billets..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  min="1"
                />
                <button
                  onClick={addSequence}
                  disabled={!currentCount || parseInt(currentCount) <= 0}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                    currentCount && parseInt(currentCount) > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Plus size={20} />
                  Ajouter
                </button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-slate-900">
                  Progression ({currentDenomination}G)
                </div>
                <div className="text-lg font-bold">
                  {progress.available}/100
                </div>
              </div>
              
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    progress.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              
              <div className={`text-sm font-medium ${
                progress.needed === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {progress.needed === 0 
                  ? '✓ Prêt pour liasse (se formera automatiquement)'
                  : `Encore ${progress.needed} billets pour liasse`
                }
              </div>
            </div>

            {/* Sequences List */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="font-medium text-slate-900">Séquences ajoutées</div>
              </div>
              <div className="overflow-y-auto max-h-[300px]">
                {sequences.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Aucune séquence ajoutée
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[...sequences].reverse().map(seq => (
                      <div key={seq.id} className="p-4 hover:bg-slate-50">
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
                              <div className="font-bold text-slate-900">
                                {seq.count} billets
                              </div>
                              <div className="text-sm text-slate-500">
                                {formatTime(seq.timestamp)} • Reste: {seq.remaining}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSequence(seq.id)}
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
          </div>

          {/* Right Column - Stats & Liasses */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-600">Total billets</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {totals.totalBills}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Liasses formées</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {totals.totalLiasses}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Billets restants</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totals.remainingBills}
                  </div>
                </div>
              </div>
            </div>

            {/* Liasses List */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <Package size={18} />
                  Liasses ({liasses.length})
                </div>
              </div>
              <div className="overflow-y-auto max-h-[400px]">
                {liasses.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    Les liasses apparaîtront ici automatiquement à 100 billets
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[...liasses].reverse().map(liasse => (
                      <div key={liasse.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-slate-900">
                            {liasse.denomination}G
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatTime(liasse.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          100 billets • {liasse.denomination * 100} G
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress by Denomination */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="font-medium text-slate-900 mb-3">Progression par valeur</div>
              <div className="space-y-2">
                {DENOMINATIONS.map(denom => {
                  const availableBills = sequences
                    .filter(seq => seq.denomination === denom && seq.remaining > 0)
                    .reduce((sum, seq) => sum + seq.remaining, 0);
                  
                  const progressPercent = Math.min(100, (availableBills / 100) * 100);
                  
                  return (
                    <div key={denom} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-700">{denom}G</span>
                        <span className="font-medium">{availableBills}/100</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            availableBills >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-3 text-center text-sm text-slate-500 border-t border-slate-200 bg-white">
          Les données sont sauvegardées automatiquement
        </div>
      </div>
    </div>
  );
}