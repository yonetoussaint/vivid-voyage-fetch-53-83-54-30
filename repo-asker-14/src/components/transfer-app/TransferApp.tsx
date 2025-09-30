
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-sdk/contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";
import { useNativeCapabilities } from "./hooks/useNativeCapabilities";
import "./App.css";

const queryClient = new QueryClient();

function TransferApp({ children }: { children: React.ReactNode }) {
  const { isNative } = useNativeCapabilities();
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash screen has been shown before
    const hasShownSplash = localStorage.getItem('hasShownSplash');
    return !hasShownSplash;
  });

  useEffect(() => {
    if (showSplash) {
      // Hide splash screen after 4 seconds and mark as shown
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem('hasShownSplash', 'true');
      }, 4000);

      return () => clearTimeout(hideTimer);
    }
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <AuthProvider>
            <SplashScreen isVisible={showSplash} />
            <div 
              className={`App min-h-screen bg-background text-foreground transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
            >
              {children}
              <Toaster />
              <Sonner />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default TransferApp;

