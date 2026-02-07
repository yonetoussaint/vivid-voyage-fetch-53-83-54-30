import React from 'react';
import { Receipt, CheckCircle, XCircle } from 'lucide-react';

const ReceiptModal = ({ currentReceipt, formatNumber, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non imprimé';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-black">Détails du Reçu</h3>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-center mb-4">
              <Receipt className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <h4 className="font-bold text-black text-lg">{currentReceipt.receiptNumber}</h4>
              <p className="text-xs text-gray-500">Reçu de Paiement</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Date vente:</span>
                <span className="font-medium text-black">{currentReceipt.date}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Quart:</span>
                <span className="font-medium text-black">{currentReceipt.shift}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Ventes totales:</span>
                <span className="font-medium text-blue-600">{formatNumber(currentReceipt.totalSales)} HTG</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Argent rendu:</span>
                <span className="font-medium text-green-600">{formatNumber(currentReceipt.moneyGiven)} HTG</span>
              </div>
              <div className="flex justify-between pb-2 border-b-2 border-gray-300">
                <span className="text-gray-600 font-bold">Déficit:</span>
                <span className="font-bold text-red-600">{formatNumber(currentReceipt.shortAmount)} HTG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Imprimé le:</span>
                <span className="font-medium text-black">{formatDate(currentReceipt.printDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Copies:</span>
                <span className="font-medium text-black">{currentReceipt.copiesPrinted}/2</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              currentReceipt.vendorSigned ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <span className="text-sm">Signature Vendeur</span>
              {currentReceipt.vendorSigned ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              currentReceipt.managerSigned ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <span className="text-sm">Signature Gérant</span>
              {currentReceipt.managerSigned ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              currentReceipt.receiptCopyArchived ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <span className="text-sm">Copie Archivée</span>
              {currentReceipt.receiptCopyArchived ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;