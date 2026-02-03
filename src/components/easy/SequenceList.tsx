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
}) => (
  <div 
    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
      isEditing
        ? 'bg-amber-50 border border-amber-300'
        : 'bg-white border border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className={`w-2 h-2 rounded-full ${sequence.currency === 'USD' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
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
      totalCount: sequences.length
    };

    sequences.forEach(sequence => {
      if (sequence.currency === 'USD') {
        totals.USD += sequence.amount;
      } else if (sequence.currency === 'CAD') {
        totals.CAD += sequence.amount;
      }
    });

    return totals;
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
        <div className="text-sm font-medium text-gray-700 mb-2">Résumé</div>
        <div className="grid grid-cols-2 gap-3">
          {totals.USD > 0 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="text-xs text-green-700 mb-1">Total USD</div>
              <div className="text-lg font-bold text-green-800">
                {formaterArgent(totals.USD)} USD
              </div>
            </div>
          )}
          {totals.CAD > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-700 mb-1">Total CAD</div>
              <div className="text-lg font-bold text-blue-800">
                {formaterArgent(totals.CAD)} CAD
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Séquences</div>
            <div className="text-sm font-semibold text-gray-800">
              {totals.totalCount} séquence{totals.totalCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceList;