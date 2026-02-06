// components/easy/VendeursManager.jsx
import React, { useState } from 'react';
import { Users, User, Plus, Trash2, Phone, Clock, AlertCircle, Search } from 'lucide-react';

const VendeursManager = ({ 
  vendeurs, 
  nouveauVendeur, 
  setNouveauVendeur, 
  ajouterVendeur, 
  supprimerVendeur, 
  getNombreAffectations,
  vendeurActif 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerData, setSellerData] = useState({});

  // Filter vendeurs based on search and active tab
  const filteredVendeurs = vendeurs.filter(vendeur => {
    // Filter by active vendor tab
    if (vendeurActif && vendeur !== vendeurActif) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !vendeur.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Initialize seller data when a new seller is added
  const handleAddVendeur = () => {
    if (!nouveauVendeur.trim()) return;
    
    ajouterVendeur();
    
    // Initialize seller data
    setSellerData(prev => ({
      ...prev,
      [nouveauVendeur]: {
        phone: "",
        shift: "AM",
        tardiness: 0,
        affectations: 0
      }
    }));
    
    setNouveauVendeur("");
  };

  const getSellerInfo = (vendeur) => {
    return sellerData[vendeur] || {
      phone: "Non défini",
      shift: "AM",
      tardiness: 0,
      affectations: getNombreAffectations ? getNombreAffectations(vendeur) : 0
    };
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un vendeur..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            {filteredVendeurs.length} trouvé(s)
          </div>
        </div>
      </div>

      {/* Add Vendeur Form */}
      <div className="bg-white rounded-lg shadow border p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Ajouter un vendeur
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={nouveauVendeur}
            onChange={(e) => setNouveauVendeur(e.target.value)}
            placeholder="Nom du vendeur"
            className="flex-1 p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddVendeur()}
          />
          <button
            onClick={handleAddVendeur}
            className="bg-blue-600 text-white px-4 py-2.5 rounded font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Vendeurs List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">
                Liste des Vendeurs
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({filteredVendeurs.length} sur {vendeurs.length})
                </span>
              </h2>
              {vendeurActif && (
                <p className="text-sm text-gray-500 mt-1">
                  Affichage: <span className="font-medium">{vendeurActif}</span>
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Total: {vendeurs.length}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="divide-y">
          {filteredVendeurs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? (
                <div className="space-y-2">
                  <Search className="w-12 h-12 mx-auto text-gray-300" />
                  <p>Aucun vendeur trouvé pour "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Effacer la recherche
                  </button>
                </div>
              ) : vendeurs.length === 0 ? (
                <div className="space-y-2">
                  <Users className="w-12 h-12 mx-auto text-gray-300" />
                  <p>Aucun vendeur enregistré</p>
                  <p className="text-sm">Ajoutez votre premier vendeur</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Filter className="w-12 h-12 mx-auto text-gray-300" />
                  <p>Aucun vendeur à afficher avec le filtre actuel</p>
                  <p className="text-sm">Essayez un autre filtre</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredVendeurs.map((vendeur, index) => {
                const info = getSellerInfo(vendeur);
                
                return (
                  <div 
                    key={vendeur} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{vendeur}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>ID: {String(index + 1).padStart(3, '0')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              info.tardiness > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {info.tardiness > 0 ? `${info.tardiness} retard(s)` : 'À jour'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => supprimerVendeur(vendeur)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-3">
                      {/* Phone */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">
                          {info.phone || "Non défini"}
                        </span>
                      </div>

                      {/* Shift */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Quart: {info.shift}
                        </span>
                      </div>

                      {/* Affectations */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Affectations pompes:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {info.affectations}
                        </span>
                      </div>

                      {/* Tardiness Warning */}
                      {info.tardiness > 0 && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">
                            {info.tardiness} retard{info.tardiness > 1 ? 's' : ''} enregistré{info.tardiness > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Total Vendeurs</div>
          <div className="text-2xl font-bold">{vendeurs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Affichage</div>
          <div className="text-2xl font-bold">{filteredVendeurs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Affectations totales</div>
          <div className="text-2xl font-bold">
            {vendeurs.reduce((total, vendeur) => {
              const affectations = getNombreAffectations ? getNombreAffectations(vendeur) : 0;
              return total + affectations;
            }, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Retards totaux</div>
          <div className="text-2xl font-bold">
            {vendeurs.reduce((total, vendeur) => {
              const info = getSellerInfo(vendeur);
              return total + (info.tardiness || 0);
            }, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;