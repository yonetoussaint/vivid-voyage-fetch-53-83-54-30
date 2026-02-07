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
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      copiesPrinted: 0
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
  const [signStep, setSignStep] = useState('print');
  const [printing, setPrinting] = useState(false);
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

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${year}${month}${day}-${random}`;
  };

  // REAL PRINTER IMPLEMENTATION
  const generateReceiptHTML = (short, receiptNumber, copyNumber) => {
    const currentDate = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reçu de Paiement - ${receiptNumber}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
          
          @media print {
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
          }
          
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0 auto;
            padding: 10px;
            font-size: 11px;
            line-height: 1.3;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .receipt-title {
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
          }
          
          .receipt-info {
            margin-bottom: 10px;
          }
          
          .row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          
          .label {
            font-weight: bold;
          }
          
          .section {
            border-top: 1px dashed #000;
            padding-top: 8px;
            margin-top: 8px;
          }
          
          .total-row {
            font-size: 13px;
            font-weight: bold;
            padding: 5px 0;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            margin: 10px 0;
          }
          
          .signature-section {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #000;
          }
          
          .signature-line {
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          
          .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 10px;
          }
          
          .copy-indicator {
            text-align: center;
            font-weight: bold;
            margin: 5px 0;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">STATION SERVICE</div>
          <div>Reçu de Déficit</div>
          <div class="copy-indicator">${copyNumber === 1 ? 'COPIE VENDEUR' : 'COPIE GÉRANT'}</div>
        </div>
        
        <div class="receipt-info">
          <div class="row">
            <span class="label">Numéro:</span>
            <span>${receiptNumber}</span>
          </div>
          <div class="row">
            <span class="label">Date d'impression:</span>
            <span>${currentDate}</span>
          </div>
          <div class="row">
            <span class="label">Vendeur:</span>
            <span>${vendeurActif?.nom || 'N/A'}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="receipt-title">DÉTAILS DU DÉFICIT</div>
          <div class="row">
            <span class="label">Date vente:</span>
            <span>${short.date}</span>
          </div>
          <div class="row">
            <span class="label">Quart:</span>
            <span>${short.shift}</span>
          </div>
          <div class="row">
            <span class="label">Raison:</span>
            <span>${short.notes}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="row">
            <span class="label">Ventes totales:</span>
            <span>${formatNumber(short.totalSales)} HTG</span>
          </div>
          <div class="row">
            <span class="label">Argent rendu:</span>
            <span>${formatNumber(short.moneyGiven)} HTG</span>
          </div>
          <div class="total-row row">
            <span class="label">DÉFICIT:</span>
            <span>${formatNumber(short.shortAmount)} HTG</span>
          </div>
        </div>
        
        <div class="section">
          <div class="row">
            <span class="label">Mode de paiement:</span>
            <span>${paymentMethod === 'cash' ? 'Espèces' : 'Déduction salariale'}</span>
          </div>
          <div class="row">
            <span class="label">Date paiement:</span>
            <span>${currentDate}</span>
          </div>
        </div>
        
        <div class="signature-section">
          <div>
            <div class="label">Signature Vendeur:</div>
            <div class="signature-line">_______________________</div>
          </div>
          
          <div style="margin-top: 20px;">
            <div class="label">Signature Gérant:</div>
            <div class="signature-line">_______________________</div>
          </div>
        </div>
        
        <div class="footer">
          <div>Merci de votre collaboration</div>
          <div style="margin-top: 5px;">Copie ${copyNumber}/2</div>
        </div>
      </body>
      </html>
    `;
  };

  const printReceipt = async (short, receiptNumber, copyNumber) => {
    return new Promise((resolve, reject) => {
      try {
        const receiptHTML = generateReceiptHTML(short, receiptNumber, copyNumber);
        
        // Create a new window with the receipt content
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
          reject(new Error('Veuillez autoriser les pop-ups pour imprimer'));
          return;
        }

        printWindow.document.write(receiptHTML);
        printWindow.document.close();

        // Wait for content to load, then trigger native print
        printWindow.onload = () => {
          setTimeout(() => {
            try {
              // This triggers the native Android/browser print dialog
              printWindow.print();
              
              // Close the print window after a delay
              setTimeout(() => {
                printWindow.close();
                resolve(true);
              }, 1000);
              
            } catch (error) {
              console.error('Print error:', error);
              printWindow.close();
              reject(new Error('Erreur lors de l\'impression. Vérifiez que votre imprimante est connectée.'));
            }
          }, 500);
        };

      } catch (error) {
        console.error('Print setup error:', error);
        reject(new Error('Impossible de préparer l\'impression.'));
      }
    });
  };

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
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      setShowPrintModal(true);
      setSignStep('print');
      setPrinting(false);
      setPrintError('');
    } else if (action === 'payrollPayment') {
      setShowPinModal(true);
    } else if (action === 'cancelPayment') {
      setShowPinModal(true);
    } else if (action === 'viewReceipt') {
      const short = shorts.find(s => s.id === shortId);
      setCurrentReceipt(short);
      setShowReceiptModal(true);
    }
  };

  const handlePrintReceipt = async () => {
    if (!currentReceipt) return;

    setPrinting(true);
    setPrintError('');

    try {
      const receiptNumber = currentReceipt.receiptNumber || generateReceiptNumber();
      
      // Print first copy (vendor copy)
      await printReceipt(currentReceipt, receiptNumber, 1);
      
      // Update state after first print
      setShorts(prev => prev.map(s => 
        s.id === currentReceipt.id 
          ? { 
              ...s, 
              receiptPrinted: true,
              receiptNumber: receiptNumber,
              printDate: new Date().toISOString(),
              copiesPrinted: 1
            }
          : s
      ));

      // Small delay before second print
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Print second copy (manager copy)
      await printReceipt(currentReceipt, receiptNumber, 2);
      
      // Update state after second print
      setShorts(prev => prev.map(s => 
        s.id === currentReceipt.id 
          ? { 
              ...s, 
              copiesPrinted: 2
            }
          : s
      ));

      setPrinting(false);
      setSignStep('vendor_sign');
      
    } catch (error) {
      console.error('Printing failed:', error);
      setPrintError(error.message || 'Erreur lors de l\'impression');
      setPrinting(false);
    }
  };

  const handlePinSubmit = () => {
    const enteredPin = pin.join('');
    const correctPin = '1234';

    if (enteredPin === correctPin) {
      setPinError('');
      setShowPinModal(false);

      if (currentAction === 'payrollPayment') {
        setShorts(prev => prev.map(s => 
          s.id === currentShortId 
            ? { ...s, status: 'paid', paidFromPayroll: true }
            : s
        ));
      } else if (currentAction === 'cancelPayment') {
        setShorts(prev => prev.map(s => 
          s.id === currentShortId 
            ? { 
                ...s, 
                status: s.wasOverdue ? 'overdue' : 'pending',
                receiptPrinted: false,
                receiptNumber: null,
                printDate: null,
                vendorSigned: false,
                managerSigned: false,
                receiptCopyArchived: false,
                copiesPrinted: 0
              }
            : s
        ));
      }

      setPin(['', '', '', '']);
      setActivePinIndex(0);
    } else {
      setPinError('Code PIN incorrect');
      setPin(['', '', '', '']);
      setActivePinIndex(0);
    }
  };

  const handleConfirmVendorSign = () => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { ...s, vendorSigned: true }
        : s
    ));
    setSignStep('manager_sign');
  };

  const handleConfirmManagerSign = () => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { ...s, managerSigned: true }
        : s
    ));
    setSignStep('archive');
  };

  const handleConfirmArchive = () => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { ...s, receiptCopyArchived: true, status: 'paid' }
        : s
    ));
    setShowPrintModal(false);
    setCurrentReceipt(null);
    setSignStep('print');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'paid':
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'overdue':
        return <AlertCircle className="w-3 h-3" />;
      case 'paid':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      case 'paid':
        return 'Payé';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-white border-b border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-600 font-medium">Déficit Total</span>
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-lg font-bold text-red-700">{formatNumber(totalShort)}</p>
          <p className="text-xs text-red-600 mt-0.5">HTG</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-yellow-600 font-medium">En Attente</span>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-lg font-bold text-yellow-700">{formatNumber(pendingShort)}</p>
          <p className="text-xs text-yellow-600 mt-0.5">HTG</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-orange-600 font-medium">En Retard</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-orange-700">{formatNumber(overdueShort)}</p>
          <p className="text-xs text-orange-600 mt-0.5">HTG</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-600 font-medium">Salaire Restant</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-blue-700">{formatNumber(remainingPayroll)}</p>
          <p className="text-xs text-blue-600 mt-0.5">HTG</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-3 bg-white border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeFilter === 'all' 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tous ({shorts.length})
        </button>
        <button 
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeFilter === 'pending' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          En attente ({shorts.filter(s => s.status === 'pending').length})
        </button>
        <button 
          onClick={() => setActiveFilter('overdue')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeFilter === 'overdue' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          En retard ({shorts.filter(s => s.status === 'overdue').length})
        </button>
        <button 
          onClick={() => setActiveFilter('paid')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeFilter === 'paid' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Payés ({shorts.filter(s => s.status === 'paid').length})
        </button>
      </div>

      {/* Shorts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                {short.dueDate && (
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
                )}

                {/* Notes */}
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
                {short.status === 'paid' && short.receiptNumber && (
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

      {/* Print Modal */}
      {showPrintModal && currentReceipt && (
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
                      onClick={() => {
                        setShowPrintModal(false);
                        setCurrentReceipt(null);
                      }}
                      className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handlePrintReceipt}
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
                    onClick={handleConfirmVendorSign}
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
                    onClick={handleConfirmManagerSign}
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
                    onClick={handleConfirmArchive}
                    className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-medium"
                  >
                    Copie archivée - Terminer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
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
                  onClick={() => {
                    setShowPinModal(false);
                    setPin(['', '', '', '']);
                    setPinError('');
                    setActivePinIndex(0);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {showReceiptModal && currentReceipt && (
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
                onClick={() => {
                  setShowReceiptModal(false);
                  setCurrentReceipt(null);
                }}
                className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center active:bg-gray-800 active:scale-95 transition-all shadow-lg">
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
    </div>
  );
};

export default ShortsTab;
