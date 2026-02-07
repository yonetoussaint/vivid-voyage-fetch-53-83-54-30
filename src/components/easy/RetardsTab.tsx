import React, { useState, useEffect, useRef } from 'react';
import { Plus, Clock, AlertCircle, DollarSign, Calendar, X, CheckCircle, Lock, Receipt, FileText, Download, History, Printer } from 'lucide-react';

const RetardsTab = ({ currentSeller }) => {
  const [lateEntries, setLateEntries] = useState([
    { id: 1, date: '2024-01-15', time: '08:45', penalty: 500, dueDate: '2024-01-25', status: 'pending', overdue: 2, paymentDate: null, receiptId: null },
    { id: 2, date: '2024-01-10', time: '08:30', penalty: 500, dueDate: '2024-01-20', status: 'paid', overdue: 0, paymentDate: '2024-01-18', receiptId: 'REC-001' },
    { id: 3, date: '2024-01-05', time: '08:15', penalty: 500, dueDate: '2024-01-15', status: 'deducted', overdue: 0, paymentDate: '2024-01-31', receiptId: 'SAL-001' }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const [showDeductionPreview, setShowDeductionPreview] = useState(false);
  const [showReceiptView, setShowReceiptView] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pin, setPin] = useState('');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:45'
  });

  const receiptRef = useRef(null);

  // Calculate overdue days and auto-deduct after 5 days
  useEffect(() => {
    const updatedEntries = lateEntries.map(entry => {
      if (entry.status === 'pending') {
        const dueDate = new Date(entry.dueDate);
        const today = new Date();
        const diffTime = today - dueDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const overdue = Math.max(0, diffDays);
        
        // Auto-deduct if overdue more than 5 days
        if (overdue > 5 && entry.status === 'pending') {
          return {
            ...entry,
            status: 'deducted',
            overdue: overdue,
            paymentDate: new Date().toISOString(),
            receiptId: `AUTO-${Date.now().toString().slice(-6)}`
          };
        }
        
        return { ...entry, overdue: overdue };
      }
      return entry;
    });
    
    // Check if any entries changed
    if (JSON.stringify(updatedEntries) !== JSON.stringify(lateEntries)) {
      setLateEntries(updatedEntries);
    }
  }, [lateEntries]);

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

  const calculateAutoDeducted = () => {
    const autoEntries = lateEntries.filter(entry => 
      entry.status === 'deducted' && entry.receiptId?.startsWith('AUTO')
    );
    return autoEntries.reduce((total, entry) => total + entry.penalty, 0);
  };

  const getDueDateStatus = (overdue) => {
    if (overdue === 0) return { color: 'text-green-600', bg: 'bg-green-100', text: 'Dans délai' };
    if (overdue <= 2) return { color: 'text-amber-600', bg: 'bg-amber-100', text: `${overdue} jour(s)` };
    if (overdue <= 5) return { color: 'text-orange-600', bg: 'bg-orange-100', text: `${overdue} jour(s)` };
    return { color: 'text-red-600', bg: 'bg-red-100', text: `${overdue} jour(s)` };
  };

  const handleAddEntry = () => {
    const dueDate = new Date(newEntry.date);
    dueDate.setDate(dueDate.getDate() + 5); // 5 days grace period
    
    const entry = {
      id: lateEntries.length + 1,
      date: newEntry.date,
      time: newEntry.time,
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
    setNewEntry({ date: new Date().toISOString().split('T')[0], time: '08:45' });
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
        const receiptId = `MANUAL-${Date.now().toString().slice(-6)}`;
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
    return {
      header: "STATION ESSENCE PETROVILLE",
      subHeader: "Reçu de Paiement",
      receiptId: entry.receiptId,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      vendorName: "Vendeur: " + (currentSeller?.name || "N/A"),
      transactionType: entry.receiptId.startsWith('REC') ? "Paiement Direct" : 
                     entry.receiptId.startsWith('AUTO') ? "Retenue Automatique" : "Retenue Manuel",
      amount: "500 GDS",
      description: `Retard du ${formatDate(entry.date)} à ${entry.time}`,
      footer: "Merci de votre visite",
      qrCode: `STATION-${entry.receiptId}-500GDS`,
      separator: "--------------------------------",
      total: "500 GDS",
      signature: "Signature: __________",
      timestamp: new Date().toISOString()
    };
  };

  const renderPrintableReceipt = (receiptId) => {
    const entry = lateEntries.find(e => e.receiptId === receiptId);
    if (!entry) return null;

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
            <p className="font-bold">{entry.receiptId}</p>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Heure:</span>
              <span className="font-medium">{new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">
                {entry.receiptId.startsWith('REC') ? 'Paiement Direct' : 
                 entry.receiptId.startsWith('AUTO') ? 'Retenue Automatique' : 'Retenue Manuel'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Montant:</span>
              <span className="font-bold">500 GDS</span>
            </div>
            
            <div className="my-2 border-t border-dashed border-gray-400 pt-2">
              <div className="text-center font-bold">Détails pénalité</div>
              <p className="text-center">Retard du {formatDate(entry.date)} à {entry.time}</p>
            </div>
            
            <div className="text-center mt-4">
              <p className="font-bold">Merci de votre visite</p>
              <p className="text-xs mt-2">***************************</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPending = calculateTotalPenalty();
  const totalDeducted = calculateMonthlyDeduction();
  const totalAutoDeducted = calculateAutoDeducted();
  const monthlySalary = 15000;
  const pendingCount = lateEntries.filter(e => e.status === 'pending').length;
  const deductedCount = lateEntries.filter(e => e.status === 'deducted').length;

  // Calculate net salary correctly
  const netSalary = monthlySalary - totalPending;
  const deductionPercentage = ((totalPending / monthlySalary) * 100).toFixed(1);

  return (
    <div className="p-3 space-y-3 min-h-screen">
      {/* Receipt Viewer Modal */}
      {showReceiptView && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Reçu de paiement</h3>
              </div>
              <button 
                onClick={() => setShowReceiptView(false)} 
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Printable Receipt */}
              {renderPrintableReceipt(showReceiptView)}
              
              {/* Mobile-friendly print buttons */}
              <div className="space-y-2">
                <button 
                  onClick={() => printReceiptAndroid(showReceiptView)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium active:scale-95 transition-all"
                >
                  <Printer className="w-5 h-5" />
                  <span>Imprimer sur Android</span>
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Imprimer via navigateur</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Format: 80mm thermal printer • 5 jours limite
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
              <button onClick={() => setShowDeductionPreview(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
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
                    <span className="text-gray-600">Retenues actuelles:</span>
                    <span className="font-medium text-red-600">{totalPending} GDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nouvelle retenue:</span>
                    <span className="font-bold text-red-600">+500 GDS</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="font-medium">Salaire net:</span>
                    <span className="font-bold text-green-700">14,500 GDS</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={confirmDeduction}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg active:scale-95 transition-all"
                >
                  Confirmer la retenue
                </button>
                <button
                  onClick={() => setShowDeductionPreview(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg active:scale-95 transition-all"
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
              }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
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
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
                  maxLength={4}
                  placeholder="0000"
                  autoFocus
                />
              </div>
              
              <button
                onClick={verifyPin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg active:scale-95 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-4 right-4 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Nouveau retard</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Heure d'arrivée</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded mb-2">
                  <span className="text-sm text-red-800">Pénalité:</span>
                  <span className="font-bold text-red-600">500 GDS</span>
                </div>
                <button
                  onClick={handleAddEntry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg active:scale-95 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats - CORRECTED CALCULATIONS */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600 text-xs mb-1">Total retards</p>
          <p className="font-bold text-gray-900 text-xl">{lateEntries.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-red-600 text-xs mb-1">À payer</p>
          <p className="font-bold text-red-700 text-xl">{pendingCount}</p>
          <p className="text-red-600 text-xs mt-1">{totalPending} GDS</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-600 text-xs mb-1">Auto-retenu</p>
          <p className="font-bold text-blue-700 text-xl">
            {lateEntries.filter(e => e.receiptId?.startsWith('AUTO')).length}
          </p>
          <p className="text-blue-600 text-xs mt-1">{totalAutoDeducted} GDS</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-600 text-xs mb-1">Salaire net</p>
          <p className="font-bold text-green-700 text-xl">{netSalary} GDS</p>
          <p className="text-green-600 text-xs mt-1">{deductionPercentage}% retenu</p>
        </div>
      </div>

      {/* Auto-Deduction Warning */}
      {totalAutoDeducted > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-bold text-sm mb-1">
                ⚠️ RETENUES AUTOMATIQUES APPLIQUÉES
              </p>
              <p className="text-blue-700 text-sm">
                {totalAutoDeducted} GDS retenus automatiquement (délai de 5 jours dépassé)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Late Entries */}
      <div className="space-y-2">
        {lateEntries.map((entry) => {
          const dueStatus = getDueDateStatus(entry.overdue);
          const isAutoDeducted = entry.receiptId?.startsWith('AUTO');
          
          return (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
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
                    <span className={`flex items-center gap-1 px-2 py-1 ${isAutoDeducted ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} text-xs rounded`}>
                      {isAutoDeducted ? '🤖' : <Receipt className="w-3 h-3" />}
                      {isAutoDeducted ? 'Auto-retenu' : 'Retenu'}
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
                  <span className="font-medium text-gray-900">{entry.time}</span>
                  <span className="text-gray-500 text-sm">(prévu 08:00)</span>
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
                  <span className={`px-2 py-1 rounded ${dueStatus.bg} ${dueStatus.color} text-xs font-medium`}>
                    {dueStatus.text}
                  </span>
                )}
              </div>

              {/* Auto-deduction warning */}
              {entry.status === 'pending' && entry.overdue > 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
                  <p className="text-orange-700 text-xs font-medium">
                    ⚠️ {5 - entry.overdue} jour(s) avant retenue automatique
                  </p>
                </div>
              )}

              {/* Fourth Row - Payment Info */}
              {(entry.status === 'paid' || entry.status === 'deducted') && (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Payé le:</span>
                      <span className="font-medium">{formatDate(entry.paymentDate)}</span>
                      {isAutoDeducted && <span className="text-purple-600 ml-1">(Auto)</span>}
                    </div>
                    <button
                      onClick={() => viewReceipt(entry.receiptId)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
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
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded transition-colors active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Marquer payé
                  </button>
                  <button
                    onClick={() => handleDeductFromPayroll(entry.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded transition-colors active:scale-95"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Retenir salaire
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Salary Summary - CORRECTED */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Salaire mensuel</span>
            <span className="font-bold">15,000 GDS</span>
          </div>
          
          <div className="bg-red-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-red-700">À retenir (immatriculé)</span>
              <span className="font-bold text-red-600">-{totalPending} GDS</span>
            </div>
            <div className="text-xs text-red-600 mt-1">
              {pendingCount} retards en attente • 5 jours limite
            </div>
          </div>
          
          <div className="bg-blue-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Déjà retenu ce mois</span>
              <span className="font-bold text-blue-600">-{totalDeducted} GDS</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {deductedCount} retenues (dont {totalAutoDeducted / 500} auto)
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">SALAIRE NET FINAL</p>
                <p className="text-gray-600 text-sm">À verser le 31/01/24</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{netSalary} GDS</p>
                <p className="text-gray-600 text-xs">
                  {deductionPercentage}% du salaire initial
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