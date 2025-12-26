// pages/CommunesPage.tsx
import { Search, X, ChevronLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useCommunes } from '@/hooks/communes.hooks';

interface CommunesPageProps {
  onClose: () => void;
}

export default function CommunesPage({ onClose }: CommunesPageProps) {
  const {
    // State
    searchQuery,
    hoveredId,
    expandedDepartments,
    communesByDepartment,
    departments,
    isSearchVisible,

    // Actions
    setSearchQuery,
    setHoveredId,
    toggleDepartment,
    expandAllDepartments,
    collapseAllDepartments,
    toggleSearch,
    closeSearch,
    handleGoBack,
    handleSelectCommune,
    handleDeleteCommune,
    handleAddNewCommune,
    clearSearch,
    handleHelp,
  } = useCommunes({ onClose });

  // Check if all departments are expanded
  const allExpanded = departments.length > 0 && 
    departments.every(dept => expandedDepartments.has(dept));

  // Direct back handler that calls onClose
  const handleBack = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Header - Reduced height and removed border */}
      {!isSearchVisible ? (
        <div className="sticky top-0 bg-white px-2 py-2 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Expand All button - only show when not all expanded */}
              {!allExpanded && (
                <button
                  onClick={expandAllDepartments}
                  className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  Elaji tout
                </button>
              )}

              {/* Search Icon */}
              <button
                onClick={toggleSearch}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Help Icon */}
              <button
                onClick={handleHelp}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Search Bar Header - When search is active */
        <div className="sticky top-0 bg-white px-2 py-2 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chache yon komin oswa depatman..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
            />
            <button
              onClick={closeSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Communes List - Scrollable area with balanced padding */}
      <div className="absolute top-[52px] bottom-0 left-0 right-0 overflow-y-auto">
        {departments.length > 0 ? (
          <div className="px-2 space-y-4 py-2">
            {departments.map((department) => (
              <div key={department} className="space-y-2">
                {/* Department Header with Chevron */}
                <div 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleDepartment(department)}
                >
                  <h2 className="text-sm font-semibold text-gray-900">
                    {department}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({communesByDepartment[department].length})
                    </span>
                  </h2>
                  <div className="flex items-center">
                    {expandedDepartments.has(department) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Communes List (collapsible) */}
                {expandedDepartments.has(department) && (
                  <div className="columns-2 md:columns-3 gap-2 px-2">
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
                )}
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
    </div>
  );
}