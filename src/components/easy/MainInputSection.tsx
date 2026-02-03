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
  calculatePresetAmount,
}) => {
  const value = vendorInputs[vendeur];
  const isValid = value && parseFloat(value) > 0;
  const hasSequences = sequences.length > 0;

  return (
    <div className="space-y-4">
      {/* Input + Action */}
      <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="number"
          min="1"
          step="1"
          value={value || ''}
          onChange={(e) => onInputChange(vendeur, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) {
              isEditingSequence
                ? onSaveEditedSequence()
                : onAddSequence(vendeur);
            }
          }}
          placeholder="Multiplicateur"
          className="flex-1 px-4 py-3 text-sm bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
        />

        {/* Actions */}
        <div className="flex items-center gap-1 pr-1">
          {isEditingSequence ? (
            <>
              <button
                onClick={onSaveEditedSequence}
                disabled={!isValid}
                className={`h-10 w-10 rounded-lg flex items-center justify-center transition
                  ${
                    isValid
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
              >
                <Save size={16} />
              </button>

              <button
                onClick={onCancelSequenceEdit}
                className="h-10 w-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center"
              >
                <RotateCcw size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddSequence(vendeur)}
              disabled={!isValid}
              className={`h-10 w-10 rounded-lg flex items-center justify-center transition
                ${
                  isValid
                    ? currency === 'HTG'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Helper / Preview */}
      {isValid && (
        <p className="text-xs text-center text-gray-500">
          {value} × {vendorState?.preset || 1} {currency} ={' '}
          <span className="font-semibold text-gray-800">
            {formaterArgent(calculatePresetAmount(vendeur))} {currency}
          </span>
        </p>
      )}

      {/* Primary Action */}
      {hasSequences && !isEditingSequence && (
        <button
          onClick={() => onAddCompleteDeposit(vendeur)}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white shadow-md
            ${
              editingMode
                ? 'bg-green-600'
                : 'bg-blue-600'
            }`}
        >
          <Plus size={16} />
          {editingMode ? 'Mettre à jour dépôt' : 'Ajouter dépôt'}

          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {sequencesTotalByCurrency?.HTG > 0 &&
              `${formaterArgent(sequencesTotalByCurrency.HTG)} HTG`}
            {sequencesTotalByCurrency?.HTG > 0 &&
              sequencesTotalByCurrency?.USD > 0 &&
              ' + '}
            {sequencesTotalByCurrency?.USD > 0 &&
              `${formaterArgent(sequencesTotalByCurrency.USD)} USD`}
          </span>
        </button>
      )}
    </div>
  );
};

export default MainInputSection;