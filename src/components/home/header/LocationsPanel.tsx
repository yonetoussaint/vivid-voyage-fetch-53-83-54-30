// components/home/header/LocationsPanel.tsx
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  const handleDeleteCity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocations(locations.filter(loc => loc.id !== id));
    setHoveredId(null);
  };

  const handleNavigateToCommunes = () => {
    onClose(); // Close the panel first
    navigate('/communes');
  };

  const handleHelpClick = () => {
    // You can implement help functionality here
    console.log('Help clicked');
    // For example, show a help modal or navigate to help page
  };

  return (
  <SlideUpPanel
    isOpen={isOpen}
    onClose={onClose}
    title=""
    showCloseButton={true}
    showHelpButton={true}
    onHelpClick={handleHelpClick}
    maxHeight={0.95}
    dynamicHeight={true}
    preventBodyScroll={true}
    showDragHandle={false}
  >
    {/* Main wrapper with flex column layout */}
    <div className="px-3 pt-6 pb-3 min-h-full flex flex-col">
      {/* Content area that can grow */}
      <div className="columns-2 md:columns-3 gap-2 flex-1">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`group inline-block w-full mb-2 break-inside-avoid transition-colors duration-150 cursor-pointer relative ${
              location.name === currentCity
                ? 'bg-red-100'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleCityClick(location.name)}
            onMouseEnter={() => setHoveredId(location.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="p-2.5 pr-8">
              <span className={`text-sm ${
                location.name === currentCity
                  ? 'text-red-700 font-medium'
                  : 'text-gray-900'
              }`}>
                {location.name}
              </span>
            </div>

            {/* Delete button - shows on hover */}
            {hoveredId === location.id && (
              <button
                onClick={(e) => handleDeleteCity(location.id, e)}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Sticky button container */}
      <div className="sticky bottom-0 mt-6 pt-3 bg-white">
        <button
          onClick={handleNavigateToCommunes}
          className="w-full px-3 py-3 border-2 border-dashed border-gray-400 text-gray-700 text-sm hover:border-red-400 hover:text-red-700 transition-colors bg-white flex items-center justify-center gap-2"
        >
          + Ajoute yon vil
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </SlideUpPanel>
);
}