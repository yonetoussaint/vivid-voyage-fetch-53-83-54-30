import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RotateCcw, Check, X, Sparkles } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// OPTIMAL DEPARTAGE ALGORITHM
// Strategy:
//   1. Find subsets of sequences whose totals sum exactly to 100 (perfect liasses)
//   2. Among those, prefer combos that use the fewest sequences (cleaner)
//   3. Repeat greedily on remaining sequences
//   4. For whatever's left that can't form 100, output final partial liasse
//
// We treat each sequence as a "pile" we can partially take from.
// Each step we pick from the remaining amounts.
// ─────────────────────────────────────────────────────────────────────────────

function getOptimalInstructions(sequences) {
  if (sequences.length === 0) return [];

  // Working copy: array of { originalIndex, amount }
  let piles = sequences.map((amount, i) => ({ originalIndex: i, amount }));

  const instructions = [];
  let liasseNum = 1;

  while (piles.some(p => p.amount > 0)) {
    const activePiles = piles.filter(p => p.amount > 0);
    if (activePiles.length === 0) break;

    // Try to find an exact subset summing to 100
    const exactCombo = findExactSubset(activePiles, 100);

    let steps = [];
    let total = 0;

    if (exactCombo) {
      // Perfect liasse: take exactly from each pile in the combo
      for (const item of exactCombo) {
        const pile = piles.find(p => p.originalIndex === item.originalIndex);
        const take = item.take;
        steps.push({
          sequenceNum: pile.originalIndex + 1,
          take,
          from: pile.amount,
          remaining: pile.amount - take,
        });
        pile.amount -= take;
        total += take;
      }
    } else {
      // No exact combo – use greedy from largest piles to minimize fragmentation
      // Sort active piles by amount descending for a smarter greedy
      const sorted = [...activePiles].sort((a, b) => b.amount - a.amount);
      let needed = 100;

      for (const item of sorted) {
        if (needed <= 0) break;
        const pile = piles.find(p => p.originalIndex === item.originalIndex);
        if (pile.amount <= 0) continue;

        const take = Math.min(pile.amount, needed);
        steps.push({
          sequenceNum: pile.originalIndex + 1,
          take,
          from: pile.amount,
          remaining: pile.amount - take,
        });
        pile.amount -= take;
        needed -= take;
        total += take;
      }
    }

    if (total > 0) {
      instructions.push({
        liasseNum,
        steps,
        total,
        isComplete: total === 100,
        isPerfectCombo: !!exactCombo,
      });
      liasseNum++;
    } else {
      break;
    }
  }

  return instructions;
}

/**
 * Find a subset of piles (possibly taking partial amounts from each)
 * whose contributions sum to exactly `target`.
 *
 * We model this as: for each pile, we can take 0..amount from it.
 * We want to pick takes t_i ∈ [0, pile.amount] such that Σt_i = target.
 *
 * This is a bounded integer knapsack. For practical sizes (sequences < 20,
 * amounts < a few thousand) we use a smart subset search:
 *
 * Phase 1: Can any single pile cover target exactly? (take exactly 100)
 * Phase 2: Can any two piles combine to exactly 100?
 * Phase 3: Subset-sum on floored piles (integer, bounded)
 *
 * Returns array of { originalIndex, take } or null.
 */
