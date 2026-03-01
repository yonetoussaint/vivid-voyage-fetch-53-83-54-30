import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "@/context/RedirectAuthContext";
import { HomepageProvider } from "@/context/HomepageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { RouteCacheProvider } from "@/contexts/RouteCacheContext";
import { AuthOverlayProvider } from "@/context/AuthOverlayContext";
import { ScreenOverlayProvider } from "@/context/ScreenOverlayContext";
import { HeaderFilterProvider } from "@/contexts/HeaderFilterContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Toasters } from "@/components/Toasters";
import { queryClient } from "@/utils/queryClient";

import MainLayout from "@/components/layout/MainLayout";
import { CategoryRoutes } from "@/routes/CategoryRoutes";
import { ContentRoutes } from "@/routes/ContentRoutes";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MiscRoutes } from "@/routes/MiscRoutes";
import AddReviewPage from "@/pages/AddReviewPage";
import MallPage from "@/pages/MallPage";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
import GasStationSystem from "@/pages/EasyPlus";
import GitHub from "@/pages/GitHub";
import ProfilePage from "@/pages/ProfilePage";
import Portfolio from "@/pages/Portfolio";
import ProductDetail from "@/pages/ProductDetail";
import Calculator from "@/pages/Calculator";
import Index from "@/pages/Index";
import ReviewsPage from "@/components/product/ReviewsPage";
import AuthCallback from "@/pages/AuthCallback";
import VendorPostComments from "@/components/home/VendorPostComments";
import Daily from "@/pages/Daily";
import "@/App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProvider>
            <RouteCacheProvider>
              <Router>
                <RedirectAuthProvider>
                  <HomepageProvider>
                    {/* ONLY AuthProvider wraps the routes directly */}
                    <AuthProvider>
                      <div className="App min-h-screen h-full bg-background text-foreground flex flex-col">
                        <Routes>
                          {/* Public routes that don't need MainLayout */}
                          <Route path="auth/callback" element={<AuthCallback />} />
                          <Route path="/product/:productId/add-review" element={<AddReviewPage />} />

                          <Route
                            path="auth/error"
                            element={
                              <div className="min-h-screen bg-white flex items-center justify-center p-4">
                                <div className="text-center">
                                  <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
                                  <p className="text-gray-600 mb-4">There was a problem signing in with Google.</p>
                                  <button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                  >
                                    Go to Homepage
                                  </button>
                                </div>
                              </div>
                            }
                          />

                          <Route path="comments" element={<VendorPostComments />} />
                          <Route path="product/:id/:tab" element={<ProductDetail />} />
                          <Route path="portfolio" element={<Portfolio />} />
                          <Route path="product/:id" element={<Navigate to="overview" replace />} />
                          <Route path="calculator" element={<Calculator />} />
                          <Route path="reviews/:reviewId" element={<ReviewsPage />} />
                          <Route path="reviews" element={<ReviewsPage />} />
                          <Route path="easy" element={<GasStationSystem />} />
                          <Route path="github" element={<GitHub />} />

                          {/* All routes that need MainLayout */}
                          <Route path="/" element={<MainLayout />}>
                            <Route index element={<Index />} />
                            <Route path="for-you" element={<Index />} />
                            <Route path="wallet" element={<Wallet />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="profile/*" element={<ProfilePage />} />
                            <Route path="daily" element={<Daily />} />
                            {CategoryRoutes()}
                            {ContentRoutes()}
                            {AuthRoutes()}
                            {MiscRoutes()}
                            <Route path="mall" element={<MallPage />} />
                          </Route>
                        </Routes>
                        <Toasters />
                      </div>
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

export default App;