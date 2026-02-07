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

// Helper function outside the hook
const calculateDenominations = (amount) => {
  const denominations = [
    { name: '1000 HTG', unit: 1000 },
    { name: '500 HTG', unit: 500 },
    { name: '250 HTG', unit: 250 },
    { name: '100 HTG', unit: 100 },
    { name: '50 HTG', unit: 50 },
    { name: '25 HTG', unit: 25 },
  ];

  let remaining = amount;
  const result = [];

  for (const denom of denominations) {
    if (remaining >= denom.unit) {
      const count = Math.floor(remaining / denom.unit);
      if (count > 0) {
        const denomAmount = count * denom.unit;
        result.push({
          name: denom.name,
          unit: denom.unit,
          count: count,
          amount: denomAmount
        });
        remaining -= denomAmount;
      }
    }
  }

  if (remaining > 0) {
    result.push({
      name: 'Centimes',
      unit: remaining,
      count: 1,
      amount: remaining
    });
  }

  return result;
};

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
        photoEvidence: null,
        employeeId: "EMP-001",
        tillNumber: "Caisse 1",
        openingCash: 500000.00,
        expectedCash: 1243526.25,
        managerName: "Jean Pierre",
        witnessName: null,
        companyName: "Station Service Excellence",
        companyAddress: "Rue Capois, Port-au-Prince",
        companyPhone: "+509 44 44 4444",
        companyTaxId: "RCS-PP-B-12345"
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
        photoEvidence: null,
        employeeId: "EMP-001",
        tillNumber: "Caisse 2",
        openingCash: 750000.00,
        expectedCash: 2112200.50,
        managerName: "Marie Claude",
        witnessName: "Paul Joseph",
        companyName: "Station Service Excellence",
        companyAddress: "Rue Capois, Port-au-Prince",
        companyPhone: "+509 44 44 4444",
        companyTaxId: "RCS-PP-B-12345"
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
  const [managerName, setManagerName] = useState('Gérant Station');

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

  // Receipt generation
  const generateReceiptHTML = useCallback((short, receiptNumber, copyNumber) => {
    const currentDate = new Date();
    const printDate = currentDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const getShiftTimes = (shift) => {
      switch(shift) {
        case 'Matin': return '06:00 - 14:00';
        case 'Soir': return '14:00 - 22:00';
        case 'Nuit': return '22:00 - 06:00';
        default: return 'N/A';
      }
    };

    const transactionId = `SHRT${short.id.toString().padStart(6, '0')}${currentDate.getFullYear()}`;
    const nextDueDate = short.dueDate || calculateDueDate(short.date, appSettings.dueDateDays);

    // Simplified HTML for better compatibility
    return `
      <html>
      <head>
        <title>Reçu de Déficit</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            width: 80mm;
            margin: 0 auto;
            padding: 5px;
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            border-bottom: 1px solid #000; 
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .company-name {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .label {
            font-weight: bold;
          }
          .section {
            border-top: 1px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .total-row {
            font-weight: bold;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 5px 0;
            margin: 10px 0;
          }
          .signature-line {
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          .copy-indicator {
            text-align: center;
            font-weight: bold;
            background-color: #000;
            color: white;
            padding: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">STATION SERVICE</div>
          <div>Reçu de Déficit</div>
        </div>
        
        <div class="copy-indicator">
          ${copyNumber === 1 ? 'COPIE VENDEUR' : 'COPIE GÉRANT'}
        </div>
        
        <div class="row">
          <span class="label">Numéro:</span>
          <span>${receiptNumber}</span>
        </div>
        <div class="row">
          <span class="label">Date:</span>
          <span>${printDate}</span>
        </div>
        <div class="row">
          <span class="label">ID Transaction:</span>
          <span>${transactionId}</span>
        </div>
        
        <div class="section">
          <div class="row">
            <span class="label">Vendeur:</span>
            <span>${vendeurActif?.nom || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">ID:</span>
            <span>${short.employeeId || 'EMP-001'}</span>
          </div>
          <div class="row">
            <span class="label">Caisse:</span>
            <span>${short.tillNumber || 'Caisse 1'}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="row">
            <span class="label">Date vente:</span>
            <span>${short.date}</span>
          </div>
          <div class="row">
            <span class="label">Quart:</span>
            <span>${short.shift} (${getShiftTimes(short.shift)})</span>
          </div>
          <div class="row">
            <span class="label">Ventes totales:</span>
            <span>${formatNumber(short.totalSales)} HTG</span>
          </div>
          <div class="row">
            <span class="label">Argent rendu:</span>
            <span>${formatNumber(short.moneyGiven)} HTG</span>
          </div>
        </div>
        
        <div class="total-row row">
          <span class="label">DÉFICIT:</span>
          <span>${formatNumber(short.shortAmount)} HTG</span>
        </div>
        
        ${short.remainingBalance > 0 ? `
        <div class="row">
          <span class="label">Reste à payer:</span>
          <span>${formatNumber(short.remainingBalance)} HTG</span>
        </div>
        <div class="row">
          <span class="label">Date limite:</span>
          <span>${nextDueDate}</span>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="row">
            <span class="label">Mode paiement:</span>
            <span>${paymentMethod === 'cash' ? 'Espèces' : 'Déduction salariale'}</span>
          </div>
          <div class="row">
            <span class="label">Date paiement:</span>
            <span>${printDate.split(' ')[0]}</span>
          </div>
        </div>
        
        <div class="signature-line">
          Signature Vendeur:<br>
          _______________________<br>
          ${vendeurActif?.nom || ''}
        </div>
        
        <div class="signature-line">
          Signature Gérant:<br>
          _______________________<br>
          ${short.managerName || managerName}
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #666;">
          Copie ${copyNumber}/2 • ${printDate}
        </div>
      </body>
      </html>
    `;
  }, [formatNumber, vendeurActif, managerName, appSettings.dueDateDays, paymentMethod]);

  // Print function
  const printReceipt = useCallback(async (short, receiptNumber, copyNumber) => {
    return new Promise((resolve, reject) => {
      try {
        const receiptHTML = generateReceiptHTML(short, receiptNumber, copyNumber);
        
        // Try window.open first (most compatible)
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        
        if (!printWindow) {
          reject(new Error('Veuillez autoriser les pop-ups pour imprimer'));
          return;
        }

        printWindow.document.write(receiptHTML);
        printWindow.document.close();

        // Wait for content to load
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
            
            // Close after printing
            setTimeout(() => {
              printWindow.close();
              resolve(true);
            }, 1000);
            
          } catch (error) {
            console.error('Print error:', error);
            printWindow.close();
            reject(new Error('Erreur lors de l\'impression. Vérifiez votre imprimante.'));
          }
        }, 500);

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

      // Print first copy
      await printReceipt(currentReceipt, receiptNumber, 1);

      // Update state
      setShorts(prev => prev.map(s => 
        s.id === currentReceipt.id 
          ? { 
              ...s, 
              receiptPrinted: true,
              receiptNumber: receiptNumber,
              printDate: new Date().toISOString(),
              copiesPrinted: 1,
              paymentDate: new Date().toISOString(),
              managerName: managerName
            }
          : s
      ));

      // Delay for second print
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Print second copy
      await printReceipt(currentReceipt, receiptNumber, 2);

      // Update state
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
  }, [currentReceipt, generateReceiptNumber, printReceipt, managerName]);

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
      photoEvidence: null,
      employeeId: vendeurActif?.id || 'EMP-001',
      tillNumber: 'Caisse 1',
      openingCash: 500000.00,
      expectedCash: newShort.totalSales,
      managerName: managerName,
      companyName: 'Station Service Excellence',
      companyAddress: 'Rue Capois, Port-au-Prince',
      companyPhone: '+509 44 44 4444',
      companyTaxId: 'RCS-PP-B-12345'
    };

    setShorts(prev => [completeShort, ...prev]);
  }, [appSettings.dueDateDays, vendeurActif, managerName]);

  const updateShort = useCallback((updatedShort) => {
    setShorts(prev => prev.map(s => {
      if (s.id === updatedShort.id) {
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
          paidFromPayroll: false
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

    const byShift = shorts.reduce((acc, short) => {
      acc[short.shift] = (acc[short.shift] || 0) + 1;
      return acc;
    }, {});

    const byStatus = shorts.reduce((acc, short) => {
      acc[short.status] = (acc[short.status] || 0) + 1;
      return acc;
    }, {});

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

  return {
    // State
    shorts,
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
    managerName,
    setManagerName,

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