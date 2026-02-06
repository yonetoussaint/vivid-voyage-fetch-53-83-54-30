import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Lock, Bell, Receipt, CalendarDays } from 'lucide-react';

const ShortsTab = ({ vendeurActif }) => {
  const [shorts, setShorts] = useState([
    {
      id: 1,
      date: "15 Fév, 24",
      dueDate: "20 Fév, 24",
      shift: "Matin",
      totalSales: 1243526.25,
      moneyGiven: 1230026.25,
      shortAmount: 13500.00,
      status: 'overdue', // Will be calculated
      originalStatus: 'pending',
      wasOverdue: true, // Track if it was ever overdue
      notes: "Différence essence SP95",
      paidFromPayroll: false,
      daysOverdue: 8
    },
    {
      id: 2,
      date: "14 Fév, 24",
      dueDate: "19 Fév, 24",
      shift: "Soir",
      totalSales: 2112200.50,
      moneyGiven: 2110000.50,
      shortAmount: 2200.00,
      status: 'paid',
      originalStatus: 'paid',
      wasOverdue: false,
      notes: "Erreur de caisse",
      paidFromPayroll: false,
      daysOverdue: 0
    },
    {
      id: 3,
      date: "12 Fév, 24",
      dueDate: "17 Fév, 24",
      shift: "Matin",
      totalSales: 1894500.75,
      moneyGiven: 1890500.75,
      shortAmount: 4000.00,
      status: 'overdue',
      originalStatus: 'pending',
      wasOverdue: true,
      notes: "Manquant gasoil",
      paidFromPayroll: false,
      daysOverdue: 12
    },
    {
      id: 4,
      date: "10 Fév, 24",
      dueDate: "15 Fév, 24",
      shift: "Nuit",
      totalSales: 1560000.00,
      moneyGiven: 1560000.00,
      shortAmount: 0.00,
      status: 'paid',
      originalStatus: 'paid',
      wasOverdue: false,
      notes: "Compte exact",
      paidFromPayroll: false,
      daysOverdue: 0
    },
    {
      id: 5,
      date: "8 Fév, 24",
      dueDate: "13 Fév, 24",
      shift: "Soir",
      totalSales: 2783300.25,
      moneyGiven: 2780000.25,
      shortAmount: 3300.00,
      status: 'overdue',
      originalStatus: 'pending',
      wasOverdue: true,
      notes: "À régulariser",
      paidFromPayroll: false,
      daysOverdue: 15
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShortId, setCurrentShortId] = useState(null);
  const [pinError, setPinError] = useState('');
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'paid', 'overdue'
  const [monthlySalary, setMonthlySalary] = useState(15000.00);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  // Calculate due dates and update status
  useEffect(() => {
    const updatedShorts = shorts.map(short => {
      // For demo, we'll pre-set some as overdue based on daysOverdue
      const isOverdue = short.daysOverdue > 0;
      const shouldDeductFromPayroll = isOverdue && short.daysOverdue > 7;
      
      return {
        ...short,
        status: isOverdue ? 'overdue' : short.originalStatus,
        wasOverdue: isOverdue || short.wasOverdue
      };
    });
    
    setShorts(updatedShorts);
  }, []);

  // Filter shorts based on active filter
  const filteredShorts = shorts.filter(short => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return short.status === 'pending';
    if (activeFilter === 'overdue') return short.status === 'overdue';
    if (activeFilter === 'paid') return short.status === 'paid';
    return true;
  });

  const totalShort = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pendingShort = shorts
    .filter(short => short.status === 'pending')
    .reduce((sum, short) => sum + short.shortAmount, 0);
  
  const overdueShort = shorts
    .filter(short => short.status === 'overdue')
    .reduce((sum, short) => sum + short.shortAmount, 0);
  
  const payrollDeductions = shorts
    .filter(short => short.paidFromPayroll)
    .reduce((sum, short) => sum + short.shortAmount, 0);
  
  const remainingPayroll = monthlySalary - payrollDeductions;

  const handleActionClick = (action, shortId) => {
    setCurrentAction(action);
    setCurrentShortId(shortId);
    setShowPinModal(true);
    setPin(['', '', '', '']);
    setPinError('');
    setActivePinIndex(0);
  };

  const handlePayrollPayment = (shortId) => {
    setShorts(shorts.map(short => 
      short.id === shortId 
        ? { ...short, status: 'paid', paidFromPayroll: true }
        : short
    ));
  };

  const handlePinSubmit = () => {
    const pinString = pin.join('');
    if (pinString === '1234') {
      if (currentAction === 'markPaid') {
        setShorts(shorts.map(short => 
          short.id === currentShortId 
            ? { ...short, status: 'paid', paidFromPayroll: false }
            : short
        ));
      } else if (currentAction === 'cancelPayment') {
        // FIX: If card was previously overdue, return to 'overdue' status, not 'pending'
        setShorts(shorts.map(short => 
          short.id === currentShortId 
            ? { 
                ...short, 
                status: short.wasOverdue ? 'overdue' : 'pending', 
                paidFromPayroll: false 
              }
            : short
        ));
      } else if (currentAction === 'payrollPayment') {
        handlePayrollPayment(currentShortId);
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

  return (
    <div className="p-3 pb-20 max-w-full overflow-x-hidden min-h-screen bg-white">
      {/* PIN Modal - Bottom Sheet */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
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

      {/* Payroll Deduction Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 mb-1">Déduction mensuelle</p>
            <p className="text-sm font-bold text-blue-700">Salaire: {formatNumber(monthlySalary)} HTG</p>
            <p className="text-xs text-blue-600">
              Déductions: {formatNumber(payrollDeductions)} HTG • Reste: {formatNumber(remainingPayroll)} HTG
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total déficit</p>
              <p className="text-sm font-bold text-black">{formatNumber(totalShort)} HTG</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 mb-1">À payer</p>
              <p className="text-sm font-bold text-amber-700">{formatNumber(pendingShort + overdueShort)} HTG</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
            activeFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-300 active:bg-gray-50'
          }`}
        >
          Tous ({shorts.length})
        </button>
        <button 
          onClick={() => setActiveFilter('pending')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
            activeFilter === 'pending' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-300 active:bg-gray-50'
          }`}
        >
          En attente ({shorts.filter(s => s.status === 'pending').length})
        </button>
        <button 
          onClick={() => setActiveFilter('overdue')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
            activeFilter === 'overdue' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-300 active:bg-gray-50'
          }`}
        >
          En retard ({shorts.filter(s => s.status === 'overdue').length})
        </button>
        <button 
          onClick={() => setActiveFilter('paid')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
            activeFilter === 'paid' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-300 active:bg-gray-50'
          }`}
        >
          Payés ({shorts.filter(s => s.status === 'paid').length})
        </button>
      </div>

      {/* Shorts List */}
      <div className="space-y-2">
        {filteredShorts.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-bold text-black mb-1">Aucun déficit</h3>
            <p className="text-xs text-gray-500">Aucun déficit trouvé pour ce filtre</p>
          </div>
        ) : (
          filteredShorts.map((short) => (
            <div 
              key={short.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-3">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-black">{short.date}</span>
                    <span className="text-xs text-gray-500">• {short.shift}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(short.status)} flex items-center gap-1`}>
                    {getStatusIcon(short.status)}
                    {getStatusText(short.status)}
                  </div>
                </div>
                
                {/* Due Date Info */}
                <div className="flex items-center gap-1 mb-2 text-xs">
                  <CalendarDays className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Date limite: </span>
                  <span className={`font-medium ${
                    short.status === 'overdue' ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {short.dueDate}
                  </span>
                  {short.daysOverdue > 0 && (
                    <span className="text-red-600 font-medium">
                      • {short.daysOverdue} jour{short.daysOverdue > 1 ? 's' : ''} de retard
                    </span>
                  )}
                </div>
                
                {/* Notes with Gray Background */}
                <div className="bg-gray-50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-gray-600">{short.notes}</p>
                </div>
                
                {/* Financial Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Ventes totales:</span>
                    <span className="text-xs font-medium text-blue-700">{formatNumber(short.totalSales)} HTG</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Argent rendu:</span>
                    <span className="text-xs font-medium text-green-700">{formatNumber(short.moneyGiven)} HTG</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Déficit:</span>
                    <span className="text-sm font-bold text-red-600">{formatNumber(short.shortAmount)} HTG</span>
                  </div>
                </div>
                
                {/* Payroll Deduction Warning */}
                {short.status === 'overdue' && !short.paidFromPayroll && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-red-700 font-medium">
                          {short.daysOverdue > 7 
                            ? `À déduire du salaire (${formatNumber(monthlySalary)} HTG)` 
                            : "À payer avant déduction salariale"}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Salaire restant: {formatNumber(remainingPayroll)} HTG
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  {short.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('markPaid', short.id)}
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
                  ) : short.status === 'overdue' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('markPaid', short.id)}
                        className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium active:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Payer maintenant
                      </button>
                      <button 
                        onClick={() => handleActionClick('payrollPayment', short.id)}
                        className="bg-blue-600 text-white py-2 rounded-lg text-xs font-medium active:bg-blue-700 flex items-center justify-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Déduire du salaire
                      </button>
                    </>
                  ) : short.status === 'paid' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('cancelPayment', short.id)}
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center active:bg-gray-800 active:scale-95 transition-all">
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
    </div>
  );
};

export default ShortsTab;