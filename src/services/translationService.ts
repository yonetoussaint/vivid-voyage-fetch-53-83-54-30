

import { supabase } from '@/integrations/supabase/client';
import { authTranslations } from '@/translations/auth';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

class TranslationService {
  private cache = new Map<string, string>();
  
  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  // Helper function to find translation in static translations
  private findStaticTranslation(text: string, targetLanguage: string): string | null {
    const langTranslations = authTranslations[targetLanguage as keyof typeof authTranslations];
    if (!langTranslations) return null;

    // Common auth-related text mappings
    const textMappings: Record<string, string> = {
      'Continue with Google': 'continueWithGoogle',
      'Continue with Email': 'continueWithEmail', 
      'Continue with Phone Number': 'continueWithPhone',
      'Secure Authentication': 'secureAuth',
      'Terms of Service': 'termsOfService',
      'Privacy Policy': 'privacyPolicy',
      'and': 'and',
      'By proceeding, you confirm that you\'ve read and agree to our': 'byProceeding'
    };

    // Check if we have a direct mapping
    const mappingKey = textMappings[text];
    if (mappingKey && langTranslations.auth[mappingKey]) {
      return langTranslations.auth[mappingKey];
    }

    // For Haitian Creole, provide specific translations
    if (targetLanguage === 'ht') {
      const haitianTranslations: Record<string, string> = {
        'Continue with Google': 'Kontinye ak Google',
        'Continue with Email': 'Kontinye ak Email',
        'Continue with Phone Number': 'Kontinye ak Nimewo Telefòn',
        'Secure Authentication': 'Otantifikasyon Sekirite',
        'Terms of Service': 'Kondisyon Sèvis yo',
        'Privacy Policy': 'Règleman Konfidansyalite',
        'and': 'ak',
        'By proceeding, you confirm that you\'ve read and agree to our': 'Lè w kontinye, w konfime ke w li epi w dakò ak'
      };
      
      return haitianTranslations[text] || null;
    }

    // For French
    if (targetLanguage === 'fr') {
      const frenchTranslations: Record<string, string> = {
        'Continue with Google': 'Continuer avec Google',
        'Continue with Email': 'Continuer avec Email',
        'Continue with Phone Number': 'Continuer avec Numéro de Téléphone',
        'Secure Authentication': 'Authentification Sécurisée',
        'Terms of Service': 'Conditions de Service',
        'Privacy Policy': 'Politique de Confidentialité',
        'and': 'et',
        'By proceeding, you confirm that you\'ve read and agree to our': 'En continuant, vous confirmez avoir lu et accepté nos'
      };
      
      return frenchTranslations[text] || null;
    }

    // For Spanish
    if (targetLanguage === 'es') {
      const spanishTranslations: Record<string, string> = {
        'Continue with Google': 'Continuar con Google',
        'Continue with Email': 'Continuar con Email',
        'Continue with Phone Number': 'Continuar con Número de Teléfono',
        'Secure Authentication': 'Autenticación Segura',
        'Terms of Service': 'Términos de Servicio',
        'Privacy Policy': 'Política de Privacidad',
        'and': 'y',
        'By proceeding, you confirm that you\'ve read and agree to our': 'Al continuar, confirmas que has leído y aceptas nuestros'
      };
      
      return spanishTranslations[text] || null;
    }

    // For Portuguese
    if (targetLanguage === 'pt') {
      const portugueseTranslations: Record<string, string> = {
        'Continue with Google': 'Continuar com Google',
        'Continue with Email': 'Continuar com Email',
        'Continue with Phone Number': 'Continuar com Número de Telefone',
        'Secure Authentication': 'Autenticação Segura',
        'Terms of Service': 'Termos de Serviço',
        'Privacy Policy': 'Política de Privacidade',
        'and': 'e',
        'By proceeding, you confirm that you\'ve read and agree to our': 'Ao prosseguir, você confirma que leu e concorda com nossos'
      };
      
      return portugueseTranslations[text] || null;
    }

    return null;
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, targetLanguage, sourceLanguage = 'en' } = request;
    
    // Return original text if translating to the same language
    if (sourceLanguage === targetLanguage) {
      return { translatedText: text };
    }

    const cacheKey = this.getCacheKey(text, targetLanguage);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return { translatedText: this.cache.get(cacheKey)! };
    }

    // Try to find static translation first
    const staticTranslation = this.findStaticTranslation(text, targetLanguage);
    if (staticTranslation) {
      this.cache.set(cacheKey, staticTranslation);
      console.log('Static translation found:', { original: text, translated: staticTranslation });
      return { translatedText: staticTranslation };
    }

    try {
      console.log('Calling Supabase translation function with:', { text, targetLanguage, sourceLanguage });
      
      // Use Supabase client to invoke the edge function
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          targetLanguage,
          sourceLanguage
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const translatedText = data?.translatedText || text;
      
      // Only cache if it's not a placeholder translation
      if (!translatedText.startsWith(`[${targetLanguage.toUpperCase()}]`)) {
        this.cache.set(cacheKey, translatedText);
      }
      
      console.log('Translation successful:', { original: text, translated: translatedText });
      
      return { translatedText };
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text
      return { translatedText: text };
    }
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    const promises = texts.map(text => 
      this.translateText({ text, targetLanguage, sourceLanguage })
    );
    
    const results = await Promise.all(promises);
    return results.map(result => result.translatedText);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const translationService = new TranslationService();
