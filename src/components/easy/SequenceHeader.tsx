import React from 'react';
import { Trash2 } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SequenceHeader = ({ 
  currency, 
  sequences, 
  sequencesTotalByCurrency, 
  totalSequencesHTG,
  onClearSequences 
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${currency === 'HTG' ? 'bg-blue-600' : 'bg-green-600'}`}></div>
      <span className="text-sm font-bold text-gray-900">Séquences</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-600 flex flex-col items-end gap-0.5">
        {sequencesTotalByCurrency?.HTG > 0 && (
          <div className="text-blue-700 font-medium">
            {formaterArgent(sequencesTotalByCurrency.HTG)} HTG
          </div>
        )}
        {sequencesTotalByCurrency?.USD > 0 && (
          <div className="text-green-700 font-medium">
            {formaterArgent(sequencesTotalByCurrency.USD)} USD
          </div>
        )}
        {sequencesTotalByCurrency?.USD > 0 && totalSequencesHTG > 0 && (
          <div className="text-gray-500 text-[10px]">
            ≈ {formaterArgent(totalSequencesHTG)} HTG total
          </div>
        )}
      </div>
      {sequences.length > 0 && (
        <button
          onClick={onClearSequences}
          className="p-1.5 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
          title="Effacer toutes les séquences"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  </div>
);

export default SequenceHeader;