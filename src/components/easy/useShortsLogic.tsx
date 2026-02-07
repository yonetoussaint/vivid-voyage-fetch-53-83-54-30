import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  DEFAULT_SETTINGS, 
  STATUS, 
  formatNumber as formatNumberHelper,
  generateReceiptNumber as generateReceiptNumberHelper,
  calculateDueDate,
  filterShortsByStatus,
  calculateSummary,
  STORAGE_KEYS,
  SHIFTS,
  PAYMENT_METHODS
} from './constants';

export const useShortsLogic = (vendeurActif) => {
  // Load data from localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return defaultValue;
    }
  };

  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  // Initial state with localStorage
  const [shorts, setShorts] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SHORTS, [
      {
        id: 1,
        date: "15 Fév, 24",
        dueDate: "20 Fév, 24",
        shift: "Matin",
        totalSales: 1243526.25,
        moneyGiven: 1230026.25,
        shortAmount: 13500.00,
        status: STATUS.OVERDUE,
        originalStatus: STATUS.PENDING,
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
        copiesPrinted: 0,
        partialPayments: [],
        remainingBalance: 13500.00,
        photoEvidence: null
      },
      {
        id: 2,
        date: "14 Fév, 24",
        dueDate: "19 Fév, 24",
        shift: "Soir",
        totalSales: 2112200.50,
        moneyGiven: 2110000.50,
        shortAmount: 2200.00,
        status: STATUS.PAID,
        originalStatus: STATUS.PAID,
        wasOverdue: false,
        notes: "Erreur de caisse",
        paidFromPayroll: false,
        daysOverdue: 0,
        receiptPrinted: true,
        receiptNumber: 'REC-20240214-001',
        printDate: '2024-02-14T16:45:00',
        vendorSigned: true,
        managerSigned: true,
        receiptCopyArchived: true,
        copiesPrinted: 2,
        partialPayments: [],
        remainingBalance: 0,
        photoEvidence: null
      },
      {
        id: 3,
        date: "12 Fév, 24",
        dueDate: "17 Fév, 24",
        shift: "Matin",
        totalSales: 1894500.75,
        moneyGiven: 1890500.75,
        shortAmount: 4000.00,
        status: STATUS.OVERDUE,
        originalStatus: STATUS.PENDING,
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
        copiesPrinted: 0,
        partialPayments: [],
        remainingBalance: 4000.00,
        photoEvidence: null
      },
      {
        id: 4,
        date: "10 Fév, 24",
        dueDate: "15 Fév, 24",
        shift: "Nuit",
        totalSales: 1560000.00,
        moneyGiven: 1560000.00,
        shortAmount: 0.00,
        status: STATUS.PAID,
        originalStatus: STATUS.PAID,
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
        copiesPrinted: 0,
        partialPayments: [],
        remainingBalance: 0,
        photoEvidence: null
      },
      {
        id: 5,
        date: "8 Fév, 24",
        dueDate: "13 Fév, 24",
        shift: "Soir",
        totalSales: 2783300.25,
        moneyGiven: 2780000.25,
        shortAmount: 3300.00,
        status: STATUS.OVERDUE,
        originalStatus: STATUS.PENDING,
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
        copiesPrinted: 0,
        partialPayments: [],
        remainingBalance: 3300.00,
        photoEvidence: null
      }
    ])
  );

  const [appSettings, setAppSettings] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // Modal states
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPartialPaymentModal, setShowPartialPaymentModal] = useState(false);
  
  // Action states
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShortId, setCurrentShortId] = useState(null);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [signStep, setSignStep] = useState('print');
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Save to localStorage when data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHORTS, shorts);
  }, [shorts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, appSettings);
  }, [appSettings]);

  // Helper functions
  const formatNumber = useCallback((num) => {
    return formatNumberHelper(num);
  }, []);

  const generateReceiptNumber = useCallback(() => {
    return generateReceiptNumberHelper();
  }, []);

  const calculateDaysOverdue = useCallback((dueDate) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  // Update overdue status daily
  useEffect(() => {
    const interval = setInterval(() => {
      setShorts(prev => prev.map(short => {
        if (short.status === STATUS.PENDING && short.dueDate) {
          const daysOverdue = calculateDaysOverdue(short.dueDate);
          if (daysOverdue > 0) {
            return {
              ...short,
              status: STATUS.OVERDUE,
              daysOverdue,
              wasOverdue: true
            };
          }
        }
        return short;
      }));
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [calculateDaysOverdue]);

  // Filter shorts
  const filteredShorts = useMemo(() => {
    return filterShortsByStatus(shorts, activeFilter);
  }, [shorts, activeFilter]);

  // Calculate totals
  const { total: totalShort, pending: pendingShort, overdue: overdueShort } = useMemo(() => {
    return calculateSummary(shorts);
  }, [shorts]);

  const payrollDeductions = useMemo(() => {
    return shorts
      .filter(short => short.paidFromPayroll)
      .reduce((sum, short) => sum + short.shortAmount, 0);
  }, [shorts]);

  const remainingPayroll = useMemo(() => {
    return appSettings.monthlySalary - payrollDeductions;
  }, [appSettings.monthlySalary, payrollDeductions]);

  // Action handlers
  const handleActionClick = useCallback((action, shortId) => {
    setCurrentAction(action);
    setCurrentShortId(shortId);
    const short = shorts.find(s => s.id === shortId);

    switch (action) {
      case 'markPaid':
        setCurrentReceipt(short);
        setShowPrintModal(true);
        setSignStep('print');
        setPrinting(false);
        setPrintError('');
        break;
      case 'payrollPayment':
      case 'cancelPayment':
        setShowPinModal(true);
        break;
      case 'viewReceipt':
        setCurrentReceipt(short);
        setShowReceiptModal(true);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }, [shorts]);

  const handlePinSubmit = useCallback(() => {
    const enteredPin = pin.join('');
    const correctPin = appSettings.managerPin || '1234';

    if (enteredPin === correctPin) {
      setPinError('');
      setShowPinModal(false);

      if (currentAction === 'payrollPayment') {
        setShorts(prev => prev.map(s => 
          s.id === currentShortId 
            ? { 
                ...s, 
                status: STATUS.PAID, 
                paidFromPayroll: true,
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
      } else if (currentAction === 'cancelPayment') {
        setShorts(prev => prev.map(s => 
          s.id === currentShortId 
            ? { 
                ...s, 
                status: s.wasOverdue ? STATUS.OVERDUE : STATUS.PENDING,
                receiptPrinted: false,
                receiptNumber: null,
                printDate: null,
                vendorSigned: false,
                managerSigned: false,
                receiptCopyArchived: false,
                copiesPrinted: 0,
                paidFromPayroll: false
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
  }, [pin, appSettings.managerPin, currentAction, currentShortId]);

  const generateReceiptHTML = useCallback((short, receiptNumber, copyNumber) => {
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
  }, [formatNumber, vendeurActif, paymentMethod]);

  const printReceipt = useCallback(async (short, receiptNumber, copyNumber) => {
    return new Promise((resolve, reject) => {
      try {
        const receiptHTML = generateReceiptHTML(short, receiptNumber, copyNumber);
        
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
          reject(new Error('Veuillez autoriser les pop-ups pour imprimer'));
          return;
        }

        printWindow.document.write(receiptHTML);
        printWindow.document.close();

        printWindow.onload = () => {
          setTimeout(() => {
            try {
              printWindow.print();
              
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
  }, [generateReceiptHTML]);

  const handlePrintReceipt = useCallback(async () => {
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
  }, [currentReceipt, generateReceiptNumber, printReceipt]);

  const handleConfirmVendorSign = useCallback(() => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { ...s, vendorSigned: true }
        : s
    ));
    setSignStep('manager_sign');
  }, [currentReceipt]);

  const handleConfirmManagerSign = useCallback(() => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { ...s, managerSigned: true }
        : s
    ));
    setSignStep('archive');
  }, [currentReceipt]);

  const handleConfirmArchive = useCallback(() => {
    setShorts(prev => prev.map(s => 
      s.id === currentReceipt.id 
        ? { 
            ...s, 
            receiptCopyArchived: true, 
            status: STATUS.PAID,
            remainingBalance: 0,
            partialPayments: s.partialPayments.length > 0 ? s.partialPayments : [{
              id: Date.now(),
              date: new Date().toISOString(),
              amount: s.shortAmount - (s.remainingBalance || 0),
              notes: 'Paiement complet'
            }]
          }
        : s
    ));
    setShowPrintModal(false);
    setCurrentReceipt(null);
    setSignStep('print');
  }, [currentReceipt]);

  // CRUD operations
  const addNewShort = useCallback((newShort) => {
    // Calculate due date based on settings
    const dueDate = calculateDueDate(newShort.date, appSettings.dueDateDays);
    
    const completeShort = {
      ...newShort,
      id: Date.now(),
      dueDate,
      status: STATUS.PENDING,
      originalStatus: STATUS.PENDING,
      wasOverdue: false,
      paidFromPayroll: false,
      daysOverdue: 0,
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      copiesPrinted: 0,
      partialPayments: [],
      remainingBalance: newShort.shortAmount,
      photoEvidence: null
    };

    setShorts(prev => [completeShort, ...prev]);
  }, [appSettings.dueDateDays]);

  const updateShort = useCallback((updatedShort) => {
    setShorts(prev => prev.map(s => {
      if (s.id === updatedShort.id) {
        // Recalculate remaining balance based on partial payments
        const totalPaid = (s.partialPayments || []).reduce((sum, p) => sum + p.amount, 0);
        const remainingBalance = Math.max(0, updatedShort.shortAmount - totalPaid);
        
        return {
          ...updatedShort,
          remainingBalance,
          status: remainingBalance === 0 ? STATUS.PAID : 
                  remainingBalance < updatedShort.shortAmount ? STATUS.PENDING : 
                  s.status
        };
      }
      return s;
    }));
  }, []);

  const deleteShort = useCallback((shortId) => {
    setShorts(prev => prev.filter(s => s.id !== shortId));
  }, []);

  const handlePartialPayment = useCallback((shortId, amount, notes) => {
    setShorts(prev => prev.map(s => {
      if (s.id === shortId) {
        const partialPayment = {
          id: Date.now(),
          date: new Date().toISOString(),
          amount: amount,
          notes: notes || 'Paiement partiel'
        };
        const totalPaid = (s.partialPayments || []).reduce((sum, p) => sum + p.amount, 0) + amount;
        const remainingBalance = Math.max(0, s.shortAmount - totalPaid);
        const newStatus = remainingBalance === 0 ? STATUS.PAID : 
                         s.status === STATUS.PAID ? STATUS.PENDING : 
                         s.status;
        
        return {
          ...s,
          partialPayments: [...(s.partialPayments || []), partialPayment],
          remainingBalance,
          status: newStatus,
          paidFromPayroll: false // Reset payroll deduction when making partial payment
        };
      }
      return s;
    }));
  }, []);

  const exportShorts = useCallback((filteredShorts, format) => {
    const data = filteredShorts.map(short => ({
      ID: short.id,
      Date: short.date,
      'Date limite': short.dueDate || 'N/A',
      Quart: short.shift,
      'Ventes Totales': short.totalSales,
      'Argent Rendu': short.moneyGiven,
      Déficit: short.shortAmount,
      'Reste à payer': short.remainingBalance || short.shortAmount,
      Statut: short.status,
      Notes: short.notes,
      'Numéro reçu': short.receiptNumber || 'N/A',
      'Imprimé le': short.printDate ? new Date(short.printDate).toLocaleString('fr-FR') : 'N/A'
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deficits_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // For Excel, we can use CSV with .xls extension (simple approach)
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deficits_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const generateStatistics = useCallback(() => {
    if (shorts.length === 0) {
      return {
        totalShorts: 0,
        totalAmount: 0,
        averageShort: 0,
        byShift: {},
        byStatus: {},
        recentShorts: [],
        monthlyTrend: []
      };
    }

    const totalAmount = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
    const averageShort = totalAmount / shorts.length;

    // Group by shift
    const byShift = shorts.reduce((acc, short) => {
      acc[short.shift] = (acc[short.shift] || 0) + 1;
      return acc;
    }, {});

    // Group by status
    const byStatus = shorts.reduce((acc, short) => {
      acc[short.status] = (acc[short.status] || 0) + 1;
      return acc;
    }, {});

    // Monthly trend
    const monthlyTrend = shorts
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
      .map(short => ({
        ...short,
        shortAmount: formatNumber(short.shortAmount)
      }));

    return {
      totalShorts: shorts.length,
      totalAmount,
      averageShort,
      byShift,
      byStatus,
      recentShorts: shorts.slice(0, 5),
      monthlyTrend
    };
  }, [shorts, formatNumber]);

  // Reset PIN input
  const resetPin = useCallback(() => {
    setPin(['', '', '', '']);
    setPinError('');
    setActivePinIndex(0);
  }, []);

  // Get short by ID
  const getShortById = useCallback((id) => {
    return shorts.find(s => s.id === id);
  }, [shorts]);

  // Get shorts by vendor
  const getShortsByVendor = useCallback((vendorId) => {
    // Currently all shorts are for the active vendor
    // In a multi-vendor system, you would filter by vendorId
    return shorts;
  }, [shorts]);

  // Calculate vendor performance
  const calculateVendorPerformance = useCallback(() => {
    const totalDeficit = totalShort;
    const deficitCount = shorts.length;
    const paidCount = shorts.filter(s => s.status === STATUS.PAID).length;
    const paidPercentage = deficitCount > 0 ? (paidCount / deficitCount) * 100 : 0;
    
    return {
      totalDeficit,
      deficitCount,
      paidCount,
      paidPercentage,
      averageDeficit: deficitCount > 0 ? totalDeficit / deficitCount : 0
    };
  }, [totalShort, shorts]);

  return {
    // State
    shorts,
    setShorts,
    filteredShorts,
    totalShort,
    pendingShort,
    overdueShort,
    monthlySalary: appSettings.monthlySalary,
    payrollDeductions,
    remainingPayroll,
    activeFilter,
    setActiveFilter,
    currentAction,
    currentShortId,
    currentReceipt,
    showPinModal,
    showPrintModal,
    showReceiptModal,
    showAddModal,
    showEditModal,
    showSettingsModal,
    showStatsModal,
    showExportModal,
    showPartialPaymentModal,
    pin,
    setPin,
    pinError,
    setPinError,
    activePinIndex,
    setActivePinIndex,
    signStep,
    setSignStep,
    printing,
    setPrinting,
    printError,
    setPrintError,
    paymentMethod,
    setPaymentMethod,
    
    // Methods
    formatNumber,
    handleActionClick,
    handlePinSubmit,
    handlePrintReceipt,
    handleConfirmVendorSign,
    handleConfirmManagerSign,
    handleConfirmArchive,
    addNewShort,
    updateShort,
    deleteShort,
    handlePartialPayment,
    exportShorts,
    appSettings,
    updateSettings,
    generateStatistics,
    resetPin,
    getShortById,
    getShortsByVendor,
    calculateVendorPerformance,
    
    // Modal controllers
    setShowPinModal,
    setShowPrintModal,
    setShowReceiptModal,
    setShowAddModal,
    setShowEditModal,
    setShowSettingsModal,
    setShowStatsModal,
    setShowExportModal,
    setShowPartialPaymentModal,
    setCurrentReceipt,
    setCurrentShortId,
    setCurrentAction
  };
};