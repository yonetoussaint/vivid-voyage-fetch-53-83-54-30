import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = (enabled: boolean = true) => {
  const location = useLocation();
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    const saveScrollPosition = () => {
      const key = location.pathname + location.search;
      scrollPositions.current.set(key, window.scrollY);
    };

    const restoreScrollPosition = () => {
      const key = location.pathname + location.search;
      const savedPosition = scrollPositions.current.get(key);

      if (savedPosition !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
        });
      } else {
        // Scroll to top for new pages
        window.scrollTo(0, 0);
      }
    };

    // Save current position before navigation
    window.addEventListener('beforeunload', saveScrollPosition);

    // Restore position after navigation
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location, enabled]);
};