import React from 'react';
import { Trash2, X, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

// Add denominations configuration
const denominations = [
  { value: 100, color: 'bg-red-600' },
  { value: 50, color: 'bg-green-600' },
  { value: 20, color: 'bg-blue-600' },
  { value: 10, color: 'bg-purple-600' },
  { value: 5, color: 'bg-yellow-600' },
  { value: 2, color: 'bg-pink-600' },
  { value: 1, color: 'bg-indigo-600' },
  { value: 0.5, color: 'bg-teal-600' },
  { value: 0.25, color: 'bg-cyan-600' },
];

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
    className={`flex flex-col gap-2 p-3 rounded-lg transition-all ${
      isEditing
        ? 'bg-amber-50 border border-amber-300'
        : 'bg-white border border-gray-200 hover:border-gray-300'
    }`}
  >
    {/* Header with basic info */}
    <div className="flex items-center justify-between">
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

    {/* Denominations breakdown with colors */}
    <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-1.5">Dénominations:</h4>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(sequence.breakdown || {})
          .filter(([_, value]) => value && parseFloat(value) > 0)
          .map(([denomValue, value]) => {
            const denom = denominations.find(d => d.value === parseFloat(denomValue));
            if (!denom) return null;

            return (
              <div key={denomValue} className="flex items-center bg-white px-2 py-1 rounded-md border border-gray-200 shadow-xs">
                <div className={`${denom.color} w-6 h-6 rounded-sm flex items-center justify-center mr-1.5`}>
                  <span className="text-white font-bold text-xs">{denom.value}</span>
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  × {value} = {formaterArgent(denom.value * parseFloat(value))}
                </span>
              </div>
            );
          })}
        
        {(!sequence.breakdown || Object.keys(sequence.breakdown || {}).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length === 0) && (
          <div className="text-xs text-gray-500 italic px-2 py-1">
            Aucune dénomination détaillée
          </div>
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
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
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