// LiasseCounter.jsx (updated to accept external sequences)
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RotateCcw, Check, X, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTAGE ALGORITHM v3 — "Anchor + Fill"
//
// Per liasse:
//   1. Pick the LARGEST remaining pile as the "anchor".
//   2. If anchor ≥ 100 → take exactly 100 from it, done.
//   3. Otherwise anchor contributes its full amount.
//      Fill the remainder (100 − anchor) by consuming the SMALLEST piles first,
//      exhausting each one fully before touching the next larger one.
//      At most ONE pile gets partially split — always the last one needed.
//
// Example: piles [58, 36, 74, 38, 14]
//   Liasse 1 → anchor=74, need 26 more → smallest others: 14(full)+12 from 36 → done
//   Wait: 14 < 26, so take all 14, need 12 more → take 12 from 36 (next smallest)
//   → 74 + 14 + 12 = 100 ✓  (36 has 24 left, 58 untouched)
// ─────────────────────────────────────────────────────────────────────────────

const TARGET = 100;

function buildLiasse(activePiles) {
  const byDesc = [...activePiles].sort((a, b) => b.amount - a.amount);
  const anchor = byDesc[0];

  // Anchor alone covers 100
  if (anchor.amount >= TARGET) {
    return [{ originalIndex: anchor.originalIndex, take: TARGET }];
  }

  // Anchor contributes in full; fill remainder with smallest-first
  const steps = [{ originalIndex: anchor.originalIndex, take: anchor.amount }];
  let rem = TARGET - anchor.amount;

  const others = byDesc.slice(1).sort((a, b) => a.amount - b.amount); // ascending
  for (const p of others) {
    if (rem <= 0) break;
    const take = Math.min(p.amount, rem);
    steps.push({ originalIndex: p.originalIndex, take });
    rem -= take;
  }

  return steps; // rem may be > 0 only for the final partial liasse
}

function getInstructions(sequences) {
  if (sequences.length === 0) return [];

  const piles = sequences.map((amount, i) => ({ originalIndex: i, amount }));
  const instructions = [];
  let liasseNum = 1;

  while (piles.some(p => p.amount > 0)) {
    const activePiles = piles.filter(p => p.amount > 0);
    if (!activePiles.length) break;

    const rawSteps = buildLiasse(activePiles);

    // Apply takes and build display steps
    let total = 0;
    const displaySteps = rawSteps.map(({ originalIndex, take }) => {
      const pile = piles.find(p => p.originalIndex === originalIndex);
      const from = pile.amount;
      pile.amount -= take;
      total += take;
      return { sequenceNum: originalIndex + 1, take, from, remaining: pile.amount };
    });

    if (total > 0) {
      instructions.push({ 
        liasseNum, 
        steps: displaySteps, 
        total, 
        isComplete: total === TARGET,
        timestamp: Date.now()
      });
      liasseNum++;
    } else break;
  }

  return instructions;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LiasseCounter({ 
  denomination = 1000,
  externalSequences = [], // New prop for sequences from deposits
  isExternal = false // Flag to indicate if using external data
}) {
  // State for active sequences
  const [sequences, setSequences] = useState(() => {
    try { 
      const saved = localStorage.getItem(`liasseCounterSequences_${denomination}`);
      return saved ? JSON.parse(saved) : []; 
    }
    catch { 
      return []; 
    }
  });

  // State for completed liasses
  const [completedLiasses, setCompletedLiasses] = useState(() => {
    try { 
      const saved = localStorage.getItem(`liasseCounterCompleted_${denomination}`);
      return saved ? JSON.parse(saved) : []; 
    }
    catch { 
      return []; 
    }
  });

  // State for showing/hiding completed liasses
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [buttonState, setButtonState] = useState('default');
  const timeoutRef = useRef(null);

  // Use external sequences if provided, otherwise use internal state
  useEffect(() => {
    if (isExternal && externalSequences.length > 0) {
      setSequences(externalSequences);
    }
  }, [externalSequences, isExternal]);

  // Reset sequences when denomination changes
  useEffect(() => {
    if (!isExternal) {
      try { 
        const saved = localStorage.getItem(`liasseCounterSequences_${denomination}`);
        setSequences(saved ? JSON.parse(saved) : []);

        const savedCompleted = localStorage.getItem(`liasseCounterCompleted_${denomination}`);
        setCompletedLiasses(savedCompleted ? JSON.parse(savedCompleted) : []);
      }
      catch { 
        setSequences([]); 
        setCompletedLiasses([]);
      }
    }
    // Reset input when denomination changes
    setCurrentInput('');
    setButtonState('default');
    setShowCompleted(false);
  }, [denomination, isExternal]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  // Save to localStorage with denomination-specific key (only if not external)
  useEffect(() => {
    if (!isExternal) {
      try { 
        localStorage.setItem(`liasseCounterSequences_${denomination}`, JSON.stringify(sequences)); 
      } catch {}
    }
  }, [sequences, denomination, isExternal]);

  // Save completed liasses to localStorage (only if not external)
  useEffect(() => {
    if (!isExternal) {
      try { 
        localStorage.setItem(`liasseCounterCompleted_${denomination}`, JSON.stringify(completedLiasses)); 
      } catch {}
    }
  }, [completedLiasses, denomination, isExternal]);

  const resetButtonState = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setButtonState('default'), 2000);
  };

  const addSequence = () => {
    if (isExternal) return; // Cannot add sequences in external mode
    
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

  const removeSequence = (i) => {
    if (isExternal) return; // Cannot remove sequences in external mode
    setSequences(prev => prev.filter((_, j) => j !== i));
  };

  const resetAll = () => {
    if (isExternal) return; // Cannot reset in external mode
    
    if (window.confirm('Êtes-vous sûr de vouloir tout réinitialiser ?')) {
      setSequences([]);
      setCompletedLiasses([]);
      setCurrentInput('');
    }
  };

  const completeLiasse = (liasse) => {
    if (isExternal) return; // Cannot modify in external mode
    
    setCompletedLiasses(prev => [liasse, ...prev]);
    // Remove the used amounts from sequences
    const newSequences = [...sequences];
    liasse.steps.forEach(step => {
      const index = step.sequenceNum - 1;
      if (newSequences[index] !== undefined) {
        newSequences[index] = step.remaining;
      }
    });
    // Filter out sequences that are now 0
    setSequences(newSequences.filter(amount => amount > 0));
  };

  const undoCompleteLiasse = (liasse) => {
    if (isExternal) return; // Cannot modify in external mode
    
    // Remove from completed
    setCompletedLiasses(prev => prev.filter(l => l.timestamp !== liasse.timestamp));

    // Restore the amounts to sequences
    const newSequences = [...sequences];
    liasse.steps.forEach(step => {
      const index = step.sequenceNum - 1;
      if (newSequences[index] !== undefined) {
        newSequences[index] += step.take;
      } else {
        // If the sequence was completely used up, add it back
        while (newSequences.length < step.sequenceNum) {
          newSequences.push(0);
        }
        newSequences[step.sequenceNum - 1] = step.take;
      }
    });
    setSequences(newSequences.filter(amount => amount > 0));
  };

  const total = sequences.reduce((s, v) => s + v, 0);
  const liasseInfo = { complete: Math.floor(total / 100), remaining: total % 100 };
  const instructions = getInstructions(sequences);

  const getButtonConfig = () => {
    if (isExternal) {
      return { icon: null, text: 'Lecture seule', bgColor: 'bg-slate-300', hoverColor: '', textColor: 'text-slate-500', disabled: true };
    }
    
    const val = parseInt(currentInput);
    if (currentInput === '' || val === 0 || isNaN(val)) {
      return { icon: Plus, text: 'Ajouter', bgColor: 'bg-slate-300', hoverColor: '', textColor: 'text-slate-500', disabled: true };
    }
    return {
      default: { icon: Plus,  text: 'Ajouter',  bgColor: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600 active:bg-emerald-700', textColor: 'text-white', disabled: false },
      loading: { icon: null,  text: 'Ajout...',  bgColor: 'bg-emerald-500', hoverColor: '', textColor: 'text-white', disabled: true },
      success: { icon: Check, text: 'Ajouté !', bgColor: 'bg-emerald-600', hoverColor: '', textColor: 'text-white', disabled: true },
      error:   { icon: X,    text: 'Invalide',  bgColor: 'bg-red-500',     hoverColor: '', textColor: 'text-white', disabled: true },
    }[buttonState];
  };
  const bc = getButtonConfig();

  // Format amount in Gourdes
  const formatGourdes = (amount) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * denomination);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6 px-2 sm:px-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">Compteur de Liasses</h1>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <DollarSign size={16} />
              <span>{denomination} Gdes</span>
            </div>
            {isExternal && (
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                Dépôts
              </div>
            )}
          </div>
          <p className="text-xs sm:text-base text-slate-600">
            {isExternal 
              ? `Liasses à partir des dépôts (${denomination} Gdes)`
              : `Calculez vos liasses de ${denomination} Gourdes (100 billets = 1 liasse)`
            }
          </p>
        </div>
        {(sequences.length > 0 || completedLiasses.length > 0) && !isExternal && (
          <button 
            onClick={resetAll} 
            className="bg-white text-red-600 hover:bg-red-50 active:bg-red-100 border border-red-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium shadow-sm w-full sm:w-auto"
          >
            <RotateCcw size={16} /><span>Tout réinitialiser</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6 border border-slate-200">
        {/* Stats with Gourdes values */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {[
            { 
              label: 'Total Billets', 
              value: total, 
              gdesValue: total * denomination,
              from: 'from-slate-50', 
              to: 'to-slate-100', 
              border: 'border-slate-200', 
              lc: 'text-slate-600', 
              vc: 'text-slate-900' 
            },
            { 
              label: 'Liasses', 
              value: liasseInfo.complete,
              gdesValue: liasseInfo.complete * 100 * denomination,
              from: 'from-emerald-50', 
              to: 'to-emerald-100', 
              border: 'border-emerald-200', 
              lc: 'text-emerald-700', 
              vc: 'text-emerald-900' 
            },
            { 
              label: 'Reste', 
              value: liasseInfo.remaining,
              gdesValue: liasseInfo.remaining * denomination,
              from: 'from-amber-50', 
              to: 'to-amber-100', 
              border: 'border-amber-200', 
              lc: 'text-amber-700', 
              vc: 'text-amber-900' 
            },
          ].map(({ label, value, gdesValue, from, to, border, lc, vc }) => (
            <div key={label} className={`bg-gradient-to-br ${from} ${to} rounded-lg sm:rounded-xl p-2 sm:p-4 border ${border}`}>
              <div className={`text-[10px] sm:text-xs ${lc} font-medium mb-0.5 sm:mb-1`}>{label}</div>
              <div className={`text-lg sm:text-2xl font-bold ${vc}`}>{value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-1">
                {formatGourdes(gdesValue/denomination).replace('HTG', '')} Gdes
              </div>
            </div>
          ))}
        </div>

        {/* Input - Only show if not external */}
        {!isExternal && (
          <div className="flex gap-2 mb-4 sm:mb-6">
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
              onKeyPress={(e) => e.key === 'Enter' && addSequence()}
              placeholder={`Nombre de billets de ${denomination} Gdes...`}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all"
            />
            <button
              onClick={addSequence}
              disabled={bc.disabled}
              className={`${bc.bgColor} ${bc.hoverColor} ${bc.textColor} px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm min-w-[120px] disabled:opacity-90 disabled:cursor-not-allowed relative`}
            >
              {buttonState === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <div className={`flex items-center gap-2 ${buttonState === 'loading' ? 'opacity-0' : ''}`}>
                {bc.icon && <bc.icon size={18} />}
                <span>{bc.text}</span>
              </div>
            </button>
          </div>
        )}

        {/* External data notice */}
        {isExternal && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-700">
              <span className="font-semibold">Mode lecture seule :</span> Les séquences proviennent des dépôts.
              Pour modifier, utilisez la section Dépôts.
            </p>
          </div>
        )}

        {/* Sequences */}
        {sequences.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Séquences ({sequences.length})
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500">
                {isExternal ? 'Depuis les dépôts' : 'Sauvegardé automatiquement'} • {denomination} Gdes
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {sequences.map((count, idx) => (
                <div key={idx} className="bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-slate-200 transition-colors group">
                  <span className="text-[10px] sm:text-sm font-medium text-slate-700">#{idx + 1}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{count}</span>
                  <span className="text-[8px] sm:text-xs text-slate-500">
                    ({count * denomination} Gdes)
                  </span>
                  {!isExternal && (
                    <button onClick={() => removeSequence(idx)} className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Instructions - with Complete button */}
        {instructions.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wide">
              Liasses à compléter
            </div>
            <div className="space-y-2 sm:space-y-3">
              {instructions.map((inst) => (
                <div key={inst.liasseNum} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${inst.isComplete ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Liasse {inst.liasseNum}</span>
                      <span className={`text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium text-white ${inst.isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {inst.isComplete ? 'Complète' : 'Incomplète'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{inst.total}/100</span>
                      {inst.isComplete && !isExternal && (
                        <button
                          onClick={() => completeLiasse(inst)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Marquer comme complétée"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {inst.steps.map((step, idx) => (
                      <div key={idx} className={`text-[11px] sm:text-sm rounded-lg p-2 border ${idx === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white/70 border-slate-200'}`}>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mr-1.5">Ancre</span>
                        )}
                        <span className="font-semibold text-slate-800">Séq. #{step.sequenceNum}:</span>{' '}
                        Prenez <span className="font-bold text-emerald-700">{step.take}</span> billet{step.take > 1 ? 's' : ''} sur {step.from}
                        {step.remaining > 0
                          ? <span className="text-amber-700 font-semibold"> → reste {step.remaining}</span>
                          : <span className="text-slate-400"> ✓</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Liasses Section */}
        {completedLiasses.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Liasses complétées
                </span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {completedLiasses.length}
                </span>
              </div>
              {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showCompleted && (
              <div className="mt-3 space-y-2">
                {completedLiasses.map((liasse) => (
                  <div key={liasse.timestamp} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Liasse {liasse.liasseNum}</span>
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full">
                          Complétée
                        </span>
                      </div>
                      {!isExternal && (
                        <button
                          onClick={() => undoCompleteLiasse(liasse)}
                          className="text-amber-600 hover:text-amber-700 p-1 hover:bg-amber-50 rounded transition-colors"
                          title="Annuler"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-600">
                      {liasse.total} billets • {formatGourdes(liasse.total).replace('HTG', '')} Gdes
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(liasse.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {sequences.length === 0 && completedLiasses.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-slate-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-slate-500">
              {isExternal 
                ? "Aucune séquence trouvée dans les dépôts"
                : `Ajoutez des séquences de billets de ${denomination} Gourdes`
              }
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Une liasse = 100 billets ({100 * denomination} Gdes)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}