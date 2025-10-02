import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Globe, Check, X, Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import { countries, Country } from '@/data/locations';
import { 
  departments, 
  communes, 
  sections, 
  quartiers,
  getCommunesByDepartment,
  getSectionsByCommune,
  getQuartiersBySection,
  Department,
  Commune,
  Section,
  Quartier
} from '@/data/haitiLocations';
import ProductFilterBar from '@/components/home/ProductFilterBar'; // Import the filter bar

interface LocationScreenProps {
  onClose: () => void;
  showHeader?: boolean;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onClose, showHeader = true }) => {
  const { setLocation, currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation('location');
  const { setLocationListScreenOpen } = useScreenOverlay();
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationTip, setShowLocationTip] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout>();

  // Check if tip has been seen before
  useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenLocationTip');

    if (!hasSeenTip) {
      setShowLocationTip(true);
      localStorage.setItem('hasSeenLocationTip', 'true');
    }
  }, []);

  // Close tip when clicking outside or after timeout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(event.target as Node)) {
        dismissTip();
      }
    };

    if (showLocationTip) {
      dismissTimerRef.current = setTimeout(() => {
        dismissTip();
      }, 3000);

      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationTip]);

  const dismissTip = () => {
    setShowLocationTip(false);
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }
  };

  // Pre-select Haiti as the only country
  const haitiCountry = countries.find(country => country.code === 'HT') || countries[4];
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(haitiCountry);
  const [selectedState, setSelectedState] = useState<Department | null>(null);
  const [selectedCity, setSelectedCity] = useState<Commune | null>(null);
  const [selectedQuartier, setSelectedQuartier] = useState<Quartier | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Filter categories for the ProductFilterBar
  const filterCategories = [
    {
      id: 'department',
      label: t('department'),
      options: departments.map(dept => dept.name)
    },
    {
      id: 'commune',
      label: t('commune'),
      options: selectedState ? getCommunesByDepartment(selectedState.code).map(commune => commune.name) : []
    }
  ];

  const [selectedFilters, setSelectedFilters] = useState({});

  // Helper function to get all quartiers for a commune
  const getQuartiersByCommune = (communeCode: string): Quartier[] => {
    const communeSections = getSectionsByCommune(communeCode);
    const allQuartiers: Quartier[] = [];

    communeSections.forEach(section => {
      const sectionQuartiers = getQuartiersBySection(section.code);
      allQuartiers.push(...sectionQuartiers);
    });

    return allQuartiers;
  };

  // Handle filter selection from ProductFilterBar
  const handleFilterSelect = (filterId: string, option: string) => {
    if (filterId === 'department') {
      const selectedDept = departments.find(dept => dept.name === option);
      if (selectedDept) {
        setSelectedState(selectedDept);
        setSelectedCity(null);
        setSelectedQuartier(null);
        setSelectedFilters(prev => ({
          ...prev,
          department: option,
          commune: '' // Reset commune when department changes
        }));
      }
    } else if (filterId === 'commune' && selectedState) {
      const communesList = getCommunesByDepartment(selectedState.code);
      const selectedCommune = communesList.find(commune => commune.name === option);
      if (selectedCommune) {
        setSelectedCity(selectedCommune);
        setSelectedQuartier(null);
        setSelectedFilters(prev => ({
          ...prev,
          commune: option
        }));
      }
    }
  };

  // Handle filter clearing from ProductFilterBar
  const handleFilterClear = (filterId: string) => {
    if (filterId === 'department') {
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedQuartier(null);
      const newFilters = { ...selectedFilters };
      delete newFilters.department;
      delete newFilters.commune;
      setSelectedFilters(newFilters);
    } else if (filterId === 'commune') {
      setSelectedCity(null);
      setSelectedQuartier(null);
      const newFilters = { ...selectedFilters };
      delete newFilters.commune;
      setSelectedFilters(newFilters);
    }
  };

  // Handle clear all filters from ProductFilterBar
  const handleClearAllFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedQuartier(null);
    setSelectedFilters({});
  };

  // Custom handler for when filter buttons are clicked (to open location list screens)
  const handleFilterButtonClick = (filterId: string) => {
    if (filterId === 'department') {
      setLocationListScreenOpen(true, {
        title: t('chooseDepartmentTitle'),
        items: departments,
        onSelect: (dept: Department) => handleFilterSelect('department', dept.name),
        searchPlaceholder: t('searchDepartments')
      });
    } else if (filterId === 'commune' && selectedState) {
      setLocationListScreenOpen(true, {
        title: t('chooseCommuneTitle'),
        items: getCommunesByDepartment(selectedState.code),
        onSelect: (commune: Commune) => handleFilterSelect('commune', commune.name),
        searchPlaceholder: t('searchCommunes')
      });
    }
  };

  const handleQuartierSelect = (quartier: Quartier) => {
    setSelectedQuartier(quartier);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(t('geoLocationNotSupported'));
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(t('geoLocationFailed'));
          }

          const data = await response.json();
          const detectedCountry = countries.find(
            country => 
              country.name.toLowerCase() === data.countryName?.toLowerCase() ||
              country.code.toLowerCase() === data.countryCode?.toLowerCase()
          );

          if (detectedCountry) {
            const location = {
              code: data.countryCode || detectedCountry.code,
              name: data.city || data.locality || detectedCountry.name,
              flag: detectedCountry.flag
            };
            setLocation(location);
            onClose();
          } else {
            setGeoError(t('geoLocationFailed'));
          }
        } catch (error) {
          setGeoError(t('geoLocationFailed'));
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(t('geoLocationFailed'));
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(t('geoLocationFailed'));
            break;
          case error.TIMEOUT:
            setGeoError(t('geoLocationFailed'));
            break;
          default:
            setGeoError(t('geoLocationFailed'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 600000
      }
    );
  };

  const handleApplyLocation = () => {
    if (selectedQuartier && selectedCity && selectedState) {
      const location = {
        code: `${selectedCity.code}-${selectedQuartier.code}`,
        name: `${selectedQuartier.name}, ${selectedCity.name}, ${selectedState.name}`,
        flag: selectedCountry?.flag || 'ht'
      };
      setLocation(location);
      onClose();
    }
  };

  const filteredQuartiers = useMemo(() => {
    if (!selectedCity) return [];
    const communeQuartiers = getQuartiersByCommune(selectedCity.code);
    if (!locationQuery) return communeQuartiers;
    return communeQuartiers.filter(quartier =>
      quartier.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [selectedCity, locationQuery]);

  return (
    <div className={showHeader ? "fixed inset-0 bg-white z-50 flex flex-col h-screen" : "flex flex-col h-full"}>
      {showHeader && (
        <div className="bg-white p-3 border-b border-gray-200">
          <div className="relative flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchLocation')}
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <button 
              onClick={handleUseMyLocation}
              disabled={isGeolocating}
              className="text-gray-600 hover:text-gray-900 disabled:text-gray-400 transition-colors"
              id="location-icon"
            >
              {isGeolocating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
            </button>

            {showLocationTip && (
              <div 
                ref={tipRef}
                className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 animate-fade-in"
                style={{ transform: 'translateX(10px)' }}
              >
                <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('quickTip')}</p>
                    <p className="text-xs text-gray-600">{t('gpsTip')}</p>
                  </div>
                  <button 
                    onClick={dismissTip}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Use ProductFilterBar directly with custom handlers */}
      <ProductFilterBar 
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAllFilters}
        onFilterButtonClick={handleFilterButtonClick}
        isFilterDisabled={(filterId) => filterId === 'commune' && !selectedState}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Current Location Display */}
        <div className="mt-6 mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{t('currentLocation', { defaultValue: 'Current Location' })}</p>
              <p className="text-sm text-gray-600">{currentLocation.name}</p>
            </div>
          </div>
        </div>

        {geoError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{geoError}</p>
          </div>
        )}

        {/* Quartiers List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedCity 
              ? `${t('quartiersIn')} ${selectedCity.name}`
              : selectedState
              ? `${t('selectCommuneFirst')}`
              : `${t('selectDepartmentFirst')}`
            }
          </h3>

          {!selectedState && (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('selectDepartmentToStart')}</p>
            </div>
          )}

          {selectedState && !selectedCity && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('selectCommuneToViewQuartiers')}</p>
            </div>
          )}

          {selectedCity && (
            <div className="grid gap-2">
              {filteredQuartiers.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t('noQuartiersFound')}</p>
                </div>
              ) : (
                filteredQuartiers.map((quartier) => (
                  <button
                    key={quartier.code}
                    onClick={() => handleQuartierSelect(quartier)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedQuartier?.code === quartier.code
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{quartier.name}</span>
                      {selectedQuartier?.code === quartier.code && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Apply Button */}
      <div className="bg-white p-4 sticky bottom-0 border-t border-gray-200">
        <button
          onClick={handleApplyLocation}
          disabled={!selectedQuartier}
          className="w-full py-3 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg transition-colors"
        >
          {t('applyLocation')}
        </button>
      </div>
    </div>
  );
};

export default LocationScreen;