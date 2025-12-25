// components/header/LocationsPanel.tsx
import { useState, useEffect } from 'react';
import { MapPin, GripVertical, Plus, X, Star, Trash2, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import SlideUpPanel from '../shared/SlideUpPanel';

interface Location {
  id: string;
  name: string;
  country?: string;
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
    { id: '1', name: 'New York', country: 'USA', isDefault: true },
    { id: '2', name: 'Los Angeles', country: 'USA' },
    { id: '3', name: 'Chicago', country: 'USA' },
    { id: '4', name: 'Miami', country: 'USA' },
    { id: '5', name: 'Houston', country: 'USA' },
  ]);

  const [newCityInput, setNewCityInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const MAX_FAVORITES = 10;

  // Load saved locations from localStorage on mount
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

  // Save locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteLocations', JSON.stringify(locations));
  }, [locations]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLocations(items);
  };

  const handleAddCity = () => {
    if (newCityInput.trim() && locations.length < MAX_FAVORITES) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: newCityInput.trim(),
        country: 'USA'
      };
      
      setLocations([...locations, newLocation]);
      setNewCityInput('');
      setIsAdding(false);
    }
  };

  const handleDeleteCity = (id: string) => {
    const locationToDelete = locations.find(loc => loc.id === id);
    
    // Don't allow deleting default location
    if (locationToDelete?.isDefault) {
      return;
    }
    
    // If we're deleting the currently selected city, switch to default
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
    
    // Update current city to the new default
    const newDefaultCity = locations.find(loc => loc.id === id);
    if (newDefaultCity) {
      onCitySelect(newDefaultCity.name);
    }
  };

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Favorite Locations"
      showCloseButton={true}
      maxHeight={0.8}
      dynamicHeight={false}
      showDragHandle={true}
      preventBodyScroll={true}
    >
      <div className="px-4 pb-4">
        {/* Header */}
        <div className="mb-6 pt-2">
          <h2 className="text-lg font-semibold text-gray-900">Favorite Locations</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag to rearrange, tap to select. Maximum {MAX_FAVORITES} cities.
          </p>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{locations.length} of {MAX_FAVORITES} spots used</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Default location
            </span>
          </div>
        </div>

        {/* Add new city form */}
        <div className="mb-6">
          {isAdding ? (
            <div className="flex items-center gap-2 no-drag">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={handleAddCity}
                disabled={!newCityInput.trim() || locations.length >= MAX_FAVORITES}
                className="px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              disabled={locations.length >= MAX_FAVORITES}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group no-drag"
            >
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                {locations.length >= MAX_FAVORITES 
                  ? `Maximum ${MAX_FAVORITES} favorites reached` 
                  : 'Add a new city'}
              </span>
            </button>
          )}
        </div>

        {/* Locations list */}
        {locations.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {locations.map((location, index) => (
                    <Draggable
                      key={location.id}
                      draggableId={location.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative flex items-center gap-3 p-3 bg-white border rounded-lg transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'shadow-lg border-blue-300 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${
                            location.name === currentCity
                              ? 'ring-2 ring-blue-500 ring-opacity-50'
                              : ''
                          }`}
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>

                          {/* Location icon */}
                          <MapPin className={`h-5 w-5 flex-shrink-0 ${
                            location.name === currentCity 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} />

                          {/* Location details */}
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleCityClick(location.name)}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium truncate ${
                                location.name === currentCity
                                  ? 'text-blue-700'
                                  : 'text-gray-900'
                              }`}>
                                {location.name}
                              </span>
                              {location.isDefault && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              )}
                            </div>
                            {location.country && (
                              <p className="text-xs text-gray-500 truncate">
                                {location.country}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0 no-drag">
                            {!location.isDefault && (
                              <button
                                onClick={() => handleSetDefault(location.id)}
                                className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-md transition-colors"
                                title="Set as default"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                            )}
                            {!location.isDefault && (
                              <button
                                onClick={() => handleDeleteCity(location.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove from favorites"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No favorite locations</h3>
            <p className="text-xs text-gray-500">Add cities to get quick access</p>
          </div>
        )}

        {/* Help text */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
            <p>Tap a city to select it immediately. The blue outline shows your current selection.</p>
          </div>
        </div>
      </div>
    </SlideUpPanel>
  );
}