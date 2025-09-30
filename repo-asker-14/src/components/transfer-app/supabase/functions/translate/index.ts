
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language code mapping for Google Translate API
const languageMap: Record<string, string> = {
  'ht': 'ht', // Haitian Creole
  'fr': 'fr', // French
  'en': 'en', // English
  'es': 'es', // Spanish
  'pt': 'pt', // Portuguese
  'de': 'de', // German
  'it': 'it', // Italian
  'zh': 'zh', // Chinese
  'ja': 'ja', // Japanese
  'ko': 'ko', // Korean
  'ar': 'ar', // Arabic
  'ru': 'ru', // Russian
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await req.json();

    console.log('Translation request:', { text, targetLanguage, sourceLanguage });

    // Return original text if translating to the same language
    if (sourceLanguage === targetLanguage) {
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map language codes
    const targetLang = languageMap[targetLanguage] || targetLanguage;
    const sourceLang = languageMap[sourceLanguage] || sourceLanguage;

    // For demo purposes, I'll use a simple translation service
    // In production, you would use Google Translate API, DeepL, or similar
    const translatedText = await translateWithService(text, sourceLang, targetLang);

    return new Response(JSON.stringify({ translatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Translation failed',
      translatedText: '' // Fallback to empty string
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simple translation function - replace with actual translation service
async function translateWithService(text: string, sourceLang: string, targetLang: string): Promise<string> {
  // This is a placeholder implementation
  // In a real application, you would integrate with:
  // - Google Translate API
  // - DeepL API
  // - Azure Translator
  // - AWS Translate
  
  console.log(`Translating "${text}" from ${sourceLang} to ${targetLang}`);
  
  // For now, return the original text with a language indicator
  // This allows the system to work while you set up a real translation service
  return `[${targetLang.toUpperCase()}] ${text}`;
}
