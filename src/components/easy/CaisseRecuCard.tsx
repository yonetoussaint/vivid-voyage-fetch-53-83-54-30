import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';
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
    <div className={`rounded-2xl p-4 shadow-lg mb-4 ${
      isPropane 
        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
    } text-white`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            {isPropane ? <Receipt size={18} /> : <Wallet size={18} />}
          </div>
          <div>
            <h3 className="font-bold text-base">CAISSE REÇUE</h3>
            <p className="text-xs opacity-90">
              {isPropane ? 'Argent reçu pour propane' : 'Argent donné par le vendeur'}
            </p>
          </div>
        </div>
        {vendeurActuel && (
          <div className="text-right">
            <p className="text-xs opacity-80">Vendeur</p>
            <p className="text-sm font-bold truncate max-w-[120px]">{vendeurActuel}</p>
          </div>
        )}
      </div>

      {/* Deposits Section - Collapsible-like display */}
      {sellerDeposits.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calculator size={16} />
              <span className="text-sm font-medium">Dépôts effectués</span>
            </div>
            <span className="font-bold text-sm">{formaterArgent(totalDeposits)} HTG</span>
          </div>

          <div className="space-y-2">
            {depositBreakdown.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${deposit.isUSD ? 'bg-green-400' : 'bg-blue-400'}`} />
                  <span className="opacity-90">Dépôt {deposit.id}</span>
                </div>
                <span className="font-medium text-right break-all ml-2">{deposit.display}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                <span className="text-sm">Espèces attendues</span>
              </div>
              <span className={`font-bold text-sm ${especesAttendues > 0 ? 'text-green-300' : especesAttendues < 0 ? 'text-red-300' : ''}`}>
                {formaterArgent(especesAttendues)} HTG
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cash Input - Larger touch target */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 opacity-90">
          Argent reçu (HTG)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <DollarSign size={20} className="text-white opacity-70" />
          </div>
          <input
            type="number"
            value={cashRecu}
            onChange={(e) => setCashRecu(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            className="w-full pl-12 pr-4 py-4 text-xl font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-white"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-white font-bold text-sm">HTG</span>
          </div>
        </div>
      </div>

      {/* Change Calculation - Only shows when input has value */}
      {cashRecu && (
        <div className="bg-white bg-opacity-10 rounded-xl p-4 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs opacity-80 mb-1">À payer</p>
              <p className="font-bold text-sm">{formaterArgent(especesAttendues)} HTG</p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">Reçu</p>
              <p className="font-bold text-sm">{formaterArgent(cashRecuValue)} HTG</p>
            </div>
          </div>

          <div className={`pt-3 border-t border-white border-opacity-20 ${shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-emerald-300'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {shouldGiveChange ? (
                  <TrendingUp size={18} />
                ) : isShort ? (
                  <TrendingDown size={18} />
                ) : (
                  <DollarSign size={18} />
                )}
                <span className="font-bold">
                  {shouldGiveChange ? 'À rendre' : isShort ? 'Manquant' : 'Exact'}
                </span>
              </div>
              <span className="text-xl font-bold">
                {formaterArgent(Math.abs(changeNeeded))} HTG
              </span>
            </div>
            <p className="text-xs opacity-90 mt-1">
              {shouldGiveChange ? 'À donner en monnaie' : 
               isShort ? 'Doit donner plus d\'argent' : 
               'Montant exact reçu'}
            </p>
          </div>
        </div>
      )}

      {/* Add some custom styles for better mobile experience */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
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