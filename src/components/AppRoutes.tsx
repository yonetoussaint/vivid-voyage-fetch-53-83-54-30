import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { CategoryRoutes } from "../routes/CategoryRoutes";
import AddReviewPage from '@/pages/AddReviewPage';
import { ContentRoutes } from "../routes/ContentRoutes";
import { AuthRoutes } from "../routes/AuthRoutes";
import { MiscRoutes } from "../routes/MiscRoutes";
import MallPage from "@/pages/MallPage";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
import GasStationSystem from "@/pages/EasyPlus";
import ProfilePage from "@/pages/ProfilePage";
import Portfolio from "@/pages/Portfolio.tsx";
import ProductDetail from "@/pages/ProductDetail";
import Calculator from "@/pages/Calculator";
import Index from "@/pages/Index";
import ReviewsPage from "@/components/product/ReviewsPage";
import AuthCallback from "@/pages/AuthCallback";
import KGPattisseriePOS from "@/pages/KGPattiseriePOS";
import GasStationDailyChecklist from "@/pages/GasStationDailyChecklist";
import VendorPostComments from '@/components/home/VendorPostComments'; // Add this import

export function AppRoutes() {
  return (
    <Routes>
      {/* Google OAuth callback route - OUTSIDE MainLayout */}
      <Route
        path="auth/callback"
        element={<AuthCallback />}
      />
      
      <Route path="/product/:productId/add-review" element={<AddReviewPage />} />

      {/* Auth error route */}
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

      {/* KG Pâtisserie POS System */}
      <Route path="pos" element={<KGPattisseriePOS />} />

      {/* Gas Station System Routes */}
      <Route path="easy" element={<GasStationSystem />} />
      <Route path="daily-checklist" element={<GasStationDailyChecklist />} />

      {/* NEW ROUTE: Post Comments */}
      <Route path="comments" element={<VendorPostComments />} />
      {/* Alternative path if you prefer */}
      <Route path="post-comments" element={<VendorPostComments />} />

      {/* Product Detail Routes */}
      <Route path="product/:id/:tab" element={<ProductDetail />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="product/:id" element={<Navigate to="overview" replace />} />
      <Route path="calculator" element={<Calculator />} />

      {/* Reviews Pages */}
      <Route path="reviews/:reviewId" element={<ReviewsPage />} />
      <Route path="reviews" element={<ReviewsPage />} />

      {/* All other routes - INSIDE MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Index />} />
        <Route path="for-you" element={<Index />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile/*" element={<ProfilePage />} />
        
        {CategoryRoutes()}
        {ContentRoutes()}
        {AuthRoutes()}
        {MiscRoutes()}

        <Route path="mall" element={<MallPage />} />
      </Route>
    </Routes>
  );
}