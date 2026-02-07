import React from 'react';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';

const SummaryCards = ({
  totalShort,
  pendingShort,
  overdueShort,
  monthlySalary,
  payrollDeductions,
  remainingPayroll,
  formatNumber
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 bg-white border-b border-gray-200">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-red-600 font-medium">Déficit Total</span>
          <DollarSign className="w-4 h-4 text-red-600" />
        </div>
        <p className="text-lg font-bold text-red-700">{formatNumber(totalShort)}</p>
        <p className="text-xs text-red-600 mt-0.5">HTG</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-yellow-600 font-medium">En Attente</span>
          <Clock className="w-4 h-4 text-yellow-600" />
        </div>
        <p className="text-lg font-bold text-yellow-700">{formatNumber(pendingShort)}</p>
        <p className="text-xs text-yellow-600 mt-0.5">HTG</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-orange-600 font-medium">En Retard</span>
          <AlertCircle className="w-4 h-4 text-orange-600" />
        </div>
        <p className="text-lg font-bold text-orange-700">{formatNumber(overdueShort)}</p>
        <p className="text-xs text-orange-600 mt-0.5">HTG</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-blue-600 font-medium">Salaire Restant</span>
          <DollarSign className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-lg font-bold text-blue-700">{formatNumber(remainingPayroll)}</p>
        <p className="text-xs text-blue-600 mt-0.5">HTG</p>
      </div>
    </div>
  );
};

export default SummaryCards;