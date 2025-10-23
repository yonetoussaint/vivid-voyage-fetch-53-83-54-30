import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface CachedRoute {
  component: ReactNode;
  timestamp: number;
  scrollPosition?: number;
}

interface RouteCacheContextType {
  cache: React.MutableRefObject<Map<string, CachedRoute>>;
  clearCache: () => void;
  removeFromCache: (key: string) => void;
  getCacheSize: () => number;
}

const RouteCacheContext = createContext<RouteCacheContextType | undefined>(undefined);

export const RouteCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cache = useRef(new Map<string, CachedRoute>());

  // Maximum cache size to prevent memory issues
  const MAX_CACHE_SIZE = 50;

  const clearCache = () => {
    cache.current.clear();
    console.log('Route cache cleared');
  };

  const removeFromCache = (key: string) => {
    cache.current.delete(key);
  };

  const getCacheSize = () => {
    return cache.current.size;
  };

  // Clean up old cache entries periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      cache.current.forEach((value, key) => {
        if (now - value.timestamp > oneHour) {
          cache.current.delete(key);
        }
      });

      // If cache is too large, remove oldest entries
      if (cache.current.size > MAX_CACHE_SIZE) {
        const entries = Array.from(cache.current.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.3)); // Remove 30% of oldest
        toRemove.forEach(([key]) => cache.current.delete(key));
      }
    }, 5 * 60 * 1000); // Clean every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const value: RouteCacheContextType = {
    cache,
    clearCache,
    removeFromCache,
    getCacheSize,
  };

  return (
    <RouteCacheContext.Provider value={value}>
      {children}
    </RouteCacheContext.Provider>
  );
};

export const useRouteCache = () => {
  const context = useContext(RouteCacheContext);
  if (context === undefined) {
    throw new Error('useRouteCache must be used within a RouteCacheProvider');
  }
  return context;
};