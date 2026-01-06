import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, Layers, Target, Coins } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const CaisseRecuCard = ({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132
}) => {
  const [cashRecu, setCashRecu] = useState('');
  const cashRecuValue = parseFloat(cashRecu) || 0;
  const changeNeeded = cashRecuValue - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Common Haitian Gourde denominations (in HTG)
  const denominations = [1000, 500, 250, 100, 50, 25, 10, 5, 1];
  
  // Function to calculate change breakdown
  const calculateChangeBreakdown = (amount) => {
    let remaining = Math.round(amount); // Round to avoid floating point issues
    const breakdown = [];
    
    for (const denom of denominations) {
      if (remaining >= denom) {
        const count = Math.floor(remaining / denom);
        remaining -= count * denom;
        
        if (count > 0) {
          breakdown.push({
            denomination: denom,
            count: count,
            total: count * denom
          });
        }
      }
    }
    
    return breakdown;
  };

  // Get multiple optimal breakdowns (different combinations)
  const getChangeBreakdowns = (amount) => {
    const baseBreakdown = calculateChangeBreakdown(amount);
    const breakdowns = [baseBreakdown];
    
    // Generate alternative breakdowns for larger amounts
    if (amount >= 1000) {
      // Alternative 1: Prefer 500 HTG notes when possible
      let altAmount = amount;
      const altBreakdown = [];
      
      // Count 1000 HTG notes
      const thousandCount = Math.floor(altAmount / 1000);
      altAmount -= thousandCount * 1000;
      
      // Convert some 1000s to 500s if possible
      if (thousandCount > 0) {
        const thousandsToConvert = Math.min(thousandCount, Math.floor(altAmount / 500));
        if (thousandsToConvert > 0) {
          altBreakdown.push({
            denomination: 500,
            count: thousandsToConvert * 2,
            total: thousandsToConvert * 1000
          });
          altAmount += thousandsToConvert * 500; // Add back the 500 portion
        }
        
        // Add remaining 1000s
        if (thousandCount - thousandsToConvert > 0) {
          altBreakdown.push({
            denomination: 1000,
            count: thousandCount - thousandsToConvert,
            total: (thousandCount - thousandsToConvert) * 1000
          });
        }
      }
      
      // Add remaining amount using standard breakdown
      const remainingBreakdown = calculateChangeBreakdown(altAmount);
      const combinedBreakdown = [...altBreakdown, ...remainingBreakdown]
        .sort((a, b) => b.denomination - a.denomination);
      
      if (combinedBreakdown.length > 0 && JSON.stringify(combinedBreakdown) !== JSON.stringify(baseBreakdown)) {
        breakdowns.push(combinedBreakdown);
      }
    }
    
    return breakdowns;
  };

  const changeBreakdowns = shouldGiveChange ? getChangeBreakdowns(changeNeeded) : [];

  const formatDepositDisplay = (depot) => {
    if (!depot) return '';

    if (typeof depot === 'object' && depot.devise === 'USD') {
      const montantUSD = parseFloat(depot.montant) || 0;
      const montantHTG = montantUSD * tauxUSD;
      return `${montantUSD} USD (${formaterArgent(montantHTG)} HTG)`;
    } else {
      const montantHTG = parseFloat(depot) || 0;
      return `${formaterArgent(montantHTG)} HTG`;
    }
  };

  const depositBreakdown = sellerDeposits.map((depot, index) => ({
    id: index + 1,
    display: formatDepositDisplay(depot),
    isUSD: typeof depot === 'object' && depot.devise === 'USD'
  }));

  return (
    <div className={`rounded-xl p-3 shadow-lg mb-3 ${
      isPropane 
        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
    } text-white`}>
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          {isPropane ? <Receipt size={14} /> : <Wallet size={14} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">CAISSE REÇUE</p>
          <p className="text-[10px] opacity-80">
            {isPropane ? 'Argent reçu pour propane' : 'Argent donné par le vendeur'}
          </p>
        </div>
        {vendeurActuel && (
          <div className="text-right">
            <p className="text-[10px] opacity-80">Vendeur</p>
            <p className="text-xs font-bold truncate max-w-[80px]">{vendeurActuel}</p>
          </div>
        )}
      </div>

      {/* Total Deposits Row - Standalone above deposits */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Layers size={12} className="text-white opacity-90" />
              <p className="text-xs opacity-90">Total Dépôts:</p>
            </div>
            <p className="text-sm font-bold">{formaterArgent(totalDeposits)} HTG</p>
          </div>
        </div>
      )}

      {/* Deposits Breakdown Card */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 space-y-1">
          <div className="flex items-center gap-1 mb-1">
            <Calculator size={12} className="text-white opacity-90" />
            <p className="text-xs opacity-90">Détail des dépôts:</p>
          </div>

          {/* Deposit breakdown */}
          <div className="space-y-1">
            {depositBreakdown.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    deposit.isUSD ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="opacity-80">Dépôt {deposit.id}:</span>
                </div>
                <span className="font-medium opacity-90 text-right text-[11px]">{deposit.display}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espèces Attendues Row - Standalone below deposits */}
      <div className={`rounded-lg p-2 mb-2 ${
        especesAttendues > 0 
          ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30' 
          : especesAttendues < 0 
          ? 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30'
          : 'bg-white bg-opacity-10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Target size={12} className={
              especesAttendues > 0 
                ? 'text-green-300' 
                : especesAttendues < 0 
                ? 'text-red-300'
                : 'text-white opacity-90'
            } />
            <p className="text-xs opacity-90">Espèces attendues:</p>
          </div>
          <p className={`text-sm font-bold ${
            especesAttendues > 0 
              ? 'text-green-300' 
              : especesAttendues < 0 
              ? 'text-red-300'
              : 'text-white'
          }`}>
            {formaterArgent(especesAttendues)} HTG
          </p>
        </div>
      </div>

      {/* Input field for cash received */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-white font-bold text-xs">HTG</span>
        </div>
        <input
          type="number"
          value={cashRecu}
          onChange={(e) => setCashRecu(e.target.value)}
          placeholder="0.00"
          className="w-full pl-12 pr-3 py-2.5 text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
        />
      </div>

      {/* Change calculation with breakdown */}
      {cashRecu && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-2">
          {/* Change summary */}
          <div className={`flex items-center justify-between pb-1.5 border-b border-white border-opacity-20 ${
            shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
          }`}>
            <div className="flex items-center gap-1">
              {shouldGiveChange ? (
                <TrendingUp size={12} />
              ) : isShort ? (
                <TrendingDown size={12} />
              ) : (
                <DollarSign size={12} />
              )}
              <p className="text-xs font-bold">
                {shouldGiveChange ? 'À rendre:' : isShort ? 'Manquant:' : 'Exact'}
              </p>
            </div>
            <p className={`text-sm font-bold ${
              shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'
            }`}>
              {formaterArgent(Math.abs(changeNeeded))} HTG
            </p>
          </div>

          {/* Change breakdown for giving change */}
          {shouldGiveChange && changeBreakdowns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 mt-1">
                <Coins size={10} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Suggestions de monnaie:</p>
              </div>
              
              {changeBreakdowns.map((breakdown, index) => (
                <div key={index} className="bg-green-500 bg-opacity-10 rounded p-2 border border-green-400 border-opacity-20">
                  {index === 0 && (
                    <p className="text-[10px] text-green-300 opacity-90 mb-1 text-center">
                      Option {index + 1} (recommandée)
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-1">
                    {breakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span className="opacity-90">
                            {item.count} × {formaterArgent(item.denomination)}
                          </span>
                        </div>
                        <span className="font-bold text-green-300">
                          {formaterArgent(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 pt-1 border-t border-green-400 border-opacity-20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-90">Total:</span>
                      <span className="font-bold text-green-300">
                        {formaterArgent(breakdown.reduce((sum, item) => sum + item.total, 0))} HTG
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-[9px] text-center opacity-70 text-green-300 mt-1">
                Sélectionnez l'option la plus pratique selon vos billets disponibles
              </p>
            </div>
          )}

          {/* Messages for other cases */}
          {!shouldGiveChange && (
            <div className="text-center pt-1">
              {isShort ? (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-red-300">Doit donner plus d'argent</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Manque {formaterArgent(Math.abs(changeNeeded))} HTG
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] opacity-80 mt-0.5 text-emerald-300">Montant exact</p>
                  <p className="text-[9px] opacity-60 mt-0.5">
                    Aucune monnaie à rendre
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add some custom styles for better mobile experience */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default CaisseRecuCard;