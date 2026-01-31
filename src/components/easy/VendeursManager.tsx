import React, { useState, useEffect } from 'react';
import { 
  Users, User, Plus, Trash2, Hash, Phone, MapPin, Calendar, 
  Clock, AlertCircle, Edit2, X, DollarSign, CreditCard,
  FileText, CheckCircle, ChevronRight, Save, MessageCircle,
  Bell, Home, Briefcase, Award, Shield, Download, Upload,
  Star, TrendingUp, Smartphone, Mail as WhatsAppIcon
} from 'lucide-react';

// Initial mock data for seller details
const initialSellerDetails = {
  "Jean Dupont": {
    id: "VD001",
    fullName: "Jean Dupont",
    phone: "+33 6 12 34 56 78",
    whatsapp: "+33 6 12 34 56 78",
    address: "123 Rue de la Station, 75015 Paris",
    hireDate: "2023-01-15",
    salary: 2450,
    paymentMethod: "Virement bancaire",
    status: "active",
    shift: "Matinale (6h-14h)",
    experience: "2 ans",
    tardiness: [
      {
        id: 1,
        date: "2024-01-15",
        heurePrevue: "08:00",
        heureArrivee: "08:35",
        retard: "35 minutes",
        motif: "Problème transport",
        statut: "excused"
      },
      {
        id: 2,
        date: "2024-01-10",
        heurePrevue: "08:00",
        heureArrivee: "08:20",
        retard: "20 minutes",
        motif: "Embouteillage",
        statut: "excused"
      }
    ],
    notes: "Excellent avec les clients, très ponctuel généralement",
    documents: ["contrat.pdf", "cv.pdf"],
    emergencyContact: {
      name: "Marie Dupont",
      phone: "+33 6 98 76 54 32",
      relation: "Épouse"
    },
    performance: 4.5,
    salesTarget: 15000,
    currentMonthSales: 12800
  },
  "Marie Martin": {
    id: "VD002",
    fullName: "Marie Martin",
    phone: "+33 6 23 45 67 89",
    whatsapp: "+33 6 23 45 67 89",
    address: "456 Avenue du Commerce, 69002 Lyon",
    hireDate: "2023-03-20",
    salary: 2350,
    paymentMethod: "Carte de crédit",
    status: "active",
    shift: "Après-midi (14h-22h)",
    experience: "1 an",
    tardiness: [
      {
        id: 1,
        date: "2024-01-14",
        heurePrevue: "16:00",
        heureArrivee: "16:45",
        retard: "45 minutes",
        motif: "Panne de voiture",
        statut: "excused"
      }
    ],
    notes: "Très organisée, gestionnaire principale des stocks",
    documents: ["contrat.pdf"],
    emergencyContact: {
      name: "Pierre Martin",
      phone: "+33 6 87 65 43 21",
      relation: "Frère"
    },
    performance: 4.2,
    salesTarget: 12000,
    currentMonthSales: 11500
  }
};

const VendeursManager = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSeller, setEditedSeller] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(initialSellerDetails);
  const [newTardiness, setNewTardiness] = useState({
    date: new Date().toISOString().split('T')[0],
    heurePrevue: "08:00",
    heureArrivee: new Date().toTimeString().slice(0, 5),
    retard: "0 minutes",
    motif: "",
    statut: "pending"
  });

  const openSellerPanel = (sellerName) => {
    if (sellerDetails[sellerName]) {
      setSelectedSeller(sellerDetails[sellerName]);
      setEditedSeller(sellerDetails[sellerName]);
    } else {
      const newSeller = {
        id: `VD${(vendeurs.indexOf(sellerName) + 1).toString().padStart(3, '0')}`,
        fullName: sellerName,
        phone: "",
        whatsapp: "",
        address: "",
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        paymentMethod: "Virement bancaire",
        status: "active",
        shift: "Matinale (6h-14h)",
        experience: "0 an",
        tardiness: [],
        notes: "",
        documents: [],
        emergencyContact: {
          name: "",
          phone: "",
          relation: ""
        },
        performance: 0,
        salesTarget: 0,
        currentMonthSales: 0
      };
      setSellerDetails(prev => ({ ...prev, [sellerName]: newSeller }));
      setSelectedSeller(newSeller);
      setEditedSeller(newSeller);
    }
    setIsPanelOpen(true);
    setIsEditing(false);
  };

  const closeSellerPanel = () => {
    setIsPanelOpen(false);
    setIsEditing(false);
    setTimeout(() => {
      setSelectedSeller(null);
      setEditedSeller(null);
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSeller({ ...selectedSeller });
  };

  const handleSave = () => {
    setSellerDetails(prev => ({
      ...prev,
      [selectedSeller.fullName]: editedSeller
    }));
    setSelectedSeller(editedSeller);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSeller(selectedSeller);
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedSeller(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setEditedSeller(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const calculateTotalRetard = (tardiness) => {
    return tardiness.reduce((total, entry) => {
      const minutes = parseInt(entry.retard.split(' ')[0]) || 0;
      return total + minutes;
    }, 0);
  };

  const handleAddTardiness = () => {
    if (!newTardiness.motif || !newTardiness.heurePrevue) return;
    
    const heuresPrevue = newTardiness.heurePrevue.split(':');
    const heuresArrivee = newTardiness.heureArrivee.split(':');
    const retardMinutes = (parseInt(heuresArrivee[0]) * 60 + parseInt(heuresArrivee[1])) - 
                         (parseInt(heuresPrevue[0]) * 60 + parseInt(heuresPrevue[1]));
    
    const newTardinessEntry = {
      id: Date.now(),
      date: newTardiness.date,
      heurePrevue: newTardiness.heurePrevue,
      heureArrivee: newTardiness.heureArrivee,
      retard: `${Math.abs(retardMinutes)} minutes`,
      motif: newTardiness.motif,
      statut: "pending"
    };

    setEditedSeller(prev => ({
      ...prev,
      tardiness: [newTardinessEntry, ...prev.tardiness]
    }));

    setNewTardiness({
      date: new Date().toISOString().split('T')[0],
      heurePrevue: "08:00",
      heureArrivee: new Date().toTimeString().slice(0, 5),
      retard: "0 minutes",
      motif: "",
      statut: "pending"
    });
  };

  const handleDeleteTardiness = (id) => {
    setEditedSeller(prev => ({
      ...prev,
      tardiness: prev.tardiness.filter(t => t.id !== id)
    }));
  };

  const handleMarkLate = (sellerName) => {
    const seller = sellerDetails[sellerName];
    if (!seller) return;

    const currentTime = new Date();
    const formattedTime = currentTime.toTimeString().slice(0, 5);
    const formattedDate = currentTime.toISOString().split('T')[0];
    
    const newTardinessEntry = {
      id: Date.now(),
      date: formattedDate,
      heurePrevue: "08:00", // Default shift start
      heureArrivee: formattedTime,
      retard: "En retard",
      motif: "À préciser",
      statut: "pending"
    };

    const updatedSeller = {
      ...seller,
      tardiness: [newTardinessEntry, ...seller.tardiness]
    };

    setSellerDetails(prev => ({
      ...prev,
      [sellerName]: updatedSeller
    }));

    // If this seller is currently selected, update the panel
    if (selectedSeller && selectedSeller.fullName === sellerName) {
      setSelectedSeller(updatedSeller);
      setEditedSeller(updatedSeller);
    }
  };

  const handleWhatsAppClick = (phone) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const getPerformanceColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
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
              const details = sellerDetails[vendeur];
              const tardiness = details?.tardiness || [];
              const totalRetard = calculateTotalRetard(tardiness);
              const isLateToday = tardiness.some(t => 
                t.date === new Date().toISOString().split('T')[0]
              );
              
              return (
                <div 
                  key={vendeur} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 relative group"
                  onClick={() => openSellerPanel(vendeur)}
                >
                  {/* Late Today Badge */}
                  {isLateToday && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      En retard
                    </div>
                  )}

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
                    {/* Contact Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600 truncate">
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

                    {/* Shift & Experience */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {details?.shift || "Non défini"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{details?.experience || "0 an"}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2">
                      <Home size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">
                        {details?.address || "Adresse non renseignée"}
                      </span>
                    </div>

                    {/* Stats Bar */}
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between mb-2">
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
                      
                      {/* Performance Indicator */}
                      {details?.performance > 0 && (
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className={`text-xs font-medium ${getPerformanceColor(details.performance)}`}>
                            {details.performance.toFixed(1)}/5.0
                          </span>
                        </div>
                      )}
                      
                      {tardiness.length > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                          <AlertCircle size={12} className="text-amber-500" />
                          <span className="text-xs text-amber-600">
                            {tardiness.length} retard{tardiness.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkLate(vendeur);
                        }}
                        className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition flex items-center justify-center gap-1"
                      >
                        <Clock size={12} />
                        Marquer retard
                      </button>
                      {details?.whatsapp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppClick(details.whatsapp);
                          }}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition"
                          title="Envoyer WhatsApp"
                        >
                          <WhatsAppIcon size={14} />
                        </button>
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
            style={{ maxHeight: '90vh' }}
          >
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={22} className="text-blue-600" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedSeller.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        className="text-lg font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-gray-900">{selectedSeller.fullName}</h3>
                    )}
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
              <div className="grid grid-cols-4 gap-2">
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
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium mb-1">Performance</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedSeller.performance?.toFixed(1) || '0.0'}/5
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Smartphone size={16} />
                  Contact
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Téléphone</div>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedSeller.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="+33 6 12 34 56 78"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{selectedSeller.phone}</span>
                          {selectedSeller.phone && (
                            <button
                              onClick={() => handlePhoneClick(selectedSeller.phone)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Appeler"
                            >
                              <Phone size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <WhatsAppIcon size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">WhatsApp</div>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedSeller.whatsapp}
                          onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="+33 6 12 34 56 78"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{selectedSeller.whatsapp || "Non renseigné"}</span>
                          {selectedSeller.whatsapp && (
                            <button
                              onClick={() => handleWhatsAppClick(selectedSeller.whatsapp)}
                              className="text-green-600 hover:text-green-700"
                              title="Envoyer WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Adresse</div>
                      {isEditing ? (
                        <textarea
                          value={editedSeller.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          rows="2"
                          placeholder="Adresse complète"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{selectedSeller.address}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations Professionnelles */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={16} />
                  Informations Professionnelles
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Date d'embauche</div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedSeller.hireDate}
                          onChange={(e) => handleFieldChange('hireDate', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {new Date(selectedSeller.hireDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Expérience</div>
                      {isEditing ? (
                        <select
                          value={editedSeller.experience}
                          onChange={(e) => handleFieldChange('experience', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="0 an">0 an</option>
                          <option value="1 an">1 an</option>
                          <option value="2 ans">2 ans</option>
                          <option value="3 ans">3 ans</option>
                          <option value="4 ans">4 ans</option>
                          <option value="5+ ans">5+ ans</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{selectedSeller.experience}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Horaire</div>
                      {isEditing ? (
                        <select
                          value={editedSeller.shift}
                          onChange={(e) => handleFieldChange('shift', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Matinale (6h-14h)">Matinale (6h-14h)</option>
                          <option value="Après-midi (14h-22h)">Après-midi (14h-22h)</option>
                          <option value="Nuit (22h-6h)">Nuit (22h-6h)</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{selectedSeller.shift}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Salaire</div>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedSeller.salary}
                          onChange={(e) => handleFieldChange('salary', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Salaire mensuel"
                        />
                      ) : (
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedSeller.salary.toLocaleString('fr-FR')} €
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact d'Urgence */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Bell size={16} />
                  Contact d'Urgence
                </h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedSeller.emergencyContact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Nom"
                      />
                      <input
                        type="tel"
                        value={editedSeller.emergencyContact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Téléphone"
                      />
                      <input
                        type="text"
                        value={editedSeller.emergencyContact.relation}
                        onChange={(e) => handleEmergencyContactChange('relation', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Relation"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-gray-900 mb-1">{selectedSeller.emergencyContact.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{selectedSeller.emergencyContact.relation}</div>
                      <div className="text-sm text-gray-900 font-medium">{selectedSeller.emergencyContact.phone}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Ajouter un retard */}
              {isEditing && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Ajouter un retard
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Date</label>
                        <input
                          type="date"
                          value={newTardiness.date}
                          onChange={(e) => setNewTardiness(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Heure prévue</label>
                        <input
                          type="time"
                          value={newTardiness.heurePrevue}
                          onChange={(e) => setNewTardiness(prev => ({ ...prev, heurePrevue: e.target.value }))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Heure d'arrivée</label>
                      <input
                        type="time"
                        value={newTardiness.heureArrivee}
                        onChange={(e) => setNewTardiness(prev => ({ ...prev, heureArrivee: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Motif</label>
                      <input
                        type="text"
                        value={newTardiness.motif}
                        onChange={(e) => setNewTardiness(prev => ({ ...prev, motif: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Raison du retard"
                      />
                    </div>
                    <button
                      onClick={handleAddTardiness}
                      className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                      disabled={!newTardiness.motif}
                    >
                      Ajouter le retard
                    </button>
                  </div>
                </div>
              )}

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
                    {selectedSeller.tardiness.map((retard) => (
                      <div key={retard.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(retard.date).toLocaleDateString('fr-FR')}
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => handleDeleteTardiness(retard.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            )}
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
                          <div className="mt-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              retard.statut === 'excused' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {retard.statut === 'excused' ? 'Excusé' : 'Non excusé'}
                            </span>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold text-sm ml-2">
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
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
                {isEditing ? (
                  <textarea
                    value={editedSeller.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows="3"
                    placeholder="Ajouter des notes sur ce vendeur..."
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedSeller.notes || "Aucune note"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Enregistrer
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Modifier les informations
                  </button>
                  <button 
                    onClick={() => {
                      supprimerVendeur(selectedSeller.fullName);
                      closeSellerPanel();
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendeursManager;