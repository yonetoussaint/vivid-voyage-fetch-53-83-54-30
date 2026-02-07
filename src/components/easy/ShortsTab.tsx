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
      copiesPrinted: 0 // 0, 1, or 2 copies printed
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
      copiesPrinted: 2
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
      copiesPrinted: 0
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
      copiesPrinted: 0
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
      copiesPrinted: 0
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
  const [printing, setPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [printError, setPrintError] = useState('');

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
      setPrinting(false);
      setPrintProgress(0);
      setPrintError('');
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
      if (short.copiesPrinted < 2) {
        setShowPrintModal(true);
        setSignStep('print');
      } else if (!short.vendorSigned) {
        setShowSignModal(true);
        setSignStep('vendor_sign');
      } else if (!short.managerSigned) {
        setShowSignModal(true);
        setSignStep('manager_sign');
      } else if (!short.receiptCopyArchived) {
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
            vendorSigned: true,
            managerSigned: true,
            receiptCopyArchived: true,
            copiesPrinted: 2
          }
        : short
    ));
  };

  // Simulate printing to mobile/Bluetooth printer
  const simulatePrint = () => {
    setPrinting(true);
    setPrintError('');
    
    // Simulate printing progress
    const interval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPrinting(false);
          
          // Update state after successful print
          const receiptNumber = generateReceiptNumber();
          const now = new Date().toISOString();
          const updatedShort = {
            ...currentReceipt,
            receiptPrinted: true,
            receiptNumber,
            printDate: now,
            copiesPrinted: currentReceipt.copiesPrinted + 2 // Print 2 copies at once
          };
          
          setCurrentReceipt(updatedShort);
          setShorts(shorts.map(short => 
            short.id === currentShortId 
              ? { 
                  ...short, 
                  receiptPrinted: true,
                  receiptNumber,
                  printDate: now,
                  copiesPrinted: short.copiesPrinted + 2
                }
              : short
          ));
          
          // Auto-proceed to signature step
          setTimeout(() => {
            setShowPrintModal(false);
            setShowSignModal(true);
            setSignStep('vendor_sign');
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Real printer integration (commented out - would need printer SDK)
  const triggerActualPrint = () => {
    /* 
    // Example with Star Micronics SDK
    if (window.starPrint) {
      const receiptContent = generateReceiptContent();
      
      window.starPrint.print({
        content: receiptContent,
        printerType: 'bt',
        success: () => {
          console.log('Print successful');
          // Update state
        },
        error: (error) => {
          console.error('Print failed:', error);
          setPrintError('Échec de l\'impression. Vérifiez la connexion Bluetooth.');
        }
      });
    }
    
    // Example with ESC/POS library
    const printer = new EscPosPrinter(device);
    printer
      .initialize()
      .align('center')
      .text('STATION SERVICE EXCELLENCE')
      .text('RECU DE PAIEMENT')
      .feed(2)
      .cut()
      .print()
      .then(() => {
        console.log('Printed successfully');
      })
      .catch(error => {
        console.error('Print error:', error);
        setPrintError('Erreur d\'impression');
      });
    */
    
    // For demo, use simulation
    simulatePrint();
  };

  const handlePrintReceipts = () => {
    // Check if printer is available
    if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent) {
      // In real app, check for printer connectivity here
      console.log('Triggering mobile printer...');
      
      // Show printing animation
      triggerActualPrint();
    } else {
      // Fallback to simulation for demo
      simulatePrint();
    }
  };

  const handleVendorSign = () => {
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            vendorSigned: true
          }
        : short
    ));
    
    setSignStep('manager_sign');
  };

  const handleManagerSign = () => {
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            managerSigned: true
          }
        : short
    ));
    
    setShowSignModal(false);
    setShowArchiveModal(true);
  };

  const handleArchiveReceipts = () => {
    const now = new Date().toISOString();
    
    setShorts(shorts.map(short => 
      short.id === currentShortId 
        ? { 
            ...short, 
            status: 'paid',
            paymentDate: now,
            paymentMethod,
            receiptCopyArchived: true
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
                copiesPrinted: 0
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
          {/* ... PIN Modal content same as before ... */}
        </div>
      )}

      {/* Auto-Print Modal */}
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
                    <h3 className="font-semibold text-sm text-black">Impression automatique</h3>
                    <p className="text-xs text-gray-500">Imprimante mobile activée</p>
                  </div>
                </div>
                {!printing && (
                  <button 
                    onClick={() => setShowPrintModal(false)}
                    className="text-gray-400 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {printing ? (
                <div className="py-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 relative">
                      <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full bg-blue-500 flex items-center justify-center">
                        <Printer className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-black mb-2">Impression en cours...</h4>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Impression des 2 copies sur l'imprimante Bluetooth
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${printProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{printProgress}%</p>
                    
                    {printError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{printError}</p>
                        <button
                          onClick={() => {
                            setPrintError('');
                            simulatePrint();
                          }}
                          className="mt-2 text-sm text-blue-600 font-medium"
                        >
                          Réessayer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-bold">L'imprimante mobile va imprimer automatiquement 2 copies :</span>
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium">1</span>
                          </div>
                          <span className="text-sm font-medium">Copie vendeur</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          À signer par {vendeurActif}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium">2</span>
                          </div>
                          <span className="text-sm font-medium">Copie entreprise</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          À signer par le manager
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-700 font-medium mb-1">
                        Numéro de reçu à générer:
                      </p>
                      <p className="text-sm font-bold text-blue-800">
                        {generateReceiptNumber()}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="flex items-start gap-1">
                        <span className="text-green-600">✓</span>
                        <span>L'imprimante Bluetooth doit être connectée</span>
                      </p>
                      <p className="flex items-start gap-1">
                        <span className="text-green-600">✓</span>
                        <span>Papier doit être chargé dans l'imprimante</span>
                      </p>
                      <p className="flex items-start gap-1">
                        <span className="text-green-600">✓</span>
                        <span>2 copies identiques seront imprimées</span>
                      </p>
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
                      Imprimer maintenant
                    </button>
                  </div>
                </>
              )}
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
                      Signez les copies imprimées
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
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-lg font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-black">Signature vendeur</h4>
                        <p className="text-sm text-gray-600">Donnez la COPIE VENDEUR à {vendeurActif}</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Important:</span> Le vendeur doit signer SA copie (pas la vôtre).
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-black">Signature manager</h4>
                        <p className="text-sm text-gray-600">Signez la COPIE ENTREPRISE</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Pour l'archive:</span> Signez avec votre nom complet et titre.
                      </p>
                    </div>
                  </>
                )}
                
                {/* Receipt Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Reçu:</span>
                    <span className="text-sm font-bold">{currentReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
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
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Archive className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Transaction complétée</h3>
                    <p className="text-xs text-gray-500">Archiver la copie entreprise</p>
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Paiement réussi</h4>
                    <p className="text-sm text-gray-600">Les deux copies sont signées</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium mb-1">
                      Copie vendeur → {vendeurActif}
                    </p>
                    <p className="text-xs text-green-700">
                      Le vendeur garde SA copie signée comme preuve
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      Copie entreprise → Archives
                    </p>
                    <p className="text-xs text-blue-700">
                      Archivez la copie signée pour vos dossiers
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Résumé:</p>
                  <div className="flex justify-between mb-1">
                    <span>Reçu:</span>
                    <span className="font-medium">{currentReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant:</span>
                    <span className="font-bold text-green-600">{formatNumber(currentReceipt.shortAmount)} HTG</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleArchiveReceipts}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium active:bg-green-700 flex items-center justify-center gap-2"
              >
                <Archive className="w-4 h-4" />
                Terminer et archiver
              </button>
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
                    <h3 className="font-semibold text-sm text-black">Reçu imprimé</h3>
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
                  <span className="text-sm text-gray-600">Imprimé le:</span>
                  <span className="text-sm font-medium">{formatDate(currentReceipt.printDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Copies imprimées:</span>
                  <span className="text-sm font-medium">{currentReceipt.copiesPrinted}/2</span>
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
              </div>
              
              <button
                onClick={() => {
                  // Re-print the receipt
                  setShowReceiptModal(false);
                  setTimeout(() => {
                    setCurrentAction('markPaid');
                    setShowPrintModal(true);
                    setSignStep('print');
                  }, 300);
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
                            Reçu #{short.receiptNumber}
                          </p>
                          <p className="text-xs text-green-600">
                            Imprimé • {short.copiesPrinted}/2 copies
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleActionClick('viewReceipt', short.id)}
                        className="text-xs text-blue-600 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Payment in Progress */}
                {short.status !== 'paid' && short.receiptPrinted && short.copiesPrinted < 2 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Printer className="w-3.5 h-3.5 text-yellow-600" />
                        <div>
                          <p className="text-xs text-yellow-700 font-medium">
                            Impression incomplète
                          </p>
                          <p className="text-xs text-yellow-600">
                            {short.copiesPrinted}/2 copies imprimées
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleActionClick('continuePayment', short.id)}
                        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Continuer
                      </button>
                    </div>
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
                  {short.status === 'pending' || short.status === 'overdue' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('markPaid', short.id)}
                        className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium active:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Payer & Imprimer
                      </button>
                      {short.status === 'overdue' && (
                        <button 
                          onClick={() => handleActionClick('payrollPayment', short.id)}
                          className="bg-blue-600 text-white py-2 rounded-lg text-xs font-medium active:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Déduire salaire
                        </button>
                      )}
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
                        Détails
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