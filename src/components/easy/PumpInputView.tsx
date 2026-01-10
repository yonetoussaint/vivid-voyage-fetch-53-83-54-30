import React, { useState, useEffect } from 'react';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpSelector from '@/components/easy/PumpSelector';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';
import PropaneManager from '@/components/easy/PropaneManager';
import PureAIAssistant from '@/components/easy/PureAIAssistant';
import AIModelLoader from '@/components/easy/AIModelLoader';
import { Brain, Sparkles, Zap, BarChart3, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const PumpInputView = ({ 
  shift, 
  pompeEtendue, 
  setPompeEtendue, 
  pompes, 
  toutesDonnees, 
  vendeurs, 
  totaux, 
  tauxUSD, 
  mettreAJourLecture, 
  mettreAJourAffectationVendeur, 
  prix,
  tousDepots,
  showPropane,
  propaneDonnees,
  mettreAJourPropane,
  prixPropane
}) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showModelLoader, setShowModelLoader] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [quickAnalytics, setQuickAnalytics] = useState(null);
  
  const lecturesCourantes = toutesDonnees[shift];
  const propaneDonneesCourantes = propaneDonnees?.[shift] || { debut: '', fin: '' };
  const depotsActuels = tousDepots[shift] || {};

  // Calculate totals for current shift
  const calculateShiftTotals = () => {
    let totalVolume = 0;
    let totalSales = 0;
    let fuelTypes = {};
    
    if (lecturesCourantes) {
      Object.entries(lecturesCourantes).forEach(([pump, pumpData]) => {
        Object.entries(pumpData || {}).forEach(([gun, gunData]) => {
          if (gunData && gunData.lectureDebut !== undefined && gunData.lectureFin !== undefined) {
            const volume = gunData.lectureFin - gunData.lectureDebut;
            totalVolume += volume;
            
            const fuelPrice = prix?.[gunData.carburant] || 0;
            const sales = volume * fuelPrice;
            totalSales += sales;
            
            // Track fuel types
            if (gunData.carburant) {
              fuelTypes[gunData.carburant] = (fuelTypes[gunData.carburant] || 0) + volume;
            }
          }
        });
      });
    }
    
    // Add propane if available
    if (propaneDonneesCourantes && propaneDonneesCourantes.debut && propaneDonneesCourantes.fin) {
      const propaneVolume = propaneDonneesCourantes.fin - propaneDonneesCourantes.debut;
      totalVolume += propaneVolume;
      totalSales += propaneVolume * (prixPropane || 0);
      fuelTypes['propane'] = propaneVolume;
    }
    
    return { totalVolume, totalSales, fuelTypes };
  };

  // Prepare context for AI
  const aiContextData = {
    shift,
    currentPump: pompeEtendue,
    allData: toutesDonnees,
    currentData: lecturesCourantes,
    vendeurs,
    pompes,
    prix,
    tauxUSD,
    totaux,
    depots: depotsActuels,
    propaneData: propaneDonneesCourantes,
    prixPropane,
    showPropane,
    shiftTotals: calculateShiftTotals()
  };

  // Preload AI models when component mounts
  useEffect(() => {
    const preloadAI = async () => {
      // Check if models are already cached
      const modelsCached = localStorage.getItem('transformers_models_cached');
      
      if (!modelsCached) {
        setShowModelLoader(true);
        
        // Simulate model loading (in real app, this would load the models)
        setTimeout(() => {
          localStorage.setItem('transformers_models_cached', 'true');
          setShowModelLoader(false);
        }, 2000);
      }
    };
    
    preloadAI();
  }, []);

  // Generate quick analytics on data change
  useEffect(() => {
    const generateQuickAnalytics = () => {
      const { totalVolume, totalSales, fuelTypes } = calculateShiftTotals();
      
      // Find most active pump
      let mostActivePump = null;
      let maxVolume = 0;
      
      if (lecturesCourantes) {
        Object.entries(lecturesCourantes).forEach(([pump, pumpData]) => {
          let pumpVolume = 0;
          Object.entries(pumpData || {}).forEach(([gun, gunData]) => {
            if (gunData && gunData.lectureDebut !== undefined && gunData.lectureFin !== undefined) {
              pumpVolume += gunData.lectureFin - gunData.lectureDebut;
            }
          });
          
          if (pumpVolume > maxVolume) {
            maxVolume = pumpVolume;
            mostActivePump = pump;
          }
        });
      }
      
      // Find most sold fuel type
      let mostSoldFuel = null;
      let maxFuelVolume = 0;
      Object.entries(fuelTypes).forEach(([fuel, volume]) => {
        if (volume > maxFuelVolume) {
          maxFuelVolume = volume;
          mostSoldFuel = fuel;
        }
      });
      
      setQuickAnalytics({
        totalVolume: totalVolume.toFixed(2),
        totalSales: totalSales.toFixed(2),
        mostActivePump,
        mostSoldFuel,
        fuelTypes,
        pumpCount: Object.keys(lecturesCourantes || {}).length,
        activeGuns: Object.values(lecturesCourantes || {}).reduce((acc, pump) => 
          acc + Object.keys(pump || {}).length, 0
        )
      });
    };
    
    generateQuickAnalytics();
  }, [lecturesCourantes, propaneDonneesCourantes, shift]);

  // Function to get AI insights
  const getAIInsights = async () => {
    setIsAILoading(true);
    setShowAIInsights(true);
    
    try {
      // Simulate AI analysis (in real app, this would call the AI engine)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { totalVolume, totalSales, fuelTypes } = calculateShiftTotals();
      
      // Generate insights based on data
      const insights = {
        summary: `Shift ${shift} montre une activité ${totalVolume > 1000 ? 'élevée' : 'modérée'}.`,
        trends: Object.keys(fuelTypes).length > 1 
          ? `Multiple carburants vendus: ${Object.keys(fuelTypes).join(', ')}`
          : 'Ventes concentrées sur un seul type de carburant',
        recommendation: totalVolume > 0 
          ? 'Continuer la surveillance des pompes principales'
          : 'Vérifier les données de saisie',
        anomalies: totalVolume === 0 
          ? '⚠️ Aucune donnée de volume détectée' 
          : null,
        predictedNextShift: Math.round(totalSales * 1.1).toFixed(2) + ' USD'
      };
      
      setAiInsights(insights);
    } catch (error) {
      setAiInsights({
        summary: 'Impossible de générer des insights pour le moment.',
        error: error.message
      });
    } finally {
      setIsAILoading(false);
    }
  };

  // Initialize AI Assistant
  const initAIAssistant = () => {
    setShowAIAssistant(true);
  };

  return (
    <>
      <div className="space-y-3">
        {/* AI Assistant Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                  <Brain size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Intelligence Artificielle Locale</h2>
                <p className="text-sm text-gray-300">
                  Analysez vos données avec l'IA • 100% privé • Aucun coût
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={getAIInsights}
                disabled={isAILoading}
                className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isAILoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyse...
                  </>
                ) : (
                  <>
                    <BarChart3 size={18} />
                    Insights IA
                  </>
                )}
              </button>
              <button
                onClick={initAIAssistant}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
              >
                <Sparkles size={20} />
                Assistant IA
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          {quickAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Volume Total</span>
                </div>
                <div className="text-xl font-bold text-white">{quickAnalytics.totalVolume} L</div>
              </div>
              
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-green-400" />
                  <span className="text-sm text-gray-400">Ventes Total</span>
                </div>
                <div className="text-xl font-bold text-white">{quickAnalytics.totalSales} USD</div>
              </div>
              
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-400">Pompe Active</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {quickAnalytics.mostActivePump || 'N/A'}
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-purple-400" />
                  <span className="text-sm text-gray-400">Carburant Top</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {quickAnalytics.mostSoldFuel || 'N/A'}
                </div>
              </div>
            </div>
          )}
          
          {/* AI Insights Panel */}
          {showAIInsights && (
            <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-purple-400" />
                  <h3 className="font-bold text-white">Insights IA</h3>
                </div>
                <button 
                  onClick={() => setShowAIInsights(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {isAILoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                    <p className="text-gray-300">L'IA analyse vos données...</p>
                  </div>
                </div>
              ) : aiInsights ? (
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-900/20 to-transparent rounded-lg">
                    <p className="text-white">{aiInsights.summary}</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-purple-900/20 to-transparent rounded-lg">
                    <p className="text-white">{aiInsights.trends}</p>
                  </div>
                  
                  {aiInsights.recommendation && (
                    <div className="p-3 bg-gradient-to-r from-green-900/20 to-transparent rounded-lg">
                      <p className="text-white">💡 {aiInsights.recommendation}</p>
                    </div>
                  )}
                  
                  {aiInsights.anomalies && (
                    <div className="p-3 bg-gradient-to-r from-yellow-900/30 to-transparent rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-yellow-400" />
                        <p className="text-yellow-300">{aiInsights.anomalies}</p>
                      </div>
                    </div>
                  )}
                  
                  {aiInsights.predictedNextShift && (
                    <div className="p-3 bg-gradient-to-r from-indigo-900/20 to-transparent rounded-lg">
                      <p className="text-white">
                        📈 Prédiction prochain shift: {aiInsights.predictedNextShift}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">Cliquez sur "Insights IA" pour générer des analyses</p>
                </div>
              )}
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => initAIAssistant()}
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
            >
              <Sparkles size={14} />
              Comparer les shifts
            </button>
            <button
              onClick={() => initAIAssistant()}
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
            >
              <Brain size={14} />
              Détecter anomalies
            </button>
            <button
              onClick={() => initAIAssistant()}
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
            >
              <BarChart3 size={14} />
              Prévisions ventes
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          shift={shift}
          totaux={totaux}
          tauxUSD={tauxUSD}
        />

        {/* Pump Selector */}
        <PumpSelector 
          pompes={pompes}
          pompeEtendue={pompeEtendue}
          setPompeEtendue={setPompeEtendue}
          showPropane={showPropane}
        />

        {/* Render content based on selected tab */}
        {pompeEtendue === 'propane' ? (
          <>
            <PumpHeader
              pompe="Propane"
              shift={shift}
              isPropane={true}
              propaneData={propaneDonneesCourantes}
              prixPropane={prixPropane}
              vendeurs={vendeurs}
              vendeurDepots={depotsActuels}
              tauxUSD={tauxUSD}
              mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
              donneesPompe={{}}
              prix={prix}
            />

            <PropaneManager
              shift={shift}
              propaneDonnees={propaneDonneesCourantes}
              mettreAJourPropane={(field, value) => mettreAJourPropane(field, value, shift)}
              prixPropane={prixPropane}
            />
          </>
        ) : (
          Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
            if (pompe !== pompeEtendue) return null;

            return (
              <div key={pompe} className="space-y-3">
                <PumpHeader
                  pompe={pompe}
                  shift={shift}
                  donneesPompe={donneesPompe}
                  vendeurs={vendeurs}
                  mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
                  prix={prix}
                  vendeurDepots={depotsActuels}
                  tauxUSD={tauxUSD}
                />

                <PumpPistolets
                  pompe={pompe}
                  donneesPompe={donneesPompe}
                  mettreAJourLecture={mettreAJourLecture}
                  prix={prix}
                />
              </div>
            );
          })
        )}

        {/* AI Data Context Panel (Collapsible) */}
        <div className="mt-6">
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-blue-400" />
              <span className="text-white font-medium">Contexte des Données (Pour l'IA)</span>
            </div>
            {showAIInsights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showAIInsights && (
            <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Données Shift {shift}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pompes:</span>
                      <span className="text-white">{Object.keys(lecturesCourantes || {}).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pistolets Actifs:</span>
                      <span className="text-white">
                        {Object.values(lecturesCourantes || {}).reduce((acc, pump) => 
                          acc + Object.keys(pump || {}).length, 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Vendeurs:</span>
                      <span className="text-white">{vendeurs?.length || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Statistiques</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Volume Total:</span>
                      <span className="text-white">{quickAnalytics?.totalVolume || '0'} L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Ventes Total:</span>
                      <span className="text-white">{quickAnalytics?.totalSales || '0'} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Taux USD:</span>
                      <span className="text-white">{tauxUSD}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">L'IA peut analyser ces données en temps réel</span>
                  <button
                    onClick={initAIAssistant}
                    className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg transition"
                  >
                    Interroger l'IA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pure AI Assistant Modal */}
      {showAIAssistant && (
        <PureAIAssistant 
          contextData={aiContextData}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {/* AI Model Loader */}
      {showModelLoader && (
        <AIModelLoader 
          onLoaded={() => setShowModelLoader(false)}
        />
      )}

      {/* Floating AI Help Button */}
      <button
        onClick={initAIAssistant}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-110 z-40"
        title="Assistant IA"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping bg-purple-400 rounded-full opacity-20"></div>
          <Brain size={24} />
        </div>
      </button>
    </>
  );
};

export default PumpInputView;