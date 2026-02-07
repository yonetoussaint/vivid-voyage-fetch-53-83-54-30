import React, { useState } from 'react';
import { Plus, Clock, AlertCircle, DollarSign, Calendar, X, CheckCircle } from 'lucide-react';

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
    <div className="p-3 space-y-3 min-h-screen">
      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 z-10 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Nouveau retard</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                />
                {newEntry.date && (
                  <p className="text-gray-600 mt-2 font-medium">
                    {formatDate(newEntry.date)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Heure d'arrivée</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                />
                <p className="text-gray-500 mt-2">Heure prévue: 08:00</p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-4">
                  <span className="font-medium text-red-800">Pénalité fixe:</span>
                  <span className="font-bold text-red-600 text-lg">500 GDS</span>
                </div>
                <button
                  onClick={handleAddEntry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-base"
                >
                  Enregistrer le retard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats - Grid Layout */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600 mb-1">Retards</p>
          <p className="text-2xl font-bold text-gray-900">{lateEntries.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-red-600 mb-1">Impayés</p>
          <p className="text-2xl font-bold text-red-700">{pendingCount}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-600 mb-1">Dû</p>
          <p className="text-2xl font-bold text-blue-700">{totalPending} GDS</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-600 mb-1">Salaire net</p>
          <p className="text-2xl font-bold text-green-700">{15000 - totalPending} GDS</p>
        </div>
      </div>

      {/* Late Entries - Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {lateEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-xl p-3 bg-white">
            {/* Top Row */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 text-base">
                  {formatDate(entry.date)}
                </span>
              </div>
              
              <button
                onClick={() => togglePaid(entry.id)}
                className={`flex items-center gap-2 px-3 py-1.5 font-medium rounded-lg text-sm ${
                  entry.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {entry.status === 'paid' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Payé</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>À payer</span>
                  </>
                )}
              </button>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-600 text-sm">Arrivée</p>
                  <p className="font-bold text-gray-900">{entry.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-600 text-sm">Pénalité</p>
                  <p className="font-bold text-red-700">500 GDS</p>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Échéance</p>
                  <p className="font-medium text-gray-900">{formatDate(entry.dueDate)}</p>
                </div>
                {entry.overdue > 0 && (
                  <span className="text-red-600 font-bold">
                    +{entry.overdue} jours
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Warning */}
      {totalPending > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 text-base mb-1">
                Retenue automatique sur salaire
              </h3>
              <p className="text-red-700">
                {totalPending} GDS seront déduits du salaire de 15,000 GDS
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Salary Summary */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <h3 className="font-bold text-gray-900 text-lg mb-3">Calcul du salaire</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Salaire de base</span>
            </div>
            <span className="font-bold text-gray-900">15,000 GDS</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">Retenues retards</span>
            </div>
            <span className="font-bold text-red-600">-{totalPending} GDS</span>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
              <div>
                <p className="font-bold text-gray-900 text-base">SALAIRE NET</p>
                <p className="text-green-700 text-sm">À verser</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">{15000 - totalPending} GDS</p>
                <p className="text-green-600 text-sm">
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