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
    <div className="p-4 space-y-4 relative min-h-screen">
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
                {newEntry.date && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {formatDate(newEntry.date)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'arrivée</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500 mt-1 truncate">Heure prévue: 08:00</p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg mb-3">
                  <span className="text-sm font-medium text-red-800 truncate">Pénalité fixe:</span>
                  <span className="font-bold text-red-600">500 GDS</span>
                </div>
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
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">Retards & Pénalités</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full whitespace-nowrap">
              {pendingCount} impayés
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-700 whitespace-nowrap">{totalPending} GDS dus</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-green-700 whitespace-nowrap">{15000 - totalPending} GDS</p>
          <p className="text-xs text-gray-500 whitespace-nowrap">Salaire net</p>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 border-b border-gray-200 pb-4">
        {lateEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              {/* Left Column - Main Info */}
              <div className="min-w-0 flex-1">
                {/* Date Row */}
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-bold text-gray-900 truncate">
                    {formatDate(entry.date)}
                  </span>
                </div>
                
                {/* Time & Penalty Row */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-gray-900 whitespace-nowrap">{entry.time}</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap hidden xs:inline">(08:00)</span>
                  </div>
                  
                  <div className="hidden xs:block text-gray-300">|</div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="font-bold text-red-600 whitespace-nowrap">500 GDS</span>
                  </div>
                </div>
                
                {/* Due Date Row */}
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <span className="whitespace-nowrap">Échéance:</span>
                  <span className="font-medium truncate">{formatDate(entry.dueDate)}</span>
                  {entry.overdue > 0 && (
                    <span className="text-red-500 font-bold whitespace-nowrap">(+{entry.overdue} jours)</span>
                  )}
                </div>
              </div>
              
              {/* Right Column - Status Badge */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <button
                  onClick={() => togglePaid(entry.id)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    entry.status === 'paid' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {entry.status === 'paid' ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>Payé</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>À payer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="space-y-4">
        {/* Warning Alert */}
        {totalPending > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-800 mb-0.5 truncate">
                  RETENUE AUTOMATIQUE SUR SALAIRE
                </p>
                <p className="text-sm text-red-700 truncate">
                  {totalPending} GDS seront retenus sur 15,000 GDS
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Salary Breakdown */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-gray-50 p-3 rounded-lg min-w-0">
              <p className="text-sm text-gray-500 mb-1 truncate">Salaire base</p>
              <p className="font-bold text-gray-900 text-lg truncate">15,000 GDS</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg min-w-0">
              <p className="text-sm text-red-500 mb-1 truncate">Retenues</p>
              <p className="font-bold text-red-700 text-lg truncate">-{totalPending} GDS</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">SALAIRE NET</p>
                <p className="text-sm text-gray-500 truncate">À verser</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-green-700 whitespace-nowrap">{15000 - totalPending} GDS</p>
                <p className="text-sm text-gray-500 whitespace-nowrap">
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