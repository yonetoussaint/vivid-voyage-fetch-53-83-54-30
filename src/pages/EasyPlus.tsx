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

// Vertical Tab List Component
const VerticalTabs = ({ activeTab, onTabChange, isMobile }) => {
  const tabs = [
    { id: 'pumps', label: 'Pompes & Propane', icon: '⛽', color: 'bg-blue-100 text-blue-700' },
    { id: 'vendeurs', label: 'Vendeurs', icon: '👥', color: 'bg-green-100 text-green-700' },
    { id: 'conditionnement', label: 'Conditionnement', icon: '📦', color: 'bg-purple-100 text-purple-700' },
    { id: 'depots', label: 'Dépôts', icon: '🏪', color: 'bg-orange-100 text-orange-700' },
    { id: 'stock', label: 'Stock Restant', icon: '📊', color: 'bg-red-100 text-red-700' },
    { id: 'usd', label: 'Ventes USD', icon: '💵', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'report', label: 'Rapports', icon: '📋', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'rapport', label: 'Rapport Gaz', icon: '🔥', color: 'bg-teal-100 text-teal-700' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header for Mobile */}
      {isMobile && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <p className="text-sm text-gray-600 mt-1">Sélectionnez une application</p>
        </div>
      )}

      {/* Tab List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (isMobile) onTabChange(tab.id); // Auto-close on mobile if needed
              }}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg text-left
                transition-all duration-200
                ${activeTab === tab.id 
                  ? `${tab.color} shadow-sm border-l-4 ${tab.color.includes('blue') ? 'border-blue-500' : 
                     tab.color.includes('green') ? 'border-green-500' :
                     tab.color.includes('purple') ? 'border-purple-500' :
                     tab.color.includes('orange') ? 'border-orange-500' :
                     tab.color.includes('red') ? 'border-red-500' :
                     tab.color.includes('yellow') ? 'border-yellow-500' :
                     tab.color.includes('indigo') ? 'border-indigo-500' : 'border-teal-500'}`
                  : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg
                ${activeTab === tab.id 
                  ? tab.color.includes('blue') ? 'bg-blue-500' : 
                    tab.color.includes('green') ? 'bg-green-500' :
                    tab.color.includes('purple') ? 'bg-purple-500' :
                    tab.color.includes('orange') ? 'bg-orange-500' :
                    tab.color.includes('red') ? 'bg-red-500' :
                    tab.color.includes('yellow') ? 'bg-yellow-500' :
                    tab.color.includes('indigo') ? 'bg-indigo-500' : 'bg-teal-500'
                  : 'bg-gray-100 text-gray-600'
                } text-white
              `}>
                {tab.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm md:text-base">{tab.label}</div>
                <div className="text-xs text-gray-500 truncate">
                  {activeTab === tab.id ? 'Actif' : 'Cliquer pour ouvrir'}
                </div>
              </div>
              {activeTab === tab.id && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Station Service</div>
          <div>Système de gestion v1.0</div>
        </div>
      </div>
    </div>
  );
};

// Side Panel Component
const SidePanel = ({ isOpen, onClose, children, isMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        w-64 bg-white shadow-lg
        flex flex-col
        ${isMobile 
          ? `transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'border-r border-gray-200'
        }
      `}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
            aria-label="Fermer le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {children}
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
  onMenuToggle,
  activeTab 
}) => {
  const getTabIcon = (tabId) => {
    const icons = {
      pumps: '⛽',
      vendeurs: '👥',
      conditionnement: '📦',
      depots: '🏪',
      stock: '📊',
      usd: '💵',
      report: '📋',
      rapport: '🔥'
    };
    return icons[tabId] || '📱';
  };

  const getTabLabel = (tabId) => {
    const labels = {
      pumps: 'Pompes',
      vendeurs: 'Vendeurs',
      conditionnement: 'Conditionnement',
      depots: 'Dépôts',
      stock: 'Stock',
      usd: 'USD',
      report: 'Rapports',
      rapport: 'Gaz'
    };
    return labels[tabId] || 'App';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className=" py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu button and current app */}
            <div className="flex items-center space-x-3">
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
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">{getTabIcon(activeTab)}</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span>{date}</span>
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                      Shift {shift}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <ShiftManager shift={shift} />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleReinitialiserShift}
                  className="px-3 py-2 text-xs sm:text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Réinit. Shift
                </button>
                <button
                  onClick={handleReinitialiserJour}
                  className="px-3 py-2 text-xs sm:text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Réinit. Jour
                </button>
              </div>
            </div>
          </div>

          {/* Shift Manager for mobile */}
          <div className="mt-3 sm:hidden">
            <ShiftManager shift={shift} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex">
        {/* Side Panel for desktop - always visible */}
        <div className="hidden lg:block flex-shrink-0">
          <SidePanel isOpen={true} onClose={() => {}} isMobile={false}>
            <VerticalTabs activeTab={activeTab} onTabChange={() => {}} isMobile={false} />
          </SidePanel>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)] overflow-auto">
          <div className="">
              {children}         
          </div>
        </main>
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
    if (window.innerWidth < 1024) { // Close menu on mobile after selection
      setIsMenuOpen(false);
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'pumps':
        return (
          <div className="p-2 sm:p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pompes & Propane</h2>
                <span className="text-lg">⛽</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Gestion des pompes et du propane</p>
            </div>
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
          </div>
        );
      case 'vendeurs':
        return (
          <div className="p-2 sm:p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Vendeurs</h2>
                <span className="text-lg">👥</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Gérer les vendeurs</p>
            </div>
            <VendeursManager
              vendeurs={vendeurs}
              nouveauVendeur={nouveauVendeur}
              setNouveauVendeur={setNouveauVendeur}
              ajouterVendeur={ajouterVendeur}
              supprimerVendeur={supprimerVendeur}
              getNombreAffectations={getNombreAffectations}
            />
          </div>
        );
      case 'conditionnement':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Conditionnement</h2>
                <span className="text-lg">📦</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Gestion conditionnement</p>
            </div>
            <ConditionnementManager
              shift={shift}
              date={date}
              vendeurs={vendeurs}
              tousDepots={tousDepots}
              onConditionnementUpdate={setConditionnements}
            />
          </div>
        );
      case 'depots':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dépôts</h2>
                <span className="text-lg">🏪</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Gestion des dépôts</p>
            </div>
            <DepotsManager
              shift={shift}
              vendeurs={vendeurs}
              totauxVendeurs={totauxVendeursCourants}
              tousDepots={tousDepots}
              mettreAJourDepot={mettreAJourDepot}
              ajouterDepot={ajouterDepot}
              supprimerDepot={supprimerDepot}
            />
          </div>
        );
      case 'stock':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Restant</h2>
                <span className="text-lg">📊</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Voir le stock disponible</p>
            </div>
            <StockRestant
              date={date}
              shift={shift}
              toutesDonnees={toutesDonnees}
              propaneDonnees={propaneDonnees}
              pompes={pompes}
              prix={prix}
            />
          </div>
        );
      case 'usd':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes USD</h2>
                <span className="text-lg">💵</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Gestion ventes en dollars</p>
            </div>
            <USDManager
              shift={shift}
              usdVentes={ventesUSD}
              ajouterUSD={ajouterUSD}
              mettreAJourUSD={mettreAJourUSD}
              supprimerUSD={supprimerUSD}
              tauxUSD={tauxUSD}
            />
          </div>
        );
      case 'report':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports</h2>
                <span className="text-lg">📋</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Voir les rapports</p>
            </div>
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
          </div>
        );
      case 'rapport':
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapport Gaz</h2>
                <span className="text-lg">🔥</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Rapport journalier gaz</p>
            </div>
            <Rapport
              date={date}
              shift={shift}
              toutesDonnees={toutesDonnees}
            />
          </div>
        );
      default:
        return (
          <div className="p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tableau de bord</h2>
                <span className="text-lg">📱</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Sélectionnez une application</p>
            </div>
          </div>
        );
    }
  };

  // Contact Modal Component - Mobile Optimized
  const ContactModal = () => {
    if (!showContact) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Support Technique</h3>
            <button
              onClick={() => setShowContact(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto p-4">
            <div className="space-y-4">
              <p className="text-gray-600">
                Pour toute question technique ou problème rencontré
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a 
                      href="mailto:dev@example.com" 
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      dev@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">Téléphone</p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Informations importantes</h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-2">
                  <li>• Nom de la station</li>
                  <li>• Date et shift concerné</li>
                  <li>• Description détaillée</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <button
              onClick={() => setShowContact(false)}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-medium"
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
      {/* Mobile Side Panel */}
      <SidePanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isMobile={true}>
        <VerticalTabs activeTab={activeTab} onTabChange={handleTabChange} isMobile={true} />
      </SidePanel>

      {/* Main Layout */}
      <MainLayout
        date={date}
        shift={shift}
        setDate={setDate}
        setShift={setShift}
        handleReinitialiserShift={handleReinitialiserShift}
        handleReinitialiserJour={handleReinitialiserJour}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        activeTab={activeTab}
      >
        {renderActiveTabContent()}
      </MainLayout>

      {/* Mobile Footer */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              <div className="font-medium">Station Service</div>
              <div>v1.0 • {activeTab === 'pumps' ? '⛽' : activeTab === 'vendeurs' ? '👥' : '📱'}</div>
            </div>
            <button
              onClick={() => setShowContact(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {/* Desktop Footer */}
      <footer className="hidden lg:block border-t border-gray-200 bg-white py-4">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Système Station Service v1.0</span>
              <span className="mx-2">•</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <button
              onClick={() => setShowContact(true)}
              className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
            >
              Support Technique
            </button>
          </div>
        </div>
      </footer>

      {/* Floating App Switcher for mobile */}
      {!isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden fixed bottom-20 right-4 bg-white border border-gray-300 shadow-lg w-12 h-12 rounded-full flex items-center justify-center z-10"
          aria-label="Changer d'application"
        >
          <span className="text-xl">
            {activeTab === 'pumps' ? '⛽' : 
             activeTab === 'vendeurs' ? '👥' : 
             activeTab === 'conditionnement' ? '📦' :
             activeTab === 'depots' ? '🏪' :
             activeTab === 'stock' ? '📊' :
             activeTab === 'usd' ? '💵' :
             activeTab === 'report' ? '📋' : '🔥'}
          </span>
        </button>
      )}

      <ContactModal />
    </>
  );
};

export default SystemeStationService;