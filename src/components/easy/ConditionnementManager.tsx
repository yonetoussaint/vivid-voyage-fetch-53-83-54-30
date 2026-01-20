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
  const [activeTab, setActiveTab] = useState(1000);

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-600">Total billets</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {total}
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
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => addSequence(denom)}
            className="bg-emerald-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Sequences */}
        {bills[denom].length > 0 && (
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Séquences:
            </div>
            <div className="flex flex-wrap gap-2">
              {bills[denom].map((count, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2"
                >
                  <span className="text-xs sm:text-sm">
                    #{idx + 1}: {count}
                  </span>
                  <button
                    onClick={() => removeSequence(denom, idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liasse summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-gray-600">Liasses complètes</div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                {liasseInfo.complete}
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-600">Billets restants</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-700">
                {liasseInfo.remaining}
              </div>
            </div>
          </div>
        </div>

        {/* Departage Instructions */}
        {instructions.length > 0 && (
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
              Comment départager les séquences:
            </div>
            <div className="space-y-3">
              {instructions.map((inst) => (
                <div
                  key={inst.liasseNum}
                  className={`p-3 sm:p-4 rounded-lg border-2 ${
                    inst.isComplete 
                      ? 'bg-emerald-50 border-emerald-400' 
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm sm:text-base font-bold text-gray-800">
                      Liasse {inst.liasseNum} {inst.isComplete ? '✓' : '(Incomplète)'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-gray-800">
                      {inst.total}/100
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {inst.steps.map((step, idx) => (
                      <div key={idx} className="text-xs sm:text-sm">
                        <span className="font-semibold text-gray-800">
                          Séquence #{step.sequenceNum}:
                        </span>{' '}
                        Prenez{' '}
                        <span className="font-bold text-emerald-700">
                          {step.take} billets
                        </span>
                        {' '}sur {step.from}
                        {step.remaining > 0 && (
                          <span className="text-orange-600 font-semibold">
                            {' '}→ reste {step.remaining} pour la prochaine liasse
                          </span>
                        )}
                        {step.remaining === 0 && (
                          <span className="text-gray-500">
                            {' '}(tout utilisé ✓)
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Compteur de Liasses
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Sélectionnez une dénomination et entrez vos séquences
          </p>
        </div>

        {/* Tabs Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm mb-4 p-1 overflow-hidden border border-gray-100">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {DENOMINATIONS.map((denom) => {
              const isActive = activeTab === denom;
              
              return (
                <button
                  key={denom}
                  onClick={() => setActiveTab(denom)}
                  className={`flex-shrink-0 snap-center min-w-[70px] sm:min-w-[80px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-xs sm:text-sm font-semibold ${
                      isActive ? 'text-white' : 'text-gray-800'
                    }`}>
                      {denom} G
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {renderDenomination(activeTab)}
        </div>
      </div>
    </div>
  );
}