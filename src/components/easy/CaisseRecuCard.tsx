import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
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
  // State for cash received and change calculation
  const [cashRecu, setCashRecu] = useState('');

  // Parse cash received value
  const cashRecuValue = parseFloat(cashRecu) || 0;

  // Calculate change based on expected cash vs cash received
  const changeNeeded = cashRecuValue - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Format deposits for display with currency info
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

  // Get deposit breakdown for display
  const depositBreakdown = sellerDeposits.map((depot, index) => ({
    id: index + 1,
    display: formatDepositDisplay(depot),
    isUSD: typeof depot === 'object' && depot.devise === 'USD'
  }));

  return (
    <div className={`rounded-xl p-4 shadow-lg mb-3 ${
      isPropane 
        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
    } text-white`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <DollarSign size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold">CAISSE REÇUE</p>
          <p className="text-[10px] opacity-80">
            {isPropane ? 'Argent reçu pour propane' : 'Argent donné par le vendeur'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Deposits Summary - IMPROVED with currency info */}
        {vendeurActuel && sellerDeposits.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-2 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Calculator size={14} className="text-white" />
                <p className="text-xs opacity-90">Dépôts effectués:</p>
              </div>
              <p className="text-sm font-bold">{formaterArgent(totalDeposits)} HTG</p>
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
                  <span className="font-medium opacity-90">{deposit.display}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-white" />
                  <p className="text-xs opacity-90">Espèces attendues:</p>
                </div>
                <p className={`text-sm font-bold ${especesAttendues > 0 ? 'text-green-300' : especesAttendues < 0 ? 'text-red-300' : 'text-white'}`}>
                  {formaterArgent(especesAttendues)} HTG
                </p>
              </div>
              <p className="text-[10px] opacity-70 mt-1 text-right">
                (Total ajusté {formaterArgent(totalAjustePourCaisse)} HTG - Dépôts {formaterArgent(totalDeposits)} HTG)
              </p>
            </div>
          </div>
        )}

        {/* Input field for cash received */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-white font-bold">HTG</span>
          </div>
          <input
            type="number"
            value={cashRecu}
            onChange={(e) => setCashRecu(e.target.value)}
            placeholder="0.00"
            className="w-full pl-14 pr-4 py-3 text-lg font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
          />
        </div>

        {/* Change calculation */}
        {cashRecu && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calculator size={14} className="text-white" />
                <p className="text-xs opacity-90">Espèces à payer:</p>
              </div>
              <p className="text-sm font-bold">{formaterArgent(especesAttendues)} HTG</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-white" />
                <p className="text-xs opacity-90">Argent reçu:</p>
              </div>
              <p className="text-sm font-bold">{formaterArgent(cashRecuValue)} HTG</p>
            </div>

            {/* Change display */}
            <div className={`pt-2 border-t border-white border-opacity-20 ${shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {shouldGiveChange ? (
                    <TrendingUp size={14} className="text-green-300" />
                  ) : isShort ? (
                    <TrendingDown size={14} className="text-red-300" />
                  ) : (
                    <DollarSign size={14} className="text-white" />
                  )}
                  <p className="text-sm font-bold">
                    {shouldGiveChange ? 'À rendre:' : isShort ? 'Manquant:' : 'Exact'}
                  </p>
                </div>
                <p className={`text-lg font-bold ${shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-white'}`}>
                  {formaterArgent(Math.abs(changeNeeded))} HTG
                </p>
              </div>
              {shouldGiveChange && (
                <p className="text-[10px] opacity-80 mt-1">À donner en monnaie</p>
              )}
              {isShort && (
                <p className="text-[10px] opacity-80 mt-1">Doit donner plus d'argent</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaisseRecuCard;