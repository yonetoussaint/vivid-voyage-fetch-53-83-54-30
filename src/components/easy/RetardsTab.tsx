import React, { useState } from 'react';
import { Plus, Clock, AlertCircle, DollarSign, Calendar, X } from 'lucide-react';

const RetardsTab = ({ currentSeller }) => {
  const [lateEntries, setLateEntries] = useState([
    { id: 1, date: '2024-01-15', time: '08:45', penalty: 500, dueDate: '2024-01-25', status: 'pending', overdue: 2 },
    { id: 2, date: '2024-01-10', time: '08:30', penalty: 500, dueDate: '2024-01-20', status: 'paid', overdue: 0 }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:45'
  });

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

  const togglePaid = (id) => {
    setLateEntries(entries =>
      entries.map(entry =>
        entry.id === id ? { ...entry, status: entry.status === 'paid' ? 'pending' : 'paid' } : entry
      )
    );
  };

  const totalPending = calculateTotalPenalty();
  const monthlySalary = 15000;
  const pendingCount = lateEntries.filter(e => e.status === 'pending').length;

  return (
    <div className="p-3 space-y-3 relative">
      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 z-10 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Nouveau retard</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'arrivée</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2">Pénalité automatique: <span className="font-bold text-red-600">500 GDS</span></p>
                <button
                  onClick={handleAddEntry}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Enregistrer le retard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Retards</h3>
          <p className="text-xs text-gray-500">{pendingCount} impayés • {totalPending} GDS</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-green-700">{15000 - totalPending} GDS</p>
          <p className="text-xs text-gray-500">Salaire net</p>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {lateEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-2 text-sm">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="font-medium truncate">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700 truncate">{entry.time}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <DollarSign className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span className="font-bold text-red-600">500 GDS</span>
                  {entry.overdue > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-red-500 text-xs">+{entry.overdue}j</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => togglePaid(entry.id)}
                  className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                    entry.status === 'paid' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {entry.status === 'paid' ? '✓ Payé' : 'À payer'}
                </button>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Calendar className="w-2.5 h-2.5" />
                  {new Date(entry.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Bar */}
      {totalPending > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-red-800 truncate">
                {totalPending} GDS seront retenus sur salaire
              </p>
              <p className="text-xs text-red-700">
                Si non payés: retenue auto sur 15,000 GDS
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary */}
      <div className="border-t border-gray-200 pt-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">Salaire base</p>
            <p className="font-bold">15,000 GDS</p>
          </div>
          <div className="bg-red-50 p-2 rounded-lg">
            <p className="text-xs text-red-500">Retenues</p>
            <p className="font-bold text-red-700">-{totalPending} GDS</p>
          </div>
        </div>
        
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-bold text-green-900">Salaire net:</span>
            <span className="text-lg font-bold text-green-800">{15000 - totalPending} GDS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;