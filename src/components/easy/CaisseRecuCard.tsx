import React, { useState, useMemo } from 'react';
import { DollarSign, Calculator, TrendingUp, TrendingDown, Wallet, Receipt, Layers, Target, AlertCircle, Plus, Trash2, Globe } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';
import ChangeCombinations from './ChangeCombinations';

const CaisseRecuCard = ({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currencyType, setCurrencyType] = useState('HTG'); // 'HTG' or 'USD'
  const [cashSequences, setCashSequences] = useState([]);
  
  // Calculate total cash received from all sequences (converted to HTG)
  const totalCashRecuHTG = useMemo(() => {
    return cashSequences.reduce((sum, seq) => {
      if (seq.currency === 'USD') {
        return sum + (parseFloat(seq.amount) * tauxUSD || 0);
      }
      return sum + (parseFloat(seq.amount) || 0);
    }, 0);
  }, [cashSequences, tauxUSD]);

  // Calculate total in original currencies for display
  const totalHTG = useMemo(() => {
    return cashSequences
      .filter(seq => seq.currency === 'HTG')
      .reduce((sum, seq) => sum + (parseFloat(seq.amount) || 0), 0);
  }, [cashSequences]);

  const totalUSD = useMemo(() => {
    return cashSequences
      .filter(seq => seq.currency === 'USD')
      .reduce((sum, seq) => sum + (parseFloat(seq.amount) || 0), 0);
  }, [cashSequences]);

  const changeNeeded = totalCashRecuHTG - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Handle adding a new cash sequence
  const handleAddSequence = () => {
    const amount = parseFloat(inputValue);
    if (!isNaN(amount) && amount > 0) {
      const newSequence = {
        id: Date.now(),
        amount: amount,
        currency: currencyType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount
      };
      setCashSequences(prev => [...prev, newSequence]);
      setInputValue('');
    }
  };

  // Handle removing a sequence
  const handleRemoveSequence = (id) => {
    setCashSequences(prev => prev.filter(seq => seq.id !== id));
  };

  // Handle clearing all sequences
  const handleClearAll = () => {
    setCashSequences([]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle currency toggle
  const handleCurrencyToggle = () => {
    setCurrencyType(prev => prev === 'HTG' ? 'USD' : 'HTG');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSequence();
    }
  };

  // Quick add amounts based on currency
  const getQuickAddAmounts = () => {
    if (currencyType === 'USD') {
      return [1, 5, 10, 20]; // Common USD bills
    }
    return [100, 250, 500, 1000]; // Common HTG bills
  };

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

  // Calculate givable amount and remainder
  const givableAmount = getMaximumGivableAmount(changeNeeded);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

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

      {/* Cash Sequences Section */}
      <div className="mb-3">
        {/* Exchange Rate Info */}
        <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Globe size={12} className="text-blue-300" />
            <p className="text-xs opacity-90">Taux USD:</p>
          </div>
          <p className="text-sm font-bold text-blue-300">1 USD = {tauxUSD} HTG</p>
        </div>

        {/* Total Cash Received Summary */}
        {cashSequences.length > 0 && (
          <div className="bg-green-500 bg-opacity-20 rounded-lg p-2 mb-2 border border-green-400 border-opacity-30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <DollarSign size={12} className="text-green-300" />
                <p className="text-xs font-bold text-green-300">Total reçu:</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-green-300">{formaterArgent(totalCashRecuHTG)} HTG</p>
                <button
                  onClick={handleClearAll}
                  className="p-1 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                  title="Effacer toutes les séquences"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            
            {/* Breakdown by currency */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-blue-500 bg-opacity-10 rounded p-1.5">
                <div className="flex items-center justify-between">
                  <span className="opacity-80">Total HTG:</span>
                  <span className="font-bold text-blue-300">{formaterArgent(totalHTG)} HTG</span>
                </div>
              </div>
              <div className="bg-green-500 bg-opacity-10 rounded p-1.5">
                <div className="flex items-center justify-between">
                  <span className="opacity-80">Total USD:</span>
                  <span className="font-bold text-green-300">
                    {totalUSD.toFixed(2)} USD
                    <span className="text-[9px] opacity-70 ml-1">({formaterArgent(totalUSD * tauxUSD)} HTG)</span>
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] opacity-80 mt-2 text-green-300">
              {cashSequences.length} séquence{cashSequences.length !== 1 ? 's' : ''} ajoutée{cashSequences.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Cash Sequences List */}
        {cashSequences.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-2 mb-2 max-h-32 overflow-y-auto">
            <div className="space-y-1">
              {cashSequences.map((sequence, index) => (
                <div key={sequence.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      sequence.currency === 'USD' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="opacity-80">Séquence {index + 1}:</span>
                    <span className="text-[10px] opacity-60">{sequence.timestamp}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      sequence.currency === 'USD' 
                        ? 'bg-green-500 bg-opacity-20 text-green-300' 
                        : 'bg-blue-500 bg-opacity-20 text-blue-300'
                    }`}>
                      {sequence.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className={`font-medium ${
                        sequence.currency === 'USD' ? 'text-green-300' : 'text-blue-300'
                      }`}>
                        {sequence.currency === 'USD' ? '$' : ''}{sequence.amount} {sequence.currency}
                      </span>
                      {sequence.currency === 'USD' && (
                        <p className="text-[10px] opacity-60">
                          = {formaterArgent(sequence.convertedToHTG)} HTG
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveSequence(sequence.id)}
                      className="p-0.5 hover:bg-red-500 hover:bg-opacity-30 rounded text-red-300 hover:text-red-200 transition-colors"
                      title="Retirer cette séquence"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input field for adding cash sequences */}
        <div className="relative mb-2">
          {/* Currency selector and label */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCurrencyToggle}
                className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                  currencyType === 'HTG' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {currencyType === 'HTG' ? (
                  <>
                    <DollarSign size={10} />
                    HTG
                  </>
                ) : (
                  <>
                    <Globe size={10} />
                    USD
                  </>
                )}
              </button>
              <span className="text-xs opacity-80">
                {currencyType === 'HTG' ? 'Gourdes Haïtiennes' : 'Dollars US'}
              </span>
            </div>
            <span className="text-xs opacity-70">
              Taux: 1 USD = {tauxUSD} HTG
            </span>
          </div>

          {/* Input with Add button */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white font-bold text-xs">
                {currencyType === 'HTG' ? 'HTG' : 'USD'}
              </span>
            </div>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Montant en ${currencyType}...`}
              className="w-full pl-12 pr-20 py-2.5 text-base font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
              <button
                onClick={handleAddSequence}
                disabled={!inputValue || parseFloat(inputValue) <= 0}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                  inputValue && parseFloat(inputValue) > 0
                    ? currencyType === 'HTG' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-400 bg-opacity-30 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                <Plus size={12} />
                Ajouter
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick add buttons */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {getQuickAddAmounts().map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setInputValue(amount.toString());
                // Auto-add after setting value
                setTimeout(() => {
                  const button = document.querySelector('button[type="button"]');
                  if (button) button.click();
                }, 50);
              }}
              className={`px-2 py-1.5 text-xs font-medium rounded border transition-colors ${
                currencyType === 'USD'
                  ? 'bg-green-500 bg-opacity-10 hover:bg-opacity-20 border-green-400 border-opacity-30 text-green-300'
                  : 'bg-blue-500 bg-opacity-10 hover:bg-opacity-20 border-blue-400 border-opacity-30 text-blue-300'
              }`}
            >
              +{amount} {currencyType === 'USD' ? '$' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Change calculation */}
      {cashSequences.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-2 space-y-3">
          {/* Change summary */}
          <div className={`flex items-center justify-between pb-2 border-b border-white border-opacity-20 ${
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

          {/* Warning if has remainder */}
          {shouldGiveChange && hasRemainder && (
            <div className="bg-amber-500 bg-opacity-20 rounded-lg p-2 border border-amber-400 border-opacity-30">
              <div className="flex items-start gap-1.5">
                <AlertCircle size={12} className="text-amber-300 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300 mb-0.5">
                    Note: Reste à abandonner
                  </p>
                  <p className="text-[10px] opacity-90 leading-tight">
                    Avec des billets/monnaie de 5 HTG minimum, on ne peut rendre que {formaterArgent(givableAmount)} HTG.
                    <span className="block mt-0.5 font-bold text-amber-200">
                      Le vendeur doit abandonner: {formaterArgent(remainder)} HTG
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Use the refactored ChangeCombinations component */}
          {shouldGiveChange && (
            <ChangeCombinations 
              changeNeeded={changeNeeded}
              shouldGiveChange={shouldGiveChange}
            />
          )}

          {/* No change needed */}
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

      {/* Instructions */}
      {cashSequences.length === 0 && (
        <div className="bg-white bg-opacity-5 rounded-lg p-2 text-center">
          <p className="text-[10px] opacity-70">
            Entrez les montants séquentiellement en HTG ou USD
          </p>
          <p className="text-[9px] opacity-50 mt-0.5">
            Ex: 500 HTG + 5 USD + 250 HTG = 1,410 HTG total
          </p>
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