import React, { useState } from 'react';
import Navbar from '@/components/easy/Navbar';
import ShiftManager from '@/components/easy/ShiftManager';
import ConditionnementManager from '@/components/easy/ConditionnementManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import { useStationData } from '@/hooks/useStationData';

// App grid item component
const AppCard = ({ icon, title, description, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50 border-2 border-blue-200 shadow-lg scale-[1.02]' 
          : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50'
      }`}
    >
      <div className={`p-3 rounded-full mb-4 ${
        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
      }`}>
        {icon}
      </div>
      <h3 className={`font-semibold text-lg mb-2 ${
        isActive ? 'text-blue-800' : 'text-gray-800'
      }`}>
        {title}
      </h3>
      <p className={`text-sm text-center ${
        isActive ? 'text-blue-600' : 'text-gray-500'
      }`}>
        {description}
      </p>
      {isActive && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [conditionnements, setConditionnements] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeView, setActiveView] = useState('pumps');
  const [pompeEtendue, setPompeEtendue] = useState('P1');
  const [showContact, setShowContact] = useState(false);

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

  // Define all apps with their metadata
  const apps = [
    {
      id: 'pumps',
      title: 'Pompes & Propane',
      description: 'Gestion des pompes et du propane',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'vendeurs',
      title: 'Vendeurs',
      description: 'Gérer les vendeurs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.83-.672-1.388-1.242-1.807-1.707" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'conditionnement',
      title: 'Conditionnement',
      description: 'Gestion conditionnement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'depots',
      title: 'Dépôts',
      description: 'Gestion des dépôts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'orange'
    },
    {
      id: 'stock',
      title: 'Stock Restant',
      description: 'Voir le stock disponible',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'red'
    },
    {
      id: 'usd',
      title: 'Ventes USD',
      description: 'Gestion ventes en dollars',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow'
    },
    {
      id: 'report',
      title: 'Rapports',
      description: 'Voir les rapports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'indigo'
    }
  ];

  // Handle pump/propane tab selection within the pumps app
  const handlePompeSelection = (selection) => {
    setPompeEtendue(selection);
  };

  // Fonctions de réinitialisation
  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    if (activeView === 'pumps') {
      setPompeEtendue('P1');
    }
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setPompeEtendue('P1');
  };

  // Rendu conditionnel selon la vue active
  const renderView = () => {
    switch (activeView) {
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
      case 'pumps':
      default:
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
            // Pass propane data
            propaneDonnees={propaneDonnees}
            mettreAJourPropane={mettreAJourPropane}
            prixPropane={prixPropane}
            showPropane={true}
            tousDepots={tousDepots}
          />
        );
    }
  };

  // Contact Modal Component (unchanged)
  const ContactModal = () => {
    if (!showContact) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Support Technique</h3>
            <button
              onClick={() => setShowContact(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
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

          <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => setShowContact(false)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Navbar (removed tabs) */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Station Service</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{date}</span>
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    Shift {shift}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReinitialiserShift}
                className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg transition-colors"
              >
                Réinitialiser Shift
              </button>
              <button
                onClick={handleReinitialiserJour}
                className="px-4 py-2 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors"
              >
                Réinitialiser Jour
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShiftManager shift={shift} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tableau de Bord</h2>
          <p className="text-gray-600">Sélectionnez une application pour commencer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              icon={app.icon}
              title={app.title}
              description={app.description}
              isActive={activeView === app.id}
              onClick={() => setActiveView(app.id)}
            />
          ))}
        </div>

        {/* Current App View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {apps.find(app => app.id === activeView)?.icon}
                <h3 className="text-xl font-semibold text-gray-900">
                  {apps.find(app => app.id === activeView)?.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveView(null)}
                className="text-sm text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
              >
                Minimiser
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {renderView()}
          </div>
        </div>
      </div>

      {/* Footer (unchanged) */}
      <footer className="mt-12 pt-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-colors"
        aria-label="Contact Support"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      {/* Contact Modal */}
      <ContactModal />
    </div>
  );
};

export default SystemeStationService;