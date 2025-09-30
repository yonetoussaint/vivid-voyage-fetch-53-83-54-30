import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MapPin, Building2 } from 'lucide-react';

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  commune: string;
  email?: string;
  moncashPhoneNumber?: string;
}

interface StepTwoPointFiveTransferProps {
  receiverDetails: ReceiverDetails;
  onDetailsChange: (details: ReceiverDetails) => void;
}

// Haiti departments and their communes
const HAITI_LOCATIONS = {
  'Artibonite': [
    'Gonaïves', 'Saint-Marc', 'Dessalines', 'Grande-Saline', 'Petite-Rivière-de-l\'Artibonite',
    'L\'Estère', 'Verrettes', 'La Chapelle', 'Liancourt', 'Pont-Sondé', 'Marchand-Dessalines',
    'Desdunes', 'Saint-Michel-de-l\'Attalaye', 'Anse-Rouge', 'Gros-Morne'
  ],
  'Centre': [
    'Hinche', 'Mirebalais', 'Lascahobas', 'Savanette', 'Cerca-la-Source', 'Thomassique',
    'Maïssade', 'Cerca Carvajal', 'Belladère', 'Boucan-Carré', 'Thomonde', 'Baptiste'
  ],
  'Grand\'Anse': [
    'Jérémie', 'Dame-Marie', 'Les Irois', 'Anse-d\'Hainault', 'Trou-Bonbon', 'Abricots',
    'Roseaux', 'Corail', 'Pestel', 'Beaumont', 'Chambellan', 'Moron'
  ],
  'Nippes': [
    'Miragoâne', 'Petit-Goâve', 'Anse-à-Veau', 'Baradères', 'Petit-Trou-de-Nippes',
    'Plaisance-du-Sud', 'Fonds-des-Nègres', 'Arnaud'
  ],
  'Nord': [
    'Cap-Haïtien', 'Fort-Dauphin', 'Ouanaminthe', 'Trou-du-Nord', 'Sainte-Suzanne',
    'Grande-Rivière-du-Nord', 'Saint-Raphaël', 'Dondon', 'Bahon', 'Borgne', 'Acul-du-Nord',
    'Plaine-du-Nord', 'Limonade', 'Quartier-Morin', 'Milot', 'Pignon', 'Ranquitte', 'La Victoire'
  ],
  'Nord-Est': [
    'Fort-Liberté', 'Trou-du-Nord', 'Terrier-Rouge', 'Capotille', 'Mont-Organisé',
    'Sainte-Suzanne', 'Caracol', 'Mombin-Crochu'
  ],
  'Nord-Ouest': [
    'Port-de-Paix', 'Saint-Louis-du-Nord', 'Jean-Rabel', 'Môle-Saint-Nicolas', 'Bombardopolis',
    'Bassin-Bleu', 'Chansolme', 'Turtle Island', 'La Tortue'
  ],
  'Ouest': [
    'Port-au-Prince', 'Delmas', 'Pétion-Ville', 'Carrefour', 'Tabarre', 'Cité Soleil',
    'Croix-des-Bouquets', 'Thomazeau', 'Cornillon', 'Fonds-Verrettes', 'Ganthier',
    'La Plaine', 'Thomonde', 'Gressier', 'Léogâne', 'Grand-Goâve', 'Petit-Goâve',
    'Jacmel', 'Arcahaie', 'Cabaret', 'Kenscoff'
  ],
  'Sud': [
    'Les Cayes', 'Aquin', 'Cavaillon', 'Saint-Louis-du-Sud', 'Torbeck', 'Chantal',
    'Île-à-Vache', 'Port-à-Piment', 'Roche-à-Bateaux', 'Maniche', 'Arniquet',
    'Camp-Perrin', 'Maniche', 'Port-Salut'
  ],
  'Sud-Est': [
    'Jacmel', 'Marigot', 'Cayes-Jacmel', 'Bainet', 'Côte-de-Fer', 'Anse-à-Pitres',
    'Thiotte', 'Belle-Anse', 'Grand-Gosier', 'Banane', 'La Vallée'
  ]
};

const StepTwoPointFiveTransfer: React.FC<StepTwoPointFiveTransferProps> = ({ 
  receiverDetails, 
  onDetailsChange
}) => {
  const handleDepartmentChange = (department: string) => {
    const updatedDetails = {
      ...receiverDetails,
      department,
      commune: '', // Reset commune when department changes
    };
    onDetailsChange(updatedDetails);
  };

  const handleCommuneChange = (commune: string) => {
    const updatedDetails = {
      ...receiverDetails,
      commune,
    };
    onDetailsChange(updatedDetails);
  };

  const availableCommunes = receiverDetails.department ? HAITI_LOCATIONS[receiverDetails.department as keyof typeof HAITI_LOCATIONS] || [] : [];

  return (
    <div className="min-h-screen bg-white flex flex-col px-0">
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Where should they pick it up?
          </h1>
          <p className="text-sm text-gray-600">
            Select the department and commune for pickup</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {/* Department Selection */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <Select value={receiverDetails.department} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="pl-10 h-12 text-base">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(HAITI_LOCATIONS).map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Commune Selection */}
          <div>
            <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-2">
              Commune
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <Select 
                value={receiverDetails.commune} 
                onValueChange={handleCommuneChange}
                disabled={!receiverDetails.department}
              >
                <SelectTrigger className="pl-10 h-12 text-base">
                  <SelectValue placeholder={receiverDetails.department ? "Select commune" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCommunes.map((commune) => (
                    <SelectItem key={commune} value={commune}>
                      {commune}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info Box */}
          {receiverDetails.department && receiverDetails.commune && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Selected Location</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {receiverDetails.commune}, {receiverDetails.department}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    The recipient will be able to pick up the money at any authorized location in this commune.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwoPointFiveTransfer;