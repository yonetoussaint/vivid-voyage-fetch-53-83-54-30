// ConditionnementManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, X, Check, DollarSign } from 'lucide-react';

const ConditionnementManager = ({ 
  shift, 
  date, 
  vendeurs, 
  tousDepots, 
  onConditionnementUpdate,
  selectedDenomination = 1000
}) => {
  const [conditionnements, setConditionnements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', notes: '' });
  const [newConditionnement, setNewConditionnement] = useState({
    vendeur: vendeurs[0] || '',
    quantity: '',
    denomination: selectedDenomination,
    notes: ''
  });

  // Load conditionnements from localStorage
  useEffect(() => {
    const key = `conditionnements_${date}_${shift}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConditionnements(parsed);
        onConditionnementUpdate(parsed);
      } catch (e) {
        console.error('Error loading conditionnements:', e);
      }
    }
  }, [date, shift, onConditionnementUpdate]);

  // Save conditionnements to localStorage
  useEffect(() => {
    const key = `conditionnements_${date}_${shift}`;
    localStorage.setItem(key, JSON.stringify(conditionnements));
    onConditionnementUpdate(conditionnements);
  }, [conditionnements, date, shift, onConditionnementUpdate]);

  // Update newConditionnement when vendeurs or selectedDenomination changes
  useEffect(() => {
    setNewConditionnement(prev => ({
      ...prev,
      vendeur: vendeurs[0] || '',
      denomination: selectedDenomination
    }));
  }, [vendeurs, selectedDenomination]);

  const handleAddConditionnement = () => {
    if (!newConditionnement.vendeur || !newConditionnement.quantity) return;

    const conditionnement = {
      id: Date.now().toString(),
      date,
      shift,
      vendeur: newConditionnement.vendeur,
      quantity: parseInt(newConditionnement.quantity),
      denomination: selectedDenomination,
      total: parseInt(newConditionnement.quantity) * selectedDenomination,
      notes: newConditionnement.notes,
      timestamp: new Date().toISOString()
    };

    setConditionnements(prev => [...prev, conditionnement]);
    setNewConditionnement({
      vendeur: vendeurs[0] || '',
      quantity: '',
      denomination: selectedDenomination,
      notes: ''
    });
  };

  const handleDeleteConditionnement = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce conditionnement ?')) {
      setConditionnements(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditClick = (conditionnement) => {
    setEditingId(conditionnement.id);
    setEditForm({
      quantity: conditionnement.quantity.toString(),
      notes: conditionnement.notes || ''
    });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.quantity) return;

    setConditionnements(prev => prev.map(c => 
      c.id === id 
        ? { 
            ...c, 
            quantity: parseInt(editForm.quantity),
            total: parseInt(editForm.quantity) * c.denomination,
            notes: editForm.notes 
          }
        : c
    ));
    setEditingId(null);
    setEditForm({ quantity: '', notes: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ quantity: '', notes: '' });
  };

  // Calculate totals by vendeur
  const totalsByVendeur = conditionnements.reduce((acc, curr) => {
    if (!acc[curr.vendeur]) {
      acc[curr.vendeur] = {
        count: 0,
        totalHTG: 0,
        byDenomination: {}
      };
    }
    acc[curr.vendeur].count += curr.quantity;
    acc[curr.vendeur].totalHTG += curr.total;
    
    if (!acc[curr.vendeur].byDenomination[curr.denomination]) {
      acc[curr.vendeur].byDenomination[curr.denomination] = 0;
    }
    acc[curr.vendeur].byDenomination[curr.denomination] += curr.quantity;
    
    return acc;
  }, {});

  // Calculate grand total
  const grandTotal = conditionnements.reduce((sum, curr) => sum + curr.total, 0);
  const totalBillets = conditionnements.reduce((sum, curr) => sum + curr.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with denomination indicator */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Conditionnements</h2>
          <p className="text-sm text-slate-600">
            {shift === 'AM' ? 'Matin' : 'Soir'} - {new Date(date).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-sm text-blue-700 font-medium">
            Dénomination active: {selectedDenomination} Gdes
          </span>
        </div>
      </div>

      {/* Add new conditionnement form */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Nouveau conditionnement</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={newConditionnement.vendeur}
            onChange={(e) => setNewConditionnement({...newConditionnement, vendeur: e.target.value})}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          >
            {vendeurs.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <input
            type="number"
            value={newConditionnement.quantity}
            onChange={(e) => setNewConditionnement({...newConditionnement, quantity: e.target.value})}
            placeholder="Nombre de billets"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />

          <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
            <DollarSign size={14} className="mr-1" />
            Total: {(parseInt(newConditionnement.quantity) || 0) * selectedDenomination} Gdes
          </div>

          <input
            type="text"
            value={newConditionnement.notes}
            onChange={(e) => setNewConditionnement({...newConditionnement, notes: e.target.value})}
            placeholder="Notes (optionnel)"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={handleAddConditionnement}
          disabled={!newConditionnement.vendeur || !newConditionnement.quantity}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter conditionnement
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-4">
          <div className="text-xs text-slate-600 font-medium mb-1">Total Billets</div>
          <div className="text-2xl font-bold text-slate-900">{totalBillets}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-4">
          <div className="text-xs text-emerald-700 font-medium mb-1">Total HTG</div>
          <div className="text-2xl font-bold text-emerald-900">{grandTotal.toLocaleString()} Gdes</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="text-xs text-blue-700 font-medium mb-1">Dénomination</div>
          <div className="text-2xl font-bold text-blue-900">{selectedDenomination} Gdes</div>
        </div>
      </div>

      {/* Conditionnements by vendeur */}
      {Object.keys(totalsByVendeur).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(totalsByVendeur).map(([vendeur, stats]) => (
            <div key={vendeur} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <h4 className="font-semibold text-slate-900">{vendeur}</h4>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{stats.count}</span> billets •{' '}
                  <span className="font-medium">{stats.totalHTG.toLocaleString()} Gdes</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {conditionnements
                  .filter(c => c.vendeur === vendeur)
                  .map(conditionnement => (
                    <div key={conditionnement.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      {editingId === conditionnement.id ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                            className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editForm.notes}
                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                            placeholder="Notes"
                            className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                          />
                          <button
                            onClick={() => handleSaveEdit(conditionnement.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-700 w-16">
                              {conditionnement.quantity} billets
                            </span>
                            <span className="text-sm text-slate-600">
                              {conditionnement.denomination} Gdes × {conditionnement.quantity} ={' '}
                              <span className="font-semibold text-emerald-700">
                                {conditionnement.total.toLocaleString()} Gdes
                              </span>
                            </span>
                            {conditionnement.notes && (
                              <span className="text-xs text-slate-500 italic">
                                {conditionnement.notes}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(conditionnement)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteConditionnement(conditionnement.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <div className="text-slate-400 mb-2">
            <DollarSign size={48} className="mx-auto" />
          </div>
          <p className="text-slate-600">Aucun conditionnement enregistré</p>
          <p className="text-sm text-slate-400 mt-1">
            Ajoutez des conditionnements pour {selectedDenomination} Gdes
          </p>
        </div>
      )}
    </div>
  );
};

export default ConditionnementManager;