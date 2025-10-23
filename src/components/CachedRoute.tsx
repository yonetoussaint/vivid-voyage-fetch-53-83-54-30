import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useRouteCache } from '../contexts/RouteCacheContext';

interface CachedRouteProps {
  children: React.ReactNode;
  cacheKey?: string;
  shouldCache?: boolean;
  maxAge?: number; // in milliseconds
}

const CachedRoute: React.FC<CachedRouteProps> = ({ 
  children, 
  cacheKey, 
  shouldCache = true,
  maxAge = 30 * 60 * 1000 // 30 minutes default
}) => {
  const location = useLocation();
  const { cache } = useRouteCache();
  const componentRef = useRef<HTMLDivElement>(null);

  const key = cacheKey || `${location.pathname}${location.search}${location.hash}`;

  // Save scroll position before caching
  const saveScrollPosition = () => {
    if (componentRef.current) {
      const scrollPosition = componentRef.current.scrollTop;
      const cached = cache.current.get(key);
      if (cached) {
        cache.current.set(key, {
          ...cached,
          scrollPosition,
        });
      }
    }
  };

  // Restore scroll position when loading from cache
  const restoreScrollPosition = (scrollPosition?: number) => {
    if (scrollPosition && componentRef.current) {
      requestAnimationFrame(() => {
        componentRef.current!.scrollTop = scrollPosition;
      });
    }
  };

  useEffect(() => {
    // Save scroll position when leaving
    return () => {
      if (shouldCache) {
        saveScrollPosition();
      }
    };
  }, [key, shouldCache]);

  // Check if we have a valid cached component
  if (shouldCache && cache.current.has(key)) {
    const cached = cache.current.get(key)!;
    const isExpired = Date.now() - cached.timestamp > maxAge;

    if (!isExpired) {
      console.log(`Loading from cache: ${key}`);
      restoreScrollPosition(cached.scrollPosition);
      return <div ref={componentRef}>{cached.component}</div>;
    } else {
      // Remove expired cache
      cache.current.delete(key);
    }
  }

  // Cache the component if needed
  if (shouldCache) {
    cache.current.set(key, {
      component: children,
      timestamp: Date.now(),
    });
    console.log(`Cached route: ${key}, Total cached: ${cache.current.size}`);
  }

  return <div ref={componentRef}>{children}</div>;
};

export default CachedRoute;