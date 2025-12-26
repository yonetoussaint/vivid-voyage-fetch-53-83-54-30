// hooks/communes.hook.tsx
import { useState, useMemo, useCallback } from 'react';

export interface Commune {
  id: string;
  name: string;
  department: string;
}

interface UseCommunesProps {
  onClose: () => void;
}

export interface UseCommunesReturn {
  // State
  searchQuery: string;
  hoveredId: string | null;
  filteredCommunes: Commune[];
  communesByDepartment: Record<string, Commune[]>;
  departments: string[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setHoveredId: (id: string | null) => void;
  handleGoBack: () => void;
  handleSelectCommune: (communeName: string) => void;
  handleDeleteCommune: (id: string, e: React.MouseEvent) => void;
  handleAddNewCommune: () => void;
  clearSearch: () => void;
}

const ALL_COMMUNES: Commune[] = [
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

export function useCommunes({ onClose }: UseCommunesProps): UseCommunesReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter communes based on search query
  const filteredCommunes = useMemo(() => {
    if (!searchQuery.trim()) return ALL_COMMUNES;
    
    const query = searchQuery.toLowerCase().trim();
    return ALL_COMMUNES.filter(commune =>
      commune.name.toLowerCase().includes(query) ||
      commune.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group communes by department
  const communesByDepartment = useMemo(() => {
    return filteredCommunes.reduce((acc, commune) => {
      if (!acc[commune.department]) {
        acc[commune.department] = [];
      }
      acc[commune.department].push(commune);
      return acc;
    }, {} as Record<string, Commune[]>);
  }, [filteredCommunes]);

  // Get sorted departments
  const departments = useMemo(() => {
    return Object.keys(communesByDepartment).sort();
  }, [communesByDepartment]);

  const handleGoBack = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelectCommune = useCallback((communeName: string) => {
    // Here you would typically save the selected commune
    console.log('Selected commune:', communeName);
    onClose();
  }, [onClose]);

  const handleDeleteCommune = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, you would remove from favorites or perform delete operation
    console.log('Delete commune:', id);
    setHoveredId(null);
  }, []);

  const handleAddNewCommune = useCallback(() => {
    // In a real app, this would show a form to add a new commune
    console.log('Add new commune');
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    // State
    searchQuery,
    hoveredId,
    filteredCommunes,
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
  };
}