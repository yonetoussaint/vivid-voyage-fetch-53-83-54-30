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

// Import the new components
import MainLayout from '@/components/easy/MainLayout';
import VerticalTabs from '@/components/easy/VerticalTabs';
import SidePanel from '@/components/easy/SidePanel';
import ContactModal from '@/components/easy/ContactModal';

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
  activeTab={activeTab}
  onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
  onDateChange={(newDate) => setDate(newDate)}
  onShiftChange={(newShift) => setShift(newShift)}
  // Remove these props since they're no longer needed in header:
  // handleReinitialiserShift={handleReinitialiserShift}
  // handleReinitialiserJour={handleReinitialiserJour}
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

      <ContactModal showContact={showContact} setShowContact={setShowContact} />
    </>
  );
};

export default SystemeStationService;