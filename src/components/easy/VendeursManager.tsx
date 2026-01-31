import React from 'react';
import { Users, User } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const VendeursManager = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  return (
    <div className="space-y-4">
     
        <div className="flex items-center gap-2 mb-4">
          <Users size={22} />
          <h2 className="text-lg font-bold">Gérer les Vendeurs</h2>
        </div>

        {/* Ajouter Vendeur */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Ajouter un Vendeur</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={nouveauVendeur}
              onChange={(e) => setNouveauVendeur(e.target.value)}
              placeholder="Nom du vendeur"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold text-base"
              onKeyPress={(e) => e.key === 'Enter' && ajouterVendeur()}
            />
            <button
              onClick={ajouterVendeur}
              className="bg-white text-purple-600 px-4 py-3 rounded-lg font-bold text-base sm:w-auto w-full active:scale-95 transition"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des Vendeurs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-bold">Vendeurs Actuels</h3>
            <div className="text-sm opacity-90">
              Total: {vendeurs.length}
            </div>
          </div>

          {vendeurs.length > 0 ? (
            <div className="space-y-3">
              {vendeurs.map((vendeur, index) => (
                <div key={vendeur} className="bg-white bg-opacity-15 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base truncate">{vendeur}</p>
                        <p className="text-sm opacity-90">ID: {index + 1}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <div className="bg-white bg-opacity-20 px-3 py-1.5 rounded-lg text-sm">
                        Affecté à: {getNombreAffectations ? getNombreAffectations(vendeur) : 0} pompe(s)
                      </div>
                      <button
                        onClick={() => supprimerVendeur(vendeur)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm active:scale-95 transition"
                        aria-label={`Supprimer ${vendeur}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
              <Users size={32} className="mx-auto mb-3 opacity-70" />
              <p className="text-white text-opacity-80 mb-2">Aucun vendeur</p>
              <p className="text-sm text-white text-opacity-60">
                Ajoutez des vendeurs pour les affecter aux pompes
              </p>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default VendeursManager;