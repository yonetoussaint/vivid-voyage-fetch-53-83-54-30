import React from 'react';
import { Trash2, X } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

// Preset color system matching MoneyCounterGrid
const denominationColors = [
  { value: 1000, color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  { value: 500, color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
  { value: 200, color: 'bg-gradient-to-r from-green-600 to-emerald-600' },
  { value: 100, color: 'bg-gradient-to-r from-amber-600 to-orange-600' },
  { value: 50, color: 'bg-gradient-to-r from-red-600 to-rose-600' },
  // ... rest of colors
];

// Function to get color based on primary denomination
const getSequenceColor = (sequence) => {
  if (!sequence.breakdown) {
    return denominationColors[denominationColors.length - 1].color;
  }

  const entries = Object.entries(sequence.breakdown)
    .filter(([_, value]) => value && parseFloat(value) > 0)
    .map(([denomValue]) => parseFloat(denomValue))
    .sort((a, b) => b - a);

  if (entries.length > 0) {
    const highestDenom = entries[0];
    const matchedColor = denominationColors.find(d => d.value === highestDenom);
    if (matchedColor) return matchedColor.color;
    
    for (const denom of denominationColors) {
      if (highestDenom >= denom.value) {
        return denom.color;
      }
    }
  }

  return denominationColors[denominationColors.length - 1].color;
};

const SequenceItem = ({ 
  sequence, 
  onRemove = () => {} 
}) => {
  const sequenceColor = getSequenceColor(sequence);
  
  // Get primary denomination
  let primaryDenom = null;
  if (sequence.breakdown) {
    const entries = Object.entries(sequence.breakdown)
      .filter(([_, value]) => value && parseFloat(value) > 0);
    
    if (entries.length > 0) {
      entries.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
      primaryDenom = {
        value: parseFloat(entries[0][0]),
        count: parseFloat(entries[0][1])
      };
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Color chip */}
        <div className="flex flex-col items-center">
          <div className={`${sequenceColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-xs">
              {primaryDenom ? primaryDenom.value : (sequence.currency === 'USD' ? '$' : '€')}
            </span>
          </div>
          {primaryDenom && (
            <span className="text-xs text-gray-500 mt-1">
              ×{primaryDenom.count}
            </span>
          )}
        </div>
        
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{sequence.note || 'No note'}</div>
          <div className="text-xs text-gray-500">{sequence.timestamp || ''}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {formaterArgent(sequence.amount)} {sequence.currency}
          </div>
        </div>
        <button
          onClick={() => onRemove(sequence.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          title="Supprimer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const SequenceList = ({ 
  sequences = [], 
  onRemoveSequence = () => {} 
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
      {sequences.map((sequence) => (
        <SequenceItem
          key={sequence.id}
          sequence={sequence}
          onRemove={onRemoveSequence}
        />
      ))}
    </div>
  );
};

export default SequenceList;