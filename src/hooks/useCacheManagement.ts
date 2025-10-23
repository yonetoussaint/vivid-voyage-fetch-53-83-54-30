import { useRouteCache } from '../contexts/RouteCacheContext';
import { queryClient } from '../utils/queryClient';

export const useCacheManagement = () => {
  const { clearCache, removeFromCache, getCacheSize } = useRouteCache();

  const clearAllCache = () => {
    // Clear route cache
    clearCache();

    // Clear React Query cache
    queryClient.clear();

    // Clear any localStorage cache if needed
    localStorage.removeItem('route-cache-keys');

    console.log('All cache cleared');
  };

  const clearRouteCache = () => {
    clearCache();
  };

  const clearQueryCache = () => {
    queryClient.clear();
  };

  const getCacheInfo = () => {
    return {
      routeCacheSize: getCacheSize(),
      queryCacheSize: queryClient.getQueryCache().getAll().length,
    };
  };

  const precacheRoute = (key: string, component: React.ReactNode) => {
    const { cache } = useRouteCache();
    cache.current.set(key, {
      component,
      timestamp: Date.now(),
    });
  };

  return {
    clearAllCache,
    clearRouteCache,
    clearQueryCache,
    getCacheInfo,
    removeFromCache,
    precacheRoute,
  };
};