import { useState, useEffect, useCallback } from 'react';

export const useShortsLogic = (vendeurActif) => {
  // Initial state
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
      copiesPrinted: 0,
      partialPayments: [],
      remainingBalance: 13500.00,
      photoEvidence: null
    },
    // ... keep other sample data
  ]);

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

  const [appSettings, setAppSettings] = useState({
    managerPin: '1234',
    monthlySalary: 15000.00,
    dueDateDays: 5,
    autoDeductionDays: 7,
    receiptPrinterSettings: {}
  });

  // Helper functions
  const formatNumber = useCallback((num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  }, []);

  const generateReceiptNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${year}${month}${day}-${random}`;
  }, []);

  // Filter shorts
  const filteredShorts = shorts.filter(short => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return short.status === 'pending';
    if (activeFilter === 'overdue') return short.status === 'overdue';
    if (activeFilter === 'paid') return short.status === 'paid';
    return true;
  });

  // Calculate totals
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
  const remainingPayroll = appSettings.monthlySalary - payrollDeductions;

  // Action handlers
  const handleActionClick = (action, shortId) => {
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
    }
  };

  // Add new short
  const addNewShort = (newShort) => {
    setShorts(prev => [newShort, ...prev]);
  };

  // Update short
  const updateShort = (updatedShort) => {
    setShorts(prev => prev.map(s => s.id === updatedShort.id ? updatedShort : s));
  };

  // Delete short
  const deleteShort = (shortId) => {
    setShorts(prev => prev.filter(s => s.id !== shortId));
  };

  // Partial payment
  const handlePartialPayment = (shortId, amount, notes) => {
    setShorts(prev => prev.map(s => {
      if (s.id === shortId) {
        const partialPayment = {
          id: Date.now(),
          date: new Date().toISOString(),
          amount: amount,
          notes: notes
        };
        const totalPaid = (s.partialPayments || []).reduce((sum, p) => sum + p.amount, 0) + amount;
        const remainingBalance = s.shortAmount - totalPaid;
        
        return {
          ...s,
          partialPayments: [...(s.partialPayments || []), partialPayment],
          remainingBalance: remainingBalance,
          status: remainingBalance === 0 ? 'paid' : s.status
        };
      }
      return s;
    }));
  };

  // Export function
  const exportShorts = (format) => {
    const data = shorts.map(short => ({
      Date: short.date,
      Quart: short.shift,
      'Ventes Totales': short.totalSales,
      'Argent Rendu': short.moneyGiven,
      Déficit: short.shortAmount,
      Statut: short.status,
      Notes: short.notes
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deficits_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Generate statistics
  const generateStatistics = () => {
    const stats = {
      totalShorts: shorts.length,
      totalAmount: totalShort,
      averageShort: shorts.length > 0 ? totalShort / shorts.length : 0,
      byShift: shorts.reduce((acc, short) => {
        acc[short.shift] = (acc[short.shift] || 0) + 1;
        return acc;
      }, {}),
      byStatus: shorts.reduce((acc, short) => {
        acc[short.status] = (acc[short.status] || 0) + 1;
        return acc;
      }, {}),
      recentShorts: shorts.slice(0, 10)
    };
    return stats;
  };

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
    setCurrentReceipt
  };
};