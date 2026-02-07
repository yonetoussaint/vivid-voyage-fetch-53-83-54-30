import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Lock, Bell, Receipt, CalendarDays, Printer, FileText, Archive, Eye } from 'lucide-react';

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
      status: 'overdue',
      originalStatus: 'pending',
      wasOverdue: true,
      notes: "Différence essence SP95",
      paidFromPayroll: false,
      daysOverdue: 8,
      // Physical receipt tracking
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      receiptCopies: {
        vendorCopy: { printed: false, signed: false, archived: false },
        companyCopy: { printed: false, signed: false, archived: false }
      }
    },
    {
      id: 2,
      date: "14 Fév, 24",
      shift: "Soir",
      totalSales: 2112200.50,
      moneyGiven: 2110000.50,
      shortAmount: 2200.00,
      status: 'paid',
      originalStatus: 'paid',
      wasOverdue: false,
      notes: "Erreur de caisse",
      paidFromPayroll: false,
      daysOverdue: 0,
      receiptPrinted: true,
      receiptNumber: 'REC-20240214-001',
      printDate: '2024-02-14 16:45:00',
      vendorSigned: true,
      managerSigned: true,
      receiptCopyArchived: true,
      receiptCopies: {
        vendorCopy: { printed: true, signed: true, archived: true },
        companyCopy: { printed: true, signed: true, archived: true }
      }
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
      daysOverdue: 12,
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      receiptCopies: {
        vendorCopy: { printed: false, signed: false, archived: false },
        companyCopy: { printed: false, signed: false, archived: false }
      }
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
      daysOverdue: 0,
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      receiptCopies: {
        vendorCopy: { printed: false, signed: false, archived: false },
        companyCopy: { printed: false, signed: false, archived: false }
      }
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
      daysOverdue: 15,
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      receiptCopies: {
        vendorCopy: { printed: false, signed: false, archived: false },
        companyCopy: { printed: false, signed: false, archived: false }
      }
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShortId, setCurrentShortId] = useState(null);
  const [pinError, setPinError] = useState('');
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [monthlySalary, setMonthlySalary] = useState(15000.00);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [signStep, setSignStep] = useState('print'); // 'print', 'vendor_sign', 'manager_sign', 'archive'
  const [copiesPrinted, setCopiesPrinted] = useState({
    vendorCopy: false,
    companyCopy: false
  });

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

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

  // Generate unique receipt number
  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${year}${month}${day}-${random}`;
  };

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
    
    if (action === 'markPaid') {
      // Start payment process - first print receipts
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      setShowPrintModal(true);
      setSignStep('print');
      setCopiesPrinted({ vendorCopy: false, companyCopy: false });
    } else if (action === 'cancelPayment') {
      setShowPinModal(true);
    } else if (action === 'payrollPayment') {
      setShowPinModal(true);
    } else if (action === 'viewReceipt') {
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      setShowReceiptModal(true);
    } else if (action === 'continuePayment') {
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      if (!short.receiptPrinted) {
        setShowPrintModal(true);
        setSignStep('print');
      } else if (short.receiptPrinted && !short.vendorSigned) {
        setShowSignModal(true);
        setSignStep('vendor_sign');
      } else if (short.vendorSigned && !short.managerSigned) {
        setShowSignModal(true);
        setSignStep('manager_sign');
      } else if (short.managerSigned && !short.receiptCopyArchived) {
        setShowArchiveModal(true);
      }
    }
    
    setPin(['', '', '', '']);
    setPinError('');
    setActivePinIndex(0);
  };

  const handlePayrollPayment = (shortId) => {
    const receiptNumber = generateReceiptNumber();
    const now = new Date().toISOString();
    
    setShorts(shorts.map(short => 
      short.id === shortId 
        ? { 
            ...short, 
            status: 'paid', 
            paidFromPayroll: true,
            paymentDate: now,
            paymentMethod: 'payroll',
            receiptNumber,
            receiptPrinted: true,
            printDate: now,
            vendorSigned: true, // Auto-signed for payroll deduction
            managerSigned: true,
            receiptCopyArchived: true,
            receiptCopies: {
              vendorCopy: { printed: true, signed: true, archived: true },
              companyCopy: { printed: true, signed: true, archived: true }
            }
          }
        : short
    ));
  };

  const handlePrintReceipts = () => {
    // Simulate printing two copies
    setCopiesPrinted({
      vendorCopy: true,
      companyCopy: true
    });
    
    // In real app, this would trigger actual printer
    console.log('Printing receipt copies...');
    
    // After printing, update state
    const receiptNumber = generateReceiptNumber();
    const now = new Date().toISOString();
    
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            receiptPrinted: true,
            receiptNumber,
            printDate: now,
            receiptCopies: {
              vendorCopy: { printed: true, signed: false, archived: false },
              companyCopy: { printed: true, signed: false, archived: false }
            }
          }
        : short
    ));
    
    setCurrentReceipt({
      ...currentReceipt,
      receiptPrinted: true,
      receiptNumber,
      printDate: now
    });
    
    setShowPrintModal(false);
    setShowSignModal(true);
    setSignStep('vendor_sign');
  };

  const handleVendorSign = () => {
    // Mark vendor copy as signed
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            vendorSigned: true,
            receiptCopies: {
              ...short.receiptCopies,
              vendorCopy: { ...short.receiptCopies.vendorCopy, signed: true }
            }
          }
        : short
    ));
    
    setSignStep('manager_sign');
  };

  const handleManagerSign = () => {
    // Mark company copy as signed
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            managerSigned: true,
            receiptCopies: {
              ...short.receiptCopies,
              companyCopy: { ...short.receiptCopies.companyCopy, signed: true }
            }
          }
        : short
    ));
    
    setShowSignModal(false);
    setShowArchiveModal(true);
  };

  const handleArchiveReceipts = () => {
    // Mark both copies as archived
    const now = new Date().toISOString();
    
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            status: 'paid',
            paymentDate: now,
            paymentMethod,
            receiptCopyArchived: true,
            receiptCopies: {
              vendorCopy: { printed: true, signed: true, archived: true },
              companyCopy: { printed: true, signed: true, archived: true }
            }
          }
        : short
    ));
    
    setShowArchiveModal(false);
  };

  const handlePinSubmit = () => {
    const pinString = pin.join('');
    if (pinString === '1234') {
      if (currentAction === 'cancelPayment') {
        setShorts(shorts.map(short => 
          short.id === currentShortId 
            ? { 
                ...short, 
                status: short.wasOverdue ? 'overdue' : 'pending', 
                paidFromPayroll: false,
                receiptPrinted: false,
                receiptNumber: null,
                printDate: null,
                vendorSigned: false,
                managerSigned: false,
                receiptCopyArchived: false,
                receiptCopies: {
                  vendorCopy: { printed: false, signed: false, archived: false },
                  companyCopy: { printed: false, signed: false, archived: false }
                }
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

  const getPaymentMethodText = (method) => {
    switch(method) {
      case 'cash': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'check': return 'Chèque';
      case 'payroll': return 'Déduction salariale';
      default: return method;
    }
  };

  return (
    <div className="p-3 pb-20 max-w-full overflow-x-hidden min-h-screen bg-white">
      {/* PIN Modal */}
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

      {/* Print Receipt Modal */}
      {showPrintModal && currentReceipt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Printer className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Imprimer les reçus</h3>
                    <p className="text-xs text-gray-500">Deux copies nécessaires</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  Imprimez <span className="font-bold">DEUX copies</span> du reçu :
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          copiesPrinted.vendorCopy ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {copiesPrinted.vendorCopy ? '✓' : '1'}
                        </div>
                        <span className="text-sm font-medium">Copie vendeur</span>
                      </div>
                      <span className="text-xs text-gray-500">Signée par le vendeur</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          copiesPrinted.companyCopy ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {copiesPrinted.companyCopy ? '✓' : '2'}
                        </div>
                        <span className="text-sm font-medium">Copie entreprise</span>
                      </div>
                      <span className="text-xs text-gray-500">Signée par le manager</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">
                    Numéro de reçu généré:
                  </p>
                  <p className="text-sm font-bold text-blue-800">
                    {generateReceiptNumber()}
                  </p>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p className="mb-1">• Imprimez les deux copies sur papier</p>
                  <p className="mb-1">• Faites signer le vendeur sur SA copie</p>
                  <p>• Signez VOUS-MÊME sur la copie entreprise</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePrintReceipts}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-medium active:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  J'ai imprimé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Receipts Modal */}
      {showSignModal && currentReceipt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">
                      {signStep === 'vendor_sign' ? 'Signature du vendeur' : 'Signature du manager'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {signStep === 'vendor_sign' 
                        ? 'Le vendeur signe sa copie' 
                        : 'Vous signez la copie entreprise'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSignModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                {signStep === 'vendor_sign' ? (
                  <>
                    <p className="text-sm text-gray-700 mb-3">
                      Donnez la <span className="font-bold">copie vendeur</span> à <span className="font-bold">{vendeurActif}</span> pour signature.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800 font-medium">
                        Vérifiez que le vendeur signe bien SA copie, pas la vôtre.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-3">
                      Signez maintenant la <span className="font-bold">copie entreprise</span>.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800 font-medium">
                        Signez avec votre nom complet et titre.
                      </p>
                    </div>
                  </>
                )}
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Numéro de reçu:</span>
                    <span className="text-sm font-bold">{currentReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Montant:</span>
                    <span className="text-sm font-bold text-red-600">
                      {formatNumber(currentReceipt.shortAmount)} HTG
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={signStep === 'vendor_sign' ? handleVendorSign : handleManagerSign}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-medium active:bg-blue-700"
                >
                  {signStep === 'vendor_sign' ? 'Vendeur a signé' : 'J\'ai signé'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Receipt Modal */}
      {showArchiveModal && currentReceipt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Archive className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Archiver les reçus</h3>
                    <p className="text-xs text-gray-500">Finaliser la transaction</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowArchiveModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  Maintenant que les deux copies sont signées :
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm">1. Donnez la copie vendeur à {vendeurActif}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm">2. Archivez la copie entreprise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">3</span>
                    </div>
                    <span className="text-sm">3. Marquer la transaction comme terminée</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-600 mb-1">Résumé de la transaction:</p>
                  <div className="flex justify-between">
                    <span className="text-sm">Montant:</span>
                    <span className="text-sm font-bold">{formatNumber(currentReceipt.shortAmount)} HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reçu:</span>
                    <span className="text-sm font-medium">{currentReceipt.receiptNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={handleArchiveReceipts}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg text-sm font-medium active:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archiver et terminer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Details Modal */}
      {showReceiptModal && currentReceipt && currentReceipt.receiptNumber && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Détails du reçu</h3>
                    <p className="text-xs text-gray-500">{currentReceipt.receiptNumber}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentReceipt.status)}`}>
                    {getStatusText(currentReceipt.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date d'impression:</span>
                  <span className="text-sm font-medium">{formatDate(currentReceipt.printDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vendeur signé:</span>
                  <span className={`text-sm font-medium ${currentReceipt.vendorSigned ? 'text-green-600' : 'text-red-600'}`}>
                    {currentReceipt.vendorSigned ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Manager signé:</span>
                  <span className={`text-sm font-medium ${currentReceipt.managerSigned ? 'text-green-600' : 'text-red-600'}`}>
                    {currentReceipt.managerSigned ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Archivé:</span>
                  <span className={`text-sm font-medium ${currentReceipt.receiptCopyArchived ? 'text-green-600' : 'text-red-600'}`}>
                    {currentReceipt.receiptCopyArchived ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  // In real app, this would re-print the receipt
                  console.log('Re-printing receipt:', currentReceipt.receiptNumber);
                  alert('Ré-impression déclenchée. Vérifiez l\'imprimante.');
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50 flex items-center justify-center gap-2 mb-2"
              >
                <Printer className="w-4 h-4" />
                Ré-imprimer le reçu
              </button>
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
                
                {/* Receipt Status */}
                {short.status === 'paid' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700 font-medium">
                            {short.receiptNumber || 'En cours de paiement...'}
                          </p>
                          <p className="text-xs text-green-600">
                            {short.receiptPrinted ? (
                              <span className="flex items-center gap-1">
                                <span>Signatures: </span>
                                <span className={short.vendorSigned ? 'text-green-500' : 'text-red-500'}>
                                  Vendeur {short.vendorSigned ? '✓' : '✗'}
                                </span>
                                <span className={short.managerSigned ? 'text-green-500' : 'text-red-500'}>
                                  Manager {short.managerSigned ? '✓' : '✗'}
                                </span>
                              </span>
                            ) : 'Reçu non imprimé'}
                          </p>
                        </div>
                      </div>
                      {short.receiptNumber && (
                        <button 
                          onClick={() => handleActionClick('viewReceipt', short.id)}
                          className="text-xs text-blue-600 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Payment in Progress */}
                {short.status !== 'paid' && short.receiptPrinted && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-yellow-600" />
                      <div>
                        <p className="text-xs text-yellow-700 font-medium">
                          Reçu imprimé • En attente de signature
                        </p>
                        <p className="text-xs text-yellow-600">
                          Numéro: {short.receiptNumber}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleActionClick('continuePayment', short.id)}
                      className="w-full mt-2 bg-yellow-500 text-white py-1.5 rounded text-xs font-medium active:bg-yellow-600"
                    >
                      Continuer le paiement
                    </button>
                  </div>
                )}
                
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
                        Payer
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
                      <button 
                        onClick={() => handleActionClick('viewReceipt', short.id)}
                        className="border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium active:bg-gray-50 flex items-center justify-center gap-1"
                      >
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