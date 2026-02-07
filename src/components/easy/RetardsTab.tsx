import React, { useState } from 'react';
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

  const handleAddEntry = () => {
    const entry = {
      id: lateEntries.length + 1,
      date: newEntry.date,
      time: newEntry.time,
      penalty: 500,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

  const generatePayrollPreview = () => {
    const pendingEntries = lateEntries.filter(entry => entry.status === 'pending');
    const totalDeduction = pendingEntries.reduce((total, entry) => total + entry.penalty, 0);
    const monthlySalary = 15000;
    
    return {
      monthlySalary,
      totalDeduction,
      netSalary: monthlySalary - totalDeduction,
      deductionPercentage: ((totalDeduction / monthlySalary) * 100).toFixed(1),
      entriesCount: pendingEntries.length
    };
  };

  const totalPending = calculateTotalPenalty();
  const totalDeducted = calculateMonthlyDeduction();
  const monthlySalary = 15000;
  const pendingCount = lateEntries.filter(e => e.status === 'pending').length;
  const payrollPreview = generatePayrollPreview();

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
              <button onClick={() => setShowReceiptView(false)} className="text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-xs text-gray-500 mb-1">N° de reçu</div>
                  <div className="text-lg font-bold text-gray-900">{showReceiptView}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{showReceiptView.startsWith('REC') ? 'Paiement direct' : 'Retenue sur salaire'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'émission:</span>
                    <span className="font-medium">{formatDateTime(new Date())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-bold text-red-600">500 GDS</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm">
                      <Download className="w-3.5 h-3.5" />
                      Télécharger
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm">
                      <Printer className="w-3.5 h-3.5" />
                      Imprimer
                    </button>
                  </div>
                </div>
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
                    <span className="text-gray-600">Retenue totale:</span>
                    <span className="font-bold text-red-600">{totalPending + 500} GDS</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="font-medium">Salaire net:</span>
                    <span className="font-bold text-green-700">14,500 GDS</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Impact mensuel</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Retenues ce mois:</span>
                    <span className="font-medium">{pendingCount + 1} retards</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total retenu:</span>
                    <span className="font-medium">{totalPending + 500} GDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Pourcentage:</span>
                    <span className="font-medium">{((totalPending + 500) / 15000 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={confirmDeduction}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Confirmer la retenue
                </button>
                <button
                  onClick={() => setShowDeductionPreview(false)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 mt-2 font-medium rounded-lg"
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
                  className="w-full p-2 border border-gray-300 rounded-lg text-center text-lg"
                  maxLength={4}
                  placeholder="0000"
                  autoFocus
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={verifyPin}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-4 right-4 z-20 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Nouveau retard</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500">
                <X className="w-4 h-4" />
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
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-600 text-xs">Retards</p>
          <p className="font-bold text-gray-900 text-lg">{lateEntries.length}</p>
        </div>
        <div className="bg-red-50 p-2 rounded-lg">
          <p className="text-red-600 text-xs">À payer</p>
          <p className="font-bold text-red-700 text-lg">{pendingCount}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg">
          <p className="text-blue-600 text-xs">Déjà retenu</p>
          <p className="font-bold text-blue-700 text-lg">{totalDeducted} GDS</p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg">
          <p className="text-green-600 text-xs">Salaire net</p>
          <p className="font-bold text-green-700 text-lg">{15000 - totalPending} GDS</p>
        </div>
      </div>

      {/* Salary Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-sm">Prévision salaire</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {payrollPreview.deductionPercentage}% retenu
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base:</span>
            <span className="font-medium">15,000 GDS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">À retenir:</span>
            <span className="font-bold text-red-600">-{totalPending} GDS</span>
          </div>
          <div className="border-t border-blue-200 pt-2">
            <div className="flex justify-between font-bold">
              <span className="text-gray-900">Net estimé:</span>
              <span className="text-green-700">{payrollPreview.netSalary} GDS</span>
            </div>
          </div>
        </div>
      </div>

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
                <span className="font-medium text-gray-900">{entry.time}</span>
                <span className="text-gray-500 text-sm">(prévu 08:00)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-600">500 GDS</span>
              </div>
            </div>

            {/* Third Row - Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <span>Échéance:</span>
                <span className="font-medium">{formatDate(entry.dueDate)}</span>
              </div>
              {entry.overdue > 0 && (
                <span className="text-red-600 font-medium">+{entry.overdue}j</span>
              )}
            </div>

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
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Marquer payé
                </button>
                <button
                  onClick={() => handleDeductFromPayroll(entry.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Retenir salaire
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Audit Trail Button */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">
          <History className="w-4 h-4" />
          Voir historique complet
        </button>
      </div>

      {/* Detailed Salary Summary */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Détails salaire</h3>
          <button className="flex items-center gap-1 text-blue-600 text-sm">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Salaire mensuel</span>
            <span className="font-bold">15,000 GDS</span>
          </div>
          
          <div className="bg-red-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-red-700">Retenues impayées</span>
              <span className="font-bold text-red-600">-{totalPending} GDS</span>
            </div>
            <div className="text-xs text-red-600 mt-1">
              {pendingCount} retards • Échéance dépassée
            </div>
          </div>
          
          <div className="bg-blue-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Déjà retenu ce mois</span>
              <span className="font-bold text-blue-600">-{totalDeducted} GDS</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {lateEntries.filter(e => e.status === 'deducted').length} retenues appliquées
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">SALAIRE NET FINAL</p>
                <p className="text-gray-600 text-sm">À verser le 31/01/24</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{15000 - totalPending} GDS</p>
                <p className="text-gray-600 text-xs">
                  {((15000 - totalPending) / 15000 * 100).toFixed(1)}% du salaire initial
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