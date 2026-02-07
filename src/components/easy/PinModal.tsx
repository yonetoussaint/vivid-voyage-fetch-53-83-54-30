import React from 'react';
import { Lock } from 'lucide-react';

const PinModal = ({
  currentAction,
  pin,
  setPin,
  pinError,
  activePinIndex,
  setActivePinIndex,
  onClose,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-black">Code PIN Gérant</h3>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Entrez votre code PIN pour {currentAction === 'payrollPayment' ? 'déduire du salaire' : 'annuler le paiement'}
          </p>

          <div className="flex justify-center gap-3 mb-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newPin = [...pin];
                  newPin[index] = e.target.value;
                  setPin(newPin);
                  if (e.target.value && index < 3) {
                    setActivePinIndex(index + 1);
                  }
                }}
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                autoFocus={index === activePinIndex}
              />
            ))}
          </div>

          {pinError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
              <p className="text-sm text-red-700 text-center">{pinError}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;