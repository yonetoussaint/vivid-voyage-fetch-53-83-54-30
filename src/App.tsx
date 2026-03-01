import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

import { RedirectAuthProvider } from "./context/RedirectAuthContext";
import { HomepageProvider } from "./context/HomepageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { RouteCacheProvider } from "./contexts/RouteCacheContext";
import { AuthOverlayProvider } from "./context/AuthOverlayContext";
import { ScreenOverlayProvider } from "./context/ScreenOverlayContext";
import { HeaderFilterProvider } from "./contexts/HeaderFilterContext";
import { AuthProvider } from "@/hooks/useAuth";

import { queryClient } from "./utils/queryClient";
import Routes from "./Routes"; // or whatever renders your pages

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProvider>
            <RouteCacheProvider>
              <Router>

                {/* 🔥 AUTH MUST WRAP EVERYTHING THAT USES useAuth */}
                <AuthProvider>

                  <RedirectAuthProvider>
                    <HomepageProvider>
                      <AuthOverlayProvider>
                        <ScreenOverlayProvider>
                          <HeaderFilterProvider>

                            <Routes />

                          </HeaderFilterProvider>
                        </ScreenOverlayProvider>
                      </AuthOverlayProvider>
                    </HomepageProvider>
                  </RedirectAuthProvider>

                </AuthProvider>

              </Router>
            </RouteCacheProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;