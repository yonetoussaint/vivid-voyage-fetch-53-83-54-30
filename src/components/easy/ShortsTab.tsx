import React, { useState, useEffect, useRef } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Lock, Bell, Receipt, CalendarDays, Camera, Download, FileText, UserCheck, UserX, Signature } from 'lucide-react';

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
      paymentProof: null,
      vendorSignature: null,
      managerSignature: null,
      paymentDate: null,
      paymentMethod: null,
      receiptNumber: null
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
      daysOverdue: 0,
      paymentProof: 'cash_receipt_001.jpg',
      vendorSignature: 'vendor_sig_001.png',
      managerSignature: 'manager_sig_001.png',
      paymentDate: "2024-02-14 16:30:00",
      paymentMethod: 'cash',
      receiptNumber: 'REC-2024-001'
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
      paymentProof: null,
      vendorSignature: null,
      managerSignature: null,
      paymentDate: null,
      paymentMethod: null,
      receiptNumber: null
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
      paymentProof: null,
      vendorSignature: null,
      managerSignature: null,
      paymentDate: null,
      paymentMethod: null,
      receiptNumber: null
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
      paymentProof: null,
      vendorSignature: null,
      managerSignature: null,
      paymentDate: null,
      paymentMethod: null,
      receiptNumber: null
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShortId, setCurrentShortId] = useState(null);
  const [pinError, setPinError] = useState('');
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [monthlySalary, setMonthlySalary] = useState(15000.00);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [signatureType, setSignatureType] = useState('vendor'); // 'vendor' or 'manager'
  const [signatureData, setSignatureData] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non payé';
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
      setShowPaymentModal(true);
      setPaymentMethod('cash');
    } else if (action === 'cancelPayment') {
      setShowPinModal(true);
    } else if (action === 'payrollPayment') {
      setShowPinModal(true);
    } else if (action === 'viewReceipt') {
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      setShowReceiptModal(true);
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
            managerSignature: 'manager_payroll_sig.png', // Auto-signed by system
            vendorSignature: 'vendor_acknowledge_sig.png' // Would be captured separately
          }
        : short
    ));
  };

  const handleCashPayment = () => {
    const short = shorts.find(s => s.id === currentShortId);
    setCurrentReceipt({
      ...short,
      paymentMethod,
      receiptNumber: generateReceiptNumber(),
      paymentDate: new Date().toISOString()
    });
    setShowPaymentModal(false);
    setShowSignatureModal(true);
    setSignatureType('vendor');
    setSignatureData('');
  };

  const startSignatureCapture = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleSignatureStart = (e) => {
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(
      e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    );
    setIsDrawing(true);
  };

  const handleSignatureMove = (e) => {
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(
      e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    );
    ctx.stroke();
  };

  const handleSignatureEnd = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
    setSignatureData(canvas.toDataURL());
  };

  const completeSignature = () => {
    if (signatureType === 'vendor') {
      // Save vendor signature and ask for manager signature
      const updatedShort = {
        ...currentReceipt,
        vendorSignature: signatureData
      };
      setCurrentReceipt(updatedShort);
      setSignatureType('manager');
      setSignatureData('');
      startSignatureCapture();
    } else {
      // Complete payment with both signatures
      const updatedShort = {
        ...currentReceipt,
        managerSignature: signatureData,
        paymentProof: paymentProof || 'cash_payment_proof.jpg'
      };
      
      setShorts(shorts.map(short => 
        short.id === currentShortId 
          ? { 
              ...short, 
              status: 'paid', 
              paidFromPayroll: false,
              paymentDate: updatedShort.paymentDate,
              paymentMethod: updatedShort.paymentMethod,
              receiptNumber: updatedShort.receiptNumber,
              vendorSignature: updatedShort.vendorSignature,
              managerSignature: updatedShort.managerSignature,
              paymentProof: updatedShort.paymentProof
            }
          : short
      ));
      
      setShowSignatureModal(false);
      setShowProofModal(true);
    }
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
                paymentProof: null,
                vendorSignature: null,
                managerSignature: null,
                paymentDate: null,
                paymentMethod: null,
                receiptNumber: null
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

  const PaymentMethodSelect = () => (
    <div className="space-y-2 mb-4">
      <p className="text-sm font-medium text-gray-700">Mode de paiement:</p>
      <div className="grid grid-cols-2 gap-2">
        {['cash', 'mobile_money', 'bank_transfer', 'check'].map(method => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`p-3 rounded-lg border ${
              paymentMethod === method
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            <div className="text-xs font-medium capitalize">
              {method === 'cash' && 'Espèces'}
              {method === 'mobile_money' && 'Mobile Money'}
              {method === 'bank_transfer' && 'Virement bancaire'}
              {method === 'check' && 'Chèque'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 pb-20 max-w-full overflow-x-hidden min-h-screen bg-white">
      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          {/* ... PIN Modal content same as before ... */}
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Mode de paiement</h3>
                    <p className="text-xs text-gray-500">Sélectionnez comment le vendeur paie</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <PaymentMethodSelect />
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCashPayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-medium active:bg-blue-700"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Capture Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Signature className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">
                      Signature {signatureType === 'vendor' ? 'du vendeur' : 'du manager'}
                    </h3>
                    <p className="text-xs text-gray-500">Signez pour confirmer le paiement</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSignatureModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  {signatureType === 'vendor' 
                    ? `${vendeurActif}, signez pour confirmer le paiement`
                    : 'Manager, signez pour confirmer la réception'}
                </p>
                <div className="bg-gray-100 rounded-lg p-2">
                  <canvas
                    ref={signatureCanvasRef}
                    width={300}
                    height={150}
                    className="w-full h-[150px] bg-white rounded border border-gray-300"
                    onMouseDown={handleSignatureStart}
                    onMouseMove={handleSignatureMove}
                    onMouseUp={handleSignatureEnd}
                    onMouseLeave={handleSignatureEnd}
                    onTouchStart={handleSignatureStart}
                    onTouchMove={handleSignatureMove}
                    onTouchEnd={handleSignatureEnd}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={startSignatureCapture}
                    className="text-xs text-red-600 font-medium"
                  >
                    Effacer
                  </button>
                  <button
                    onClick={completeSignature}
                    disabled={!signatureData}
                    className={`text-xs px-3 py-1 rounded ${
                      signatureData 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {signatureType === 'vendor' ? 'Vendeur a signé' : 'Terminer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Preuve de paiement</h3>
                    <p className="text-xs text-gray-500">Capturez un reçu ou une preuve</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProofModal(false)}
                  className="text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  Prenez une photo du reçu ou téléchargez une preuve de paiement
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-600">Prendre une photo</span>
                  </button>
                  <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-600">Télécharger</span>
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Optionnel: Vous pouvez ajouter la preuve plus tard
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium active:bg-gray-50"
                >
                  Ajouter plus tard
                </button>
                <button
                  onClick={() => {
                    setShowProofModal(false);
                    setCurrentReceipt(currentReceipt);
                    setShowReceiptModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-medium active:bg-blue-700"
                >
                  Voir le reçu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && currentReceipt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black">Reçu de paiement</h3>
                    <p className="text-xs text-gray-500">N° {currentReceipt.receiptNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-gray-100">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowReceiptModal(false)}
                    className="text-gray-400 text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {/* Receipt Header */}
              <div className="text-center mb-6">
                <h2 className="font-bold text-lg text-black">REÇU DE PAIEMENT</h2>
                <p className="text-xs text-gray-500">Station Service Excellence</p>
                <p className="text-xs text-gray-500">Port-au-Prince, Haïti</p>
              </div>
              
              {/* Receipt Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Numéro:</span>
                  <span className="text-sm font-medium">{currentReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{formatDate(currentReceipt.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vendeur:</span>
                  <span className="text-sm font-medium">{vendeurActif}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shift:</span>
                  <span className="text-sm font-medium">{currentReceipt.shift} • {currentReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode de paiement:</span>
                  <span className="text-sm font-medium capitalize">
                    {currentReceipt.paymentMethod === 'cash' && 'Espèces'}
                    {currentReceipt.paymentMethod === 'payroll' && 'Déduction salariale'}
                    {currentReceipt.paymentMethod === 'mobile_money' && 'Mobile Money'}
                    {currentReceipt.paymentMethod === 'bank_transfer' && 'Virement bancaire'}
                  </span>
                </div>
              </div>
              
              {/* Amount Section */}
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-700">Montant payé:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatNumber(currentReceipt.shortAmount)} HTG
                  </span>
                </div>
              </div>
              
              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-2"></div>
                  <p className="text-xs text-gray-600">Signature du vendeur</p>
                  <p className="text-xs text-gray-500">{vendeurActif}</p>
                </div>
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-2"></div>
                  <p className="text-xs text-gray-600">Signature du manager</p>
                  <p className="text-xs text-gray-500">Manager responsable</p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Ce reçu sert de preuve de paiement pour les déficits de caisse.
                  Conservez-le pour vos archives.
                </p>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium active:bg-blue-700"
              >
                Fermer
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
                
                {/* Payment Proof Indicator */}
                {short.status === 'paid' && short.receiptNumber && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700 font-medium">
                            Payé le {formatDate(short.paymentDate)}
                          </p>
                          <p className="text-xs text-green-600">
                            Reçu: {short.receiptNumber}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleActionClick('viewReceipt', short.id)}
                        className="text-xs text-blue-600 font-medium"
                      >
                        Voir
                      </button>
                    </div>
                    
                    {/* Signature Status */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {short.vendorSignature ? (
                          <UserCheck className="w-3 h-3 text-green-500" />
                        ) : (
                          <UserX className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-600">Vendeur</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {short.managerSignature ? (
                          <UserCheck className="w-3 h-3 text-green-500" />
                        ) : (
                          <UserX className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-600">Manager</span>
                      </div>
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
                        Annuler paiement
                      </button>
                      <button 
                        onClick={() => handleActionClick('viewReceipt', short.id)}
                        className="border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium active:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Voir reçu
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