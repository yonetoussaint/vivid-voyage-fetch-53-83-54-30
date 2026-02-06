import React from 'react';
import ShortCard from '../ShortCard';

const ShortsTab = ({ vendeurActif }) => {
  const shorts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=700&fit=crop',
      title: "Démo rapide de distribution d'essence",
      views: "1.2k vues"
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop',
      title: "Conseils pour service client rapide",
      views: "2.4k vues"
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=700&fit=crop',
      title: "Astuces de nettoyage de pompe",
      views: "856 vues"
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1563720223485-8d6d5c5d8b3c?w=400&h=700&fit=crop',
      title: "Journée type à la station",
      views: "1.7k vues"
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-black mb-4 px-2">Shorts de {vendeurActif}</h3>
      
      {/* Shorts Grid */}
      <div className="grid grid-cols-2 gap-2">
        {shorts.map((short) => (
          <ShortCard key={short.id} short={short} />
        ))}
      </div>
      
      {/* Empty state for no shorts */}
      <div className="mt-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-black mb-2">Créez votre premier Short</h3>
        <p className="text-gray-500 mb-4">Partagez des moments de votre journée en vidéo courte</p>
        <button className="bg-black text-white font-bold px-6 py-2 rounded-full text-[15px] hover:bg-gray-800 transition-colors">
          Créer un Short
        </button>
      </div>
    </div>
  );
};

export default ShortsTab;