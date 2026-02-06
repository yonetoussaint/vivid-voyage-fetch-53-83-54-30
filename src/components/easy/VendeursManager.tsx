// components/easy/VendeursManager.jsx
import React, { useState } from 'react';
import { User, Phone, Clock, Mail, Calendar } from 'lucide-react';

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
      {/* Twitter-style edge-to-edge cover with reduced height */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] h-48 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 h-full">
          {/* Facebook-style profile picture that overlaps the cover */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/4">
            <div className="w-40 h-40 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center shadow-lg">
              <User className="w-20 h-20 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        {/* Profile header info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{vendeurActif}</h1>
          <p className="text-gray-600 mt-1">Vendeur • Station Service</p>
          
          {/* Stats summary */}
          <div className="flex items-center gap-6 mt-4">
            <div>
              <span className="text-sm text-gray-500">Pompes affectées</span>
              <div className="text-2xl font-bold text-blue-600">{affectations}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Retards</span>
              <div className={`text-2xl font-bold ${
                currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {currentSeller.tardiness}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info only */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default VendeursManager;