import React, { useState } from 'react';
import { X, DollarSign, Calculator, CheckCircle } from 'lucide-react';

const PartialPaymentModal = ({ short, onClose, onSave }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amount = parseFloat(paymentAmount);
    const remainingBalance = short.remainingBalance || short.shortAmount;
    
    const newErrors = {};
    
    if (!paymentAmount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Montant invalide';
    }
    
    if (amount > remainingBalance) {
      newErrors.amount = `Le montant ne peut pas dépasser ${remainingBalance.toFixed(3)} HTG`;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(short.id, amount, paymentNotes || 'Paiement partiel');
    onClose();
  };

  const remainingBalance = short.remainingBalance || short.shortAmount;
  const totalPaid = short.shortAmount - remainingBalance;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-black" />
            <h3 className="text-lg font-bold text-black">Paiement Partiel</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Déficit total:</span>
              <span className="text-sm font-bold text-red-600">
                {short.shortAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3
                })} HTG
              </span>
            </div>
            
            {totalPaid > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Déjà payé:</span>
                <span className="text-sm font-bold text-green-600">
                  {totalPaid.toLocaleString('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                  })} HTG
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Reste à payer:</span>
              <span className="text-lg font-bold text-orange-600">
                {remainingBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3
                })} HTG
              </span>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant du paiement (HTG)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                className={`w-full p-2 pr-10 border rounded-lg ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Maximum: ${remainingBalance.toFixed(3)}`}
                autoFocus
              />
              <span className="absolute right-3 top-2.5 text-gray-500">HTG</span>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[1000, 5000, 10000, 500, 2000, remainingBalance].map((amount) => {
              const displayAmount = amount === remainingBalance ? 'Solde complet' : amount;
              const isFullBalance = amount === remainingBalance;
              
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setPaymentAmount(isFullBalance ? remainingBalance.toFixed(3) : amount.toString())}
                  className={`p-2 rounded-lg border text-xs font-medium ${
                    isFullBalance
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500'
                  }`}
                >
                  {displayAmount.toLocaleString('en-US', {
                    minimumFractionDigits: isFullBalance ? 3 : 0,
                    maximumFractionDigits: isFullBalance ? 3 : 0
                  })}
                  {!isFullBalance && ' HTG'}
                </button>
              );
            })}
          </div>

          {/* Payment Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Ex: Premier acompte, paiement en espèces..."
            />
          </div>

          {/* New Balance Preview */}
          {paymentAmount && !isNaN(parseFloat(paymentAmount)) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Nouveau solde après paiement:</p>
                  <p className="text-lg font-bold text-blue-800">
                    {(remainingBalance - parseFloat(paymentAmount)).toLocaleString('en-US', {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3
                    })} HTG
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Enregistrer paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartialPaymentModal;