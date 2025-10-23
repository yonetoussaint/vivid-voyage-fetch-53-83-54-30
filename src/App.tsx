import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "./context/RedirectAuthContext";
import { HomepageProvider } from "./context/HomepageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { RouteCacheProvider } from "./contexts/RouteCacheContext";
import { AuthOverlayProvider } from "./context/AuthOverlayContext";
import { ScreenOverlayProvider } from "./context/ScreenOverlayContext";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { HeaderFilterProvider } from './contexts/HeaderFilterContext';
import CachedRoute from "./components/CachedRoute";
import { queryClient } from "./utils/queryClient";

// Import all your pages
import Index from "./pages/Index";
import ForYou from "./pages/ForYou";
import BooksHomepage from "./pages/BooksHomepage";
import ConditionalHomepage from "./components/layout/ConditionalHomepage";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import SingleProductDetail from "./pages/SingleProductDetail";
import ProductDescriptionPage from "./pages/ProductDescriptionPage";
import ProductCheckout from "./pages/ProductCheckout";
import Videos from "./pages/Videos";
import Reels from "./pages/Reels";
import Trending from "./pages/Trending";
import Wallet from "./pages/Wallet";
import Messages from "./pages/Messages";
import ConversationDetail from "./pages/ConversationDetail";
import ProfilePage from "./pages/ProfilePage";
import MoreMenu from "./pages/MoreMenu";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import AuthPage from "./pages/AuthPage";
import CategoriesPage from "./pages/CategoriesPage";
import FashionPage from "./pages/FashionPage";
import ElectronicsPage from "./pages/ElectronicsPage";
import HomeLivingPage from "./pages/HomeLivingPage";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import SportsOutdoorsPage from "./pages/SportsOutdoorsPage";
import AutomotivePage from "./pages/AutomotivePage";
import KidsHobbiesPage from "./pages/KidsHobbiesPage";
import EntertainmentPage from "./pages/EntertainmentPage";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import PayPalCheckout from "./pages/PayPalCheckout";
import PayPalHostedCheckout from "./pages/PayPalHostedCheckout";
import PayPalPayment from "./pages/PayPalPayment";
import DynamicPayPalCheckout from "./pages/DynamicPayPalCheckout";
import PayPalDepositPage from "./pages/PayPalDepositPage";
import DepositPage from "./pages/DepositPage";
import NFTPaymentPage from "./pages/NFTPaymentPage";
import TopUpPage from "./pages/TopUpPage";
import NetflixPage from "./pages/NetflixPage";
import TransferPage from "./pages/TransferPage";
import TransferHomePage from "./pages/TransferHomePage";
import ProductCommentsPage from "./pages/ProductCommentsPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import ProductQAPage from "./pages/ProductQAPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductEditNavigationPage from "./pages/ProductEditNavigationPage";
import ProductEditBasicPage from "./pages/ProductEditBasicPage";
import ProductEditCategoryPage from "./pages/ProductEditCategoryPage";
import ProductEditMediaPage from "./pages/ProductEditMediaPage";
import ProductEditShippingPage from "./pages/ProductEditShippingPage";
import ProductEditDealsPage from "./pages/ProductEditDealsPage";
import ProductEditSpecsPage from "./pages/ProductEditSpecsPage";
import ProductEditVariantsPage from "./pages/ProductEditVariantsPage";
import ProductEditNewVariantPage from "./pages/ProductEditNewVariantPage";
import ProductEditDetailsPage from "./pages/ProductEditDetailsPage";
import ProductEditDescriptionPage from "./pages/ProductEditDescriptionPage";
import ComponentTestPage from "./pages/ComponentTestPage";
import SellerDashboard from './pages/SellerDashboard';
import SellerPage from './pages/SellerPage';
import PickupStationDashboard from './pages/PickupStationDashboard';
import Explore from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Addresses from './pages/Addresses';
import Help from './pages/Help';
import MyStations from "./pages/MyStations";
import ProductsPage from "./pages/ProductsPage";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import CartPage from '@/pages/CartPage';
import MenuPage from '@/pages/MenuPage';

import "./App.css";

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
                    <AuthProvider>
                      <AuthOverlayProvider>
                        <ScreenOverlayProvider>
                          <HeaderFilterProvider>
                            <div className="App min-h-screen bg-background text-foreground">
                              <Routes>
                                <Route path="/" element={<MainLayout />}>
                                  {/* Homepage routes with caching */}
                                  <Route index element={
                                    <CachedRoute>
                                      <ConditionalHomepage />
                                    </CachedRoute>
                                  } />
                                  <Route path="for-you" element={
                                    <CachedRoute>
                                      <ConditionalHomepage />
                                    </CachedRoute>
                                  } />
                                  <Route path="index" element={
                                    <CachedRoute>
                                      <Index />
                                    </CachedRoute>
                                  } />

                                  {/* Search with specific cache key */}
                                  <Route path="search" element={
                                    <CachedRoute cacheKey="search-page">
                                      <SearchPage />
                                    </CachedRoute>
                                  } />

                                  {/* Product routes */}
                                  <Route path="product/:id" element={
                                    <CachedRoute>
                                      <ProductDetail />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:id/description" element={
                                    <CachedRoute>
                                      <ProductDescriptionPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:id/comments" element={
                                    <CachedRoute>
                                      <ProductCommentsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:id/reviews" element={
                                    <CachedRoute>
                                      <ProductReviewsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:id/qa" element={
                                    <CachedRoute>
                                      <ProductQAPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:id/ask-question" element={
                                    <CachedRoute>
                                      <AskQuestionPage />
                                    </CachedRoute>
                                  } />

                                  {/* Single product routes */}
                                  <Route path="single-product/:id" element={
                                    <CachedRoute>
                                      <SingleProductDetail />
                                    </CachedRoute>
                                  } />
                                  <Route path="single-product/:id/comments" element={
                                    <CachedRoute>
                                      <ProductCommentsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="single-product/:id/ask-question" element={
                                    <CachedRoute>
                                      <AskQuestionPage />
                                    </CachedRoute>
                                  } />

                                  {/* Content routes */}
                                  <Route path="posts" element={
                                    <CachedRoute>
                                      <CategoriesPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="videos" element={
                                    <CachedRoute>
                                      <Videos />
                                    </CachedRoute>
                                  } />
                                  <Route path="reels" element={
                                    <CachedRoute>
                                      <Reels />
                                    </CachedRoute>
                                  } />
                                  <Route path="reels/:mode" element={
                                    <CachedRoute>
                                      <Reels />
                                    </CachedRoute>
                                  } />
                                  <Route path="trending" element={
                                    <CachedRoute>
                                      <Trending />
                                    </CachedRoute>
                                  } />

                                  {/* Wallet & Messages */}
                                  <Route path="wallet" element={
                                    <CachedRoute>
                                      <Wallet />
                                    </CachedRoute>
                                  } />
                                  <Route path="messages" element={
                                    <CachedRoute>
                                      <Messages />
                                    </CachedRoute>
                                  } />
                                  <Route path="messages/:conversationId" element={
                                    <CachedRoute>
                                      <ConversationDetail />
                                    </CachedRoute>
                                  } />

                                  {/* Profile & Auth */}
                                  <Route path="profile/*" element={
                                    <CachedRoute>
                                      <ProfilePage />
                                    </CachedRoute>
                                  } />
                                  <Route path="more" element={
                                    <CachedRoute>
                                      <MoreMenu />
                                    </CachedRoute>
                                  } />
                                  <Route path="more-menu" element={
                                    <CachedRoute>
                                      <MoreMenu />
                                    </CachedRoute>
                                  } />
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

                                  {/* Categories */}
                                  <Route path="categories" element={
                                    <CachedRoute>
                                      <CategoriesPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/fashion" element={
                                    <CachedRoute>
                                      <FashionPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/electronics" element={
                                    <CachedRoute>
                                      <ElectronicsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/home-living" element={
                                    <CachedRoute>
                                      <HomeLivingPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/women" element={
                                    <CachedRoute>
                                      <WomenPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/men" element={
                                    <CachedRoute>
                                      <MenPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/books" element={
                                    <CachedRoute>
                                      <BooksHomepage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/sports-outdoors" element={
                                    <CachedRoute>
                                      <SportsOutdoorsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/automotive" element={
                                    <CachedRoute>
                                      <AutomotivePage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/kids-hobbies" element={
                                    <CachedRoute>
                                      <KidsHobbiesPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="categories/entertainment" element={
                                    <CachedRoute>
                                      <EntertainmentPage />
                                    </CachedRoute>
                                  } />

                                  {/* User features */}
                                  <Route path="explore" element={
                                    <CachedRoute>
                                      <Explore />
                                    </CachedRoute>
                                  } />
                                  <Route path="wishlist" element={
                                    <CachedRoute>
                                      <Wishlist />
                                    </CachedRoute>
                                  } />
                                  <Route path="notifications" element={
                                    <CachedRoute>
                                      <Notifications />
                                    </CachedRoute>
                                  } />
                                  <Route path="addresses" element={
                                    <CachedRoute>
                                      <Addresses />
                                    </CachedRoute>
                                  } />
                                  <Route path="help" element={
                                    <CachedRoute>
                                      <Help />
                                    </CachedRoute>
                                  } />
                                  <Route path="/my-stations" element={
                                    <CachedRoute>
                                      <MyStations />
                                    </CachedRoute>
                                  } />
                                  <Route path="/products" element={
                                    <CachedRoute>
                                      <ProductsPage />
                                    </CachedRoute>
                                  } />

                                  {/* Admin & Seller */}
                                  <Route path="admin" element={
                                    <CachedRoute>
                                      <AdminPanel />
                                    </CachedRoute>
                                  } />
                                  <Route path="admin-dashboard/*" element={
                                    <CachedRoute>
                                      <AdminDashboard />
                                    </CachedRoute>
                                  } />
                                  <Route path="/seller/:sellerId/*" element={
                                    <CachedRoute>
                                      <SellerPage />
                                    </CachedRoute>
                                  } />

                                  {/* Product Edit Routes */}
                                  <Route path="product/:productId/edit" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditNavigationPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/basic" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditBasicPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/category" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditCategoryPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/media" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditMediaPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/shipping" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditShippingPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/deals" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditDealsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/specifications" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditSpecsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/variants" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditVariantsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/variants/new" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditNewVariantPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/details" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditDetailsPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="product/:productId/edit/description" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductEditDescriptionPage />
                                    </CachedRoute>
                                  } />

                                  {/* Payment & Checkout - disable caching for sensitive pages */}
                                  <Route path="checkout" element={
                                    <CachedRoute shouldCache={false}>
                                      <Checkout />
                                    </CachedRoute>
                                  } />
                                  <Route path="product-checkout" element={
                                    <CachedRoute shouldCache={false}>
                                      <ProductCheckout />
                                    </CachedRoute>
                                  } />
                                  <Route path="paypal-checkout" element={
                                    <CachedRoute shouldCache={false}>
                                      <PayPalCheckout />
                                    </CachedRoute>
                                  } />
                                  <Route path="paypal-hosted-checkout" element={
                                    <CachedRoute shouldCache={false}>
                                      <PayPalHostedCheckout />
                                    </CachedRoute>
                                  } />
                                  <Route path="paypal-payment" element={
                                    <CachedRoute shouldCache={false}>
                                      <PayPalPayment />
                                    </CachedRoute>
                                  } />
                                  <Route path="dynamic-paypal-checkout" element={
                                    <CachedRoute shouldCache={false}>
                                      <DynamicPayPalCheckout />
                                    </CachedRoute>
                                  } />
                                  <Route path="paypal-deposit" element={
                                    <CachedRoute shouldCache={false}>
                                      <PayPalDepositPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="deposit" element={
                                    <CachedRoute shouldCache={false}>
                                      <DepositPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="nft-payment" element={
                                    <CachedRoute shouldCache={false}>
                                      <NFTPaymentPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="topup" element={
                                    <CachedRoute shouldCache={false}>
                                      <TopUpPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="netflix" element={
                                    <CachedRoute>
                                      <NetflixPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="transfer-old" element={
                                    <CachedRoute shouldCache={false}>
                                      <TransferPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="transfer" element={
                                    <CachedRoute shouldCache={false}>
                                      <TransferHomePage />
                                    </CachedRoute>
                                  } />

                                  {/* Other routes */}
                                  <Route path="component-test" element={
                                    <CachedRoute>
                                      <ComponentTestPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="signup" element={
                                    <CachedRoute shouldCache={false}>
                                      <SimpleAuthPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="auth/callback" element={
                                    <CachedRoute>
                                      <ForYou />
                                    </CachedRoute>
                                  } />
                                  <Route path="seller-dashboard/*" element={
                                    <CachedRoute>
                                      <SellerDashboard />
                                    </CachedRoute>
                                  } />
                                  <Route path="/seller/:sellerId/*" element={
                                    <CachedRoute>
                                      <SellerPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="/admin-dashboard/*" element={
                                    <CachedRoute>
                                      <AdminDashboard />
                                    </CachedRoute>
                                  } />
                                  <Route path="/pickup-station/*" element={
                                    <CachedRoute>
                                      <PickupStationDashboard />
                                    </CachedRoute>
                                  } />
                                  <Route path="/cart" element={
                                    <CachedRoute>
                                      <CartPage />
                                    </CachedRoute>
                                  } />
                                  <Route path="/menu" element={
                                    <CachedRoute>
                                      <MenuPage />
                                    </CachedRoute>
                                  } />

                                  {/* 404 */}
                                  <Route path="*" element={<NotFound />} />
                                </Route>
                              </Routes>
                              <Toaster />
                              <Sonner />
                            </div>
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

export default App;