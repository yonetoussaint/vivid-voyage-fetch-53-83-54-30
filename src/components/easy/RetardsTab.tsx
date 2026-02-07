import React, { useState } from 'react';
import { User, Clock, AlertCircle, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const RetardsTab = ({ vendeurActif, currentSeller, affectations }) => {
  const [lateEntries, setLateEntries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      arrivalTime: '08:45',
      scheduledTime: '08:00',
      penaltyAmount: 500,
      dueDate: '2024-01-25',
      status: 'pending', // pending, paid, deducted
      daysOverdue: 0
    },
    // Add more entries as needed
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

  const formatCurrency = (amount) => {
    return `${amount} GDS`;
  };

  const formatPayroll = (amount) => {
    return `${amount.toLocaleString()} GDS`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      deducted: { color: 'bg-blue-100 text-blue-800', icon: DollarSign }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status === 'pending' ? 'À payer' : status === 'paid' ? 'Payé' : 'Retenu sur salaire'}
      </span>
    );
  };

  const totalPendingPenalty = calculateTotalPenalty();
  const monthlySalary = 15000;
  const willBeDeducted = totalPendingPenalty > 0;

  return (
    <div className="divide-y divide-gray-200">
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bold text-[15px] hover:underline">{vendeurActif}</span>
              <span className="text-gray-500 text-[15px]">@{vendeurActif.toLowerCase().replace(/\s+/g, '_')}</span>
              <span className="text-gray-500 text-[15px]">· Vendeur</span>
            </div>

            {/* Stats Summary */}
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Pompes affectées</p>
                  <p className="font-semibold text-blue-600 text-lg">{affectations}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Retards ce mois</p>
                  <p className="font-semibold text-amber-600 text-lg">{currentSeller.tardiness || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Amendes impayées</p>
                  <p className="font-semibold text-red-600 text-lg">{formatCurrency(totalPendingPenalty)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Salaire mensuel</p>
                  <p className="font-semibold text-green-600 text-lg">{formatPayroll(monthlySalary)}</p>
                </div>
              </div>

              {/* Warning for pending penalties */}
              {willBeDeducted && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">
                      {totalPendingPenalty} GDS seront retenus sur le salaire de 15,000 GDS si non payés avant la date limite
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Late Arrivals List */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Historique des retards
              </h3>
              
              {lateEntries.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>Aucun retard enregistré</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lateEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Arrivé à {entry.arrivalTime} (prévu: {entry.scheduledTime})
                          </p>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Amende</p>
                          <p className="font-semibold text-red-600">{formatCurrency(entry.penaltyAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date limite</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className={`font-medium ${entry.daysOverdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {new Date(entry.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                            {entry.daysOverdue > 0 && (
                              <span className="text-xs text-red-500">(+{entry.daysOverdue} jours)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {entry.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleMarkAsPaid(entry.id)}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Marquer comme payé
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Calculation Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Calcul du salaire net
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Salaire de base</span>
                  <span className="font-medium">{formatPayroll(monthlySalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retenues pour retards</span>
                  <span className="font-medium text-red-600">- {formatCurrency(totalPendingPenalty)}</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Salaire net estimé</span>
                    <span className="text-green-700">
                      {formatPayroll(monthlySalary - totalPendingPenalty)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6 max-w-md text-gray-500">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span className="text-sm">Ajouter un retard</span>
              </button>
              
              <button className="flex items-center gap-2 hover:text-green-600 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 1l4 4-4 4"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <path d="M7 23l-4-4 4-4"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <span className="text-sm">Générer facture</span>
              </button>
              
              <button className="flex items-center gap-2 hover:text-amber-600 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-amber-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </div>
                <span className="text-sm">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;