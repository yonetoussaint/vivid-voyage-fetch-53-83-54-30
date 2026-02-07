import React, { useState } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { SHIFTS } from './constants';

const AddShortModal = ({ vendeurActif, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'Matin',
    totalSales: '',
    moneyGiven: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const calculateShortAmount = () => {
    const sales = parseFloat(formData.totalSales) || 0;
    const given = parseFloat(formData.moneyGiven) || 0;
    return Math.max(0, sales - given);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.totalSales || parseFloat(formData.totalSales) <= 0) {
      newErrors.totalSales = 'Ventes totales requises';
    }
    if (!formData.moneyGiven || parseFloat(formData.moneyGiven) < 0) {
      newErrors.moneyGiven = 'Argent rendu requis';
    }
    if (!formData.date) newErrors.date = 'Date requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const shortAmount = calculateShortAmount();
    
    // Format the date properly
    const formattedDate = formatDate(formData.date);
    
    const newShort = {
      id: Date.now(),
      date: formattedDate,
      dueDate: formatDate(new Date(new Date(formData.date).setDate(new Date(formData.date).getDate() + 5))),
      shift: formData.shift,
      totalSales: parseFloat(formData.totalSales),
      moneyGiven: parseFloat(formData.moneyGiven),
      shortAmount: shortAmount,
      remainingBalance: shortAmount,
      status: 'pending',
      originalStatus: 'pending',
      wasOverdue: false,
      notes: formData.notes || 'Nouveau déficit',
      paidFromPayroll: false,
      daysOverdue: 0,
      receiptPrinted: false,
      receiptNumber: null,
      printDate: null,
      vendorSigned: false,
      managerSigned: false,
      receiptCopyArchived: false,
      copiesPrinted: 0,
      partialPayments: []
    };

    console.log('Adding new short:', newShort);
    onSave(newShort);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const shortAmount = calculateShortAmount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-black" />
            <h3 className="text-lg font-bold text-black">Nouveau Déficit</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quart <span className="text-red-500">*</span>
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {SHIFTS.map(shift => (
                <option key={shift} value={shift}>{shift}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ventes totales (HTG) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalSales"
                value={formData.totalSales}
                onChange={handleChange}
                step="0.001"
                min="0"
                className={`w-full p-2 border rounded-lg ${errors.totalSales ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.000"
              />
              {errors.totalSales && <p className="text-red-500 text-xs mt-1">{errors.totalSales}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Argent rendu (HTG) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="moneyGiven"
                value={formData.moneyGiven}
                onChange={handleChange}
                step="0.001"
                min="0"
                className={`w-full p-2 border rounded-lg ${errors.moneyGiven ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.000"
              />
              {errors.moneyGiven && <p className="text-red-500 text-xs mt-1">{errors.moneyGiven}</p>}
            </div>
          </div>

          {/* Auto-calculated short amount */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Déficit calculé:</span>
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
              Ventes totales - Argent rendu = Déficit
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Raison du déficit..."
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium"
            >
              Ajouter Déficit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShortModal;