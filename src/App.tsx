// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "./context/RedirectAuthContext";
import { HomepageProvider } from "./context/HomepageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { RouteCacheProvider } from "./contexts/RouteCacheContext";
import { AuthOverlayProvider } from "./context/AuthOverlayContext";
import { ScreenOverlayProvider } from "./context/ScreenOverlayContext";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { HeaderFilterProvider } from "./contexts/HeaderFilterContext";
import { queryClient } from "./utils/queryClient";
import MainLayout from "./components/layout/MainLayout";
import { HomepageRoutes } from "./routes/HomepageRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { CategoryRoutes } from "./routes/CategoryRoutes";
import { ContentRoutes } from "./routes/ContentRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { AdminSellerRoutes } from "./routes/AdminSellerRoutes";
import { ProductEditRoutes } from "./routes/ProductEditRoutes";
import { PaymentRoutes } from "./routes/PaymentRoutes";
import CachedRoute from "./components/CachedRoute";
import SearchPage from "./pages/SearchPage";
import NetflixPage from "./pages/NetflixPage";
import ComponentTestPage from "./pages/ComponentTestPage";
import NotFound from "./pages/NotFound";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import AuthPage from "./pages/AuthPage";
import ForYou from "./pages/ForYou";
import AuthCallback from "./pages/AuthCallback";
import AuthErrorPage from "./pages/AuthErrorPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AdminPage from "./pages/AdminPage";
import { Toasters } from "./components/Toasters";
import "./App.css";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProvider>
            <RouteCacheProvider>
              <Router>
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
              </Router>
            </RouteCacheProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AuthRoutes() {
  return (
    <>
      <Route path="auth" element={
        <CachedRoute shouldCache={false}>
          <SimpleAuthPage />
        </CachedRoute>
      } />
      <Route path="signin" element={
        <CachedRoute shouldCache={false}>
          <AuthPage />
        </CachedRoute>
      } />
      <Route path="signup" element={
        <CachedRoute shouldCache={false}>
          <SimpleAuthPage />
        </CachedRoute>
      } />
      <Route path="auth/callback" element={
        <CachedRoute>
          <AuthCallback />
        </CachedRoute>
      } />
      <Route path="auth/error" element={
        <CachedRoute>
          <AuthErrorPage />
        </CachedRoute>
      } />
      {/* Add these new routes for OAuth requirements */}
      <Route path="privacy" element={
        <CachedRoute>
          <PrivacyPolicy />
        </CachedRoute>
      } />
      <Route path="terms" element={
        <CachedRoute>
          <TermsOfService />
        </CachedRoute>
      } />
    </>
  );
}

function MiscRoutes() {
  return (
    <>
      <Route path="search" element={
        <CachedRoute cacheKey="search-page">
          <SearchPage />
        </CachedRoute>
      } />
      <Route path="netflix" element={
        <CachedRoute>
          <NetflixPage />
        </CachedRoute>
      } />
      <Route path="component-test" element={
        <CachedRoute>
          <ComponentTestPage />
        </CachedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Call the route functions to get Route elements */}
        {HomepageRoutes()}
        {ProductRoutes()}
        {CategoryRoutes()}
        {ContentRoutes()}
        {UserRoutes()}
        {AuthRoutes()}
        {AdminSellerRoutes()}
        {ProductEditRoutes()}
        {PaymentRoutes()}
        {MiscRoutes()}

        {/* Add Admin Route */}
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Providers>
      <div className="App min-h-screen h-full bg-background text-foreground flex flex-col">
        <AppRoutes />
        <Toasters />
      </div>
    </Providers>
  );
}

export default App;