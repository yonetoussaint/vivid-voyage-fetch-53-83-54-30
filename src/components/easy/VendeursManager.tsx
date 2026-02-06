import React, { useState } from 'react';
import { User, MapPin, Calendar, Link as LinkIcon, MoreHorizontal, ArrowLeft } from 'lucide-react';

const VendeursManager = ({ 
  vendeurs, 
  vendeurActif,
  getNombreAffectations 
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [sellerData, setSellerData] = useState({});

  if (!vendeurActif) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <User className="w-20 h-20 mx-auto text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-gray-500">
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
    joinDate: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    email: `${vendeurActif.toLowerCase().replace(/\s+/g, '.')}@station.com`,
    location: "Casablanca, Maroc"
  };

  const affectations = getNombreAffectations ? getNombreAffectations(vendeurActif) : 0;
  const followers = Math.floor(Math.random() * 500) + 100;
  const following = Math.floor(Math.random() * 300) + 50;

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Réponses' },
    { id: 'highlights', label: 'En avant' },
    { id: 'media', label: 'Médias' },
    { id: 'likes', label: 'J\'aime' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/65 border-b border-gray-800">
        <div className="max-w-[600px] mx-auto px-4 h-[53px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="hover:bg-white/10 rounded-full p-2 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-[20px] leading-6">{vendeurActif}</h2>
              <p className="text-[13px] text-gray-500">{affectations} pompes</p>
            </div>
          </div>
          <button className="hover:bg-white/10 rounded-full p-2 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[600px] mx-auto">
        {/* Cover Photo */}
        <div className="h-[200px] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 relative">
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-4 border-b border-gray-800">
          {/* Avatar & Action Buttons */}
          <div className="flex justify-between items-start mb-3">
            <div className="-mt-[67px]">
              <div className="w-[133px] h-[133px] rounded-full border-4 border-black bg-gray-900 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="hover:bg-white/10 rounded-full p-2 border border-gray-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button className="bg-white text-black font-bold px-4 py-[7px] rounded-full text-[15px] hover:bg-gray-200 transition-colors">
                Suivre
              </button>
            </div>
          </div>

          {/* Name & Username */}
          <div className="mb-3">
            <h1 className="font-bold text-[20px] leading-6 flex items-center gap-1">
              {vendeurActif}
            </h1>
            <p className="text-gray-500 text-[15px]">@{vendeurActif.toLowerCase().replace(/\s+/g, '_')}</p>
          </div>

          {/* Bio */}
          <div className="mb-3 text-[15px] leading-5">
            <p>Vendeur à la station service • {currentSeller.shift}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[15px] text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-[18px] h-[18px]" />
              <span>{currentSeller.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-[18px] h-[18px]" />
              <span>A rejoint en {currentSeller.joinDate}</span>
            </div>
          </div>

          {/* Following/Followers */}
          <div className="flex gap-5 text-[14px]">
            <button className="hover:underline">
              <span className="font-bold text-white">{following}</span>
              <span className="text-gray-500 ml-1">abonnement</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-white">{followers}</span>
              <span className="text-gray-500 ml-1">abonnés</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 relative hover:bg-white/[0.03] transition-colors"
            >
              <div className="py-4 text-[15px] font-medium">
                <span className={activeTab === tab.id ? 'text-white' : 'text-gray-500'}>
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
        <div className="divide-y divide-gray-800">
          {/* Post Card - Affectations Info */}
          <div className="p-4 hover:bg-white/[0.03] transition-colors cursor-pointer">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-[15px] hover:underline">{vendeurActif}</span>
                  <span className="text-gray-500 text-[15px]">@{vendeurActif.toLowerCase().replace(/\s+/g, '_')}</span>
                  <span className="text-gray-500 text-[15px]">· 2h</span>
                </div>
                <div className="text-[15px] leading-5">
                  <p className="mb-2">📊 Rapport de performance</p>
                  <p className="mb-3">Pompes affectées : <span className="font-bold text-blue-400">{affectations}</span></p>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Quart de travail</p>
                        <p className="font-semibold">{currentSeller.shift}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Retards</p>
                        <p className={`font-semibold ${currentSeller.tardiness > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {currentSeller.tardiness}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 mb-1">Contact</p>
                        <p className="text-blue-400 text-xs">{currentSeller.phone}</p>
                        <p className="text-blue-400 text-xs">{currentSeller.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-3 max-w-md text-gray-500">
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 1l4 4-4 4"/>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                        <path d="M7 23l-4-4 4-4"/>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10">
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
