// ConditionnementManager.jsx
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign } from 'lucide-react';

const ConditionnementManager = ({ 
  shift, 
  date, 
  vendeurs, 
  tousDepots,
  onConditionnementUpdate,
  selectedDenomination = 1000
}) => {
  const [conditionnementData, setConditionnementData] = useState({});
  const [newEntry, setNewEntry] = useState({
    vendeur: vendeurs[0] || '',
    depot: '',
    quantité: '',
    montant: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [totals, setTotals] = useState({
    totalQuantite: 0,
    totalMontant: 0,
    parVendeur: {},
    parDepot: {}
  });

  // Load data when denomination changes
  useEffect(() => {
    const storageKey = `conditionnement_${date}_${shift}_${selectedDenomination}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      setConditionnementData(parsed);
      calculateTotals(parsed.entries || []);
    } else {
      const initialData = {
        denomination: selectedDenomination,
        shift: shift,
        date: date,
        entries: []
      };
      setConditionnementData(initialData);
      calculateTotals([]);
    }
  }, [date, shift, selectedDenomination]);

  // Calculate totals whenever entries change
  const calculateTotals = (entries) => {
    const totals = {
      totalQuantite: 0,
      totalMontant: 0,
      parVendeur: {},
      parDepot: {}
    };

    entries.forEach(entry => {
      const quantite = Number(entry.quantité) || 0;
      const montant = Number(entry.montant) || 0;
      
      totals.totalQuantite += quantite;
      totals.totalMontant += montant;
      
      // Par vendeur
      if (!totals.parVendeur[entry.vendeur]) {
        totals.parVendeur[entry.vendeur] = { quantite: 0, montant: 0 };
      }
      totals.parVendeur[entry.vendeur].quantite += quantite;
      totals.parVendeur[entry.vendeur].montant += montant;
      
      // Par dépôt
      if (!totals.parDepot[entry.depot]) {
        totals.parDepot[entry.depot] = { quantite: 0, montant: 0 };
      }
      totals.parDepot[entry.depot].quantite += quantite;
      totals.parDepot[entry.depot].montant += montant;
    });

    setTotals(totals);
  };

  // Save data to localStorage
  const saveData = (newData) => {
    const storageKey = `conditionnement_${date}_${shift}_${selectedDenomination}`;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    setConditionnementData(newData);
    calculateTotals(newData.entries || []);
    
    if (onConditionnementUpdate) {
      onConditionnementUpdate(newData);
    }
  };

  // Add new entry
  const handleAddEntry = () => {
    if (!newEntry.vendeur || !newEntry.depot || !newEntry.quantité) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const updatedEntries = [...(conditionnementData.entries || [])];
    
    if (editingId !== null) {
      // Update existing entry
      updatedEntries[editingId] = {
        ...newEntry,
        quantité: Number(newEntry.quantité),
        montant: Number(newEntry.montant) || (Number(newEntry.quantité) * selectedDenomination)
      };
    } else {
      // Add new entry
      updatedEntries.push({
        ...newEntry,
        id: Date.now(),
        quantité: Number(newEntry.quantité),
        montant: Number(newEntry.montant) || (Number(newEntry.quantité) * selectedDenomination)
      });
    }

    const updatedData = {
      ...conditionnementData,
      entries: updatedEntries
    };

    saveData(updatedData);
    
    // Reset form
    setNewEntry({
      vendeur: vendeurs[0] || '',
      depot: '',
      quantité: '',
      montant: ''
    });
    setEditingId(null);
  };

  // Edit entry
  const handleEditEntry = (index) => {
    const entry = conditionnementData.entries[index];
    setNewEntry({
      vendeur: entry.vendeur,
      depot: entry.depot,
      quantité: entry.quantité.toString(),
      montant: entry.montant.toString()
    });
    setEditingId(index);
  };

  // Delete entry
  const handleDeleteEntry = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée?')) {
      const updatedEntries = conditionnementData.entries.filter((_, i) => i !== index);
      const updatedData = {
        ...conditionnementData,
        entries: updatedEntries
      };
      saveData(updatedData);
    }
  };

  // Calculate montant automatically when quantité changes
  const handleQuantiteChange = (e) => {
    const quantite = e.target.value;
    const montantCalculated = quantite ? Number(quantite) * selectedDenomination : '';
    
    setNewEntry({
      ...newEntry,
      quantité: quantite,
      montant: montantCalculated
    });
  };

  // Get available depots from tousDepots or use default
  const availableDepots = tousDepots?.length > 0 
    ? tousDepots 
    : ['Dépôt 1', 'Dépôt 2', 'Dépôt 3', 'Dépôt 4'];

  return (
    <div className="space-y-6">
      {/* Header with denomination info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Conditionnement {selectedDenomination} Gdes - {shift === 'AM' ? 'Matin' : 'Soir'}
        </h2>
        <p className="text-sm text-blue-600 mt-1">
          Date: {new Date(date).toLocaleDateString('fr-FR')}
        </p>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          {editingId !== null ? 'Modifier' : 'Ajouter'} une entrée
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendeur
            </label>
            <select
              value={newEntry.vendeur}
              onChange={(e) => setNewEntry({...newEntry, vendeur: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Sélectionner</option>
              {vendeurs.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dépôt
            </label>
            <select
              value={newEntry.depot}
              onChange={(e) => setNewEntry({...newEntry, depot: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Sélectionner</option>
              {availableDepots.map(depot => (
                <option key={depot} value={depot}>{depot}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={newEntry.quantité}
              onChange={handleQuantiteChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nombre de paquets"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (Gdes)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newEntry.montant}
              onChange={(e) => setNewEntry({...newEntry, montant: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Montant total"
              readOnly={!newEntry.montant} // Optional: make it read-only since it's auto-calculated
            />
          </div>
        </div>
        
        <button
          onClick={handleAddEntry}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editingId !== null ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Mettre à jour
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </>
          )}
        </button>
        
        {editingId !== null && (
          <button
            onClick={() => {
              setNewEntry({
                vendeur: vendeurs[0] || '',
                depot: '',
                quantité: '',
                montant: ''
              });
              setEditingId(null);
            }}
            className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
        )}
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Totaux Généraux</h4>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Quantité totale:</span>{' '}
              {totals.totalQuantite} paquets
            </p>
            <p className="text-sm">
              <span className="font-medium">Montant total:</span>{' '}
              {totals.totalMontant.toLocaleString()} Gdes
            </p>
            <p className="text-sm text-green-600">
              <span className="font-medium">Valeur par paquet:</span>{' '}
              {selectedDenomination} Gdes
            </p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Par Vendeur</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(totals.parVendeur).map(([vendeur, data]) => (
              <p key={vendeur} className="text-sm">
                <span className="font-medium">{vendeur}:</span>{' '}
                {data.quantite} paquets ({data.montant.toLocaleString()} Gdes)
              </p>
            ))}
            {Object.keys(totals.parVendeur).length === 0 && (
              <p className="text-sm text-gray-500">Aucune donnée</p>
            )}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg md:col-span-2">
          <h4 className="font-semibold text-orange-800 mb-2">Par Dépôt</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {Object.entries(totals.parDepot).map(([depot, data]) => (
              <p key={depot} className="text-sm">
                <span className="font-medium">{depot}:</span>{' '}
                {data.quantite} paquets ({data.montant.toLocaleString()} Gdes)
              </p>
            ))}
            {Object.keys(totals.parDepot).length === 0 && (
              <p className="text-sm text-gray-500">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-lg font-medium p-4 border-b bg-gray-50">
          Liste des entrées
        </h3>
        
        {conditionnementData.entries?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendeur</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dépôt</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Quantité</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Montant (Gdes)</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conditionnementData.entries.map((entry, index) => (
                  <tr key={entry.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{entry.vendeur}</td>
                    <td className="px-4 py-2 text-sm">{entry.depot}</td>
                    <td className="px-4 py-2 text-sm text-right">{entry.quantité}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {entry.montant?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      <button
                        onClick={() => handleEditEntry(index)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-sm">Total</td>
                  <td className="px-4 py-2 text-sm text-right">{totals.totalQuantite}</td>
                  <td className="px-4 py-2 text-sm text-right">{totals.totalMontant.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Aucune entrée pour cette dénomination
          </div>
        )}
      </div>

      {/* Save Status */}
      <div className="text-sm text-gray-500 text-right">
        Dernière sauvegarde: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ConditionnementManager;