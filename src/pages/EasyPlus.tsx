import React, { useState } from 'react';
import ShiftManager from '@/components/easy/ShiftManager';
import ConditionnementManager from '@/components/easy/ConditionnementManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import Rapport from '@/components/easy/Rapport';
import { useStationData } from '@/hooks/useStationData';

// Tabbed Interface Component
const TabbedInterface = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'pumps', label: 'Pompes & Propane', icon: '⛽', color: 'border-blue-500 text-blue-600 hover:bg-blue-50' },
    { id: 'vendeurs', label: 'Vendeurs', icon: '👥', color: 'border-green-500 text-green-600 hover:bg-green-50' },
    { id: 'conditionnement', label: 'Conditionnement', icon: '📦', color: 'border-purple-500 text-purple-600 hover:bg-purple-50' },
    { id: 'depots', label: 'Dépôts', icon: '🏪', color: 'border-orange-500 text-orange-600 hover:bg-orange-50' },
    { id: 'stock', label: 'Stock Restant', icon: '📊', color: 'border-red-500 text-red-600 hover:bg-red-50' },
    { id: 'usd', label: 'Ventes USD', icon: '💵', color: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50' },
    { id: 'report', label: 'Rapports', icon: '📋', color: 'border-indigo-500 text-indigo-600 hover:bg-indigo-50' },
    { id: 'rapport', label: 'Rapport Gaz', icon: '🔥', color: 'border-teal-500 text-teal-600 hover:bg-teal-50' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
                ${activeTab === tab.id 
                  ? `${tab.color.split(' ')[0]} ${tab.color.split(' ')[1]} bg-opacity-10` 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${tab.color.split(' ')[2]}
                flex items-center space-x-2
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        {tabs.find(tab => tab.id === activeTab) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gestion des {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${tabs.find(tab => tab.id === activeTab)?.color.split(' ')[2].replace('hover:', '')} bg-opacity-20`}>
                <span className="text-2xl">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Side Panel Component
const SidePanel = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        flex flex-col
      `}>
        {/* Panel Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer le panneau"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
};

// Main Layout Component
const MainLayout = ({ 
  date, 
  shift, 
  setDate, 
  setShift, 
  handleReinitialiserShift, 
  handleReinitialiserJour,
  children,
  onMenuToggle 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Menu button and station info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Station Service</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{date}</span>
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                      Shift {shift}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center space-x-2">
              <ShiftManager shift={shift} />
              <button
                onClick={handleReinitialiserShift}
                className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg transition-colors"
              >
                Réinitialiser Shift
              </button>
              <button
                onClick={handleReinitialiserJour}
                className="px-3 py-2 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors"
              >
                Réinitialiser Jour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel will be rendered by parent component */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [conditionnements, setConditionnements] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('pumps');
  const [pompeEtendue, setPompeEtendue] = useState('P1');
  const [showContact, setShowContact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    toutesDonnees,
    propaneDonnees,
    vendeurs,
    tousDepots,
    ventesUSD,
    nouveauVendeur,
    setNouveauVendeur,
    reinitialiserShift,
    reinitialiserJour,
    ajouterVendeur,
    supprimerVendeur,
    mettreAJourLecture,
    mettreAJourAffectationVendeur,
    mettreAJourPropane,
    mettreAJourDepot,
    ajouterDepot,
    supprimerDepot,
    ajouterUSD,
    mettreAJourUSD,
    supprimerUSD,
    getNombreAffectations,
    totaux,
    totauxVendeurs,
    totauxVendeursCourants,
    totauxAM,
    totauxPM,
    totauxQuotidiens,
    calculerGallons,
    obtenirLecturesCourantes,
    prix,
    tauxUSD,
    prixPropane
  } = useStationData(date, shift);

  const pompes = ['P1', 'P2', 'P3', 'P4', 'P5'];

  const handlePompeSelection = (selection) => {
    setPompeEtendue(selection);
  };

  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    setPompeEtendue('P1');
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setPompeEtendue('P1');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'pumps':
        return (
          <PumpInputView
            shift={shift}
            pompeEtendue={pompeEtendue}
            setPompeEtendue={handlePompeSelection}
            pompes={pompes}
            toutesDonnees={toutesDonnees}
            vendeurs={vendeurs}
            totaux={totaux}
            tauxUSD={tauxUSD}
            mettreAJourLecture={mettreAJourLecture}
            mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
            prix={prix}
            calculerGallons={calculerGallons}
            obtenirLecturesCourantes={obtenirLecturesCourantes}
            propaneDonnees={propaneDonnees}
            mettreAJourPropane={mettreAJourPropane}
            prixPropane={prixPropane}
            showPropane={true}
            tousDepots={tousDepots}
          />
        );
      case 'vendeurs':
        return (
          <VendeursManager
            vendeurs={vendeurs}
            nouveauVendeur={nouveauVendeur}
            setNouveauVendeur={setNouveauVendeur}
            ajouterVendeur={ajouterVendeur}
            supprimerVendeur={supprimerVendeur}
            getNombreAffectations={getNombreAffectations}
          />
        );
      case 'conditionnement':
        return (
          <ConditionnementManager
            shift={shift}
            date={date}
            vendeurs={vendeurs}
            tousDepots={tousDepots}
            onConditionnementUpdate={setConditionnements}
          />
        );
      case 'depots':
        return (
          <DepotsManager
            shift={shift}
            vendeurs={vendeurs}
            totauxVendeurs={totauxVendeursCourants}
            tousDepots={tousDepots}
            mettreAJourDepot={mettreAJourDepot}
            ajouterDepot={ajouterDepot}
            supprimerDepot={supprimerDepot}
          />
        );
      case 'stock':
        return (
          <StockRestant
            date={date}
            shift={shift}
            toutesDonnees={toutesDonnees}
            propaneDonnees={propaneDonnees}
            pompes={pompes}
            prix={prix}
          />
        );
      case 'usd':
        return (
          <USDManager
            shift={shift}
            usdVentes={ventesUSD}
            ajouterUSD={ajouterUSD}
            mettreAJourUSD={mettreAJourUSD}
            supprimerUSD={supprimerUSD}
            tauxUSD={tauxUSD}
          />
        );
      case 'report':
        return (
          <ReportView
            date={date}
            totauxAM={totauxAM}
            totauxPM={totauxPM}
            totauxQuotidiens={totauxQuotidiens}
            toutesDonnees={toutesDonnees}
            propaneDonnees={propaneDonnees}
            ventesUSD={ventesUSD}
            vendeurs={vendeurs}
            totauxVendeurs={totauxVendeurs}
            tauxUSD={tauxUSD}
            prix={prix}
            prixPropane={prixPropane}
            pompes={pompes}
          />
        );
      case 'rapport':
        return (
          <Rapport
            date={date}
            shift={shift}
            toutesDonnees={toutesDonnees}
          />
        );
      default:
        return null;
    }
  };

  // Contact Modal Component
  const ContactModal = () => {
    if (!showContact) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Support Technique</h3>
            <button
              onClick={() => setShowContact(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-gray-600 mb-4">
                Pour toute question technique, problème rencontré, ou suggestion d'amélioration de l'application
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href="mailto:dev@example.com" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      dev@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Informations importantes</h4>
              <p className="text-sm text-gray-600 mb-3">
                Pour un support efficace, veuillez inclure:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Nom de la station</li>
                <li>Date et shift concerné</li>
                <li>Description détaillée du problème</li>
              </ul>
            </div>
          </div>

          <div className="px-5 py-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => setShowContact(false)}
              className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MainLayout
        date={date}
        shift={shift}
        setDate={setDate}
        setShift={setShift}
        handleReinitialiserShift={handleReinitialiserShift}
        handleReinitialiserJour={handleReinitialiserJour}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex h-full">
          {/* Side Panel with Tabs */}
          <SidePanel
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          >
            <TabbedInterface
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </SidePanel>

          {/* Main Content */}
          <div className="flex-1 pl-0 lg:pl-0">
            <div className="h-full">
              {renderActiveTabContent()}
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 bg-white">
        <div className="px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                Système Station Service v1.0
              </p>
              <p className="text-gray-500 text-xs mt-1">
                © {new Date().getFullYear()} • Application de gestion
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowContact(true)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 6.249 16 7.1 16 8zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                </svg>
                Support Technique
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Button for mobile */}
      <button
        onClick={() => setShowContact(true)}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40 transition-colors"
        aria-label="Contact Support"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      <ContactModal />
    </>
  );
};

export default SystemeStationService;