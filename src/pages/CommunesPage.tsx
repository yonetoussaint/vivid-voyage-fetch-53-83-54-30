import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const haitiData = {
  "Artibonite": ["Gonaïves", "Saint-Marc", "Dessalines", "Gros-Morne", "Ennery", "Saint-Michel-de-l'Attalaye"],
  "Centre": ["Hinche", "Mirebalais", "Lascahobas", "Thomassique", "Maïssade", "Cerca-la-Source"],
  "Grand'Anse": ["Jérémie", "Les Irois", "Anse-d'Hainault", "Dame-Marie", "Corail", "Pestel"],
  "Nippes": ["Miragoâne", "Petit-Goâve", "Anse-à-Veau", "Baradères", "Petit-Trou-de-Nippes", "Plaisance-du-Sud"],
  "Nord": ["Cap-Haïtien", "Okap", "Limonade", "Acul-du-Nord", "Plaisance", "Grande-Rivière-du-Nord"],
  "Nord-Est": ["Fort-Liberté", "Ouanaminthe", "Trou-du-Nord", "Terrier-Rouge", "Vallières", "Carice"],
  "Nord-Ouest": ["Port-de-Paix", "Saint-Louis-du-Nord", "Môle-Saint-Nicolas", "Bombardopolis", "Jean-Rabel", "Anse-à-Foleur"],
  "Ouest": ["Port-au-Prince", "Pétionville", "Delmas", "Carrefour", "Croix-des-Bouquets", "Gressier", "Léogâne"],
  "Sud": ["Les Cayes", "Aquin", "Saint-Louis-du-Sud", "Chardonnières", "Port-Salut", "Torbeck"],
  "Sud-Est": ["Jacmel", "Marigot", "Cayes-Jacmel", "Bainet", "Belle-Anse", "Côtes-de-Fer"]
};

export default function HaitiCitySelector() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = Object.keys(haitiData).filter(dept =>
    dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    haitiData[dept].some(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* Compact Header */}
      <div className="bg-blue-600 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search departments or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Compact List */}
      <div className="max-w-2xl mx-auto">
        {Object.keys(haitiData).map((department, idx) => (
          <div key={department} className="border-b border-gray-100">
            
            {/* Department Row */}
            <button
              onClick={() => setSelectedDepartment(selectedDepartment === department ? null : department)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="font-medium text-gray-900">{department}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{haitiData[department].length}</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                  selectedDepartment === department ? 'rotate-90' : ''
                }`} />
              </div>
            </button>

            {/* Cities */}
            {selectedDepartment === department && (
              <div className="bg-gray-50 px-4 py-2">
                {haitiData[department].map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="city"
                      checked={selectedCity === city}
                      onChange={() => setSelectedCity(city)}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <span className={`text-sm ${
                      selectedCity === city ? 'font-medium text-gray-900' : 'text-gray-700'
                    }`}>
                      {city}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}