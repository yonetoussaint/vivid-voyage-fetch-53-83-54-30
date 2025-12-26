// pages/CommunesPage.tsx
import { useState } from 'react';
import { Search, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Commune {
  id: string;
  name: string;
  department: string;
}

export default function CommunesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Sample data - Haitian communes organized by department
  const allCommunes: Commune[] = [
    // Ouest Department
    { id: '1', name: 'Port-au-Prince', department: 'Ouest' },
    { id: '2', name: 'Petion-Ville', department: 'Ouest' },
    { id: '3', name: 'Delmas', department: 'Ouest' },
    { id: '4', name: 'Carrefour', department: 'Ouest' },
    { id: '5', name: 'Tabarre', department: 'Ouest' },
    { id: '6', name: 'Croix-des-Bouquets', department: 'Ouest' },
    { id: '7', name: 'Gressier', department: 'Ouest' },
    { id: '8', name: 'Léogâne', department: 'Ouest' },
    { id: '9', name: 'Grand-Goâve', department: 'Ouest' },
    { id: '10', name: 'Petit-Goâve', department: 'Ouest' },
    
    // Nord Department
    { id: '11', name: 'Cap-Haïtien', department: 'Nord' },
    { id: '12', name: 'Limonade', department: 'Nord' },
    { id: '13', name: 'Quartier-Morin', department: 'Nord' },
    { id: '14', name: 'Milot', department: 'Nord' },
    { id: '15', name: 'Plaisance', department: 'Nord' },
    { id: '16', name: 'Acul-du-Nord', department: 'Nord' },
    
    // Artibonite Department
    { id: '17', name: 'Gonaïves', department: 'Artibonite' },
    { id: '18', name: 'Saint-Marc', department: 'Artibonite' },
    { id: '19', name: 'Verrettes', department: 'Artibonite' },
    { id: '20', name: 'Dessalines', department: 'Artibonite' },
    { id: '21', name: 'Petite Rivière de l\'Artibonite', department: 'Artibonite' },
    
    // Sud Department
    { id: '22', name: 'Les Cayes', department: 'Sud' },
    { id: '23', name: 'Port-Salut', department: 'Sud' },
    { id: '24', name: 'Aquin', department: 'Sud' },
    { id: '25', name: 'Cavaillon', department: 'Sud' },
    { id: '26', name: 'Saint-Louis-du-Sud', department: 'Sud' },
    
    // Sud-Est Department
    { id: '27', name: 'Jacmel', department: 'Sud-Est' },
    { id: '28', name: 'Marigot', department: 'Sud-Est' },
    { id: '29', name: 'Cayes-Jacmel', department: 'Sud-Est' },
    { id: '30', name: 'Bainet', department: 'Sud-Est' },
    
    // Nord-Ouest Department
    { id: '31', name: 'Port-de-Paix', department: 'Nord-Ouest' },
    { id: '32', name: 'Saint-Louis-du-Nord', department: 'Nord-Ouest' },
    { id: '33', name: 'Môle Saint-Nicolas', department: 'Nord-Ouest' },
    { id: '34', name: 'Jean-Rabel', department: 'Nord-Ouest' },
    
    // Grand'Anse Department
    { id: '35', name: 'Jérémie', department: 'Grand\'Anse' },
    { id: '36', name: 'Anse-d\'Hainault', department: 'Grand\'Anse' },
    { id: '37', name: 'Dame-Marie', department: 'Grand\'Anse' },
    { id: '38', name: 'Les Irois', department: 'Grand\'Anse' },
    
    // Nippes Department
    { id: '39', name: 'Miragoâne', department: 'Nippes' },
    { id: '40', name: 'Petite-Rivière-de-Nippes', department: 'Nippes' },
    { id: '41', name: 'Baradères', department: 'Nippes' },
    { id: '42', name: 'Fonds-des-Nègres', department: 'Nippes' },
    
    // Centre Department
    { id: '43', name: 'Hinche', department: 'Centre' },
    { id: '44', name: 'Mirebalais', department: 'Centre' },
    { id: '45', name: 'Lascahobas', department: 'Centre' },
    { id: '46', name: 'Cerca-la-Source', department: 'Centre' },
    { id: '47', name: 'Thomassique', department: 'Centre' },
  ];

  // Filter communes based on search query
  const filteredCommunes = searchQuery
    ? allCommunes.filter(commune =>
        commune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commune.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCommunes;

  // Group communes by department
  const communesByDepartment = filteredCommunes.reduce((acc, commune) => {
    if (!acc[commune.department]) {
      acc[commune.department] = [];
    }
    acc[commune.department].push(commune);
    return acc;
  }, {} as Record<string, Commune[]>);

  const departments = Object.keys(communesByDepartment).sort();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSelectCommune = (communeName: string) => {
    // Here you would typically save the selected commune
    console.log('Selected commune:', communeName);
    navigate(-1); // Go back to previous page
  };

  const handleDeleteCommune = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, you would remove from favorites
    console.log('Delete commune:', id);
    setHoveredId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Fixed but with proper z-index */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Tout Komin Ayiti</h1>
        </div>
        
        {/* Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chache yon komin oswa depatman..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Communes List - Main content area with bottom padding */}
      <div className="px-3 py-4 pb-20">
        {departments.length > 0 ? (
          <div className="space-y-6">
            {departments.map((department) => (
              <div key={department} className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-900 px-1">
                  {department}
                </h2>
                <div className="columns-2 md:columns-3 gap-2">
                  {communesByDepartment[department].map((commune) => (
                    <div
                      key={commune.id}
                      className={`group inline-block w-full mb-2 break-inside-avoid transition-colors duration-150 cursor-pointer relative ${
                        'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleSelectCommune(commune.name)}
                      onMouseEnter={() => setHoveredId(commune.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="p-2.5 pr-8">
                        <span className="text-sm text-gray-900">
                          {commune.name}
                        </span>
                      </div>
                      
                      {/* Delete button - shows on hover */}
                      {hoveredId === commune.id && (
                        <button
                          onClick={(e) => handleDeleteCommune(commune.id, e)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Pa gen rezilta
            </h3>
            <p className="text-xs text-gray-500">
              Pa gen komin ki koresponn ak rechèch ou
            </p>
          </div>
        )}
      </div>

      {/* Sticky Add Button - Simple fixed positioning without complex z-index */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <button
          onClick={() => {
            // In a real app, this would show a form to add a new commune
            console.log('Add new commune');
          }}
          className="w-full px-3 py-3 border-2 border-dashed border-gray-400 text-gray-700 text-sm hover:border-red-400 hover:text-red-700 transition-colors"
        >
          + Propoze yon nouvo komin
        </button>
      </div>
    </div>
  );
}