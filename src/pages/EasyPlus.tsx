import React, { useState } from 'react';
import Navbar from '@/components/easy/Navbar';
import ShiftManager from '@/components/easy/ShiftManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import { useStationData } from '@/hooks/useStationData';

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
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

  // Fonction pour changer de vue
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'pumps') {
      setPompeEtendue('P1');
    }
  };

  // Handle pump/propane tab selection
  const handlePompeSelection = (selection) => {
    setActiveView('pumps'); // Always stay in pumps view
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
    setActiveView('pumps');
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

  // Contact Modal Component
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
      <Navbar
        date={date}
        setDate={setDate}
        shift={shift}
        setShift={setShift}
        activeView={activeView}
        onViewChange={handleViewChange}
        onResetShift={handleReinitialiserShift}
        onResetDay={handleReinitialiserJour}
      />

      <ShiftManager shift={shift} />

      <div className="p-2 max-w-2xl mx-auto">
        {renderView()}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4">
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