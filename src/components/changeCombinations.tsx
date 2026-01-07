import React, { useMemo } from 'react';
import { Sparkles, Coins, AlertCircle } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';

const ChangeCombinations = ({ 
  changeNeeded, 
  shouldGiveChange 
}) => {
  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;

  // Generate combinations
  const combinations = useMemo(() => {
    if (!shouldGiveChange || changeNeeded <= 0) return [];
    return generateChangeCombinations(changeNeeded);
  }, [changeNeeded, shouldGiveChange]);

  if (!shouldGiveChange || combinations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 mb-2">
        <Sparkles size={10} className="text-green-300" />
        <p className="text-xs font-bold text-green-300">4 Combinaisons différentes:</p>
      </div>

      {/* Denomination info */}
      <div className="bg-blue-500 bg-opacity-10 rounded p-1.5 border border-blue-400 border-opacity-20 mb-2">
        <p className="text-[9px] text-center text-blue-300">
          Plus petit billet/monnaie = 5 HTG • Montant utilisable: {formaterArgent(givableAmount)} HTG
        </p>
      </div>

      {/* Single column of 4 truly different combinations */}
      <div className="space-y-2">
        {combinations.map((combo, index) => (
          <div 
            key={combo.key} 
            className={`rounded-lg p-2 border ${
              index === 0 
                ? 'border-green-400 border-opacity-40 bg-green-500 bg-opacity-15 shadow-sm' 
                : index === 1
                ? 'border-blue-400 border-opacity-40 bg-blue-500 bg-opacity-10'
                : index === 2
                ? 'border-purple-400 border-opacity-40 bg-purple-500 bg-opacity-10'
                : 'border-amber-400 border-opacity-40 bg-amber-500 bg-opacity-10'
            }`}
          >
            {/* Option header with strategy name and description */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-blue-400' :
                    index === 2 ? 'bg-purple-400' : 'bg-amber-400'
                  }`}></div>
                  <p className="text-xs font-bold text-green-300">
                    Option {index + 1}: {combo.strategyName}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={10} className="text-green-300 opacity-70" />
                  <span className="text-[10px] opacity-80">
                    {combo.totalNotes} pièce{combo.totalNotes !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <p className="text-[9px] opacity-80 ml-4">
                {combo.description}
              </p>
            </div>

            {/* Complete breakdown */}
            {combo.breakdown.length > 0 ? (
              <>
                <div className="space-y-1.5 mb-2">
                  {combo.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.denomination >= 500 ? 'bg-green-500' : 
                          item.denomination >= 100 ? 'bg-green-400' : 
                          'bg-green-300'
                        }`}></div>
                        <span className="text-xs opacity-90">
                          {item.count} × {formaterArgent(item.denomination)} HTG
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium opacity-70">=</span>
                        <span className="text-xs font-bold text-green-300">
                          {formaterArgent(item.total)} HTG
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and remainder info */}
                <div className="pt-2 border-t border-white border-opacity-20">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-bold text-green-300">Total donné:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-green-300">
                          {formaterArgent(combo.totalAmount)}
                        </span>
                        <span className="text-[10px] opacity-70">HTG</span>
                      </div>
                    </div>

                    {/* Show remainder if any */}
                    {combo.remainder > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-amber-400 border-opacity-20">
                        <div className="flex items-center gap-1">
                          <AlertCircle size={10} className="text-amber-300" />
                          <span className="text-[10px] text-amber-300">Reste abandonné:</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300">
                          {formaterArgent(combo.remainder)} HTG
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Show empty state for amounts < 5 HTG
              <div className="text-center py-3">
                <p className="text-xs text-amber-300 font-bold mb-1">
                  {combo.strategyName}
                </p>
                <p className="text-[10px] opacity-80">
                  Le montant est inférieur à 5 HTG
                </p>
                <div className="mt-2 pt-2 border-t border-amber-400 border-opacity-20">
                  <p className="text-[10px] font-bold text-amber-300">
                    Total abandonné: {formaterArgent(combo.remainder)} HTG
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strategy comparison */}
      <div className="bg-green-500 bg-opacity-5 rounded p-2 border border-green-400 border-opacity-10">
        <div className="flex items-center gap-1 mb-1">
          <Sparkles size={9} className="text-green-300" />
          <p className="text-[10px] font-bold text-green-300">Comparaison des stratégies:</p>
        </div>
        <div className="space-y-1 text-[9px]">
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-0.5"></div>
            <span className="opacity-80"><span className="font-bold">Option 1:</span> Moins de billets au total (recommandé)</span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5"></div>
            <span className="opacity-80"><span className="font-bold">Option 2:</span> Plus de billets de 500 HTG, moins de 1000 HTG</span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5"></div>
            <span className="opacity-80"><span className="font-bold">Option 3:</span> Plus de petits et moyens billets</span>
          </div>
          <div className="flex items-start gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></div>
            <span className="opacity-80"><span className="font-bold">Option 4:</span> Répartition équilibrée entre tailles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCombinations;