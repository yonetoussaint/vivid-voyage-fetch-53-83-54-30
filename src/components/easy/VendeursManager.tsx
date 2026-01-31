import React, { useState } from 'react';
import { 
  Users, User, Plus, Trash2, Hash, Phone, MapPin, Calendar, 
  Clock, AlertCircle, Edit2, X, Mail, DollarSign, CreditCard,
  FileText, CheckCircle, XCircle, ChevronRight
} from 'lucide-react';

// Mock data for seller details - in real app this would come from props or API
const mockSellerDetails = {
  "Jean Dupont": {
    id: "VD001",
    fullName: "Jean Dupont",
    phone: "+33 6 12 34 56 78",
    email: "jean.dupont@station.com",
    address: "123 Rue de la Station, 75015 Paris",
    hireDate: "2023-01-15",
    salary: 2450,
    paymentMethod: "Bank Transfer",
    status: "active",
    tardiness: [
      {
        date: "2024-01-15",
        heurePrevue: "08:00",
        heureArrivee: "08:35",
        retard: "35 minutes",
        motif: "Problème transport"
      },
      {
        date: "2024-01-10",
        heurePrevue: "08:00",
        heureArrivee: "08:20",
        retard: "20 minutes",
        motif: "Embouteillage"
      },
      {
        date: "2024-01-05",
        heurePrevue: "16:00",
        heureArrivee: "16:15",
        retard: "15 minutes",
        motif: "Rendez-vous médical"
      }
    ],
    notes: "Excellent avec les clients, très ponctuel généralement",
    documents: ["contrat.pdf", "cv.pdf"],
    emergencyContact: {
      name: "Marie Dupont",
      phone: "+33 6 98 76 54 32",
      relation: "Épouse"
    }
  },
  "Marie Martin": {
    id: "VD002",
    fullName: "Marie Martin",
    phone: "+33 6 23 45 67 89",
    email: "marie.martin@station.com",
    address: "456 Avenue du Commerce, 69002 Lyon",
    hireDate: "2023-03-20",
    salary: 2350,
    paymentMethod: "Credit Card",
    status: "active",
    tardiness: [
      {
        date: "2024-01-14",
        heurePrevue: "16:00",
        heureArrivee: "16:45",
        retard: "45 minutes",
        motif: "Panne de voiture"
      }
    ],
    notes: "Très organisée, gestionnaire principale des stocks",
    documents: ["contrat.pdf"],
    emergencyContact: {
      name: "Pierre Martin",
      phone: "+33 6 87 65 43 21",
      relation: "Frère"
    }
  }
};

const VendeursManager = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openSellerPanel = (sellerName) => {
    setSelectedSeller(mockSellerDetails[sellerName] || {
      fullName: sellerName,
      id: `VD${(vendeurs.indexOf(sellerName) + 1).toString().padStart(3, '0')}`,
      phone: "Non renseigné",
      email: "Non renseigné",
      address: "Non renseignée",
      hireDate: "2024-01-01",
      salary: 0,
      paymentMethod: "Non spécifié",
      status: "active",
      tardiness: [],
      notes: "",
      documents: [],
      emergencyContact: {
        name: "Non renseigné",
        phone: "Non renseigné",
        relation: "Non renseigné"
      }
    });
    setIsPanelOpen(true);
  };

  const closeSellerPanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedSeller(null), 300);
  };

  const calculateTotalRetard = (tardiness) => {
    return tardiness.reduce((total, entry) => {
      const minutes = parseInt(entry.retard.split(' ')[0]);
      return total + minutes;
    }, 0);
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <Users size={20} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gestion des Vendeurs</h2>
            <p className="text-sm text-gray-500">Cliquez sur un vendeur pour voir ses détails</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{vendeurs.length}</span>
        </div>
      </div>

      {/* Ajouter Vendeur */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ajouter un nouveau vendeur</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={nouveauVendeur}
              onChange={(e) => setNouveauVendeur(e.target.value)}
              placeholder="Nom complet du vendeur"
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onKeyPress={(e) => e.key === 'Enter' && ajouterVendeur()}
            />
            <User size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={ajouterVendeur}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all sm:w-auto w-full"
          >
            <Plus size={16} />
            Ajouter Vendeur
          </button>
        </div>
      </div>

      {/* Liste des Vendeurs - Grid Layout */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900">Vendeurs enregistrés</h3>
          <p className="text-xs text-gray-500 mt-1">Cliquez sur une carte pour voir tous les détails</p>
        </div>

        {vendeurs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendeurs.map((vendeur, index) => {
              const details = mockSellerDetails[vendeur];
              const tardiness = details?.tardiness || [];
              const totalRetard = calculateTotalRetard(tardiness);
              
              return (
                <div 
                  key={vendeur} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                  onClick={() => openSellerPanel(vendeur)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{vendeur}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">ID: {String(index + 1).padStart(3, '0')}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {details?.phone || "Non renseigné"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <span className={`text-xs font-medium ${totalRetard > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {totalRetard > 0 ? `${totalRetard} min retard` : 'À jour'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">
                        {details?.address || "Adresse non renseignée"}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Affectations</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-blue-600">
                            {getNombreAffectations ? getNombreAffectations(vendeur) : 0}
                          </span>
                          <span className="text-xs text-gray-500">pompe(s)</span>
                        </div>
                      </div>
                      
                      {tardiness.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <AlertCircle size={12} className="text-amber-500" />
                          <span className="text-xs text-amber-600">
                            {tardiness.length} retard{tardiness.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Users size={28} className="text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Aucun vendeur enregistré</h4>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Ajoutez vos premiers vendeurs pour commencer à gérer leurs affectations aux pompes.
            </p>
            <button
              onClick={ajouterVendeur}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Ajouter votre premier vendeur
            </button>
          </div>
        )}
      </div>

      {/* Bottom Slide-up Panel */}
      {selectedSeller && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isPanelOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeSellerPanel}
          />
          
          {/* Panel */}
          <div 
            className={`fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ${
              isPanelOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ maxHeight: '85vh' }}
          >
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedSeller.fullName}</h3>
                    <div className="flex items-center gap-2">
                      <Hash size={12} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{selectedSeller.id}</span>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedSeller.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedSeller.status === 'active' ? 'Actif' : 'Inactif'}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeSellerPanel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">Pompes</div>
                  <div className="text-xl font-bold text-gray-900">
                    {getNombreAffectations ? getNombreAffectations(selectedSeller.fullName) : 0}
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-xs text-amber-600 font-medium mb-1">Retards</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedSeller.tardiness.length}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium mb-1">Salaire</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedSeller.salary.toLocaleString('fr-FR')}€
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {/* Informations Personnelles */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} />
                  Informations Personnelles
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Téléphone</div>
                      <div className="text-sm text-gray-900">{selectedSeller.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-900">{selectedSeller.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Adresse</div>
                      <div className="text-sm text-gray-900">{selectedSeller.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Date d'embauche</div>
                      <div className="text-sm text-gray-900">
                        {new Date(selectedSeller.hireDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations Financières */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign size={16} />
                  Informations Financières
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Salaire Mensuel</div>
                      <div className="text-sm text-gray-900 font-medium">
                        {selectedSeller.salary.toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Méthode de Paiement</div>
                      <div className="text-sm text-gray-900">{selectedSeller.paymentMethod}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact d'Urgence */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Contact d'Urgence
                </h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-900 mb-1">{selectedSeller.emergencyContact.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{selectedSeller.emergencyContact.relation}</div>
                  <div className="text-sm text-gray-900 font-medium">{selectedSeller.emergencyContact.phone}</div>
                </div>
              </div>

              {/* Historique des Retards */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Clock size={16} />
                    Historique des Retards
                    {selectedSeller.tardiness.length > 0 && (
                      <span className="text-xs font-normal text-gray-500">
                        (Total: {calculateTotalRetard(selectedSeller.tardiness)} minutes)
                      </span>
                    )}
                  </h4>
                </div>

                {selectedSeller.tardiness.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSeller.tardiness.map((retard, index) => (
                      <div key={index} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(retard.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="text-xs text-gray-600">
                              Prévu: <span className="font-medium">{retard.heurePrevue}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Arrivé: <span className="font-medium">{retard.heureArrivee}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{retard.motif}</div>
                        </div>
                        <div className="text-red-600 font-semibold text-sm">
                          {retard.retard}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Aucun retard enregistré</p>
                    <p className="text-xs text-gray-500">Vendeur toujours ponctuel</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedSeller.notes && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedSeller.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition">
                  <Edit2 size={16} className="inline mr-2" />
                  Modifier
                </button>
                <button 
                  onClick={() => {
                    supprimerVendeur(selectedSeller.fullName);
                    closeSellerPanel();
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition"
                >
                  <Trash2 size={16} className="inline mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendeursManager;