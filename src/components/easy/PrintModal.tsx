import React from 'react';
import { Printer, FileText, Archive } from 'lucide-react';

const PrintModal = ({
  currentReceipt,
  signStep,
  printing,
  printError,
  paymentMethod,
  vendeurActif,
  formatNumber,
  onClose,
  onPrint,
  onConfirmVendorSign,
  onConfirmManagerSign,
  onConfirmArchive
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Processus de Paiement</h3>
        </div>

        <div className="p-4">
          {signStep === 'print' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Printer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-black">Impression des reçus</h4>
                  <p className="text-xs text-gray-500">2 copies seront imprimées</p>
                </div>
              </div>

              {printError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">{printError}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Déficit:</span>
                  <span className="font-bold text-red-600">{formatNumber(currentReceipt.shortAmount)} HTG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black">{currentReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quart:</span>
                  <span className="text-black">{currentReceipt.shift}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={onPrint}
                  disabled={printing}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {printing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Impression...
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      Imprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {signStep === 'vendor_sign' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-black">Signature Vendeur</h4>
                  <p className="text-xs text-gray-500">Le vendeur doit signer sa copie</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-700">
                  ✓ Reçus imprimés avec succès<br/>
                  → Demandez au vendeur de signer sa copie
                </p>
              </div>

              <button
                onClick={onConfirmVendorSign}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium"
              >
                Vendeur a signé
              </button>
            </div>
          )}

          {signStep === 'manager_sign' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-black">Signature Gérant</h4>
                  <p className="text-xs text-gray-500">Vous devez signer votre copie</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  ✓ Vendeur a signé<br/>
                  → Signez votre copie maintenant
                </p>
              </div>

              <button
                onClick={onConfirmManagerSign}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-medium"
              >
                J'ai signé
              </button>
            </div>
          )}

          {signStep === 'archive' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Archive className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-black">Archivage</h4>
                  <p className="text-xs text-gray-500">Ranger votre copie signée</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700">
                  ✓ Toutes les signatures complétées<br/>
                  → Rangez votre copie dans les archives
                </p>
              </div>

              <button
                onClick={onConfirmArchive}
                className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-medium"
              >
                Copie archivée - Terminer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintModal;