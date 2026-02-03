import React from 'react';
import { Trash2, X, Edit2, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

// Preset color system matching MoneyCounterGrid denominations
const denominationColors = [
  { value: 1000, color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  { value: 500, color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
  { value: 200, color: 'bg-gradient-to-r from-green-600 to-emerald-600' },
  { value: 100, color: 'bg-gradient-to-r from-amber-600 to-orange-600' },
  { value: 50, color: 'bg-gradient-to-r from-red-600 to-rose-600' },
  { value: 20, color: 'bg-gradient-to-r from-indigo-600 to-violet-600' },
  { value: 10, color: 'bg-gradient-to-r from-teal-600 to-cyan-600' },
  { value: 5, color: 'bg-gradient-to-r from-rose-600 to-pink-600' },
  { value: 2, color: 'bg-gradient-to-r from-lime-600 to-green-600' },
  { value: 1, color: 'bg-gradient-to-r from-gray-600 to-slate-600' },
  { value: 0.5, color: 'bg-gradient-to-r from-cyan-600 to-blue-600' },
  { value: 0.25, color: 'bg-gradient-to-r from-fuchsia-600 to-purple-600' },
];

// Function to get color based on primary denomination in sequence
const getSequenceColor = (sequence) => {
  if (!sequence?.breakdown) {
    // Fallback based on amount if no breakdown exists
    const amount = sequence?.amount || 0;
    for (const denom of denominationColors) {
      if (amount >= denom.value) {
        return denom.color;
      }
    }
    return denominationColors[denominationColors.length - 1].color;
  }

  // Find the highest denomination in the breakdown
  const entries = Object.entries(sequence.breakdown)
    .filter(([_, value]) => value && parseFloat(value) > 0)
    .map(([denomValue]) => parseFloat(denomValue))
    .sort((a, b) => b - a);

  if (entries.length > 0) {
    const highestDenom = entries[0];
    const matchedColor = denominationColors.find(d => d.value === highestDenom);
    if (matchedColor) return matchedColor.color;
    
    // Find closest denomination
    for (const denom of denominationColors) {
      if (highestDenom >= denom.value) {
        return denom.color;
      }
    }
  }

  return denominationColors[denominationColors.length - 1].color;
};

// Function to get primary denomination from sequence
const getPrimaryDenomination = (sequence) => {
  if (!sequence?.breakdown) return null;
  
  const entries = Object.entries(sequence.breakdown)
    .filter(([_, value]) => value && parseFloat(value) > 0);
  
  if (entries.length === 0) return null;
  
  // Sort by denomination value (highest first)
  entries.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
  return {
    value: parseFloat(entries[0][0]),
    count: parseFloat(entries[0][1])
  };
};

// Individual Sequence Item Component
const SequenceItem = ({ 
  sequence = {}, 
  isEditing = false, 
  vendorInputs = {}, 
  vendeur,
  onEdit = () => {}, 
  onRemove = () => {}, 
  onSave = () => {}, 
  onCancel = () => {} 
}) => {
  const sequenceColor = getSequenceColor(sequence);
  const primaryDenom = getPrimaryDenomination(sequence);
  const note = sequence.note || 'Sans note';
  const timestamp = sequence.timestamp || '';
  const amount = sequence.amount || 0;
  const currency = sequence.currency || 'HTG';

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        isEditing
          ? 'bg-amber-50 border border-amber-300'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Left side: Color chip and sequence info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Color chip matching MoneyCounterGrid style */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`${sequenceColor} w-10 h-10 rounded-lg flex items-center justify-center shadow-sm`}>
            <span className="text-white font-bold text-xs">
              {primaryDenom ? primaryDenom.value : (currency === 'USD' ? '$' : '€')}
            </span>
          </div>
          {primaryDenom && (
            <span className="text-xs text-gray-500 mt-1">
              ×{primaryDenom.count}
            </span>
          )}
        </div>
        
        {/* Sequence details */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">{note}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
            <span>{timestamp}</span>
            {sequence.breakdown && Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length} dénom.
              </span>
            )}
          </div>
          
          {/* Denomination summary */}
          {sequence.breakdown && (
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(sequence.breakdown)
                .filter(([_, value]) => value && parseFloat(value) > 0)
                .slice(0, 3) // Limit to 3 denominations for compact display
                .map(([denomValue, count]) => {
                  const value = parseFloat(denomValue);
                  const denom = denominationColors.find(d => d.value === value);
                  
                  return (
                    <div 
                      key={denomValue} 
                      className="inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-xs border border-gray-200"
                    >
                      <div className={`${denom?.color || 'bg-gray-600'} w-4 h-4 rounded-sm flex items-center justify-center`}>
                        <span className="text-white text-[10px] font-bold">
                          {value}
                        </span>
                      </div>
                      <span className="text-gray-700">×{count}</span>
                    </div>
                  );
                })}
              {sequence.breakdown && Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length > 3 && (
                <span className="text-xs text-gray-500">
                  +{Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length - 3} plus
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Amount and action buttons */}
      <div className="flex items-center gap-2">
        {/* Amount display */}
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {formaterArgent(amount)} {currency}
          </div>
          {sequence.breakdown && (
            <div className="text-xs text-gray-500">
              {Object.keys(sequence.breakdown).filter(k => sequence.breakdown[k] && parseFloat(sequence.breakdown[k]) > 0).length} items
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
                className={`p-1.5 rounded transition-colors ${
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
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Annuler"
              >
                <RotateCcw size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(sequence)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Éditer"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onRemove(vendeur, sequence.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

// Sequence List Component
const SequenceList = ({ 
  sequences = [], 
  editingSequenceId = null, 
  vendorInputs = {}, 
  vendeur,
  onEditSequence = () => {}, 
  onRemoveSequence = () => {}, 
  onSaveEditedSequence = () => {}, 
  onCancelSequenceEdit = () => {},
  variant = 'default'
}) => {
  // Handle empty sequences
  if (!sequences || sequences.length === 0) {
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
            key={sequence.id || Math.random().toString()}
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