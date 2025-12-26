import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function SignInBanner() {
  const { user, setIsAuthOverlayOpen } = useAuth();
  const [hasStickyCheckout, setHasStickyCheckout] = useState(false);

  // Check if StickyCheckoutBar is present on the page
  useEffect(() => {
    const checkForStickyCheckout = () => {
      // Look for StickyCheckoutBar more specifically
      const stickyElements = document.querySelectorAll('[class*="z-[45]"], [class*="z-40"]');
      const hasCheckoutBar = Array.from(stickyElements).some(el => {
        const classList = el.classList.toString();
        return (
          classList.includes('bottom-0') && 
          classList.includes('fixed') &&
          (classList.includes('z-[45]') || (classList.includes('z-40') && classList.includes('shadow-lg')))
        );
      });
      setHasStickyCheckout(hasCheckoutBar);
    };

    // Initial check
    checkForStickyCheckout();

    // Set up observer to watch for DOM changes
    const observer = new MutationObserver(checkForStickyCheckout);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Don't show banner if user is logged in
  if (user) {
    return null;
  }

  const handleSignInClick = () => {
    setIsAuthOverlayOpen(true);
  };

  // Dynamic positioning based on whether StickyCheckoutBar is present
  const bottomPosition = hasStickyCheckout ? 'bottom-0' : 'bottom-12';
  const zIndex = hasStickyCheckout ? 'z-50' : 'z-40';

  return (
    <div className={`fixed ${bottomPosition} left-0 right-0 ${zIndex} bg-black/50 backdrop-blur-sm py-1.5 px-2 flex items-center justify-between`}>
      <div className="text-white text-xs font-medium">Sign in to explore more</div>
      <Button 
        onClick={handleSignInClick}
        size="sm" 
        className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold px-3 py-0.5 h-6 rounded-none border-0 shadow-none"
      >
        <span className="text-xs font-bold">LOGIN NOW</span>
      </Button>
    </div>
  );
}