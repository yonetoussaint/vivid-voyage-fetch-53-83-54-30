import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 250, 100, 50, 25, 10];

export default function LiasseCounter() {
  const [bills, setBills] = useState(
    DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom]: [] }), {})
  );
  const [currentInput, setCurrentInput] = useState(
    DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom]: '' }), {})
  );

  const addSequence = (denom) => {
    const value = parseInt(currentInput[denom]);
    if (!isNaN(value) && value > 0) {
      setBills(prev => ({
        ...prev,
        [denom]: [...prev[denom], value]
      }));
      setCurrentInput(prev => ({ ...prev, [denom]: '' }));
    }
  };

  const removeSequence = (denom, index) => {
    setBills(prev => ({
      ...prev,
      [denom]: prev[denom].filter((_, i) => i !== index)
    }));
  };

  const getTotalBills = (denom) => {
    return bills[denom].reduce((sum, val) => sum + val, 0);
  };

  const getLiasses = (denom) => {
    const total = getTotalBills(denom);
    return {
      complete: Math.floor(total / 100),
      remaining: total % 100
    };
  };

  const getDepartageInstructions = (denom) => {
    const sequences = bills[denom];
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

  const renderDenomination = (denom) => {
    const liasseInfo = getLiasses(denom);
    const total = getTotalBills(denom);
    const instructions = getDepartageInstructions(denom);

    return (
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 last:mb-0">
        {/* Denomination Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {denom} Gourdes
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-slate-600">
              <span className="font-medium">Total:</span> {total}
            </div>
            <div className="text-xs sm:text-sm text-emerald-700 font-medium">
              <span className="font-normal">Liasses:</span> {liasseInfo.complete}
            </div>
            <div className="text-xs sm:text-sm text-amber-700 font-medium">
              <span className="font-normal">Reste:</span> {liasseInfo.remaining}
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <input
            type="number"
            value={currentInput[denom]}
            onChange={(e) => setCurrentInput(prev => ({
              ...prev,
              [denom]: e.target.value
            }))}
            onKeyPress={(e) => e.key === 'Enter' && addSequence(denom)}
            placeholder="Nombre de billets..."
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all"
          />
          <button
            onClick={() => addSequence(denom)}
            className="bg-emerald-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-emerald-600 active:bg-emerald-700 transition-all flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow whitespace-nowrap"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Ajouter</span>
            <span className="xs:hidden">+</span>
          </button>
        </div>

        {/* Sequences */}
        {bills[denom].length > 0 && (
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wide">
              Séquences
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {bills[denom].map((count, idx) => (
                <div
                  key={idx}
                  className="bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-slate-200 transition-colors"
                >
                  <span className="text-[10px] sm:text-sm font-medium text-slate-700">
                    #{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {count}
                  </span>
                  <button
                    onClick={() => removeSequence(denom, idx)}
                    className="text-red-500 hover:text-red-700 transition-colors"
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-2 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
            Compteur de Liasses
          </h1>
          <p className="text-xs sm:text-base text-slate-600">
            Gérez vos billets par dénomination
          </p>
        </div>

        {/* All Denominations */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6 border border-slate-200">
          {DENOMINATIONS.map((denom) => (
            <div key={denom}>
              {renderDenomination(denom)}
              {denom !== DENOMINATIONS[DENOMINATIONS.length - 1] && (
                <hr className="my-4 sm:my-6 border-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}