import React from 'react';
import { Trash2, X, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceItem = ({ 
  sequence, 
  isEditing, 
  vendorInputs, 
  vendeur,
  onEdit, 
  onRemove, 
  onSave, 
  onCancel 
}) => {
  // Helper function to determine currency color
  const getCurrencyColor = (currency) => {
    switch(currency) {
      case 'USD': return 'bg-green-600';
      case 'CAD': return 'bg-blue-600';
      case 'HTG': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        isEditing
          ? 'bg-amber-50 border border-amber-300'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-2 h-2 rounded-full ${getCurrencyColor(sequence.currency)}`}></div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{sequence.note}</div>
          <div className="text-xs text-gray-500">{sequence.timestamp}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
          {formaterArgent(sequence.amount)} {sequence.currency}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`p-1.5 rounded ${
                  vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title="Sauvegarder"
              >
                <Save size={14} />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                title="Annuler"
              >
                <RotateCcw size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(sequence)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                title="Éditer"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onRemove(vendeur, sequence.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                title="Supprimer"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SequenceList = ({ 
  sequences, 
  editingSequenceId, 
  vendorInputs, 
  vendeur,
  onEditSequence, 
  onRemoveSequence, 
  onSaveEditedSequence, 
  onCancelSequenceEdit 
}) => {
  if (sequences.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
        Aucune séquence ajoutée
      </div>
    );
  }

  // Calculate totals by currency
  const calculateTotals = () => {
    const totals = {
      USD: 0,
      CAD: 0,
      HTG: 0,
      totalCount: sequences.length
    };

    sequences.forEach(sequence => {
      if (sequence.currency === 'USD') {
        totals.USD += sequence.amount;
      } else if (sequence.currency === 'CAD') {
        totals.CAD += sequence.amount;
      } else if (sequence.currency === 'HTG') {
        totals.HTG += sequence.amount;
      }
    });

    return totals;
  };

  // Helper function for currency background colors
  const getCurrencyBgColor = (currency) => {
    switch(currency) {
      case 'USD': return 'bg-green-50 border-green-100';
      case 'CAD': return 'bg-blue-50 border-blue-100';
      case 'HTG': return 'bg-purple-50 border-purple-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  // Helper function for currency text colors
  const getCurrencyTextColor = (currency) => {
    switch(currency) {
      case 'USD': return 'text-green-700';
      case 'CAD': return 'text-blue-700';
      case 'HTG': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  // Helper function for currency amount text colors
  const getCurrencyAmountColor = (currency) => {
    switch(currency) {
      case 'USD': return 'text-green-800';
      case 'CAD': return 'text-blue-800';
      case 'HTG': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {sequences.map((sequence) => {
          const isEditing = sequence.id === editingSequenceId;

          return (
            <SequenceItem
              key={sequence.id}
              sequence={sequence}
              isEditing={isEditing}
              vendorInputs={vendorInputs}
              vendeur={vendeur}
              onEdit={onEditSequence}
              onRemove={onRemoveSequence}
              onSave={onSaveEditedSequence}
              onCancel={onCancelSequenceEdit}
            />
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="pt-3 border-t border-gray-200">
        <div className="space-y-3">
          {totals.USD > 0 && (
            <div className={`flex items-center justify-between p-3 rounded-lg border ${getCurrencyBgColor('USD')}`}>
              <div className={`text-sm font-medium ${getCurrencyTextColor('USD')}`}>Total USD</div>
              <div className={`text-lg font-bold ${getCurrencyAmountColor('USD')}`}>
                {formaterArgent(totals.USD)} USD
              </div>
            </div>
          )}
          {totals.CAD > 0 && (
            <div className={`flex items-center justify-between p-3 rounded-lg border ${getCurrencyBgColor('CAD')}`}>
              <div className={`text-sm font-medium ${getCurrencyTextColor('CAD')}`}>Total CAD</div>
              <div className={`text-lg font-bold ${getCurrencyAmountColor('CAD')}`}>
                {formaterArgent(totals.CAD)} CAD
              </div>
            </div>
          )}
          {totals.HTG > 0 && (
            <div className={`flex items-center justify-between p-3 rounded-lg border ${getCurrencyBgColor('HTG')}`}>
              <div className={`text-sm font-medium ${getCurrencyTextColor('HTG')}`}>Total HTG</div>
              <div className={`text-lg font-bold ${getCurrencyAmountColor('HTG')}`}>
                {formaterArgent(totals.HTG)} HTG
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SequenceList;