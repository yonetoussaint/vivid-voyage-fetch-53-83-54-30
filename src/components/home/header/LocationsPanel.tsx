// components/home/header/LocationsPanel.tsx
import { useState, useEffect } from 'react';
import { Plus, X, Star, Trash2, Check } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

interface Location {
  id: string;
  name: string;
  department: string;
  population?: string;
  isDefault?: boolean;
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
    { id: '1', name: 'Port-au-Prince', department: 'Ouest', population: '987,310', isDefault: true },
    { id: '2', name: 'Cap-Haïtien', department: 'Nord', population: '274,404' },
    { id: '3', name: 'Gonaïves', department: 'Artibonite', population: '300,000' },
    { id: '4', name: 'Saint-Marc', department: 'Artibonite', population: '242,485' },
    { id: '5', name: 'Les Cayes', department: 'Sud', population: '137,952' },
    { id: '6', name: 'Jacmel', department: 'Sud-Est', population: '170,289' },
    { id: '7', name: 'Port-de-Paix', department: 'Nord-Ouest', population: '462,000' },
    { id: '8', name: 'Jérémie', department: 'Grand\'Anse', population: '122,149' },
    { id: '9', name: 'Miragoâne', department: 'Nippes', population: '85,269' },
    { id: '10', name: 'Hinche', department: 'Centre', population: '50,000' },
  ]);

  const [newCityInput, setNewCityInput] = useState('');
  const [newDeptInput, setNewDeptInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const MAX_FAVORITES = 12;

  useEffect(() => {
    const savedLocations = localStorage.getItem('favoriteLocations');
    if (savedLocations) {
      try {
        const parsedLocations = JSON.parse(savedLocations);
        if (Array.isArray(parsedLocations) && parsedLocations.length > 0) {
          setLocations(parsedLocations);
        }
      } catch (error) {
        console.error('Error loading saved locations:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteLocations', JSON.stringify(locations));
  }, [locations]);

  const handleAddCity = () => {
    if (newCityInput.trim() && newDeptInput.trim() && locations.length < MAX_FAVORITES) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: newCityInput.trim(),
        department: newDeptInput.trim(),
      };

      setLocations([...locations, newLocation]);
      setNewCityInput('');
      setNewDeptInput('');
      setIsAdding(false);
    }
  };

  const handleDeleteCity = (id: string) => {
    const locationToDelete = locations.find(loc => loc.id === id);

    if (locationToDelete?.isDefault) {
      return;
    }

    if (locationToDelete?.name === currentCity) {
      const defaultCity = locations.find(loc => loc.isDefault)?.name || locations[0]?.name;
      if (defaultCity) {
        onCitySelect(defaultCity);
      }
    }

    setLocations(locations.filter(loc => loc.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setLocations(locations.map(loc => ({
      ...loc,
      isDefault: loc.id === id
    })));

    const newDefaultCity = locations.find(loc => loc.id === id);
    if (newDefaultCity) {
      onCitySelect(newDefaultCity.name);
    }
  };

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  // Group locations by department for better organization
  const departments = Array.from(new Set(locations.map(loc => loc.department)));
  const locationsByDept: Record<string, Location[]> = {};
  
  departments.forEach(dept => {
    locationsByDept[dept] = locations.filter(loc => loc.department === dept);
  });

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Vil Ayisyen Favori"
      showCloseButton={true}
      maxHeight={0.95}
      dynamicHeight={true}
      showDragHandle={true}
      preventBodyScroll={true}
    >
      <div className="px-4 pb-6">
        <div className="mb-6 pt-2">
          <h2 className="text-lg font-semibold text-gray-900">Vil Ayisyen Favori</h2>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{locations.length} nan {MAX_FAVORITES}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Default
            </span>
          </div>
        </div>

        <div className="mb-6">
          {isAdding ? (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newCityInput}
                    onChange={(e) => setNewCityInput(e.target.value)}
                    placeholder="Non vil"
                    className="w-full px-4 py-2.5 pl-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    autoFocus
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newDeptInput}
                    onChange={(e) => setNewDeptInput(e.target.value)}
                    placeholder="Depatman"
                    className="w-full px-4 py-2.5 pl-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCity}
                  disabled={!newCityInput.trim() || !newDeptInput.trim() || locations.length >= MAX_FAVORITES}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="h-4 w-4 inline mr-2" />
                  Ajoute
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCityInput('');
                    setNewDeptInput('');
                  }}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              disabled={locations.length >= MAX_FAVORITES}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                {locations.length >= MAX_FAVORITES 
                  ? `Maksimòm ${MAX_FAVORITES} favori` 
                  : 'Ajoute yon vil'}
              </span>
            </button>
          )}
        </div>

        {locations.length > 0 ? (
          <div className="space-y-6 pb-6">
            {departments.map((dept) => (
              <div key={dept} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 px-1">{dept}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locationsByDept[dept].map((location) => (
                    <div
                      key={location.id}
                      className={`relative flex flex-col p-3 transition-all duration-200 cursor-pointer rounded-lg ${
                        location.name === currentCity
                          ? 'bg-blue-50'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleCityClick(location.name)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-semibold truncate ${
                              location.name === currentCity
                                ? 'text-blue-700'
                                : 'text-gray-900'
                            }`}>
                              {location.name}
                            </span>
                            {location.isDefault && (
                              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          {!location.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(location.id);
                              }}
                              className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Star className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!location.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCity(location.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-600">
                          {location.department}
                        </p>
                        {location.population && (
                          <p className="text-xs text-gray-500">
                            {location.population} moun
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Pa gen vil favori</h3>
            <p className="text-xs text-gray-500">Ajoute vil pou aksè rapid</p>
          </div>
        )}
      </div>
    </SlideUpPanel>
  );
}