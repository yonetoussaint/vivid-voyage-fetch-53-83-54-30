// components/easy/PureTransformersAI.js
import { pipeline, env } from '@xenova/transformers';

// Configure for optimal performance
env.allowLocalModels = true;
env.backends.onnx.wasm.numThreads = 2;
env.localModelPath = '/models/'; // Optional: Cache models locally

class PureTransformersAI {
  constructor() {
    this.models = {
      qa: null,        // Question Answering
      summarizer: null, // Text Summarization
      classifier: null, // Intent Classification
      ner: null         // Named Entity Recognition
    };
    this.isInitializing = false;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.isInitializing) return this.initializationPromise;
    
    this.isInitializing = true;
    this.initializationPromise = this._initializeModels();
    return this.initializationPromise;
  }

  async _initializeModels() {
    try {
      console.log('Loading AI models...');
      
      // Load a multilingual model for French support
      // Using a smaller model for faster loading
      const modelName = 'Xenova/distilbert-multilingual-nli-stsb-quora-ranking';
      
      // Load question-answering model (multilingual)
      this.models.qa = await pipeline(
        'question-answering',
        'Xenova/distilbert-base-multilingual-cased-distilled-squad',
        { 
          quantized: true,
          progress_callback: (progress) => {
            console.log(`QA model loading: ${(progress * 100).toFixed(1)}%`);
          }
        }
      );

      // Load summarization model
      this.models.summarizer = await pipeline(
        'summarization',
        'Xenova/t5-small',
        { quantized: true }
      );

      // Load NER (Named Entity Recognition) for extracting entities
      this.models.ner = await pipeline(
        'token-classification',
        'Xenova/bert-base-multilingual-cased-ner-hrl',
        { quantized: true }
      );

      console.log('All AI models loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading models:', error);
      
      // Try loading even lighter models if the first ones fail
      try {
        console.log('Trying alternative models...');
        
        // Try with the lightest available model
        this.models.qa = await pipeline(
          'question-answering',
          'Xenova/mobilebert-uncased-mnli',
          { quantized: true }
        );
        
        return true;
      } catch (fallbackError) {
        console.error('All model loading failed:', fallbackError);
        throw new Error('AI models failed to load. Please check internet connection.');
      }
    }
  }

  async extractEntities(text) {
    if (!this.models.ner) await this.initialize();
    
    try {
      const entities = await this.models.ner(text);
      return entities.reduce((acc, entity) => {
        if (entity.score > 0.8) { // High confidence
          acc.push({
            word: entity.word,
            entity: entity.entity,
            score: entity.score
          });
        }
        return acc;
      }, []);
    } catch (error) {
      console.error('Entity extraction failed:', error);
      return [];
    }
  }

  async createIntelligentContext(contextData) {
    const {
      shift,
      currentPump,
      allData,
      currentData,
      vendeurs,
      pompes,
      prix,
      tauxUSD,
      totaux,
      depots,
      propaneData,
      showPropane
    } = contextData;

    // Create structured context
    const contextParts = [];

    // Current shift info
    contextParts.push(`SHIFT ACTUEL: ${shift}`);
    
    // Selected pump
    if (currentPump && currentPump !== 'propane') {
      contextParts.push(`POMPE SÉLECTIONNÉE: ${currentPump}`);
    }

    // Pump data
    if (currentData) {
      contextParts.push('DONNÉES DES POMPES:');
      Object.entries(currentData).forEach(([pump, data]) => {
        if (data && typeof data === 'object') {
          contextParts.push(`Pompe ${pump}:`);
          Object.entries(data).forEach(([gun, gunData]) => {
            if (gunData) {
              const volume = gunData.lectureFin - gunData.lectureDebut;
              const sales = volume * (prix?.[gunData.carburant] || 0);
              contextParts.push(`  ${gun}: ${volume}L, Ventes: ${sales.toFixed(2)} USD`);
            }
          });
        }
      });
    }

    // Sellers
    if (vendeurs && vendeurs.length > 0) {
      contextParts.push(`VENDEURS: ${vendeurs.join(', ')}`);
    }

    // Totals
    if (totaux && totaux[shift]) {
      contextParts.push('TOTAUX:');
      Object.entries(totaux[shift]).forEach(([key, value]) => {
        contextParts.push(`  ${key}: ${value}`);
      });
    }

    // Exchange rate
    if (tauxUSD) {
      contextParts.push(`TAUX USD: ${tauxUSD}`);
    }

    // Propane data
    if (propaneData && showPropane) {
      contextParts.push('PROPANE:');
      if (propaneData.debut) contextParts.push(`  Début: ${propaneData.debut}`);
      if (propaneData.fin) contextParts.push(`  Fin: ${propaneData.fin}`);
      if (propaneData.volume) {
        const propaneSales = propaneData.volume * (prixPropane || 0);
        contextParts.push(`  Ventes propane: ${propaneSales.toFixed(2)} USD`);
      }
    }

    // Deposits
    if (depots && Object.keys(depots).length > 0) {
      contextParts.push('DÉPÔTS:');
      Object.entries(depots).forEach(([vendeur, montant]) => {
        contextParts.push(`  ${vendeur}: ${montant} USD`);
      });
    }

    return contextParts.join('\n');
  }

  async answerQuestion(question, contextData) {
    try {
      // Ensure models are loaded
      await this.initialize();
      
      // Create intelligent context
      const context = await this.createIntelligentContext(contextData);
      
      console.log('Question:', question);
      console.log('Context length:', context.length);
      
      // If context is too long, summarize it
      let finalContext = context;
      if (context.length > 1000) {
        try {
          const summary = await this.models.summarizer(context, {
            max_length: 800,
            min_length: 300,
            do_sample: false
          });
          finalContext = summary[0].summary_text;
          console.log('Context summarized');
        } catch (summarizeError) {
          console.log('Summarization failed, using full context');
        }
      }

      // Extract entities for better understanding
      const entities = await this.extractEntities(question);
      console.log('Extracted entities:', entities);

      // Prepare enhanced context with entity info
      const enhancedContext = entities.length > 0 
        ? `ENTITÉS DÉTECTÉES: ${entities.map(e => `${e.word} (${e.entity})`).join(', ')}\n\n${finalContext}`
        : finalContext;

      // Get answer from QA model
      const result = await this.models.qa({
        question: question,
        context: enhancedContext,
        topk: 3, // Get top 3 answers
        handle_impossible_answer: true
      });

      console.log('AI results:', result);

      // Choose the best answer
      let bestAnswer;
      if (Array.isArray(result)) {
        // Multiple answers returned
        bestAnswer = result[0]; // Highest confidence
      } else {
        // Single answer
        bestAnswer = result;
      }

      // If answer is from impossible_answer, generate a helpful response
      if (bestAnswer.answer === '' || bestAnswer.score < 0.1) {
        // Use summarizer to generate response based on context
        const generatedResponse = await this.generateResponseFromContext(question, finalContext);
        return generatedResponse;
      }

      // Format the answer nicely
      return this.formatAnswer(bestAnswer.answer, bestAnswer.score);

    } catch (error) {
      console.error('Pure Transformers AI error:', error);
      // Even in pure mode, we need some response
      return this.generateTechnicalResponse(question, error);
    }
  }

  async generateResponseFromContext(question, context) {
    try {
      // Use the summarizer creatively to generate a response
      const prompt = `Question: ${question}\n\nBasé sur ce contexte:\n${context}\n\nRéponse:`;
      
      const response = await this.models.summarizer(prompt, {
        max_length: 150,
        min_length: 50,
        do_sample: true,
        temperature: 0.7
      });

      return response[0].summary_text;
    } catch (error) {
      console.error('Response generation failed:', error);
      return "Je peux traiter votre question. Veuillez formuler une question spécifique sur les données de la station-service.";
    }
  }

  formatAnswer(answer, confidence) {
    // Clean up the answer
    let formatted = answer.trim();
    
    // Capitalize first letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    
    // Add confidence indicator (optional)
    if (confidence < 0.5) {
      formatted += " (Confiance moyenne - vérifiez avec les données originales)";
    }
    
    return formatted;
  }

  generateTechnicalResponse(question, error) {
    // Provide a technical but helpful response
    return `Question reçue: "${question}"
    
Je suis en cours d'initialisation des modèles d'IA locaux. Cela peut prendre quelques secondes lors du premier chargement.

Veuillez:
1. Vérifier votre connexion internet (nécessaire pour le premier chargement)
2. Réessayer dans 10 secondes
3. Formuler votre question en français

Erreur technique: ${error.message}`;
  }

  // Helper methods for specific queries
  async analyzeSalesTrends(contextData) {
    const context = await this.createIntelligentContext(contextData);
    const question = "Quelles sont les tendances des ventes? Quels carburants se vendent le mieux?";
    
    return this.answerQuestion(question, contextData);
  }

  async predictNextShift(contextData) {
    const context = await this.createIntelligentContext(contextData);
    const question = "Prédire les ventes pour le prochain shift basé sur les données actuelles";
    
    return this.answerQuestion(question, contextData);
  }

  async findAnomalies(contextData) {
    const context = await this.createIntelligentContext(contextData);
    const question = "Y a-t-il des anomalies ou des valeurs inhabituelles dans les données?";
    
    return this.answerQuestion(question, contextData);
  }
}

// Singleton instance
let aiInstance = null;

export const getPureAI = () => {
  if (!aiInstance) {
    aiInstance = new PureTransformersAI();
  }
  return aiInstance;
};