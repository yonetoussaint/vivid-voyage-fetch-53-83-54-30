import React, { useState } from 'react';
import { Clock, AlertCircle, DollarSign, Calendar, CheckCircle, Plus } from 'lucide-react';

const RetardsTab = ({ currentSeller }) => {
  const [lateEntries, setLateEntries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      arrivalTime: '08:45',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: '2024-01-25',
      status: 'pending',
      daysOverdue: 2
    },
    {
      id: 2,
      date: '2024-01-10',
      arrivalTime: '08:30',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: '2024-01-20',
      status: 'paid',
      daysOverdue: 0
    }
  ]);

  const calculateTotalPenalty = () => {
    return lateEntries
      .filter(entry => entry.status === 'pending')
      .reduce((total, entry) => total + entry.penaltyAmount, 0);
  };

  const handleMarkAsPaid = (id) => {
    setLateEntries(entries =>
      entries.map(entry =>
        entry.id === id ? { ...entry, status: 'paid' } : entry
      )
    );
  };

  const handleAddLateEntry = () => {
    const newEntry = {
      id: lateEntries.length + 1,
      date: new Date().toISOString().split('T')[0],
      arrivalTime: '08:45',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      daysOverdue: 0
    };
    setLateEntries([newEntry, ...lateEntries]);
  };

  const formatCurrency = (amount) => {
    return `${amount} GDS`;
  };

  const getStatusBadge = (status, daysOverdue) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
          <CheckCircle className="w-3 h-3" />
          Payé
        </span>
      );
    }
    
    if (daysOverdue > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
          <AlertCircle className="w-3 h-3" />
          En retard
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
        <Clock className="w-3 h-3" />
        À payer
      </span>
    );
  };

  const totalPendingPenalty = calculateTotalPenalty();
  const monthlySalary = 15000;
  const pendingEntries = lateEntries.filter(entry => entry.status === 'pending').length;

  return (
    <div className="p-4 space-y-4">
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Retards</p>
          <p className="text-lg font-bold text-gray-900">{lateEntries.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-xs text-red-500">À payer</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(totalPendingPenalty)}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-500">Salaire net</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(monthlySalary - totalPendingPenalty)}</p>
        </div>
      </div>

      {/* Add New Button */}
      <button 
        onClick={handleAddLateEntry}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Ajouter un retard (500 GDS)
      </button>

      {/* Warning Alert */}
      {totalPendingPenalty > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {totalPendingPenalty} GDS seront retenus sur le salaire
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Date limite dépassée: retenue automatique sur 15,000 GDS
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Late Entries List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Historique des retards</h3>
          <span className="text-xs text-gray-500">{pendingEntries} en attente</span>
        </div>
        
        <div className="space-y-3">
          {lateEntries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-sm text-gray-700">
                      {entry.arrivalTime} (prévu {entry.scheduledTime})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600">{formatCurrency(entry.penaltyAmount)}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
                {getStatusBadge(entry.status, entry.daysOverdue)}
              </div>
              
              {entry.status === 'pending' && (
                <button
                  onClick={() => handleMarkAsPaid(entry.id)}
                  className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded transition-colors"
                >
                  Marquer comme payé
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Salary Summary */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">Résumé financier</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Salaire de base</span>
            <span className="font-medium">{formatCurrency(monthlySalary)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Retenues retards</span>
            <span className="font-medium text-red-600">- {formatCurrency(totalPendingPenalty)}</span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between font-bold">
              <span className="text-gray-900">Salaire net</span>
              <span className="text-green-700">
                {formatCurrency(monthlySalary - totalPendingPenalty)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded transition-colors">
            Facture
          </button>
          <button className="py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded transition-colors">
            Bulletin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;