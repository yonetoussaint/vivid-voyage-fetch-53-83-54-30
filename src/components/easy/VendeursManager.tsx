import React from 'react';
import { Users, User, Plus, Trash2 } from 'lucide-react';

const VendeursManager = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gray-100 rounded-lg">
          <Users size={20} className="text-gray-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gérer les Vendeurs</h2>
          <p className="text-sm text-gray-500">Ajoutez et gérez vos vendeurs</p>
        </div>
      </div>

      {/* Ajouter Vendeur */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ajouter un vendeur</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={nouveauVendeur}
            onChange={(e) => setNouveauVendeur(e.target.value)}
            placeholder="Saisir le nom du vendeur"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            onKeyPress={(e) => e.key === 'Enter' && ajouterVendeur()}
          />
          <button
            onClick={ajouterVendeur}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all sm:w-auto w-full"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des Vendeurs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Vendeurs Actuels</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {vendeurs.length} vendeur{vendeurs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="p-4">
          {vendeurs.length > 0 ? (
            <div className="space-y-3">
              {vendeurs.map((vendeur, index) => (
                <div key={vendeur} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendeur}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">ID: {index + 1}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs font-medium text-blue-600">
                          {getNombreAffectations ? getNombreAffectations(vendeur) : 0} pompe(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => supprimerVendeur(vendeur)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    aria-label={`Supprimer ${vendeur}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Aucun vendeur</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Commencez par ajouter un vendeur pour pouvoir l'affecter aux pompes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;