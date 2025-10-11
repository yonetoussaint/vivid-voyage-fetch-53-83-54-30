// hooks/useBottomNavHeight.ts
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const useBottomNavHeight = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pathname = location.pathname;

  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  useEffect(() => {
    // Conditions when bottom nav should be visible (same as in MainLayout)
    const shouldShowBottomNav = isMobile && (
      pathname === '/for-you' || 
      pathname === '/' ||
      (pathname === '/reels' && !location.search.includes('video=')) || 
      pathname === '/posts' || 
      pathname === '/messages' || 
      pathname === '/more-menu' || 
      pathname === '/profile' || 
      pathname.startsWith('/profile/') ||
      pathname === '/videos' || 
      pathname === '/notifications' || 
      pathname === '/bookmarks' || 
      pathname === '/friends' || 
      pathname === '/shopping' || 
      pathname === '/settings' ||
      pathname === '/wallet' ||
      pathname === '/explore' ||
      pathname === '/wishlist' ||
      pathname === '/cart' ||
      pathname === '/addresses' ||
      pathname === '/help' ||
      pathname === '/categories/electronics' ||
      pathname === '/categories/home-living' ||
      pathname === '/categories/fashion' ||
      pathname === '/categories/entertainment' ||
      pathname === '/categories/kids-hobbies' ||
      pathname === '/categories/sports-outdoors' ||
      pathname === '/categories/automotive' ||
      pathname === '/categories/women' ||
      pathname === '/categories/men' ||
      pathname === '/categories/books'
    );

    if (!shouldShowBottomNav) {
      setBottomNavHeight(0);
      return;
    }

    // Measure the actual bottom nav height from the DOM
    const measureHeight = () => {
      // Use a slight delay to ensure DOM is updated
      setTimeout(() => {
        const bottomNav = document.querySelector('[data-bottom-nav]') || 
                         document.querySelector('nav[class*="bottom"]') ||
                         document.querySelector('.index-bottom-nav'); // Add your actual class/selector

        if (bottomNav) {
          const height = bottomNav.getBoundingClientRect().height;
          setBottomNavHeight(height);
        } else {
          // Fallback to 48px if nav not found yet
          setBottomNavHeight(48);
        }
      }, 0);
    };

    measureHeight();

    // Re-measure on window resize
    window.addEventListener('resize', measureHeight);

    // Re-measure when route changes (in case nav animates in)
    const timer = setTimeout(measureHeight, 100);

    return () => {
      window.removeEventListener('resize', measureHeight);
      clearTimeout(timer);
    };
  }, [isMobile, pathname, location.search]);

  return { bottomNavHeight };
};