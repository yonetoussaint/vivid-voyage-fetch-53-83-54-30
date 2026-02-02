import React from 'react';
import { Plus, Save, RotateCcw } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const MainInputSection = ({ 
  vendeur,
  vendorInputs,
  vendorState,
  currency,
  isEditingSequence,
  sequences,
  sequencesTotalByCurrency,
  editingMode,
  onInputChange,
  onSaveEditedSequence,
  onCancelSequenceEdit,
  onAddSequence,
  onAddCompleteDeposit,
  calculatePresetAmount 
}) => {
  const hasSequences = sequences.length > 0;
  
  return (
    <div className="space-y-3">
      {/* Input Row */}
      <div className="flex items-stretch bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex-1">
          <input
            type="number"
            min="1"
            step="1"
            data-vendor={vendeur}
            value={vendorInputs[vendeur] || ''}
            onChange={(e) => onInputChange(vendeur, e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (isEditingSequence) {
                  onSaveEditedSequence();
                } else {
                  onAddSequence(vendeur);
                }
              }
            }}
            placeholder="Multiplicateur personnalisé"
            className="w-full px-4 py-3 text-sm bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Add/Update Button */}
        {isEditingSequence ? (
          <div className="flex border-l border-gray-300">
            <button
              onClick={onSaveEditedSequence}
              disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
              className={`px-4 flex items-center justify-center ${
                vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Mettre à jour"
            >
              <Save size={16} />
            </button>
            <button
              onClick={onCancelSequenceEdit}
              className="px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center border-l border-gray-300"
              title="Annuler"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddSequence(vendeur)}
            disabled={!vendorInputs[vendeur] || parseFloat(vendorInputs[vendeur]) <= 0}
            className={`px-4 flex items-center justify-center border-l border-gray-300 ${
              vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0
                ? currency === 'HTG'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Ajouter"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Quick Preview */}
      {vendorInputs[vendeur] && parseFloat(vendorInputs[vendeur]) > 0 && (
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {vendorInputs[vendeur]} × {vendorState?.preset || '1'} {currency} = 
            <span className="font-bold text-gray-900 ml-1">
              {formaterArgent(calculatePresetAmount(vendeur))} {currency}
            </span>
          </div>
        </div>
      )}

      {/* Add Complete Deposit Button */}
      {hasSequences && !isEditingSequence && (
        <button
          onClick={() => onAddCompleteDeposit(vendeur)}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm ${
            editingMode
              ? 'bg-gradient-to-r from-green-600 to-emerald-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-700'
          } text-white shadow-sm`}
        >
          <Plus size={16} />
          <span>{editingMode ? 'Mettre à jour dépôt' : 'Ajouter dépôt'}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {sequencesTotalByCurrency?.HTG > 0 && (
              <span>{formaterArgent(sequencesTotalByCurrency.HTG)} HTG</span>
            )}
            {sequencesTotalByCurrency?.HTG > 0 && sequencesTotalByCurrency?.USD > 0 && (
              <span> + </span>
            )}
            {sequencesTotalByCurrency?.USD > 0 && (
              <span>{formaterArgent(sequencesTotalByCurrency.USD)} USD</span>
            )}
          </span>
        </button>
      )}
    </div>
  );
};

export default MainInputSection;