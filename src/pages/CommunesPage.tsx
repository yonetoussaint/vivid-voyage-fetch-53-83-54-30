// pages/CommunesPage.tsx
import { Search, X, ChevronLeft } from 'lucide-react';
import { useCommunes } from '@/hooks/communes.hook';

interface CommunesPageProps {
  onClose: () => void;
}

export default function CommunesPage({ onClose }: CommunesPageProps) {
  const {
    // State
    searchQuery,
    hoveredId,
    communesByDepartment,
    departments,
    
    // Actions
    setSearchQuery,
    setHoveredId,
    handleGoBack,
    handleSelectCommune,
    handleDeleteCommune,
    handleAddNewCommune,
    clearSearch,
  } = useCommunes({ onClose });

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
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
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Communes List - Scrollable area */}
      <div className="absolute top-[140px] bottom-[70px] left-0 right-0 overflow-y-auto px-3 py-4">
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

      {/* Sticky Add Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <button
          onClick={handleAddNewCommune}
          className="w-full px-3 py-3 border-2 border-dashed border-gray-400 text-gray-700 text-sm hover:border-red-400 hover:text-red-700 transition-colors"
        >
          + Propoze yon nouvo komin
        </button>
      </div>
    </div>
  );
}