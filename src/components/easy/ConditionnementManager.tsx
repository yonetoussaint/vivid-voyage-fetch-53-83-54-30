import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export default function LiasseCounter() {
  const [sequences, setSequences] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('liasseCounterSequences');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentInput, setCurrentInput] = useState('');

  // Save to localStorage whenever sequences change
  useEffect(() => {
    localStorage.setItem('liasseCounterSequences', JSON.stringify(sequences));
  }, [sequences]);

  const addSequence = () => {
    const value = parseInt(currentInput);
    if (!isNaN(value) && value > 0) {
      const newSequences = [...sequences, value];
      setSequences(newSequences);
      setCurrentInput('');
    }
  };

  const removeSequence = (index) => {
    setSequences(prev => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Toutes les séquences seront supprimées.')) {
      setSequences([]);
      setCurrentInput('');
    }
  };

  const getTotalBills = () => {
    return sequences.reduce((sum, val) => sum + val, 0);
  };

  const getLiasses = () => {
    const total = getTotalBills();
    return {
      complete: Math.floor(total / 100),
      remaining: total % 100
    };
  };

  const getDepartageInstructions = () => {
    if (sequences.length === 0) return [];

    const instructions = [];
    let remaining = [...sequences];
    let liasseNum = 1;

    while (remaining.some(val => val > 0)) {
      const instruction = {
        liasseNum,
        steps: []
      };

      let currentTotal = 0;

      for (let i = 0; i < remaining.length; i++) {
        if (remaining[i] === 0) continue;

        const needed = 100 - currentTotal;
        if (needed === 0) break;

        const toTake = Math.min(remaining[i], needed);
        const originalAmount = remaining[i];

        instruction.steps.push({
          sequenceNum: i + 1,
          take: toTake,
          from: originalAmount,
          remaining: originalAmount - toTake
        });

        remaining[i] -= toTake;
        currentTotal += toTake;
      }

      if (currentTotal > 0) {
        instruction.total = currentTotal;
        instruction.isComplete = currentTotal === 100;
        instructions.push(instruction);
        liasseNum++;
      } else {
        break;
      }
    }

    return instructions;
  };

  const total = getTotalBills();
  const liasseInfo = getLiasses();
  const instructions = getDepartageInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-2 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Reset Button */}
        <div className="mb-4 sm:mb-6 px-2 sm:px-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
              Compteur de Liasses
            </h1>
            <p className="text-xs sm:text-base text-slate-600">
              Calculez vos liasses (100 billets = 1 liasse)
            </p>
          </div>
          {sequences.length > 0 && (
            <button
              onClick={resetAll}
              className="bg-white text-red-600 hover:bg-red-50 active:bg-red-100 border border-red-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium shadow-sm hover:shadow w-full sm:w-auto"
            >
              <RotateCcw size={16} className="sm:w-4 sm:h-4" />
              <span>Tout réinitialiser</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6 border border-slate-200">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-slate-200">
              <div className="text-[10px] sm:text-xs text-slate-600 font-medium mb-0.5 sm:mb-1">Total Billets</div>
              <div className="text-lg sm:text-2xl font-bold text-slate-900">{total}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-emerald-200">
              <div className="text-[10px] sm:text-xs text-emerald-700 font-medium mb-0.5 sm:mb-1">Liasses</div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-900">{liasseInfo.complete}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-amber-200">
              <div className="text-[10px] sm:text-xs text-amber-700 font-medium mb-0.5 sm:mb-1">Reste</div>
              <div className="text-lg sm:text-2xl font-bold text-amber-900">{liasseInfo.remaining}</div>
            </div>
          </div>

          {/* Input area - Fixed for mobile */}
          <div className="flex flex-col xs:flex-row gap-2 mb-4 sm:mb-6">
            <input
              type="number"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSequence()}
              placeholder="Nombre de billets..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all"
            />
            <button
              onClick={addSequence}
              className="bg-emerald-500 text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-emerald-600 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow min-w-[120px]"
            >
              <Plus size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Ajouter</span>
            </button>
          </div>

          {/* Sequences */}
          {sequences.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 gap-1">
                <div className="text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Séquences ({sequences.length})
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">
                  Sauvegardé automatiquement
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sequences.map((count, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-slate-200 transition-colors group"
                  >
                    <span className="text-[10px] sm:text-sm font-medium text-slate-700">
                      #{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {count}
                    </span>
                    <button
                      onClick={() => removeSequence(idx)}
                      className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Supprimer cette séquence"
                    >
                      <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departage Instructions */}
          {instructions.length > 0 && (
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Instructions de départage
              </div>
              <div className="space-y-2 sm:space-y-3">
                {instructions.map((inst) => (
                  <div
                    key={inst.liasseNum}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                      inst.isComplete 
                        ? 'bg-emerald-50 border-emerald-300' 
                        : 'bg-amber-50 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Liasse {inst.liasseNum}
                        </span>
                        {inst.isComplete && (
                          <span className="text-[9px] sm:text-xs bg-emerald-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                            Complète
                          </span>
                        )}
                        {!inst.isComplete && (
                          <span className="text-[9px] sm:text-xs bg-amber-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                            Incomplète
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {inst.total}/100
                      </span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      {inst.steps.map((step, idx) => (
                        <div key={idx} className="text-[11px] sm:text-sm bg-white/60 rounded-lg p-2 border border-slate-200">
                          <span className="font-semibold text-slate-800">
                            Séq. #{step.sequenceNum}:
                          </span>{' '}
                          Prenez{' '}
                          <span className="font-bold text-emerald-700">
                            {step.take}
                          </span>
                          {' '}sur {step.from}
                          {step.remaining > 0 && (
                            <span className="text-amber-700 font-semibold">
                              {' '}→ reste {step.remaining}
                            </span>
                          )}
                          {step.remaining === 0 && (
                            <span className="text-slate-500">
                              {' '}✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sequences.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-slate-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-slate-500">
                Ajoutez des séquences de billets pour commencer
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Une liasse = 100 billets • Les données sont sauvegardées automatiquement
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}