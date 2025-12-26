// components/home/header/LocationsPanel.tsx
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

interface Location {
  id: string;
  name: string;
}

interface LocationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity?: string;
  onCitySelect: (cityName: string) => void;
}

export default function LocationsPanel({
  isOpen,
  onClose,
  currentCity,
  onCitySelect
}: LocationsPanelProps) {
  const [locations, setLocations] = useState<Location[]>([
    { id: '1', name: 'Port-au-Prince' },
    { id: '2', name: 'Cap-Haïtien' },
    { id: '3', name: 'Gonaïves' },
    { id: '4', name: 'Saint-Marc' },
    { id: '5', name: 'Les Cayes' },
    { id: '6', name: 'Jacmel' },
    { id: '7', name: 'Port-de-Paix' },
    { id: '8', name: 'Jérémie' },
    { id: '9', name: 'Miragoâne' },
    { id: '10', name: 'Hinche' },
    { id: '11', name: 'Petion-Ville' },
    { id: '12', name: 'Delmas' },
    { id: '13', name: 'Carrefour' },
    { id: '14', name: 'Tabarre' },
    { id: '15', name: 'Croix-des-Bouquets' },
  ]);

  const [newCityInput, setNewCityInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  const handleAddCity = () => {
    if (newCityInput.trim()) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: newCityInput.trim(),
      };

      setLocations([...locations, newLocation]);
      setNewCityInput('');
      setIsAdding(false);
    }
  };

  const handleDeleteCity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocations(locations.filter(loc => loc.id !== id));
    setHoveredId(null);
  };

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Vil Ayisyen"
      showCloseButton={true}
      maxHeight={0.95}
      dynamicHeight={true}
      showDragHandle={true}
      preventBodyScroll={true}
    >
      <div className="px-3 pb-20">
        <div className="mb-5 pt-1">
          <h2 className="text-base font-semibold text-gray-900">Chwazi yon vil</h2>
          <div className="mt-1 text-xs text-gray-500">
            Klike sou yon vil pou chwazi li
          </div>
        </div>

        <div className="columns-2 md:columns-3 gap-2 pb-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`group inline-block w-full mb-2 break-inside-avoid transition-colors duration-150 cursor-pointer relative ${
                location.name === currentCity
                  ? 'bg-blue-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleCityClick(location.name)}
              onMouseEnter={() => setHoveredId(location.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="p-2.5 pr-8">
                <span className={`text-sm ${
                  location.name === currentCity
                    ? 'text-white font-medium'
                    : 'text-gray-900'
                }`}>
                  {location.name}
                </span>
              </div>
              
              {/* Delete button - shows on hover */}
              {hoveredId === location.id && (
                <button
                  onClick={(e) => handleDeleteCity(location.id, e)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-red-500 hover:bg-gray-300 rounded transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sticky Add Button */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          {isAdding ? (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  placeholder="Antre non vil la"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                />
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCityInput('');
                  }}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAddCity}
                disabled={!newCityInput.trim()}
                className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Ajoute Vil
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-500" />
              Ajoute yon vil
            </button>
          )}
        </div>
      </div>
    </SlideUpPanel>
  );
}