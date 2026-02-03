import React from 'react';
import { Trash2, X, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

// Preset colors for sequences (based on amount ranges or categories)
const getSequenceColor = (sequence) => {
  const amount = sequence.amount || 0;
  
  // Color based on amount ranges
  if (amount >= 1000) return 'bg-gradient-to-r from-purple-600 to-pink-600';
  if (amount >= 500) return 'bg-gradient-to-r from-blue-600 to-cyan-600';
  if (amount >= 200) return 'bg-gradient-to-r from-green-600 to-emerald-600';
  if (amount >= 100) return 'bg-gradient-to-r from-amber-600 to-orange-600';
  if (amount >= 50) return 'bg-gradient-to-r from-red-600 to-rose-600';
  return 'bg-gradient-to-r from-gray-600 to-slate-600';
};

// OR color based on currency
const getCurrencyColor = (sequence) => {
  if (sequence.currency === 'USD') return 'bg-gradient-to-r from-green-600 to-emerald-600';
  if (sequence.currency === 'EUR') return 'bg-gradient-to-r from-blue-600 to-cyan-600';
  return 'bg-gradient-to-r from-purple-600 to-pink-600';
};

// OR random preset colors from a fixed palette
const presetColors = [
  'bg-gradient-to-r from-blue-600 to-cyan-600',
  'bg-gradient-to-r from-purple-600 to-pink-600',
  'bg-gradient-to-r from-green-600 to-emerald-600',
  'bg-gradient-to-r from-amber-600 to-orange-600',
  'bg-gradient-to-r from-red-600 to-rose-600',
  'bg-gradient-to-r from-indigo-600 to-violet-600',
  'bg-gradient-to-r from-teal-600 to-cyan-600',
  'bg-gradient-to-r from-rose-600 to-pink-600',
];

const getPresetColor = (sequence) => {
  // Use sequence id or timestamp to get consistent color for same sequence
  const hash = sequence.id ? 
    sequence.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
    new Date(sequence.timestamp).getTime();
  
  return presetColors[hash % presetColors.length];
};

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
  const sequenceColor = getPresetColor(sequence); // Choose which color function to use

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        isEditing
          ? 'bg-amber-50 border border-amber-300'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Color indicator with sequence details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`${sequenceColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-white font-bold text-xs">
            {sequence.currency === 'USD' ? '$' : '€'}
          </span>
        </div>
        
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{sequence.note}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{sequence.timestamp}</span>
            {sequence.breakdown && Object.keys(sequence.breakdown).length > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] > 0).length} dénominations
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Amount and actions */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {formaterArgent(sequence.amount)} {sequence.currency}
          </div>
          {sequence.breakdown && (
            <div className="text-xs text-gray-500">
              {Object.entries(sequence.breakdown)
                .filter(([_, value]) => value > 0)
                .slice(0, 2)
                .map(([denom, count]) => (
                  <span key={denom} className="mr-1">
                    {denom}×{count}
                  </span>
                ))}
              {Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] > 0).length > 2 && '...'}
            </div>
          )}
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

// Alternative version with colored card background
const SequenceItemCard = ({ 
  sequence, 
  isEditing, 
  vendorInputs, 
  vendeur,
  onEdit, 
  onRemove, 
  onSave, 
  onCancel 
}) => {
  const sequenceColor = getPresetColor(sequence);

  return (
    <div 
      className={`rounded-lg overflow-hidden transition-all shadow-sm ${
        isEditing ? 'ring-2 ring-amber-400' : ''
      }`}
    >
      {/* Color bar at top */}
      <div className={`${sequenceColor} h-2 w-full`}></div>
      
      <div className="p-3 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Currency indicator in sequence color */}
            <div className={`${sequenceColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-xs">
                {sequence.currency}
              </span>
            </div>
            
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{sequence.note}</div>
              <div className="text-xs text-gray-500">{sequence.timestamp}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                {formaterArgent(sequence.amount)} {sequence.currency}
              </div>
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

        {/* Denomination tags at bottom */}
        {sequence.breakdown && Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] > 0).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {Object.entries(sequence.breakdown)
                .filter(([_, value]) => value > 0)
                .map(([denom, count]) => (
                  <div 
                    key={denom} 
                    className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs"
                  >
                    <span className="font-medium">{denom}</span>
                    <span className="text-gray-600">×{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
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
  onCancelSequenceEdit,
  variant = 'default' // 'default' or 'card'
}) => {
  if (sequences.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
        Aucune séquence ajoutée
      </div>
    );
  }

  const ItemComponent = variant === 'card' ? SequenceItemCard : SequenceItem;

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {sequences.map((sequence) => {
        const isEditing = sequence.id === editingSequenceId;

        return (
          <ItemComponent
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