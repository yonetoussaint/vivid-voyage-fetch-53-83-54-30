import React from 'react';
import { Users, User, Plus, Trash2, Hash } from 'lucide-react';

const VendeursManager = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <Users size={20} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gestion des Vendeurs</h2>
            <p className="text-sm text-gray-500">Liste complète de vos vendeurs</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{vendeurs.length}</span>
        </div>
      </div>

      {/* Ajouter Vendeur */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ajouter un nouveau vendeur</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={nouveauVendeur}
              onChange={(e) => setNouveauVendeur(e.target.value)}
              placeholder="Nom complet du vendeur"
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onKeyPress={(e) => e.key === 'Enter' && ajouterVendeur()}
            />
            <User size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={ajouterVendeur}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all sm:w-auto w-full"
          >
            <Plus size={16} />
            Ajouter Vendeur
          </button>
        </div>
      </div>

      {/* Liste des Vendeurs - Grid Layout */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900">Vendeurs enregistrés</h3>
          <p className="text-xs text-gray-500 mt-1">Chaque vendeur est indépendant et peut être supprimé</p>
        </div>

        {vendeurs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendeurs.map((vendeur, index) => (
              <div 
                key={vendeur} 
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{vendeur}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">ID: {String(index + 1).padStart(3, '0')}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => supprimerVendeur(vendeur)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    aria-label={`Supprimer ${vendeur}`}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Pompes affectées</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-blue-600">
                        {getNombreAffectations ? getNombreAffectations(vendeur) : 0}
                      </span>
                      <span className="text-xs text-gray-500">pompe(s)</span>
                    </div>
                  </div>
                  
                  {getNombreAffectations && getNombreAffectations(vendeur) > 0 ? (
                    <div className="mt-2">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((getNombreAffectations(vendeur) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2 italic">
                      Non affecté à une pompe
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Users size={28} className="text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Aucun vendeur enregistré</h4>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Ajoutez vos premiers vendeurs pour commencer à gérer leurs affectations aux pompes.
            </p>
            <button
              onClick={ajouterVendeur}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Ajouter votre premier vendeur
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeursManager;