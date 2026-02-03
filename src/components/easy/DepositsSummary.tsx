import React from 'react';
import { Check, Edit2, Trash2, Clock, Currency } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const DepositsSummary = ({
  vendeur,
  depots,
  isRecentlyAdded,
  getMontantHTG,
  isUSDDepot,
  getOriginalDepotAmount,
  getDepositDisplay,
  onEditDeposit,
  onDeleteDeposit,
  editingDeposit,
  isEditingThisDeposit,
  exchangeRate = 132
}) => {
  if (!depots || depots.length === 0) return null;

  // Safe formatter function with error handling
  const safeFormatArgent = (amount) => {
    try {
      if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
      }
      return formaterArgent(amount);
    } catch (error) {
      console.error('Formatting error:', error);
      return '0';
    }
  };

  // Helper function to format timestamp as "12:34 AM"
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      if (typeof timestamp === 'string') {
        const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          return `${displayHours}:${minutes} ${ampm}`;
        }
        
        const hMatch = timestamp.match(/(\d{1,2})h(\d{2})/);
        if (hMatch) {
          const hours = parseInt(hMatch[1]);
          const minutes = hMatch[2];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          return `${displayHours}:${minutes} ${ampm}`;
        }
        
        const ampmMatch = timestamp.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (ampmMatch) {
          return timestamp;
        }
      }
      
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      
      return timestamp;
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return '';
    }
  };

  // Helper function to get multiplier display
  const getMultiplierDisplay = (multiplier, singleValue, currency) => {
    if (multiplier > 1) {
      if (currency === 'HTG' && singleValue >= 250) {
        return `${multiplier} billets de ${safeFormatArgent(singleValue)} ${currency}`;
      } else if (currency === 'USD') {
        return `${multiplier} billets de ${singleValue} ${currency}`;
      }
      return `${multiplier} pièces de ${safeFormatArgent(singleValue)} ${currency}`;
    }
    return null;
  };

  // Parse breakdown and create sorted list items with totals
  const renderBreakdown = (depot) => {
    if (!depot || typeof depot !== 'object') return null;

    const breakdown = depot.breakdown;
    if (!breakdown || typeof breakdown !== 'string') return null;

    const parsedSequences = breakdown.split(',').map(item => {
      const trimmed = item.trim();
      if (!trimmed) return null;

      let numericValue = 0;
      let displayTotal = '';
      let multiplier = 1;
      let value = 0;
      let currency = '';
      let displayText = trimmed;

      try {
        const multiplierMatch = trimmed.match(/(\d+)\s*×\s*(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
        if (multiplierMatch) {
          [, multiplier, value, currency] = multiplierMatch;
          const total = parseFloat(multiplier) * parseFloat(value);
          numericValue = total;
          displayTotal = `${safeFormatArgent(total)} ${currency}`;
          const multiplierDisplay = getMultiplierDisplay(parseFloat(multiplier), parseFloat(value), currency.toUpperCase());
          displayText = multiplierDisplay || trimmed;
        } 
        else {
          const valueMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(USD|HTG)/i);
          if (valueMatch) {
            [, value, currency] = valueMatch;
            numericValue = parseFloat(value) || 0;
            displayTotal = `${safeFormatArgent(numericValue)} ${currency}`;
            displayText = trimmed;
          } else {
            return {
              text: trimmed,
              displayText: trimmed,
              value: 0,
              displayTotal: trimmed,
              isUSD: false,
              multiplier: 1,
              singleValue: 0,
              currency: ''
            };
          }
        }

        return {
          text: trimmed,
          displayText: displayText,
          value: numericValue,
          displayTotal: displayTotal,
          isUSD: /USD/i.test(trimmed),
          multiplier: parseFloat(multiplier) || 1,
          singleValue: parseFloat(value) || 0,
          currency: currency.toUpperCase()
        };
      } catch (error) {
        return {
          text: trimmed,
          displayText: trimmed,
          value: 0,
          displayTotal: trimmed,
          isUSD: false,
          multiplier: 1,
          singleValue: 0,
          currency: ''
        };
      }
    }).filter(item => item !== null);

    const validSequences = parsedSequences.filter(seq => 
      seq && typeof seq === 'object' && seq.text
    );

    if (validSequences.length === 0) return null;

    const sortedSequences = [...validSequences].sort((a, b) => b.value - a.value);
    const sequencesTotal = sortedSequences.reduce((sum, seq) => sum + (seq.value || 0), 0);

    const convertUSDToHTG = (usdAmount) => {
      const amount = parseFloat(usdAmount) || 0;
      return amount * exchangeRate;
    };

    return (
      <div className="mt-4">
        {/* Breakdown Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Composition
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: <span className="font-semibold text-gray-800 dark:text-gray-200">{safeFormatArgent(sequencesTotal)}</span>
          </div>
        </div>

        {/* Sequence Cards */}
        <div className="space-y-2">
          {sortedSequences.map((seq, idx) => {
            const htgValue = seq.isUSD ? convertUSDToHTG(seq.value) : 0;
            const htgPerUnit = seq.isUSD ? convertUSDToHTG(seq.singleValue) : 0;

            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3"
              >
                {/* Sequence Content */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Currency Icon */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${seq.isUSD 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }
                    `}>
                      <Currency size={18} />
                    </div>

                    {/* Sequence Details */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {seq.displayText}
                      </div>
                      {seq.multiplier > 1 && seq.singleValue > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {seq.multiplier} × {seq.singleValue} {seq.currency}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {seq.displayTotal}
                    </div>
                  </div>
                </div>

                {/* HTG Conversion for USD */}
                {seq.isUSD && htgValue > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">En Gourdes:</span>
                      </div>
                      <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {safeFormatArgent(htgValue)} HTG
                      </div>
                    </div>
                    {seq.multiplier > 1 && seq.singleValue > 0 && htgPerUnit > 0 && (
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{seq.multiplier} × {safeFormatArgent(htgPerUnit)} gourdes</span>
                        <span>Taux: 1 USD = {exchangeRate} HTG</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to get display text without breakdown
  const getDisplayTextWithoutBreakdown = (depot) => {
    if (!depot) return '';
    try {
      if (typeof depot === 'object') {
        if (depot.devise === 'USD') {
          const amount = parseFloat(depot.montant) || 0;
          return `${amount} USD`;
        } else if (depot.value) {
          const amount = parseFloat(depot.value) || 0;
          return `${safeFormatArgent(amount)} HTG`;
        }
      }
      const amount = parseFloat(depot) || 0;
      return `${safeFormatArgent(amount)} HTG`;
    } catch (error) {
      return '';
    }
  };

  // Helper function to get timestamp from deposit
  const getDepositTimestamp = (depot) => {
    if (!depot || typeof depot !== 'object') return null;
    
    const timestamp = depot.timestamp || depot.createdAt || depot.date || depot.time;
    
    if (!timestamp && depot.sequences && Array.isArray(depot.sequences) && depot.sequences.length > 0) {
      return depot.sequences[0].timestamp;
    }
    
    return timestamp;
  };

  // Helper function to get total value for sorting deposits
  const getDepositValue = (depot) => {
    if (!depot) return 0;
    try {
      if (typeof depot === 'object') {
        if (depot.devise === 'USD') {
          return parseFloat(depot.montant) || 0;
        } else if (depot.value) {
          return parseFloat(depot.value) || 0;
        }
      }
      return parseFloat(depot) || 0;
    } catch (error) {
      return 0;
    }
  };

  // Calculate total HTG from USD deposits
  const calculateTotalHTGFromUSD = () => {
    let totalHTG = 0;
    let hasUSDDeposits = false;

    depots.forEach(depot => {
      const isUSD = isUSDDepot?.(depot) || false;
      if (isUSD) {
        const usdAmount = getDepositValue(depot);
        totalHTG += (usdAmount * exchangeRate);
        hasUSDDeposits = true;
      }
    });

    return { totalHTG, hasUSDDeposits };
  };

  const { totalHTG, hasUSDDeposits } = calculateTotalHTGFromUSD();

  // Sort deposits by value (largest first)
  const sortedDepots = [...(depots || [])].sort((a, b) => {
    const valueA = getDepositValue(a);
    const valueB = getDepositValue(b);
    return valueB - valueA;
  });

  if (typeof formaterArgent !== 'function') {
    return (
      <div className="p-4">
        <div className="text-red-500 text-sm">
          Erreur: La fonction de formatage n'est pas disponible
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dépôts individuels
            </h2>
          </div>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
            {depots.length} dépôt{depots.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
          Gestion des dépôts individuels du vendeur
        </p>
      </div>

      {/* Deposit Cards */}
      <div className="space-y-4">
        {sortedDepots.map((depot, idx) => {
          const originalIndex = depots.indexOf(depot);
          const isUSD = isUSDDepot?.(depot) || false;
          const displayText = getDisplayTextWithoutBreakdown(depot);
          const isRecent = isRecentlyAdded?.(vendeur, originalIndex) || false;
          const hasBreakdown = depot && typeof depot === 'object' && depot.breakdown;
          const isEditing = isEditingThisDeposit?.(vendeur, originalIndex) || false;
          const timestamp = getDepositTimestamp(depot);
          const formattedTime = formatTimestamp(timestamp);

          return (
            <div 
              key={originalIndex}
              className={`
                bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200
                ${isEditing 
                  ? 'border-amber-400 shadow-md' 
                  : isUSD 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-gray-200 dark:border-gray-700'
                }
                ${isRecent && !isEditing ? 'ring-2 ring-green-500/20' : ''}
                hover:shadow-md
              `}
            >
              <div className="p-4">
                {/* Deposit Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Deposit Number */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0
                      ${isUSD 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      }
                      ${isRecent ? 'animate-pulse' : ''}
                    `}>
                      #{originalIndex + 1}
                    </div>

                    {/* Deposit Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`
                          text-xl font-bold truncate
                          ${isUSD ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}
                        `}>
                          {displayText}
                        </div>
                        {isRecent && !isEditing && (
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Check size={12} className="text-green-600 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      {formattedTime && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={14} />
                          {formattedTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditDeposit?.(vendeur, originalIndex)}
                      className={`
                        p-2 rounded-lg transition-colors
                        ${isEditing
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                      `}
                      title="Éditer ce dépôt"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteDeposit?.(vendeur, originalIndex)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Supprimer ce dépôt"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Breakdown */}
                {hasBreakdown && renderBreakdown(depot)}

                {/* Total Conversion for USD Deposits */}
                {isUSD && hasUSDDeposits && idx === sortedDepots.findIndex(d => isUSDDepot?.(d)) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total en Gourdes:
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                          {safeFormatArgent(totalHTG)} HTG
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepositsSummary;