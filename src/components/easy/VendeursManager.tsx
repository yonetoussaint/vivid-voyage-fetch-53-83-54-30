// components/easy/VendeursManager.jsx
import React, { useState } from 'react';
import { User, Phone, Clock, AlertCircle, Edit2 } from 'lucide-react';

const VendeursManager = ({ 
  vendeurs, 
  vendeurActif,
  getNombreAffectations 
}) => {
  const [sellerData, setSellerData] = useState({});
  const [editing, setEditing] = useState(false);
  
  // If no active vendor, show placeholder
  if (!vendeurActif) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-8 text-center">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-gray-500">
            Sélectionnez un vendeur pour voir son profil
          </p>
        </div>
      </div>
    );
  }

  // Initialize seller data if not exists
  const currentSeller = sellerData[vendeurActif] || {
    phone: "+212 600-000000",
    shift: "AM",
    tardiness: 0,
    joinDate: new Date().toLocaleDateString('fr-FR'),
    email: `${vendeurActif.toLowerCase().replace(/\s+/g, '.')}@station.com`
  };

  const updateSellerData = (field, value) => {
    setSellerData(prev => ({
      ...prev,
      [vendeurActif]: {
        ...currentSeller,
        [field]: value
      }
    }));
  };

  const affectations = getNombreAffectations ? getNombreAffectations(vendeurActif) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden mb-6">
        {/* Profile Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vendeurActif}</h1>
              <p className="text-gray-600">Vendeur • Station Service</p>
              <p className="text-sm text-gray-500 mt-2">
                Membre depuis {currentSeller.joinDate}
              </p>
            </div>
            
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Edit2 className="w-4 h-4" />
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold mb-4 pb-3 border-b">
              Informations Personnelles
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    {editing ? (
                      <input
                        type="text"
                        value={currentSeller.phone}
                        onChange={(e) => updateSellerData('phone', e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="font-medium">{currentSeller.phone}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <span className="text-lg">@</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {editing ? (
                      <input
                        type="email"
                        value={currentSeller.email}
                        onChange={(e) => updateSellerData('email', e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="font-medium">{currentSeller.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shift Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Quart de travail</p>
                  {editing ? (
                    <select
                      value={currentSeller.shift}
                      onChange={(e) => updateSellerData('shift', e.target.value)}
                      className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AM">Matin (AM)</option>
                      <option value="PM">Après-midi (PM)</option>
                      <option value="NIGHT">Nuit</option>
                      <option value="FULL">Temps plein</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentSeller.shift}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Actif
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold mb-4 pb-3 border-b">
              Performance
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {affectations}
                </div>
                <p className="text-sm text-gray-500 mt-1">Pompes affectées</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-3xl font-bold ${
                  currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {currentSeller.tardiness}
                </div>
                <p className="text-sm text-gray-500 mt-1">Retards</p>
              </div>
            </div>

            {/* Tardiness Warning */}
            {currentSeller.tardiness > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Attention aux retards
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Ce vendeur a {currentSeller.tardiness} retard{currentSeller.tardiness > 1 ? 's' : ''} enregistré{currentSeller.tardiness > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-semibold mb-4">Statut</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disponibilité</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Actif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {affectations > 5 ? 'Élevée' : affectations > 2 ? 'Moyenne' : 'Faible'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ponctualité</span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  currentSeller.tardiness === 0 
                    ? 'bg-green-100 text-green-800' 
                    : currentSeller.tardiness < 3 
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentSeller.tardiness === 0 ? 'Excellente' : 'À améliorer'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-semibold mb-4">Activité récente</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connecté aujourd'hui</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{affectations} pompes assignées</span>
              </div>
              {currentSeller.tardiness > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Dernier retard: Il y a 2 jours</span>
                </div>
              )}
            </div>
          </div>

          {/* Save Button when editing */}
          {editing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                Les modifications seront enregistrées automatiquement
              </p>
              <button
                onClick={() => setEditing(false)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;