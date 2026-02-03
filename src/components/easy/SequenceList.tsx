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

  return (
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
  );
};

export default SequenceList;