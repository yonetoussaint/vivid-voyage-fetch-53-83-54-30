import React, { useState } from 'react';
import { Plus, Trash2, DollarSign, CheckCircle } from 'lucide-react';

const ConditionnementManager = ({ 
  shift, 
  date,
  vendeurs,
  onConditionnementUpdate 
}) => {
  const [conditionnements, setConditionnements] = useState([
    {
      id: 1,
      vendeurId: null,
      billets: {
        '100': 0,
        '50': 0,
        '20': 0,
        '10': 0,
        '5': 0,
        '2': 0,
        '1': 0
      },
      pieces: {
        '2': 0,
        '1': 0,
        '0.50': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0,
        '0.01': 0
      },
      total: 0,
      commentaire: ''
    }
  ]);

  const [nouveauConditionnement, setNouveauConditionnement] = useState({
    vendeurId: '',
    billets: {
      '100': 0,
      '50': 0,
      '20': 0,
      '10': 0,
      '5': 0,
      '2': 0,
      '1': 0
    },
    pieces: {
      '2': 0,
      '1': 0,
      '0.50': 0,
      '0.25': 0,
      '0.10': 0,
      '0.05': 0,
      '0.01': 0
    },
    commentaire: ''
  });

  const calculateTotal = (billets, pieces) => {
    let total = 0;
    
    // Calculate bills
    Object.entries(billets).forEach(([denomination, quantite]) => {
      total += parseFloat(denomination) * quantite;
    });
    
    // Calculate coins
    Object.entries(pieces).forEach(([denomination, quantite]) => {
      total += parseFloat(denomination) * quantite;
    });
    
    return total.toFixed(2);
  };

  const handleAddConditionnement = () => {
    if (!nouveauConditionnement.vendeurId) {
      alert('Veuillez sélectionner un vendeur');
      return;
    }

    const total = calculateTotal(
      nouveauConditionnement.billets,
      nouveauConditionnement.pieces
    );

    const newEntry = {
      id: Date.now(),
      ...nouveauConditionnement,
      vendeurId: nouveauConditionnement.vendeurId,
      total: parseFloat(total)
    };

    setConditionnements([...conditionnements, newEntry]);
    
    // Reset form
    setNouveauConditionnement({
      vendeurId: '',
      billets: {
        '100': 0,
        '50': 0,
        '20': 0,
        '10': 0,
        '5': 0,
        '2': 0,
        '1': 0
      },
      pieces: {
        '2': 0,
        '1': 0,
        '0.50': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0,
        '0.01': 0
      },
      commentaire: ''
    });

    // Notify parent if needed
    if (onConditionnementUpdate) {
      onConditionnementUpdate([...conditionnements, newEntry]);
    }
  };

  const handleDeleteConditionnement = (id) => {
    const updated = conditionnements.filter(c => c.id !== id);
    setConditionnements(updated);
    
    if (onConditionnementUpdate) {
      onConditionnementUpdate(updated);
    }
  };

  const handleUpdateBillet = (conditionnementId, denomination, value) => {
    const updated = conditionnements.map(c => {
      if (c.id === conditionnementId) {
        const newBillets = { ...c.billets, [denomination]: parseInt(value) || 0 };
        const total = calculateTotal(newBillets, c.pieces);
        return {
          ...c,
          billets: newBillets,
          total: parseFloat(total)
        };
      }
      return c;
    });
    
    setConditionnements(updated);
    
    if (onConditionnementUpdate) {
      onConditionnementUpdate(updated);
    }
  };

  const handleUpdatePiece = (conditionnementId, denomination, value) => {
    const updated = conditionnements.map(c => {
      if (c.id === conditionnementId) {
        const newPieces = { ...c.pieces, [denomination]: parseInt(value) || 0 };
        const total = calculateTotal(c.billets, newPieces);
        return {
          ...c,
          pieces: newPieces,
          total: parseFloat(total)
        };
      }
      return c;
    });
    
    setConditionnements(updated);
    
    if (onConditionnementUpdate) {
      onConditionnementUpdate(updated);
    }
  };

  const getVendeurName = (vendeurId) => {
    const vendeur = vendeurs.find(v => v.id === vendeurId);
    return vendeur ? vendeur.nom : 'Non affecté';
  };

  const totalGeneral = conditionnements.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-green-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Conditionnement des Espèces</h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
          Shift {shift}
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Conditionné</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalGeneral.toFixed(2)} $
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Nombre d'entrées</p>
          <p className="text-2xl font-bold text-gray-900">
            {conditionnements.length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(date).toLocaleDateString('fr-CA')}
          </p>
        </div>
      </div>

      {/* Add New Entry Form */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Nouveau Conditionnement</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendeur
            </label>
            <select
              value={nouveauConditionnement.vendeurId}
              onChange={(e) => setNouveauConditionnement({
                ...nouveauConditionnement,
                vendeurId: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sélectionner un vendeur</option>
              {vendeurs.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nom}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire
            </label>
            <input
              type="text"
              value={nouveauConditionnement.commentaire}
              onChange={(e) => setNouveauConditionnement({
                ...nouveauConditionnement,
                commentaire: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Ex: Conditionnement du soir"
            />
          </div>
        </div>

        {/* Bills Input */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Billets</h4>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {Object.keys(nouveauConditionnement.billets).map(denomination => (
              <div key={denomination} className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  {denomination}$
                </label>
                <input
                  type="number"
                  min="0"
                  value={nouveauConditionnement.billets[denomination]}
                  onChange={(e) => setNouveauConditionnement({
                    ...nouveauConditionnement,
                    billets: {
                      ...nouveauConditionnement.billets,
                      [denomination]: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coins Input */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Pièces</h4>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {Object.keys(nouveauConditionnement.pieces).map(denomination => (
              <div key={denomination} className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  {denomination}$
                </label>
                <input
                  type="number"
                  min="0"
                  value={nouveauConditionnement.pieces[denomination]}
                  onChange={(e) => setNouveauConditionnement({
                    ...nouveauConditionnement,
                    pieces: {
                      ...nouveauConditionnement.pieces,
                      [denomination]: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            Total: {calculateTotal(
              nouveauConditionnement.billets,
              nouveauConditionnement.pieces
            )} $
          </div>
          <button
            onClick={handleAddConditionnement}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      {/* List of Conditionnements */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 mb-2">Historique des Conditionnements</h3>
        
        {conditionnements.map(conditionnement => (
          <div key={conditionnement.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {getVendeurName(conditionnement.vendeurId)}
                </h4>
                {conditionnement.commentaire && (
                  <p className="text-sm text-gray-600">{conditionnement.commentaire}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">
                  {conditionnement.total.toFixed(2)} $
                </span>
                <button
                  onClick={() => handleDeleteConditionnement(conditionnement.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Bills Display */}
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Billets:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(conditionnement.billets)
                  .filter(([, qty]) => qty > 0)
                  .map(([denomination, quantite]) => (
                    <div key={denomination} className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={quantite}
                        onChange={(e) => handleUpdateBillet(
                          conditionnement.id,
                          denomination,
                          e.target.value
                        )}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-sm text-gray-600">x {denomination}$</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Coins Display */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Pièces:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(conditionnement.pieces)
                  .filter(([, qty]) => qty > 0)
                  .map(([denomination, quantite]) => (
                    <div key={denomination} className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={quantite}
                        onChange={(e) => handleUpdatePiece(
                          conditionnement.id,
                          denomination,
                          e.target.value
                        )}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-sm text-gray-600">x {denomination}$</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {conditionnements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="mx-auto mb-2" size={32} />
          <p>Aucun conditionnement enregistré</p>
        </div>
      )}
    </div>
  );
};

export default ConditionnementManager;