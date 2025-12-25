// components/home/header/LocationsPanel.tsx
import { useState } from 'react';
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
  const [locations] = useState<Location[]>([
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

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
    onClose();
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
      <div className="px-3 pb-6">
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
              className={`inline-block w-full mb-2 break-inside-avoid transition-colors duration-150 cursor-pointer ${
                location.name === currentCity
                  ? 'bg-blue-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleCityClick(location.name)}
            >
              <div className="p-2.5">
                <span className={`text-sm ${
                  location.name === currentCity
                    ? 'text-white font-medium'
                    : 'text-gray-900'
                }`}>
                  {location.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideUpPanel>
  );
}