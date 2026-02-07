import React from 'react';
import { 
  Calendar, 
  CalendarDays, 
  Receipt, 
  Eye, 
  AlertCircle, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Edit,
  DollarSign as DollarIcon
} from 'lucide-react';

const ShortCard = ({
  short,
  formatNumber,
  onActionClick,
  onEditClick,
  onPartialClick,
  monthlySalary,
  remainingPayroll
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'paid':
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'overdue':
        return <AlertCircle className="w-3 h-3" />;
      case 'paid':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      case 'paid':
        return 'Payé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-black">{short.date}</span>
            <span className="text-xs text-gray-500">• {short.shift}</span>
          </div>
          <div className="flex items-center gap-2">
            {short.status !== 'paid' && (
              <button
                onClick={() => onEditClick(short)}
                className="text-gray-500 hover:text-gray-700"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(short.status)} flex items-center gap-1`}>
              {getStatusIcon(short.status)}
              {getStatusText(short.status)}
            </div>
          </div>
        </div>

        {/* Due Date Info */}
        {short.dueDate && (
          <div className="flex items-center gap-1 mb-2 text-xs">
            <CalendarDays className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Date limite: </span>
            <span className={`font-medium ${
              short.status === 'overdue' ? 'text-red-600' : 'text-gray-700'
            }`}>
              {short.dueDate}
            </span>
            {short.daysOverdue > 0 && (
              <span className="text-red-600 font-medium">
                • {short.daysOverdue} jour{short.daysOverdue > 1 ? 's' : ''} de retard
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="bg-gray-50 rounded-lg p-2 mb-3">
          <p className="text-xs text-gray-600">{short.notes}</p>
        </div>

        {/* Financial Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Ventes totales:</span>
            <span className="text-xs font-medium text-blue-700">{formatNumber(short.totalSales)} HTG</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Argent rendu:</span>
            <span className="text-xs font-medium text-green-700">{formatNumber(short.moneyGiven)} HTG</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Déficit:</span>
            <span className="text-sm font-bold text-red-600">{formatNumber(short.shortAmount)} HTG</span>
          </div>
          {short.partialPayments && short.partialPayments.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Payé:</span>
              <span className="text-xs font-medium text-green-600">
                {formatNumber(short.partialPayments.reduce((sum, p) => sum + p.amount, 0))} HTG
              </span>
            </div>
          )}
          {short.remainingBalance !== short.shortAmount && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Reste à payer:</span>
              <span className="text-xs font-medium text-orange-600">{formatNumber(short.remainingBalance)} HTG</span>
            </div>
          )}
        </div>

        {/* Receipt Status */}
        {short.status === 'paid' && short.receiptNumber && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-green-600" />
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    Reçu #{short.receiptNumber}
                  </p>
                  <p className="text-xs text-green-600">
                    Imprimé • {short.copiesPrinted}/2 copies
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onActionClick('viewReceipt', short.id)}
                className="text-xs text-blue-600 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Payroll Deduction Warning */}
        {short.status === 'overdue' && !short.paidFromPayroll && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-red-700 font-medium">
                  {short.daysOverdue > 7 
                    ? `À déduire du salaire (${formatNumber(monthlySalary)} HTG)` 
                    : "À payer avant déduction salariale"}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Salaire restant: {formatNumber(remainingPayroll)} HTG
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
          {short.status === 'pending' || short.status === 'overdue' ? (
            <>
              <button 
                onClick={() => onActionClick('markPaid', short.id)}
                className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium active:bg-green-600 flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                Payer & Imprimer
              </button>
              <div className="flex flex-col gap-1">
                {short.status === 'overdue' && (
                  <button 
                    onClick={() => onActionClick('payrollPayment', short.id)}
                    className="bg-blue-600 text-white py-2 rounded-lg text-xs font-medium active:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <DollarIcon className="w-3.5 h-3.5" />
                    Déduire salaire
                  </button>
                )}
                <button 
                  onClick={() => onPartialClick(short)}
                  className="bg-purple-500 text-white py-2 rounded-lg text-xs font-medium active:bg-purple-600 flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Paiement partiel
                </button>
              </div>
            </>
          ) : short.status === 'paid' ? (
            <>
              <button 
                onClick={() => onActionClick('cancelPayment', short.id)}
                className="bg-red-500 text-white py-2 rounded-lg text-xs font-medium active:bg-red-600 flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                Annuler
              </button>
              <button 
                onClick={() => onActionClick('viewReceipt', short.id)}
                className="border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium active:bg-gray-50 flex items-center justify-center gap-1"
              >
                <Receipt className="w-3.5 h-3.5" />
                Détails
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShortCard;