import React, { useState } from 'react';
import { Calendar, DollarSign, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const ShortsTab = ({ vendeurActif }) => {
  const [shorts, setShorts] = useState([
    {
      id: 1,
      date: "15 Fév 2024",
      shift: "Matin (7h - 15h)",
      totalSales: 24500.00,
      moneyGiven: 24000.00,
      shortAmount: 500.00,
      status: 'pending', // 'pending', 'paid', 'overdue'
      notes: "Différence dans le compte de l'essence sans plomb 95"
    },
    {
      id: 2,
      date: "14 Fév 2024",
      shift: "Soir (15h - 23h)",
      totalSales: 31200.00,
      moneyGiven: 31000.00,
      shortAmount: 200.00,
      status: 'paid',
      notes: "Petite erreur de caisse"
    },
    {
      id: 3,
      date: "12 Fév 2024",
      shift: "Matin (7h - 15h)",
      totalSales: 18900.00,
      moneyGiven: 18500.00,
      shortAmount: 400.00,
      status: 'overdue',
      notes: "Manquant dans le compte du gasoil"
    },
    {
      id: 4,
      date: "10 Fév 2024",
      shift: "Nuit (23h - 7h)",
      totalSales: 15600.00,
      moneyGiven: 15600.00,
      shortAmount: 0.00,
      status: 'paid',
      notes: "Compte exact"
    },
    {
      id: 5,
      date: "8 Fév 2024",
      shift: "Soir (15h - 23h)",
      totalSales: 27800.00,
      moneyGiven: 27500.00,
      shortAmount: 300.00,
      status: 'pending',
      notes: "Différence à régulariser"
    }
  ]);

  const totalShort = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pendingShort = shorts
    .filter(short => short.status === 'pending' || short.status === 'overdue')
    .reduce((sum, short) => sum + short.shortAmount, 0);

  const handleMarkAsPaid = (id) => {
    setShorts(shorts.map(short => 
      short.id === id ? { ...short, status: 'paid' } : short
    ));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4">
      {/* Header with summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-2">Déficits de {vendeurActif}</h3>
        <p className="text-gray-600 text-sm mb-4">
          Montants manquants à régulariser après vérification des caisses
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Déficit total</p>
                <p className="text-lg font-bold text-black">{totalShort.toFixed(2)} DH</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600">À payer</p>
                <p className="text-lg font-bold text-amber-700">{pendingShort.toFixed(2)} DH</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shorts List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-black mb-3">Historique des déficits</h4>
        
        {shorts.map((short) => (
          <div key={short.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-black">{short.date}</span>
                  <span className="text-xs text-gray-500">• {short.shift}</span>
                </div>
                <p className="text-xs text-gray-500">{short.notes}</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(short.status)} flex items-center gap-1`}>
                {getStatusIcon(short.status)}
                {getStatusText(short.status)}
              </div>
            </div>
            
            {/* Financial Details */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">Ventes totales</p>
                <p className="font-bold text-blue-700">{short.totalSales.toFixed(2)} DH</p>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs text-green-600 mb-1">Argent rendu</p>
                <p className="font-bold text-green-700">{short.moneyGiven.toFixed(2)} DH</p>
              </div>
              
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs text-red-600 mb-1">Déficit</p>
                <p className="font-bold text-red-700">{short.shortAmount.toFixed(2)} DH</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2">
              {short.status === 'pending' || short.status === 'overdue' ? (
                <>
                  <button 
                    onClick={() => handleMarkAsPaid(short.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme payé
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Rappeler
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Déficit réglé
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {shorts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">Aucun déficit enregistré</h3>
          <p className="text-gray-500 mb-4">Tous les comptes sont à jour</p>
        </div>
      )}

      {/* Add Short Form (optional) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-black mb-3">Ajouter un nouveau déficit</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-3">
            Pour ajouter un nouveau déficit, utilisez le formulaire de clôture de caisse.
          </p>
          <button className="bg-black text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            Ouvrir le formulaire de caisse
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortsTab;