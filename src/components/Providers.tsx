// components/Providers.tsx
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "../context/RedirectAuthContext";
import { HomepageProvider } from "../context/HomepageContext";
import { CurrencyProvider } from "../contexts/CurrencyContext";
import { RouteCacheProvider } from "../contexts/RouteCacheContext";
import { AuthOverlayProvider } from "../context/AuthOverlayContext";
import { ScreenOverlayProvider } from "../context/ScreenOverlayContext";
import { AuthProvider } from "../contexts/auth/AuthContext";
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
              <RedirectAuthProvider>
                <HomepageProvider>
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
            </RouteCacheProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}