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
        <div className="max-w-4xl mx-auto pt-16 text-center px-4">
          <User className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
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
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Mobile-optimized cover photo */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        {/* Profile picture - responsive sizing */}
        <div className="absolute -bottom-12 sm:-bottom-14 left-4 sm:left-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Profile content with mobile padding */}
      <div className="px-4 sm:px-6 mt-14 sm:mt-16 md:mt-20 max-w-4xl mx-auto">
        {/* Profile header - mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            {vendeurActif}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Vendeur • Station Service
          </p>
          
          {/* Stats - stacked on very small screens */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-5">
            <div className="min-w-[120px]">
              <span className="text-xs sm:text-sm text-gray-500 block">
                Pompes affectées
              </span>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                {affectations}
              </div>
            </div>
            <div className="min-w-[120px]">
              <span className="text-xs sm:text-sm text-gray-500 block">
                Retards
              </span>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${
                currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {currentSeller.tardiness}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info - mobile optimized */}
        <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            Informations de contact
          </h2>
          
          {/* Single column on mobile, two columns on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Phone - larger touch target */}
            <a 
              href={`tel:${currentSeller.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors -mx-3 sm:mx-0"
            >
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Téléphone</p>
                <p className="text-base sm:text-lg font-medium text-gray-900 truncate">
                  {currentSeller.phone}
                </p>
              </div>
            </a>

            {/* Email - larger touch target */}
            <a 
              href={`mailto:${currentSeller.email}`}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors -mx-3 sm:mx-0"
            >
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <p className="text-base sm:text-lg font-medium text-gray-900 truncate">
                  {currentSeller.email}
                </p>
              </div>
            </a>

            {/* Shift */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0 -mx-3 sm:mx-0">
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Quart de travail</p>
                <p className="text-base sm:text-lg font-medium text-gray-900">
                  {currentSeller.shift}
                </p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0 -mx-3 sm:mx-0">
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Membre depuis</p>
                <p className="text-base sm:text-lg font-medium text-gray-900">
                  {currentSeller.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;
