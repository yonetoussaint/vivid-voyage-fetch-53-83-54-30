import React from 'react';
import ShortCard from './ShortCard';
import { DollarSign } from 'lucide-react';

const ShortsList = ({
  filteredShorts,
  formatNumber,
  handleActionClick,
  handleEditClick,
  handlePartialClick,
  monthlySalary,
  remainingPayroll
}) => {
  if (filteredShorts.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-center py-8 px-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-black mb-1">Aucun déficit</h3>
          <p className="text-xs text-gray-500">Aucun déficit trouvé pour ce filtre</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {filteredShorts.map((short) => (
        <ShortCard
          key={short.id}
          short={short}
          formatNumber={formatNumber}
          onActionClick={handleActionClick}
          onEditClick={handleEditClick}
          onPartialClick={handlePartialClick}
          monthlySalary={monthlySalary}
          remainingPayroll={remainingPayroll}
        />
      ))}
    </div>
  );
};

export default ShortsList;