function findExactSubset(activePiles, target) {
  // Phase 1: single pile ≥ target → take exactly target from it
  for (const p of activePiles) {
    if (p.amount >= target) {
      return [{ originalIndex: p.originalIndex, take: target }];
    }
  }

  // Phase 2: two-pile exact sum
  const amountMap = new Map();
  for (const p of activePiles) {
    amountMap.set(p.amount, p);
  }
  for (const p of activePiles) {
    const complement = target - p.amount;
    if (complement > 0 && amountMap.has(complement)) {
      const other = amountMap.get(complement);
      if (other.originalIndex !== p.originalIndex) {
        return [
          { originalIndex: p.originalIndex, take: p.amount },
          { originalIndex: other.originalIndex, take: complement },
        ];
      }
    }
  }

  // Phase 3: General subset-sum with partial takes
  // We try all subsets (up to size 4 for performance) of piles,
  // check if their total ≥ target, and if the subset-sum of their
  // amounts can reach exactly target.
  // Since amounts are integers and we can take any fraction up to the amount,
  // a subset can reach target iff sum(amounts) >= target.
  // So we just need: is there a subset S where sum(S.amounts) >= target?
  // That's trivially always true (take all). The real goal is to find a
  // MINIMAL subset whose sum >= target, to avoid touching too many piles.

  const totalAvail = activePiles.reduce((s, p) => s + p.amount, 0);
  if (totalAvail < target) return null; // not even enough total

  // Find minimal-size subset with sum >= target
  // Try subsets of increasing size
  for (let size = 3; size <= Math.min(activePiles.length, 6); size++) {
    const result = findSubsetOfSizeWithSumAtLeast(activePiles, size, target);
    if (result) {
      // Distribute target among this subset (largest first)
      const sorted = [...result].sort((a, b) => b.amount - a.amount);
      const combo = [];
      let rem = target;
      for (const p of sorted) {
        if (rem <= 0) break;
        const take = Math.min(p.amount, rem);
        combo.push({ originalIndex: p.originalIndex, take });
        rem -= take;
      }
      if (rem === 0) return combo;
    }
  }

  return null; // fall back to greedy
}

function findSubsetOfSizeWithSumAtLeast(piles, size, target) {
  // Iterate combinations of `size` from piles
  function combine(start, chosen) {
    if (chosen.length === size) {
      const sum = chosen.reduce((s, p) => s + p.amount, 0);
      return sum >= target ? chosen : null;
    }
    if (start >= piles.length) return null;
    // prune: remaining can't fill
    const remaining = piles.length - start;
    if (remaining < size - chosen.length) return null;

    // Try including piles[start]
    let res = combine(start + 1, [...chosen, piles[start]]);
    if (res) return res;
    // Try excluding
    return combine(start + 1, chosen);
  }
  return combine(0, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LiasseCounter() {
  const [sequences, setSequences] = useState(() => {
    try {
      const saved = localStorage.getItem('liasseCounterSequences');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [currentInput, setCurrentInput] = useState('');
  const [buttonState, setButtonState] = useState('default');
  const timeoutRef = useRef(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  useEffect(() => {
    try { localStorage.setItem('liasseCounterSequences', JSON.stringify(sequences)); } catch {}
  }, [sequences]);

  const resetButtonState = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setButtonState('default'), 2000);
  };

  const addSequence = () => {
    const value = parseInt(currentInput);
    if (currentInput === '' || isNaN(value) || value <= 0) {
      setButtonState('error');
      resetButtonState();
      return;
    }
    setButtonState('loading');
    setTimeout(() => {
      setSequences(prev => [...prev, value]);
      setCurrentInput('');
      setButtonState('success');
      resetButtonState();
    }, 300);
  };

  const removeSequence = (index) => setSequences(prev => prev.filter((_, i) => i !== index));

  const resetAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Toutes les séquences seront supprimées.')) {
      setSequences([]);
      setCurrentInput('');
    }
  };

  const total = sequences.reduce((s, v) => s + v, 0);
  const liasseInfo = { complete: Math.floor(total / 100), remaining: total % 100 };
  const instructions = getOptimalInstructions(sequences);
  const perfectCount = instructions.filter(i => i.isPerfectCombo).length;

  const getButtonConfig = () => {
    if (currentInput === '' || parseInt(currentInput) === 0) {
      return { icon: Plus, text: 'Ajouter', bgColor: 'bg-slate-300', hoverColor: '', activeColor: '', textColor: 'text-slate-500', disabled: true };
    }
    const configs = {
      default: { icon: Plus, text: 'Ajouter', bgColor: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600', activeColor: 'active:bg-emerald-700', textColor: 'text-white', disabled: false },
      loading: { icon: null, text: 'Ajout...', bgColor: 'bg-emerald-500', hoverColor: '', activeColor: '', textColor: 'text-white', disabled: true },
      success: { icon: Check, text: 'Ajouté !', bgColor: 'bg-emerald-600', hoverColor: '', activeColor: '', textColor: 'text-white', disabled: true },
      error: { icon: X, text: 'Invalide', bgColor: 'bg-red-500', hoverColor: '', activeColor: '', textColor: 'text-white', disabled: true },
    };
    return configs[buttonState] || configs.default;
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 px-2 sm:px-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Compteur de Liasses</h1>
          <p className="text-xs sm:text-base text-slate-600">Calculez vos liasses (100 billets = 1 liasse)</p>
        </div>
        {sequences.length > 0 && (
          <button onClick={resetAll} className="bg-white text-red-600 hover:bg-red-50 active:bg-red-100 border border-red-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium shadow-sm hover:shadow w-full sm:w-auto">
            <RotateCcw size={16} />
            <span>Tout réinitialiser</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6 border border-slate-200">
        {/* Stats */}
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

        {/* Algo quality badge */}
        {instructions.length > 0 && perfectCount > 0 && (
          <div className="mb-4 flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-xs text-violet-700 font-medium">
            <Sparkles size={13} />
            {perfectCount === instructions.filter(i => i.isComplete).length
              ? `${perfectCount} liasse${perfectCount > 1 ? 's' : ''} formée${perfectCount > 1 ? 's' : ''} par combinaison optimale`
              : `${perfectCount} combinaison${perfectCount > 1 ? 's' : ''} parfaite${perfectCount > 1 ? 's' : ''} trouvée${perfectCount > 1 ? 's' : ''}`}
          </div>
        )}

        {/* Input */}
        <div className="flex flex-col xs:flex-row gap-2 mb-4 sm:mb-6">
          <input
            type="number"
            value={currentInput}
            onChange={(e) => {
              setCurrentInput(e.target.value);
              if (buttonState !== 'default') {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setButtonState('default');
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && currentInput !== '' && parseInt(currentInput) > 0 && addSequence()}
            placeholder="Nombre de billets..."
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all"
          />
          <button
            onClick={addSequence}
            disabled={buttonConfig.disabled}
            className={`${buttonConfig.bgColor} ${buttonConfig.hoverColor} ${buttonConfig.activeColor} ${buttonConfig.textColor} px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow min-w-[120px] disabled:opacity-90 disabled:cursor-not-allowed relative`}
          >
            {buttonState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className={`flex items-center gap-2 ${buttonState === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
              {buttonConfig.icon && <buttonConfig.icon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>{buttonConfig.text}</span>
            </div>
          </button>
        </div>

        {/* Sequences */}
        {sequences.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 gap-1">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Séquences ({sequences.length})
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500">Sauvegardé automatiquement</div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {sequences.map((count, idx) => (
                <div key={idx} className="bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-slate-200 transition-colors group">
                  <span className="text-[10px] sm:text-sm font-medium text-slate-700">#{idx + 1}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{count}</span>
                  <button onClick={() => removeSequence(idx)} className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Supprimer">
                    <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
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
                      ? inst.isPerfectCombo
                        ? 'bg-violet-50 border-violet-300'
                        : 'bg-emerald-50 border-emerald-300'
                      : 'bg-amber-50 border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Liasse {inst.liasseNum}</span>
                      {inst.isComplete && inst.isPerfectCombo && (
                        <span className="text-[9px] sm:text-xs bg-violet-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Sparkles size={9} /> Optimale
                        </span>
                      )}
                      {inst.isComplete && !inst.isPerfectCombo && (
                        <span className="text-[9px] sm:text-xs bg-emerald-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-medium">Complète</span>
                      )}
                      {!inst.isComplete && (
                        <span className="text-[9px] sm:text-xs bg-amber-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-medium">Incomplète</span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{inst.total}/100</span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {inst.steps.map((step, idx) => (
                      <div key={idx} className="text-[11px] sm:text-sm bg-white/60 rounded-lg p-2 border border-slate-200">
                        <span className="font-semibold text-slate-800">Séq. #{step.sequenceNum}:</span>{' '}
                        Prenez{' '}
                        <span className="font-bold text-emerald-700">{step.take}</span>
                        {' '}sur {step.from}
                        {step.remaining > 0 && (
                          <span className="text-amber-700 font-semibold"> → reste {step.remaining}</span>
                        )}
                        {step.remaining === 0 && (
                          <span className="text-slate-500"> ✓</span>
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
            <p className="text-sm sm:text-base text-slate-500">Ajoutez des séquences de billets pour commencer</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Une liasse = 100 billets • Les données sont sauvegardées automatiquement</p>
          </div>
        )}
      </div>
    </div>
  );
}
