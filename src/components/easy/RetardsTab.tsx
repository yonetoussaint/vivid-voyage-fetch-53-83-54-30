import React, { useState } from 'react';
import { Plus, Clock, AlertCircle, DollarSign, Calendar, X, CheckCircle, Lock, Receipt } from 'lucide-react';

const RetardsTab = ({ currentSeller }) => {
  const [lateEntries, setLateEntries] = useState([
    { id: 1, date: '2024-01-15', time: '08:45', penalty: 500, dueDate: '2024-01-25', status: 'pending', overdue: 2 },
    { id: 2, date: '2024-01-10', time: '08:30', penalty: 500, dueDate: '2024-01-20', status: 'paid', overdue: 0 }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pin, setPin] = useState('');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:45'
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear().toString().slice(-2);
    return `${dayName}. ${day} ${month}, ${year}`;
  };

  const calculateTotalPenalty = () => {
    return lateEntries
      .filter(entry => entry.status === 'pending')
      .reduce((total, entry) => total + entry.penalty, 0);
  };

  const handleAddEntry = () => {
    const entry = {
      id: lateEntries.length + 1,
      date: newEntry.date,
      time: newEntry.time,
      penalty: 500,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      overdue: 0
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
    setShowPinForm(true);
  };

  const verifyPin = () => {
    const correctPin = '1234'; // Replace with actual PIN verification
    if (pin === correctPin) {
      if (selectedAction === 'markPaid' && selectedEntry) {
        setLateEntries(entries =>
          entries.map(entry =>
            entry.id === selectedEntry ? { ...entry, status: 'paid' } : entry
          )
        );
      } else if (selectedAction === 'deductPayroll' && selectedEntry) {
        setLateEntries(entries =>
          entries.map(entry =>
            entry.id === selectedEntry ? { ...entry, status: 'deducted' } : entry
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

  const totalPending = calculateTotalPenalty();
  const monthlySalary = 15000;
  const pendingCount = lateEntries.filter(e => e.status === 'pending').length;

  return (
    <div className="p-3 space-y-3 min-h-screen">
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
                  ? 'Marquer comme payé ?' 
                  : 'Déduire du salaire ?'}
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
          <p className="text-red-600 text-xs">Impayés</p>
          <p className="font-bold text-red-700 text-lg">{pendingCount}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg">
          <p className="text-blue-600 text-xs">Montant dû</p>
          <p className="font-bold text-blue-700 text-lg">{totalPending} GDS</p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg">
          <p className="text-green-600 text-xs">Salaire net</p>
          <p className="font-bold text-green-700 text-lg">{15000 - totalPending} GDS</p>
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
                    <DollarSign className="w-3 h-3" />
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

            {/* Third Row */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-2">
              <div className="flex items-center gap-1">
                <span>Échéance:</span>
                <span className="font-medium">{formatDate(entry.dueDate)}</span>
              </div>
              {entry.overdue > 0 && (
                <span className="text-red-600 font-medium">+{entry.overdue}j</span>
              )}
            </div>

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
                  <Receipt className="w-3.5 h-3.5" />
                  Retenir salaire
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Salary Warning */}
      {totalPending > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <div>
              <p className="text-red-700 text-sm font-medium">
                {totalPending} GDS seront retenus sur salaire
              </p>
              <p className="text-red-600 text-xs">
                Retenue automatique sur 15,000 GDS
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Salary Summary */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Salaire de base</span>
            <span className="font-bold">15,000 GDS</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Retenues retards</span>
            <span className="font-bold text-red-600">-{totalPending} GDS</span>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">SALAIRE NET</p>
                <p className="text-gray-600 text-sm">À verser</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">{15000 - totalPending} GDS</p>
                <p className="text-gray-600 text-xs">
                  {((15000 - totalPending) / 15000 * 100).toFixed(0)}% du salaire
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