import React, { useState } from 'react';
import { Calendar, DollarSign, CreditCard, AlertCircle, CheckCircle, Clock, XCircle, Lock, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const ShortsTab = ({ vendeurActif }) => {
  const [shorts, setShorts] = useState([
    {
      id: 1,
      date: "15 Fév 2024",
      shift: "Matin (7h - 15h)",
      totalSales: 24500.00,
      moneyGiven: 24000.00,
      shortAmount: 500.00,
      status: 'pending', // 'pending', 'paid', 'overdue'
      notes: "Différence dans le compte de l'essence sans plomb 95"
    },
    {
      id: 2,
      date: "14 Fév 2024",
      shift: "Soir (15h - 23h)",
      totalSales: 31200.00,
      moneyGiven: 31000.00,
      shortAmount: 200.00,
      status: 'paid',
      notes: "Petite erreur de caisse"
    },
    {
      id: 3,
      date: "12 Fév 2024",
      shift: "Matin (7h - 15h)",
      totalSales: 18900.00,
      moneyGiven: 18500.00,
      shortAmount: 400.00,
      status: 'overdue',
      notes: "Manquant dans le compte du gasoil"
    },
    {
      id: 4,
      date: "10 Fév 2024",
      shift: "Nuit (23h - 7h)",
      totalSales: 15600.00,
      moneyGiven: 15600.00,
      shortAmount: 0.00,
      status: 'paid',
      notes: "Compte exact"
    },
    {
      id: 5,
      date: "8 Fév 2024",
      shift: "Soir (15h - 23h)",
      totalSales: 27800.00,
      moneyGiven: 27500.00,
      shortAmount: 300.00,
      status: 'pending',
      notes: "Différence à régulariser"
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [currentAction, setCurrentAction] = useState(null); // 'markPaid' or 'cancelPayment'
  const [currentShortId, setCurrentShortId] = useState(null);
  const [pinError, setPinError] = useState('');

  const totalShort = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pendingShort = shorts
    .filter(short => short.status === 'pending' || short.status === 'overdue')
    .reduce((sum, short) => sum + short.shortAmount, 0);

  const handleActionClick = (action, shortId) => {
    setCurrentAction(action);
    setCurrentShortId(shortId);
    setShowPinModal(true);
    setPin('');
    setPinError('');
  };

  const handlePinSubmit = () => {
    // Simple PIN validation - in real app, this would verify against backend
    if (pin === '1234') { // Demo PIN
      if (currentAction === 'markPaid') {
        setShorts(shorts.map(short => 
          short.id === currentShortId ? { ...short, status: 'paid' } : short
        ));
      } else if (currentAction === 'cancelPayment') {
        setShorts(shorts.map(short => 
          short.id === currentShortId ? { ...short, status: 'pending' } : short
        ));
      }
      setShowPinModal(false);
      setPin('');
    } else {
      setPinError('Code PIN incorrect. Essayez à nouveau.');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getActionText = (action) => {
    switch(action) {
      case 'markPaid':
        return 'marquer comme payé';
      case 'cancelPayment':
        return 'annuler le paiement';
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      {/* PIN Confirmation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Confirmation requise</h3>
                <p className="text-gray-600 text-sm">
                  Confirmez que vous voulez {getActionText(currentAction)} pour ce déficit
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrez votre code PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••"
                maxLength="4"
                inputMode="numeric"
              />
              {pinError && (
                <p className="mt-2 text-sm text-red-600">{pinError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Code PIN démo: 1234
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                  setPinError('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-2">Déficits de {vendeurActif}</h3>
        <p className="text-gray-600 text-sm mb-4">
          Montants manquants à régulariser après vérification des caisses
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Déficit total</p>
                <p className="text-lg font-bold text-black">{totalShort.toFixed(2)} DH</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600">À payer</p>
                <p className="text-lg font-bold text-amber-700">{pendingShort.toFixed(2)} DH</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shorts List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-black mb-3">Historique des déficits</h4>
        
        {shorts.map((short) => (
          <div key={short.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-black">{short.date}</span>
                  <span className="text-xs text-gray-500">• {short.shift}</span>
                </div>
                <p className="text-xs text-gray-500">{short.notes}</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(short.status)} flex items-center gap-1`}>
                {getStatusIcon(short.status)}
                {getStatusText(short.status)}
              </div>
            </div>
            
            {/* Financial Details in ROWS */}
            <div className="space-y-2 mb-4">
              {/* Ventes totales Row */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Ventes totales</span>
                </div>
                <span className="font-bold text-blue-700">{short.totalSales.toFixed(2)} DH</span>
              </div>
              
              {/* Argent rendu Row */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-50 rounded">
                    <Wallet className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Argent rendu</span>
                </div>
                <span className="font-bold text-green-700">{short.moneyGiven.toFixed(2)} DH</span>
              </div>
              
              {/* Déficit Row */}
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-50 rounded">
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">Déficit</span>
                </div>
                <span className="font-bold text-red-700">{short.shortAmount.toFixed(2)} DH</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2">
              {short.status === 'pending' || short.status === 'overdue' ? (
                <>
                  <button 
                    onClick={() => handleActionClick('markPaid', short.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme payé
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Rappeler
                  </button>
                </>
              ) : short.status === 'paid' ? (
                <>
                  <button 
                    onClick={() => handleActionClick('cancelPayment', short.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Annuler le paiement
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Voir reçu
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {shorts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">Aucun déficit enregistré</h3>
          <p className="text-gray-500 mb-4">Tous les comptes sont à jour</p>
        </div>
      )}

      {/* Add Short Form (optional) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-black mb-3">Ajouter un nouveau déficit</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-3">
            Pour ajouter un nouveau déficit, utilisez le formulaire de clôture de caisse.
          </p>
          <button className="bg-black text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            Ouvrir le formulaire de caisse
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortsTab;