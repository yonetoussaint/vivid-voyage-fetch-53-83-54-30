
// Using reliable exchange rate APIs for live currency conversion
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
const FALLBACK_API_URL = 'https://api.fxratesapi.com/latest?base=USD';

// Our service fee adjustment (optional - can be removed if you want pure market rates)
const RATE_ADJUSTMENT = 1.0; // No adjustment for now, pure market rate

export interface ExchangeRateData {
  usdToHtg: number;
  originalRate: number;
  lastUpdated: Date;
  isLive: boolean;
}

export interface CurrencyRates {
  [key: string]: number;
}

export interface AllExchangeRates {
  rates: CurrencyRates;
  lastUpdated: Date;
  isLive: boolean;
}

// Cache the exchange rate data
let cachedRateData: ExchangeRateData | null = null;
let cachedAllRates: AllExchangeRates | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Get all currency exchange rates to HTG
 */
export const getAllExchangeRates = async (): Promise<AllExchangeRates> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedAllRates && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedAllRates;
  }
  
  try {
    // Try primary API first
    let response;
    let apiRates;
    
    try {
      response = await fetch(EXCHANGE_API_URL);
      const data = await response.json();
      apiRates = data.rates;
    } catch (error) {
      console.log('Primary API failed, trying fallback...');
      // Try fallback API
      response = await fetch(FALLBACK_API_URL);
      const data = await response.json();
      apiRates = data.rates;
    }
    
    if (!apiRates) {
      throw new Error('No rates received from API');
    }
    
    // Convert all rates to HTG (using USD as base)
    const htgRate = apiRates.HTG;
    if (!htgRate || isNaN(htgRate)) {
      throw new Error('Invalid HTG rate received from API');
    }
    
    // Calculate rates for other currencies to HTG
    const rates: CurrencyRates = {
      USD: htgRate * RATE_ADJUSTMENT,
      EUR: (htgRate / apiRates.EUR) * RATE_ADJUSTMENT,
      GBP: (htgRate / apiRates.GBP) * RATE_ADJUSTMENT,
      CAD: (htgRate / apiRates.CAD) * RATE_ADJUSTMENT,
      AUD: (htgRate / apiRates.AUD) * RATE_ADJUSTMENT,
      CHF: (htgRate / apiRates.CHF) * RATE_ADJUSTMENT,
      JPY: (htgRate / apiRates.JPY) * RATE_ADJUSTMENT
    };
    
    cachedAllRates = {
      rates,
      lastUpdated: new Date(),
      isLive: true
    };
    
    lastFetchTime = now;
    console.log('Live exchange rates fetched:', rates);
    return cachedAllRates;
    
  } catch (error) {
    console.error('Failed to fetch live exchange rates:', error);
    
    // If we can't get live rates, return cached rates or fallback
    if (cachedAllRates) {
      return {
        ...cachedAllRates,
        isLive: false
      };
    }
    
    // Final fallback rates
    const fallbackRates: CurrencyRates = {
      USD: 127.5,
      EUR: 144.8,
      GBP: 168.2,
      CAD: 97.3,
      AUD: 86.1,
      CHF: 147.9,
      JPY: 0.89
    };
    
    return {
      rates: fallbackRates,
      lastUpdated: new Date(),
      isLive: false
    };
  }
};

/**
 * Get the current USD to HTG exchange rate from live sources
 */
export const getExchangeRate = async (): Promise<ExchangeRateData> => {
  const allRates = await getAllExchangeRates();
  
  return {
    usdToHtg: allRates.rates.USD,
    originalRate: allRates.rates.USD,
    lastUpdated: allRates.lastUpdated,
    isLive: allRates.isLive
  };
};

/**
 * Convert USD to HTG using live exchange rate
 */
export const convertUsdToHtg = async (usdAmount: number): Promise<number> => {
  const { usdToHtg } = await getExchangeRate();
  return usdAmount * usdToHtg;
};
