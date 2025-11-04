// hooks/useStickyTabs.ts
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface UseStickyTabsProps {
  headerHeight: number;
  isEnabled?: boolean;
  stickImmediately?: boolean;
}

export function useStickyTabs({ 
  headerHeight, 
  isEnabled = true,
  stickImmediately = false 
}: UseStickyTabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const [isSticky, setIsSticky] = useState(stickImmediately);
  const [tabsHeight, setTabsHeight] = useState(0);

  // Measure tabs height
  useLayoutEffect(() => {
    const updateTabsHeight = () => {
      if (tabsRef.current) {
        setTabsHeight(tabsRef.current.offsetHeight || 0);
      }
    };

    updateTabsHeight();
    const resizeObserver = new ResizeObserver(updateTabsHeight);
    if (tabsRef.current) resizeObserver.observe(tabsRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Sticky behavior
  useEffect(() => {
    if (!isEnabled || stickImmediately) {
      setIsSticky(stickImmediately);
      return;
    }

    const tabsEl = tabsContainerRef.current;
    if (!tabsEl) return;

    let lastSticky = isSticky;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = tabsEl.getBoundingClientRect();
          const currentY = window.scrollY;
          const scrollingDown = currentY > lastScrollY;
          lastScrollY = currentY;

          const buffer = 4;
          const shouldBeSticky = rect.top <= headerHeight + buffer && scrollingDown;
          const shouldUnstick = rect.top > headerHeight + buffer && !scrollingDown;

          if (shouldBeSticky && !lastSticky) {
            setIsSticky(true);
            lastSticky = true;
          } else if (shouldUnstick && lastSticky) {
            setIsSticky(false);
            lastSticky = false;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight, isEnabled, stickImmediately, isSticky]);

  return {
    tabsContainerRef,
    tabsRef,
    isSticky,
    tabsHeight,
    setIsSticky
  };
}
