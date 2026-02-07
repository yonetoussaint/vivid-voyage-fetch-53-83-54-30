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
    <div className="p-3 space-y-3">
      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-5 right-5 z-10 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Quick Add Form (Modal) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-3">
          <div className="bg-white rounded-xl p-3 w-full max-w-xs shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Nouveau retard</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-1.5 border border-gray-300 rounded text-xs"
                />
                {newEntry.date && (
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    {formatDate(newEntry.date)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Heure d'arrivée</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                  className="w-full p-1.5 border border-gray-300 rounded text-xs"
                />
                <p className="text-xs text-gray-500 mt-0.5">Heure prévue: 08:00</p>
              </div>
              
              <div className="pt-1">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded text-xs mb-2">
                  <span className="font-medium text-red-800">Pénalité fixe:</span>
                  <span className="font-bold text-red-600">500 GDS</span>
                </div>
                <button
                  onClick={handleAddEntry}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Masonry Header - Grid of Stats */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Impayer</p>
          <p className="text-sm font-bold text-red-600">{pendingCount}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Montant</p>
          <p className="text-sm font-bold text-red-600">{totalPending} GDS</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Salaire</p>
          <p className="text-sm font-bold text-gray-900">15,000 GDS</p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg border border-green-200">
          <p className="text-xs text-green-600">Salaire net</p>
          <p className="text-sm font-bold text-green-700">{15000 - totalPending} GDS</p>
        </div>
      </div>

      {/* Masonry Grid of Late Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {lateEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-2 hover:border-gray-300 transition-colors">
            {/* Top Row - Date & Status */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-1 min-w-0">
                <Calendar className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="font-bold text-gray-900 text-xs truncate">
                  {formatDate(entry.date)}
                </span>
              </div>
              <button
                onClick={() => togglePaid(entry.id)}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap ${
                  entry.status === 'paid' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {entry.status === 'paid' ? (
                  <>
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Payé</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>À payer</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Middle Row - Time & Penalty */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="font-medium text-gray-900 text-xs whitespace-nowrap">{entry.time}</span>
                <span className="text-gray-400 text-[10px]">•</span>
                <span className="text-gray-500 text-[10px]">08:00</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-red-500" />
                <span className="font-bold text-red-600 text-xs">500 GDS</span>
              </div>
            </div>
            
            {/* Bottom Row - Due Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-600">
                <span className="text-[10px]">Échéance:</span>
                <span className="font-medium text-[10px] truncate">{formatDate(entry.dueDate)}</span>
              </div>
              {entry.overdue > 0 && (
                <span className="text-[10px] text-red-500 font-bold whitespace-nowrap">+{entry.overdue}j</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Alert - Masonry Style */}
      {totalPending > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-red-800 truncate">RETENUE AUTOMATIQUE</p>
              <p className="text-xs text-red-700">
                {totalPending} GDS → {15000 - totalPending} GDS net
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final Salary Summary - Masonry Grid */}
      <div className="border border-gray-200 rounded-lg p-2">
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="text-center">
            <p className="text-[10px] text-gray-500">Salaire</p>
            <p className="text-sm font-bold text-gray-900">15,000</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-red-500">Retenues</p>
            <p className="text-sm font-bold text-red-600">-{totalPending}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-green-600">Net</p>
            <p className="text-sm font-bold text-green-700">{15000 - totalPending}</p>
          </div>
        </div>
        
        {/* Percentage Bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((15000 - totalPending) / 15000 * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[9px] text-gray-500">0%</span>
          <span className="text-[9px] text-gray-500">{((15000 - totalPending) / 15000 * 100).toFixed(0)}% restant</span>
          <span className="text-[9px] text-gray-500">100%</span>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;