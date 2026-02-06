import React, { useState } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Lock, ChevronDown, MoreVertical, Receipt, Bell } from 'lucide-react';

const ShortsTab = ({ vendeurActif }) => {
  const [shorts, setShorts] = useState([
    {
      id: 1,
      date: "15 Fév",
      shift: "Matin",
      totalSales: 24500.00,
      moneyGiven: 24000.00,
      shortAmount: 500.00,
      status: 'pending',
      notes: "Différence essence SP95"
    },
    {
      id: 2,
      date: "14 Fév",
      shift: "Soir",
      totalSales: 31200.00,
      moneyGiven: 31000.00,
      shortAmount: 200.00,
      status: 'paid',
      notes: "Erreur de caisse"
    },
    {
      id: 3,
      date: "12 Fév",
      shift: "Matin",
      totalSales: 18900.00,
      moneyGiven: 18500.00,
      shortAmount: 400.00,
      status: 'overdue',
      notes: "Manquant gasoil"
    },
    {
      id: 4,
      date: "10 Fév",
      shift: "Nuit",
      totalSales: 15600.00,
      moneyGiven: 15600.00,
      shortAmount: 0.00,
      status: 'paid',
      notes: "Compte exact"
    },
    {
      id: 5,
      date: "8 Fév",
      shift: "Soir",
      totalSales: 27800.00,
      moneyGiven: 27500.00,
      shortAmount: 300.00,
      status: 'pending',
      notes: "À régulariser"
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShortId, setCurrentShortId] = useState(null);
  const [pinError, setPinError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [activePinIndex, setActivePinIndex] = useState(0);

  const totalShort = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pendingShort = shorts
    .filter(short => short.status === 'pending' || short.status === 'overdue')
    .reduce((sum, short) => sum + short.shortAmount, 0);

  const handleActionClick = (action, shortId, e) => {
    e.stopPropagation();
    setCurrentAction(action);
    setCurrentShortId(shortId);
    setShowPinModal(true);
    setPin(['', '', '', '']);
    setPinError('');
    setActivePinIndex(0);
  };

  const handlePinSubmit = () => {
    const pinString = pin.join('');
    if (pinString === '1234') {
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
    } else {
      setPinError('PIN incorrect');
      setTimeout(() => setPinError(''), 2000);
    }
  };

  const handlePinInput = (index, value) => {
    if (/^\d$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      if (value !== '' && index < 3) {
        setActivePinIndex(index + 1);
      }
      
      setPinError('');
      
      // Auto-submit when all digits entered
      if (newPin.every(digit => digit !== '') && index === 3) {
        setTimeout(handlePinSubmit, 100);
      }
    }
  };

  const getStatusIcon = (status) => {
    const size = "w-3.5 h-3.5";
    switch(status) {
      case 'paid': return <div className={`${size} rounded-full bg-green-500 flex items-center justify-center`}><CheckCircle className="w-2.5 h-2.5 text-white" /></div>;
      case 'pending': return <div className={`${size} rounded-full bg-amber-500 flex items-center justify-center`}><Clock className="w-2.5 h-2.5 text-white" /></div>;
      case 'overdue': return <div className={`${size} rounded-full bg-red-500 flex items-center justify-center`}><AlertCircle className="w-2.5 h-2.5 text-white" /></div>;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      default: return '';
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 1000) {
      return `${(amount/1000).toFixed(0)}k`;
    }
    return amount.toFixed(0);
  };

  return (
    <div className="p-3 pb-20 max-w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* PIN Modal - Bottom Sheet */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl shadow-lg animate-slideUp">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Confirmation PIN</h3>
                    <p className="text-xs text-gray-500">Entrez votre code à 4 chiffres</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <div className="flex justify-center gap-2 mb-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-semibold ${
                      activePinIndex === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                    }`}>
                      {pin[index] ? '•' : ''}
                    </div>
                  ))}
                </div>
                
                {pinError && (
                  <div className="text-center">
                    <p className="text-sm text-red-600">{pinError}</p>
                    <p className="text-xs text-gray-400 mt-1">Essai: 1234</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      const nextIndex = pin.findIndex(digit => digit === '');
                      if (nextIndex !== -1) {
                        handlePinInput(nextIndex, num.toString());
                      }
                    }}
                    className="h-12 rounded-lg bg-gray-100 text-gray-700 font-medium text-lg active:bg-gray-200 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button className="h-12 rounded-lg bg-gray-100 text-gray-400 font-medium text-lg active:bg-gray-200 transition-colors">
                  ✕
                </button>
                <button
                  onClick={() => {
                    const nextIndex = pin.findIndex(digit => digit === '');
                    if (nextIndex !== -1) {
                      handlePinInput(nextIndex, '0');
                    }
                  }}
                  className="h-12 rounded-lg bg-gray-100 text-gray-700 font-medium text-lg active:bg-gray-200 transition-colors"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    const lastFilledIndex = [...pin].reverse().findIndex(digit => digit !== '');
                    if (lastFilledIndex !== -1) {
                      const indexToClear = 3 - lastFilledIndex;
                      handlePinInput(indexToClear, '');
                      setActivePinIndex(Math.max(0, indexToClear - 1));
                    }
                  }}
                  className="h-12 rounded-lg bg-gray-100 text-gray-700 font-medium text-lg active:bg-gray-200 transition-colors"
                >
                  ←
                </button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={pin.some(digit => digit === '')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    pin.every(digit => digit !== '')
                      ? 'bg-blue-600 text-white active:bg-blue-700'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header - Compact */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-black">Déficits</h1>
            <p className="text-xs text-gray-500">{vendeurActif}</p>
          </div>
          <button className="text-xs text-blue-600 font-medium px-2 py-1 rounded-lg active:bg-blue-50">
            Voir tout
          </button>
        </div>
        
        {/* Mini Summary Cards */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="text-sm font-bold text-black">{totalShort.toFixed(0)} DH</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 mb-1">À payer</p>
                <p className="text-sm font-bold text-amber-700">{pendingShort.toFixed(0)} DH</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-2 -mx-3 px-3">
        <button className="text-xs px-3 py-1.5 rounded-full bg-blue-600 text-white font-medium whitespace-nowrap">
          Tous ({shorts.length})
        </button>
        <button className="text-xs px-3 py-1.5 rounded-full bg-white text-gray-600 border border-gray-300 font-medium whitespace-nowrap active:bg-gray-50">
          En attente ({shorts.filter(s => s.status === 'pending').length})
        </button>
        <button className="text-xs px-3 py-1.5 rounded-full bg-white text-gray-600 border border-gray-300 font-medium whitespace-nowrap active:bg-gray-50">
          Payés ({shorts.filter(s => s.status === 'paid').length})
        </button>
      </div>

      {/* Shorts List - Ultra Compact */}
      <div className="space-y-2">
        {shorts.map((short) => (
          <div 
            key={short.id}
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition-colors ${
              expandedCard === short.id ? 'shadow-sm' : ''
            }`}
            onClick={() => setExpandedCard(expandedCard === short.id ? null : short.id)}
          >
            {/* Compact Row */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-black">{short.date}</span>
                  </div>
                  <span className="text-xs text-gray-500">• {short.shift}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(short.status)} flex items-center gap-1`}>
                  {getStatusIcon(short.status)}
                  {getStatusText(short.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 line-clamp-1">{short.notes}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      Vente: {formatAmount(short.totalSales)} DH
                    </span>
                    <span className="text-xs text-gray-500">
                      Rendu: {formatAmount(short.moneyGiven)} DH
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-red-600">
                    {formatAmount(short.shortAmount)} DH
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedCard === short.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
            </div>
            
            {/* Expanded Actions - Compact */}
            {expandedCard === short.id && (
              <div className="border-t border-gray-100 p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {short.status === 'pending' || short.status === 'overdue' ? (
                    <>
                      <button 
                        onClick={(e) => handleActionClick('markPaid', short.id, e)}
                        className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium active:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Marquer payé
                      </button>
                      <button className="border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium active:bg-gray-50 flex items-center justify-center gap-1">
                        <Bell className="w-3.5 h-3.5" />
                        Rappeler
                      </button>
                    </>
                  ) : short.status === 'paid' ? (
                    <>
                      <button 
                        onClick={(e) => handleActionClick('cancelPayment', short.id, e)}
                        className="bg-red-500 text-white py-2 rounded-lg text-xs font-medium active:bg-red-600 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annuler
                      </button>
                      <button className="border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium active:bg-gray-50 flex items-center justify-center gap-1">
                        <Receipt className="w-3.5 h-3.5" />
                        Reçu
                      </button>
                    </>
                  ) : null}
                </div>
                
                {/* Quick Details */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Ventes:</span>
                    <span className="font-medium">{short.totalSales.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Argent rendu:</span>
                    <span className="font-medium">{short.moneyGiven.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Différence:</span>
                    <span className="font-bold text-red-600">{short.shortAmount.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {shorts.length === 0 && (
        <div className="text-center py-8 px-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-black mb-1">Aucun déficit</h3>
          <p className="text-xs text-gray-500 mb-4">Tous les comptes sont à jour</p>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center active:bg-gray-800 active:scale-95 transition-all">
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <div className="text-center">
            <p className="font-medium text-gray-700">{shorts.length}</p>
            <p>Total</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-amber-600">{shorts.filter(s => s.status === 'pending').length}</p>
            <p>En attente</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-green-600">{shorts.filter(s => s.status === 'paid').length}</p>
            <p>Payés</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-red-600">{shorts.filter(s => s.status === 'overdue').length}</p>
            <p>En retard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .animate-slideUp {
    animation: slideUp 0.2s ease-out;
  }
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;
document.head.appendChild(style);

export default ShortsTab;