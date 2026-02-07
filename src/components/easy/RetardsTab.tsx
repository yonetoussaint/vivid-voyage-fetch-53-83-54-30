import React, { useState, useRef, useEffect } from 'react';
import { Plus, Clock, AlertCircle, DollarSign, Calendar, X, CheckCircle, Lock, Receipt, FileText, Download, History, Printer, Zap } from 'lucide-react';

const RetardsTab = ({ currentSeller }) => {
  const [lateEntries, setLateEntries] = useState([
    { 
      id: 1, 
      date: '2024-01-15', 
      time: '08:45', 
      penalty: 500, 
      dueDate: '2024-01-20', // 5 days after 15th
      status: 'pending', 
      overdue: 6, // More than 5 days overdue
      paymentDate: null, 
      receiptId: null,
      createdAt: '2024-01-15T08:45:00'
    },
    { 
      id: 2, 
      date: '2024-01-10', 
      time: '08:30', 
      penalty: 500, 
      dueDate: '2024-01-15', 
      status: 'paid', 
      overdue: 0, 
      paymentDate: '2024-01-12', 
      receiptId: 'REC-001',
      createdAt: '2024-01-10T08:30:00'
    },
    { 
      id: 3, 
      date: '2024-01-05', 
      time: '08:15', 
      penalty: 500, 
      dueDate: '2024-01-10', 
      status: 'deducted', 
      overdue: 2, // Was 2 days overdue before deduction
      paymentDate: '2024-01-12', 
      receiptId: 'SAL-001',
      createdAt: '2024-01-05T08:15:00'
    },
    { 
      id: 4, 
      date: '2024-01-18', 
      time: '08:50', 
      penalty: 500, 
      dueDate: '2024-01-23', 
      status: 'pending', 
      overdue: 0, // Still within 5 days
      paymentDate: null, 
      receiptId: null,
      createdAt: '2024-01-18T08:50:00'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const [showDeductionPreview, setShowDeductionPreview] = useState(false);
  const [showReceiptView, setShowReceiptView] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pin, setPin] = useState('');
  const [newEntry, setNewEntry] = useState({
    date: '',
    time: ''
  });

  const receiptRef = useRef(null);

  // Calculate overdue days automatically and auto-deduct after 5+ days
  useEffect(() => {
    const checkOverdueEntries = () => {
      const today = new Date();
      const updatedEntries = lateEntries.map(entry => {
        if (entry.status === 'pending') {
          const dueDate = new Date(entry.dueDate);
          const timeDiff = today - dueDate;
          const daysOverdue = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
          
          // Auto-deduct if more than 5 days overdue
          if (daysOverdue > 5 && entry.status === 'pending') {
            return {
              ...entry,
              overdue: daysOverdue,
              status: 'deducted',
              paymentDate: new Date().toISOString(),
              receiptId: `AUTO-${Date.now().toString().slice(-6)}`
            };
          }
          
          return { ...entry, overdue: daysOverdue };
        }
        return entry;
      });
      
      setLateEntries(updatedEntries);
    };
    
    checkOverdueEntries();
  }, []); // Run once on component mount

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert 24h to 12h AM/PM format
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get current time in 12-hour AM/PM format
  const getCurrentTime12Hour = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Convert 12-hour AM/PM to 24-hour format for storage
  const convert12To24Hour = (time12) => {
    if (!time12) return '';
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12;
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Quick add with current date and time
  const handleQuickAdd = () => {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 5); // 5 days deadline
    
    // Get current time in 12-hour format for display
    const displayTime = getCurrentTime12Hour();
    // Convert to 24-hour format for storage
    const storageTime = convert12To24Hour(displayTime);
    
    const entry = {
      id: lateEntries.length + 1,
      date: getCurrentDate(), // Current date
      time: storageTime, // Store in 24h format
      displayTime: displayTime, // Keep 12h format for display
      penalty: 500,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
      overdue: 0,
      paymentDate: null,
      receiptId: null,
      createdAt: new Date().toISOString()
    };
    setLateEntries([entry, ...lateEntries]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear().toString().slice(-2);
    return `${dayName}. ${day} ${month}, ${year}`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalPenalty = () => {
    return lateEntries
      .filter(entry => entry.status === 'pending')
      .reduce((total, entry) => total + entry.penalty, 0);
  };

  const calculateMonthlyDeduction = () => {
    const deductedEntries = lateEntries.filter(entry => entry.status === 'deducted');
    return deductedEntries.reduce((total, entry) => total + entry.penalty, 0);
  };

  const calculateTotalPaid = () => {
    const paidEntries = lateEntries.filter(entry => entry.status === 'paid');
    return paidEntries.reduce((total, entry) => total + entry.penalty, 0);
  };

  const handleAddEntry = () => {
    const today = new Date(newEntry.date || getCurrentDate());
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 5); // 5 days deadline
    
    // Use entered time or current time
    let timeToStore = newEntry.time;
    let displayTime = newEntry.time;
    
    // If time is entered in 12h format, convert to 24h
    if (newEntry.time && (newEntry.time.includes('AM') || newEntry.time.includes('PM'))) {
      timeToStore = convert12To24Hour(newEntry.time);
    } else if (!newEntry.time) {
      // If no time entered, use current time
      displayTime = getCurrentTime12Hour();
      timeToStore = convert12To24Hour(displayTime);
    } else {
      // If time is in 24h format, convert to 12h for display
      displayTime = formatTimeTo12Hour(newEntry.time);
    }
    
    const entry = {
      id: lateEntries.length + 1,
      date: newEntry.date || getCurrentDate(),
      time: timeToStore,
      displayTime: displayTime,
      penalty: 500,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
      overdue: 0,
      paymentDate: null,
      receiptId: null,
      createdAt: new Date().toISOString()
    };
    setLateEntries([entry, ...lateEntries]);
    setShowAddForm(false);
    setNewEntry({ date: '', time: '' });
  };

  const handleMarkAsPaid = (id) => {
    setSelectedEntry(id);
    setSelectedAction('markPaid');
    setShowPinForm(true);
  };

  const handleDeductFromPayroll = (id) => {
    setSelectedEntry(id);
    setSelectedAction('deductPayroll');
    setShowDeductionPreview(true);
  };

  const confirmDeduction = () => {
    setShowDeductionPreview(false);
    setShowPinForm(true);
  };

  const verifyPin = () => {
    const correctPin = '1234';
    if (pin === correctPin) {
      if (selectedAction === 'markPaid' && selectedEntry) {
        const receiptId = `REC-${Date.now().toString().slice(-6)}`;
        setLateEntries(entries =>
          entries.map(entry =>
            entry.id === selectedEntry ? { 
              ...entry, 
              status: 'paid',
              paymentDate: new Date().toISOString(),
              receiptId: receiptId
            } : entry
          )
        );
      } else if (selectedAction === 'deductPayroll' && selectedEntry) {
        const receiptId = `SAL-${Date.now().toString().slice(-6)}`;
        setLateEntries(entries =>
          entries.map(entry =>
            entry.id === selectedEntry ? { 
              ...entry, 
              status: 'deducted',
              paymentDate: new Date().toISOString(),
              receiptId: receiptId
            } : entry
          )
        );
      }
      setShowPinForm(false);
      setPin('');
      setSelectedAction(null);
      setSelectedEntry(null);
    } else {
      alert('PIN incorrect');
      setPin('');
    }
  };

  const viewReceipt = (receiptId) => {
    setShowReceiptView(receiptId);
  };

  // Android printing function
  const printReceiptAndroid = (receiptId) => {
    const entry = lateEntries.find(e => e.receiptId === receiptId);
    if (!entry) return;

    const receiptData = generateReceiptData(entry);
    
    if (window.Android && window.Android.printReceipt) {
      window.Android.printReceipt(JSON.stringify(receiptData));
    } else if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PRINT_RECEIPT',
        data: receiptData
      }));
    } else {
      window.print();
    }
  };

  const generateReceiptData = (entry) => {
    const displayTime = entry.displayTime || formatTimeTo12Hour(entry.time);
    return {
      header: "STATION ESSENCE PETROVILLE",
      subHeader: "Reçu de Paiement",
      receiptId: entry.receiptId,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      vendorName: "Vendeur: " + (currentSeller?.name || "N/A"),
      transactionType: entry.receiptId.startsWith('REC') ? "Paiement Direct" : "Retenue Salaire",
      amount: "500 GDS",
      description: `Retard du ${formatDate(entry.date)} à ${displayTime}`,
      footer: "Merci de votre visite",
      qrCode: `STATION-${entry.receiptId}-500GDS`,
      separator: "--------------------------------",
      total: "500 GDS",
      signature: "Signature: __________",
      timestamp: new Date().toISOString()
    };
  };

  // HTML receipt for printing
  const renderPrintableReceipt = (receiptId) => {
    const entry = lateEntries.find(e => e.receiptId === receiptId);
    if (!entry) return null;

    const receiptData = generateReceiptData(entry);

    return (
      <div ref={receiptRef} className="p-4 bg-white" style={{ width: '80mm' }}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-receipt, #printable-receipt * {
                visibility: visible;
              }
              #printable-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                font-size: 12px;
                font-family: 'Courier New', monospace;
              }
            }
          `}
        </style>
        
        <div id="printable-receipt">
          <div className="text-center mb-2">
            <h2 className="font-bold text-lg">STATION ESSENCE PETROVILLE</h2>
            <p className="text-sm">Reçu de Paiement</p>
            <p className="text-xs">Tél: +509 48 00 0000</p>
          </div>
          
          <div className="border-t border-b border-black py-1 my-2 text-center">
            <p className="font-bold">{receiptData.receiptId}</p>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{receiptData.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Heure:</span>
              <span className="font-medium">{receiptData.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{receiptData.transactionType}</span>
            </div>
            <div className="flex justify-between">
              <span>Vendeur:</span>
              <span className="font-medium">{receiptData.vendorName.replace('Vendeur: ', '')}</span>
            </div>
            
            <div className="my-2 border-t border-dashed border-gray-400 pt-2">
              <div className="text-center font-bold">Détails de la pénalité</div>
              <p className="text-center">{receiptData.description}</p>
            </div>
            
            <div className="border-t border-black pt-2">
              <div className="flex justify-between font-bold">
                <span>MONTANT:</span>
                <span>{receiptData.amount}</span>
              </div>
            </div>
            
            <div className="my-2 text-center border border-dashed border-gray-400 p-1">
              <p className="text-xs">Code: {receiptData.qrCode}</p>
            </div>
            
            <div className="text-center mt-4">
              <p className="font-bold">{receiptData.footer}</p>
              <p className="text-xs mt-2">***************************</p>
            </div>
            
            <div className="mt-4 pt-2 border-t border-black">
              <p className="text-xs text-center">
                {receiptData.signature}<br/>
                Cachet de la station
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate statistics with CORRECT LOGIC
  const totalPending = calculateTotalPenalty();
  const totalDeducted = calculateMonthlyDeduction();
  const totalPaid = calculateTotalPaid();
  const monthlySalary = 15000;
  
  // CORRECT NET SALARY CALCULATION:
  // Base salary MINUS already deducted MINUS pending to deduct
  const netSalary = monthlySalary - totalDeducted - totalPending;
  
  const pendingCount = lateEntries.filter(e => e.status === 'pending').length;
  const deductedCount = lateEntries.filter(e => e.status === 'deducted').length;
  const paidCount = lateEntries.filter(e => e.status === 'paid').length;

  // Get overdue status color
  const getOverdueColor = (daysOverdue) => {
    if (daysOverdue === 0) return 'text-green-600';
    if (daysOverdue <= 2) return 'text-amber-600';
    if (daysOverdue <= 4) return 'text-orange-600';
    return 'text-red-600 font-bold';
  };

  // Format time for display (use displayTime if available, otherwise convert from 24h)
  const getDisplayTime = (entry) => {
    return entry.displayTime || formatTimeTo12Hour(entry.time);
  };

  return (
    <div className="p-3 space-y-3 min-h-screen">
      {/* Receipt Viewer Modal */}
      {showReceiptView && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Reçu de paiement</h3>
              </div>
              <button 
                onClick={() => setShowReceiptView(false)} 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Printable Receipt */}
              {renderPrintableReceipt(showReceiptView)}
              
              {/* Mobile-friendly print buttons */}
              <div className="space-y-2">
                <button 
                  onClick={() => printReceiptAndroid(showReceiptView)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base active:scale-95 transition-transform"
                >
                  <Printer className="w-5 h-5" />
                  Imprimer sur Android
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-base active:scale-95 transition-transform"
                >
                  <Download className="w-5 h-5" />
                  Imprimer dans le navigateur
                </button>
                
                <button 
                  onClick={() => setShowReceiptView(false)}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-base active:scale-95 transition-transform"
                >
                  Retour
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded-lg">
                <p>📱 Optimisé pour mobile</p>
                <p>Taille ticket: 80mm (Imprimante thermique)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deduction Preview Modal */}
      {showDeductionPreview && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">Aperçu de la retenue</h3>
              </div>
              <button onClick={() => setShowDeductionPreview(false)} className="text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-center mb-2">
                  <div className="text-red-700 font-bold text-lg">500 GDS</div>
                  <div className="text-red-600 text-sm">à retenir sur salaire</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaire de base:</span>
                    <span className="font-medium">15,000 GDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Déjà retenu:</span>
                    <span className="font-bold text-blue-600">-{totalDeducted} GDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">À retenir total:</span>
                    <span className="font-bold text-red-600">-{totalPending + 500} GDS</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="font-medium">Salaire net après retenue:</span>
                    <span className="font-bold text-green-700">
                      {15000 - totalDeducted - (totalPending + 500)} GDS
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <button
                  onClick={confirmDeduction}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg active:scale-95 transition-transform"
                >
                  Confirmer la retenue
                </button>
                <button
                  onClick={() => setShowDeductionPreview(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg active:scale-95 transition-transform"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIN Verification Modal */}
      {showPinForm && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Vérification requise</h3>
              </div>
              <button onClick={() => {
                setShowPinForm(false);
                setPin('');
                setSelectedAction(null);
                setSelectedEntry(null);
              }} className="text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700 text-sm">
                {selectedAction === 'markPaid' 
                  ? 'Marquer 500 GDS comme payés ?' 
                  : 'Confirmer la retenue de 500 GDS sur salaire ?'}
              </p>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">Entrez votre PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl"
                  maxLength={4}
                  placeholder="0000"
                  autoFocus
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={verifyPin}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg active:scale-95 transition-transform"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Add Button */}
      <button
        onClick={handleQuickAdd}
        className="fixed bottom-24 right-6 z-20 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        <Zap className="w-6 h-6" />
      </button>

      {/* Floating Add Form Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Nouveau retard</h3>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date || getCurrentDate()}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Date actuelle: {formatDate(getCurrentDate())}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-700">Heure d'arrivée</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setNewEntry({...newEntry, time: getCurrentTime12Hour()})}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                    >
                      Maintenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewEntry({...newEntry, time: '08:45 AM'})}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      08:45
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  placeholder="Ex: 08:45 AM ou 2:30 PM"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: HH:MM AM/PM • Heure actuelle: {getCurrentTime12Hour()}
                </p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
                  <span className="text-sm text-red-800">Pénalité fixe:</span>
                  <span className="font-bold text-red-600">500 GDS</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  ⚠️ Délai de paiement: 5 jours. Après, retenue automatique sur salaire.
                </p>
                <button
                  onClick={handleAddEntry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg active:scale-95 transition-transform"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats - CORRECT CALCULATIONS */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-600 text-xs">Total retards</p>
          <p className="font-bold text-gray-900 text-lg">{lateEntries.length}</p>
          <p className="text-gray-500 text-xs">{pendingCount} en attente</p>
        </div>
        <div className="bg-red-50 p-2 rounded-lg">
          <p className="text-red-600 text-xs">À retenir</p>
          <p className="font-bold text-red-700 text-lg">{totalPending} GDS</p>
          <p className="text-red-500 text-xs">{pendingCount} retards</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg">
          <p className="text-blue-600 text-xs">Déjà retenu</p>
          <p className="font-bold text-blue-700 text-lg">{totalDeducted} GDS</p>
          <p className="text-blue-500 text-xs">{deductedCount} retenues</p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg">
          <p className="text-green-600 text-xs">Salaire net</p>
          <p className="font-bold text-green-700 text-lg">{netSalary} GDS</p>
          <p className="text-green-500 text-xs">{((netSalary / 15000) * 100).toFixed(0)}% du salaire</p>
        </div>
      </div>

      {/* Auto-deduction Warning */}
      {lateEntries.some(entry => entry.status === 'pending' && entry.overdue >= 5) && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">RETENUE AUTOMATIQUE ACTIVÉE</p>
              <p className="text-xs opacity-90">
                {lateEntries.filter(e => e.status === 'pending' && e.overdue >= 5).length} 
                retards de +5 jours seront retenus sur salaire
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Late Entries */}
      <div className="space-y-2">
        {lateEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-2">
            {/* First Row */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-900">
                  {formatDate(entry.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {entry.status === 'paid' ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    <CheckCircle className="w-3 h-3" />
                    Payé
                  </span>
                ) : entry.status === 'deducted' ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    <Receipt className="w-3 h-3" />
                    Retenu
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    <AlertCircle className="w-3 h-3" />
                    À payer
                  </span>
                )}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{getDisplayTime(entry)}</span>
                <span className="text-gray-500 text-sm">(prévu 8:00 AM)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-600">500 GDS</span>
              </div>
            </div>

            {/* Third Row - Due Date with Color Coding */}
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Échéance:</span>
                <span className="font-medium">{formatDate(entry.dueDate)}</span>
              </div>
              {entry.overdue > 0 && (
                <span className={`font-medium ${getOverdueColor(entry.overdue)}`}>
                  +{entry.overdue} jour{entry.overdue > 1 ? 's' : ''}
                  {entry.overdue >= 5 && (
                    <span className="ml-1 animate-pulse">⚡</span>
                  )}
                </span>
              )}
            </div>

            {/* Auto-deduction notice for overdue > 5 days */}
            {entry.status === 'pending' && entry.overdue >= 5 && (
              <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                <div className="flex items-center gap-1 text-red-700 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-bold">RETENUE AUTOMATIQUE:</span>
                  <span>500 GDS sera retenu sur salaire (délai dépassé)</span>
                </div>
              </div>
            )}

            {/* Fourth Row - Payment Info */}
            {(entry.status === 'paid' || entry.status === 'deducted') && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Payé le:</span>
                    <span className="font-medium">{formatDate(entry.paymentDate)}</span>
                  </div>
                  <button
                    onClick={() => viewReceipt(entry.receiptId)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 active:scale-95 transition-transform"
                  >
                    <Receipt className="w-3 h-3" />
                    Voir reçu
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons for pending entries */}
            {entry.status === 'pending' && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleMarkAsPaid(entry.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded active:scale-95 transition-transform"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Marquer payé
                </button>
                <button
                  onClick={() => handleDeductFromPayroll(entry.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded active:scale-95 transition-transform"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Retenir salaire
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Salary Summary - CORRECT CALCULATIONS */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Salaire mensuel</span>
            <span className="font-bold text-gray-900">15,000 GDS</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700">Pénalités payées</span>
                <p className="text-green-600 text-xs">{paidCount} retards payés directement</p>
              </div>
              <span className="font-bold text-green-600">+{totalPaid} GDS (hors salaire)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700">Déjà retenu du salaire</span>
                <p className="text-blue-600 text-xs">{deductedCount} retards retenus</p>
              </div>
              <span className="font-bold text-blue-600">-{totalDeducted} GDS</span>
            </div>
            
            <div className="bg-red-50 p-2 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-red-700">À retenir du salaire</span>
                  <p className="text-red-600 text-xs">{pendingCount} retards en attente</p>
                </div>
                <span className="font-bold text-red-600">-{totalPending} GDS</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">SALAIRE NET FINAL</p>
                <p className="text-gray-600 text-sm">Montant réel à verser</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{netSalary} GDS</p>
                <p className="text-gray-600 text-xs">
                  {((netSalary / 15000) * 100).toFixed(1)}% du salaire initial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;