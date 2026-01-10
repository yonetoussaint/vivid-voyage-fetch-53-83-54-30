import React, { useState, useEffect } from 'react';
import { Loader2, Download, Check, AlertCircle, Brain } from 'lucide-react';

const AIModelLoader = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initialisation...');
  const [models, setModels] = useState([
    { id: 'qa', name: 'Modèle Question-Réponse', size: '15MB', loaded: false },
    { id: 'summarization', name: 'Modèle Résumé', size: '8MB', loaded: false },
    { id: 'ner', name: 'Modèle Reconnaissance', size: '12MB', loaded: false }
  ]);

  useEffect(() => {
    // Simulate progressive loading
    const intervals = [
      setTimeout(() => {
        setModels(prev => prev.map(m => m.id === 'qa' ? { ...m, loaded: true } : m));
        setStatus('Chargement du modèle QA...');
        setProgress(35);
      }, 800),
      
      setTimeout(() => {
        setModels(prev => prev.map(m => m.id === 'summarization' ? { ...m, loaded: true } : m));
        setStatus('Chargement du modèle de résumé...');
        setProgress(65);
      }, 1800),
      
      setTimeout(() => {
        setModels(prev => prev.map(m => m.id === 'ner' ? { ...m, loaded: true } : m));
        setStatus('Finalisation...');
        setProgress(85);
      }, 2800),
      
      setTimeout(() => {
        setProgress(100);
        setStatus('Prêt!');
        setTimeout(() => onLoaded(), 500);
      }, 3800)
    ];

    return () => intervals.forEach(clearTimeout);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 relative">
            <div className="absolute inset-0 animate-pulse bg-purple-500 rounded-full opacity-20"></div>
            <Brain size={36} className="text-white relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Chargement de l'IA Locale</h2>
          <p className="text-gray-400">
            Téléchargement des modèles Transformers.js
          </p>
          <div className="mt-2 text-sm text-blue-400">
            <div className="flex items-center justify-center gap-2">
              <Download size={14} />
              <span>100% Local • Aucun API Key • Données Privées</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            ~35MB total • Premier chargement uniquement
          </div>
        </div>

        {/* Models List */}
        <div className="space-y-3 mb-8">
          {models.map((model) => (
            <div key={model.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-3">
                {model.loaded ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-full flex items-center justify-center border border-green-800/30">
                    <Check size={18} className="text-green-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                    <Loader2 size={18} className="text-gray-400 animate-spin" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.size}</div>
                </div>
              </div>
              {model.loaded ? (
                <span className="text-xs bg-gradient-to-r from-green-900/30 to-green-800/20 text-green-400 px-3 py-1.5 rounded-full border border-green-800/30">
                  ✓ Chargé
                </span>
              ) : (
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-full border border-gray-700">
                  Chargement...
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Info & Tips */}
        <div className="text-sm text-gray-400 space-y-3">
          <div className="flex items-start gap-2 p-3 bg-gray-800/30 rounded-lg">
            <AlertCircle size={16} className="mt-0.5 text-blue-400" />
            <div>
              <div className="font-medium text-gray-300 mb-1">Conseil de Performance</div>
              <p>Les modèles sont mis en cache localement. Les prochaines utilisations seront instantanées.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-gray-800/30 rounded">
              <div className="text-gray-300">Mémoire</div>
              <div className="text-white font-medium">~250MB</div>
            </div>
            <div className="text-center p-2 bg-gray-800/30 rounded">
              <div className="text-gray-300">Vitesse</div>
              <div className="text-white font-medium">Rapide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelLoader;