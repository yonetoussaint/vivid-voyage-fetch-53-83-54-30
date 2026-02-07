import React, { useState } from 'react';
import { Clock, AlertCircle, DollarSign, Calendar, CheckCircle, FileText, Download, PlusCircle } from 'lucide-react';

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
      daysOverdue: 0
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
    },
    {
      id: 3,
      date: '2024-01-05',
      arrivalTime: '08:15',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: '2024-01-15',
      status: 'deducted',
      daysOverdue: 0
    },
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
      arrivalTime: '08:00',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      daysOverdue: 0
    };
    setLateEntries([newEntry, ...lateEntries]);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} GDS`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: AlertCircle,
        text: 'À payer'
      },
      paid: { 
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: CheckCircle,
        text: 'Payé'
      },
      deducted: { 
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: DollarSign,
        text: 'Retenu sur salaire'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  const totalPendingPenalty = calculateTotalPenalty();
  const monthlySalary = 15000;
  const totalLateEntries = lateEntries.length;
  const pendingEntries = lateEntries.filter(entry => entry.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Retards</h2>
            <p className="text-gray-600 mt-1">Suivi des retards et pénalités des vendeurs</p>
          </div>
          <button 
            onClick={handleAddLateEntry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter un retard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total des retards</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalLateEntries}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm">Pénalités impayées</p>
                <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalPendingPenalty)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm">Retards en attente</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">{pendingEntries}</p>
              </div>
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Salaire mensuel</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(monthlySalary)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Penalty Warning */}
        {totalPendingPenalty > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Avertissement important</h3>
                <p className="text-amber-700">
                  {totalPendingPenalty.toLocaleString()} GDS en pénalités impayées. Si non réglés avant les dates limites, 
                  ce montant sera automatiquement retenu sur le salaire mensuel de {monthlySalary.toLocaleString()} GDS.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Late Entries List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Historique des retards</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        {lateEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Aucun retard enregistré</p>
            <p className="text-sm mt-1">Les retards ajoutés apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lateEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="bg-gray-100 px-3 py-1 rounded-lg">
                        <p className="font-semibold text-gray-900">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>Arrivé à <span className="font-semibold">{entry.arrivalTime}</span></span>
                        <span className="text-gray-400">•</span>
                        <span>Prévu à <span className="font-semibold">{entry.scheduledTime}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-red-600">{formatCurrency(entry.penaltyAmount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className={`font-medium ${entry.daysOverdue > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                          Date limite: {new Date(entry.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                        {entry.daysOverdue > 0 && (
                          <span className="text-sm text-red-500">(+{entry.daysOverdue} jours)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {getStatusBadge(entry.status)}
                  </div>
                </div>
                
                {entry.status === 'pending' && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleMarkAsPaid(entry.id)}
                        className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Marquer comme payé
                      </button>
                      <button className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
                        Générer facture
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Salary Calculation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Calcul du salaire net</h3>
        
        <div className="max-w-md space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700">Salaire de base</span>
            <span className="font-semibold text-gray-900">{formatCurrency(monthlySalary)}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <span className="text-gray-700">Retenues pour retards</span>
              <p className="text-sm text-gray-500">({pendingEntries} retards impayés)</p>
            </div>
            <span className="font-semibold text-red-600">- {formatCurrency(totalPendingPenalty)}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
            <span className="font-bold text-gray-900">Salaire net estimé</span>
            <span className="text-2xl font-bold text-green-700">
              {formatCurrency(monthlySalary - totalPendingPenalty)}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Générer bulletin de paie
            </button>
            <button className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-colors">
              Voir détails comptables
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;