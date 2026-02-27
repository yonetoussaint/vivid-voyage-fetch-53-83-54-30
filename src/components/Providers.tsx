// components/Providers.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "../context/RedirectAuthContext";
import { HomepageProvider } from "../context/HomepageContext";
import { CurrencyProvider } from "../contexts/CurrencyContext";
import { RouteCacheProvider } from "../contexts/RouteCacheContext";
import { AuthOverlayProvider } from "../context/AuthOverlayContext";
import { ScreenOverlayProvider } from "../context/ScreenOverlayContext";
import { AuthProvider } from "@/hooks/useAuth"; // Import your new auth provider (rename import)
import { HeaderFilterProvider } from '../contexts/HeaderFilterContext';
import { queryClient } from "../utils/queryClient";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProvider>
            <RouteCacheProvider>
              <Router>
                <RedirectAuthProvider>
                  <HomepageProvider>
                    {/* Use only your new AuthProvider */}
                    <AuthProvider>
                      <AuthOverlayProvider>
                        <ScreenOverlayProvider>
                          <HeaderFilterProvider>
                            {children}
                          </HeaderFilterProvider>
                        </ScreenOverlayProvider>
                      </AuthOverlayProvider>
                    </AuthProvider>
                  </HomepageProvider>
                </RedirectAuthProvider>
              </Router>
            </RouteCacheProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}