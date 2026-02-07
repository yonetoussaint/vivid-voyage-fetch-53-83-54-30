import React, { useState } from 'react';
import { X, Save, Trash2, Calculator } from 'lucide-react';

const EditShortModal = ({ short, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    totalSales: short.totalSales,
    moneyGiven: short.moneyGiven,
    notes: short.notes,
    shift: short.shift
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateShortAmount = () => {
    const sales = parseFloat(formData.totalSales) || 0;
    const given = parseFloat(formData.moneyGiven) || 0;
    return Math.max(0, sales - given);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const shortAmount = calculateShortAmount();
    
    const updatedShort = {
      ...short,
      totalSales: parseFloat(formData.totalSales),
      moneyGiven: parseFloat(formData.moneyGiven),
      shortAmount: shortAmount,
      remainingBalance: shortAmount - (short.partialPayments?.reduce((sum, p) => sum + p.amount, 0) || 0),
      notes: formData.notes,
      shift: formData.shift
    };

    onSave(updatedShort);
    onClose();
  };

  const handleDelete = () => {
    onDelete(short.id);
    onClose();
  };

  const shortAmount = calculateShortAmount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-black">Modifier Déficit</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {short.date}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quart
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="Matin">Matin</option>
              <option value="Soir">Soir</option>
              <option value="Nuit">Nuit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ventes totales (HTG)
              </label>
              <input
                type="number"
                name="totalSales"
                value={formData.totalSales}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSales: e.target.value }))}
                step="0.001"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Argent rendu (HTG)
              </label>
              <input
                type="number"
                name="moneyGiven"
                value={formData.moneyGiven}
                onChange={(e) => setFormData(prev => ({ ...prev, moneyGiven: e.target.value }))}
                step="0.001"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Nouveau déficit:</span>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-gray-500" />
                <span className="text-lg font-bold text-red-600">
                  {shortAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                  })} HTG
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ancien déficit: {short.shortAmount.toLocaleString('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
              })} HTG
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {!showDeleteConfirm ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium"
                >
                  Confirmer suppression
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShortModal;