import React, { useState } from 'react';
import { User, MapPin, Calendar, Link as LinkIcon, MoreHorizontal, ArrowLeft } from 'lucide-react';

const VendeursManager = ({ 
  vendeurs, 
  vendeurActif,
  getNombreAffectations 
}) => {
  const [activeTab, setActiveTab] = useState('retards');
  const [sellerData, setSellerData] = useState({});

  if (!vendeurActif) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-gray-500">
            Sélectionnez un vendeur pour voir son profil
          </p>
        </div>
      </div>
    );
  }

  // Generate consistent hash from string for image selection
  const getHashFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Get unique images for each seller
  const sellerHash = getHashFromString(vendeurActif);
  
  const bannerImages = [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1500&h=500&fit=crop'
  ];
  
  const profileImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop'
  ];
  
  const bannerImage = bannerImages[sellerHash % bannerImages.length];
  const profileImage = profileImages[sellerHash % profileImages.length];

  const currentSeller = sellerData[vendeurActif] || {
    phone: "+212 600-000000",
    shift: "Matin (7h - 15h)",
    tardiness: 0,
    joinDate: (() => {
      const date = new Date();
      const day = date.getDate();
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const month = months[date.getMonth()];
      const year = String(date.getFullYear()).slice(-2);
      return `${day} ${month}. ${year}`;
    })(),
    email: `${vendeurActif.toLowerCase().replace(/\s+/g, '.')}@station.com`,
    location: "Casablanca, Maroc"
  };

  const affectations = getNombreAffectations ? getNombreAffectations(vendeurActif) : 0;
  const followers = Math.floor(Math.random() * 500) + 100;
  const following = Math.floor(Math.random() * 300) + 50;

  const tabs = [
    { id: 'retards', label: 'Retards' },
    { id: 'ventes', label: 'Ventes' },
    { id: 'meters', label: 'Meters' }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Main Content */}
      <div className="max-w-[600px] mx-auto">
        {/* Cover Photo */}
        <div className="h-[120px] relative bg-gray-200">
          <img 
            src={bannerImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Action Buttons - Now placed below the banner */}
        <div className="px-4 flex justify-end gap-2 pt-3">
          <button className="hover:bg-gray-100 rounded-full p-2 border border-gray-300 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button className="bg-black text-white font-bold px-4 py-[7px] rounded-full text-[15px] hover:bg-gray-800 transition-colors">
            Suivre
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-4 border-b border-gray-200">
          {/* Avatar */}
          <div className="flex justify-between items-start -mt-[56px] mb-3 relative z-10">
            <div>
              <div className="w-[112px] h-[112px] rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                <img 
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Name & Username */}
          <div className="mb-3">
            <h1 className="font-bold text-[20px] leading-6 flex items-center gap-1">
              {vendeurActif}
              <svg viewBox="0 0 22 22" className="w-[20px] h-[20px]" fill="#1d9bf0">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
              </svg>
            </h1>
          </div>

          {/* Bio */}
          <div className="mb-3 text-[15px] leading-5">
            <p>Vendeur à la station service • {currentSeller.shift}</p>
            <p className="mt-2">
              <span className="font-semibold">Easy Plus Gaz</span>
              <span className="text-gray-500"> • Groupe </span>
              <span className="font-semibold">Imperial Center</span>
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[15px] text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-[18px] h-[18px]" />
              <span>{currentSeller.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-[18px] h-[18px]" />
              <span>Depuis {currentSeller.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 relative hover:bg-gray-50 transition-colors"
            >
              <div className="py-4 text-[15px] font-medium">
                <span className={activeTab === tab.id ? 'text-black' : 'text-gray-500'}>
                  {tab.label}
                </span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Posts/Content Area */}
        <div className="divide-y divide-gray-200">
          {/* Post Card - Affectations Info */}
          <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-[15px] hover:underline">{vendeurActif}</span>
                  <svg viewBox="0 0 22 22" className="w-[18px] h-[18px]" fill="#1d9bf0">
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
                  </svg>
                  <span className="text-gray-500 text-[15px]">@{vendeurActif.toLowerCase().replace(/\s+/g, '_')}</span>
                  <span className="text-gray-500 text-[15px]">· 2h</span>
                </div>
                <div className="text-[15px] leading-5">
                  <p className="mb-2">📊 Rapport de performance</p>
                  <p className="mb-3">Pompes affectées : <span className="font-bold text-blue-500">{affectations}</span></p>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Quart de travail</p>
                        <p className="font-semibold text-black">{currentSeller.shift}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Retards</p>
                        <p className={`font-semibold ${currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {currentSeller.tardiness}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 mb-1">Contact</p>
                        <p className="text-blue-500 text-xs">{currentSeller.phone}</p>
                        <p className="text-blue-500 text-xs">{currentSeller.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-3 max-w-md text-gray-500">
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-50">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 1l4 4-4 4"/>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                        <path d="M7 23l-4-4 4-4"/>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-pink-50">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <div className="py-16 text-center">
            <p className="text-gray-500 text-[15px]">Fin des posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeursManager;