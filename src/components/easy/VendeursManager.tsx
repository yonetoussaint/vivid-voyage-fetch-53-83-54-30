// components/easy/VendeursManager.jsx
import React, { useState } from 'react';
import { User, Phone, Clock, AlertCircle, Mail, Calendar } from 'lucide-react';

const VendeursManager = ({ 
  vendeurs, 
  vendeurActif,
  getNombreAffectations 
}) => {
  const [sellerData, setSellerData] = useState({});
  
  if (!vendeurActif) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto pt-16 text-center">
          <User className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-3">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Sélectionnez un vendeur pour voir son profil
          </p>
        </div>
      </div>
    );
  }

  const currentSeller = sellerData[vendeurActif] || {
    phone: "+212 600-000000",
    shift: "Matin (7h - 15h)",
    tardiness: 0,
    joinDate: new Date().toLocaleDateString('fr-FR'),
    email: `${vendeurActif.toLowerCase().replace(/\s+/g, '.')}@station.com`,
    experience: "2 ans"
  };

  const affectations = getNombreAffectations ? getNombreAffectations(vendeurActif) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Edge-to-edge cover */}
      <div className="h-56 bg-gradient-to-r from-blue-600 to-blue-800 w-full">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-end gap-6">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center">
              <User className="w-14 h-14 text-blue-600" />
            </div>
            <div className="text-white pb-2">
              <h1 className="text-3xl font-bold">{vendeurActif}</h1>
              <p className="text-blue-100">Vendeur • Station Service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-lg font-medium">{currentSeller.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">{currentSeller.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quart de travail</p>
                    <p className="text-lg font-medium">{currentSeller.shift}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="text-lg font-medium">{currentSeller.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Pompes affectées</p>
                  <div className="text-4xl font-bold text-blue-600">{affectations}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Retards</p>
                  <div className={`text-4xl font-bold ${
                    currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {currentSeller.tardiness}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Expérience</p>
                  <div className="text-4xl font-bold text-gray-700">{currentSeller.experience}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Disponibilité</p>
                  <div className="text-4xl font-bold text-green-600">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Status */}
          <div className="space-y-8">
            {/* Status */}
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-lg font-semibold mb-6">Statut actuel</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Disponible</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Performance</span>
                  <span className="text-blue-600 font-medium">
                    {affectations > 5 ? 'Élevée' : affectations > 2 ? 'Moyenne' : 'Débutant'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ponctualité</span>
                  <span className={`font-medium ${
                    currentSeller.tardiness === 0 
                      ? 'text-green-600' 
                      : currentSeller.tardiness < 3 
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {currentSeller.tardiness === 0 ? 'Parfaite' : 'À surveiller'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-lg font-semibold mb-6">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficacité</span>
                    <span>95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-11/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Précision</span>
                    <span>88%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-10/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Service client</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-9/12"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning if tardiness */}
            {currentSeller.tardiness > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Attention aux retards</p>
                    <p className="text-sm text-amber-600">
                      {currentSeller.tardiness} retard{currentSeller.tardiness > 1 ? 's' : ''} enregistré{currentSeller.tardiness > 1 ? 's' : ''} ce mois-ci.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;